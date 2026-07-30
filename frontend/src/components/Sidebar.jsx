import "./Sidebar.css";

import { NavLink } from "react-router-dom";

import {
    FaTachometerAlt,
    FaUserGraduate,
    FaBook,
    FaClipboardCheck,
    FaBell,
    FaUsers,
    FaChalkboardTeacher,
    FaChartBar,
    FaSignOutAlt
} from "react-icons/fa";

function Sidebar({ role = "admin" }) {

    const studentMenu = [

        {
            name: "Dashboard",
            path: "/student/dashboard",
            icon: <FaTachometerAlt />
        },

        {
            name: "Profile",
            path: "/student/profile",
            icon: <FaUserGraduate />
        },

        {
            name: "Courses",
            path: "/student/courses",
            icon: <FaBook />
        },

        {
            name: "Attendance",
            path: "/student/attendance",
            icon: <FaClipboardCheck />
        },

        {
            name: "Notifications",
            path: "/student/notifications",
            icon: <FaBell />
        }

    ];



    const facultyMenu = [

        {
            name: "Dashboard",
            path: "/faculty/dashboard",
            icon: <FaTachometerAlt />
        },

        {
            name: "Students",
            path: "/faculty/students",
            icon: <FaUsers />
        },

        {
            name: "Courses",
            path: "/faculty/courses",
            icon: <FaBook />
        },

        {
            name: "Attendance",
            path: "/faculty/attendance",
            icon: <FaClipboardCheck />
        }

    ];



    const adminMenu = [

        {
            name: "Dashboard",
            path: "/admin/dashboard",
            icon: <FaTachometerAlt />
        },

        {
            name: "Students",
            path: "/admin/students",
            icon: <FaUsers />
        },

        {
            name: "Faculty",
            path: "/admin/faculty",
            icon: <FaChalkboardTeacher />
        },

        {
            name: "Courses",
            path: "/admin/courses",
            icon: <FaBook />
        },

        {
            name: "Reports",
            path: "/admin/reports",
            icon: <FaChartBar />
        }

    ];



    const menu =

        role === "student"

            ? studentMenu

            : role === "faculty"

            ? facultyMenu

            : adminMenu;



    return (

        <aside className="sidebar">

            <div className="sidebar-logo">

                <img

                    src="/images/logo.webp"

                    alt="logo"

                />

                <h2>

                    University MIS

                </h2>

            </div>



            <div className="sidebar-menu">

                {

                    menu.map((item, index) => (

                        <NavLink

                            key={index}

                            to={item.path}

                            className={({ isActive }) =>

                                isActive

                                    ? "menu-item active"

                                    : "menu-item"

                            }

                        >

                            {item.icon}

                            <span>

                                {item.name}

                            </span>

                        </NavLink>

                    ))

                }

            </div>



            <div className="sidebar-footer">

                <button>

                    <FaSignOutAlt />

                    Logout

                </button>

            </div>

        </aside>

    );

}

export default Sidebar;