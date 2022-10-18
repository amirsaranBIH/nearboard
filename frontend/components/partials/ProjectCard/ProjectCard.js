import React from 'react';

import infoIcon from "../../../assets/icons/info.svg"

import ExternalLink from '../ExternalLink/ExternalLink';
import MoreOptions from '../MoreOptions/MoreOptions';

import './ProjectCard.css';

const options = [
  {
    text: "View Project",
    method: () => {},
  },
  {
    text: "Create Event",
    method: () => {},
  },
  {
    text: "Update",
    method: () => {},
  },
  {
    text: "Delete",
    method: () => {},
  }
];

export default function ProjectCard({ project, showOptions }) {

  return (
    <div className="project-card">
      <div className="project-card-top">
        <img className="project-card-image" src={infoIcon} alt="Project name" />
        <div className="project-card-info">
          <div className="project-card-name">Aurora</div>
          <ExternalLink text={"https://aurora.dev/something/long/here"} to={"https://aurora.dev/something/long/here"} />
        </div>
      </div>
      <div className="project-card-description">Bridge + EVM Scaling Solution for Ethereum.</div>
      <span className="tag">Event</span>
      {showOptions && <MoreOptions options={options} />}
    </div>
  );
}
