import DashboardLayout from "../../components/DashboardLayout";
import "./Students.css";

function FacultyCourses() {
  return (
    <DashboardLayout role="faculty" title="Courses">

      <div className="page-card">

        <div className="table-header">
          <h2>Assigned Courses</h2>

          <input
            type="text"
            placeholder="Search course..."
            className="search-box"
          />
        </div>
      
        <table className="data-table">

          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Semester</th>
              <th>Students</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td>CSE301</td>
              <td>Database Management System</td>
              <td>5th</td>
              <td>60</td>
              <td><span className="status good">Active</span></td>
            </tr>

            <tr>
              <td>CSE302</td>
              <td>Operating Systems</td>
              <td>5th</td>
              <td>58</td>
              <td><span className="status good">Active</span></td>
            </tr>

            <tr>
              <td>CSE303</td>
              <td>Computer Networks</td>
              <td>5th</td>
              <td>62</td>
              <td><span className="status good">Active</span></td>
            </tr>

          </tbody>

        </table>

      </div>

    </DashboardLayout>
  );
}

export default FacultyCourses;