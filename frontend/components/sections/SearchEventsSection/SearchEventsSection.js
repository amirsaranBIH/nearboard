import React, { useState } from 'react';

import searchIcon from "../../../assets/icons/search.svg"

import './SearchEventsSection.css';

export default function SearchEventsSection({ events, setEvents }) {
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("");

  function filterEvents(name, type) {
    const filteredEvents = events.filter(event => {
      return event.name.toLowerCase().includes(name) &&
            (type === "" || event.eventType === type);
    });
    setEvents(filteredEvents);
  }

  function onEventNameChangeHandler(e) {
    setEventName(e.target.value);
    filterEvents(e.target.value, eventType);
  }

  function onEventTypeChangeHandler(e) {
    setEventType(e.target.value);
    filterEvents(eventName, e.target.value);
  }

  return (
    <div className="section event-search">
      <div className="heading">
          <img src={searchIcon} alt="search icon" />
          <span>Search events</span>
      </div>
      <div className="search-inputs">
        <input className="input" type="text" placeholder="Type event name" value={eventName} onInput={onEventNameChangeHandler} />
        <select className="input" value={eventType} onChange={onEventTypeChangeHandler}>
          <option value="">All Types</option>
          <option value="LiveEvent">Live Event</option>
          <option value="OnlineEvent">Online Event</option>
          <option value="AMA">AMA</option>
          <option value="Podcast">Podcast</option>
        </select>
      </div>
    </div>
  );
}
