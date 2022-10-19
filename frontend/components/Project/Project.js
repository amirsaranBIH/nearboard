import React from 'react';

import AskQuestion from '../partials/AskQuestion/AskQuestion';
import MainHeading from '../partials/MainHeading/MainHeading';
import ProjectCard from '../partials/ProjectCard/ProjectCard';
import Question from '../partials/Question/Question';
import FaqSection from '../sections/FaqSection/FaqSection';
import SearchQuestionsSection from '../sections/SearchQuestionsSection/SearchQuestionsSection';
import UpcomingEventsSection from '../sections/UpcomingEventsSection/UpcomingEventsSection';

import './Project.css';

export default function Project() {
  return (
    <div>
      <div className="wrapper">
        <aside className="aside">
          <div className="section">
            <ProjectCard />
          </div>
          <SearchQuestionsSection />
          <UpcomingEventsSection />
          <FaqSection />
        </aside>
        <main className="main">
          <div className="section">
            <MainHeading heading={"Questions For AMA Tuesday Event"} tooltip={"Top questions will be answered on the AMA Tuesday event"} />
            <AskQuestion />
            <div className="questions">
              <Question />
              <Question />
              <Question />
              <Question />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
