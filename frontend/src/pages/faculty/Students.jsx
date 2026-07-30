import DashboardLayout from "../../components/DashboardLayout";
import "../admin/Students.css";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { FaSearch, FaEye } from "react-icons/fa";

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get("/students");
        setStudents(response.data.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load students.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <DashboardLayout role="faculty" title="My Students">
      <div className="page-header">
        <div className="search-box">
          <FaSearch />
          <input type="text" placeholder="Search students..." />
        </div>
      </div>

      {loading && <p style={{ padding: "16px" }}>Loading students...</p>}
      {error && <p style={{ padding: "16px", color: "#ef4444" }}>{error}</p>}

      {!loading && !error && (
        <div className="students-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Semester</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.studentId}</td>
                  <td>
                    {student.user?.firstName} {student.user?.lastName}
                  </td>
                  <td>{student.department?.name || "—"}</td>
                  <td>{student.semester}</td>
                  <td>{student.user?.email}</td>
                  <td>
                    <div className="action-btns">
                      <button>
                        <FaEye />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Students;
