import React, { useState } from "react";
import { IconButton, List, ListItem, ListItemButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

export default function Project(props) {
  const [disabled, setDisabled] = useState(true);
  const [projectName, setProjectName] = useState(props.name);
  async function handleClickEdit(e) {
    e.stopPropagation();
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
      if (e.target.value === "") {
        handleClickEdit(e);
        return;
      }
      setDisabled(true);
      document.activeElement.blur();
      window.getSelection().removeAllRanges();
    }
  }
  function handleClickDelete(e) {
    e.stopPropagation();
    const project = e.target.closest(".project");
    project.parentElement.removeChild(project);
  }
  function handleClickOnInput(e) {
    e.stopPropagation();
  }
  return (
    <ListItem
      className="project"
      onClick={(e) => {
        props.chooseProject(e.target.firstChild.nextSibling.value);
      }}
    >
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
        onClick={handleClickOnInput}
      ></input>
      <Edit className="edit-btn" onClick={handleClickEdit}></Edit>
    </ListItem>
  );
}
