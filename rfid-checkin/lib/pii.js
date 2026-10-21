/** Desk / LAN-safe student shape — no parent contact fields. */
function toPublicStudent(student) {
  if (!student) return null;
  const out = {
    id: student.id,
    studentCode: student.studentCode,
    name: student.name,
    subjects: student.subjects || [],
    active: student.active,
    checkedInAt: student.checkedInAt || null,
    isCheckedIn: Boolean(student.isCheckedIn),
    hasParentEmail: Boolean(student.parentEmail),
  };
  if (student.tagUid !== undefined || student.tagLinked !== undefined) {
    out.tagLinked = Boolean(student.tagUid || student.tagLinked);
  }
  return out;
}

function scrubAttendanceResult(result) {
  if (!result) return result;
  return {
    ...result,
    student: toPublicStudent(result.student),
  };
}

module.exports = { toPublicStudent, scrubAttendanceResult };
