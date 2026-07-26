import DashboardLayout from "../../components/DashboardLayout";
import "./Students.css";

import {

    FaSearch,

    FaPlus,

    FaEdit,

    FaTrash,

    FaEye

} from "react-icons/fa";

function Students(){

    const students=[

        {

            id:"SOA230101",

            name:"Rahul Sharma",

            department:"CSE",

            semester:"5th",

            email:"rahul@soa.ac.in",

            status:"Active"

        },

        {

            id:"SOA230102",

            name:"Priya Das",

            department:"ECE",

            semester:"3rd",

            email:"priya@soa.ac.in",

            status:"Active"

        },

        {

            id:"SOA230103",

            name:"Amit Kumar",

            department:"IT",

            semester:"7th",

            email:"amit@soa.ac.in",

            status:"Inactive"

        },

        {

            id:"SOA230104",

            name:"Sneha Mishra",

            department:"CSE",

            semester:"1st",

            email:"sneha@soa.ac.in",

            status:"Active"

        }

    ];

    return(

        <DashboardLayout

            role="admin"

            title="Student Management"

        >

            <div className="page-header">

                <div className="search-box">

                    <FaSearch/>

                    <input

                        type="text"

                        placeholder="Search students..."

                    />

                </div>

                <button className="add-btn">

                    <FaPlus/>

                    Add Student

                </button>

            </div>

            <div className="students-table">

                <table>

                    <thead>

                        <tr>

                            <th>ID</th>

                            <th>Name</th>

                            <th>Department</th>

                            <th>Semester</th>

                            <th>Email</th>

                            <th>Status</th>

                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            students.map(

                                (student,index)=>(

                                    <tr key={index}>

                                        <td>{student.id}</td>

                                        <td>{student.name}</td>

                                        <td>{student.department}</td>

                                        <td>{student.semester}</td>

                                        <td>{student.email}</td>

                                        <td>

                                            <span

                                                className={

                                                    student.status==="Active"

                                                    ?

                                                    "status active"

                                                    :

                                                    "status inactive"

                                                }

                                            >

                                                {student.status}

                                            </span>

                                        </td>

                                        <td>

                                            <div className="action-btns">

                                                <button>

                                                    <FaEye/>

                                                </button>

                                                <button>

                                                    <FaEdit/>

                                                </button>

                                                <button>

                                                    <FaTrash/>

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                )

                            )

                        }

                    </tbody>

                </table>

            </div>

        </DashboardLayout>

    );

}

export default Students;