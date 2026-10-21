const express = require("express");
const { getSetting, setSetting } = require("../db");
const { getEmailStatus } = require("../services/email");
const {
  requireStaff,
  verifyPin,
  staffPinConfigured,
  usingDefaultPin,
} = require("../middleware/auth");
const { getComplianceStatus } = require("../services/backup");
const { dataDir } = require("../db");

const router = express.Router();

router.get("/", (_req, res) => {
  const email = getEmailStatus();
  res.json({
    centreName: email.centreName,
    emailOnCheckin: email.emailOnCheckin,
    emailOnCheckout: email.emailOnCheckout,
    smtpConfigured: email.smtpConfigured,
    staffPinConfigured: staffPinConfigured(),
    usingDefaultPin: usingDefaultPin(),
    appTitle: "Kumon NDG – Check-In / Check-Out",
  });
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
  const email = getEmailStatus();
  res.json({
    centreName: email.centreName,
    emailOnCheckin: email.emailOnCheckin,
    emailOnCheckout: email.emailOnCheckout,
    smtpConfigured: email.smtpConfigured,
    staffPinConfigured: staffPinConfigured(),
    usingDefaultPin: usingDefaultPin(),
  });
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
