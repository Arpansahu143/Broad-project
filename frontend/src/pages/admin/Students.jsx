import DashboardLayout from "../../components/DashboardLayout";
import "./Students.css";
import { useEffect, useState } from "react";
import api from "../../api/axios";

import {

    FaSearch,

    FaPlus,

    FaTrash,

    FaEdit,

    FaTimes

} from "react-icons/fa";

function Students(){

    const [students, setStudents] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showForm, setShowForm] = useState(false);
    const [formError, setFormError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        studentId: "",
        departmentId: "",
        semester: "",
    });

    const [editingStudent, setEditingStudent] = useState(null);
    const [editForm, setEditForm] = useState({
        departmentId: "", semester: "", phone: "", cgpa: "", attendance: "",
    });
    const [editError, setEditError] = useState(null);
    const [editSubmitting, setEditSubmitting] = useState(false);

    const loadStudents = async () => {
        try {
            const response = await api.get("/students");
            setStudents(response.data.data);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message || "Failed to load students."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStudents();

        api
            .get("/departments")
            .then((res) => setDepartments(res.data.data))
            .catch((err) => console.error("Failed to load departments:", err));
    }, []);

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        setFormError(null);
        setSubmitting(true);

        try {
            // Step 1: create the login account (STUDENT role, admin-only endpoint)
            const userResponse = await api.post("/auth/admin/create-user", {
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                password: form.password,
                role: "STUDENT",
            });

            const newUserId = userResponse.data.data.id;

            // Step 2: create the student profile linked to that account
            try {
                await api.post("/students", {
                    userId: newUserId,
                    studentId: form.studentId,
                    departmentId: form.departmentId,
                    semester: Number(form.semester),
                });
            } catch (profileErr) {
                // The login account WAS created even though the profile
                // failed — surface this clearly instead of a generic error,
                // since silently losing track of it would be worse.
                throw new Error(
                    `Login account for ${form.email} was created, but the student profile failed: ${
                        profileErr.response?.data?.message || "unknown error"
                    }. You can retry creating just the profile, or check with the backend.`
                );
            }

            setForm({
                firstName: "", lastName: "", email: "", password: "",
                studentId: "", departmentId: "", semester: "",
            });
            setShowForm(false);
            await loadStudents();
        } catch (err) {
            console.error(err);
            const fieldErrors = err.response?.data?.errors;
            if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
                setFormError(fieldErrors.map((e) => e.msg).join(", "));
            } else {
                setFormError(
                    err.message || err.response?.data?.message || "Failed to create student."
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    const openEditForm = (student) => {
        setEditingStudent(student);
        setEditForm({
            departmentId: student.departmentId || "",
            semester: student.semester ?? "",
            phone: student.phone || "",
            cgpa: student.cgpa ?? "",
            attendance: student.attendance ?? "",
        });
        setEditError(null);
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setEditError(null);
        setEditSubmitting(true);

        try {
            const payload = {
                departmentId: editForm.departmentId,
                semester: Number(editForm.semester),
            };
            if (editForm.phone) payload.phone = editForm.phone;
            if (editForm.cgpa !== "") payload.cgpa = Number(editForm.cgpa);
            if (editForm.attendance !== "") payload.attendance = Number(editForm.attendance);

            await api.put(`/students/${editingStudent.id}`, payload);
            setEditingStudent(null);
            await loadStudents();
        } catch (err) {
            console.error(err);
            const fieldErrors = err.response?.data?.errors;
            if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
                setEditError(fieldErrors.map((e) => e.msg).join(", "));
            } else {
                setEditError(err.response?.data?.message || "Failed to update student.");
            }
        } finally {
            setEditSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this student profile? This cannot be undone.")) return;

        try {
            await api.delete(`/students/${id}`);
            await loadStudents();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to delete student.");
        }
    };

    const filteredStudents = students.filter((student) => {
        const haystack = [
            student.studentId,
            student.user?.firstName,
            student.user?.lastName,
            student.user?.email,
            student.department?.name,
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        return haystack.includes(searchTerm.trim().toLowerCase());
    });

    return(

        <DashboardLayout

            role="admin"

            title="Student Management"

        >

            <div className="page-header">

                <div className="search-box">

                    <FaSearch/>

                    <input

                        type="text"

                        placeholder="Search students..."

                        value={searchTerm}

                        onChange={(e) => setSearchTerm(e.target.value)}

                    />

                </div>

                <button className="add-btn" onClick={() => setShowForm(true)}>

                    <FaPlus/>

                    Add Student

                </button>

            </div>

            {loading && <p style={{ padding: "16px" }}>Loading students...</p>}
            {error && <p style={{ padding: "16px", color: "#ef4444" }}>{error}</p>}

            {!loading && !error && (
            <div className="students-table">

                <table>

                    <thead>

                        <tr>

                            <th>ID</th>

                            <th>Name</th>

                            <th>Department</th>

                            <th>Semester</th>

                            <th>Email</th>

                            <th>Status</th>

                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            filteredStudents.map(

                                (student)=>(

                                    <tr key={student.id}>

                                        <td>{student.studentId}</td>

                                        <td>{student.user?.firstName} {student.user?.lastName}</td>

                                        <td>{student.department?.name || "—"}</td>

                                        <td>{student.semester}</td>

                                        <td>{student.user?.email}</td>

                                        <td>

                                            <span

                                                className="status active"

                                            >

                                                Active

                                            </span>

                                        </td>

                                        <td>

                                            <div className="action-btns">

                                                <button
                                                    onClick={() => openEditForm(student)}
                                                    title="Edit"
                                                >
                                                    <FaEdit/>
                                                </button>

                                                <button

                                                    className="delete-btn"

                                                    onClick={() => handleDelete(student.id)}

                                                    title="Delete"

                                                >

                                                    <FaTrash/>

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                )

                            )

                        }

                        {filteredStudents.length === 0 && (
                            <tr>
                                <td colSpan="7" style={{ textAlign: "center" }}>
                                    No students found.
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
                        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        zIndex: 1000,
                    }}
                    onClick={() => setShowForm(false)}
                >
                    <div
                        style={{
                            background: "#1e1e2d", borderRadius: "12px", padding: "24px",
                            width: "420px", maxWidth: "90vw", maxHeight: "85vh", overflowY: "auto",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{
                            display: "flex", justifyContent: "space-between",
                            alignItems: "center", marginBottom: "16px",
                        }}>
                            <h3 style={{ margin: 0 }}>Add Student</h3>
                            <button
                                onClick={() => setShowForm(false)}
                                style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleAddStudent}>
                            <div style={{ marginBottom: "12px" }}>
                                <input name="firstName" placeholder="First Name" value={form.firstName}
                                    onChange={handleFormChange} required
                                    style={{ width: "100%", padding: "8px", borderRadius: "6px" }} />
                            </div>
                            <div style={{ marginBottom: "12px" }}>
                                <input name="lastName" placeholder="Last Name" value={form.lastName}
                                    onChange={handleFormChange} required
                                    style={{ width: "100%", padding: "8px", borderRadius: "6px" }} />
                            </div>
                            <div style={{ marginBottom: "12px" }}>
                                <input name="email" type="email" placeholder="Email" value={form.email}
                                    onChange={handleFormChange} required
                                    style={{ width: "100%", padding: "8px", borderRadius: "6px" }} />
                            </div>
                            <div style={{ marginBottom: "12px" }}>
                                <input name="password" type="password" placeholder="Temporary Password" value={form.password}
                                    onChange={handleFormChange} required
                                    style={{ width: "100%", padding: "8px", borderRadius: "6px" }} />
                            </div>
                            <div style={{ marginBottom: "12px" }}>
                                <input name="studentId" placeholder="Student ID (e.g. SOA2301099)" value={form.studentId}
                                    onChange={handleFormChange} required
                                    style={{ width: "100%", padding: "8px", borderRadius: "6px" }} />
                            </div>
                            <div style={{ marginBottom: "12px" }}>
                                <select name="departmentId" value={form.departmentId}
                                    onChange={handleFormChange} required
                                    style={{ width: "100%", padding: "8px", borderRadius: "6px" }}>
                                    <option value="">Select Department</option>
                                    {departments.map((d) => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ marginBottom: "16px" }}>
                                <input name="semester" type="number" min="1" max="12" placeholder="Semester" value={form.semester}
                                    onChange={handleFormChange} required
                                    style={{ width: "100%", padding: "8px", borderRadius: "6px" }} />
                            </div>

                            {formError && (
                                <p style={{ color: "#ef4444", marginBottom: "12px" }}>{formError}</p>
                            )}

                            <button type="submit" disabled={submitting} className="add-btn"
                                style={{ width: "100%", justifyContent: "center" }}>
                                {submitting ? "Creating..." : "Create Student"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {editingStudent && (
                <div
                    style={{
                        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        zIndex: 1000,
                    }}
                    onClick={() => setEditingStudent(null)}
                >
                    <div
                        style={{
                            background: "#1e1e2d", borderRadius: "12px", padding: "24px",
                            width: "420px", maxWidth: "90vw", maxHeight: "85vh", overflowY: "auto",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{
                            display: "flex", justifyContent: "space-between",
                            alignItems: "center", marginBottom: "16px",
                        }}>
                            <h3 style={{ margin: 0 }}>
                                Edit {editingStudent.user?.firstName} {editingStudent.user?.lastName}
                            </h3>
                            <button
                                onClick={() => setEditingStudent(null)}
                                style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit}>
                            <div style={{ marginBottom: "12px" }}>
                                <select name="departmentId" value={editForm.departmentId}
                                    onChange={handleEditChange} required
                                    style={{ width: "100%", padding: "8px", borderRadius: "6px" }}>
                                    <option value="">Select Department</option>
                                    {departments.map((d) => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ marginBottom: "12px" }}>
                                <input name="semester" type="number" min="1" max="8" placeholder="Semester"
                                    value={editForm.semester} onChange={handleEditChange} required
                                    style={{ width: "100%", padding: "8px", borderRadius: "6px" }} />
                            </div>
                            <div style={{ marginBottom: "12px" }}>
                                <input name="phone" placeholder="Phone (optional)"
                                    value={editForm.phone} onChange={handleEditChange}
                                    style={{ width: "100%", padding: "8px", borderRadius: "6px" }} />
                            </div>
                            <div style={{ marginBottom: "12px" }}>
                                <input name="cgpa" type="number" step="0.01" min="0" max="10" placeholder="CGPA (optional)"
                                    value={editForm.cgpa} onChange={handleEditChange}
                                    style={{ width: "100%", padding: "8px", borderRadius: "6px" }} />
                            </div>
                            <div style={{ marginBottom: "16px" }}>
                                <input name="attendance" type="number" step="0.1" min="0" max="100" placeholder="Attendance % (optional)"
                                    value={editForm.attendance} onChange={handleEditChange}
                                    style={{ width: "100%", padding: "8px", borderRadius: "6px" }} />
                            </div>

                            {editError && (
                                <p style={{ color: "#ef4444", marginBottom: "12px" }}>{editError}</p>
                            )}

                            <button type="submit" disabled={editSubmitting} className="add-btn"
                                style={{ width: "100%", justifyContent: "center" }}>
                                {editSubmitting ? "Saving..." : "Save Changes"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </DashboardLayout>

    );

}

export default Students;