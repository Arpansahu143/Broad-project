import "./Navbar.css";

import { Link } from "react-router-dom";

import {
    FaBell,
    FaUserCircle,
    FaSearch
} from "react-icons/fa";

function Navbar() {

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

                    <span>

                        3

                    </span>

                </button>

                <div className="profile-section">

                    <FaUserCircle />

                    <div>

                        <h4>

                            Arpan Sahu

                        </h4>

                        <p>

                            Administrator

                        </p>

                    </div>

                </div>

            </div>

        </nav>

    );

}

export default Navbar;