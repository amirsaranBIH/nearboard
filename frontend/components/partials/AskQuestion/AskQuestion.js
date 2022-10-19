import React from 'react';

import './AskQuestion.css';

export default function AskQuestion() {
  return (
    <div className="ask-question">
      <input className="input" type="text" placeholder="Ask your question here" />
      <button className="ask-btn">+</button>
    </div>
  );
}
