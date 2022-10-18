import React from 'react';
import MainHeading from '../partials/MainHeading/MainHeading';
import FaqSection from '../sections/FaqSection/FaqSection';

import './PageNotFound.css';

export default function PageNotFound() {
  return (
    <div>
      <div className="wrapper">
        <aside className="aside">
          <FaqSection />
        </aside>
        <main className="main">
          <div className="section">
            <MainHeading  heading={"Error 404 - Page Not Found"} tooltip={"You tried to access a page that does not exist"} />
          </div>
        </main>
      </div>
    </div>
  );
}
