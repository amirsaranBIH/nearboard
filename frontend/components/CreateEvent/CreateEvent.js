import React, { useEffect, useRef, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NearboardContext from '../../store/NearboardContext';
import MainHeading from '../partials/MainHeading/MainHeading';
import ProjectCard from '../partials/ProjectCard/ProjectCard';
import FaqSection from '../sections/FaqSection/FaqSection';
import Button from '../partials/Button/Button';

import addIcon from '../../assets/icons/add.svg';

import './CreateEvent.css';
import { toast } from 'react-toastify';

export default function CreateEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const nearboardContext = useContext(NearboardContext);

  const [errors, setErrors] = useState({});
  const [dirty, setDirty] = useState(false);
  const [project, setProject] = useState(null);

  useEffect(() => {
    nearboardContext.contract.getProject(id).then(res => {
      setProject(res);
    });
  }, []);

  const eventNameInputRef = useRef(null);
  const eventUrlInputRef = useRef(null);
  const eventDateUrlInputRef = useRef(null);
  const eventTypeInputRef = useRef(null);

  function onSubmitHandler() {
    setDirty(true);

    const isValid = verifyFormValues();

    if (!isValid) {
      console.log("Form is not valid");
      return;
    }

    const data = {
      projectId: project.id,
      name: eventNameInputRef.current.value,
      eventUrl: eventUrlInputRef.current.value,
      startDate: new Date(eventDateUrlInputRef.current.value).getTime(),
      eventType: eventTypeInputRef.current.value,
    };

    nearboardContext.contract.createEvent(data).then(() => {
      toast.success("Successfully created event");
      navigate(`/project/${id}/update`);
    });
  }

  function isUrl(url) {
    const res = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return res !== null;
  }

  function verifyFormValues() {
    const errorMessages = {};

    const eventNameValue = eventNameInputRef.current.value;
    const eventUrlValue = eventUrlInputRef.current.value;
    const eventStartDateValue = eventDateUrlInputRef.current.value;
    const eventTypeValue = eventTypeInputRef.current.value;

    if (eventNameValue.length < 3) {
      errorMessages.name = "Event name must be at least 3 characters";
    }

    if (eventNameValue.length > 50) {
      errorMessages.name = "Event name must be 50 characters or less";
    }

    if (!eventStartDateValue) {
      errorMessages.startDate = "Event start date not set";
    }

    if (!isUrl(eventUrlValue)) {
      errorMessages.eventUrl = "Invalid website url";
    }

    if (!["LiveEvent", "OnlineEvent", "AMA", "Podcast"].includes(eventTypeValue)) {
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

  if (!project) {
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
              <MainHeading heading={"Create Aurora Event"} tooltip={"Fill in the form to create a event where you will answer questions"} />
              <form className="form">
                <div className="form-field">
                  <input className="input" type="text" placeholder="Name" ref={eventNameInputRef} onChange={checkErrors} />
                  {hasErrors("name") && (
                    <span className="error-message">{getError("name")}</span>
                  )}
                </div>
                <div className="form-field">
                  <input className="input" type="text" placeholder="Event URL" ref={eventUrlInputRef} onChange={checkErrors} />
                  {hasErrors("eventUrl") && (
                    <span className="error-message">{getError("eventUrl")}</span>
                  )}
                </div>
                <div className="form-field">
                  <input className="input" type="date" placeholder="Event Date" ref={eventDateUrlInputRef} onChange={checkErrors} />
                  {hasErrors("startDate") && (
                    <span className="error-message">{getError("startDate")}</span>
                  )}
                </div>
                <div className="form-field">
                  <select className="input" ref={eventTypeInputRef} onChange={checkErrors}>
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
              <Button icon={addIcon} type={"submit"} onClick={onSubmitHandler}>CREATE EVENT</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
