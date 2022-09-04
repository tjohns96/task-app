import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import TodoCard from "./TodoCard";
import { Close } from "@mui/icons-material";

export default function TasksCalendar(props) {
  const [todoDate, settodoDate] = useState(new Date());
  const [todoTasks, setTodoTasks] = useState([]);
  useEffect(() => {
    const currDay = todoDate.toLocaleDateString("en-US");
    setTodoTasks([]);
    props.taskstodo.forEach((task) => {
      if (task.data.dueDate === currDay) {
        setTodoTasks((arr) => [...arr, task]);
      }
    });
    props.tasksinprogress.forEach((task) => {
      if (task.data.dueDate === currDay) {
        setTodoTasks((arr) => [...arr, task]);
      }
    });
  }, [todoDate, props.taskstodo, props.tasksinprogress]);

  function handleDateInput(date) {
    settodoDate(date);
  }
  return (
    <div className="calendar-wrapper">
      <Close
        className="close-calendar"
        onClick={() => {
          props.closeCalendar();
        }}
      ></Close>
      <div className="triangle"></div>
      <div className="calendar-container">
        <Calendar
          value={todoDate}
          onChange={handleDateInput}
          className="calendar"
        ></Calendar>
        <ul className="todo-list">
          {todoTasks.map((task) => (
            <TodoCard
              taskName={task.data.taskName}
              status={task.data.status}
              description={task.data.description}
            ></TodoCard>
          ))}
        </ul>
      </div>
    </div>
  );
}
