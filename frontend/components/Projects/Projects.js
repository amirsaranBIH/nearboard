import React, { useEffect, useState, useContext } from 'react';
import NearboardContext from '../../store/NearboardContext';
import MainHeading from '../partials/MainHeading/MainHeading';
import ProjectCard from '../partials/ProjectCard/ProjectCard';
import FaqSection from '../sections/FaqSection/FaqSection';
import SearchQuestionsSection from '../sections/SearchQuestionsSection/SearchQuestionsSection';
import UpcomingEventsSection from '../sections/UpcomingEventsSection/UpcomingEventsSection';

import './Projects.css';

export default function Projects() {
  const nearboardContext = useContext(NearboardContext);

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    nearboardContext.contract.getProjects().then(res => {
      setProjects(res);
    });
  }, []);

  return (
    <div>
      <div className="wrapper">
        <aside className="aside">
          <SearchQuestionsSection />
          <UpcomingEventsSection />
          <FaqSection />
        </aside>
        <main className="main">
          <div className="section">
            <MainHeading heading={"All Projects"} tooltip={"List of all projects that create events"} />
            {projects.length > 0 ? <div className="all-projects">
              {projects.map(project => {
                return <ProjectCard key={project.id} project={project} />
              })}
            </div> 
            : <div className="no-content">No projects created</div>}
          </div>
        </main>
      </div>
    </div>
  );
}
