import React from 'react';

import './Button.css';

export default function Button({ children, icon, onClick, type = "button", color = "primary" }) {
  return (
    <button className={"btn-with-image btn btn--" + color} type={type} onClick={onClick}>
      <img src={icon} alt="icon" />
      <div>{children}</div>
    </button>
  );
}
