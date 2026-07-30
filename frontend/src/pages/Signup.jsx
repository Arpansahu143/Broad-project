import api from "../api/axios";
import "./Signup.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaMicrosoft,
  FaUserGraduate,
  FaUserTie,
  FaShieldAlt,
  FaArrowRight,
  FaIdCard
} from "react-icons/fa";

function Signup() {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form state
  const [fullName, setFullName] = useState("");
  const [identifier, setIdentifier] = useState(""); // Roll No / Employee ID / Admin ID
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRoleChange = (e, selectedRole) => {
    e.preventDefault();
    setRole(selectedRole);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Backend splits full name into firstName/lastName.
    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || firstName;

    try {
      const response = await api.post("/auth/register", {
        firstName,
        lastName,
        email,
        password,
        role: role.toUpperCase(),
      });

      const { user, accessToken, refreshToken } = response.data.data;

      // Store login info immediately, same as the Login page,
      // since registration also returns valid tokens.
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      switch (user.role) {
        case "STUDENT":
          navigate("/student/dashboard");
          break;
        case "FACULTY":
          navigate("/faculty/dashboard");
          break;
        case "ADMIN":
          navigate("/admin/dashboard");
          break;
        default:
          navigate("/login");
      }
    } catch (error) {
      console.error(error);
      const fieldErrors = error.response?.data?.errors;
      if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
        alert(fieldErrors.map((e) => e.msg).join("\n"));
      } else {
        alert(
          error.response?.data?.message ||
            "Something went wrong during signup. Please try again."
        );
      }
    }
  };

  return (
    <div
      className="signup-page"
      style={{
        backgroundImage: "url('/images/college.webp')"
      }}
    >
      <div className="overlay">
        {/* Background Decorative Grid Elements */}
        <div className="grid-dots top-left"></div>
        <div className="grid-dots bottom-right"></div>

        <div className="signup-container">
          {/* Top Logo Header */}
          <div className="logo-header">
            <img
              src="/images/logo.webp"
              alt="University Logo"
              className="university-logo"
            />
            <div className="logo-text">
              <h1>
                UNIVERSITY <span>MIS</span>
              </h1>
              <p>Management Information System</p>
            </div>
          </div>

          {/* Signup Card Container */}
          <div className="signup-card">
            <h2>Create Account</h2>
            <p className="signup-subtitle">Register to join your university portal</p>

            {/* Role Switcher Tabs */}
            <div className="role-selector-wrapper">
              <div className="role-selector">
                <button
                  type="button"
                  className={role === "student" ? "active" : ""}
                  onClick={(e) => handleRoleChange(e, "student")}
                >
                  <FaUserGraduate /> Student
                </button>
                <button
                  type="button"
                  className={role === "faculty" ? "active" : ""}
                  onClick={(e) => handleRoleChange(e, "faculty")}
                >
                  <FaUserTie /> Faculty
                </button>
                <button
                  type="button"
                  className={role === "admin" ? "active" : ""}
                  onClick={(e) => handleRoleChange(e, "admin")}
                >
                  <FaShieldAlt /> Admin
                </button>
              </div>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <FaIdCard className="input-icon" />
                <input
                  type="text"
                  placeholder={
                    role === "student"
                      ? "Student ID / Roll No"
                      : role === "faculty"
                      ? "Faculty Employee ID"
                      : "Admin Security ID"
                  }
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  placeholder="Official Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <p style={{ fontSize: "0.8rem", color: "#9ca3af", margin: "-8px 0 12px 4px" }}>
                At least 8 characters, with an uppercase letter, a lowercase letter, and a number.
              </p>

              <div className="input-group">
                <FaLock className="input-icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="signup-options">
                <label className="terms">
                  <input type="checkbox" required />
                  <span>
                    I agree to the <a href="#">Terms & Conditions</a>
                  </span>
                </label>
              </div>

              <button className="signup-button" type="submit">
                <span>Register</span>
                <FaArrowRight className="btn-arrow" />
              </button>
            </form>

            <div className="divider">
              <span>OR</span>
            </div>

            {/* Social Authentication Buttons */}
            <div className="social-buttons">
              <button type="button" className="social-btn">
                <FaGoogle className="icon-google" />
                <span>Sign up with Google</span>
              </button>
              <button type="button" className="social-btn">
                <FaMicrosoft className="icon-microsoft" />
                <span>Sign up with Microsoft</span>
              </button>
            </div>

            <div className="login-link-text">
              Already have an account? <a href="#" onClick={() => navigate("/login")}>Login</a>
            </div>
          </div>

          <div className="bottom-text">
            © 2026 University MIS. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;