import "./DashboardLayout.css";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function DashboardLayout({

    role = "admin",

    title,

    children

}) {

    return (

        <div className="dashboard">

            <Sidebar role={role} />

            <div className="dashboard-main">

                <Navbar />

                <div className="dashboard-content">

                    <div className="page-header">

                        <h1>

                            {title}

                        </h1>

                        <p>

                            Welcome to the University Management Information System

                        </p>

                    </div>

                    {children}

                </div>

            </div>

        </div>

    );

}

export default DashboardLayout;