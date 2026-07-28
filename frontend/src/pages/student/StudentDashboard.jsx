import React, { useEffect, useState } from "react";
import './StudentDashboard.css';
import { NavLink } from "react-router-dom";

import {
  FaUniversity, FaRegIdCard, FaUserGraduate, FaBook,
  FaUserClock, FaRegClipboard, FaBell, FaCog, FaChevronRight,
  FaRegCalendarAlt, FaAngleDown, FaClock, FaExclamationTriangle,
  FaCheckCircle, FaGraduationCap
} from 'react-icons/fa';
import { BiSearch } from 'react-icons/bi';

function StudentDashboard() {
  const [user, setUser] = useState(null);

useEffect(() => {
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  if (loggedInUser) {
    setUser(loggedInUser);
  }
}, []);
  // Stat cards for Student View
  const statsData = [
    { label: "Overall GPA", value: "3.84", change: "+0.12", icon: <FaGraduationCap />, iconColor: "#6c4cf1", trendColor: "#22c55e" },
    { label: "Attendance", value: "92.5%", change: "+1.5%", icon: <FaUserClock />, iconColor: "#34d399", trendColor: "#22c55e" },
    { label: "Enrolled Courses", value: "6", change: "Active", icon: <FaBook />, iconColor: "#0ea5e9", trendColor: "#22c55e" },
    { label: "Pending Tasks", value: "3", change: "Due Soon", icon: <FaRegClipboard />, iconColor: "#ef4444", trendColor: "#ef4444" },
  ];

  // Student Sidebar Menu
  const menuItems = [
  {
    label: "Dashboard",
    icon: <FaRegIdCard />,
    path: "/student/dashboard",
  },
  {
    label: "Attendance",
    icon: <FaUserClock />,
    path: "/student/attendance",
  },
  {
    label: "Courses",
    icon: <FaBook />,
    path: "/student/courses",
  },
  {
    label: "Notifications",
    icon: <FaBell />,
    path: "/student/notifications",
  },
  {
    label: "Profile",
    icon: <FaUserGraduate />,
    path: "/student/profile",
  }
];

  // Enrolled Courses with Attendance Progress
  const courseProgress = [
    { code: "CS-301", name: "Data Structures & Algorithms", instructor: "Dr. Rajesh Sharma", attendance: "95%", color: "#6c4cf1" },
    { code: "CS-302", name: "Database Management Systems", instructor: "Prof. Ananya Roy", attendance: "88%", color: "#0ea5e9" },
    { code: "CS-303", name: "Computer Networks", instructor: "Dr. Vikram Singh", attendance: "92%", color: "#34d399" },
    { code: "CS-304", name: "Software Engineering", instructor: "Prof. Priya Nair", attendance: "85%", color: "#a855f7" },
  ];

  // Upcoming Assignments & Quizzes
  const upcomingAssignments = [
    { title: "Binary Trees Assignment", course: "CS-301", dueDate: "Tomorrow, 11:59 PM", status: "Urgent" },
    { title: "SQL Queries Lab Report", course: "CS-302", dueDate: "29 July 2026", status: "Pending" },
    { title: "Networking Quiz 2", course: "CS-303", dueDate: "02 August 2026", status: "Upcoming" },
  ];

  return (
    <div className="admin-layout">
      {/* ===================== SIDEBAR ===================== */}
      <aside className="sidebar">
        <div className="logo-section">
          <FaUniversity className="uni-logo-icon" />
          <div className="logo-text">
            <h1>University MIS</h1>
            <p>Student Portal</p>
          </div>
        </div>

        <nav className="side-menu">
  {menuItems.map((item, idx) => (
    <NavLink
      key={idx}
      to={item.path}
      className={({ isActive }) =>
        isActive ? "menu-item active" : "menu-item"
      }
    >
      {item.icon}
      <span>{item.label}</span>
    </NavLink>
  ))}
</nav>

        <div className="profile-section">
          <div className="profile-img-placeholder student-avatar">RK</div>
          <div className="profile-info">
            <span className="name">
  {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
</span>
            <span className="role">
  {user?.role || "STUDENT"}
</span>
          </div>
          <FaChevronRight className="p-arrow" />
        </div>
      </aside>

      {/* ===================== MAIN CONTENT ===================== */}
      <main className="main-content">
        <header className="main-header">
          <div className="search-bar">
            <BiSearch className="search-icon" />
            <input type="search" placeholder="Search courses, assignments..." />
          </div>
          <div className="header-actions">
            <button className="h-btn"><FaBell /></button>
            <button className="h-btn date-selector">
              <FaRegCalendarAlt />
              <span>26 July 2026</span>
              <FaAngleDown />
            </button>
          </div>
        </header>

        <section className="dashboard-hero">
          <h1>Student Dashboard</h1>
          <h2>
  Welcome back, {user?.firstName || "Student"}! 👋
</h2>
          <p>Here is your current academic performance and schedule overview.</p>
        </section>

        {/* ===================== STAT CARDS ===================== */}
        <section className="stats-grid">
          {statsData.map((stat, idx) => (
            <div key={idx} className="stat-card">
              <div className="stat-header">
                <div className="stat-icon" style={{ color: stat.iconColor, background: `${stat.iconColor}15` }}>
                  {stat.icon}
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
              <div className="stat-main">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-change" style={{ color: stat.trendColor }}>
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* ===================== COURSES & ASSIGNMENTS ===================== */}
        <div className="analytics-section">
          {/* Enrolled Courses Progress */}
          <div className="panel">
            <div className="panel-header">
              <h3>Enrolled Courses & Attendance</h3>
              <a href="#" className="view-all">View All Courses</a>
            </div>
            <div className="dept-list">
              {courseProgress.map((course, idx) => (
                <div key={idx} className="dept-item">
                  <div className="dept-info">
                    <span className="dept-name"><strong>{course.code}</strong>: {course.name}</span>
                    <span className="dept-counts">{course.attendance} Attendance</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar" style={{ width: course.attendance, background: course.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Submissions / Deadlines */}
          <div className="dept-panel">
            <div className="panel-header">
              <h3>Upcoming Assignments</h3>
            </div>
            <div className="student-task-list">
              {upcomingAssignments.map((task, idx) => (
                <div key={idx} className="task-card">
                  <div className="task-header-row">
                    <span className="task-course">{task.course}</span>
                    <span className={`task-badge ${task.status.toLowerCase()}`}>{task.status}</span>
                  </div>
                  <span className="task-title">{task.title}</span>
                  <span className="task-due"><FaClock /> {task.dueDate}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer className="admin-footer">
          © 2026 University MIS. All rights reserved.
        </footer>
      </main>
    </div>
  );
}

export default StudentDashboard;