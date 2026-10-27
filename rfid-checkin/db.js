const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "kumon-rfid.sqlite");
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_code TEXT NOT NULL UNIQUE COLLATE NOCASE,
    name TEXT NOT NULL,
    subjects TEXT NOT NULL DEFAULT '[]',
    parent_phone TEXT NOT NULL DEFAULT '',
    parent_email TEXT NOT NULL DEFAULT '',
    tag_uid TEXT UNIQUE COLLATE NOCASE,
    is_staff INTEGER NOT NULL DEFAULT 0,
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL UNIQUE,
    checked_in_at TEXT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    student_code TEXT NOT NULL,
    student_name TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('check_in', 'check_out')),
    mode TEXT NOT NULL DEFAULT 'auto',
    timestamp TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    email_status TEXT NOT NULL DEFAULT 'skipped',
    email_detail TEXT NOT NULL DEFAULT '',
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// Migrations for older databases
const cols = db.prepare("PRAGMA table_info(students)").all().map((c) => c.name);
if (!cols.includes("tag_uid")) {
  db.exec("ALTER TABLE students ADD COLUMN tag_uid TEXT");
}
if (!cols.includes("is_staff")) {
  db.exec("ALTER TABLE students ADD COLUMN is_staff INTEGER NOT NULL DEFAULT 0");
}
db.exec(
  "CREATE UNIQUE INDEX IF NOT EXISTS idx_students_tag_uid ON students(tag_uid) WHERE tag_uid IS NOT NULL AND tag_uid != ''"
);

function normalizeTagUid(raw) {
  return String(raw || "")
    .trim()
    .replace(/\s+/g, "")
    .toUpperCase();
}

function getSetting(key, fallback = null) {
  const row = db.prepare("SELECT value FROM settings WHERE key = ?").get(key);
  return row ? row.value : fallback;
}

function setSetting(key, value) {
  db.prepare(
    `INSERT INTO settings (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`
  ).run(key, String(value));
}

function ensureDefaultSettings() {
  const defaults = {
    email_on_checkin: process.env.EMAIL_ON_CHECKIN !== "false" ? "true" : "false",
    email_on_checkout: process.env.EMAIL_ON_CHECKOUT !== "false" ? "true" : "false",
    centre_name: process.env.CENTRE_NAME || "Kumon NDG Learning Centre",
    accountant_email:
      process.env.ACCOUNTANT_EMAIL ||
      "Nassershayan@gmail.com, montreal-ndg@ikumon.com",
    staff_report_auto_weekly: process.env.STAFF_REPORT_AUTO_WEEKLY === "true" ? "true" : "false",
  };
  for (const [key, value] of Object.entries(defaults)) {
    if (getSetting(key) === null) {
      setSetting(key, value);
    }
  }
  // Ensure centre default recipients are present if the field was left blank
  if (!String(getSetting("accountant_email", "")).trim()) {
    setSetting("accountant_email", defaults.accountant_email);
  }
}

ensureDefaultSettings();

