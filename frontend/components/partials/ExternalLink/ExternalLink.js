import React from 'react';

import externalLinkIcon from "../../../assets/icons/external_link.svg"

import './ExternalLink.css';

export default function ExternalLink({ text, to }) {
  return (
    <a className="external-link link" href={to} title={to} target="_blank" rel="noopener noreferrer"><span>{ text || "learn more" }</span> <img src={externalLinkIcon} alt="external link icon" /></a>
  );
}
