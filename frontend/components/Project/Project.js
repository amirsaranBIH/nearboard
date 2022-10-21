import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import NearboardContext from '../../store/NearboardContext';

import AskQuestion from '../partials/AskQuestion/AskQuestion';
import MainHeading from '../partials/MainHeading/MainHeading';
import ProjectCard from '../partials/ProjectCard/ProjectCard';
import Question from '../partials/Question/Question';
import FaqSection from '../sections/FaqSection/FaqSection';
import SearchQuestionsSection from '../sections/SearchQuestionsSection/SearchQuestionsSection';
import UpcomingEventsSection from '../sections/UpcomingEventsSection/UpcomingEventsSection';

import './Project.css';

export default function Project() {
  const { id } = useParams();

  const nearboardContext = useContext(NearboardContext);

  const [project, setProject] = useState({});
  const [upcomingEvent, setUpcomingEvent] = useState({});
  const [allUpcomingEventQuestions, setAllUpcomingEventQuestions] = useState([]);
  const [upcomingEventQuestions, setUpcomingEventQuestions] = useState([]);

  useEffect(() => {
    nearboardContext.contract.getProject(id).then(res => {
      setProject(res);
      nearboardContext.contract.getEvent(res.id).then(res => {
        setUpcomingEvent(res);
      });
    });
    nearboardContext.contract.getProjectUpcomingEventQuestions(id).then(res => {
      setUpcomingEventQuestions(res);
      setAllUpcomingEventQuestions(res);
    });
  }, []);

  if (!project) {
    return null;
  }

  return (
    <div>
      <div className="wrapper">
        <aside className="aside">
          <div className="section">
            <ProjectCard project={project} />
          </div>
          <SearchQuestionsSection questions={allUpcomingEventQuestions} setQuestions={setUpcomingEventQuestions} />
          <UpcomingEventsSection />
          <FaqSection />
        </aside>
        <main className="main">
          <div className="section">
            <MainHeading heading={"Questions For AMA Tuesday Event"} tooltip={"Top questions will be answered on the AMA Tuesday event"} />
            <AskQuestion projectId={project.id} eventId={upcomingEvent.id} />
            <div className="questions">
              {upcomingEventQuestions.length > 0 ? upcomingEventQuestions.map(question => {
                return <Question key={question.id} question={question} event={upcomingEvent} />
              }) : <div className="no-content">No questions asked</div>}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
