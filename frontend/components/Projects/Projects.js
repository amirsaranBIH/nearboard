import React, { useEffect, useState } from 'react';
import MainHeading from '../partials/MainHeading/MainHeading';
import ProjectCard from '../partials/ProjectCard/ProjectCard';
import FaqSection from '../sections/FaqSection/FaqSection';
import SearchQuestionsSection from '../sections/SearchQuestionsSection/SearchQuestionsSection';
import UpcomingEventsSection from '../sections/UpcomingEventsSection/UpcomingEventsSection';

import './Projects.css';

export default function Projects({ Nearboard }) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    Nearboard.getProjects().then(res => {
      console.log(res)
      setProjects(res);
    });
  }, []);

  return (
    <div>
      <div className="wrapper">
        <aside className="aside">
          <SearchQuestionsSection />
          <UpcomingEventsSection Nearboard={Nearboard} />
          <FaqSection />
        </aside>
        <main className="main">
          <div className="section">
            <MainHeading heading={"All Projects"} tooltip={"List of all projects that create events"} />
            <div className="all-projects">
              {projects.map(project => {
                return <ProjectCard key={project.id} project={project} />
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
