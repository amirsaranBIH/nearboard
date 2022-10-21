import React from 'react';

import searchIcon from "../../../assets/icons/search.svg"

import './SearchQuestionsSection.css';

export default function SearchQuestionsSection({ questions, setQuestions }) {
  function filterQuestions(e) {
    const filteredQuestions = questions.filter(question => question.question.toLowerCase().includes(e.target.value));
    setQuestions(filteredQuestions);
  }

  return (
    <div className="section">
      <div className="heading">
          <img src={searchIcon} alt="search icon" />
          <span>Search questions</span>
      </div>
      <input className="input" type="text" placeholder="Type in your question" onInput={filterQuestions} />
    </div>
  );
}
