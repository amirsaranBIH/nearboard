import React, { useState } from 'react';
import MainHeading from '../partials/MainHeading/MainHeading';

import questionIcon from "../../assets/icons/question.svg";
import nearboardDefaultLogo from "../../assets/nearboard-default.png";

import './Faq.css';

const questions = [
  {
    question: "What is Nearboard?",
    answer: `
      <p>Nearboard is a decentralized app that connects businesses and enterprises with their communities.</p>
      <p>It enables them to vote on the most pertinent questions that the community wishes to have answered.</p>
      <p>With Nearboard, enterprises can engage their communities in the planning and execution of events. 
        The platform enables businesses to receive feedback on new products and gather key insights by asking consumers questions about the upcoming event.</p>
      <p>It provides an avenue for a two-way discussion between businesses and consumers.</p>
    `
  },
  {
    question: "How does it work?",
    answer: `
      <p><b>If you are a business owner and you want to find out what your community is interested in:</b></p>
      <ol>
        <li>Create a project</li>
        <li>Create an upcoming event that you will organize or attend</li>
        <li>Answer the top voted questions that your community has asked</li>
      </ol>
      <p><b>If you are a community member or investor of a business or project:</b></p>
      <ol>
        <li>Ask a question</li>
        <li>or vote for already asked questions which you think are most important</li>
      </ol>
    `
  },
  {
    question: "When will my question get answered?",
    answer: `
      <p>Depending on the event and event format, questions asked for the upcoming event will be answered by the business or project team acordingly.</p>
    `
  },
  {
    question: "Why can't I update my question?",
    answer: `
      <p>Questions can't be updated if they reach 50 votes.</p>
      <p>This prevents askers from changing their question after receiving a large number of votes.</p>
    `
  },
];

export default function Faq() {
  const [selectedQuestion, setSelectedQuestion] = useState(0);

  return (
    <div>
      <div className="wrapper">
        <aside className="aside">
          <div className="section">
          <div className="heading">
            <img src={questionIcon} alt="question icon" />
            <span>Questions</span>
          </div>
          <div className="questions">
            {questions.map((question, i) => {
              return <div key={i} className={selectedQuestion === i ? "selected-question" : ""} onClick={() => {setSelectedQuestion(i)}}>{question.question}</div>;
            })}
          </div>
          </div>
        </aside>
        <main className="main">
          <div className="section">
            <div className="faq">
              <MainHeading heading={"Frequently Asked Questions"} tooltip={"Here you may find the answer to your questions about Nearboard"} />
              <div className="logo-image">
                <img src={nearboardDefaultLogo} alt="nearboard logo" />
              </div>
              <div className="selected-question answer-question">{questions[selectedQuestion].question}</div>
              <div className="question-answer">
                <div dangerouslySetInnerHTML={{ __html: questions[selectedQuestion].answer }} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
