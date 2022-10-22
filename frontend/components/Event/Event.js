import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import NearboardContext from '../../store/NearboardContext';
import AskQuestion from '../partials/AskQuestion/AskQuestion';
import EventCard from '../partials/EventCard/EventCard';
import MainHeading from '../partials/MainHeading/MainHeading';
import Question from '../partials/Question/Question';
import FaqSection from '../sections/FaqSection/FaqSection';
import SearchQuestionsSection from '../sections/SearchQuestionsSection/SearchQuestionsSection';
import UpcomingEventsSection from '../sections/UpcomingEventsSection/UpcomingEventsSection';

import './Event.css';

export default function Event() {
  const { eventId } = useParams();

  const nearboardContext = useContext(NearboardContext);

  const [event, setEvent] = useState(null)
  const [allQuestions, setAllQuestions] = useState([])
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    nearboardContext.contract.getEvent(eventId).then(res => {
      setEvent(res);
    });
    nearboardContext.contract.getEventQuestions(eventId).then(res => {
      setAllQuestions(res);
      setQuestions(res);
    });
  }, []);

  if (!event) {
    return null;
  }

  return (
    <div>
      <div className="wrapper">
        <aside className="aside">
          <div className="section">
            <EventCard event={event} />
          </div>
          <SearchQuestionsSection questions={allQuestions} setQuestions={setQuestions} />
          <UpcomingEventsSection />
          <FaqSection />
        </aside>
        <main className="main">
          <div className="section">
            <MainHeading heading={"Questions for " + event.name + " Event"} tooltip={"Top questions will be answered on the " + event.name + " event"} />
            <AskQuestion projectId={event.projectId} eventId={eventId} />
            <div className="questions">
              {qustions.length > 0 ? questions.map(question => {
                return <Question key={question.id} question={question} event={event} />;
              }): <div className="no-content">No questions asked</div>}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
