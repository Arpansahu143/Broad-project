import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ================= PUBLIC =================
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// ================= STUDENT =================
import StudentDashboard from "./pages/student/StudentDashboard";
import Profile from "./pages/student/Profile";
import Courses from "./pages/student/Courses";
import Attendance from "./pages/student/Attendance";
import Notifications from "./pages/student/Notifications";

// ================= FACULTY =================
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import Students from "./pages/faculty/Students";
import FacultyCourses from "./pages/faculty/Courses";
import FacultyAttendance from "./pages/faculty/Attendance";

// ================= ADMIN =================
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/Students";
import Faculty from "./pages/admin/Faculty";
import AdminCourses from "./pages/admin/Courses";
import Reports from "./pages/admin/Reports";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ================= STUDENT ================= */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<Profile />} />
        <Route path="/student/courses" element={<Courses />} />
        <Route path="/student/attendance" element={<Attendance />} />
        <Route path="/student/notifications" element={<Notifications />} />

        {/* ================= FACULTY ================= */}
        <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
        <Route path="/faculty/students" element={<Students />} />
        <Route path="/faculty/courses" element={<FacultyCourses />} />
        <Route path="/faculty/attendance" element={<FacultyAttendance />} />

        {/* ================= ADMIN ================= */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/admin/faculty" element={<Faculty />} />
        <Route path="/admin/courses" element={<AdminCourses />} />
        <Route path="/admin/reports" element={<Reports />} />

        {/* ================= FALLBACK ROUTE ================= */}
        {/* Redirects any unknown/invalid URLs back to Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;