import React from 'react';

import Questions from "../Questions/Questions"
import FaqSection from "../sections/FaqSection/FaqSection"
import UpcomingEventsSection from '../sections/UpcomingEventsSection/UpcomingEventsSection';
import SearchQuestionsSection from '../sections/SearchQuestionsSection/SearchQuestionsSection';
import MainHeading from '../partials/MainHeading/MainHeading';

import './Home.css';

export default function Home() {
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
            <MainHeading heading={"Top Questions"} tooltip={"Top questions from upcoming events"} />
            <Questions />
          </div>
        </main>
      </div>
    </div>
  );
}
