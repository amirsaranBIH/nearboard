import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import AskQuestion from '../partials/AskQuestion/AskQuestion';
import MainHeading from '../partials/MainHeading/MainHeading';
import ProjectCard from '../partials/ProjectCard/ProjectCard';
import Question from '../partials/Question/Question';
import FaqSection from '../sections/FaqSection/FaqSection';
import SearchQuestionsSection from '../sections/SearchQuestionsSection/SearchQuestionsSection';
import UpcomingEventsSection from '../sections/UpcomingEventsSection/UpcomingEventsSection';

import './Project.css';

export default function Project({ Nearboard }) {
  const { id } = useParams();

  const [project, setProject] = useState(null);

  useEffect(() => {
    Nearboard.getProject(parseInt(id, 10)).then(res => {
      setProject(res);
    });
  }, []);

  function getUpcomingEvent() {
    if (!project) return null;
    return Object.values(project.events).find(event => event.startDate > (new Date().getTime()));
  }

  const upcomingEvent = getUpcomingEvent();

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
          <SearchQuestionsSection />
          <UpcomingEventsSection Nearboard={Nearboard} />
          <FaqSection />
        </aside>
        <main className="main">
          <div className="section">
            <MainHeading heading={"Questions For AMA Tuesday Event"} tooltip={"Top questions will be answered on the AMA Tuesday event"} />
            <AskQuestion Nearboard={Nearboard} projectId={project.id} eventId={upcomingEvent.id} />
            <div className="questions">
              {upcomingEvent && Object.values(upcomingEvent.questions).map(question => {
                return <Question key={question.id} question={question} event={upcomingEvent} />
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
