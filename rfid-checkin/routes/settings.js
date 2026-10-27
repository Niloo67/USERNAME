const express = require("express");
const { getSetting, setSetting, dataDir } = require("../db");
const { getEmailStatus } = require("../services/email");
const {
  requireStaff,
  verifyPin,
  staffPinConfigured,
  usingDefaultPin,
} = require("../middleware/auth");
const { getComplianceStatus } = require("../services/backup");

const router = express.Router();

function settingsPayload() {
  const email = getEmailStatus();
  return {
    centreName: email.centreName,
    emailOnCheckin: email.emailOnCheckin,
    emailOnCheckout: email.emailOnCheckout,
    smtpConfigured: email.smtpConfigured,
    accountantEmail: email.accountantEmail,
    staffReportAutoWeekly: email.staffReportAutoWeekly,
    lastStaffReportSent: email.lastStaffReportSent,
    backupCloudFolder: getSetting("backup_cloud_folder", process.env.BACKUP_CLOUD_FOLDER || ""),
    autoBackupDaily: getSetting("auto_backup_daily", "true") === "true",
    lastBackupAt: getSetting("last_backup_at", ""),
    staffPinConfigured: staffPinConfigured(),
    usingDefaultPin: usingDefaultPin(),
    appTitle: "Kumon NDG – Check-In / Check-Out",
  };
}

router.get("/", (_req, res) => {
  res.json(settingsPayload());
});

router.get("/compliance", requireStaff, (_req, res) => {
  res.json(getComplianceStatus(dataDir));
});

router.put("/", requireStaff, (req, res) => {
  const body = req.body || {};
  if (body.centreName !== undefined) {
    setSetting("centre_name", String(body.centreName).trim() || "Kumon NDG Learning Centre");
  }
  if (body.emailOnCheckin !== undefined) {
    setSetting("email_on_checkin", body.emailOnCheckin ? "true" : "false");
  }
  if (body.emailOnCheckout !== undefined) {
    setSetting("email_on_checkout", body.emailOnCheckout ? "true" : "false");
  }
  if (body.accountantEmail !== undefined) {
    setSetting("accountant_email", String(body.accountantEmail || "").trim());
  }
  if (body.staffReportAutoWeekly !== undefined) {
    setSetting("staff_report_auto_weekly", body.staffReportAutoWeekly ? "true" : "false");
  }
  if (body.backupCloudFolder !== undefined) {
    setSetting("backup_cloud_folder", String(body.backupCloudFolder || "").trim());
  }
  if (body.autoBackupDaily !== undefined) {
    setSetting("auto_backup_daily", body.autoBackupDaily ? "true" : "false");
  }
  res.json(settingsPayload());
});

router.post("/verify-pin", (req, res) => {
  const result = verifyPin(req.body?.pin, req);
  if (!result.ok) {
    return res.status(result.status || 401).json({
      ok: false,
      error: result.error || "Incorrect PIN",
    });
  }
  return res.json({
    ok: true,
    token: result.token,
    warning: result.warning,
    defaultPinWarning: result.defaultPinWarning,
  });
});

module.exports = router;
