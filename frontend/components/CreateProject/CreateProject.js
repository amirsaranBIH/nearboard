import React, { useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import NearboardContext from '../../store/NearboardContext';
import MainHeading from '../partials/MainHeading/MainHeading';
import FaqSection from '../sections/FaqSection/FaqSection';

import './CreateProject.css';

export default function CreateProject() {
  const navigate = useNavigate();

  const nearboardContext = useContext(NearboardContext)

  const projectNameInputRef = useRef(null);
  const projectDescriptionInputRef = useRef(null);
  const projectWebsiteUrlInputRef = useRef(null);
  const projectLogoImageUrlInputRef = useRef(null);

  function createProject(e) {
    e.preventDefault();

    const data = {
      name: projectNameInputRef.current.value,
      description: projectDescriptionInputRef.current.value,
      websiteUrl: projectWebsiteUrlInputRef.current.value,
      logoUrl: projectLogoImageUrlInputRef.current.value,
    };

    nearboardContext.Nearboard.createProject(data).then(res => {
      navigate(`/project/${res}/update`);
    });
  }

  return (
    <div>
      <div className="wrapper">
        <aside className="aside">
          <FaqSection />
        </aside>
        <main className="main">
          <div className="section">
            <MainHeading heading={"Create a Project"} tooltip={"Fill in the form to create the project"} />
            <form className="form" onSubmit={createProject}>
              <input className="input" type="text" placeholder="Name" ref={projectNameInputRef} />
              <input className="input" type="text" placeholder="Description (max. 100 characters)" ref={projectDescriptionInputRef} />
              <input className="input" type="text" placeholder="Website URL" ref={projectWebsiteUrlInputRef} />
              <input className="input" type="text" placeholder="Logo image URL" ref={projectLogoImageUrlInputRef} />
              <div>
                <button className="btn" type="submit">+ CREATE PROJECT</button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
