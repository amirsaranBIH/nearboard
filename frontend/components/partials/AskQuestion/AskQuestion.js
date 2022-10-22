import React, { useRef, useContext } from 'react';
import NearboardContext from '../../../store/NearboardContext';

import './AskQuestion.css';

export default function AskQuestion({ projectId, eventId }) {
  const nearboardContext = useContext(NearboardContext);

  const askQuestionInputRef = useRef(null);

  function createQuestion() {
    nearboardContext.contract.createQuestion({ projectId, eventId, question: askQuestionInputRef.current.value }).then(res => {
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
