import DashboardLayout from "../../components/DashboardLayout";
import "./Faculty.css";

import {

    FaSearch,

    FaPlus,

    FaEye,

    FaEdit,

    FaTrash

} from "react-icons/fa";

function Faculty(){

    const faculty=[

        {

            id:"FAC101",

            name:"Dr. S. Mishra",

            department:"Computer Science",

            designation:"Professor",

            email:"smishra@soa.ac.in",

            status:"Active"

        },

        {

            id:"FAC102",

            name:"Dr. A. Panda",

            department:"Electronics",

            designation:"Associate Professor",

            email:"apanda@soa.ac.in",

            status:"Active"

        },

        {

            id:"FAC103",

            name:"Dr. P. Mohanty",

            department:"Mechanical",

            designation:"Assistant Professor",

            email:"pmohanty@soa.ac.in",

            status:"Inactive"

        },

        {

            id:"FAC104",

            name:"Dr. B. Nayak",

            department:"Information Technology",

            designation:"Professor",

            email:"bnayak@soa.ac.in",

            status:"Active"

        }

    ];

    return(

        <DashboardLayout

            role="admin"

            title="Faculty Management"

        >

            <div className="page-header">

                <div className="search-box">

                    <FaSearch/>

                    <input

                        type="text"

                        placeholder="Search Faculty..."

                    />

                </div>

                <button className="add-btn">

                    <FaPlus/>

                    Add Faculty

                </button>

            </div>

            <div className="faculty-table">

                <table>

                    <thead>

                        <tr>

                            <th>ID</th>

                            <th>Name</th>

                            <th>Department</th>

                            <th>Designation</th>

                            <th>Email</th>

                            <th>Status</th>

                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            faculty.map(

                                (item,index)=>(

                                    <tr key={index}>

                                        <td>{item.id}</td>

                                        <td>{item.name}</td>

                                        <td>{item.department}</td>

                                        <td>{item.designation}</td>

                                        <td>{item.email}</td>

                                        <td>

                                            <span

                                                className={

                                                    item.status==="Active"

                                                    ?

                                                    "status active"

                                                    :

                                                    "status inactive"

                                                }

                                            >

                                                {item.status}

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

export default Faculty;