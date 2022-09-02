import React, { useState, useEffect } from "react";
import { Add } from "@mui/icons-material";
import { Droppable } from "react-beautiful-dnd";
import uniqid from "uniqid";
import Task from "./Task";
export default function TaskArea(props) {
  const nameSpaceStripped = props.name.toLowerCase().replace(/\s+/g, "");
  let tasks = [];
  switch (nameSpaceStripped) {
    case "todo":
      tasks = props.taskstodo;
      break;
    case "inprogress":
      tasks = props.tasksinprogress;
      break;
    case "completed":
      tasks = props.taskscompleted;
      break;
  }
  const taskItems = tasks.map((task) => {
    if (task.data.project === props.currProject) {
      return (
        <Task
          name={task.id}
          key={task.id}
          thisTask={task}
          currProject={props.currProject}
        ></Task>
      );
    }
  });

  function handleAddClick() {
    if (!props.currProject) {
      return;
    }
    switch (nameSpaceStripped) {
      case "todo":
        props.setTaskstodo((tasks) => [
          ...tasks,
          {
            id: uniqid(),
            data: {
              order: tasks.length,
              status: nameSpaceStripped,
              project: props.currProject,
            },
          },
        ]);
        break;
      case "inprogress":
        props.setTasksinprogress((tasks) => [
          ...tasks,
          {
            id: uniqid(),
            data: {
              order: tasks.length,
              status: nameSpaceStripped,
              project: props.currProject,
            },
          },
        ]);
        break;
      case "completed":
        props.setTaskscompleted((tasks) => [
          ...tasks,
          {
            id: uniqid(),
            data: {
              order: tasks.length,
              status: nameSpaceStripped,
              project: props.currProject,
            },
          },
        ]);
        break;
    }
  }
  return (
    <div className={`task-area ${nameSpaceStripped}`}>
      <div>{props.name}</div>
      <button type="button" className="add-task-btn" onClick={handleAddClick}>
        <Add className="add-task-icon"></Add>
      </button>
      <Droppable droppableId={nameSpaceStripped} className="task-drop-area">
        {(provided) => (
          <ul
            className="task-list"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {taskItems}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </div>
  );
}
