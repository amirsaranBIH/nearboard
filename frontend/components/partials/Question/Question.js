import { utils } from 'near-api-js';
import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import arrowUpIcon from "../../../assets/icons/arrowup.svg"
import './Question.css';

export default function Question({ event, question }) {
  const [nearRepresented, setNearRepresented] = useState(0);

  function calculateNearRepresented() {
    const near = Object.values(question.votes).reduce((total, vote) => {
      return total + Number(utils.format.formatNearAmount(vote.nearRepresented));
    }, 0);

    setNearRepresented(near.toFixed(0));
  }

  useEffect(() => {
    calculateNearRepresented();
  }, []);

  return (
    <div className="question">
      <div className="question-text">{question.question}</div>
      <hr />
      <div className="question-info">
        <div>asks {question.asker} - for <Link className="link" to={"/project/" + event.projectId + "/event/" + event.id}>{event.name}</Link></div>
        <div className="question-vote">
          <div className="question-vote-btn">
            <img src={arrowUpIcon} alt="arrow up icon" />
          </div>
          <div className="question-vote-info">
            <span className="question-vote-number">{Object.keys(question.votes).length} {Object.keys(question.votes).length > 1 ? "Votes" : "Vote"}</span>
            <span className="question-near-represented">{nearRepresented} NEAR represented</span>
          </div>
        </div>
      </div>
    </div>
  );
}
