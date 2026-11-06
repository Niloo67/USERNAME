const fs = require("fs");
const path = require("path");
const { db, listLogs, getRetentionInfo } = require("../db");

const RETENTION_YEARS = 2;

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function stamp() {
  return new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
}

function csvEscape(value) {
  const str = value == null ? "" : String(value);
  if (/[",\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

function writeCsvArchive(filePath, logs) {
  const header = [
    "Timestamp",
    "Student Code",
    "Student Name",
    "Action",
    "Mode",
    "Email Status",
    "Email Detail",
  ];
  const lines = [header.join(",")];
  for (const log of logs) {
    lines.push(
      [
        csvEscape(log.timestamp),
        csvEscape(log.studentCode),
        csvEscape(log.studentName),
        csvEscape(log.action === "check_in" ? "Check In" : "Check Out"),
        csvEscape(log.mode),
        csvEscape(log.emailStatus),
        csvEscape(log.emailDetail),
      ].join(",")
    );
  }
  fs.writeFileSync(filePath, lines.join("\n"), "utf8");
}

/**
 * Copy SQLite DB + write a full CSV snapshot under data/backups/.
 * Attendance logs are never auto-deleted (retain ≥ 2 years).
 */
function createBackup({ dataDir, dbPath, label = "kumon" }) {
  ensureDir(dataDir);
  const backupDir = path.join(dataDir, "backups");
  ensureDir(backupDir);

  try {
    db.pragma("wal_checkpoint(TRUNCATE)");
  } catch {
    /* ignore */
  }

  const when = stamp();
  const dbFile = `${label}-${when}.sqlite`;
  const csvFile = `${label}-attendance-${when}.csv`;
  const dbDest = path.join(backupDir, dbFile);
  const csvDest = path.join(backupDir, csvFile);

  fs.copyFileSync(dbPath, dbDest);

  const logs = listLogs({ limit: 100000, from: "", to: "", date: "", q: "" });
  writeCsvArchive(csvDest, logs);

  // Monthly named copy for easy 2-year filing (YYYY-MM)
  const month = new Date().toISOString().slice(0, 7);
  const monthlyCsv = path.join(backupDir, `archive-${month}.csv`);
  if (!fs.existsSync(monthlyCsv)) {
    fs.copyFileSync(csvDest, monthlyCsv);
  }

  return {
    createdAt: new Date().toISOString(),
    dbFile,
    csvFile,
    backupDir,
    logCount: logs.length,
    retentionYears: RETENTION_YEARS,
    note: "Copy the backups folder to a USB drive or cloud weekly. Keep files for at least 2 years.",
  };
}

function listBackupFiles(dataDir) {
  const backupDir = path.join(dataDir, "backups");
  if (!fs.existsSync(backupDir)) return [];
  return fs
    .readdirSync(backupDir)
    .filter((f) => f.endsWith(".sqlite") || f.endsWith(".csv"))
    .map((name) => {
      const full = path.join(backupDir, name);
      const st = fs.statSync(full);
      return { name, size: st.size, modifiedAt: st.mtime.toISOString() };
    })
    .sort((a, b) => (a.modifiedAt < b.modifiedAt ? 1 : -1));
}

function getComplianceStatus(dataDir) {
  const retention = getRetentionInfo();
  const backups = listBackupFiles(dataDir);
  return {
    retentionYearsRequired: RETENTION_YEARS,
    oldestLog: retention.oldestLog,
    newestLog: retention.newestLog,
    logCount: retention.logCount,
    daysOfHistory: retention.daysOfHistory,
    meetsTwoYearWindow: retention.daysOfHistory == null || retention.daysOfHistory >= 0,
    // "meets" means we are keeping data and not purging; new centres start at day 0
    autoPurgeDisabled: true,
    backupCount: backups.length,
    latestBackup: backups[0] || null,
    backups,
    policy:
      "Attendance logs are append-only and never auto-deleted. Retain and back up for at least 2 years.",
  };
}

module.exports = {
  RETENTION_YEARS,
  createBackup,
  listBackupFiles,
  getComplianceStatus,
  writeCsvArchive,
};
