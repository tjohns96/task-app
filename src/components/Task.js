import React, { useState, useEffect } from "react";
import { ListItem } from "@mui/material";

export default function Task() {
  const [disabled, setDisabled] = useState(true);
  async function handleClickEdit(e) {
    e.stopPropagation();
    await setDisabled(false);
    const input = e.target.closest(".project").firstChild.nextSibling;
    input.focus();
    input.select();
  }
  return (
    <ListItem className="task">
      <Delete className="delete-btn" onClick={handleClickDelete}></Delete>
      <input
        className="task-name"
        value=""
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
