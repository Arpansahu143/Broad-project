import React from 'react';
import './FacultyDashboard.css';

import {
  FaUniversity, FaRegIdCard, FaUserGraduate, FaChalkboardTeacher,
  FaBook, FaUserClock, FaRegClipboard, FaCalendarAlt, FaBell,
  FaCog, FaUsers, FaCheckCircle, FaAngleDown, FaChevronRight,
  FaRegCalendarAlt, FaPlus, FaClock, FaFileAlt
} from 'react-icons/fa';
import { BiSearch } from 'react-icons/bi';

function FacultyDashboard() {
  // Stat cards relevant for Faculty
  const statsData = [
    { label: "Assigned Courses", value: "4", change: "Active", icon: <FaBook />, iconColor: "#6c4cf1", trendColor: "#22c55e" },
    { label: "Total Students", value: "240", change: "+12", icon: <FaUserGraduate />, iconColor: "#0ea5e9", trendColor: "#22c55e" },
    { label: "Avg. Attendance", value: "88.4%", change: "+2.1%", icon: <FaUserClock />, iconColor: "#34d399", trendColor: "#22c55e" },
    { label: "Pending Evaluations", value: "18", change: "Due soon", icon: <FaRegClipboard />, iconColor: "#ef4444", trendColor: "#ef4444" },
  ];

  // Faculty Sidebar Menu
  const menuItems = [
    { label: "Dashboard", icon: <FaRegIdCard />, active: true },
    { label: "Attendance", icon: <FaUserClock /> },
    { label: "Courses", icon: <FaBook /> },
    { label: "Students", icon: <FaUserGraduate /> },
    { label: "Examinations", icon: <FaRegClipboard /> },
    { label: "Notifications", icon: <FaBell /> },
    { label: "Settings", icon: <FaCog /> },
  ];

  // Today's Class Schedule
  const classSchedule = [
    { code: "CS-301", name: "Data Structures & Algorithms", time: "10:00 AM - 11:30 AM", room: "Lab 302", students: 60 },
    { code: "CS-405", name: "Operating Systems", time: "01:00 PM - 02:30 PM", room: "Hall B", students: 55 },
    { code: "CS-202", name: "Object-Oriented Programming", time: "03:00 PM - 04:30 PM", room: "Room 108", students: 65 },
  ];

  // Pending Submissions to grade
  const pendingGrading = [
    { title: "Mid-Term Project Report", course: "CS-301", count: 12, deadline: "Today" },
    { title: "Lab Assignment #4", course: "CS-405", count: 6, deadline: "Tomorrow" },
  ];

  return (
    <div className="admin-layout">
      {/* ===================== SIDEBAR ===================== */}
      <aside className="sidebar">
        <div className="logo-section">
          <FaUniversity className="uni-logo-icon" />
          <div className="logo-text">
            <h1>University MIS</h1>
            <p>Faculty Portal</p>
          </div>
        </div>

        <nav className="side-menu">
          {menuItems.map((item, idx) => (
            <a key={idx} href="#" className={item.active ? "menu-item active" : "menu-item"}>
              {item.icon}
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="profile-section">
          <div className="profile-img-placeholder faculty-avatar">DR</div>
          <div className="profile-info">
            <span className="name">Dr. Rajesh Sharma</span>
            <span className="role">Associate Professor</span>
          </div>
          <FaChevronRight className="p-arrow" />
        </div>
      </aside>

      {/* ===================== MAIN CONTENT ===================== */}
      <main className="main-content">
        <header className="main-header">
          <div className="search-bar">
            <BiSearch className="search-icon" />
            <input type="search" placeholder="Search courses, students..." />
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
          <h1>Faculty Dashboard</h1>
          <h2>Welcome back, Dr. Sharma! 👋</h2>
          <p>Here is your schedule and class overview for today.</p>
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

        {/* ===================== SCHEDULE & QUICK ACTION ===================== */}
        <div className="analytics-section">
          {/* Today's Schedule Panel */}
          <div className="panel">
            <div className="panel-header">
              <h3>Today's Lecture Schedule</h3>
              <a href="#" className="view-all">Full Timetable</a>
            </div>
            <div className="schedule-list">
              {classSchedule.map((cls, idx) => (
                <div key={idx} className="schedule-card">
                  <div className="class-badge">{cls.code}</div>
                  <div className="class-info">
                    <span className="class-title">{cls.name}</span>
                    <span className="class-meta"><FaClock /> {cls.time} • <strong>{cls.room}</strong></span>
                  </div>
                  <button className="mark-attendance-btn">
                    <FaCheckCircle /> Mark Attendance
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Tasks / Grading Panel */}
          <div className="dept-panel">
            <div className="panel-header">
              <h3>Pending Evaluations</h3>
            </div>
            <div className="grading-list">
              {pendingGrading.map((item, idx) => (
                <div key={idx} className="grading-item">
                  <div className="grading-icon"><FaFileAlt /></div>
                  <div className="grading-info">
                    <span className="g-title">{item.title}</span>
                    <span className="g-meta">{item.course} • <strong>{item.count} submissions</strong></span>
                  </div>
                  <span className="due-tag">{item.deadline}</span>
                </div>
              ))}
            </div>
            <button className="upload-marks-btn">
              <FaPlus /> Upload New Assessment
            </button>
          </div>
        </div>

        <footer className="admin-footer">
          © 2026 University MIS. All rights reserved.
        </footer>
      </main>
    </div>
  );
}

export default FacultyDashboard;