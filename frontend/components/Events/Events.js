import React from 'react';
import EventCard from '../partials/EventCard/EventCard';
import MainHeading from '../partials/MainHeading/MainHeading';
import FaqSection from '../sections/FaqSection/FaqSection';
import SearchQuestionsSection from '../sections/SearchQuestionsSection/SearchQuestionsSection';
import UpcomingEventsSection from '../sections/UpcomingEventsSection/UpcomingEventsSection';

import './Events.css';

export default function Events() {
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
            <div className="events">
              <EventCard />
              <EventCard />
              <EventCard />
              <EventCard />
              <EventCard />
              <EventCard />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
