import React, { useEffect, useState } from 'react';
import Emitter from '../../../emitter';
import ProjectsListSection from '../../sections/ProjectsListSection/ProjectsListSection';
import Modal from '../Modal/Modal';

import './AllProjectFollowsModal.css';

export default function AllProjectFollowsModal() {
  const [projectFollows, setProjectFollows] = useState([]);

  useEffect(() => {
    Emitter.on("OPEN_ALL_PROJECT_FOLLOWS_MODAL", (follows) => {
      setProjectFollows(follows);
      Emitter.emit("SET_SHOW_MODAL", true);
    });
  }, []);

  return (
    <Modal heading={"All Project Follows"} tooltip={"List of all projects that you follow"}>
      <div className="all-project-follows">
        <ProjectsListSection projects={projectFollows} />
      </div>
    </Modal>
  );
}
