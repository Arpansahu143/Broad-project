import "./Landing.css";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

function Landing() {
  return (
    <div
      className="landing"
      style={{
        backgroundImage: "url('/images/college.webp')",
      }}
    >
      <div className="overlay">

        {/* ================= NAVBAR ================= */}

        <nav className="navbar">

          <div className="logo">

            <img
              src="/images/logo.webp"
              alt="University Logo"
            />

            <div>

              <h2>University MIS</h2>

              <p>Management Information System</p>

            </div>

          </div>

          <Link to="/login">

            <button className="login-btn">

              Login

            </button>

          </Link>

        </nav>



        {/* ================= HERO ================= */}

        <section className="hero">

          <div className="hero-content">

            <h1>

              Smart University

              <br />

              Management System

            </h1>

            <p>

              University MIS is a modern cloud-based platform that
              simplifies academic and administrative operations.
              Students, faculty, and administrators can securely
              access admissions, attendance, courses, examinations,
              finance, library, hostel, and analytics through one
              centralized system.

            </p>

            <div className="hero-buttons">

              <Link to="/login">

                <button className="primary-btn">

                  Login

                  <FaArrowRight />

                </button>

              </Link>

            </div>

          </div>

        </section>



        {/* ================= FOOTER ================= */}

        <footer>

          © 2026 University MIS. All Rights Reserved.

        </footer>

      </div>
    </div>
  );
}

export default Landing;