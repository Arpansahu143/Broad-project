import DashboardLayout from "../../components/DashboardLayout";
import "./Courses.css";

import {

    FaSearch,

    FaPlus,

    FaEye,

    FaEdit,

    FaTrash,

    FaBook

} from "react-icons/fa";

function Courses(){

    const courses=[

        {

            code:"CSE301",

            name:"Database Management System",

            department:"Computer Science",

            faculty:"Dr. S. Mishra",

            credits:4,

            semester:"5th"

        },

        {

            code:"CSE302",

            name:"Operating System",

            department:"Computer Science",

            faculty:"Dr. A. Panda",

            credits:4,

            semester:"5th"

        },

        {

            code:"ECE205",

            name:"Digital Electronics",

            department:"Electronics",

            faculty:"Dr. R. Das",

            credits:3,

            semester:"3rd"

        },

        {

            code:"IT401",

            name:"Cloud Computing",

            department:"Information Technology",

            faculty:"Dr. B. Nayak",

            credits:4,

            semester:"7th"

        },

        {

            code:"CSE405",

            name:"Artificial Intelligence",

            department:"Computer Science",

            faculty:"Dr. P. Mohanty",

            credits:4,

            semester:"7th"

        }

    ];

    return(

        <DashboardLayout

            role="admin"

            title="Course Management"

        >

            <div className="page-header">

                <div className="search-box">

                    <FaSearch/>

                    <input

                        type="text"

                        placeholder="Search Course..."

                    />

                </div>

                <button className="add-btn">

                    <FaPlus/>

                    Add Course

                </button>

            </div>

            <div className="courses-table">

                <table>

                    <thead>

                        <tr>

                            <th>Course Code</th>

                            <th>Course Name</th>

                            <th>Department</th>

                            <th>Faculty</th>

                            <th>Credits</th>

                            <th>Semester</th>

                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            courses.map(

                                (course,index)=>(

                                    <tr key={index}>

                                        <td>

                                            <div className="course-code">

                                                <FaBook/>

                                                {course.code}

                                            </div>

                                        </td>

                                        <td>{course.name}</td>

                                        <td>{course.department}</td>

                                        <td>{course.faculty}</td>

                                        <td>{course.credits}</td>

                                        <td>{course.semester}</td>

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

export default Courses;