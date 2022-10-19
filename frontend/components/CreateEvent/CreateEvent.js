import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import MainHeading from '../partials/MainHeading/MainHeading';
import ProjectCard from '../partials/ProjectCard/ProjectCard';
import FaqSection from '../sections/FaqSection/FaqSection';

import './CreateEvent.css';

export default function CreateEvent({ Nearboard }) {
  const { id } = useParams();

  const [project, setProject] = useState({});

  useEffect(() => {
    Nearboard.getProject(parseInt(id, 10)).then(res => {
      setProject(res);
    });
  }, []);

  const eventNameInputRef = useRef(null);
  const eventUrlInputRef = useRef(null);
  const eventDateUrlInputRef = useRef(null);
  const eventTypeInputRef = useRef(null);

  function createEvent(e) {
    e.preventDefault();

    const data = {
      projectId: project.id,
      name: eventNameInputRef.current.value,
      eventUrl: eventUrlInputRef.current.value,
      startDate: new Date(eventDateUrlInputRef.current.value).getTime(),
      eventType: eventTypeInputRef.current.value,
    };

    Nearboard.createEvent(data).then(res => {
      console.log(res);
    });
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
            <MainHeading heading={"Create Aurora Event"} tooltip={"Fill in the form to create a event where you will answer questions"} />
            <form className="form" onSubmit={createEvent}>
              <input className="input" type="text" placeholder="Name" ref={eventNameInputRef} />
              <input className="input" type="text" placeholder="Event URL" ref={eventUrlInputRef} />
              <input className="input" type="date" placeholder="Event Date" ref={eventDateUrlInputRef} />
              <select className="input" ref={eventTypeInputRef}>
                <option value="LiveEvent">Live Event</option>
                <option value="OnlineEvent">Online Event</option>
                <option value="AMA">AMA</option>
                <option value="Podcast">Podcast</option>
              </select>
              <div>
                <button className="btn">+ CREATE EVENT</button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
