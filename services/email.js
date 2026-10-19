const nodemailer = require("nodemailer");
const { getSetting } = require("../db");

function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function createTransporter() {
  if (!smtpConfigured()) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

let transporter = null;

function getTransporter() {
  if (!smtpConfigured()) return null;
  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
}

function shouldEmailForAction(action) {
  if (action === "check_in") {
    return getSetting("email_on_checkin", "true") === "true";
  }
  if (action === "check_out") {
    return getSetting("email_on_checkout", "true") === "true";
  }
  return false;
}

/**
 * Attempt to email a parent. Never throws — returns status for logging.
 * @returns {{ status: 'sent'|'skipped'|'failed', detail: string }}
 */
async function notifyParent({ student, action, timestamp }) {
  if (!shouldEmailForAction(action)) {
    return { status: "skipped", detail: "Email disabled for this action" };
  }

  const to = String(student.parentEmail || "").trim();
  if (!to) {
    return { status: "skipped", detail: "No parent email on file" };
  }

  const transport = getTransporter();
  if (!transport) {
    return { status: "skipped", detail: "SMTP not configured" };
  }

  const centreName = getSetting("centre_name", process.env.CENTRE_NAME || "Kumon Learning Centre");
  const actionLabel = action === "check_in" ? "checked in" : "checked out";
  const when = timestamp || new Date().toLocaleString();
  const subject = `${student.name} ${actionLabel} at ${centreName}`;
  const text = [
    `Hello,`,
    ``,
    `${student.name} (${student.studentCode}) has ${actionLabel} at ${centreName}.`,
    ``,
    `Time: ${when}`,
    ``,
    `This is an automated message from the centre check-in system.`,
  ].join("\n");

  const fromName = process.env.SMTP_FROM_NAME || centreName;
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

  try {
    const info = await transport.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      text,
    });
    return { status: "sent", detail: info.messageId || "OK" };
  } catch (err) {
    return { status: "failed", detail: err.message || "Send failed" };
  }
}

function getEmailStatus() {
  return {
    smtpConfigured: smtpConfigured(),
    emailOnCheckin: getSetting("email_on_checkin", "true") === "true",
    emailOnCheckout: getSetting("email_on_checkout", "true") === "true",
    centreName: getSetting("centre_name", process.env.CENTRE_NAME || "Kumon Learning Centre"),
  };
}

module.exports = {
  notifyParent,
  getEmailStatus,
  smtpConfigured,
};
