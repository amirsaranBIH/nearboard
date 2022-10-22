import React from 'react';
import MainHeading from '../partials/MainHeading/MainHeading';

import questionIcon from "../../assets/icons/question.svg";

import './Faq.css';

export default function Faq() {
  return (
    <div>
      <div className="wrapper">
        <aside className="aside">
          <div className="section">
          <div className="heading">
            <img src={questionIcon} alt="question icon" />
            <span>Questions</span>
          </div>
          </div>
        </aside>
        <main className="main">
          <div className="section">
            <MainHeading heading={"Frequently Asked Questions"} tooltip={"Here you may find the answer to your questions about Nearboard"} />
          </div>
        </main>
      </div>
    </div>
  );
}
