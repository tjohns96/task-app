import { Box } from "@mui/system";
import React, { useState, useEffect, useRef } from "react";
import TaskArea from "./TaskArea";
import { DragDropContext } from "react-beautiful-dnd";
import { db } from "../firebase-config";
import {
  query,
  where,
  orderBy,
  getDocs,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function MainBody(props) {
  const ref = useRef(null);
  const firstRender = useRef(true);
  const [marginLeft, setMarginLeft] = useState(0);
  window.addEventListener("resize", () => {
    applyMobileStyle(false);
  });
  useEffect(() => {
    if (props.drawerIsOpen) {
      setMarginLeft(43.75);
    } else {
      setMarginLeft(0);
    }
  }, [props.drawerIsOpen]);
  useEffect(() => {
    if (firstRender.current) {
      applyMobileStyle(false);
      firstRender.current = false;
      return;
    }
    applyMobileStyle(true);
  }, [marginLeft]);

  useEffect(() => {
    async function getTasks() {
      if (!props.currUser) {
        props.setTaskstodo([]);
        props.setTaskscompleted([]);
        props.setTasksinprogress([]);
        return;
      }
      const tasksRef = collection(db, "tasks");
      const q = query(
        tasksRef,
        where("data.uid", "==", props.currUser),
        orderBy("data.order")
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        switch (doc.data().data.status) {
          case "todo":
            props.setTaskstodo((arr) => [
              ...arr,
              {
                id: doc.id,
                data: {
                  order: doc.data().data.order,
                  status: doc.data().data.status,
                  projectId: doc.data().data.projectId,
                  taskName: doc.data().data.taskName,
                  description: doc.data().data.description,
                  uid: doc.data().data.uid,
                  dueDate: doc.data().data.dueDate,
                },
              },
            ]);
            break;
          case "inprogress":
            props.setTasksinprogress((arr) => [
              ...arr,
              {
                id: doc.id,
                data: {
                  order: doc.data().data.order,
                  status: doc.data().data.status,
                  projectId: doc.data().data.projectId,
                  taskName: doc.data().data.taskName,
                  description: doc.data().data.description,
                  uid: doc.data().data.uid,
                  dueDate: doc.data().data.dueDate,
                },
              },
            ]);
            break;
          case "completed":
            props.setTaskscompleted((arr) => [
              ...arr,
              {
                id: doc.id,
                data: {
                  order: doc.data().data.order,
                  status: doc.data().data.status,
                  projectId: doc.data().data.projectId,
                  taskName: doc.data().data.taskName,
                  description: doc.data().data.description,
                  uid: doc.data().data.uid,
                  dueDate: doc.data().data.dueDate,
                },
              },
            ]);
            break;
        }
      });
    }
    getTasks();
  }, [props.currUser]);

  function applyMobileStyle(drawerTrigger) {
    if (!drawerTrigger) {
      try {
        if (ref.current.offsetWidth && ref.current.offsetWidth < 900) {
          document.querySelector(".main-body").classList.add("mobile");
        } else if (ref.current.offsetWidth && ref.current.offsetWidth > 900) {
          document.querySelector(".main-body").classList.remove("mobile");
        }
      } catch {
        return;
      }
    } else {
      try {
        if (
          ref.current.offsetWidth &&
          props.drawerIsOpen &&
          ref.current.offsetWidth > 1250
        ) {
          document.querySelector(".main-body").classList.remove("mobile");
        } else if (
          ref.current.offsetWidth &&
          !props.drawerIsOpen &&
          ref.current.offsetWidth >= 550
        ) {
          document.querySelector(".main-body").classList.remove("mobile");
        }
      } catch {
        return;
      }
    }
  }

  function handleDragStart() {
    const taskLists = document.querySelectorAll(".task-list");
    taskLists.forEach((task) => task.classList.add("highlighted"));
  }
  function handleDragEnd(result) {
    const taskLists = document.querySelectorAll(".task-list");
    taskLists.forEach((task) => task.classList.remove("highlighted"));
    const { destination, source } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) {
      let tasksCopy = [];
      switch (destination.droppableId) {
        case "todo":
          tasksCopy = [...props.taskstodo];
          break;
        case "inprogress":
          tasksCopy = [...props.tasksinprogress];
          break;
        case "completed":
          tasksCopy = [...props.taskscompleted];
          break;
      }
      const movedTaskCopy = tasksCopy[source.index];
      tasksCopy.splice(source.index, 1);
      tasksCopy.splice(destination.index, 0, movedTaskCopy);
      for (let i = 0; i < tasksCopy.length; i++) {
        tasksCopy[i].data.order = i;
      }
      switch (destination.droppableId) {
        case "todo":
          props.setTaskstodo(tasksCopy);
          break;
        case "inprogress":
          props.setTasksinprogress(tasksCopy);
          break;
        case "completed":
          props.setTaskscompleted(tasksCopy);
          break;
      }
      if (props.currUser) {
        tasksCopy.forEach(async (task) => {
          const taskRef = doc(db, "tasks", task.id);
          await updateDoc(taskRef, {
            "data.status": task.data.status,
            "data.order": task.data.order,
          });
        });
      }
    } else {
      let tasksSourceCopy = [];
      switch (source.droppableId) {
        case "todo":
          tasksSourceCopy = [...props.taskstodo];
          break;
        case "inprogress":
          tasksSourceCopy = [...props.tasksinprogress];
          break;
        case "completed":
          tasksSourceCopy = [...props.taskscompleted];
          break;
      }
      let tasksDestinationCopy = [];
      switch (destination.droppableId) {
        case "todo":
          tasksDestinationCopy = [...props.taskstodo];
          break;
        case "inprogress":
          tasksDestinationCopy = [...props.tasksinprogress];
          break;
        case "completed":
          tasksDestinationCopy = [...props.taskscompleted];
          break;
      }
      console.log(tasksSourceCopy);
      console.log(source.index);
      const movedTaskCopy = tasksSourceCopy[source.index];
      console.log(movedTaskCopy);
      movedTaskCopy.data.status = destination.droppableId;
      tasksSourceCopy.splice(source.index, 1);
      tasksDestinationCopy.splice(destination.index, 0, movedTaskCopy);
      for (let i = 0; i < tasksSourceCopy.length; i++) {
        tasksSourceCopy[i].data.order = i;
      }
      for (let i = 0; i < tasksDestinationCopy.length; i++) {
        tasksDestinationCopy[i].data.order = i;
      }
      switch (source.droppableId) {
        case "todo":
          props.setTaskstodo(tasksSourceCopy);
          break;
        case "inprogress":
          props.setTasksinprogress(tasksSourceCopy);
          break;
        case "completed":
          props.setTaskscompleted(tasksSourceCopy);
          break;
      }
      switch (destination.droppableId) {
        case "todo":
          props.setTaskstodo(tasksDestinationCopy);
          break;
        case "inprogress":
          props.setTasksinprogress(tasksDestinationCopy);
          break;
        case "completed":
          props.setTaskscompleted(tasksDestinationCopy);
          break;
      }
      if (props.currUser) {
        tasksSourceCopy.forEach(async (task) => {
          const taskRef = doc(db, "tasks", task.id);
          await updateDoc(taskRef, {
            "data.status": task.data.status,
            "data.order": task.data.order,
          });
        });
        tasksDestinationCopy.forEach(async (task) => {
          const taskRef = doc(db, "tasks", task.id);
          await updateDoc(taskRef, {
            "data.status": task.data.status,
            "data.order": task.data.order,
          });
        });
      }
    }
  }
  return (
    <Box ref={ref} className="main-body mobile" sx={{ ml: marginLeft }}>
      <h1 className="project-name-header">
        {props.currProject
          ? props.currProject.data.projectName
          : "Add a project to get started"}
      </h1>
      <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <TaskArea
          name="To do"
          taskstodo={props.taskstodo}
          tasksinprogress={props.tasksinprogress}
          taskscompleted={props.taskscompleted}
          setTaskstodo={props.setTaskstodo}
          setTasksinprogress={props.setTasksinprogress}
          setTaskscompleted={props.setTaskscompleted}
          currProject={props.currProject}
          currUser={props.currUser}
        ></TaskArea>
        <TaskArea
          name="In progress"
          taskstodo={props.taskstodo}
          tasksinprogress={props.tasksinprogress}
          taskscompleted={props.taskscompleted}
          setTaskstodo={props.setTaskstodo}
          setTasksinprogress={props.setTasksinprogress}
          setTaskscompleted={props.setTaskscompleted}
          currProject={props.currProject}
          currUser={props.currUser}
        ></TaskArea>
        <TaskArea
          name="Completed"
          taskstodo={props.taskstodo}
          tasksinprogress={props.tasksinprogress}
          taskscompleted={props.taskscompleted}
          setTaskstodo={props.setTaskstodo}
          setTasksinprogress={props.setTasksinprogress}
          setTaskscompleted={props.setTaskscompleted}
          currProject={props.currProject}
          currUser={props.currUser}
        ></TaskArea>
      </DragDropContext>
    </Box>
  );
}