function parseSubjects(raw) {
  try {
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function mapStudent(row) {
  if (!row) return null;
  return {
    id: row.id,
    studentCode: row.student_code,
    name: row.name,
    subjects: parseSubjects(row.subjects),
    parentPhone: row.parent_phone || "",
    parentEmail: row.parent_email || "",
    tagUid: row.tag_uid || "",
    hasTag: Boolean(row.tag_uid),
    isStaff: Boolean(row.is_staff),
    active: Boolean(row.active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    checkedInAt: row.checked_in_at || null,
    isCheckedIn: Boolean(row.checked_in_at),
  };
}

function listStudents({ q = "", includeInactive = true } = {}) {
  const params = [];
  let sql = `
    SELECT s.*, sess.checked_in_at
    FROM students s
    LEFT JOIN sessions sess ON sess.student_id = s.id
    WHERE 1 = 1
  `;
  if (!includeInactive) {
    sql += " AND s.active = 1";
  }
  if (q) {
    sql += ` AND (
      s.name LIKE ? OR s.student_code LIKE ? OR s.parent_phone LIKE ?
      OR s.parent_email LIKE ? OR IFNULL(s.tag_uid,'') LIKE ?
    )`;
    const like = `%${q}%`;
    params.push(like, like, like, like, like);
  }
  sql += " ORDER BY s.name COLLATE NOCASE ASC";
  return db.prepare(sql).all(...params).map(mapStudent);
}

function getStudentById(id) {
  const row = db
    .prepare(
      `SELECT s.*, sess.checked_in_at
       FROM students s
       LEFT JOIN sessions sess ON sess.student_id = s.id
       WHERE s.id = ?`
    )
    .get(id);
  return mapStudent(row);
}

function getStudentByCode(code) {
  const row = db
    .prepare(
      `SELECT s.*, sess.checked_in_at
       FROM students s
       LEFT JOIN sessions sess ON sess.student_id = s.id
       WHERE s.student_code = ? COLLATE NOCASE`
    )
    .get(String(code || "").trim());
  return mapStudent(row);
}

function getStudentByTagUid(tagUid) {
  const uid = normalizeTagUid(tagUid);
  if (!uid) return null;
  const row = db
    .prepare(
      `SELECT s.*, sess.checked_in_at
       FROM students s
       LEFT JOIN sessions sess ON sess.student_id = s.id
       WHERE s.tag_uid = ? COLLATE NOCASE`
    )
    .get(uid);
  return mapStudent(row);
}

/** Resolve a tap/scan: RFID UID first, then student code (manual backup). */
function findStudentForTap(raw) {
  const value = String(raw || "").trim();
  if (!value) return null;
  const byTag = getStudentByTagUid(value);
  if (byTag) return { student: byTag, matchedBy: "tag" };
  const byCode = getStudentByCode(value);
  if (byCode) return { student: byCode, matchedBy: "code" };
  return null;
}

function createStudent({
  studentCode,
  name,
  subjects = [],
  parentPhone = "",
  parentEmail = "",
  tagUid = "",
  isStaff = false,
  active = true,
}) {
  const code = String(studentCode || "").trim();
  const studentName = String(name || "").trim();
  const uid = normalizeTagUid(tagUid) || null;
  if (!code || !studentName) {
    throw Object.assign(new Error("Student code and name are required"), { status: 400 });
  }
  try {
    const info = db
      .prepare(
        `INSERT INTO students (student_code, name, subjects, parent_phone, parent_email, tag_uid, is_staff, active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        code,
        studentName,
        JSON.stringify(subjects),
        String(parentPhone || "").trim(),
        String(parentEmail || "").trim(),
        uid,
        isStaff ? 1 : 0,
        active ? 1 : 0
      );
    return getStudentById(info.lastInsertRowid);
  } catch (err) {
    if (String(err.message).includes("UNIQUE")) {
      if (String(err.message).toLowerCase().includes("tag")) {
        throw Object.assign(new Error("That RFID/NFC tag is already linked to another student"), {
          status: 409,
        });
      }
      throw Object.assign(new Error("Student code already exists"), { status: 409 });
    }
    throw err;
  }
}

function updateStudent(id, fields) {
  const existing = getStudentById(id);
  if (!existing) {
    throw Object.assign(new Error("Student not found"), { status: 404 });
  }

  const next = {
    studentCode: fields.studentCode !== undefined ? String(fields.studentCode).trim() : existing.studentCode,
    name: fields.name !== undefined ? String(fields.name).trim() : existing.name,
    subjects: fields.subjects !== undefined ? fields.subjects : existing.subjects,
    parentPhone: fields.parentPhone !== undefined ? String(fields.parentPhone).trim() : existing.parentPhone,
    parentEmail: fields.parentEmail !== undefined ? String(fields.parentEmail).trim() : existing.parentEmail,
    tagUid:
      fields.tagUid !== undefined
        ? normalizeTagUid(fields.tagUid)
        : existing.tagUid,
    isStaff: fields.isStaff !== undefined ? Boolean(fields.isStaff) : existing.isStaff,
    active: fields.active !== undefined ? Boolean(fields.active) : existing.active,
  };

  if (!next.studentCode || !next.name) {
    throw Object.assign(new Error("Student code and name are required"), { status: 400 });
  }

  try {
    db.prepare(
      `UPDATE students
       SET student_code = ?, name = ?, subjects = ?, parent_phone = ?, parent_email = ?, tag_uid = ?,
           is_staff = ?, active = ?, updated_at = datetime('now', 'localtime')
       WHERE id = ?`
    ).run(
      next.studentCode,
      next.name,
      JSON.stringify(next.subjects || []),
      next.parentPhone,
      next.parentEmail,
      next.tagUid || null,
      next.isStaff ? 1 : 0,
      next.active ? 1 : 0,
      id
    );
  } catch (err) {
    if (String(err.message).includes("UNIQUE")) {
      if (String(err.message).toLowerCase().includes("tag")) {
        throw Object.assign(new Error("That RFID/NFC tag is already linked to another student"), {
          status: 409,
        });
      }
      throw Object.assign(new Error("Student code already exists"), { status: 409 });
    }
    throw err;
  }
  return getStudentById(id);
}

function assignTag(studentId, tagUid, { force = false } = {}) {
  const uid = normalizeTagUid(tagUid);
  if (!uid) {
    throw Object.assign(new Error("Tap a tag — no UID received"), { status: 400 });
  }
  const student = getStudentById(studentId);
  if (!student) {
    throw Object.assign(new Error("Student not found"), { status: 404 });
  }

  const existing = getStudentByTagUid(uid);
  let previousOwner = null;
  if (existing && existing.id !== Number(studentId)) {
    if (!force) {
      throw Object.assign(
        new Error(`Tag already linked to ${existing.name} (${existing.studentCode}). Unlink it first, or use Reassign.`),
        { status: 409, previousOwner: existing }
      );
    }
    previousOwner = existing;
    db.prepare(
      `UPDATE students SET tag_uid = NULL, updated_at = datetime('now', 'localtime') WHERE id = ?`
    ).run(existing.id);
  }

  db.prepare(
    `UPDATE students SET tag_uid = ?, updated_at = datetime('now', 'localtime') WHERE id = ?`
  ).run(uid, studentId);
  return { student: getStudentById(studentId), previousOwner };
}

function clearTag(studentId) {
  const student = getStudentById(studentId);
  if (!student) {
    throw Object.assign(new Error("Student not found"), { status: 404 });
  }
  db.prepare(
    `UPDATE students SET tag_uid = NULL, updated_at = datetime('now', 'localtime') WHERE id = ?`
  ).run(studentId);
  return getStudentById(studentId);
}

/** Soft-delete: deactivate + clear tag; keep attendance history (≥ 2 years). */
function deleteStudent(id) {
  const existing = getStudentById(id);
  if (!existing) return false;
  db.prepare("DELETE FROM sessions WHERE student_id = ?").run(id);
  const info = db
    .prepare(
      `UPDATE students
       SET active = 0, tag_uid = NULL, updated_at = datetime('now', 'localtime')
       WHERE id = ?`
    )
    .run(id);
  return info.changes > 0;
}

function listActiveSessions() {
  return db
    .prepare(
      `SELECT s.*, sess.checked_in_at
       FROM sessions sess
       JOIN students s ON s.id = sess.student_id
       ORDER BY sess.checked_in_at ASC`
    )
    .all()
    .map(mapStudent);
}

function insertLog({ studentId, studentCode, studentName, action, mode, emailStatus, emailDetail }) {
  const info = db
    .prepare(
      `INSERT INTO logs (student_id, student_code, student_name, action, mode, email_status, email_detail)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      studentId,
      studentCode,
      studentName,
      action,
      mode,
      emailStatus || "skipped",
      emailDetail || ""
    );
  return info.lastInsertRowid;
}

function checkInStudent(studentId) {
  const student = getStudentById(studentId);
  if (!student) {
    throw Object.assign(new Error("Student not found"), { status: 404 });
  }
  if (!student.active) {
    throw Object.assign(new Error("Student is inactive"), { status: 400 });
  }
  if (student.isCheckedIn) {
    throw Object.assign(new Error("Student is already checked in"), { status: 409 });
  }
  db.prepare(
    `INSERT INTO sessions (student_id, checked_in_at) VALUES (?, datetime('now', 'localtime'))`
  ).run(studentId);
  return getStudentById(studentId);
}

function checkOutStudent(studentId) {
  const student = getStudentById(studentId);
  if (!student) {
    throw Object.assign(new Error("Student not found"), { status: 404 });
  }
  if (!student.isCheckedIn) {
    throw Object.assign(new Error("Student is not checked in"), { status: 409 });
  }
  db.prepare("DELETE FROM sessions WHERE student_id = ?").run(studentId);
  return getStudentById(studentId);
}

function listLogs({ q = "", date = "", from = "", to = "", limit = 500 } = {}) {
  const params = [];
  let sql = `SELECT * FROM logs WHERE 1 = 1`;
  if (date) {
    sql += " AND date(timestamp) = date(?)";
    params.push(date);
  } else {
    if (from) {
      sql += " AND date(timestamp) >= date(?)";
      params.push(from);
    }
    if (to) {
      sql += " AND date(timestamp) <= date(?)";
      params.push(to);
    }
  }
  if (q) {
    sql += " AND (student_name LIKE ? OR student_code LIKE ?)";
    const like = `%${q}%`;
    params.push(like, like);
  }
  const lim = Math.min(Math.max(Number(limit) || 500, 1), 100000);
  sql += " ORDER BY timestamp DESC, id DESC LIMIT ?";
  params.push(lim);
  return db.prepare(sql).all(...params).map((row) => ({
    id: row.id,
    studentId: row.student_id,
    studentCode: row.student_code,
    studentName: row.student_name,
    action: row.action,
    mode: row.mode,
    timestamp: row.timestamp,
    emailStatus: row.email_status,
    emailDetail: row.email_detail,
  }));
}

function getRetentionInfo() {
  const row = db
    .prepare(
      `SELECT MIN(timestamp) AS oldest, MAX(timestamp) AS newest, COUNT(*) AS count FROM logs`
    )
    .get();
  let daysOfHistory = null;
  if (row?.oldest && row?.newest) {
    const a = new Date(String(row.oldest).replace(" ", "T")).getTime();
    const b = new Date(String(row.newest).replace(" ", "T")).getTime();
    if (!Number.isNaN(a) && !Number.isNaN(b)) {
      daysOfHistory = Math.max(0, Math.floor((b - a) / (24 * 60 * 60 * 1000)));
    }
  }
  return {
    oldestLog: row?.oldest || null,
    newestLog: row?.newest || null,
    logCount: row?.count || 0,
    daysOfHistory,
  };
}

function listDirectoryStudents() {
  return listStudents({ includeInactive: false }).map((s) => ({
    id: s.id,
    studentCode: s.studentCode,
    name: s.name,
    subjects: s.subjects,
    active: s.active,
    isStaff: s.isStaff,
    checkedInAt: s.checkedInAt,
    isCheckedIn: s.isCheckedIn,
    tagLinked: Boolean(s.tagUid),
  }));
}

/** Monday–Sunday (local) containing referenceDate, or previous full week if forPreviousWeek. */
function getWeekRange({ forPreviousWeek = false, referenceDate = new Date() } = {}) {
  const d = new Date(referenceDate);
  d.setHours(12, 0, 0, 0);
  const day = d.getDay(); // 0 Sun … 6 Sat
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + mondayOffset);
  if (forPreviousWeek) {
    monday.setDate(monday.getDate() - 7);
  }
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const toYmd = (x) => {
    const y = x.getFullYear();
    const m = String(x.getMonth() + 1).padStart(2, "0");
    const dd = String(x.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };
  return { from: toYmd(monday), to: toYmd(sunday) };
}

function listStaffLogs({ from, to } = {}) {
  const range = from && to ? { from, to } : getWeekRange({ forPreviousWeek: true });
  const rows = db
    .prepare(
      `SELECT l.*
       FROM logs l
       INNER JOIN students s ON s.id = l.student_id
       WHERE s.is_staff = 1
         AND date(l.timestamp) >= date(?)
         AND date(l.timestamp) <= date(?)
       ORDER BY l.timestamp ASC, l.id ASC`
    )
    .all(range.from, range.to);
  return {
    from: range.from,
    to: range.to,
    logs: rows.map((row) => ({
      id: row.id,
      studentId: row.student_id,
      studentCode: row.student_code,
      studentName: row.student_name,
      action: row.action,
      mode: row.mode,
      timestamp: row.timestamp,
    })),
  };
}

function nextStudentCode() {
  const row = db
    .prepare(
      `SELECT student_code FROM students
       WHERE student_code GLOB 'K-[0-9]*'
       ORDER BY CAST(substr(student_code, 3) AS INTEGER) DESC
       LIMIT 1`
    )
    .get();
  const nextNum = row ? Number(String(row.student_code).slice(2)) + 1 : 1;
  return `K-${String(nextNum).padStart(4, "0")}`;
}

module.exports = {
  db,
  dbPath,
  dataDir,
  normalizeTagUid,
  getSetting,
  setSetting,
  listStudents,
  listDirectoryStudents,
  getStudentById,
  getStudentByCode,
  getStudentByTagUid,
  findStudentForTap,
  createStudent,
  updateStudent,
  assignTag,
  clearTag,
  deleteStudent,
  listActiveSessions,
  insertLog,
  checkInStudent,
  checkOutStudent,
  listLogs,
  listStaffLogs,
  getWeekRange,
  getRetentionInfo,
  nextStudentCode,
};
