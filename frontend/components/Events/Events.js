import React, { useEffect, useState, useContext } from 'react';
import NearboardContext from '../../store/NearboardContext';
import EventCard from '../partials/EventCard/EventCard';
import MainHeading from '../partials/MainHeading/MainHeading';
import FaqSection from '../sections/FaqSection/FaqSection';
import SearchQuestionsSection from '../sections/SearchQuestionsSection/SearchQuestionsSection';
import UpcomingEventsSection from '../sections/UpcomingEventsSection/UpcomingEventsSection';

import './Events.css';

export default function Events() {
  const nearboardContext = useContext(NearboardContext);

  const [events, setEvents] = useState([]);

  useEffect(() => {
    nearboardContext.contract.getAllEvents().then(res => {
      setEvents(res);
    });
  }, []);

  return (
    <div>
      <div className="wrapper">
        <aside className="aside">
          <SearchQuestionsSection />
          <UpcomingEventsSection />
          <FaqSection />
        </aside>
        <main className="main">
          <div className="section">
            <MainHeading heading={"Upcoming Events"} tooltip={"List of all upciming events where you can ask questions"} />
            {events && events.length > 0 ? 
              <div className="events">
                {events.map(event => {
                  return <EventCard key={event.id} event={event} />;
                })}
              </div>
            : <div className="no-content">No upcoming events</div>}
          </div>
        </main>
      </div>
    </div>
  );
}
