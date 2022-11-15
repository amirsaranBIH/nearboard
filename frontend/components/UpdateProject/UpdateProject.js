import React, { useEffect, useState, useContext } from 'react';

import { Link, useNavigate, useParams } from "react-router-dom";

import NearboardContext from '../../store/NearboardContext';
import Button from '../partials/Button/Button';
import EventCard from '../partials/EventCard/EventCard';
import MainHeading from '../partials/MainHeading/MainHeading';
import ProjectCard from '../partials/ProjectCard/ProjectCard';
import FaqSection from '../sections/FaqSection/FaqSection';

import addIcon from '../../assets/icons/add.svg';
import editIcon from '../../assets/icons/edit.svg';
import trashIcon from '../../assets/icons/trash.svg';

import './UpdateProject.css';
import { toast } from 'react-toastify';

export default function UpdateProject() {
  const nearboardContext = useContext(NearboardContext);

  const { id } = useParams();
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [dirty, setDirty] = useState(false);
  const [project, setProject] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    nearboardContext.contract.getProject(id).then(res => {
      setProject(res);

      nearboardContext.contract.getProjectEvents(res.id).then(res => {
        setEvents(res);
      });
    });
  }, []);

  useEffect(() => {
    checkErrors();
  }, [project]);

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

    setDirty(true);

    const isValid = verifyFormValues();

    if (!isValid) {
      console.log("Form is not valid");
      return;
    }

    nearboardContext.contract.updateProject(project).then(() => {
      toast.success("Successfully updated project");
    });
  }

  function isUrl(url) {
    const res = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,8}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return res !== null;
  }

  function verifyFormValues() {
    const errorMessages = {};

    
    if (project.name.length < 3) {
      errorMessages.name = "Project name must be at least 3 characters"
    }

    if (project.name.length > 50) {
      errorMessages.name = "Project name must be 50 characters or less";
    }

    if (project.description.length < 20) {
      errorMessages.description = "Project description must be at lease 20 characters";
    }

    if (project.description.length > 100) {
      errorMessages.description = "Project description must be 100 characters or less";
    }

    if (!isUrl(project.websiteUrl)) {
      errorMessages.websiteUrl = "Invalid website url";
    }

    if (!isUrl(project.logoUrl)) {
      errorMessages.logoUrl = "Invalid logo url";
    }

    setErrors(errorMessages);

    return Object.keys(errorMessages).length === 0;
  }

  function hasErrors(field) {
    return errors[field] !== undefined;
  }

  function getError(field) {
    return errors[field];
  }

  function checkErrors() {
    if (dirty) {
      verifyFormValues();
    }
  }

  function deleteProject() {
    if (!confirm("Are you sure you want to delete project?")) {
      return;
    }
    nearboardContext.contract.deleteProject(project.id).then(() => {
      toast.success("Successfully deleted project");
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
          if (!confirm("Are you sure you want to delete event?")) {
            return;
          }
          nearboardContext.contract.deleteEvent(event.id).then(() => {
            toast.success("Successfully deleted event");
            setEvents(events.filter(e => e.id !== event.id));
          });
        },
      },
    ]
  }

  if (!project) {
    return null;
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
            <div>
              <MainHeading heading={"Update Aurora Project"} tooltip={"Update project information"} />
              <form className="form update-project-form" onSubmit={onSubmitHandler}>
                <div className="form-field">
                  <input className="input" type="text" placeholder="Name" value={project.name} onInput={onProjectNameChangeHandler} />
                  {hasErrors("name") && (
                    <span className="error-message">{getError("name")}</span>
                  )}
                </div>
                <div className="form-field">
                  <input className="input" type="text" placeholder="Description (max. 100 characters)" value={project.description} onInput={onProjectDescriptionChangeHandler} />
                  {hasErrors("description") && (
                    <span className="error-message">{getError("description")}</span>
                  )}
                </div>
                <div className="form-field">
                  <input className="input" type="text" placeholder="Website URL" value={project.websiteUrl} onInput={onProjectWebsiteUrlChangeHandler} />
                  {hasErrors("websiteUrl") && (
                    <span className="error-message">{getError("websiteUrl")}</span>
                  )}
                </div>
                <div className="form-field">
                  <input className="input" type="text" placeholder="Logo image URL" value={project.logoUrl} onInput={onProjectLogoUrlChangeHandler} />
                  {hasErrors("logoUrl") && (
                    <span className="error-message">{getError("logoUrl")}</span>
                  )}
                </div>
                <div className="update-project-info-buttons">
                  <Button icon={editIcon} type={"submit"}>UPDATE PROJECT</Button>
                  <Button icon={trashIcon} color={"secondary"} onClick={deleteProject}>DELETE PROJECT</Button>
                </div>
              </form>
              <MainHeading heading={"Aurora Events"} tooltip={"Create and update event information"} />
              {events.length > 0 ? <div className="events">
                {events.map(event => {
                  return <EventCard key={event.id} event={event} options={getEventOptions(event)} />;
                })}
              </div> : <div className="no-content">No events created</div>}
            </div>
            <Link to={"/project/" + project.id + "/create-event"}><Button icon={addIcon}>CREATE EVENT</Button></Link>
          </div>
        </main>
      </div>
    </div>
  );
}
