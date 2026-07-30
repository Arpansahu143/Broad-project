import DashboardLayout from "../../components/DashboardLayout";
import "./Notifications.css";

import {
    FaBell,
    FaCalendarAlt,
    FaBook,
    FaExclamationCircle,
    FaBullhorn
} from "react-icons/fa";

function Notifications() {

    const notifications = [

        {
            title:"Mid Semester Examination Schedule Released",
            category:"Examination",
            date:"20 July 2026",
            icon:<FaBook/>,
            type:"exam",
            description:"The examination timetable for the Mid Semester Examination has been published. Students are advised to download the schedule from the Examination Portal."
        },

        {
            title:"University Tech Fest 2026",
            category:"Event",
            date:"18 July 2026",
            icon:<FaCalendarAlt/>,
            type:"event",
            description:"Registrations are now open for Tech Fest 2026. Participate in coding, robotics, AI and gaming competitions."
        },

        {
            title:"Library Maintenance Notice",
            category:"Announcement",
            date:"16 July 2026",
            icon:<FaBullhorn/>,
            type:"announcement",
            description:"The Central Library Portal will remain unavailable from 10 PM to 2 AM due to scheduled maintenance."
        },

        {
            title:"Fee Payment Reminder",
            category:"Important",
            date:"15 July 2026",
            icon:<FaExclamationCircle/>,
            type:"important",
            description:"Students who have pending semester fees are requested to complete the payment before 30 July to avoid late fees."
        },

        {
            title:"Placement Training Session",
            category:"Placement",
            date:"12 July 2026",
            icon:<FaBell/>,
            type:"placement",
            description:"Campus placement training for Final Year students will begin from Monday in Auditorium Hall."
        }

    ];

    return(

        <DashboardLayout

            role="student"

            title="Notifications"

        >

            <div className="notification-list">

                {

                    notifications.map(

                        (item,index)=>(

                            <div

                                className={`notification-card ${item.type}`}

                                key={index}

                            >

                                <div className="notification-icon">

                                    {item.icon}

                                </div>

                                <div className="notification-content">

                                    <div className="notification-top">

                                        <span>

                                            {item.category}

                                        </span>

                                        <small>

                                            {item.date}

                                        </small>

                                    </div>

                                    <h3>

                                        {item.title}

                                    </h3>

                                    <p>

                                        {item.description}

                                    </p>

                                </div>

                            </div>

                        )

                    )

                }

            </div>

        </DashboardLayout>

    );

}

export default Notifications;