const path = require("path");
const express = require("express");
const { dataDir, dbPath } = require("../db");
const { requireStaff } = require("../middleware/auth");
const { createBackup, getComplianceStatus } = require("../services/backup");

const router = express.Router();

router.use(requireStaff);

router.get("/compliance", (_req, res) => {
  res.json(getComplianceStatus(dataDir));
});

router.post("/", (_req, res) => {
  try {
    const result = createBackup({
      dataDir,
      dbPath,
      label: "kumon-rfid",
    });
    res.json({
      ok: true,
      ...result,
      absoluteBackupDir: path.resolve(result.backupDir),
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Backup failed" });
  }
});

router.get("/download/:name", (req, res) => {
  const name = path.basename(String(req.params.name || ""));
  if (!name || !/^[\w.\-]+$/.test(name) || (!name.endsWith(".sqlite") && !name.endsWith(".csv"))) {
    return res.status(400).json({ error: "Invalid backup file name" });
  }
  const full = path.join(dataDir, "backups", name);
  if (!full.startsWith(path.join(dataDir, "backups"))) {
    return res.status(400).json({ error: "Invalid path" });
  }
  res.download(full, name, (err) => {
    if (err && !res.headersSent) {
      res.status(404).json({ error: "Backup file not found" });
    }
  });
});

module.exports = router;
