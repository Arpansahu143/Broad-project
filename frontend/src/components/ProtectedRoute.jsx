import { Navigate } from "react-router-dom";

const ROLE_DASHBOARD = {
  STUDENT: "/student/dashboard",
  FACULTY: "/faculty/dashboard",
  ADMIN: "/admin/dashboard",
};

/**
 * Wraps a route so it requires a logged-in user (valid accessToken +
 * user in localStorage). Optionally restricts to specific roles.
 *
 * Usage:
 *   <Route path="/admin/dashboard" element={
 *     <ProtectedRoute allowedRoles={["ADMIN"]}>
 *       <AdminDashboard />
 *     </ProtectedRoute>
 *   } />
 */
function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("accessToken");
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Logged in, just not allowed on this specific route — send them
    // to their own dashboard instead of kicking them out entirely.
    return <Navigate to={ROLE_DASHBOARD[user.role] || "/login"} replace />;
  }

  return children;
}

export default ProtectedRoute;
