const express = require("express");
const { getSetting, setSetting } = require("../db");
const { getEmailStatus } = require("../services/email");

const router = express.Router();

router.get("/", (_req, res) => {
  const email = getEmailStatus();
  res.json({
    centreName: email.centreName,
    emailOnCheckin: email.emailOnCheckin,
    emailOnCheckout: email.emailOnCheckout,
    smtpConfigured: email.smtpConfigured,
    staffPinConfigured: Boolean(process.env.STAFF_PIN),
  });
});

router.put("/", (req, res) => {
  const body = req.body || {};
  if (body.centreName !== undefined) {
    setSetting("centre_name", String(body.centreName).trim() || "Kumon Learning Centre");
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
    staffPinConfigured: Boolean(process.env.STAFF_PIN),
  });
});

router.post("/verify-pin", (req, res) => {
  const expected = String(process.env.STAFF_PIN || "");
  const provided = String(req.body?.pin || "");
  if (!expected) {
    return res.json({ ok: true, warning: "STAFF_PIN is not set; access is open" });
  }
  if (provided === expected) {
    return res.json({ ok: true });
  }
  return res.status(401).json({ ok: false, error: "Incorrect PIN" });
});

module.exports = router;
