import DashboardLayout from "../../components/DashboardLayout";
import "../student/Attendance.css";
import { useEffect, useState } from "react";
import api from "../../api/axios";

const STATUS_OPTIONS = ["PRESENT", "ABSENT", "LATE"];

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function Attendance() {
  const [myCourses, setMyCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [date, setDate] = useState(todayISO());

  const [roster, setRoster] = useState([]);
  const [statuses, setStatuses] = useState({}); // studentId -> status

  const [loading, setLoading] = useState(true);
  const [rosterLoading, setRosterLoading] = useState(false);
  const [error, setError] = useState(null);
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

  useEffect(() => {
    if (!selectedCourseId) return;

    const fetchRoster = async () => {
      setRosterLoading(true);
      setSavedMessage(null);
      try {
        // Course detail includes the enrolled students list.
        const response = await api.get(`/courses/${selectedCourseId}`);
        const enrollments = response.data.data.enrollments || [];
        setRoster(enrollments);

        // Default everyone to PRESENT; will be overwritten below if
        // there's already a saved record for this date.
        const defaults = {};
        enrollments.forEach((e) => {
          defaults[e.student.id] = "PRESENT";
        });

        // Check if attendance was already marked for this date, to
        // prefill instead of overwriting.
        const existing = await api.get(`/attendance/${selectedCourseId}`, {
          params: { date },
        });

        existing.data.data.forEach((record) => {
          defaults[record.enrollment.studentId] = record.status;
        });

        setStatuses(defaults);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load class roster.");
      } finally {
        setRosterLoading(false);
      }
    };

    fetchRoster();
  }, [selectedCourseId, date]);

  const handleStatusChange = (studentId, status) => {
    setStatuses((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    setSavedMessage(null);

    const records = roster.map((enrollment) => ({
      studentId: enrollment.student.id,
      status: statuses[enrollment.student.id] || "PRESENT",
    }));

    try {
      const response = await api.post("/attendance", {
        courseId: selectedCourseId,
        date,
        records,
      });

      const { errors } = response.data.data;
      if (errors && errors.length > 0) {
        setSaveError(
          `Saved, but ${errors.length} record(s) failed: ` +
            errors.map((e) => e.reason).join(", ")
        );
      } else {
        setSavedMessage("Attendance saved successfully.");
      }
    } catch (err) {
      console.error(err);
      setSaveError(err.response?.data?.message || "Failed to save attendance.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="faculty" title="Attendance">
        <p style={{ padding: "16px" }}>Loading your courses...</p>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout role="faculty" title="Attendance">
        <p style={{ padding: "16px", color: "#ef4444" }}>{error}</p>
      </DashboardLayout>
    );
  }

  if (myCourses.length === 0) {
    return (
      <DashboardLayout role="faculty" title="Attendance">
        <p style={{ padding: "16px" }}>
          You aren't assigned to teach any courses yet, so there's nothing to
          mark attendance for.
        </p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="faculty" title="Attendance">
      <div style={{ display: "flex", gap: "16px", padding: "16px", flexWrap: "wrap" }}>
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

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={todayISO()}
          style={{ padding: "8px", borderRadius: "6px" }}
        />
      </div>

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
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {roster.map((enrollment) => (
                <tr key={enrollment.student.id}>
                  <td>{enrollment.student.studentId}</td>
                  <td>
                    {enrollment.student.user?.firstName}{" "}
                    {enrollment.student.user?.lastName}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {STATUS_OPTIONS.map((status) => (
                        <label key={status} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <input
                            type="radio"
                            name={`status-${enrollment.student.id}`}
                            checked={statuses[enrollment.student.id] === status}
                            onChange={() => handleStatusChange(enrollment.student.id, status)}
                          />
                          {status}
                        </label>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ padding: "16px" }}>
            {saveError && <p style={{ color: "#ef4444" }}>{saveError}</p>}
            {savedMessage && <p style={{ color: "#22c55e" }}>{savedMessage}</p>}
            <button
              className="add-btn"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Attendance;
