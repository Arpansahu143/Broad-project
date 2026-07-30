import DashboardLayout from "../../components/DashboardLayout";
import "./Courses.css";

import {
    FaBook,
    FaUserTie,
    FaClock,
    FaGraduationCap
} from "react-icons/fa";

function Courses() {

    const courses = [

        {

            code:"CSE301",

            name:"Database Management System",

            faculty:"Dr. S. Mishra",

            credits:4,

            duration:"16 Weeks"

        },

        {

            code:"CSE302",

            name:"Operating System",

            faculty:"Dr. A. Panda",

            credits:4,

            duration:"16 Weeks"

        },

        {

            code:"CSE303",

            name:"Computer Networks",

            faculty:"Dr. R. Das",

            credits:3,

            duration:"16 Weeks"

        },

        {

            code:"CSE304",

            name:"Software Engineering",

            faculty:"Dr. P. Mohanty",

            credits:4,

            duration:"16 Weeks"

        },

        {

            code:"CSE305",

            name:"Machine Learning",

            faculty:"Dr. B. Nayak",

            credits:3,

            duration:"16 Weeks"

        },

        {

            code:"CSE306",

            name:"Compiler Design",

            faculty:"Dr. D. Rout",

            credits:4,

            duration:"16 Weeks"

        }

    ];

    return(

        <DashboardLayout

            role="student"

            title="My Courses"

        >

            <div className="courses-grid">

                {

                    courses.map((course,index)=>(

                        <div

                            className="course-card"

                            key={index}

                        >

                            <div className="course-icon">

                                <FaBook/>

                            </div>

                            <h3>

                                {course.name}

                            </h3>

                            <p className="course-code">

                                {course.code}

                            </p>

                            <div className="course-info">

                                <p>

                                    <FaUserTie/>

                                    {course.faculty}

                                </p>

                                <p>

                                    <FaGraduationCap/>

                                    {course.credits} Credits

                                </p>

                                <p>

                                    <FaClock/>

                                    {course.duration}

                                </p>

                            </div>

                            <button>

                                View Details

                            </button>

                        </div>

                    ))

                }

            </div>

        </DashboardLayout>

    );

}

export default Courses;