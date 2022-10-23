import React from 'react';

import infoIcon from "../../../assets/icons/info.svg"

import './MainHeading.css';

export default function MainHeading({ heading, tooltip }) {
  return (
    <div className="heading">
      <span className="heading-title">{heading}</span>
      <div className="heading-tooltip">
          <img src={infoIcon} alt="info icon" />
          <span>{tooltip}</span>
      </div>
    </div>
  );
}
