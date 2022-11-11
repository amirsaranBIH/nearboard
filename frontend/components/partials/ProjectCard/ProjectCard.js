import React, { useState, useEffect, useContext } from 'react';

import { Link } from "react-router-dom";
import { toast } from 'react-toastify';

import NearboardContext from '../../../store/NearboardContext';
import ExternalLink from '../ExternalLink/ExternalLink';
import MoreOptions from '../MoreOptions/MoreOptions';

import './ProjectCard.css';

export default function ProjectCard({ project, options, onFollow, onUnfollow }) {
  const nearboardContext = useContext(NearboardContext);

  const [followers, setFollowers] = useState([]);
  const [upcomingEvent, setUpcomingEvent] = useState(null);

  useEffect(() => {
    nearboardContext.contract.getProjectFollowers(project.id).then(res => {
      setFollowers(res);
    });
    nearboardContext.contract.getProjectUpcomingEvent(project.id).then(res => {
      setUpcomingEvent(res);
    });
  }, []);

  function followProject() {
    nearboardContext.contract.followProject(project.id).then(() => {
      toast.success("Successfully followed project");
      setFollowers(followers.concat([nearboardContext.wallet.accountId]));
      if (onFollow) {
        onFollow(project);
      }
    });
  }

  function unfollowProject() {
    nearboardContext.contract.unfollowProject(project.id).then(() => {
      toast.success("Successfully unfollowed project");
      setFollowers(followers.filter(follower => follower !== nearboardContext.wallet.accountId));
      if (onUnfollow) {
        onUnfollow(project);
      }
    });
  }

  return (
    <div className="project-card">
      <div className="project-card-top">
        <Link to={"/project/" + project.id}><img className="project-card-image" src={project.logoUrl} alt={project.name} /></Link>
        <div className="project-card-info">
          <div className="project-card-name"><Link to={"/project/" + project.id}>{project.name}</Link></div>
          <ExternalLink to={project.websiteUrl} />
          {upcomingEvent && <span className="project-status">
            <span className="tag">Event Soon</span>
          </span>}
        </div>
      </div>
      <div className="project-followers">
        <div>{followers.length} Followers</div>
        {nearboardContext.isSignedIn && followers.includes(nearboardContext.wallet.accountId) && 
        <button className="btn btn--small btn--secondary" type="button" onClick={unfollowProject}>Following</button>}
        {nearboardContext.isSignedIn && !followers.includes(nearboardContext.wallet.accountId) &&
        <button className="btn btn--small" type="button" onClick={followProject}>Follow</button>}
      </div>
      {options && <MoreOptions options={options} />}
    </div>
  );
}
