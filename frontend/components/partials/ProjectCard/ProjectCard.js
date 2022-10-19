import React from 'react';

import { useNavigate } from "react-router-dom";

import ExternalLink from '../ExternalLink/ExternalLink';
import MoreOptions from '../MoreOptions/MoreOptions';

import './ProjectCard.css';

export default function ProjectCard({ project, showOptions }) {
  const navigate = useNavigate();

  return (
    <div className="project-card">
      <div className="project-card-top">
        <img className="project-card-image" src={project.logoUrl} alt={project.name} />
        <div className="project-card-info">
          <div className="project-card-name">{project.name}</div>
          <ExternalLink to={project.websiteUrl} />
        </div>
      </div>
      <div className="project-card-description">{project.description}</div>
      <span className="tag">EVENT SOON</span>
      {showOptions && <MoreOptions options={[
        {
          text: "View Project",
          method: () => {
            navigate(`/project/${project.id}`);
          },
        },
        {
          text: "Update Project",
          method: () => {
            navigate(`/project/${project.id}/update`);
          },
        },
        {
          text: "Create Event",
          method: () => {
            navigate(`/project/${project.id}/create-event`);
          },
        },
        {
          text: "Delete Project",
          method: () => {
            console.log("Delete Project")
          },
        }
      ]} />}
    </div>
  );
}
