import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import "./StudentDashboard.css";

import {
    FaGraduationCap,
    FaUserClock,
    FaBook,
    FaRegClipboard,
    FaClock
} from "react-icons/fa";

function StudentDashboard() {

    const [user, setUser] = useState(null);

    useEffect(() => {

        const loggedInUser = JSON.parse(localStorage.getItem("user"));

        if (loggedInUser) {
            setUser(loggedInUser);
        }

    }, []);

    const stats = [

        {
            title: "Overall GPA",
            value: "3.84",
            change: "+0.12",
            color: "#6c4cf1",
            icon: <FaGraduationCap />
        },

        {
            title: "Attendance",
            value: "92.5%",
            change: "+1.5%",
            color: "#10b981",
            icon: <FaUserClock />
        },

        {
            title: "Courses",
            value: "6",
            change: "Active",
            color: "#0ea5e9",
            icon: <FaBook />
        },

        {
            title: "Pending Tasks",
            value: "3",
            change: "Due Soon",
            color: "#ef4444",
            icon: <FaRegClipboard />
        }

    ];

    const courses = [

        {
            code: "CSE301",
            name: "Database Management System",
            attendance: "93%",
            color: "#6c4cf1"
        },

        {
            code: "CSE302",
            name: "Operating System",
            attendance: "89%",
            color: "#10b981"
        },

        {
            code: "CSE303",
            name: "Computer Networks",
            attendance: "84%",
            color: "#0ea5e9"
        },

        {
            code: "CSE304",
            name: "Software Engineering",
            attendance: "98%",
            color: "#f59e0b"
        }

    ];

    const tasks = [

        {
            course: "CSE301",
            title: "Binary Trees Assignment",
            due: "Tomorrow 11:59 PM",
            status: "Urgent"
        },

        {
            course: "CSE302",
            title: "SQL Lab Report",
            due: "29 July 2026",
            status: "Pending"
        },

        {
            course: "CSE303",
            title: "Networking Quiz",
            due: "02 August 2026",
            status: "Upcoming"
        }

    ];
      return (

        <DashboardLayout
            role="student"
            title="Student Dashboard"
        >

            <section className="dashboard-hero">

                <h2>
                    Welcome back, {user?.firstName || "Student"} 👋
                </h2>

                <p>
                    Here is your current academic performance and today's overview.
                </p>

            </section>

            <section className="stats-grid">

                {
                    stats.map((item,index)=>(

                        <div className="stat-card" key={index}>

                            <div
                                className="stat-icon"
                                style={{
                                    background:`${item.color}15`,
                                    color:item.color
                                }}
                            >
                                {item.icon}
                            </div>

                            <h4>{item.title}</h4>

                            <h2>{item.value}</h2>

                            <span
                                style={{
                                    color:item.color
                                }}
                            >
                                {item.change}
                            </span>

                        </div>

                    ))
                }

            </section>

            <div className="analytics-section">

                <div className="panel">

                    <div className="panel-header">

                        <h3>Enrolled Courses</h3>

                    </div>

                    {

                        courses.map((course,index)=>(

                            <div
                                className="course-card"
                                key={index}
                            >

                                <div className="course-details">

                                    <h4>

                                        {course.code}

                                    </h4>

                                    <p>

                                        {course.name}

                                    </p>

                                </div>

                                <div
                                    className="attendance-tag"
                                    style={{
                                        color:course.color
                                    }}
                                >

                                    {course.attendance}

                                </div>

                            </div>

                        ))

                    }

                </div>

                <div className="panel">

                    <div className="panel-header">

                        <h3>

                            Upcoming Tasks

                        </h3>

                    </div>

                    {

                        tasks.map((task,index)=>(

                            <div
                                className="task-card"
                                key={index}
                            >

                                <div className="task-top">

                                    <span className="course-code">

                                        {task.course}

                                    </span>

                                    <span className={task.status.toLowerCase()}>

                                        {task.status}

                                    </span>

                                </div>

                                <h4>

                                    {task.title}

                                </h4>

                                <p>

                                    <FaClock />

                                    {task.due}

                                </p>

                            </div>

                        ))

                    }

                </div>

            </div>

        </DashboardLayout>

    );

}

export default StudentDashboard;