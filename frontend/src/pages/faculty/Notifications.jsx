import DashboardLayout from "../../components/DashboardLayout";
import "../student/Notifications.css";

import { useEffect, useState } from "react";
import api from "../../api/axios";

import {
    FaBell,
    FaCalendarAlt,
    FaBook,
    FaExclamationCircle,
    FaBullhorn
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

    useEffect(() => {
        const fetchNotifications = async () => {
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

        fetchNotifications();
    }, []);

    return(

        <DashboardLayout role="faculty" title="Notifications">

            {loading && <p>Loading notifications...</p>}

            {error && <p className="notification-error">{error}</p>}

            {!loading && !error && notifications.length === 0 && (
                <p>No notifications yet.</p>
            )}

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

                            </div>
                        );
                    })
                }

            </div>

        </DashboardLayout>

    );

}

export default Notifications;
