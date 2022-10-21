import React, { useEffect, useState, useContext } from 'react';

import FaqSection from "../sections/FaqSection/FaqSection"
import UpcomingEventsSection from '../sections/UpcomingEventsSection/UpcomingEventsSection';
import SearchQuestionsSection from '../sections/SearchQuestionsSection/SearchQuestionsSection';
import MainHeading from '../partials/MainHeading/MainHeading';
import Question from '../partials/Question/Question';
import NearboardContext from '../../store/NearboardContext';

import './Home.css';

export default function Home() {
  const nearboardContext = useContext(NearboardContext);
  
  const [allQuestions, setAllQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    nearboardContext.Nearboard.getPopularQuestions().then(res => {
      setAllQuestions(res);
      setQuestions(res);
    });
  }, []);

  return (
    <div>
      <div className="wrapper">
        <aside className="aside">
          <SearchQuestionsSection questions={allQuestions} setQuestions={setQuestions} />
          <UpcomingEventsSection />
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
