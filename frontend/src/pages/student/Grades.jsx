import DashboardLayout from "../../components/DashboardLayout";
import "./Attendance.css";
import { Fragment, useEffect, useState } from "react";
import api from "../../api/axios";

function Grades() {

    const [courseGrades, setCourseGrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedCourseId, setExpandedCourseId] = useState(null);

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const response = await api.get("/exams/my");
                setCourseGrades(response.data.data);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || "Failed to load grades.");
            } finally {
                setLoading(false);
            }
        };

        fetchGrades();
    }, []);

    const overallPercentage =
        courseGrades.length === 0
            ? 0
            : Math.round(
                  (courseGrades.reduce((sum, c) => sum + c.percentage, 0) /
                      courseGrades.length) *
                      10
              ) / 10;

    if (loading) {
        return (
            <DashboardLayout role="student" title="Grades">
                <p style={{ padding: "16px" }}>Loading grades...</p>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout role="student" title="Grades">
                <p style={{ padding: "16px", color: "#ef4444" }}>{error}</p>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="student" title="Grades">

            <div className="attendance-summary">
                <div className="summary-card">
                    <h2>Overall Average</h2>
                    <h1>{overallPercentage}%</h1>
                    <p>{overallPercentage >= 40 ? "Passing" : "Needs Improvement"}</p>
                </div>
            </div>

            <div className="attendance-table">
                <table>
                    <thead>
                        <tr>
                            <th>Course Code</th>
                            <th>Course Name</th>
                            <th>Average</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {courseGrades.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ textAlign: "center" }}>
                                    No grades recorded yet.
                                </td>
                            </tr>
                        )}

                        {courseGrades.map((entry) => (
                            <Fragment key={entry.course.id}>
                                <tr>
                                    <td>{entry.course.code}</td>
                                    <td>{entry.course.name}</td>
                                    <td>
                                        <div className="progress">
                                            <div
                                                className="progress-fill"
                                                style={{ width: `${entry.percentage}%` }}
                                            />
                                        </div>
                                        <span>{entry.percentage}%</span>
                                    </td>
                                    <td>
                                        <button
                                            className="add-btn"
                                            onClick={() =>
                                                setExpandedCourseId(
                                                    expandedCourseId === entry.course.id
                                                        ? null
                                                        : entry.course.id
                                                )
                                            }
                                        >
                                            {expandedCourseId === entry.course.id ? "Hide" : "Details"}
                                        </button>
                                    </td>
                                </tr>

                                {expandedCourseId === entry.course.id && (
                                    <tr key={`${entry.course.id}-detail`}>
                                        <td colSpan="4" style={{ padding: 0 }}>
                                            <table style={{ width: "100%" }}>
                                                <thead>
                                                    <tr>
                                                        <th>Exam</th>
                                                        <th>Type</th>
                                                        <th>Date</th>
                                                        <th>Marks</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {entry.grades.map((g) => (
                                                        <tr key={g.examId}>
                                                            <td>{g.title}</td>
                                                            <td>{g.examType}</td>
                                                            <td>{new Date(g.examDate).toLocaleDateString()}</td>
                                                            <td>{g.marksObtained} / {g.maxMarks}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

        </DashboardLayout>
    );
}

export default Grades;
