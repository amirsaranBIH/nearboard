import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Home from "./components/Home/Home.js";
import Projects from "./components/Projects/Projects.js";
import Project from "./components/Project/Project.js";
import Events from "./components/Events/Events.js";
import Event from "./components/Event/Event.js";
import CreateEvent from "./components/CreateEvent/CreateEvent.js";
import PageNotFound from "./components/PageNotFound/PageNotFound.js";
import Faq from "./components/Faq/Faq.js";
import Profile from "./components/Profile/Profile.js";
import CreateProject from "./components/CreateProject/CreateProject.js";
import UpdateProject from "./components/UpdateProject/UpdateProject.js";
import UpdateEvent from './components/UpdateEvent/UpdateEvent.js';

import './assets/global.css';
import loaderIcon from "./assets/icons/loader.svg"

import NearboardContext from './store/NearboardContext.js';
import LoadingContext from './store/LoadingContext.js';
import Header from './components/partials/Header/Header.js';


export default function App() {
  const nearboardContext = useContext(NearboardContext);
  const loadingContext = useContext(LoadingContext);

  return (
    <Router>
      { loadingContext.isLoading && <div className="loading"><img src={loaderIcon} alt="loader icon" /></div> }
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/events" element={<Events />} />
        <Route path="/event/:eventId" element={<Event />} />
        <Route path="/event/:eventId/update" element={nearboardContext.isSignedIn ? <UpdateEvent /> : <Navigate to="/" />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/profile" element={nearboardContext.isSignedIn ? <Profile /> : <Navigate to="/" />} />
        <Route path="/project/:id" element={<Project />} />
        <Route path="/create-project" element={nearboardContext.isSignedIn ? <CreateProject /> : <Navigate to="/" />} />
        <Route path="/project/:id/update" element={nearboardContext.isSignedIn ? <UpdateProject /> : <Navigate to="/" />} />
        <Route path="/project/:id/create-event" element={nearboardContext.isSignedIn ? <CreateEvent /> : <Navigate to="/" />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}
