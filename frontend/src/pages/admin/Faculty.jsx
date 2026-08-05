import DashboardLayout from "../../components/DashboardLayout";
import "./Faculty.css";
import { useEffect, useState } from "react";
import api from "../../api/axios";

import {

    FaSearch,

    FaPlus,

    FaTrash,

    FaEdit,

    FaTimes

} from "react-icons/fa";

function Faculty(){

    const [faculty, setFaculty] = useState([]);
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
        employeeId: "",
        departmentId: "",
        designation: "",
    });

    const [editingFaculty, setEditingFaculty] = useState(null);
    const [editForm, setEditForm] = useState({
        departmentId: "", designation: "", phone: "",
    });
    const [editError, setEditError] = useState(null);
    const [editSubmitting, setEditSubmitting] = useState(false);

    const loadFaculty = async () => {
        try {
            const response = await api.get("/faculty");
            setFaculty(response.data.data);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message || "Failed to load faculty."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFaculty();

        api
            .get("/departments")
            .then((res) => setDepartments(res.data.data))
            .catch((err) => console.error("Failed to load departments:", err));
    }, []);

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAddFaculty = async (e) => {
        e.preventDefault();
        setFormError(null);
        setSubmitting(true);

        try {
            const userResponse = await api.post("/auth/admin/create-user", {
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                password: form.password,
                role: "FACULTY",
            });

            const newUserId = userResponse.data.data.id;

            try {
                await api.post("/faculty", {
                    userId: newUserId,
                    employeeId: form.employeeId,
                    departmentId: form.departmentId,
                    designation: form.designation || undefined,
                });
            } catch (profileErr) {
                throw new Error(
                    `Login account for ${form.email} was created, but the faculty profile failed: ${
                        profileErr.response?.data?.message || "unknown error"
                    }. You can retry creating just the profile, or check with the backend.`
                );
            }

            setForm({
                firstName: "", lastName: "", email: "", password: "",
                employeeId: "", departmentId: "", designation: "",
            });
            setShowForm(false);
            await loadFaculty();
        } catch (err) {
            console.error(err);
            const fieldErrors = err.response?.data?.errors;
            if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
                setFormError(fieldErrors.map((e) => e.msg).join(", "));
            } else {
                setFormError(
                    err.message || err.response?.data?.message || "Failed to create faculty."
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    const openEditForm = (item) => {
        setEditingFaculty(item);
        setEditForm({
            departmentId: item.departmentId || "",
            designation: item.designation || "",
            phone: item.phone || "",
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
            const payload = { departmentId: editForm.departmentId };
            if (editForm.designation) payload.designation = editForm.designation;
            if (editForm.phone) payload.phone = editForm.phone;

            await api.put(`/faculty/${editingFaculty.id}`, payload);
            setEditingFaculty(null);
            await loadFaculty();
        } catch (err) {
            console.error(err);
            const fieldErrors = err.response?.data?.errors;
            if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
                setEditError(fieldErrors.map((e) => e.msg).join(", "));
            } else {
                setEditError(err.response?.data?.message || "Failed to update faculty.");
            }
        } finally {
            setEditSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this faculty profile? This cannot be undone.")) return;

        try {
            await api.delete(`/faculty/${id}`);
            await loadFaculty();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to delete faculty.");
        }
    };

    const filteredFaculty = faculty.filter((item) => {
        const haystack = [
            item.employeeId,
            item.user?.firstName,
            item.user?.lastName,
            item.user?.email,
            item.department?.name,
            item.designation,
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        return haystack.includes(searchTerm.trim().toLowerCase());
    });

    return(

        <DashboardLayout

            role="admin"

            title="Faculty Management"

        >

            <div className="page-header">

                <div className="search-box">

                    <FaSearch/>

                    <input

                        type="text"

                        placeholder="Search Faculty..."

                        value={searchTerm}

                        onChange={(e) => setSearchTerm(e.target.value)}

                    />

                </div>

                <button className="add-btn" onClick={() => setShowForm(true)}>

                    <FaPlus/>

                    Add Faculty

                </button>

            </div>

            {loading && <p style={{ padding: "16px" }}>Loading faculty...</p>}
            {error && <p style={{ padding: "16px", color: "#ef4444" }}>{error}</p>}

            {!loading && !error && (
            <div className="faculty-table">

                <table>

                    <thead>

                        <tr>

                            <th>ID</th>

                            <th>Name</th>

                            <th>Department</th>

                            <th>Designation</th>

                            <th>Email</th>

                            <th>Status</th>

                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            filteredFaculty.map(

                                (item)=>(

                                    <tr key={item.id}>

                                        <td>{item.employeeId}</td>

                                        <td>{item.user?.firstName} {item.user?.lastName}</td>

                                        <td>{item.department?.name || "—"}</td>

                                        <td>{item.designation || "—"}</td>

                                        <td>{item.user?.email}</td>

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
                                                    onClick={() => openEditForm(item)}
                                                    title="Edit"
                                                >
                                                    <FaEdit/>
                                                </button>

                                                <button

                                                    className="delete-btn"

                                                    onClick={() => handleDelete(item.id)}

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

                        {filteredFaculty.length === 0 && (
                            <tr>
                                <td colSpan="7" style={{ textAlign: "center" }}>
                                    No faculty found.
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
                            <h3 style={{ margin: 0 }}>Add Faculty</h3>
                            <button
                                onClick={() => setShowForm(false)}
                                style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleAddFaculty}>
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
                                <input name="employeeId" placeholder="Employee ID (e.g. EMP001)" value={form.employeeId}
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
                                <input name="designation" placeholder="Designation (e.g. Professor)" value={form.designation}
                                    onChange={handleFormChange}
                                    style={{ width: "100%", padding: "8px", borderRadius: "6px" }} />
                            </div>

                            {formError && (
                                <p style={{ color: "#ef4444", marginBottom: "12px" }}>{formError}</p>
                            )}

                            <button type="submit" disabled={submitting} className="add-btn"
                                style={{ width: "100%", justifyContent: "center" }}>
                                {submitting ? "Creating..." : "Create Faculty"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {editingFaculty && (
                <div
                    style={{
                        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        zIndex: 1000,
                    }}
                    onClick={() => setEditingFaculty(null)}
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
                                Edit {editingFaculty.user?.firstName} {editingFaculty.user?.lastName}
                            </h3>
                            <button
                                onClick={() => setEditingFaculty(null)}
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
                                <input name="designation" placeholder="Designation"
                                    value={editForm.designation} onChange={handleEditChange}
                                    style={{ width: "100%", padding: "8px", borderRadius: "6px" }} />
                            </div>
                            <div style={{ marginBottom: "16px" }}>
                                <input name="phone" placeholder="Phone (optional)"
                                    value={editForm.phone} onChange={handleEditChange}
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

export default Faculty;
