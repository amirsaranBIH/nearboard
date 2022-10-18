import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';

import Home from "./components/Home/Home.js";
import Projects from "./components/Projects/Projects.js";
import Events from "./components/Events/Events.js";
import PageNotFound from "./components/PageNotFound/PageNotFound.js";
import Faq from "./components/Faq/Faq.js";
import Profile from "./components/Profile/Profile.js";

import './assets/global.css';
import logo from "./assets/nearboard-horizontal.png"


export default function App({ isSignedIn, Nearboard, wallet }) {
  return (
    <Router>
      <header className="header">
        <Link to="/">
          <img className="logo" src={logo} alt="Nearboard logo" />
        </Link>
        <nav className="navigation">
          <Link className="link" to="/projects">Project</Link>
          <Link className="link" to="/events">Events</Link>
          <Link className="link" to="/faq">FAQ</Link>
          {isSignedIn ? <Link to="/profile"><span className="btn btn--small">CONNECTED</span></Link> : <span className="btn" onClick={() => {wallet.signIn()}}>CONNECT</span>}
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/events" element={<Events />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/profile" element={isSignedIn ? <Profile accountId={wallet.accountId} wallet={wallet} /> : <Navigate to="/" />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}
