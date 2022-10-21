import React, { useEffect, useState, useContext } from 'react';

import { Link } from 'react-router-dom';

import calendarIcon from "../../../assets/icons/calendar.svg"
import NearboardContext from '../../../store/NearboardContext';
import EventCard from '../../partials/EventCard/EventCard';

import './UpcomingEventsSection.css';

export default function UpcomingEventsSection() {
  const nearboardContext = useContext(NearboardContext);

  const [events, setEvents] = useState([]);

  useEffect(() => {
    nearboardContext.contract.getAllUpcomingEvents().then(res => {
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
            {events.length > 0 ? events.map(event => {
              return <EventCard key={event.id} event={event} />
            }): <div className="no-content">No upcoming events</div>}
        </div>
        <div className="view-more">
            <Link className="link" to="/events">View more</Link>
        </div>
    </div>
  );
}
