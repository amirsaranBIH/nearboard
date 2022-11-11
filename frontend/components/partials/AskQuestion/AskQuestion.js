import React, { useRef, useContext, useState } from 'react';
import NearboardContext from '../../../store/NearboardContext';

import addIcon from '../../../assets/icons/add.svg';

import './AskQuestion.css';
import Button from '../Button/Button';
import { toast } from 'react-toastify';

export default function AskQuestion({ projectId, eventId, onCreateQuestion }) {
  const nearboardContext = useContext(NearboardContext);

  const [errors, setErrors] = useState({});
  const [dirty, setDirty] = useState(false);

  const askQuestionInputRef = useRef(null);

  function onSubmitHandler(e) {
    e.preventDefault();

    setDirty(true);

    const isValid = verifyFormValues();

    if (!isValid) {
      console.log("Form is not valid");
      return;
    }

    if (!nearboardContext.isSignedIn) {
      toast.error("Not signed in");
      nearboardContext.wallet.signIn();
      return;
    }

    nearboardContext.contract.createQuestion({ projectId, eventId, question: askQuestionInputRef.current.value }).then(res => {
      toast.success("Successfully created question");
      onCreateQuestion(res);
      askQuestionInputRef.current.value = "";
    });
  }

  function verifyFormValues() {
    const errorMessages = {};

    const askQuestionValue = askQuestionInputRef.current.value;

    if (askQuestionValue.length < 3) {
      errorMessages.question = "Question name must be at least 3 characters";
    }

    setErrors(errorMessages);

    return Object.keys(errorMessages).length === 0;
  }

  function hasErrors(field) {
    return errors[field] !== undefined;
  }

  function getError(field) {
    return errors[field];
  }

  function checkErrors() {
    if (dirty) {
      verifyFormValues();
    }
  }

  return (
    <div className="ask-question">
      <form onSubmit={onSubmitHandler}>
        <div className="form-field">
          <input className="input" type="text" placeholder="Ask your question here" ref={askQuestionInputRef} onChange={checkErrors} />
          {hasErrors("question") && (
            <span className="error-message">{getError("question")}</span>
          )}
        </div>
        <Button icon={addIcon} type={"submit"}>ADD</Button>
      </form>
    </div>
  );
}
