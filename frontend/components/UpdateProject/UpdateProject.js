import React from 'react';

import { Link } from "react-router-dom";

import EventCard from '../partials/EventCard/EventCard';
import MainHeading from '../partials/MainHeading/MainHeading';
import ProjectCard from '../partials/ProjectCard/ProjectCard';
import FaqSection from '../sections/FaqSection/FaqSection';

import './UpdateProject.css';

export default function UpdateProject() {
  return (
    <div className="update-project">
      <div className="wrapper">
        <aside className="aside">
          <div className="section">
              <ProjectCard />
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
              <EventCard showOptions={true} />
              <EventCard showOptions={true} />
              <EventCard showOptions={true} />
              <EventCard showOptions={true} />
            </div>
            <Link to="/project/1/create-event"><button className="btn">+ CREATE EVENT</button></Link>
          </div>
        </main>
      </div>
    </div>
  );
}
