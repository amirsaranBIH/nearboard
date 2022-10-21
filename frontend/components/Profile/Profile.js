import React, { useEffect, useState, useContext } from 'react';

import { useNavigate, Link } from 'react-router-dom';

import profileIcon from "../../assets/icons/profile.svg"
import FaqSection from '../sections/FaqSection/FaqSection';
import MainHeading from '../partials/MainHeading/MainHeading';
import ExternalLink from '../partials/ExternalLink/ExternalLink';
import ProjectCard from '../partials/ProjectCard/ProjectCard';
import NearboardContext from '../../store/NearboardContext';

import './Profile.css';

export default function Profile() {
  const nearboardContext = useContext(NearboardContext);

  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    nearboardContext.contract.getUserProjects(nearboardContext.wallet.accountId).then(res => {
      setProjects(res);
    })
  }, []);

  function switchWallet() {
    nearboardContext.wallet.signIn();
  }

  function signOut() {
    nearboardContext.wallet.signOut();
    navigate("/");
  }

  function getProjectOptions(project) {
    return [
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
          nearboardContext.contract.deleteProject(project.id).then(res => {
            setProjects(projects.filter(p => p.id !== project.id))
          });
        },
      }
    ]
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
            <div className="account-id"><ExternalLink text={nearboardContext.wallet.accountId} to={"https://explorer.testnet.near.org/accounts/" + nearboardContext.wallet.accountId} /></div>
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
            {projects.length > 0 ? 
            <div className="my-projects">
              {projects.map(project => {
                return <ProjectCard key={project.id} project={project} options={getProjectOptions(project)} />
              })}
            </div>
            : <div className="no-content">No projects created</div>}
            <Link to="/create-project"><button className="btn">+ CREATE PROJECT</button></Link>
          </div>
        </main>
      </div>
    </div>
  );
}
