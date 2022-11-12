import React, { useEffect, useState, useContext } from 'react';

import { Link } from 'react-router-dom';

import calendarTickIcon from "../../../assets/icons/calendartick.svg"
import NearboardContext from '../../../store/NearboardContext';
import EventCard from '../../partials/EventCard/EventCard';

import './PreviousEventsSection.css';

export default function PreviousEventsSection() {
  const nearboardContext = useContext(NearboardContext);

  const [events, setEvents] = useState([]);

  useEffect(() => {
    nearboardContext.contract.getThreePreviousEvents().then(res => {
      setEvents(res);
    });
  }, []);

  return (
    <div className="section">
        <div className="heading">
          <img src={calendarTickIcon} alt="calendar icon" />
          <span>Previous Events</span>
        </div>
        <div className="previous-events">
            {events.length > 0 ? events.map(event => {
              return <EventCard key={event.id} event={event} />
            }): <div className="no-content">No previous events</div>}
        </div>
        <div className="view-more">
            <Link className="link" to="/events">View all</Link>
        </div>
    </div>
  );
}
