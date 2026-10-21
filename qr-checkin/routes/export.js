const express = require("express");
const { listLogs } = require("../db");

const router = express.Router();

function csvEscape(value) {
  const str = value == null ? "" : String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

router.get("/csv", (req, res) => {
  const q = String(req.query.q || "").trim();
  const date = String(req.query.date || "").trim();
  const logs = listLogs({ q, date, limit: 5000 });

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

  const filename = date ? `attendance-${date}.csv` : "attendance-export.csv";
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send(lines.join("\n"));
});

module.exports = router;
