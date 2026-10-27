const nodemailer = require("nodemailer");
const { getSetting } = require("../db");

/** Default weekly staff report recipients: accountant + Kumon NDG */
const DEFAULT_STAFF_REPORT_EMAILS =
  "Nassershayan@gmail.com, montreal-ndg@ikumon.com";

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
  if (student?.isStaff) {
    return { status: "skipped", detail: "Staff punch — no parent email" };
  }

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

  const centreName = getSetting("centre_name", process.env.CENTRE_NAME || "Kumon NDG Learning Centre");
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
    centreName: getSetting("centre_name", process.env.CENTRE_NAME || "Kumon NDG Learning Centre"),
    accountantEmail: getSetting(
      "accountant_email",
      process.env.ACCOUNTANT_EMAIL || DEFAULT_STAFF_REPORT_EMAILS
    ),
    staffReportAutoWeekly: getSetting("staff_report_auto_weekly", "false") === "true",
    lastStaffReportSent: getSetting("last_staff_report_sent", ""),
  };
}

function staffLogsToCsv(logs) {
  const header = ["Timestamp", "Staff Name", "Staff ID", "Action", "Mode"];
  const lines = [header.join(",")];
  for (const log of logs) {
    const cells = [
      log.timestamp,
      log.studentName,
      log.studentCode,
      log.action === "check_in" ? "Check In" : "Check Out",
      log.mode,
    ].map((v) => {
      const str = v == null ? "" : String(v);
      return /[",\n\r]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
    });
    lines.push(cells.join(","));
  }
  return lines.join("\n");
}

/**
 * Email accountant a CSV of staff punches for a week.
 * @returns {{ status: 'sent'|'skipped'|'failed', detail: string, from?: string, to?: string, count?: number }}
 */
function parseEmailList(raw) {
  return String(raw || "")
    .split(/[,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

async function sendStaffWeekReport({ from, to, logs, overrideTo } = {}) {
  const raw = String(
    overrideTo ||
      getSetting("accountant_email", process.env.ACCOUNTANT_EMAIL || DEFAULT_STAFF_REPORT_EMAILS)
  ).trim();
  const recipients = parseEmailList(raw);
  if (!recipients.length) {
    return { status: "skipped", detail: "No accountant / centre email configured" };
  }
  const recipient = recipients.join(", ");
  const transport = getTransporter();
  if (!transport) {
    return { status: "skipped", detail: "SMTP not configured" };
  }

  const centreName = getSetting("centre_name", process.env.CENTRE_NAME || "Kumon NDG Learning Centre");
  const csv = staffLogsToCsv(logs || []);
  const count = (logs || []).length;
  const fromName = process.env.SMTP_FROM_NAME || centreName;
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;
  const subject = `Staff attendance ${from} to ${to} — ${centreName}`;
  const text = [
    `Hello,`,
    ``,
    `Attached is the staff check-in / check-out report for ${centreName}.`,
    `Period: ${from} → ${to}`,
    `Entries: ${count}`,
    ``,
    `Sent to: ${recipient}`,
    ``,
    `This is an automated message from the centre check-in system.`,
  ].join("\n");

  try {
    const info = await transport.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: recipients,
      subject,
      text,
      attachments: [
        {
          filename: `staff-attendance-${from}_to_${to}.csv`,
          content: csv,
          contentType: "text/csv",
        },
      ],
    });
    return {
      status: "sent",
      detail: info.messageId || "OK",
      from,
      to,
      recipient,
      recipients,
      count,
    };
  } catch (err) {
    return {
      status: "failed",
      detail: err.message || "Send failed",
      from,
      to,
      recipient,
      recipients,
      count,
    };
  }
}

module.exports = {
  notifyParent,
  getEmailStatus,
  smtpConfigured,
  sendStaffWeekReport,
  staffLogsToCsv,
};
