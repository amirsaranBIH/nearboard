import React, { useEffect, useState } from 'react';

import { useNavigate, Link } from 'react-router-dom';

import profileIcon from "../../assets/icons/profile.svg"
import FaqSection from '../sections/FaqSection/FaqSection';
import MainHeading from '../partials/MainHeading/MainHeading';
import ExternalLink from '../partials/ExternalLink/ExternalLink';
import ProjectCard from '../partials/ProjectCard/ProjectCard';

import './Profile.css';

export default function Profile({ Nearboard, accountId, wallet }) {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    Nearboard.getUserProjects(accountId).then(res => {
      console.log(res)
      setProjects(res);
    })
  }, []);

  function switchWallet() {
    wallet.signIn();
  }

  function signOut() {
    wallet.signOut();
    navigate("/");
  }

  return (
    <div>
      <div className="wrapper">
        <aside className="aside">
          <div className="section">
            <div className="heading">
              <img src={profileIcon} alt="profile icon" />
              <span>Logged in as</span>
            </div>
            <div className="account-id"><ExternalLink to={"https://explorer.testnet.near.org/accounts/" + accountId} /></div>
            <div className="profile-button">
              <button className="btn" onClick={switchWallet}>Switch wallet</button>
              <button className="btn btn--secondary" onClick={signOut}>Log out</button>
            </div>
          </div>
          <FaqSection />
        </aside>
        <main className="main">
          <div className="section">
            <MainHeading heading={"My Projects"} tooltip={"List of my projects where I can create events"} />
            <div className="my-projects">
              {projects.length < 1 ? <span>No projects</span> : projects.map(project => {
                return <ProjectCard key={project.id} project={project} showOptions={true} />
              })}
            </div>
            <Link to="/create-project"><button className="btn">+ CREATE PROJECT</button></Link>
          </div>
        </main>
      </div>
    </div>
  );
}
