import React, { useEffect, useState } from 'react';

import FaqSection from "../sections/FaqSection/FaqSection"
import UpcomingEventsSection from '../sections/UpcomingEventsSection/UpcomingEventsSection';
import SearchQuestionsSection from '../sections/SearchQuestionsSection/SearchQuestionsSection';
import MainHeading from '../partials/MainHeading/MainHeading';
import Question from '../partials/Question/Question';

import './Home.css';

export default function Home({ Nearboard }) {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    Nearboard.getPopularQuestions().then(res => {
      setQuestions(res);
    });
  }, []);

  return (
    <div>
      <div className="wrapper">
        <aside className="aside">
          <SearchQuestionsSection />
          <UpcomingEventsSection Nearboard={Nearboard} />
          <FaqSection />
        </aside>
        <main className="main">
          <div className="section">
            <MainHeading heading={"Top Questions"} tooltip={"Top questions from upcoming events"} />
            <div className="questions">
              {questions.map(question => {
                return <Question key={question.id} question={question} event={question.event} />
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
