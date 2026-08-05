import "./Navbar.css";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    FaBell,
    FaUserCircle,
    FaSearch
} from "react-icons/fa";

function Navbar() {

    const [user, setUser] = useState(null);

    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem("user"));
            if (stored) {
                setUser(stored);
            }
        } catch {
            setUser(null);
        }
    }, []);

    const displayName = user
        ? `${user.firstName} ${user.lastName}`
        : "Loading...";

    const displayRole = user
        ? user.role.charAt(0) + user.role.slice(1).toLowerCase()
        : "";

    return (

        <nav className="top-navbar">

            <div className="navbar-left">

                <h2>

                    University MIS

                </h2>

            </div>

            <div className="navbar-center">

                <div className="search-box">

                    <FaSearch />

                    <input

                        type="text"

                        placeholder="Search..."

                    />

                </div>

            </div>

            <div className="navbar-right">

                <button className="notification-btn">

                    <FaBell />

                </button>

                <div className="profile-section">

                    <FaUserCircle />

                    <div>

                        <h4>

                            {displayName}

                        </h4>

                        <p>

                            {displayRole}

                        </p>

                    </div>

                </div>

            </div>

        </nav>

    );

}

export default Navbar;