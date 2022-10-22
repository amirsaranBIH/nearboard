import React, { useEffect, useState, useContext } from 'react';
import NearboardContext from '../../store/NearboardContext';
import EventCard from '../partials/EventCard/EventCard';
import MainHeading from '../partials/MainHeading/MainHeading';
import FaqSection from '../sections/FaqSection/FaqSection';
import SearchEventsSection from '../sections/SearchEventsSection/SearchEventsSection';

import './Events.css';

export default function Events() {
  const nearboardContext = useContext(NearboardContext);

  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);

  useEffect(() => {
    nearboardContext.contract.getAllEvents().then(res => {
      setEvents(res);
      setAllEvents(res);
    });
  }, []);

  return (
    <div>
      <div className="wrapper">
        <aside className="aside">
          <SearchEventsSection events={allEvents} setEvents={setEvents} />
          <FaqSection />
        </aside>
        <main className="main">
          <div className="section">
            <MainHeading heading={"All Events"} tooltip={"List of upcoming and previous events"} />
            {events && events.length > 0 ? 
              <div className="events">
                {events.map(event => {
                  return <EventCard key={event.id} event={event} />;
                })}
              </div>
            : <div className="no-content">No events</div>}
          </div>
        </main>
      </div>
    </div>
  );
}
