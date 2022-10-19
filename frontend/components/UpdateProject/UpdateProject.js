import React, { useEffect, useState } from 'react';

import { Link, useParams } from "react-router-dom";

import EventCard from '../partials/EventCard/EventCard';
import MainHeading from '../partials/MainHeading/MainHeading';
import ProjectCard from '../partials/ProjectCard/ProjectCard';
import FaqSection from '../sections/FaqSection/FaqSection';

import './UpdateProject.css';

export default function UpdateProject({ Nearboard }) {
  const { id } = useParams();

  const [project, setProject] = useState({});

  useEffect(() => {
    Nearboard.getProject(parseInt(id, 10)).then(res => {
      console.log(res)
      setProject(res);
    });
  }, []);

  return (
    <div className="update-project">
      <div className="wrapper">
        <aside className="aside">
          <div className="section">
              <ProjectCard project={project} />
          </div>
          <FaqSection />
        </aside>
        <main className="main">
          <div className="section">
            <MainHeading heading={"Update Aurora Project"} tooltip={"Update project information"} />
            <form className="form update-project-form">
              <input className="input" type="text" placeholder="Name" />
              <input className="input" type="text" placeholder="Description (max. 100 characters)" />
              <input className="input" type="text" placeholder="Website URL" />
              <input className="input" type="text" placeholder="Logo image URL" />
              <div className="update-project-info-buttons">
                <button className="btn">+ CREATE PROJECT</button>
                <button className="btn btn--secondary">DELETE PROJECT</button>
              </div>
            </form>
            <MainHeading heading={"Aurora Events"} tooltip={"Create and update event information"} />
            <div className="events">
              {project.events && Object.values(project.events).map(event => {
                return <EventCard key={event.id} project={project} event={event} showOptions={true} />;
              })}
            </div>
            <Link to={`/project/${project.id}/create-event`}><button className="btn">+ CREATE EVENT</button></Link>
          </div>
        </main>
      </div>
    </div>
  );
}
