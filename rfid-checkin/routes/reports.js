const express = require("express");
const { listStaffLogs, getWeekRange, getSetting, setSetting } = require("../db");
const { requireStaff } = require("../middleware/auth");
const { sendStaffWeekReport, staffLogsToCsv } = require("../services/email");

const router = express.Router();

router.use(requireStaff);

router.get("/staff-week", (req, res) => {
  const forPreviousWeek = req.query.week !== "current";
  const range = getWeekRange({ forPreviousWeek });
  const from = String(req.query.from || range.from);
  const to = String(req.query.to || range.to);
  const { logs } = listStaffLogs({ from, to });
  res.json({
    from,
    to,
    count: logs.length,
    logs,
    accountantEmail: getSetting("accountant_email", ""),
    lastStaffReportSent: getSetting("last_staff_report_sent", ""),
  });
});

router.get("/staff-week.csv", (req, res) => {
  const forPreviousWeek = req.query.week !== "current";
  const range = getWeekRange({ forPreviousWeek });
  const from = String(req.query.from || range.from);
  const to = String(req.query.to || range.to);
  const { logs } = listStaffLogs({ from, to });
  const csv = staffLogsToCsv(logs);
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="staff-attendance-${from}_to_${to}.csv"`
  );
  res.send(csv);
});

router.post("/staff-week/email", async (req, res) => {
  try {
    const forPreviousWeek = req.body?.week !== "current";
    const range = getWeekRange({ forPreviousWeek });
    const from = String(req.body?.from || range.from);
    const to = String(req.body?.to || range.to);
    const { logs } = listStaffLogs({ from, to });
    const result = await sendStaffWeekReport({
      from,
      to,
      logs,
      overrideTo: req.body?.toEmail,
    });
    if (result.status === "sent") {
      setSetting("last_staff_report_sent", new Date().toISOString());
      setSetting("last_staff_report_week", `${from}_${to}`);
    }
    const status = result.status === "sent" ? 200 : result.status === "skipped" ? 400 : 500;
    res.status(status).json(result);
  } catch (err) {
    res.status(500).json({ status: "failed", detail: err.message || "Report failed" });
  }
});

module.exports = router;
