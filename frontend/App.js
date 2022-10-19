import React from 'react';
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

import './assets/global.css';
import logo from "./assets/nearboard-horizontal.png"
import UpdateEvent from './components/UpdateEvent/UpdateEvent.js';


export default function App({ isSignedIn, Nearboard, wallet }) {
  return (
    <Router>
      <header className="header">
        <Link to="/">
          <img className="logo" src={logo} alt="Nearboard logo" />
        </Link>
        <nav className="navigation">
          <Link className="link" to="/projects">Projects</Link>
          <Link className="link" to="/events">Events</Link>
          <Link className="link" to="/faq">FAQ</Link>
          {isSignedIn ? <Link to="/profile"><span className="btn btn--small">PROFILE</span></Link> : <span className="btn btn--small" onClick={() => {wallet.signIn()}}>CONNECT</span>}
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Home Nearboard={Nearboard} />} />
        <Route path="/projects" element={<Projects Nearboard={Nearboard} />} />
        <Route path="/events" element={<Events Nearboard={Nearboard} />} />
        <Route path="/project/:projectId/event/:eventId" element={<Event Nearboard={Nearboard} />} />
        <Route path="/project/:projectId/event/:eventId/update" element={<UpdateEvent Nearboard={Nearboard} />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/profile" element={isSignedIn ? <Profile Nearboard={Nearboard} accountId={wallet.accountId} wallet={wallet} /> : <Navigate to="/" />} />
        <Route path="/project/:id" element={<Project Nearboard={Nearboard} />} />
        <Route path="/create-project" element={<CreateProject Nearboard={Nearboard} />} />
        <Route path="/project/:id/update" element={<UpdateProject Nearboard={Nearboard} />} />
        <Route path="/project/:id/create-event" element={<CreateEvent Nearboard={Nearboard} />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}
