import React, { useState, useEffect } from "react";
import { Card } from "@mui/material";
import { Delete, Edit, PersonalVideoRounded } from "@mui/icons-material";
import { Draggable } from "react-beautiful-dnd";

export default function Task(props) {
  const [disabled, setDisabled] = useState(true);
  async function handleClickEdit(e) {
    e.stopPropagation();
    await setDisabled(false);
    const input = e.target.closest(".project").firstChild.nextSibling;
    input.focus();
    input.select();
  }
  return (
    <Draggable
      draggableId={props.thisTask.id}
      index={props.thisTask.data.order}
    >
      {(provided) => (
        <li
          className="task"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {props.thisTask.id}
        </li>
      )}
    </Draggable>
  );
}
