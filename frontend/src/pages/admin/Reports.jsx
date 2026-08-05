import DashboardLayout from "../../components/DashboardLayout";
import "./Reports.css";

import { useEffect, useState } from "react";
import api from "../../api/axios";

import {

    FaUserGraduate,

    FaChalkboardTeacher,

    FaMoneyBillWave,

    FaBook,

    FaDownload,

    FaChartLine,

    FaUniversity

} from "react-icons/fa";

function Reports(){

    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await api.get("/reports/summary");
                setSummary(response.data.data);
            } catch (err) {
                console.error("Failed to load report summary:", err);
                setError("Could not load report data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    return(

        <DashboardLayout

            role="admin"

            title="Reports & Analytics"

        >

            {loading && <p>Loading report data...</p>}

            {error && <p className="report-error">{error}</p>}

            {!loading && !error && (

            <>

            <div className="report-cards">

                <div className="report-card">

                    <FaUserGraduate/>

                    <h2>

                        {summary.totalStudents}

                    </h2>

                    <p>

                        Total Students

                    </p>

                </div>

                <div className="report-card">

                    <FaChalkboardTeacher/>

                    <h2>

                        {summary.totalFaculty}

                    </h2>

                    <p>

                        Faculty Members

                    </p>

                </div>

                <div className="report-card">

                    <FaBook/>

                    <h2>

                        {summary.totalCourses}

                    </h2>

                    <p>

                        Active Courses

                    </p>

                </div>

                <div className="report-card report-card-disabled">

                    <FaMoneyBillWave/>

                    <h2>

                        N/A

                    </h2>

                    <p>

                        Fee Collection (not yet tracked)

                    </p>

                </div>

            </div>

            <div className="analytics-grid">

                <div className="chart-card">

                    <div className="card-header">

                        <h3>

                            Student Growth

                        </h3>

                        <FaChartLine/>

                    </div>

                    <div className="chart-placeholder">

                        <p className="chart-unavailable">
                            Growth-over-time data isn't tracked yet — this chart is a visual placeholder.
                        </p>

                    </div>

                </div>

                <div className="download-card">

                    <FaUniversity/>

                    <h3>

                        Generate Reports

                    </h3>

                    <p className="download-unavailable">
                        Report export isn't built yet. The live data above is real; PDF/CSV generation is a separate feature.
                    </p>

                </div>

            </div>

            <div className="department-table">

                <table>

                    <thead>

                        <tr>

                            <th>Department</th>

                            <th>Students</th>

                            <th>Faculty</th>

                            <th>Courses</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            summary.departments.map(

                                (dept)=>(

                                    <tr key={dept.id}>

                                        <td>{dept.name}</td>

                                        <td>{dept.students}</td>

                                        <td>{dept.faculty}</td>

                                        <td>{dept.courses}</td>

                                    </tr>

                                )

                            )

                        }

                    </tbody>

                </table>

            </div>

            </>

            )}

        </DashboardLayout>

    );

}

export default Reports;