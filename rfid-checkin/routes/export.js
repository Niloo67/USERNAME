const express = require("express");
const { listLogs } = require("../db");
const { requireStaff } = require("../middleware/auth");

const router = express.Router();

function csvEscape(value) {
  const str = value == null ? "" : String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

router.get("/csv", requireStaff, (req, res) => {
  const q = String(req.query.q || "").trim();
  const date = String(req.query.date || "").trim();
  const from = String(req.query.from || "").trim();
  const to = String(req.query.to || "").trim();
  const logs = listLogs({ q, date, from, to, limit: 100000 });

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

  let filename = "attendance-export.csv";
  if (date) filename = `attendance-${date}.csv`;
  else if (from || to) filename = `attendance-${from || "start"}_to_${to || "end"}.csv`;

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send(lines.join("\n"));
});

module.exports = router;
