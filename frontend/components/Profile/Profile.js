import React, { useEffect, useState, useContext } from 'react';

import { useNavigate, Link } from 'react-router-dom';

import profileIcon from "../../assets/icons/profile.svg"
import FaqSection from '../sections/FaqSection/FaqSection';
import MainHeading from '../partials/MainHeading/MainHeading';
import ExternalLink from '../partials/ExternalLink/ExternalLink';
import ProjectCard from '../partials/ProjectCard/ProjectCard';
import NearboardContext from '../../store/NearboardContext';
import SearchProjectsSection from '../sections/SearchProjectsSection/SearchProjectsSection';
import ProjectsListSection from '../sections/ProjectsListSection/ProjectsListSection';

import projectsIcon from "../../assets/icons/projects.svg"
import addIcon from "../../assets/icons/add.svg"

import './Profile.css';
import Button from '../partials/Button/Button';
import { toast } from 'react-toastify';
import AllProjectFollowsModal from '../partials/AllProjectFollowsModal/AllProjectFollowsModal';
import Emitter from '../../emitter';

export default function Profile() {
  const nearboardContext = useContext(NearboardContext);
  const navigate = useNavigate();

  const [allProjects, setAllProjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectFollows, setProjectFollows] = useState([]);
  

  useEffect(() => {
    nearboardContext.contract.getUserProjects(nearboardContext.wallet.accountId).then(res => {
      setAllProjects(res);
      setProjects(res);
    })
    nearboardContext.contract.getUserFollows(nearboardContext.wallet.accountId).then(res => {
      setProjectFollows(res);
    });
  }, []);

  function switchWallet() {
    nearboardContext.wallet.signIn();
  }

  async function signOut() {
    await nearboardContext.wallet.signOut();
    nearboardContext.setIsSignedIn(false);
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
          if (!confirm("Are you sure you want to delete project?")) {
            return;
          }
          nearboardContext.contract.deleteProject(project.id).then(() => {
            toast.success("Successfully deleted project");
            setAllProjects(allProjects.filter(p => p.id !== project.id))
            setProjects(projects.filter(p => p.id !== project.id))
          });
        },
      }
    ]
  }

  function onFollow(project) {
    setProjectFollows(projectFollows.concat([project]));
  }

  function onUnfollow(project) {
    setProjectFollows(projectFollows.filter(follow => follow.id !== project.id));
  }

  function openAllProjectsFollowsModal() {
    Emitter.emit("OPEN_ALL_PROJECT_FOLLOWS_MODAL", projectFollows);
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
            <div className="profile-buttons">
              <button className="btn" onClick={switchWallet}>Switch wallet</button>
              <button className="btn btn--secondary" onClick={signOut}>Log out</button>
            </div>
          </div>
          <SearchProjectsSection projects={allProjects} setProjects={setProjects} />
          <div className="section">
            <div className="heading">
              <img src={projectsIcon} alt="four boxes icon" />
              <span>Projects You Follow ({projectFollows.length})</span>
            </div>
            <ProjectsListSection projects={projectFollows.slice(0, 5)} />
            <div className="view-more">
              <span className="link" onClick={openAllProjectsFollowsModal}>View all</span>
          </div>
          </div>
          <FaqSection />
        </aside>
        <main className="main">
          <div className="section">
            <div>
              <MainHeading heading={"My Projects"} tooltip={"List of my projects where I can create events"} />
              {projects.length > 0 ? 
              <div className="my-projects">
                {projects.map(project => {
                  return <ProjectCard key={project.id} project={project} options={getProjectOptions(project)} onFollow={onFollow} onUnfollow={onUnfollow} />
                })}
              </div>
              : <div className="no-content">No projects created</div>}
            </div>
            
            <Link to="/create-project"><Button icon={addIcon}>CREATE PROJECT</Button></Link>
          </div>
        </main>
      </div>
      <AllProjectFollowsModal />
    </div>
  );
}
