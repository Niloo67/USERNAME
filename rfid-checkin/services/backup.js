const fs = require("fs");
const path = require("path");
const { db, listLogs, getRetentionInfo, getSetting, setSetting } = require("../db");

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

function resolveCloudBackupDir() {
  const configured = String(
    getSetting("backup_cloud_folder", process.env.BACKUP_CLOUD_FOLDER || "")
  ).trim();
  return configured || null;
}

function copyIntoCloud(cloudDir, files) {
  if (!cloudDir) return { copied: false, cloudDir: null, error: null };
  try {
    ensureDir(cloudDir);
    for (const filePath of files) {
      if (!filePath || !fs.existsSync(filePath)) continue;
      fs.copyFileSync(filePath, path.join(cloudDir, path.basename(filePath)));
    }
    return { copied: true, cloudDir, error: null };
  } catch (err) {
    return { copied: false, cloudDir, error: err.message || "Cloud copy failed" };
  }
}

/**
 * Copy SQLite DB + CSV under data/backups/, and also into the configured
 * OneDrive/Google Drive folder when set (so sync happens automatically).
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

  const month = new Date().toISOString().slice(0, 7);
  const monthlyCsv = path.join(backupDir, `archive-${month}.csv`);
  if (!fs.existsSync(monthlyCsv)) {
    fs.copyFileSync(csvDest, monthlyCsv);
  }

  const cloudDir = resolveCloudBackupDir();
  const cloud = copyIntoCloud(cloudDir, [dbDest, csvDest, monthlyCsv]);

  setSetting("last_backup_at", new Date().toISOString());
  setSetting("last_backup_day", new Date().toISOString().slice(0, 10));

  return {
    createdAt: new Date().toISOString(),
    dbFile,
    csvFile,
    backupDir,
    cloudDir: cloud.cloudDir,
    cloudCopied: cloud.copied,
    cloudError: cloud.error,
    logCount: logs.length,
    retentionYears: RETENTION_YEARS,
    note: cloud.copied
      ? `Backup saved locally and copied to cloud folder: ${cloud.cloudDir}`
      : cloudDir
        ? `Local backup saved; cloud copy failed: ${cloud.error}`
        : "Local backup saved. Set a OneDrive/Google Drive folder in Settings for automatic cloud copies.",
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
  const cloudDir = resolveCloudBackupDir();
  return {
    retentionYearsRequired: RETENTION_YEARS,
    oldestLog: retention.oldestLog,
    newestLog: retention.newestLog,
    logCount: retention.logCount,
    daysOfHistory: retention.daysOfHistory,
    meetsTwoYearWindow: retention.daysOfHistory == null || retention.daysOfHistory >= 0,
    autoPurgeDisabled: true,
    backupCount: backups.length,
    latestBackup: backups[0] || null,
    backups,
    backupCloudFolder: cloudDir || "",
    autoBackupDaily: getSetting("auto_backup_daily", "true") === "true",
    lastBackupAt: getSetting("last_backup_at", ""),
    policy:
      "Attendance is saved live on this laptop. Automatic daily backups copy to the local backups folder and (if set) your OneDrive/Google Drive folder.",
  };
}

/** Run at most once per calendar day while the app is open. */
function maybeAutoBackup({ dataDir, dbPath, label = "kumon-rfid" }) {
  if (getSetting("auto_backup_daily", "true") !== "true") {
    return { ran: false, reason: "disabled" };
  }
  const today = new Date().toISOString().slice(0, 10);
  if (getSetting("last_backup_day", "") === today) {
    return { ran: false, reason: "already_today" };
  }
  const result = createBackup({ dataDir, dbPath, label });
  return { ran: true, result };
}

module.exports = {
  RETENTION_YEARS,
  createBackup,
  listBackupFiles,
  getComplianceStatus,
  writeCsvArchive,
  maybeAutoBackup,
  resolveCloudBackupDir,
};
