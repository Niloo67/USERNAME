const express = require("express");
const {
  listStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  nextStudentCode,
  assignTag,
  clearTag,
  normalizeTagUid,
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
      tagUid: body.tagUid,
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
    if (body.tagUid !== undefined) {
      fields.tagUid = normalizeTagUid(body.tagUid);
    }
    const student = updateStudent(Number(req.params.id), fields);
    res.json({ student });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || "Failed to update student" });
  }
});

router.post("/:id/assign-tag", (req, res) => {
  try {
    const tagUid = req.body?.tagUid || req.body?.code;
    const force = Boolean(req.body?.force || req.body?.reassign);
    const { student, previousOwner } = assignTag(Number(req.params.id), tagUid, { force });
    res.json({
      student,
      previousOwner,
      message: previousOwner
        ? `Tag moved from ${previousOwner.name} → ${student.name}`
        : `Tag linked to ${student.name}`,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      error: err.message || "Failed to assign tag",
      previousOwner: err.previousOwner || undefined,
    });
  }
});

router.delete("/:id/tag", (req, res) => {
  try {
    const student = clearTag(Number(req.params.id));
    res.json({ student, message: "Tag unlinked" });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || "Failed to clear tag" });
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
