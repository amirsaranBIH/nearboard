import React from 'react';
import AskQuestion from '../partials/AskQuestion/AskQuestion';
import EventCard from '../partials/EventCard/EventCard';
import MainHeading from '../partials/MainHeading/MainHeading';
import Questions from '../Questions/Questions';
import FaqSection from '../sections/FaqSection/FaqSection';
import SearchQuestionsSection from '../sections/SearchQuestionsSection/SearchQuestionsSection';
import UpcomingEventsSection from '../sections/UpcomingEventsSection/UpcomingEventsSection';

import './Event.css';

export default function Event() {
  return (
    <div>
      <div className="wrapper">
        <aside className="aside">
          <div className="section">
            <EventCard />
          </div>
          <SearchQuestionsSection />
          <UpcomingEventsSection />
          <FaqSection />
        </aside>
        <main className="main">
          <div className="section">
            <MainHeading heading={"Questions for AMA Tuesday Event"} tooltip={"Top questions will be answered on the AMA Tuesday event"} />
            <AskQuestion />
            <Questions />
          </div>
        </main>
      </div>
    </div>
  );
}
