import React, { useState } from 'react';

import moreIcon from "../../../assets/icons/more.svg"

import './MoreOptions.css';

export default function MoreOptions({ options }) {
  const [showOptions, setShowOptions] = useState(false);

  function toggleOptions() {
    setShowOptions(!showOptions);
  }

  return (
    <div className="more">
      <img src={moreIcon} alt="more icon" onClick={toggleOptions} />
      {showOptions && 
      <div className="more-options">
        {options.map((option, i) => {
          return <div key={i} onClick={option.method}>{option.text}</div>;
        })}
      </div>}
    </div>
  );
}
