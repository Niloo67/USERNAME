const express = require("express");
const {
  getStudentById,
  findStudentForTap,
  listActiveSessions,
  checkInStudent,
  checkOutStudent,
  insertLog,
  listLogs,
} = require("../db");
const { notifyParent } = require("../services/email");
const { requireStaff } = require("../middleware/auth");
const { toPublicStudent, scrubAttendanceResult } = require("../lib/pii");

const router = express.Router();

const recentScans = new Map();
const DEBOUNCE_MS = 2500;

function pruneDebounce() {
  const now = Date.now();
  for (const [key, ts] of recentScans.entries()) {
    if (now - ts > DEBOUNCE_MS * 4) recentScans.delete(key);
  }
}

function isDuplicate(studentCode, action) {
  pruneDebounce();
  const key = `${String(studentCode).toUpperCase()}::${action}`;
  const last = recentScans.get(key);
  if (last && Date.now() - last < DEBOUNCE_MS) {
    return true;
  }
  recentScans.set(key, Date.now());
  return false;
}

function resolveMode(raw) {
  const mode = String(raw || "auto").toLowerCase();
  if (mode === "check_in" || mode === "force_in" || mode === "in") return "force_in";
  if (mode === "check_out" || mode === "force_out" || mode === "out") return "force_out";
  return "auto";
}

async function performAttendance({ student, mode }) {
  let action;
  if (mode === "force_in") {
    action = "check_in";
  } else if (mode === "force_out") {
    action = "check_out";
  } else if (student.isCheckedIn) {
    action = "check_out";
  } else {
    action = "check_in";
  }

  if (isDuplicate(student.studentCode, action)) {
    const err = new Error("Duplicate tap ignored — wait a moment and try again");
    err.status = 429;
    err.code = "debounce";
    throw err;
  }

  const updated =
    action === "check_in" ? checkInStudent(student.id) : checkOutStudent(student.id);

  const timestamp = new Date().toLocaleString();
  const emailResult = await notifyParent({
    student: updated,
    action,
    timestamp,
  });

  insertLog({
    studentId: updated.id,
    studentCode: updated.studentCode,
    studentName: updated.name,
    action,
    mode,
    emailStatus: emailResult.status,
    emailDetail: emailResult.detail,
  });

  return {
    student: updated,
    action,
    mode,
    email: emailResult,
    message:
      action === "check_in"
        ? `${updated.name} checked in`
        : `${updated.name} checked out`,
  };
}

router.get("/active", (_req, res) => {
  res.json({ students: listActiveSessions().map(toPublicStudent) });
});

router.get("/logs", requireStaff, (req, res) => {
  const q = String(req.query.q || "").trim();
  const date = String(req.query.date || "").trim();
  const from = String(req.query.from || "").trim();
  const to = String(req.query.to || "").trim();
  const limit = Number(req.query.limit) || 2000;
  res.json({ logs: listLogs({ q, date, from, to, limit }) });
});

router.post("/scan", async (req, res) => {
  try {
    const code = String(req.body?.code || req.body?.tagUid || req.body?.studentCode || "").trim();
    if (!code) {
      return res.status(400).json({ error: "Tap a tag (or enter a student ID)" });
    }

    const matched = findStudentForTap(code);
    if (!matched) {
      return res.status(404).json({
        error: `No student linked to tag/ID "${code}". Enroll this tag on the Roster page first.`,
        unmatchedUid: code,
      });
    }
    if (!matched.student.active) {
      return res.status(400).json({ error: `${matched.student.name} is inactive` });
    }

    const mode = resolveMode(req.body?.mode);
    const result = await performAttendance({ student: matched.student, mode });
    result.matchedBy = matched.matchedBy;
    res.json(scrubAttendanceResult(result));
  } catch (err) {
    res.status(err.status || 500).json({
      error: err.message || "Tap failed",
      code: err.code || undefined,
    });
  }
});

router.post("/check-in", async (req, res) => {
  try {
    const student = resolveStudent(req.body);
    const result = await performAttendance({ student, mode: "force_in" });
    res.json(scrubAttendanceResult(result));
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || "Check-in failed" });
  }
});

router.post("/check-out", async (req, res) => {
  try {
    const student = resolveStudent(req.body);
    const result = await performAttendance({ student, mode: "force_out" });
    res.json(scrubAttendanceResult(result));
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || "Check-out failed" });
  }
});

function resolveStudent(body) {
  if (body?.studentId) {
    const student = getStudentById(Number(body.studentId));
    if (!student) {
      throw Object.assign(new Error("Student not found"), { status: 404 });
    }
    if (!student.active) {
      throw Object.assign(new Error("Student is inactive"), { status: 400 });
    }
    return student;
  }
  const code = String(body?.code || body?.tagUid || body?.studentCode || "").trim();
  if (!code) {
    throw Object.assign(new Error("Tag UID, student code, or id is required"), { status: 400 });
  }
  const matched = findStudentForTap(code);
  if (!matched) {
    throw Object.assign(new Error(`No student found for "${code}"`), { status: 404 });
  }
  if (!matched.student.active) {
    throw Object.assign(new Error("Student is inactive"), { status: 400 });
  }
  return matched.student;
}

module.exports = router;
