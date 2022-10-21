import React, { useEffect, useState, useContext } from 'react';

import { Link, useNavigate, useParams } from "react-router-dom";

import NearboardContext from '../../store/NearboardContext';
import EventCard from '../partials/EventCard/EventCard';
import MainHeading from '../partials/MainHeading/MainHeading';
import ProjectCard from '../partials/ProjectCard/ProjectCard';
import FaqSection from '../sections/FaqSection/FaqSection';

import './UpdateProject.css';

export default function UpdateProject() {
  const nearboardContext = useContext(NearboardContext);

  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState({});
  const [events, setEvents] = useState([]);

  useEffect(() => {
    nearboardContext.Nearboard.getProject(id).then(res => {
      setProject(res);

      nearboardContext.Nearboard.getProjectEvents(res.id).then(res => {
        setEvents(res);
      });
    });
  }, []);

  function onProjectNameChangeHandler(e) {
    setProject({ ...project, name: e.target.value });
  }

  function onProjectDescriptionChangeHandler(e) {
    setProject({ ...project, description: e.target.value });
  }

  function onProjectWebsiteUrlChangeHandler(e) {
    setProject({ ...project, websiteUrl: e.target.value });
  }

  function onProjectLogoUrlChangeHandler(e) {
    setProject({ ...project, logoUrl: e.target.value });
  }

  function onSubmitHandler(e) {
    e.preventDefault();

    nearboardContext.Nearboard.updateProject(project).then(res => {
      console.log(res)
    });
  }

  function deleteProject() {
    nearboardContext.Nearboard.deleteProject(project.id).then(res => {
      navigate("/profile");
    });
  }

  function getEventOptions(event) {
    return [
      {
        text: "Update",
        method: () => {
          navigate(`/event/${event.id}/update`);
        },
      },
      {
        text: "Delete",
        method: () => {
          nearboardContext.Nearboard.deleteEvent(event.id).then(res => {
            setEvents(events.filter(e => e.id !== event.id));
          });
        },
      },
    ]
  }

  return (
    <div className="update-project">
      <div className="wrapper">
        <aside className="aside">
          <div className="section">
              <ProjectCard project={project} />
          </div>
          <FaqSection />
        </aside>
        <main className="main">
          <div className="section">
            <MainHeading heading={"Update Aurora Project"} tooltip={"Update project information"} />
            <form className="form update-project-form" onSubmit={onSubmitHandler}>
              <input className="input" type="text" placeholder="Name" value={project.name} onInput={onProjectNameChangeHandler} />
              <input className="input" type="text" placeholder="Description (max. 100 characters)" value={project.description} onInput={onProjectDescriptionChangeHandler} />
              <input className="input" type="text" placeholder="Website URL" value={project.websiteUrl} onInput={onProjectWebsiteUrlChangeHandler} />
              <input className="input" type="text" placeholder="Logo image URL" value={project.logoUrl} onInput={onProjectLogoUrlChangeHandler} />
              <div className="update-project-info-buttons">
                <button className="btn" type="submit">UPDATE PROJECT</button>
                <button className="btn btn--secondary" type="button" onClick={deleteProject}>DELETE PROJECT</button>
              </div>
            </form>
            <MainHeading heading={"Aurora Events"} tooltip={"Create and update event information"} />
            <div className="events">
              {events.map(event => {
                return <EventCard key={event.id} event={event} options={getEventOptions(event)} />;
              })}
            </div>
            <Link to={`/project/${project.id}/create-event`}><button className="btn">+ CREATE EVENT</button></Link>
          </div>
        </main>
      </div>
    </div>
  );
}
