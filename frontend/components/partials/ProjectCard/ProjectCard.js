import React from 'react';

import { Link } from "react-router-dom";

import ExternalLink from '../ExternalLink/ExternalLink';
import MoreOptions from '../MoreOptions/MoreOptions';

import './ProjectCard.css';

export default function ProjectCard({ project, options }) {
  return (
    <div className="project-card">
      <div className="project-card-top">
        <Link to={"/project/" + project.id}><img className="project-card-image" src={project.logoUrl} alt={project.name} /></Link>
        <div className="project-card-info">
          <div className="project-card-name"><Link to={"/project/" + project.id}>{project.name}</Link></div>
          <ExternalLink to={project.websiteUrl} />
        </div>
      </div>
      <div className="project-card-description">{project.description}</div>
      <span className="tag">EVENT SOON</span>
      {options && <MoreOptions options={options} />}
    </div>
  );
}
