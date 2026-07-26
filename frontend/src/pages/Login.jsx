import "./Login.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaMicrosoft,
  FaUserGraduate,
  FaUserTie,
  FaShieldAlt,
  FaArrowRight,
  FaEnvelope,
  FaArrowLeft,
  FaCheckCircle
} from "react-icons/fa";

function Login() {
  const navigate = useNavigate();

  // Login states
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Forgot Password modal/view states
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const handleRoleChange = (e, selectedRole) => {
    e.preventDefault();
    setRole(selectedRole);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    // Explicit switch routing based on selected role
    switch (role) {
      case "student":
        navigate("/student/dashboard");
        break;
      case "faculty":
        navigate("/faculty/dashboard");
        break;
      case "admin":
        navigate("/admin/dashboard");
        break;
      default:
        console.error("Unknown role selected:", role);
        break;
    }
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (!resetEmail) return;

    // Simulate sending password reset email
    setResetSent(true);
  };

  const resetForgotPasswordState = () => {
    setIsForgotPassword(false);
    setResetSent(false);
    setResetEmail("");
  };

  return (
    <div
      className="login-page"
      style={{
        backgroundImage: "url('/images/college.webp')"
      }}
    >
      <div className="overlay">
        {/* Background Decorative Grid Elements */}
        <div className="grid-dots top-left"></div>
        <div className="grid-dots bottom-right"></div>

        <div className="login-container">
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

          {/* Login Card Container */}
          <div className="login-card">
            {!isForgotPassword ? (
              /* ================= LOGIN FORM ================= */
              <>
                <h2>Welcome Back!</h2>
                <p className="login-subtitle">Login to access your account</p>

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

                {/* Main Login Form */}
                <form onSubmit={handleLoginSubmit}>
                  <div className="input-group">
                    <FaUser className="input-icon" />
                    <input
                      type="text"
                      placeholder="Enter your Email or Student ID"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <FaLock className="input-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your Password"
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

                  <div className="login-options">
                    <label className="remember">
                      <input type="checkbox" defaultChecked />
                      <span>Remember Me</span>
                    </label>
                    <button
                      type="button"
                      className="forgot-password-link"
                      onClick={() => setIsForgotPassword(true)}
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <button className="login-button" type="submit">
                    <span>Login</span>
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
                    <span>Login with Google</span>
                  </button>
                  <button type="button" className="social-btn">
                    <FaMicrosoft className="icon-microsoft" />
                    <span>Login with Microsoft</span>
                  </button>
                  <button type="button" className="social-btn">
                    <FaShieldAlt className="icon-sso" />
                    <span>Login with SSO</span>
                  </button>
                </div>

                {/* Absolute Redirection to Signup */}
                <div className="signup-text">
                  Don't have an account? <Link to="/signup">Sign Up</Link>
                </div>
              </>
            ) : (
              /* ================= FORGOT PASSWORD VIEW ================= */
              <div className="forgot-password-container">
                {!resetSent ? (
                  <>
                    <h2>Reset Password</h2>
                    <p className="login-subtitle">
                      Enter your registered email address and we'll send you a password reset link.
                    </p>

                    <form onSubmit={handleResetSubmit}>
                      <div className="input-group">
                        <FaEnvelope className="input-icon" />
                        <input
                          type="email"
                          placeholder="Enter your Email address"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          required
                        />
                      </div>

                      <button className="login-button" type="submit">
                        <span>Send Reset Link</span>
                        <FaArrowRight className="btn-arrow" />
                      </button>
                    </form>

                    <div className="back-to-login">
                      <button
                        type="button"
                        className="back-btn"
                        onClick={resetForgotPasswordState}
                      >
                        <FaArrowLeft /> Back to Login
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="reset-success-card">
                    <FaCheckCircle className="success-icon" />
                    <h2>Reset Link Sent!</h2>
                    <p className="login-subtitle">
                      We have sent a password reset link to <strong>{resetEmail}</strong>. Please check your inbox.
                    </p>

                    <button
                      className="login-button"
                      type="button"
                      onClick={resetForgotPasswordState}
                    >
                      <span>Return to Login</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bottom-text">
            © 2026 University MIS. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;