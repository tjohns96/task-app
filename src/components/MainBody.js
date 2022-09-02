import { Box } from "@mui/system";
import React, { useState, useEffect } from "react";
import TaskArea from "./TaskArea";
import { DragDropContext } from "react-beautiful-dnd";
import { Source } from "@mui/icons-material";

export default function MainBody(props) {
  const [taskstodo, setTaskstodo] = useState([]);
  const [tasksinprogress, setTasksinprogress] = useState([]);
  const [taskscompleted, setTaskscompleted] = useState([]);
  const [marginLeft, setMarginLeft] = useState(0);
  useEffect(() => {
    if (props.drawerIsOpen) {
      setMarginLeft(43.75);
    } else {
      setMarginLeft(0);
    }
  }, [props.drawerIsOpen]);

  function setTaskstodoCallback(arr) {
    setTaskstodo(arr);
  }
  function setTasksinprogressCallback(arr) {
    setTasksinprogress(arr);
  }
  function setTaskscompletedCallback(arr) {
    setTaskscompleted(arr);
  }
  function handleDragEnd(result) {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) {
      let tasksCopy = [];
      switch (destination.droppableId) {
        case "todo":
          tasksCopy = [...taskstodo];
          break;
        case "inprogress":
          tasksCopy = [...tasksinprogress];
          break;
        case "completed":
          tasksCopy = [...taskscompleted];
          break;
      }
      const movedTask = tasksCopy[source.index];
      tasksCopy.splice(source.index, 1);
      tasksCopy.splice(destination.index, 0, movedTask);
      for (let i = 0; i < tasksCopy.length; i++) {
        tasksCopy[i].data.order = i;
      }
      switch (destination.droppableId) {
        case "todo":
          setTaskstodo(tasksCopy);
          break;
        case "inprogress":
          setTasksinprogress(tasksCopy);
          break;
        case "completed":
          setTaskscompleted(tasksCopy);
          break;
      }
    }
  }
  return (
    <Box className="main-body" sx={{ ml: marginLeft }}>
      <h1 className="project-name-header">
        {props.currProject
          ? props.currProject.data.projectName
          : "Add or select a project to get started"}
      </h1>
      <DragDropContext onDragEnd={handleDragEnd}>
        <TaskArea
          name="To do"
          taskstodo={taskstodo}
          tasksinprogress={tasksinprogress}
          taskscompleted={taskscompleted}
          setTaskstodo={setTaskstodoCallback}
          setTasksinprogress={setTasksinprogressCallback}
          setTaskscompleted={setTaskscompletedCallback}
          currProject={props.currProject}
        ></TaskArea>
        <TaskArea
          name="In progress"
          taskstodo={taskstodo}
          tasksinprogress={tasksinprogress}
          taskscompleted={taskscompleted}
          setTaskstodo={setTaskstodoCallback}
          setTasksinprogress={setTasksinprogressCallback}
          setTaskscompleted={setTaskscompletedCallback}
          currProject={props.currProject}
        ></TaskArea>
        <TaskArea
          name="Completed"
          taskstodo={taskstodo}
          tasksinprogress={tasksinprogress}
          taskscompleted={taskscompleted}
          setTaskstodo={setTaskstodoCallback}
          setTasksinprogress={setTasksinprogressCallback}
          setTaskscompleted={setTaskscompletedCallback}
          currProject={props.currProject}
        ></TaskArea>
      </DragDropContext>
    </Box>
  );
}
