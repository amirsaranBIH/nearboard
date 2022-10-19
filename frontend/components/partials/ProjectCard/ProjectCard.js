import React from 'react';

import { useNavigate } from "react-router-dom";

import infoIcon from "../../../assets/icons/info.svg"

import ExternalLink from '../ExternalLink/ExternalLink';
import MoreOptions from '../MoreOptions/MoreOptions';

import './ProjectCard.css';

export default function ProjectCard({ project, showOptions }) {
  const navigate = useNavigate();

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
      <span className="tag">EVENT SOON</span>
      {showOptions && <MoreOptions options={[
        {
          text: "View Project",
          method: () => {
            navigate("/project/1");
          },
        },
        {
          text: "Update Project",
          method: () => {
            navigate("/project/1/update");
          },
        },
        {
          text: "Create Event",
          method: () => {
            navigate("/create-event");
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
