import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Emitter from '../../emitter';

import NearboardContext from '../../store/NearboardContext';
import AskQuestion from '../partials/AskQuestion/AskQuestion';
import EventCard from '../partials/EventCard/EventCard';
import MainHeading from '../partials/MainHeading/MainHeading';
import Question from '../partials/Question/Question';
import UpdateQuestionModal from '../partials/UpdateQuestionModal/UpdateQuestionModal';
import FaqSection from '../sections/FaqSection/FaqSection';
import SearchQuestionsSection from '../sections/SearchQuestionsSection/SearchQuestionsSection';
import UpcomingEventsSection from '../sections/UpcomingEventsSection/UpcomingEventsSection';

import './Event.css';

export default function Event() {
  const { eventId } = useParams();

  const nearboardContext = useContext(NearboardContext);

  const [event, setEvent] = useState(null);
  const [allQuestions, setAllQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    nearboardContext.contract.getEvent(eventId).then(res => {
      setEvent(res);
    });
    nearboardContext.contract.getEventQuestions(eventId).then(res => {
      setAllQuestions(res);
      setQuestions(res);
    });
  }, []);

  function getQuestionOptions(question) {
    return [
      {
        text: "Update Question",
        method: () => {
          console.log("Update Question");
          Emitter.emit("OPEN_UPDATE_QUESTION_MODAL", question);
        },
      },
      {
        text: "Delete Question",
        method: () => {
          if (!confirm("Are you sure you want to delete question?")) {
            return;
          }
          nearboardContext.contract.deleteQuestion(question.id).then(res => {
            setAllQuestions(allQuestions.filter(q => q.id !== question.id));
            setQuestions(questions.filter(q => q.id !== question.id));
          });
        },
      }
    ]
  }

  function onQuestionUpdateHandler(newQuestion) {
    setAllQuestions(allQuestions.map(q => {
      if (q.id === newQuestion.id) {
        q.question = newQuestion.question;
      }
      return q;
    }));
    setQuestions(questions.map(q => {
      if (q.id === newQuestion.id) {
        q.question = newQuestion.question;
      }
      return q;
    }));
  }

  function onCreateQuestionHandler(question) {
    setAllQuestions(allQuestions.concat([question]));
    setQuestions(questions.concat([question]));
  }

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
            <AskQuestion projectId={event.projectId} eventId={eventId} onCreateQuestion={onCreateQuestionHandler} />
            <div className="questions">
              {questions.length > 0 ? questions.map(question => {
                return <Question key={question.id} question={question} event={event} options={getQuestionOptions(question)} />;
              }): <div className="no-content">No questions asked</div>}
            </div>
          </div>
        </main>
      </div>
      <UpdateQuestionModal onQuestionUpdate={onQuestionUpdateHandler} />
    </div>
  );
}
