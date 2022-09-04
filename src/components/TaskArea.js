import React, { useState, useEffect } from "react";
import { Add } from "@mui/icons-material";
import { Droppable } from "react-beautiful-dnd";
import uniqid from "uniqid";
import Task from "./Task";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";
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
    if (props.currProject && task.data.projectId === props.currProject.id) {
      return (
        <Task
          name={task.data.taskName}
          key={task.id}
          thisTask={task}
          currProject={props.currProject}
          currUser={props.currUser}
          taskstodo={props.taskstodo}
          tasksinprogress={props.tasksinprogress}
          taskscompleted={props.taskscompleted}
          setTaskstodo={props.setTaskstodo}
          setTasksinprogress={props.setTasksinprogress}
          setTaskscompleted={props.setTaskscompleted}
        ></Task>
      );
    }
  });

  async function handleAddClick() {
    if (!props.currProject) {
      return;
    }
    const newTask = {
      id: uniqid(),
      data: {
        order: tasks.length,
        status: nameSpaceStripped,
        projectId: props.currProject.id,
        taskName: "New task",
        description: "Your description here",
        uid: props.currUser,
        dueDate: new Date().toLocaleDateString("en-US"),
      },
    };
    switch (nameSpaceStripped) {
      case "todo":
        props.setTaskstodo((tasks) => [...tasks, newTask]);
        break;
      case "inprogress":
        props.setTasksinprogress((tasks) => [...tasks, newTask]);
        break;
      case "completed":
        props.setTaskscompleted((tasks) => [...tasks, newTask]);
        break;
    }
    if (props.currUser) {
      const docRef = doc(db, "tasks", newTask.id);
      await setDoc(docRef, newTask);
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
