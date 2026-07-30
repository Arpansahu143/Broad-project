import DashboardLayout from "../../components/DashboardLayout";
import "./Faculty.css";
import { useEffect, useState } from "react";
import api from "../../api/axios";

import {

    FaSearch,

    FaPlus,

    FaEye,

    FaEdit,

    FaTrash

} from "react-icons/fa";

function Faculty(){

    const [faculty, setFaculty] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFaculty = async () => {
            try {
                const response = await api.get("/faculty");
                setFaculty(response.data.data);
            } catch (err) {
                console.error(err);
                setError(
                    err.response?.data?.message || "Failed to load faculty."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchFaculty();
    }, []);

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

            {loading && <p style={{ padding: "16px" }}>Loading faculty...</p>}
            {error && <p style={{ padding: "16px", color: "#ef4444" }}>{error}</p>}

            {!loading && !error && (
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

                                (item)=>(

                                    <tr key={item.id}>

                                        <td>{item.employeeId}</td>

                                        <td>{item.user?.firstName} {item.user?.lastName}</td>

                                        <td>{item.department?.name || "—"}</td>

                                        <td>{item.designation || "—"}</td>

                                        <td>{item.user?.email}</td>

                                        <td>

                                            <span

                                                className="status active"

                                            >

                                                Active

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
            )}

        </DashboardLayout>

    );

}

export default Faculty;