import React from 'react';

import Question from "../Question/Question"

import './Questions.css';

export default function Questions() {
  return (
    <div className="questions">
      <Question />
      <Question />
      <Question />
      <Question />
      <Question />
    </div>
  );
}
