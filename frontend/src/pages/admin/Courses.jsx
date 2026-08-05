import DashboardLayout from "../../components/DashboardLayout";
import "./Courses.css";
import { useEffect, useState } from "react";
import api from "../../api/axios";

import {
  FaSearch,
  FaPlus,
  FaTrash,
  FaBook,
  FaTimes,
} from "react-icons/fa";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    code: "",
    name: "",
    credits: "",
    departmentId: "",
    facultyId: "",
  });

  const loadCourses = async () => {
    try {
      const response = await api.get("/courses");
      setCourses(response.data.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();

    // Departments/faculty are needed to populate the Add Course form's
    // dropdowns — fetched once up front.
    api
      .get("/departments")
      .then((res) => setDepartments(res.data.data))
      .catch((err) => console.error("Failed to load departments:", err));

    api
      .get("/faculty")
      .then((res) => setFaculty(res.data.data))
      .catch((err) => console.error("Failed to load faculty:", err));
  }, []);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      await api.post("/courses", {
        code: form.code,
        name: form.name,
        credits: Number(form.credits),
        departmentId: form.departmentId,
        facultyId: form.facultyId || undefined,
      });

      setForm({ code: "", name: "", credits: "", departmentId: "", facultyId: "" });
      setShowForm(false);
      await loadCourses();
    } catch (err) {
      console.error(err);
      const fieldErrors = err.response?.data?.errors;
      if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
        setFormError(fieldErrors.map((e) => e.msg).join(", "));
      } else {
        setFormError(err.response?.data?.message || "Failed to create course.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course? This cannot be undone.")) return;

    try {
      await api.delete(`/courses/${id}`);
      await loadCourses();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete course.");
    }
  };

  const filteredCourses = courses.filter((course) => {
    const haystack = [
      course.code,
      course.name,
      course.department?.name,
      course.faculty?.user?.firstName,
      course.faculty?.user?.lastName,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(searchTerm.trim().toLowerCase());
  });

  return (
    <DashboardLayout role="admin" title="Course Management">
      <div className="page-header">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search Course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="add-btn" onClick={() => setShowForm(true)}>
          <FaPlus />
          Add Course
        </button>
      </div>

      {loading && <p style={{ padding: "16px" }}>Loading courses...</p>}
      {error && <p style={{ padding: "16px", color: "#ef4444" }}>{error}</p>}

      {!loading && !error && (
        <div className="courses-table">
          <table>
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Department</th>
                <th>Faculty</th>
                <th>Credits</th>
                <th>Enrolled</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course) => (
                <tr key={course.id}>
                  <td>
                    <div className="course-code">
                      <FaBook />
                      {course.code}
                    </div>
                  </td>
                  <td>{course.name}</td>
                  <td>{course.department?.name || "—"}</td>
                  <td>
                    {course.faculty
                      ? `${course.faculty.user?.firstName} ${course.faculty.user?.lastName}`
                      : "Unassigned"}
                  </td>
                  <td>{course.credits}</td>
                  <td>{course._count?.enrollments ?? 0}</td>
                  <td>
                    <div className="action-btns">
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(course.id)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCourses.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No courses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowForm(false)}
        >
          <div
            style={{
              background: "#1e1e2d",
              borderRadius: "12px",
              padding: "24px",
              width: "420px",
              maxWidth: "90vw",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h3 style={{ margin: 0 }}>Add Course</h3>
              <button
                onClick={() => setShowForm(false)}
                style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleAddCourse}>
              <div style={{ marginBottom: "12px" }}>
                <input
                  name="code"
                  placeholder="Course Code (e.g. CS301)"
                  value={form.code}
                  onChange={handleFormChange}
                  required
                  style={{ width: "100%", padding: "8px", borderRadius: "6px" }}
                />
              </div>
              <div style={{ marginBottom: "12px" }}>
                <input
                  name="name"
                  placeholder="Course Name"
                  value={form.name}
                  onChange={handleFormChange}
                  required
                  style={{ width: "100%", padding: "8px", borderRadius: "6px" }}
                />
              </div>
              <div style={{ marginBottom: "12px" }}>
                <input
                  name="credits"
                  type="number"
                  min="1"
                  max="10"
                  placeholder="Credits"
                  value={form.credits}
                  onChange={handleFormChange}
                  required
                  style={{ width: "100%", padding: "8px", borderRadius: "6px" }}
                />
              </div>
              <div style={{ marginBottom: "12px" }}>
                <select
                  name="departmentId"
                  value={form.departmentId}
                  onChange={handleFormChange}
                  required
                  style={{ width: "100%", padding: "8px", borderRadius: "6px" }}
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: "16px" }}>
                <select
                  name="facultyId"
                  value={form.facultyId}
                  onChange={handleFormChange}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px" }}
                >
                  <option value="">Unassigned (optional)</option>
                  {faculty.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.user?.firstName} {f.user?.lastName}
                    </option>
                  ))}
                </select>
              </div>

              {formError && (
                <p style={{ color: "#ef4444", marginBottom: "12px" }}>{formError}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="add-btn"
                style={{ width: "100%", justifyContent: "center" }}
              >
                {submitting ? "Creating..." : "Create Course"}
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Courses;
