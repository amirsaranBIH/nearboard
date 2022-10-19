import React from 'react';

import { Link } from 'react-router-dom';

import calendarIcon from "../../../assets/icons/calendar.svg"
import EventCard from '../../partials/EventCard/EventCard';

import './UpcomingEventsSection.css';

export default function UpcomingEventsSection() {
  return (
    <div className="section">
        <div className="heading">
            <img src={calendarIcon} alt="calendar icon" />
            <span>Upcoming Events</span>
        </div>
        <div className="upcoming-events">
            <EventCard />
            <EventCard />
        </div>
        <div className="view-more">
            <Link className="link" to="/events">View more</Link>
        </div>
    </div>
  );
}
