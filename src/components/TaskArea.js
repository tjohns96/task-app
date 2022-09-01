import { Add } from "@mui/icons-material";
import TaskList from "./TaskList";
import React from "react";

export default function TaskArea(props) {
  return (
    <div
      className={`task-area ${props.name.toLowerCase().replace(/\s+/g, "")}`}
    >
      <div>{props.name}</div>
      <button type="button" className="add-task-btn">
        <Add className="add-task-icon"></Add>
      </button>
      <TaskList></TaskList>
    </div>
  );
}
