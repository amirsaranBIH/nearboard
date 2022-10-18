import React from 'react';

import { Navigate } from 'react-router-dom';

import profileIcon from "../../assets/icons/profile.svg"
import FaqSection from '../sections/FaqSection/FaqSection';
import MainHeading from '../partials/MainHeading/MainHeading';
import ExternalLink from '../partials/ExternalLink/ExternalLink';
import ProjectCard from '../partials/ProjectCard/ProjectCard';

import './Profile.css';

export default function Profile({ accountId, wallet }) {
  return (
    <div>
      <div className="wrapper">
        <aside className="aside">
          <div className="section">
            <div className="heading">
              <img src={profileIcon} alt="profile icon" />
              <span>Logged in as</span>
            </div>
            <div className="account-id"><ExternalLink text={accountId} to={"https://explorer.testnet.near.org/accounts/" + accountId} /></div>
            <button className="btn btn--secondary" onClick={() => {
              wallet.signOut();
              <Navigate to="/" />
            }}>Log out</button>
          </div>
          <FaqSection />
        </aside>
        <main className="main">
          <div className="section">
            <MainHeading heading={"My Projects"} tooltip={"List of my projects where I can create events"} />
            <div className="my-projects">
              <ProjectCard project={""} showOptions={""} />
              <ProjectCard project={""} showOptions={""} />
              <ProjectCard project={""} showOptions={""} />
              <ProjectCard project={""} showOptions={""} />
              <ProjectCard project={""} showOptions={""} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
