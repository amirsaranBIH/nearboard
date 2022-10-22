import React from 'react';

import searchIcon from "../../../assets/icons/search.svg"

import './SearchEventsSection.css';

export default function SearchEventsSection({ events, setEvents }) {
  function filterEvents(e) {
    const filteredEvents = events.filter(event => event.name.toLowerCase().includes(e.target.value));
    setEvents(filteredEvents);
  }

  return (
    <div className="section">
      <div className="heading">
          <img src={searchIcon} alt="search icon" />
          <span>Search events</span>
      </div>
      <input className="input" type="text" placeholder="Type event name" onInput={filterEvents} />
    </div>
  );
}
