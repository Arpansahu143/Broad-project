import DashboardLayout from "../../components/DashboardLayout";
import "./Attendance.css";

function Attendance() {

    const attendance = [

        {
            code:"CSE301",
            subject:"Database Management System",
            attended:42,
            total:45,
            percentage:93
        },

        {
            code:"CSE302",
            subject:"Operating System",
            attended:40,
            total:45,
            percentage:89
        },

        {
            code:"CSE303",
            subject:"Computer Networks",
            attended:38,
            total:45,
            percentage:84
        },

        {
            code:"CSE304",
            subject:"Software Engineering",
            attended:44,
            total:45,
            percentage:98
        },

        {
            code:"CSE305",
            subject:"Machine Learning",
            attended:39,
            total:45,
            percentage:87
        },

        {
            code:"CSE306",
            subject:"Compiler Design",
            attended:36,
            total:45,
            percentage:80
        }

    ];

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

                        88%

                    </h1>

                    <p>

                        Excellent Performance

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

                            attendance.map(

                                (item,index)=>(

                                    <tr key={index}>

                                        <td>

                                            {item.code}

                                        </td>

                                        <td>

                                            {item.subject}

                                        </td>

                                        <td>

                                            {item.attended}/{item.total}

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