import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import FaqSection from "../sections/FaqSection/FaqSection"
import UpcomingEventsSection from '../sections/UpcomingEventsSection/UpcomingEventsSection';
import SearchQuestionsSection from '../sections/SearchQuestionsSection/SearchQuestionsSection';
import MainHeading from '../partials/MainHeading/MainHeading';
import Question from '../partials/Question/Question';
import NearboardContext from '../../store/NearboardContext';
import ProjectsListSection from '../sections/ProjectsListSection/ProjectsListSection';
import Emitter from '../../emitter';

import projectsIcon from "../../assets/icons/projects.svg"

import './Home.css';
import UpdateQuestionModal from '../partials/UpdateQuestionModal/UpdateQuestionModal';

export default function Home() {
  const nearboardContext = useContext(NearboardContext);
  
  const [popularProjects, setPopularProjects] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    nearboardContext.contract.getPopularQuestions().then(res => {
      setAllQuestions(res);
      setQuestions(res);
    });
    nearboardContext.contract.getTopFivePopularProjects().then(res => {
      setPopularProjects(res);
    });
  }, []);

  function getQuestionOptions(question) {
    return [
      {
        text: "Update Question",
        method: () => {
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

  return (
    <div>
      <div className="wrapper">
        <aside className="aside">
          <SearchQuestionsSection questions={allQuestions} setQuestions={setQuestions} />
          <UpcomingEventsSection />
          <div className="section">
            <div className="heading">
              <img src={projectsIcon} alt="four boxes icon" />
              <span>Popular Projects</span>
            </div>
            <ProjectsListSection projects={popularProjects} />
            <div className="view-more">
              <Link className="link" to="/projects">View all</Link>
            </div>
          </div>
          <FaqSection />
        </aside>
        <main className="main">
          <div className="section">
            <MainHeading heading={"Top Questions"} tooltip={"Top questions from upcoming events"} />
            <div className="questions">
              {questions.length > 0 ? questions.map(question => {
                return <Question key={question.id} question={question} event={question.event} options={getQuestionOptions(question)} />
              }) : <div className="no-content">No questions asked</div>}
            </div>
          </div>
        </main>
      </div>
      <UpdateQuestionModal onQuestionUpdate={onQuestionUpdateHandler} />
    </div>
  );
}
