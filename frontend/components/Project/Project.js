import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import NearboardContext from '../../store/NearboardContext';

import AskQuestion from '../partials/AskQuestion/AskQuestion';
import MainHeading from '../partials/MainHeading/MainHeading';
import ProjectCard from '../partials/ProjectCard/ProjectCard';
import Question from '../partials/Question/Question';
import FaqSection from '../sections/FaqSection/FaqSection';
import PreviousEventsSection from '../sections/PreviousEventsSection/PreviousEventsSection';
import SearchQuestionsSection from '../sections/SearchQuestionsSection/SearchQuestionsSection';

import './Project.css';

export default function Project() {
  const { id } = useParams();

  const nearboardContext = useContext(NearboardContext);

  const [project, setProject] = useState(null);
  const [upcomingEvent, setUpcomingEvent] = useState({});
  const [allUpcomingEventQuestions, setAllUpcomingEventQuestions] = useState([]);
  const [upcomingEventQuestions, setUpcomingEventQuestions] = useState([]);
  const [previousEvents, setPreviousEvents] = useState([]);

  useEffect(() => {
    nearboardContext.contract.getProject(id).then(res => {
      setProject(res);
      nearboardContext.contract.getProjectUpcomingEvent(res.id).then(res => {
        setUpcomingEvent(res);
      });
    });
    nearboardContext.contract.getProjectUpcomingEventQuestions(id).then(res => {
      setUpcomingEventQuestions(res);
      setAllUpcomingEventQuestions(res);
    });
    nearboardContext.contract.getProjectPreviousEvents(id).then(res => {
      setPreviousEvents(res);
    });
  }, []);

  function onCreateQuestionHandler(question) {
    setAllUpcomingEventQuestions(allUpcomingEventQuestions.concat([question]));
    setUpcomingEventQuestions(upcomingEventQuestions.concat([question]));
  }

  function onVote(question) {
    setAllUpcomingEventQuestions(allUpcomingEventQuestions.map(q => {
      if (q.id === question.id && !q.votes.includes(nearboardContext.wallet.accountId)) {
        q.votes.push(nearboardContext.wallet.accountId);
      }
      return q;
    }));
    setUpcomingEventQuestions(upcomingEventQuestions.map(q => {
      if (q.id === question.id  && !q.votes.includes(nearboardContext.wallet.accountId)) {
        q.votes.push(nearboardContext.wallet.accountId);
      }
      return q;
    }));
  }

  function onUnvote(question) {
    setAllUpcomingEventQuestions(allUpcomingEventQuestions.map(q => {
      if (q.id === question.id) {
        q.votes = q.votes.filter(voter => voter !== nearboardContext.wallet.accountId);
      }
      return q;
    }));
    setUpcomingEventQuestions(upcomingEventQuestions.map(q => {
      if (q.id === question.id) {
        q.votes = q.votes.filter(voter => voter !== nearboardContext.wallet.accountId);
      }
      return q;
    }));
  }

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
          <PreviousEventsSection events={previousEvents} />
          <FaqSection />
        </aside>
        <main className="main">
          {upcomingEvent ?
          <div className="section">
            <div>
              <MainHeading heading={"Questions For " + upcomingEvent.name  + " Event"} tooltip={"Top questions will be answered on the " + new Date(Number(upcomingEvent.startDate)).toLocaleDateString() + " by the " + project.name + " team"} />
              {upcomingEvent.startDate > new Date().getTime() && <AskQuestion projectId={project.id} eventId={upcomingEvent.id} onCreateQuestion={onCreateQuestionHandler} />}
              <div className="questions">
                {upcomingEventQuestions.length > 0 ? upcomingEventQuestions.map(question => {
                  return <Question key={question.id} question={question} event={upcomingEvent} onVote={onVote} onUnvote={onUnvote} />
                }) : <div className="no-content">No questions asked</div>}
              </div>
            </div>
          </div> :
          <div className="section">
            <div className="no-content">No upcoming events to ask questions for</div>
          </div>}
        </main>
      </div>
    </div>
  );
}
