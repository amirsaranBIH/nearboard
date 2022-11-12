import React, { useRef, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NearboardContext from '../../store/NearboardContext';
import MainHeading from '../partials/MainHeading/MainHeading';
import FaqSection from '../sections/FaqSection/FaqSection';
import Button from '../partials/Button/Button';

import addIcon from '../../assets/icons/add.svg';

import './CreateProject.css';
import { toast } from 'react-toastify';

export default function CreateProject() {
  const navigate = useNavigate();

  const nearboardContext = useContext(NearboardContext);
  
  const [errors, setErrors] = useState({});
  const [dirty, setDirty] = useState(false);

  const projectNameInputRef = useRef(null);
  const projectDescriptionInputRef = useRef(null);
  const projectWebsiteUrlInputRef = useRef(null);
  const projectLogoImageUrlInputRef = useRef(null);

  function onSubmitHandler() {
    setDirty(true);

    const isValid = verifyFormValues();

    if (!isValid) {
      console.log("Form is not valid");
      return;
    }

    const data = {
      name: projectNameInputRef.current.value,
      description: projectDescriptionInputRef.current.value,
      websiteUrl: projectWebsiteUrlInputRef.current.value,
      logoUrl: projectLogoImageUrlInputRef.current.value,
    };

    nearboardContext.contract.createProject(data).then(res => {
      toast.success("Successfully created project");
      navigate(`/project/${res.id}/update`);
    });
  }

  function isUrl(url) {
    const res = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return res !== null;
  }

  function verifyFormValues() {
    const errorMessages = {};

    const projectNameValue = projectNameInputRef.current.value;
    const projectDescriptionValue = projectDescriptionInputRef.current.value;
    const projectWebsiteUrlValue = projectWebsiteUrlInputRef.current.value;
    const projectLogoImageUrlValue = projectLogoImageUrlInputRef.current.value;

    
    if (projectNameValue.length < 3) {
      errorMessages.name = "Project name must be at least 3 characters"
    }

    if (projectNameValue.length > 50) {
      errorMessages.name = "Project name must be 50 characters or less";
    }

    if (projectDescriptionValue.length < 20) {
      errorMessages.description = "Project description must be at lease 20 characters";
    }

    if (projectDescriptionValue.length > 100) {
      errorMessages.description = "Project description must be 100 characters or less";
    }

    if (!isUrl(projectWebsiteUrlValue)) {
      errorMessages.websiteUrl = "Invalid website url";
    }

    if (!isUrl(projectLogoImageUrlValue)) {
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

  return (
    <div>
      <div className="wrapper">
        <aside className="aside">
          <FaqSection />
        </aside>
        <main className="main">
          <div className="section">
            <div>
              <MainHeading heading={"Create a Project"} tooltip={"Fill in the form to create the project"} />
              <form className="form">
                <div className="form-field">
                  <input className="input" type="text" placeholder="Name" ref={projectNameInputRef} onChange={checkErrors} />
                  {hasErrors("name") && (
                    <span className="error-message">{getError("name")}</span>
                  )}
                </div>
                <div className="form-field">
                  <input className="input" type="text" placeholder="Description (max. 100 characters)" ref={projectDescriptionInputRef} onChange={checkErrors} />
                  {hasErrors("description") && (
                    <span className="error-message">{getError("description")}</span>
                  )}
                </div>
                <div className="form-field">
                  <input className="input" type="text" placeholder="Website URL" ref={projectWebsiteUrlInputRef} onChange={checkErrors} />
                  {hasErrors("websiteUrl") && (
                    <span className="error-message">{getError("websiteUrl")}</span>
                  )}
                </div>
                <div className="form-field">
                  <input className="input" type="text" placeholder="Logo image URL" ref={projectLogoImageUrlInputRef} onChange={checkErrors} />
                  {hasErrors("logoUrl") && (
                    <span className="error-message">{getError("logoUrl")}</span>
                  )}
                </div>
              </form>
            </div>
            <div>
              <Button icon={addIcon} onClick={onSubmitHandler}>CREATE PROJECT</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
