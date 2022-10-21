import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import NearboardContext from '../../store/NearboardContext';
import MainHeading from '../partials/MainHeading/MainHeading';
import ProjectCard from '../partials/ProjectCard/ProjectCard';
import FaqSection from '../sections/FaqSection/FaqSection';

import './UpdateEvent.css';

export default function UpdateEvent() {
  const nearboardContext = useContext(NearboardContext);

  const { eventId } = useParams();

  const [project, setProject] = useState({});
  const [event, setEvent] = useState({});

  useEffect(() => {
    nearboardContext.Nearboard.getEvent(eventId).then(res => {
      setEvent(res);
      nearboardContext.Nearboard.getProject(res.projectId).then(res => {
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

  function onSubmitHandler(e) {
    e.preventDefault();

    nearboardContext.Nearboard.updateEvent(event).then(res => {
      console.log(res)
    });
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
            <MainHeading heading={"Update AMA Tuesday Event"} tooltip={"Fill in the form to update event"} />
            <form className="form" onSubmit={onSubmitHandler}>
              <input className="input" type="text" placeholder="Name" value={event.name} onInput={onEventNameChangeHandler} />
              <input className="input" type="text" placeholder="Event URL" value={event.eventUrl} onInput={onEventUrlChangeHandler} />
              <input className="input" type="date" placeholder="Event Date" value={event.startDate ? new Date(event.startDate).toISOString().split('T')[0] : null} onChange={onEventStartDateChangeHandler} />
              <select className="input" value={event.eventType} onChange={onEventTypeChangeHandler} >
                <option value="LiveEvent">Live Event</option>
                <option value="OnlineEvent">Online Event</option>
                <option value="AMA">AMA</option>
                <option value="Podcast">Podcast</option>
              </select>
              <div>
                <button className="btn" type="submit">+ UPDATE EVENT</button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
