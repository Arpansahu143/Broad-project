import DashboardLayout from "../../components/DashboardLayout";

function FacultyStudents() {
  return (
<DashboardLayout role="faculty">

<div className="page-card">

    <div className="table-header">

        <h2>Student List</h2>

        <input
            className="search-box"
            placeholder="Search student..."
        />

    </div>

    <table className="data-table">

        <thead>

            <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Department</th>
                <th>Semester</th>
                <th>Attendance</th>
                <th>Status</th>
            </tr>

        </thead>

        <tbody>

            <tr>
                <td>23CSE001</td>
                <td>Arpan Sahu</td>
                <td>CSE</td>
                <td>5th</td>
                <td>92%</td>
                <td><span className="status good">Good</span></td>
            </tr>

            <tr>
                <td>23CSE002</td>
                <td>Rahul Das</td>
                <td>CSE</td>
                <td>5th</td>
                <td>87%</td>
                <td><span className="status good">Good</span></td>
            </tr>

            <tr>
                <td>23CSE003</td>
                <td>Priya Sharma</td>
                <td>CSE</td>
                <td>5th</td>
                <td>74%</td>
                <td><span className="status warning">Low</span></td>
            </tr>

        </tbody>

    </table>

</div>

</DashboardLayout>

  
  );
}

export default FacultyStudents;

