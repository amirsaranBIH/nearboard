import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import calendarIcon from "../../../assets/icons/calendar.svg"
import EventCard from '../../partials/EventCard/EventCard';

import './UpcomingEventsSection.css';

export default function UpcomingEventsSection({ Nearboard }) {

  const [events, setEvents] = useState([]);

  useEffect(() => {
    Nearboard.getAllUpcomingEvents().then(res => {
      console.log(res)
      setEvents(res);
    });
  }, []);

  return (
    <div className="section">
        <div className="heading">
            <img src={calendarIcon} alt="calendar icon" />
            <span>Upcoming Events</span>
        </div>
        <div className="upcoming-events">
            {events.map(event => {
              return <EventCard key={event.id} event={event} />
            })}
        </div>
        <div className="view-more">
            <Link className="link" to="/events">View more</Link>
        </div>
    </div>
  );
}
