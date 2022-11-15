import React from 'react';
import { Link } from 'react-router-dom';

import './ProjectsListSection.css';

export default function ProjectsListSection({ projects }) {

  return (
    <div className="projects-list">
            {projects.length > 0 ? projects.map(project => {
              return <div key={project.id}>
                <img src={project.logoUrl} alt={project.name + " logo"} />
                <Link to={"/project/" + project.id} className="link">{project.name}</Link>
              </div>;
            }): <div className="no-content">Not following any project</div>}
        </div>
  );
}
