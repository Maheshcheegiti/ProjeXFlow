import React, { Fragment, useState } from "react";
import CreateModal from "./CreateModal";
import JoinModal from "./JoinModal";

const WorkspaceEmpty = () => {
  const [CreateModalOpen, setCreateModalOpen] = useState(false);
  const [joinModelOpen, setJoinModalOpen] = useState(false);

  const openCreateModal = () => {
    setCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);
  };

  const openJoinModal = () => {
    setJoinModalOpen(true);
  };

  const closeoJoinModal = () => {
    setJoinModalOpen(false);
  };
  return (
    <Fragment>
      <div className="ws-empty">
        <div>
          <div className="ws-logo">
            <i className="fa-brands fa-connectdevelop fa-spin"></i>
          </div>
          <div className="ws-text">
            <p>
              Experience the power of collaboration within your workspace. Plan,
              communicate, and execute projects together efficiently
            </p>
          </div>
          <div className="ws-buttons">
            <button className="btn" onClick={openCreateModal}>
              <i className="fa-regular fa-square-plus"></i> Create
            </button>
            <button className="btn" onClick={openJoinModal}>
              <i className="fa-solid fa-arrow-right-to-bracket"></i> Join
            </button>
          </div>
          <div className="ws-underline"></div>
        </div>
      </div>
      <div>
        <CreateModal
          isOpen={CreateModalOpen}
          onClose={closeCreateModal}
        ></CreateModal>
      </div>
      <div>
        <JoinModal isOpen={joinModelOpen} onClose={closeoJoinModal}></JoinModal>
      </div>
    </Fragment>
  );
};

export default WorkspaceEmpty;
