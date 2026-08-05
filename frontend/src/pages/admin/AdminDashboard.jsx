import React from 'react';
import './AdminDashboard.css';
import Sidebar from "../../components/Sidebar";
// Make sure to install: charts.css
import 'charts.css';

// Icons
import {
  FaUniversity, FaRegIdCard, FaUserGraduate, FaChalkboardTeacher,
  FaBook, FaUserClock, FaRegClipboard, FaCoins, FaHotel,
  FaBuilding, FaCalendarAlt, FaChartLine, FaRegFileAlt, FaCog,
  FaBell, FaAngleDown, FaUsers, FaPercent, FaMoneyBillWave,
  FaFileAlt, FaChevronRight, FaRegCalendarAlt, FaAngleRight,
  FaRegTimesCircle
} from 'react-icons/fa';
import { BiSearch } from 'react-icons/bi';

function AdminDashboard() {
  // 1. Data for the Stat Cards
  const statsData = [
    { label: "Total Students", value: "12,532", change: "8.2%", icon: <FaUserGraduate />, iconColor: "#6c4cf1", trendColor: "#22c55e" },
    { label: "Total Faculty", value: "845", change: "6.1%", icon: <FaChalkboardTeacher />, iconColor: "#6c4cf1", trendColor: "#22c55e" },
    { label: "Total Courses", value: "213", change: "4.3%", icon: <FaBook />, iconColor: "#6c4cf1", trendColor: "#22c55e" },
    { label: "Revenue", value: "₹2.8 Cr", change: "12.4%", icon: <FaMoneyBillWave />, iconColor: "#34d399", trendColor: "#22c55e" },
    { label: "Pending Fees", value: "₹54.6 L", change: "3.2%", icon: <FaRegFileAlt />, iconColor: "#ef4444", trendColor: "#ef4444" },
  ];

  // 2. Data for the Sidebar Menu
  const menuItems = [
    { label: "Dashboard", icon: <FaRegIdCard />, active: true },
    { label: "Admissions", icon: <FaRegIdCard /> },
    { label: "Students", icon: <FaUserGraduate /> },
    { label: "Faculty", icon: <FaChalkboardTeacher /> },
    { label: "Courses", icon: <FaBook /> },
    { label: "Attendance", icon: <FaUserClock /> },
    { label: "Examinations", icon: <FaRegClipboard /> },
    { label: "Fee Management", icon: <FaCoins /> },
    { label: "Hostel", icon: <FaHotel /> },
    { label: "Library", icon: <FaBuilding /> },
    { label: "Events", icon: <FaCalendarAlt /> },
    { label: "Notifications", icon: <FaBell /> },
    { label: "Analytics", icon: <FaChartLine /> },
    { label: "Reports", icon: <FaRegFileAlt /> },
    { label: "Settings", icon: <FaCog /> },
  ];

  // 3. Data for Recent Admissions
  const recentAdmissions = [
    { name: "Rohan Kumar", degree: "B.Tech CSE", date: "26 Jul 2026" },
    { name: "Sneha Patil", degree: "BBA", date: "26 Jul 2026" },
    { name: "Aditya Verma", degree: "B.Sc Mathematics", date: "25 Jul 2026" },
  ];

  // 4. Data for Top Departments
  const topDepartments = [
    { name: "Computer Science", students: "2,342", color: "#6c4cf1" },
    { name: "Mechanical Engineering", students: "980", color: "#0ea5e9" },
    { name: "Electronics & Comm.", students: "875", color: "#34d399" },
    { name: "Civil Engineering", students: "654", color: "#ef4444" },
    { name: "Business Administration", students: "512", color: "#a855f7" },
  ];

  return (
    <div className="admin-layout">
      {/* ===================== SIDEBAR ===================== */}
      <Sidebar role="admin" />
      {/* ===================== MAIN CONTENT ===================== */}
      <main className="main-content">
        <header className="main-header">
          <div className="search-bar">
            <BiSearch className="search-icon" />
            <input type="search" placeholder="Search..." />
          </div>
          <div className="header-actions">
            <button className="h-btn"><FaUsers /></button>
            <button className="h-btn"><FaBell /></button>
            <button className="h-btn date-selector">
              <FaRegCalendarAlt />
              <span>26 July 2026</span>
              <FaAngleDown />
            </button>
          </div>
        </header>

        <section className="dashboard-hero">
          <h1>Dashboard</h1>
          <h2>Welcome back, Arpan! 👋</h2>
          <p>Here's your university overview.</p>
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
                  {stat.change} <span className="arrow">▲</span>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* ===================== ANALYTICS ===================== */}
        <div className="analytics-section">
          <div className="chart-panel">
            <div className="panel-header">
              <h3>University Analytics</h3>
              <div className="header-actions">
                <span className="active">Overview</span>
                <span>This Month <FaAngleDown /></span>
              </div>
            </div>
            
            {/* Legend */}
            <div className="chart-legend">
              <div className="leg-item"><span className="dot" style={{background: "#6c4cf1"}}></span> Students</div>
              <div className="leg-item"><span className="dot" style={{background: "#34d399"}}></span> Attendance</div>
              <div className="leg-item"><span className="dot" style={{background: "#ef4444"}}></span> Revenue</div>
            </div>

            {/* Line Chart Area */}
            <div className="line-chart-wrapper">
              <div className="chart-graph">
                <div className="y-axis"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div>
                <div className="graph-grid"></div>
                
                <svg className="graph-lines" viewBox="0 0 100 60" preserveAspectRatio="none">
                  {/* Purple Line (Students) */}
                  <path d="M 5 45 C 10 35, 15 35, 20 40 S 30 50, 35 45 S 45 35, 50 40 S 60 50, 65 45 S 75 35, 80 40 S 90 50, 95 45" stroke="#6c4cf1" strokeWidth="1.5" fill="none" />
                  {/* Green Line (Attendance) */}
                  <path d="M 5 50 C 10 40, 15 40, 20 45 S 30 55, 35 50 S 45 40, 50 45 S 60 55, 65 50 S 75 40, 80 45 S 90 55, 95 50" stroke="#34d399" strokeWidth="1.5" fill="none" strokeDasharray="3 3"/>
                  {/* Red Line (Revenue) */}
                  <path d="M 5 55 C 10 45, 15 45, 20 50 S 30 60, 35 55 S 45 45, 50 50 S 60 60, 65 55 S 75 45, 80 50 S 90 60, 95 55" stroke="#ef4444" strokeWidth="1.5" fill="none"/>
                </svg>

                <div className="x-axis"><span>Jul 1</span><span>Jul 8</span><span>Jul 15</span><span>Jul 22</span><span>Jul 29</span></div>
              </div>
            </div>
          </div>

          {/* Top Departments */}
          <div className="dept-panel">
            <div className="panel-header">
              <h3>Top Departments</h3>
            </div>
            <div className="dept-list">
              {topDepartments.map((dept, idx) => (
                <div key={idx} className="dept-item">
                  <div className="dept-info">
                    <span className="dept-name">{dept.name}</span>
                    <span className="dept-counts">{dept.students} Students</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar" style={{ width: `${(idx + 2) * 10}%`, background: dept.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===================== BOTTOM SECTION ===================== */}
        <section className="dashboard-bottom-grid">
          {/* Recent Admissions */}
          <div className="card panel recent-admissions">
            <div className="panel-header">
              <h3>Recent Admissions</h3>
              <a href="#" className="view-all">View All</a>
            </div>
            <div className="adm-list">
              {recentAdmissions.map((adm, idx) => (
                <div key={idx} className="adm-item">
                  <div className="adm-avatar-placeholder">{adm.name.substring(0, 2)}</div>
                  <div className="adm-info">
                    <span className="adm-name">{adm.name}</span>
                    <span className="adm-degree">{adm.degree}</span>
                  </div>
                  <div className="adm-date">{adm.date}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="card panel upcoming-events">
            <div className="panel-header">
              <h3>Upcoming Events</h3>
              <a href="#" className="view-all">View Calendar</a>
            </div>
            <div className="event-list">
              <div className="event-item">
                <div className="event-calendar">
                  <span className="month">JUL</span>
                  <span className="day">28</span>
                </div>
                <div className="event-details">
                  <span className="event-name">Freshers Orientation</span>
                  <span className="event-time">28 July 2026 • 10:00 AM</span>
                </div>
                <FaAngleRight className="arrow" />
              </div>
              <div className="event-item">
                <div className="event-calendar">
                  <span className="month">AUG</span>
                  <span className="day">05</span>
                </div>
                <div className="event-details">
                  <span className="event-name">Mid-Semester Exams</span>
                  <span className="event-time">05 Aug 2026 • 09:00 AM</span>
                </div>
                <FaAngleRight className="arrow" />
              </div>
            </div>
          </div>

          {/* Important Alerts */}
          <div className="card panel important-alerts">
            <div className="panel-header">
              <h3>Important Alerts</h3>
            </div>
            <div className="alert-list">
              <div className="alert-item urgent">
                <FaBell className="alert-icon" />
                <span className="alert-text">Fee payment reminder for July</span>
              </div>
              <div className="alert-item reminder">
                <FaChalkboardTeacher className="alert-icon" />
                <span className="alert-text">Mid semester exam schedule released</span>
              </div>
              <div className="alert-item info">
                <FaRegTimesCircle className="alert-icon" />
                <span className="alert-text">Library will remain closed on Sunday</span>
              </div>
            </div>
          </div>
        </section>

        <footer className="admin-footer">
          © 2026 University MIS. All rights reserved.
        </footer>
      </main>
    </div>
  );
}

export default AdminDashboard;