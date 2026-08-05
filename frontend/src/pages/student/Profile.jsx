import DashboardLayout from "../../components/DashboardLayout";
import "./Profile.css";
import { useEffect, useState } from "react";
import api from "../../api/axios";

function Profile() {

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get("/students/profile");
                setProfile(response.data.data);
            } catch (err) {
                console.error("Failed to load profile:", err);
                setError(
                    err.response?.data?.message || "Failed to load profile."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return (

        <DashboardLayout

            role="student"

            title="My Profile"

        >

            {loading && <p style={{ padding: "16px" }}>Loading profile...</p>}
            {error && <p style={{ padding: "16px", color: "#ef4444" }}>{error}</p>}

            {!loading && !error && profile && (

            <div className="profile-container">

                <div className="profile-card">

                    <div className="profile-header">

                        <img

                            src="/images/profile.png"

                            alt="Profile"

                        />

                        <div>

                            <h2>
    {profile.user?.firstName} {profile.user?.lastName}
</h2>

                            <p>

                                {profile.department?.name || "Department not assigned"}

                            </p>

                            <span>

                                Student ID : {profile.studentId}

                            </span>

                        </div>

                    </div>

                    <div className="profile-grid">

                        <div className="profile-item">

                            <label>Email</label>

                            <p>{profile.user?.email}</p>

                        </div>

                        <div className="profile-item">

                            <label>Phone</label>

                            <p>{profile.phone || "Not provided"}</p>

                        </div>

                        <div className="profile-item">

                            <label>Semester</label>

                            <p>{profile.semester ? `${profile.semester}${["st","nd","rd"][((profile.semester+90)%100-10)%10-1]||"th"} Semester` : "—"}</p>

                        </div>

                        <div className="profile-item">

                            <label>Department</label>

                            <p>{profile.department?.name || "Not assigned"}</p>

                        </div>

                        <div className="profile-item">

                            <label>CGPA</label>

                            <p>{profile.cgpa ?? "Not recorded"}</p>

                        </div>

                        <div className="profile-item">

                            <label>Attendance</label>

                            <p>{profile.attendance != null ? `${profile.attendance}%` : "Not recorded"}</p>

                        </div>

                        <div className="profile-item">

                            <label>Address</label>

                            <p>{profile.address || "Not provided"}</p>

                        </div>

                    </div>

                </div>

            </div>

            )}

        </DashboardLayout>

    );

}

export default Profile;