require("dotenv").config();

const path = require("path");
const express = require("express");
const studentsRouter = require("./routes/students");
const attendanceRouter = require("./routes/attendance");
const exportRouter = require("./routes/export");
const settingsRouter = require("./routes/settings");

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/students", studentsRouter);
app.use("/api", attendanceRouter);
app.use("/api/export", exportRouter);
app.use("/api/settings", settingsRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Kumon NDG – Check-In / Check-Out (QR) at http://localhost:${PORT}`);
  console.log(`On the centre Wi-Fi, open http://<this-computer-ip>:${PORT}`);
});
