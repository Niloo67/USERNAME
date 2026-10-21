const express = require("express");
const QRCode = require("qrcode");
const {
  listStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  nextStudentCode,
} = require("../db");

const router = express.Router();

function normalizeSubjects(input) {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input
      .map((s) => String(s).trim())
      .filter(Boolean)
      .filter((s, i, arr) => arr.indexOf(s) === i);
  }
  return String(input)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

router.get("/", (req, res) => {
  const q = String(req.query.q || "").trim();
  const includeInactive = req.query.includeInactive !== "false";
  res.json({ students: listStudents({ q, includeInactive }) });
});

router.get("/next-code", (_req, res) => {
  res.json({ studentCode: nextStudentCode() });
});

router.get("/qr.png", async (req, res) => {
  const code = String(req.query.code || "").trim();
  if (!code) {
    return res.status(400).type("text").send("Missing code");
  }
  try {
    const png = await QRCode.toBuffer(code, {
      type: "png",
      width: Number(req.query.size) || 180,
      margin: 1,
      errorCorrectionLevel: "M",
    });
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "no-store");
    res.send(png);
  } catch (err) {
    res.status(500).type("text").send(err.message || "QR failed");
  }
});

router.get("/:id", (req, res) => {
  const student = getStudentById(Number(req.params.id));
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }
  res.json({ student });
});

router.post("/", (req, res) => {
  try {
    const body = req.body || {};
    const student = createStudent({
      studentCode: body.studentCode,
      name: body.name,
      subjects: normalizeSubjects(body.subjects),
      parentPhone: body.parentPhone,
      parentEmail: body.parentEmail,
      active: body.active !== false,
    });
    res.status(201).json({ student });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || "Failed to create student" });
  }
});

router.put("/:id", (req, res) => {
  try {
    const body = req.body || {};
    const fields = { ...body };
    if (body.subjects !== undefined) {
      fields.subjects = normalizeSubjects(body.subjects);
    }
    const student = updateStudent(Number(req.params.id), fields);
    res.json({ student });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || "Failed to update student" });
  }
});

router.delete("/:id", (req, res) => {
  const ok = deleteStudent(Number(req.params.id));
  if (!ok) {
    return res.status(404).json({ error: "Student not found" });
  }
  res.json({ ok: true });
});

module.exports = router;
