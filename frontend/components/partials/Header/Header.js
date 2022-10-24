import React, { useContext, useEffect, useState } from 'react';

import { Link, useLocation } from "react-router-dom";

import './Header.css';

import logo from "../../../assets/nearboard-horizontal.png"
import NearboardContext from '../../../store/NearboardContext';

export default function Header() {
  const nearboardContext = useContext(NearboardContext);

  const location = useLocation();

  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setShowMenu(false);
  }, [location]);
  
  function toggleMenu() {
    setShowMenu(!showMenu);
  }

  return (
    <header className="header">
      <Link className="logo" to="/"><img src={logo} alt="Nearboard logo" /></Link>
      <div className="navigation-wrapper">
        <button className="menu-button btn btn--small" type="button" onClick={toggleMenu}>MENU</button>
        {(window.innerWidth > 992 || showMenu) && <nav className="navigation">
          <Link className="link" to="/projects">Projects</Link>
          <Link className="link" to="/events">Events</Link>
          <Link className="link" to="/faq">FAQ</Link>
          {nearboardContext.isSignedIn ? <Link to="/profile"><span className="btn btn--small">PROFILE</span></Link> : <span className="btn btn--small" onClick={() => {nearboardContext.wallet.signIn()}}>CONNECT</span>}
        </nav>}
      </div>
    </header>
  );
}
