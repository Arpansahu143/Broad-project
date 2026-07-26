import DashboardLayout from "../../components/DashboardLayout";
import "./Reports.css";

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

    const departments=[

        {

            name:"Computer Science",

            students:820,

            faculty:42,

            courses:38

        },

        {

            name:"Electronics",

            students:610,

            faculty:31,

            courses:29

        },

        {

            name:"Mechanical",

            students:540,

            faculty:27,

            courses:25

        },

        {

            name:"Information Technology",

            students:450,

            faculty:21,

            courses:19

        }

    ];

    return(

        <DashboardLayout

            role="admin"

            title="Reports & Analytics"

        >

            <div className="report-cards">

                <div className="report-card">

                    <FaUserGraduate/>

                    <h2>

                        2,420

                    </h2>

                    <p>

                        Total Students

                    </p>

                </div>

                <div className="report-card">

                    <FaChalkboardTeacher/>

                    <h2>

                        121

                    </h2>

                    <p>

                        Faculty Members

                    </p>

                </div>

                <div className="report-card">

                    <FaBook/>

                    <h2>

                        111

                    </h2>

                    <p>

                        Active Courses

                    </p>

                </div>

                <div className="report-card">

                    <FaMoneyBillWave/>

                    <h2>

                        $1.24M

                    </h2>

                    <p>

                        Fee Collection

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

                        <div className="bar b1"></div>

                        <div className="bar b2"></div>

                        <div className="bar b3"></div>

                        <div className="bar b4"></div>

                        <div className="bar b5"></div>

                        <div className="bar b6"></div>

                    </div>

                </div>

                <div className="download-card">

                    <FaUniversity/>

                    <h3>

                        Generate Reports

                    </h3>

                    <button>

                        <FaDownload/>

                        Student Report

                    </button>

                    <button>

                        <FaDownload/>

                        Faculty Report

                    </button>

                    <button>

                        <FaDownload/>

                        Financial Report

                    </button>

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

                            departments.map(

                                (dept,index)=>(

                                    <tr key={index}>

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

        </DashboardLayout>

    );

}

export default Reports;