import React from 'react';

import infoIcon from "../../../assets/icons/info.svg"
import moreIcon from "../../../assets/icons/more.svg"

import ExternalLink from '../ExternalLink/ExternalLink';

import './ProjectCard.css';

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
      <div className="more">
        <img src={moreIcon} alt="more icon" />
      </div>
    </div>
  );
}
