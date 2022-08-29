import React, { useState } from "react";
import { IconButton, List, ListItem, ListItemButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

export default function Project(props) {
  const [disabled, setDisabled] = useState(true);
  const [projectName, setProjectName] = useState(props.name);
  async function handleClickEdit(e) {
    await setDisabled(false);
    const input = e.target.closest(".project").firstChild.nextSibling;
    input.focus();
    input.select();
  }
  function handleTaskChange(e) {
    if (e.target.value.length < 25) {
      setProjectName(e.target.value);
    }
  }
  function handleTaskEnter(e, onBlur) {
    if (e.key === "Enter" || onBlur) {
      setDisabled(true);
      document.activeElement.blur();
      window.getSelection().removeAllRanges();
    }
  }
  function handleClickDelete(e) {
    const project = e.target.closest(".project");
    project.parentElement.removeChild(project);
  }
  return (
    <ListItem className="project">
      <Delete className="delete-btn" onClick={handleClickDelete}></Delete>
      <input
        className="project-name"
        value={projectName}
        disabled={disabled}
        onChange={disabled ? () => {} : handleTaskChange}
        onKeyDown={handleTaskEnter}
        onBlur={(e) => {
          handleTaskEnter(e, true);
        }}
      ></input>
      <Edit className="edit-btn" onClick={handleClickEdit}></Edit>
    </ListItem>
  );
}
