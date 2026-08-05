import DashboardLayout from "../../components/DashboardLayout";
import "./Students.css";

function FacultyAttendance() {
  return (
    <DashboardLayout role="faculty" title="Attendance">

      <div className="page-card">

        <div className="table-header">
          <h2>Today's Attendance</h2>

          <input
            type="text"
            placeholder="Search student..."
            className="search-box"
          />
        </div>

        <table className="data-table">

          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Course</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td>23CSE001</td>
              <td>Arpan Sahu</td>
              <td>DBMS</td>
              <td><span className="status good">Present</span></td>
              <td><button className="action-btn">Edit</button></td>
            </tr>

            <tr>
              <td>23CSE002</td>
              <td>Rahul Das</td>
              <td>Operating Systems</td>
              <td><span className="status warning">Absent</span></td>
              <td><button className="action-btn">Edit</button></td>
            </tr>

            <tr>
              <td>23CSE003</td>
              <td>Priya Sharma</td>
              <td>Computer Networks</td>
              <td><span className="status good">Present</span></td>
              <td><button className="action-btn">Edit</button></td>
            </tr>

          </tbody>

        </table>

      </div>

    </DashboardLayout>
  );
}

export default FacultyAttendance;