import React, { useRef } from 'react';

import './AskQuestion.css';

export default function AskQuestion({ Nearboard, projectId, eventId }) {
  const askQuestionInputRef = useRef(null);

  function createQuestion() {
    Nearboard.createQuestion({ projectId, eventId, question: askQuestionInputRef.current.value }).then(res => {
      console.log(res);
    });
  }

  return (
    <div className="ask-question">
      <input className="input" type="text" placeholder="Ask your question here" ref={askQuestionInputRef} />
      <button className="ask-btn" onClick={createQuestion}>+</button>
    </div>
  );
}
