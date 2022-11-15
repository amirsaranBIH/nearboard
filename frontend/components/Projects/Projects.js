import React, { useEffect, useState, useContext } from 'react';
import NearboardContext from '../../store/NearboardContext';
import MainHeading from '../partials/MainHeading/MainHeading';
import ProjectCard from '../partials/ProjectCard/ProjectCard';
import FaqSection from '../sections/FaqSection/FaqSection';
import PreviousEventsSection from '../sections/PreviousEventsSection/PreviousEventsSection';
import SearchProjectsSection from '../sections/SearchProjectsSection/SearchProjectsSection';
import UpcomingEventsSection from '../sections/UpcomingEventsSection/UpcomingEventsSection';

import './Projects.css';

export default function Projects() {
  const nearboardContext = useContext(NearboardContext);

  const [projects, setProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [previousEvents, setPreviousEvents] = useState([]);

  useEffect(() => {
    nearboardContext.contract.getProjects().then(res => {
      setProjects(res);
      setAllProjects(res);
    });
    nearboardContext.contract.getThreePreviousEvents().then(res => {
      setPreviousEvents(res);
    });
  }, []);

  return (
    <div>
      <div className="wrapper">
        <aside className="aside">
          <SearchProjectsSection projects={allProjects} setProjects={setProjects} />
          <UpcomingEventsSection />
          <PreviousEventsSection events={previousEvents} />
          <FaqSection />
        </aside>
        <main className="main">
          <div className="section">
            <div>
              <MainHeading heading={"All Projects"} tooltip={"List of all projects that create events"} />
              {projects.length > 0 ? <div className="all-projects">
                {projects.map(project => {
                  return <ProjectCard key={project.id} project={project} />
                })}
              </div> 
              : <div className="no-content">No projects created</div>}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
