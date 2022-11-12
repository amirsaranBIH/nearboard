import React from 'react';
import { Link } from 'react-router-dom';

import './ProjectsListSection.css';

export default function ProjectsListSection({ projects }) {

  return (
    <div className="projects-list">
            {projects.slice(0, 5).length > 0 ? projects.slice(0, 5).map(project => {
              return <div key={project.id}>
                <img src={project.logoUrl} alt={project.name + " logo"} />
                <Link to={"/project/" + project.id} className="link">{project.name}</Link>
                {project.hasUpcomingEvent && <div className="project-status">
                  <span className="tag">Event Soon</span>
                </div>}
              </div>;
            }): <div className="no-content">Not following any project</div>}
        </div>
  );
}
