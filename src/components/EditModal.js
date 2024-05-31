import React, { useState } from "react";
import Modal from "react-modal";
import styles from "../../src/components/EditModal.module.css";

const EditModal = ({ isOpen, onRequestClose, todo, onUpdate }) => {
  const [editedTitle, setEditedTitle] = useState(todo ? todo.title : "");

  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value);
  };

  const handleSave = () => {
    onUpdate(todo._id, editedTitle);
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={styles["modal-container"]}
    >
      <h2 className={styles["modal-title"]}>Edit Todo</h2>
      <input
        type="text"
        value={editedTitle}
        onChange={handleTitleChange}
        className={styles["modal-input"]}
        placeholder="Enter new title"
      />
      <div className={styles["button-container"]}>
        <button onClick={onRequestClose} className={styles["modal-button"]}>
          Cancel
        </button>
        <button onClick={handleSave} className={styles["modal-button"]}>
          Save
        </button>
      </div>
    </Modal>
  );
};

export default EditModal;
