import DashboardLayout from "../../components/DashboardLayout";
import "../student/Notifications.css";

import { useEffect, useState } from "react";
import api from "../../api/axios";

import {
    FaBell,
    FaCalendarAlt,
    FaBook,
    FaExclamationCircle,
    FaBullhorn,
    FaTrash,
} from "react-icons/fa";

const CATEGORY_META = {
    EXAMINATION: { icon: <FaBook />, type: "exam", label: "Examination" },
    EVENT: { icon: <FaCalendarAlt />, type: "event", label: "Event" },
    ANNOUNCEMENT: { icon: <FaBullhorn />, type: "announcement", label: "Announcement" },
    IMPORTANT: { icon: <FaExclamationCircle />, type: "important", label: "Important" },
    PLACEMENT: { icon: <FaBell />, type: "placement", label: "Placement" },
};

function Notifications() {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [form, setForm] = useState({ title: "", description: "", category: "ANNOUNCEMENT" });
    const [formError, setFormError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const loadNotifications = async () => {
        try {
            const response = await api.get("/notifications");
            setNotifications(response.data.data);
        } catch (err) {
            console.error("Failed to load notifications:", err);
            setError("Could not load notifications. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        setSubmitting(true);

        try {
            await api.post("/notifications", form);
            setForm({ title: "", description: "", category: "ANNOUNCEMENT" });
            await loadNotifications();
        } catch (err) {
            console.error(err);
            const fieldErrors = err.response?.data?.errors;
            if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
                setFormError(fieldErrors.map((e) => e.msg).join(", "));
            } else {
                setFormError(err.response?.data?.message || "Failed to send notification.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this notification for everyone?")) return;

        try {
            await api.delete(`/notifications/${id}`);
            await loadNotifications();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to delete notification.");
        }
    };

    return(

        <DashboardLayout role="admin" title="Notifications">

            <form
                onSubmit={handleSubmit}
                style={{
                    background: "#fff",
                    borderRadius: "16px",
                    padding: "24px",
                    marginBottom: "30px",
                    boxShadow: "0 10px 30px rgba(0,0,0,.08)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                }}
            >
                <h3 style={{ margin: 0 }}>Broadcast a Notification</h3>
                <p style={{ margin: 0, color: "#888", fontSize: "14px" }}>
                    This goes out to every user in the system — Students, Faculty, and Admins.
                </p>

                <input
                    name="title"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={3}
                    style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ddd", resize: "vertical" }}
                />

                <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
                >
                    {Object.entries(CATEGORY_META).map(([key, meta]) => (
                        <option key={key} value={key}>{meta.label}</option>
                    ))}
                </select>

                {formError && <p style={{ color: "#e74c3c", margin: 0 }}>{formError}</p>}

                <button
                    type="submit"
                    className="add-btn"
                    disabled={submitting}
                    style={{ alignSelf: "flex-start" }}
                >
                    {submitting ? "Sending..." : "Send Notification"}
                </button>
            </form>

            {loading && <p>Loading notifications...</p>}
            {error && <p className="notification-error">{error}</p>}
            {!loading && !error && notifications.length === 0 && <p>No notifications yet.</p>}

            <div className="notification-list">

                {
                    notifications.map((item) => {
                        const meta = CATEGORY_META[item.category] || CATEGORY_META.ANNOUNCEMENT;

                        return (
                            <div className={`notification-card ${meta.type}`} key={item.id}>

                                <div className="notification-icon">
                                    {meta.icon}
                                </div>

                                <div className="notification-content">

                                    <div className="notification-top">
                                        <span>{meta.label}</span>
                                        <small>
                                            {new Date(item.createdAt).toLocaleDateString("en-GB", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </small>
                                    </div>

                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>

                                </div>

                                <button
                                    onClick={() => handleDelete(item.id)}
                                    title="Delete"
                                    style={{
                                        background: "none",
                                        border: "none",
                                        color: "#e74c3c",
                                        cursor: "pointer",
                                        alignSelf: "flex-start",
                                        fontSize: "18px",
                                    }}
                                >
                                    <FaTrash />
                                </button>

                            </div>
                        );
                    })
                }

            </div>

        </DashboardLayout>

    );

}

export default Notifications;
