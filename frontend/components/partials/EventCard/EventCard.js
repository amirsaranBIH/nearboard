import React from 'react';

import { useNavigate } from "react-router-dom";
import ExternalLink from '../ExternalLink/ExternalLink';
import MoreOptions from '../MoreOptions/MoreOptions';

import './EventCard.css';

export default function EventCard({ event, showOptions }) {
  const navigate = useNavigate();

  function formatEventType(type) {
    switch (type) {
      case "LiveEvent":
        return "Live Event";
      case "OnlineEvent":
        return "Online Event";
      case "AMA":
        return "AMA";
      case "Podcast":
        return "Podcast";
      default:
        return "No Type";
    }
  }

  function getMonth(date) {
    const MONTHS = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];

    return MONTHS[new Date(date).getMonth()];
  }

  function getDay(date) {
    return new Date(date).getDate();
  }
  
  return (
    <div className="event">
        <div className="event-top">
        <div className="event-date">
            <span className="event-date-month">{getMonth(event.startDate)}</span>
            <span className="event-date-day">{getDay(event.startDate)}</span>
        </div>
        <div className="event-info">
            <span className="event-name">{event.name}</span>
            <span className="event-project"><ExternalLink to={event.eventUrl} /></span>
            <span className="event-type">
                <span className="tag">{formatEventType(event.eventType)}</span>
            </span>
        </div>
        </div>
        {showOptions && <MoreOptions options={[
        {
          text: "Update",
          method: () => {
            navigate(`/project/${event.projectId}/event/${event.id}/update`);
          },
        },
        {
          text: "Delete",
          method: () => {
            console.log("Delete Event");
          },
        },
      ]} />}
    </div>
  );
}
