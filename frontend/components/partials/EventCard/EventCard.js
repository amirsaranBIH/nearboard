import React from 'react';

import { Link, useNavigate } from "react-router-dom";
import MoreOptions from '../MoreOptions/MoreOptions';

import './EventCard.css';

export default function EventCard({ showOptions }) {
  const navigate = useNavigate();
  
  return (
    <div className="event">
        <div className="event-top">
        <div className="event-date">
            <span className="event-date-month">SEP</span>
            <span className="event-date-day">21</span>
        </div>
        <div className="event-info">
            <span className="event-name">AMA Tuesday</span>
            <span className="event-project">by <Link className="link">Aurora</Link></span>
            <span className="event-type">
                <span className="tag">AMA</span>
            </span>
        </div>
        </div>
        {showOptions && <MoreOptions options={[
        {
          text: "Update",
          method: () => {
            navigate("/project/1/event/1/update");
          },
        },
        {
          text: "Delete",
          method: () => {
            console.log("Delete Event");
          },
        },
      ]} />}
    </div>
  );
}
