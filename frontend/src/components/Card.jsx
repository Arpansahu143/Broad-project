import "./Card.css";

import {
    FaArrowUp,
    FaArrowDown
} from "react-icons/fa";

function Card({

    title,

    value,

    icon,

    color = "#6247ff",

    growth = "+0%",

    positive = true

}) {

    return (

        <div className="dashboard-card">

            <div className="card-top">

                <div
                    className="card-icon"
                    style={{
                        background: color
                    }}
                >

                    {icon}

                </div>

                <div
                    className={
                        positive
                            ? "growth positive"
                            : "growth negative"
                    }
                >

                    {

                        positive

                            ?

                            <FaArrowUp />

                            :

                            <FaArrowDown />

                    }

                    {growth}

                </div>

            </div>

            <div className="card-content">

                <h4>

                    {title}

                </h4>

                <h2>

                    {value}

                </h2>

            </div>

        </div>

    );

}

export default Card;