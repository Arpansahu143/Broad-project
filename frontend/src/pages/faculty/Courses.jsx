import DashboardLayout from "../../components/DashboardLayout";
import "../student/Courses.css";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { FaBook, FaGraduationCap, FaUsers } from "react-icons/fa";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const response = await api.get("/courses/my");
        setCourses(response.data.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load your courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  return (
    <DashboardLayout role="faculty" title="My Courses">
      {loading && <p style={{ padding: "16px" }}>Loading your courses...</p>}
      {error && <p style={{ padding: "16px", color: "#ef4444" }}>{error}</p>}

      {!loading && !error && courses.length === 0 && (
        <p style={{ padding: "16px" }}>
          You aren't assigned to teach any courses yet. Ask an Admin to assign
          you to a course.
        </p>
      )}

      {!loading && !error && courses.length > 0 && (
        <div className="courses-grid">
          {courses.map((course) => (
            <div className="course-card" key={course.id}>
              <div className="course-icon">
                <FaBook />
              </div>
              <h3>{course.name}</h3>
              <p className="course-code">{course.code}</p>
              <div className="course-info">
                <p>
                  <FaGraduationCap />
                  {course.credits} Credits
                </p>
                <p>
                  <FaUsers />
                  {course._count?.enrollments ?? 0} Enrolled
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default Courses;
