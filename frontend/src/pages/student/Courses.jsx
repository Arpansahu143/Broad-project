import DashboardLayout from "../../components/DashboardLayout";
import "./Courses.css";
import { useEffect, useState } from "react";
import api from "../../api/axios";

import {
  FaBook,
  FaUserTie,
  FaClock,
  FaGraduationCap,
} from "react-icons/fa";

function Courses() {
  const [myCourses, setMyCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrollingId, setEnrollingId] = useState(null);

  const loadData = async () => {
    try {
      const [mineRes, allRes] = await Promise.all([
        api.get("/courses/my"),
        api.get("/courses"),
      ]);
      setMyCourses(mineRes.data.data);
      setAllCourses(allRes.data.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const enrolledCourseIds = new Set(
    myCourses.map((enrollment) => enrollment.course.id)
  );
  const availableCourses = allCourses.filter(
    (course) => !enrolledCourseIds.has(course.id)
  );

  const handleEnroll = async (courseId) => {
    setEnrollingId(courseId);
    try {
      await api.post(`/courses/${courseId}/enroll`);
      await loadData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to enroll.");
    } finally {
      setEnrollingId(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="student" title="My Courses">
        <p style={{ padding: "16px" }}>Loading courses...</p>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout role="student" title="My Courses">
        <p style={{ padding: "16px", color: "#ef4444" }}>{error}</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student" title="My Courses">
      <h2 style={{ padding: "0 16px" }}>Enrolled</h2>

      {myCourses.length === 0 && (
        <p style={{ padding: "0 16px 16px" }}>
          You aren't enrolled in any courses yet — browse available courses below.
        </p>
      )}

      {myCourses.length > 0 && (
        <div className="courses-grid">
          {myCourses.map((enrollment) => (
            <div className="course-card" key={enrollment.enrollmentId}>
              <div className="course-icon">
                <FaBook />
              </div>
              <h3>{enrollment.course.name}</h3>
              <p className="course-code">{enrollment.course.code}</p>
              <div className="course-info">
                <p>
                  <FaUserTie />
                  {enrollment.course.faculty
                    ? `${enrollment.course.faculty.user?.firstName} ${enrollment.course.faculty.user?.lastName}`
                    : "Unassigned"}
                </p>
                <p>
                  <FaGraduationCap />
                  {enrollment.course.credits} Credits
                </p>
                <p>
                  <FaClock />
                  Semester {enrollment.semester}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 style={{ padding: "24px 16px 0" }}>Available Courses</h2>

      {availableCourses.length === 0 && (
        <p style={{ padding: "0 16px 16px" }}>
          No additional courses available to enroll in right now.
        </p>
      )}

      {availableCourses.length > 0 && (
        <div className="courses-grid">
          {availableCourses.map((course) => (
            <div className="course-card" key={course.id}>
              <div className="course-icon">
                <FaBook />
              </div>
              <h3>{course.name}</h3>
              <p className="course-code">{course.code}</p>
              <div className="course-info">
                <p>
                  <FaUserTie />
                  {course.faculty
                    ? `${course.faculty.user?.firstName} ${course.faculty.user?.lastName}`
                    : "Unassigned"}
                </p>
                <p>
                  <FaGraduationCap />
                  {course.credits} Credits
                </p>
              </div>
              <button
                onClick={() => handleEnroll(course.id)}
                disabled={enrollingId === course.id}
              >
                {enrollingId === course.id ? "Enrolling..." : "Enroll"}
              </button>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default Courses;
