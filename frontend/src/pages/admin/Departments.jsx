import DashboardLayout from "../../components/DashboardLayout";
import "./Departments.css";
import { useEffect, useState } from "react";
import api from "../../api/axios";

import {

    FaSearch,

    FaPlus,

    FaEdit,

    FaTrash,

    FaTimes

} from "react-icons/fa";

function Departments(){

    const [departments, setDepartments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showForm, setShowForm] = useState(false);
    const [formError, setFormError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ name: "", code: "", description: "" });

    const [showEditForm, setShowEditForm] = useState(false);
    const [editForm, setEditForm] = useState({ id: "", name: "", code: "", description: "" });
    const [editError, setEditError] = useState(null);
    const [editSubmitting, setEditSubmitting] = useState(false);

    const loadDepartments = async () => {
        try {
            const response = await api.get("/departments");
            setDepartments(response.data.data);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message || "Failed to load departments."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDepartments();
    }, []);

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAddDepartment = async (e) => {
        e.preventDefault();
        setFormError(null);
        setSubmitting(true);

        try {
            await api.post("/departments", {
                name: form.name,
                code: form.code,
                description: form.description || undefined,
            });

            setForm({ name: "", code: "", description: "" });
            setShowForm(false);
            await loadDepartments();
        } catch (err) {
            console.error(err);
            const fieldErrors = err.response?.data?.errors;
            if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
                setFormError(fieldErrors.map((e) => e.msg).join(", "));
            } else {
                setFormError(
                    err.response?.data?.message || "Failed to create department."
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    const openEditForm = (dept) => {
        setEditForm({
            id: dept.id,
            name: dept.name,
            code: dept.code,
            description: dept.description || "",
        });
        setEditError(null);
        setShowEditForm(true);
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setEditError(null);
        setEditSubmitting(true);

        try {
            await api.put(`/departments/${editForm.id}`, {
                name: editForm.name,
                code: editForm.code,
                description: editForm.description || undefined,
            });

            setShowEditForm(false);
            await loadDepartments();
        } catch (err) {
            console.error(err);
            const fieldErrors = err.response?.data?.errors;
            if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
                setEditError(fieldErrors.map((e) => e.msg).join(", "));
            } else {
                setEditError(
                    err.response?.data?.message || "Failed to update department."
                );
            }
        } finally {
            setEditSubmitting(false);
        }
    };

    const handleDelete = async (dept) => {
        if (!window.confirm(`Delete "${dept.name}"? This cannot be undone.`)) return;

        try {
            await api.delete(`/departments/${dept.id}`);
            await loadDepartments();
        } catch (err) {
            console.error(err);
            // The backend deliberately blocks deleting a department that
            // still has students in it — surface that reason directly
            // rather than a generic failure message.
            alert(err.response?.data?.message || "Failed to delete department.");
        }
    };

    const filteredDepartments = departments.filter((dept) => {
        const haystack = [dept.name, dept.code, dept.description]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        return haystack.includes(searchTerm.trim().toLowerCase());
    });

    return(

        <DashboardLayout

            role="admin"

            title="Department Management"

        >

            <div className="page-header">

                <div className="search-box">

                    <FaSearch/>

                    <input

                        type="text"

                        placeholder="Search departments..."

                        value={searchTerm}

                        onChange={(e) => setSearchTerm(e.target.value)}

                    />

                </div>

                <button className="add-btn" onClick={() => setShowForm(true)}>

                    <FaPlus/>

                    Add Department

                </button>

            </div>

            {loading && <p style={{ padding: "16px" }}>Loading departments...</p>}
            {error && <p style={{ padding: "16px", color: "#ef4444" }}>{error}</p>}

            {!loading && !error && (
            <div className="departments-table">

                <table>

                    <thead>

                        <tr>

                            <th>Code</th>

                            <th>Name</th>

                            <th>Description</th>

                            <th>Students</th>

                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            filteredDepartments.map(

                                (dept)=>(

                                    <tr key={dept.id}>

                                        <td>{dept.code}</td>

                                        <td>{dept.name}</td>

                                        <td>{dept.description || "—"}</td>

                                        <td>{dept._count?.students ?? 0}</td>

                                        <td>

                                            <div className="action-btns">

                                                <button

                                                    onClick={() => openEditForm(dept)}

                                                    title="Edit"

                                                >

                                                    <FaEdit/>

                                                </button>

                                                <button

                                                    className="delete-btn"

                                                    onClick={() => handleDelete(dept)}

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

                        {filteredDepartments.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: "center" }}>
                                    No departments found.
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
                            <h3 style={{ margin: 0 }}>Add Department</h3>
                            <button
                                onClick={() => setShowForm(false)}
                                style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleAddDepartment}>
                            <div style={{ marginBottom: "12px" }}>
                                <input name="name" placeholder="Department Name (e.g. Computer Science)" value={form.name}
                                    onChange={handleFormChange} required
                                    style={{ width: "100%", padding: "8px", borderRadius: "6px" }} />
                            </div>
                            <div style={{ marginBottom: "12px" }}>
                                <input name="code" placeholder="Code (e.g. CS)" value={form.code}
                                    onChange={handleFormChange} required
                                    style={{ width: "100%", padding: "8px", borderRadius: "6px" }} />
                            </div>
                            <div style={{ marginBottom: "16px" }}>
                                <textarea name="description" placeholder="Description (optional)" value={form.description}
                                    onChange={handleFormChange} rows="3"
                                    style={{ width: "100%", padding: "8px", borderRadius: "6px" }} />
                            </div>

                            {formError && (
                                <p style={{ color: "#ef4444", marginBottom: "12px" }}>{formError}</p>
                            )}

                            <button type="submit" disabled={submitting} className="add-btn"
                                style={{ width: "100%", justifyContent: "center" }}>
                                {submitting ? "Creating..." : "Create Department"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {showEditForm && (
                <div
                    style={{
                        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        zIndex: 1000,
                    }}
                    onClick={() => setShowEditForm(false)}
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
                            <h3 style={{ margin: 0 }}>Edit Department</h3>
                            <button
                                onClick={() => setShowEditForm(false)}
                                style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit}>
                            <div style={{ marginBottom: "12px" }}>
                                <input name="name" placeholder="Department Name" value={editForm.name}
                                    onChange={handleEditChange} required
                                    style={{ width: "100%", padding: "8px", borderRadius: "6px" }} />
                            </div>
                            <div style={{ marginBottom: "12px" }}>
                                <input name="code" placeholder="Code" value={editForm.code}
                                    onChange={handleEditChange} required
                                    style={{ width: "100%", padding: "8px", borderRadius: "6px" }} />
                            </div>
                            <div style={{ marginBottom: "16px" }}>
                                <textarea name="description" placeholder="Description (optional)" value={editForm.description}
                                    onChange={handleEditChange} rows="3"
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

export default Departments;
