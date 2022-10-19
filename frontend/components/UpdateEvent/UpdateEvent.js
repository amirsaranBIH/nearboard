import React from 'react';
import MainHeading from '../partials/MainHeading/MainHeading';
import ProjectCard from '../partials/ProjectCard/ProjectCard';
import FaqSection from '../sections/FaqSection/FaqSection';

import './UpdateEvent.css';

export default function UpdateEvent() {
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
            <MainHeading heading={"Update AMA Tuesday Event"} tooltip={"Fill in the form to update event"} />
            <form className="form">
              <input className="input" type="text" placeholder="Name" />
              <input className="input" type="text" placeholder="Event URL" />
              <input className="input" type="text" placeholder="Event Date" />
              <input className="input" type="text" placeholder="Event Type" />
              <div>
                <button className="btn">+ UPDATE EVENT</button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
