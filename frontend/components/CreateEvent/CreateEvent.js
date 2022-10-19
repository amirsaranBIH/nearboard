import React from 'react';
import MainHeading from '../partials/MainHeading/MainHeading';
import ProjectCard from '../partials/ProjectCard/ProjectCard';
import FaqSection from '../sections/FaqSection/FaqSection';

import './CreateEvent.css';

export default function CreateEvent() {
  return (
    <div>
      <div className="wrapper">
        <aside className="aside">
          <div className="section">
            <ProjectCard />
          </div>
          <FaqSection />
        </aside>
        <main className="main">
          <div className="section">
            <MainHeading heading={"Create Aurora Event"} tooltip={"Fill in the form to create a event where you will answer questions"} />
            <form className="form">
              <input className="input" type="text" placeholder="Name" />
              <input className="input" type="text" placeholder="Event URL" />
              <input className="input" type="text" placeholder="Event Date" />
              <input className="input" type="text" placeholder="Event Type" />
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
