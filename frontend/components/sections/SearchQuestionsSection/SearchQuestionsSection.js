import React from 'react';

import searchIcon from "../../../assets/icons/search.svg"

import './SearchQuestionsSection.css';

export default function SearchQuestionsSection() {
  return (
    <div className="section">
      <div className="heading">
          <img src={searchIcon} alt="search icon" />
          <span>Search questions</span>
      </div>
      <input className="input" type="text" placeholder="Type in your Question" />
    </div>
  );
}
