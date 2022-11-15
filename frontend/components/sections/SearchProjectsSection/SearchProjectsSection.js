import React from 'react';

import searchIcon from "../../../assets/icons/search.svg"

import './SearchProjectsSection.css';

export default function SearchProjectsSection({ projects, setProjects }) {
  function filterProjects(e) {
    const filteredProjects = projects.filter(project => project.name.toLowerCase().includes(e.target.value.toLowerCase()));
    setProjects(filteredProjects);
  }

  return (
    <div className="section">
      <div className="heading">
          <img src={searchIcon} alt="search icon" />
          <span>Search projects</span>
      </div>
      <input className="input" type="text" placeholder="Type project name" onInput={filterProjects} />
    </div>
  );
}
