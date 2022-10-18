import React from 'react';

import { Link } from 'react-router-dom';

import arrowUpIcon from "../../../assets/icons/arrowup.svg"
import './Question.css';

export default function Question() {
  return (
    <div className="question">
      <div className="question-text">This is where the question will go, and it can be long?</div>
      <hr />
      <div className="question-info">
        <div>asks amirsaran.near - for <Link className="link" to="/">AMA Tuesday Event</Link></div>
        <div className="question-vote">
          <div className="question-vote-btn">
            <img src={arrowUpIcon} alt="arrow up icon" />
          </div>
          <div className="question-vote-info">
            <span className="question-vote-number">12 Votes</span>
            <span className="question-near-represented">1.5K NEAR represented</span>
          </div>
        </div>
      </div>
    </div>
  );
}
