import React from 'react';
import './FacultyDashboard.css';
import DashboardLayout from "../../components/DashboardLayout";

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
  <DashboardLayout
    role="faculty"
    title="Faculty Dashboard"
  >
    {/* Stats */}
    <div className="faculty-stats">
      {statsData.map((item, index) => (
        <div className="stat-card" key={index}>
          <div
            className="stat-icon"
            style={{
              color: item.iconColor,
              background: `${item.iconColor}20`,
            }}
          >
            {item.icon}
          </div>

          <div className="stat-info">
            <h4>{item.label}</h4>
            <h2>{item.value}</h2>
            <span style={{ color: item.trendColor }}>
              {item.change}
            </span>
          </div>
        </div>
      ))}
    </div>

    <div className="faculty-grid">

      {/* Today's Classes */}
      <div className="faculty-card">
        <div className="card-header">
          <h3>Today's Classes</h3>
        </div>

        {classSchedule.map((cls, index) => (
          <div className="class-item" key={index}>
            <div>
              <h4>{cls.name}</h4>
              <p>{cls.code}</p>
              <small>
                {cls.time} • {cls.room}
              </small>
            </div>

            <button className="primary-btn">
              Mark Attendance
            </button>
          </div>
        ))}
      </div>

      {/* Pending Evaluations */}

      <div className="faculty-card">
        <div className="card-header">
          <h3>Pending Evaluations</h3>
        </div>

        {pendingGrading.map((item, index) => (
          <div className="evaluation-item" key={index}>
            <div>
              <h4>{item.title}</h4>
              <p>
                {item.course} • {item.count} submissions
              </p>
            </div>

            <span className="deadline">
              {item.deadline}
            </span>
          </div>
        ))}

        <button className="upload-btn">
          Upload New Assessment
        </button>
      </div>

    </div>
  </DashboardLayout>
);
}

export default FacultyDashboard;