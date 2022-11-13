import React, { useEffect, useState } from 'react';
import Emitter from '../../../emitter';
import MainHeading from '../MainHeading/MainHeading';

import exitIcon from "../../../assets/icons/exit.svg"

import './Modal.css';

export default function Modal({ children, heading, tooltip }) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    Emitter.on("SET_SHOW_MODAL", (value) => {
      setShowModal(value);
    });
  }, []);

  function onClose(e) {
    if (e.target.className === "modal-backdrop") {
      setShowModal(false);
    }
  }

  if (!showModal) {
    return null;
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal">
        <div className="modal-header">
          <MainHeading heading={heading} tooltip={tooltip} />
          <button className="modal-header-exit" type="button" onClick={() => {setShowModal(false)}}><img src={exitIcon} alt="exit icon" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
