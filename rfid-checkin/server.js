require("dotenv").config();

const path = require("path");
const express = require("express");
const studentsRouter = require("./routes/students");
const attendanceRouter = require("./routes/attendance");
const exportRouter = require("./routes/export");
const settingsRouter = require("./routes/settings");

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, mode: "rfid" });
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
  console.log(`Kumon NDG – Check-In / Check-Out (RFID) at http://localhost:${PORT}`);
  console.log(`Tap USB RFID/NFC reader → browser checks students in/out`);
  console.log(`On centre Wi-Fi: http://<this-computer-ip>:${PORT}`);
});
