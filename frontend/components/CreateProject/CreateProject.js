import React from 'react';
import MainHeading from '../partials/MainHeading/MainHeading';
import FaqSection from '../sections/FaqSection/FaqSection';

import './CreateProject.css';

export default function CreateProject() {
  return (
    <div>
      <div className="wrapper">
        <aside className="aside">
          <FaqSection />
        </aside>
        <main className="main">
          <div className="section">
            <MainHeading heading={"Create a Project"} tooltip={"Fill in the form to create the project"} />
            <form className="form">
              <input className="input" type="text" placeholder="Name" />
              <input className="input" type="text" placeholder="Description (max. 100 characters)" />
              <input className="input" type="text" placeholder="Website URL" />
              <input className="input" type="text" placeholder="Logo image URL" />
              <div>
                <button className="btn">+ CREATE PROJECT</button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
