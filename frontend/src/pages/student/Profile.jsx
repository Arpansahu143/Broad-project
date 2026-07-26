import DashboardLayout from "../../components/DashboardLayout";
import "./Profile.css";

function Profile() {

    return (

        <DashboardLayout

            role="student"

            title="My Profile"

        >

            <div className="profile-container">

                <div className="profile-card">

                    <div className="profile-header">

                        <img

                            src="/images/profile.png"

                            alt="Profile"

                        />

                        <div>

                            <h2>

                                Arpan Sahu

                            </h2>

                            <p>

                                B.Tech Computer Science & Engineering

                            </p>

                            <span>

                                Student ID : SOA2301045

                            </span>

                        </div>

                    </div>

                    <div className="profile-grid">

                        <div className="profile-item">

                            <label>Email</label>

                            <p>arpan@soa.ac.in</p>

                        </div>

                        <div className="profile-item">

                            <label>Phone</label>

                            <p>+91 9876543210</p>

                        </div>

                        <div className="profile-item">

                            <label>Semester</label>

                            <p>5th Semester</p>

                        </div>

                        <div className="profile-item">

                            <label>Department</label>

                            <p>Computer Science & Engineering</p>

                        </div>

                        <div className="profile-item">

                            <label>CGPA</label>

                            <p>8.59</p>

                        </div>

                        <div className="profile-item">

                            <label>Attendance</label>

                            <p>92%</p>

                        </div>

                        <div className="profile-item">

                            <label>Address</label>

                            <p>Bhubaneswar, Odisha</p>

                        </div>

                        <div className="profile-item">

                            <label>Admission Year</label>

                            <p>2023</p>

                        </div>

                    </div>

                </div>

            </div>

        </DashboardLayout>

    );

}

export default Profile;