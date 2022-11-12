import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import NearboardContext from '../../store/NearboardContext';
import Button from '../partials/Button/Button';
import MainHeading from '../partials/MainHeading/MainHeading';
import ProjectCard from '../partials/ProjectCard/ProjectCard';
import FaqSection from '../sections/FaqSection/FaqSection';

import editIcon from '../../assets/icons/edit.svg';

import './UpdateEvent.css';
import { toast } from 'react-toastify';

export default function UpdateEvent() {
  const nearboardContext = useContext(NearboardContext);

  const { eventId } = useParams();

  const [errors, setErrors] = useState({});
  const [dirty, setDirty] = useState(false);
  const [project, setProject] = useState(null);
  const [event, setEvent] = useState({});

  useEffect(() => {
    checkErrors();
  }, [event]);

  useEffect(() => {
    nearboardContext.contract.getEvent(eventId).then(res => {
      setEvent(res);
      nearboardContext.contract.getProject(res.projectId).then(res => {
        setProject(res);
      });
    });
  }, []);

  function onEventNameChangeHandler(e) {
    setEvent({ ...event, name: e.target.value });
  }

  function onEventUrlChangeHandler(e) {
    setEvent({ ...event, eventUrl: e.target.value });
  }

  function onEventStartDateChangeHandler(e) {
    setEvent({ ...event, startDate: e.target.value });
  }

  function onEventTypeChangeHandler(e) {
    setEvent({ ...event, eventType: e.target.value });
  }

  function onSubmitHandler() {
    setDirty(true);

    const isValid = verifyFormValues();

    if (!isValid) {
      console.log("Form is not valid");
      return;
    }

    nearboardContext.contract.updateEvent(event).then(() => {
      toast.success("Successfully updated event");
    });
  }

  function isUrl(url) {
    const res = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return res !== null;
  }

  function verifyFormValues() {
    const errorMessages = {};

    if (event.name.length < 3) {
      errorMessages.name = "Event name must be at least 3 characters";
    }

    if (event.name.length > 50) {
      errorMessages.name = "Event name must be 50 characters or less";
    }

    if (!event.startDate) {
      errorMessages.startDate = "Event start date not set";
    }

    if (!isUrl(event.eventUrl)) {
      errorMessages.eventUrl = "Invalid website url";
    }

    if (!["LiveEvent", "OnlineEvent", "AMA", "Podcast"].includes(event.eventType)) {
      errorMessages.eventType = "Event type must be in enum EventType";
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

  if (!project || !event) {
    return null;
  }

  return (
    <div>
      <div className="wrapper">
        <aside className="aside">
          <div className="section">
            <ProjectCard project={project} />
          </div>
          <FaqSection />
        </aside>
        <main className="main">
          <div className="section">
            <div>
              <MainHeading heading={"Update AMA Tuesday Event"} tooltip={"Fill in the form to update event"} />
              <form className="form">
                <div className="form-field">
                  <input className="input" type="text" placeholder="Name" value={event.name} onInput={onEventNameChangeHandler} />
                  {hasErrors("name") && (
                    <span className="error-message">{getError("name")}</span>
                  )}
                </div>
                <div className="form-field">
                  <input className="input" type="text" placeholder="Event URL" value={event.eventUrl} onInput={onEventUrlChangeHandler} />
                  {hasErrors("eventUrl") && (
                    <span className="error-message">{getError("eventUrl")}</span>
                  )}
                </div>
                <div className="form-field">
                  <input className="input" type="date" placeholder="Event Date" value={event.startDate ? new Date(Number(event.startDate)).toISOString().split('T')[0] : null} onChange={onEventStartDateChangeHandler} />
                  {hasErrors("startDate") && (
                    <span className="error-message">{getError("startDate")}</span>
                  )}
                </div>
                <div className="form-field">
                  <select className="input" value={event.eventType} onChange={onEventTypeChangeHandler} >
                    <option value="LiveEvent">Live Event</option>
                    <option value="OnlineEvent">Online Event</option>
                    <option value="AMA">AMA</option>
                    <option value="Podcast">Podcast</option>
                  </select>
                  {hasErrors("eventType") && (
                    <span className="error-message">{getError("eventType")}</span>
                  )}
                </div>
              </form>
            </div>
            <div>
              <Button icon={editIcon} type={"submit"} onClick={onSubmitHandler}>UPDATE EVENT</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
