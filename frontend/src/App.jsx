import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

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
        <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={["STUDENT"]}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/profile" element={<ProtectedRoute allowedRoles={["STUDENT"]}><Profile /></ProtectedRoute>} />
        <Route path="/student/courses" element={<ProtectedRoute allowedRoles={["STUDENT"]}><Courses /></ProtectedRoute>} />
        <Route path="/student/attendance" element={<ProtectedRoute allowedRoles={["STUDENT"]}><Attendance /></ProtectedRoute>} />
        <Route path="/student/notifications" element={<ProtectedRoute allowedRoles={["STUDENT"]}><Notifications /></ProtectedRoute>} />

        {/* ================= FACULTY ================= */}
        <Route path="/faculty/dashboard" element={<ProtectedRoute allowedRoles={["FACULTY"]}><FacultyDashboard /></ProtectedRoute>} />
        <Route path="/faculty/students" element={<ProtectedRoute allowedRoles={["FACULTY"]}><Students /></ProtectedRoute>} />
        <Route path="/faculty/courses" element={<ProtectedRoute allowedRoles={["FACULTY"]}><FacultyCourses /></ProtectedRoute>} />
        <Route path="/faculty/attendance" element={<ProtectedRoute allowedRoles={["FACULTY"]}><FacultyAttendance /></ProtectedRoute>} />

        {/* ================= ADMIN ================= */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/students" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminStudents /></ProtectedRoute>} />
        <Route path="/admin/faculty" element={<ProtectedRoute allowedRoles={["ADMIN"]}><Faculty /></ProtectedRoute>} />
        <Route path="/admin/courses" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminCourses /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={["ADMIN"]}><Reports /></ProtectedRoute>} />

        {/* ================= FALLBACK ROUTE ================= */}
        {/* Redirects any unknown/invalid URLs back to Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;