import DashboardLayout from "../../components/DashboardLayout";
import "./Attendance.css";
import { useEffect, useState } from "react";
import api from "../../api/axios";

function Attendance() {

    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const response = await api.get("/attendance/my");
                setAttendance(response.data.data);
            } catch (err) {
                console.error(err);
                setError(
                    err.response?.data?.message || "Failed to load attendance."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, []);

    const overallPercentage =
        attendance.length === 0
            ? 0
            : Math.round(
                  (attendance.reduce((sum, a) => sum + a.percentage, 0) /
                      attendance.length) *
                      10
              ) / 10;

    if (loading) {
        return (
            <DashboardLayout role="student" title="Attendance">
                <p style={{ padding: "16px" }}>Loading attendance...</p>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout role="student" title="Attendance">
                <p style={{ padding: "16px", color: "#ef4444" }}>{error}</p>
            </DashboardLayout>
        );
    }

    return(

        <DashboardLayout

            role="student"

            title="Attendance"

        >

            <div className="attendance-summary">

                <div className="summary-card">

                    <h2>

                        Overall Attendance

                    </h2>

                    <h1>

                        {overallPercentage}%

                    </h1>

                    <p>

                        {overallPercentage >= 75 ? "Good Standing" : "Below Requirement"}

                    </p>

                </div>

                <div className="summary-card warning">

                    <h2>

                        Minimum Required

                    </h2>

                    <h1>

                        75%

                    </h1>

                    <p>

                        University Requirement

                    </p>

                </div>

            </div>

            <div className="attendance-table">

                <table>

                    <thead>

                        <tr>

                            <th>Course Code</th>

                            <th>Subject</th>

                            <th>Classes</th>

                            <th>Attendance</th>

                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            attendance.length === 0 &&

                            <tr>
                                <td colSpan="5" style={{ textAlign: "center" }}>
                                    No attendance records yet.
                                </td>
                            </tr>

                        }

                        {

                            attendance.map(

                                (item)=>(

                                    <tr key={item.course.id}>

                                        <td>

                                            {item.course.code}

                                        </td>

                                        <td>

                                            {item.course.name}

                                        </td>

                                        <td>

                                            {item.attended}/{item.totalClasses}

                                        </td>

                                        <td>

                                            <div className="progress">

                                                <div

                                                    className="progress-fill"

                                                    style={{

                                                        width:`${item.percentage}%`

                                                    }}

                                                >

                                                </div>

                                            </div>

                                            <span>

                                                {item.percentage}%

                                            </span>

                                        </td>

                                        <td>

                                            {

                                                item.percentage>=75

                                                ?

                                                <span className="good">

                                                    Good

                                                </span>

                                                :

                                                <span className="low">

                                                    Low

                                                </span>

                                            }

                                        </td>

                                    </tr>

                                )

                            )

                        }

                    </tbody>

                </table>

            </div>

        </DashboardLayout>

    );

}

export default Attendance;