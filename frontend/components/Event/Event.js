import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AskQuestion from '../partials/AskQuestion/AskQuestion';
import EventCard from '../partials/EventCard/EventCard';
import MainHeading from '../partials/MainHeading/MainHeading';
import Question from '../partials/Question/Question';
import FaqSection from '../sections/FaqSection/FaqSection';
import SearchQuestionsSection from '../sections/SearchQuestionsSection/SearchQuestionsSection';
import UpcomingEventsSection from '../sections/UpcomingEventsSection/UpcomingEventsSection';

import './Event.css';

export default function Event({ Nearboard }) {
  const { projectId, eventId } = useParams();

  const [event, setEvent] = useState(null)

  useEffect(() => {
    Nearboard.getEvent({ projectId, eventId }).then(res => {
      console.log(res);
      setEvent(res);
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
          <SearchQuestionsSection />
          <UpcomingEventsSection Nearboard={Nearboard} />
          <FaqSection />
        </aside>
        <main className="main">
          <div className="section">
            <MainHeading heading={"Questions for AMA Tuesday Event"} tooltip={"Top questions will be answered on the AMA Tuesday event"} />
            <AskQuestion Nearboard={Nearboard} projectId={projectId} eventId={eventId} />
            <div className="questions">
              {Object.values(event.questions).map(question => {
                return <Question key={question.id} question={question} event={event} />;
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
