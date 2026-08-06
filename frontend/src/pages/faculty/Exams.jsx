import DashboardLayout from "../../components/DashboardLayout";
import "../student/Attendance.css";
import { useEffect, useState } from "react";
import api from "../../api/axios";

const EXAM_TYPES = ["QUIZ", "ASSIGNMENT", "MIDTERM", "FINAL"];

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function Exams() {
  const [myCourses, setMyCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [exams, setExams] = useState([]);

  const [loading, setLoading] = useState(true);
  const [examsLoading, setExamsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create-exam form
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "", examType: "QUIZ", maxMarks: "", examDate: todayISO(),
  });
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Grade entry
  const [gradingExam, setGradingExam] = useState(null);
  const [roster, setRoster] = useState([]);
  const [marks, setMarks] = useState({}); // studentId -> marksObtained
  const [rosterLoading, setRosterLoading] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(null);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const response = await api.get("/courses/my");
        setMyCourses(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedCourseId(response.data.data[0].id);
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load your courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  const loadExams = async (courseId) => {
    if (!courseId) return;
    setExamsLoading(true);
    try {
      const response = await api.get(`/exams/course/${courseId}`);
      setExams(response.data.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load exams.");
    } finally {
      setExamsLoading(false);
    }
  };

  useEffect(() => {
    setGradingExam(null);
    loadExams(selectedCourseId);
  }, [selectedCourseId]);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      await api.post("/exams", {
        courseId: selectedCourseId,
        title: form.title,
        examType: form.examType,
        maxMarks: Number(form.maxMarks),
        examDate: form.examDate,
      });

      setForm({ title: "", examType: "QUIZ", maxMarks: "", examDate: todayISO() });
      setShowForm(false);
      await loadExams(selectedCourseId);
    } catch (err) {
      console.error(err);
      const fieldErrors = err.response?.data?.errors;
      if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
        setFormError(fieldErrors.map((e) => e.msg).join(", "));
      } else {
        setFormError(err.response?.data?.message || "Failed to create exam.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const openGrading = async (exam) => {
    setGradingExam(exam);
    setSavedMessage(null);
    setSaveError(null);
    setRosterLoading(true);

    try {
      // Course detail includes the enrolled students list.
      const courseRes = await api.get(`/courses/${selectedCourseId}`);
      const enrollments = courseRes.data.data.enrollments || [];
      setRoster(enrollments);

      const defaults = {};
      enrollments.forEach((en) => { defaults[en.student.id] = ""; });

      // Prefill with any grades already entered for this exam.
      const gradesRes = await api.get(`/exams/${exam.id}/grades`);
      gradesRes.data.data.grades.forEach((g) => {
        defaults[g.enrollment.studentId] = String(g.marksObtained);
      });

      setMarks(defaults);
    } catch (err) {
      console.error(err);
      setSaveError(err.response?.data?.message || "Failed to load roster.");
    } finally {
      setRosterLoading(false);
    }
  };

  const handleMarkChange = (studentId, value) => {
    setMarks((prev) => ({ ...prev, [studentId]: value }));
  };

  const handleSaveGrades = async () => {
    setSaving(true);
    setSaveError(null);
    setSavedMessage(null);

    const records = roster
      .filter((en) => marks[en.student.id] !== "")
      .map((en) => ({
        studentId: en.student.id,
        marksObtained: Number(marks[en.student.id]),
      }));

    try {
      const response = await api.post(`/exams/${gradingExam.id}/grades`, { records });

      const { errors } = response.data.data;
      if (errors && errors.length > 0) {
        setSaveError(
          `Saved, but ${errors.length} record(s) failed: ` +
            errors.map((e) => e.reason).join(", ")
        );
      } else {
        setSavedMessage("Grades saved successfully.");
      }
    } catch (err) {
      console.error(err);
      setSaveError(err.response?.data?.message || "Failed to save grades.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="faculty" title="Exams & Grading">
        <p style={{ padding: "16px" }}>Loading your courses...</p>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout role="faculty" title="Exams & Grading">
        <p style={{ padding: "16px", color: "#ef4444" }}>{error}</p>
      </DashboardLayout>
    );
  }

  if (myCourses.length === 0) {
    return (
      <DashboardLayout role="faculty" title="Exams & Grading">
        <p style={{ padding: "16px" }}>
          You aren't assigned to teach any courses yet.
        </p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="faculty" title="Exams & Grading">
      <div style={{ display: "flex", gap: "16px", padding: "16px", flexWrap: "wrap", alignItems: "center" }}>
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          style={{ padding: "8px", borderRadius: "6px" }}
        >
          {myCourses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.code} — {course.name}
            </option>
          ))}
        </select>

        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Create Exam"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreateExam}
          style={{
            margin: "0 16px 24px", padding: "16px", background: "#fff",
            borderRadius: "10px", display: "flex", gap: "12px", flexWrap: "wrap",
            alignItems: "flex-end",
          }}
        >
          <div>
            <label style={{ display: "block", fontSize: "13px", marginBottom: "4px" }}>Title</label>
            <input name="title" placeholder="e.g. Mid-Term" value={form.title}
              onChange={handleFormChange} required
              style={{ padding: "8px", borderRadius: "6px" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "13px", marginBottom: "4px" }}>Type</label>
            <select name="examType" value={form.examType} onChange={handleFormChange}
              style={{ padding: "8px", borderRadius: "6px" }}>
              {EXAM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "13px", marginBottom: "4px" }}>Max Marks</label>
            <input name="maxMarks" type="number" min="1" placeholder="100" value={form.maxMarks}
              onChange={handleFormChange} required
              style={{ padding: "8px", borderRadius: "6px", width: "100px" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "13px", marginBottom: "4px" }}>Date</label>
            <input name="examDate" type="date" value={form.examDate}
              onChange={handleFormChange} required
              style={{ padding: "8px", borderRadius: "6px" }} />
          </div>
          <button type="submit" className="add-btn" disabled={submitting}>
            {submitting ? "Creating..." : "Create"}
          </button>
          {formError && <p style={{ color: "#ef4444", width: "100%", margin: 0 }}>{formError}</p>}
        </form>
      )}

      {examsLoading && <p style={{ padding: "16px" }}>Loading exams...</p>}

      {!examsLoading && exams.length === 0 && (
        <p style={{ padding: "16px" }}>No exams created for this course yet.</p>
      )}

      {!examsLoading && exams.length > 0 && (
        <div className="attendance-table" style={{ marginBottom: "24px" }}>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Date</th>
                <th>Max Marks</th>
                <th>Graded</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam.id}>
                  <td>{exam.title}</td>
                  <td>{exam.examType}</td>
                  <td>{new Date(exam.examDate).toLocaleDateString()}</td>
                  <td>{exam.maxMarks}</td>
                  <td>{exam._count?.grades ?? 0}</td>
                  <td>
                    <button className="add-btn" onClick={() => openGrading(exam)}>
                      Enter Grades
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {gradingExam && (
        <>
          <h3 style={{ padding: "0 16px" }}>
            Grading: {gradingExam.title} (out of {gradingExam.maxMarks})
          </h3>

          {rosterLoading && <p style={{ padding: "16px" }}>Loading roster...</p>}

          {!rosterLoading && roster.length === 0 && (
            <p style={{ padding: "16px" }}>No students enrolled in this course yet.</p>
          )}

          {!rosterLoading && roster.length > 0 && (
            <div className="attendance-table">
              <table>
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Marks Obtained</th>
                  </tr>
                </thead>
                <tbody>
                  {roster.map((en) => (
                    <tr key={en.student.id}>
                      <td>{en.student.studentId}</td>
                      <td>{en.student.user?.firstName} {en.student.user?.lastName}</td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max={gradingExam.maxMarks}
                          value={marks[en.student.id] ?? ""}
                          onChange={(e) => handleMarkChange(en.student.id, e.target.value)}
                          style={{ padding: "6px", borderRadius: "6px", width: "80px" }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ padding: "16px" }}>
                {saveError && <p style={{ color: "#ef4444" }}>{saveError}</p>}
                {savedMessage && <p style={{ color: "#22c55e" }}>{savedMessage}</p>}
                <button className="add-btn" onClick={handleSaveGrades} disabled={saving}>
                  {saving ? "Saving..." : "Save Grades"}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}

export default Exams;
