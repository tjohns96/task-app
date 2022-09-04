import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@mui/material";
import { Draggable } from "react-beautiful-dnd";
import DatePicker from "react-datepicker";
import { Delete } from "@mui/icons-material";
import { db } from "../firebase-config";
import { updateDoc, doc, deleteDoc } from "firebase/firestore";

export default function Task(props) {
  const [taskName, setTaskName] = useState(props.thisTask.data.taskName);
  const [taskDescription, setTaskDescription] = useState(
    props.thisTask.data.description
  );
  const [dueDate, setDueDate] = useState(new Date(props.thisTask.data.dueDate));
  useEffect(() => {
    const descriptionArea = document.querySelector(
      `#textarea${props.thisTask.id}`
    );
    descriptionArea.style.height = "auto";
    descriptionArea.style.height = descriptionArea.scrollHeight - 4 + "px";
  }, []);

  function handleTaskChange(e) {
    if (e.target.value.length < 25) {
      setTaskName(e.target.value);
    }
  }
  function handleDescriptionChange(e) {
    if (e.target.value.length < 300) {
      setTaskDescription(e.target.value);
    }
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight - 4 + "px";
  }
  async function handleTaskEnter(e, onBlur) {
    if (e.key === "Enter" || onBlur) {
      if (e.target.value === "") {
        return;
      }
      document.activeElement.blur();
      window.getSelection().removeAllRanges();
      const thisTask = props.thisTask;
      let tasks = [];
      switch (thisTask.data.status) {
        case "todo":
          tasks = [...props.taskstodo];
          break;
        case "inprogress":
          tasks = [...props.tasksinprogress];
          break;
        case "completed":
          tasks = [...props.taskscompleted];
          break;
      }
      const currIndex = tasks.findIndex((task) => task === thisTask);
      let task = tasks[currIndex];
      task.data.taskName = e.target.value;
      tasks[currIndex] = task;
      switch (thisTask.data.status) {
        case "todo":
          props.setTaskstodo(tasks);
          break;
        case "inprogress":
          props.setTasksinprogress(tasks);
          break;
        case "completed":
          props.setTaskscompleted(tasks);
          break;
      }
      if (props.currUser) {
        const taskRef = doc(db, "tasks", thisTask.id);
        await updateDoc(taskRef, { "data.taskName": e.target.value });
      }
    }
  }
  async function handleTaskDescEnter(e, onBlur) {
    if (e.key === "Enter" || onBlur) {
      if (e.target.value == "") {
        e.preventDefault();
        return;
      }
      document.activeElement.blur();
      window.getSelection().removeAllRanges();
      const thisTask = props.thisTask;
      let tasks = [];
      switch (thisTask.data.status) {
        case "todo":
          tasks = [...props.taskstodo];
          break;
        case "inprogress":
          tasks = [...props.tasksinprogress];
          break;
        case "completed":
          tasks = [...props.taskscompleted];
          break;
      }
      const currIndex = tasks.findIndex((task) => task === thisTask);
      let task = tasks[currIndex];
      task.data.description = e.target.value;
      tasks[currIndex] = task;
      switch (thisTask.data.status) {
        case "todo":
          props.setTaskstodo(tasks);
          break;
        case "inprogress":
          props.setTasksinprogress(tasks);
          break;
        case "completed":
          props.setTaskscompleted(tasks);
          break;
      }
      if (props.currUser) {
        const taskRef = doc(db, "tasks", thisTask.id);
        await updateDoc(taskRef, { "data.description": e.target.value });
      }
    }
  }
  async function handleClickDelete() {
    const thisTask = props.thisTask;
    let tasks = [];
    switch (thisTask.data.status) {
      case "todo":
        tasks = [...props.taskstodo];
        break;
      case "inprogress":
        tasks = [...props.tasksinprogress];
        break;
      case "completed":
        tasks = [...props.taskscompleted];
        break;
    }
    const currIndex = tasks.findIndex((task) => task === thisTask);
    tasks.splice(currIndex, 1);
    tasks.forEach(async (task, index) => {
      task.data.order = index;
      if (props.currUser) {
        await updateDoc(doc(db, "tasks", task.id), { "data.order": index });
      }
    });
    switch (thisTask.data.status) {
      case "todo":
        props.setTaskstodo(tasks);
        break;
      case "inprogress":
        props.setTasksinprogress(tasks);
        break;
      case "completed":
        props.setTaskscompleted(tasks);
        break;
    }
    if (props.currUser) {
      await deleteDoc(doc(db, "tasks", thisTask.id));
    }
  }
  async function handleDateInput(date) {
    const newDate = date.toLocaleDateString("en-US");
    setDueDate(new Date(newDate));
    const thisTask = props.thisTask;
    let tasks = [];
    switch (thisTask.data.status) {
      case "todo":
        tasks = [...props.taskstodo];
        break;
      case "inprogress":
        tasks = [...props.tasksinprogress];
        break;
      case "completed":
        tasks = [...props.taskscompleted];
        break;
    }
    const currIndex = tasks.findIndex((task) => task === thisTask);
    let task = tasks[currIndex];
    task.data.dueDate = newDate;
    tasks[currIndex] = task;
    switch (thisTask.data.status) {
      case "todo":
        props.setTaskstodo(tasks);
        break;
      case "inprogress":
        props.setTasksinprogress(tasks);
        break;
      case "completed":
        props.setTaskscompleted(tasks);
        break;
    }
    if (props.currUser) {
      const docRef = doc(db, "tasks", props.thisTask.id);
      await updateDoc(docRef, { "data.dueDate": newDate });
    }
  }

  return (
    <Draggable
      draggableId={props.thisTask.id}
      index={props.thisTask.data.order}
    >
      {(provided) => (
        <li
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Card className="task" id={`task${props.thisTask.id}`}>
            <Delete
              className="delete-task"
              onClick={handleClickDelete}
            ></Delete>
            <CardContent>
              <input
                className="task-name"
                value={taskName}
                onInput={handleTaskChange}
                onKeyDown={handleTaskEnter}
                onBlur={(e) => {
                  handleTaskEnter(e, true);
                }}
              ></input>
              <div className="due-date">Due date:</div>
              <DatePicker
                className="date-inp"
                selected={dueDate}
                onCalendarOpen={() => {
                  document
                    .querySelector(`#task${props.thisTask.id}`)
                    .classList.add("height");
                }}
                onChange={handleDateInput}
                onCalendarClose={() => {
                  document
                    .querySelector(`#task${props.thisTask.id}`)
                    .classList.remove("height");
                }}
              ></DatePicker>
              <textarea
                id={`textarea${props.thisTask.id}`}
                value={taskDescription}
                className="task-description"
                onInput={handleDescriptionChange}
                onKeyDown={handleTaskDescEnter}
                onBlur={(e) => {
                  handleTaskDescEnter(e, true);
                }}
              ></textarea>
            </CardContent>
          </Card>
        </li>
      )}
    </Draggable>
  );
}
