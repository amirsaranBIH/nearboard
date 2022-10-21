import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';

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
import logo from "./assets/nearboard-horizontal.png"
import loaderIcon from "./assets/icons/loader.svg"

import NearboardContext from './store/NearboardContext.js';
import LoadingContext from './store/LoadingContext.js';


export default function App() {
  const nearboardContext = useContext(NearboardContext);
  const loadingContext = useContext(LoadingContext);

  return (
    <Router>
      { loadingContext.isLoading && <div className="loading"><img src={loaderIcon} alt="loader icon" /></div> }
      <header className="header">
        <Link className="logo" to="/"><img src={logo} alt="Nearboard logo" /></Link>
        <nav className="navigation">
          <Link className="link" to="/projects">Projects</Link>
          <Link className="link" to="/events">Events</Link>
          <Link className="link" to="/faq">FAQ</Link>
          {nearboardContext.isSignedIn ? <Link to="/profile"><span className="btn btn--small">PROFILE</span></Link> : <span className="btn btn--small" onClick={() => {nearboardContext.wallet.signIn()}}>CONNECT</span>}
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/events" element={<Events />} />
        <Route path="/event/:eventId" element={<Event />} />
        <Route path="/event/:eventId/update" element={<UpdateEvent />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/profile" element={nearboardContext.isSignedIn ? <Profile /> : <Navigate to="/" />} />
        <Route path="/project/:id" element={<Project />} />
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/project/:id/update" element={<UpdateProject />} />
        <Route path="/project/:id/create-event" element={<CreateEvent />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}
