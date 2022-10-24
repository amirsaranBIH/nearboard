import React, { useContext, useEffect, useState } from 'react';
import Emitter from '../../../emitter';
import NearboardContext from '../../../store/NearboardContext';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';

import editIcon from '../../../assets/icons/edit.svg';

import './UpdateQuestionModal.css';
import { toast } from 'react-toastify';

export default function UpdateQuestionModal({ onQuestionUpdate }) {
  const nearboardContext = useContext(NearboardContext);

  const [errors, setErrors] = useState({});
  const [dirty, setDirty] = useState(false);

  const [question, setQuestion] = useState({});

  useEffect(() => {
    checkErrors();
  }, [question]);

  useEffect(() => {
    Emitter.on("OPEN_UPDATE_QUESTION_MODAL", (question) => {
      setQuestion(question);
      Emitter.emit("SET_SHOW_MODAL", true);
    });
  }, []);


  function onSubmitHandler(e) {
    e.preventDefault();

    setDirty(true);

    const isValid = verifyFormValues();

    if (!isValid) {
      console.log("Form is not valid");
      return;
    }

    nearboardContext.contract.updateQuestion({ id: question.id, question: question.question }).then(() => {
      toast.success("Successfully updated question");
      onQuestionUpdate(question);
      Emitter.emit("SET_SHOW_MODAL", false);
    });
  }

  function verifyFormValues() {
    const errorMessages = {};

    if (question.question.length < 3) {
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

  function onQuestionChangeHandler(e) {
    setQuestion({
      ...question,
      question: e.target.value
    });
  }

  return (
    <Modal heading={"Update Question"} tooltip={"Questions can't be updated if they reach 50 votes"}>
      <div className="update-question">
        <form onSubmit={onSubmitHandler}>
          <div className="form-field">
            <input className="input" type="text" placeholder="Ask your question here" value={question.question} onChange={onQuestionChangeHandler} />
              {hasErrors("question") && (
                <span className="error-message">{getError("question")}</span>
              )}
          </div>
          <div>
            <Button icon={editIcon} type={"submit"}>UPDATE QUESTION</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
