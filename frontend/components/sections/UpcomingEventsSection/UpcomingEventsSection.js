import React from 'react';

import { Link } from 'react-router-dom';

import calendarIcon from "../../../assets/icons/calendar.svg"

import './UpcomingEventsSection.css';

export default function UpcomingEventsSection() {
  return (
    <div className="section">
        <div className="heading">
            <img src={calendarIcon} alt="calendar icon" />
            <span>Upcoming Events</span>
        </div>
        <div className="upcoming-events">
            <div className="event">
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
            <div className="event">
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
        </div>
        <div className="view-more">
            <Link className="link" to="/events">View more</Link>
        </div>
    </div>
  );
}
