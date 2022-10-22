import React from 'react';

import { Link } from 'react-router-dom';

import questionIcon from "../../../assets/icons/question.svg"

import './FaqSection.css';

export default function FaqSection() {
  return (
    <div className="section">
        <div className="heading">
            <img src={questionIcon} alt="question icon" />
            <span>How It Works?</span>
        </div>
        <Link className="link" to="/faq">Check out FAQ!</Link>
    </div>
  );
}
