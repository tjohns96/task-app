import { Box } from "@mui/system";
import React, { useState, useEffect, useRef } from "react";
import TaskArea from "./TaskArea";
import { DragDropContext } from "react-beautiful-dnd";
import { ContentPasteOffSharp, Source } from "@mui/icons-material";
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
  const [taskstodo, setTaskstodo] = useState([]);
  const [tasksinprogress, setTasksinprogress] = useState([]);
  const [taskscompleted, setTaskscompleted] = useState([]);
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

  useEffect(() => {}, [taskscompleted, taskstodo, tasksinprogress]);

  useEffect(() => {
    async function getTasks() {
      if (!props.currUser) {
        setTaskstodo([]);
        setTaskscompleted([]);
        setTasksinprogress([]);
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
            setTaskstodo((arr) => [
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
            setTasksinprogress((arr) => [
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
            setTaskscompleted((arr) => [
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

  function setTaskstodoCallback(arr) {
    setTaskstodo(arr);
  }
  function setTasksinprogressCallback(arr) {
    setTasksinprogress(arr);
  }
  function setTaskscompletedCallback(arr) {
    setTaskscompleted(arr);
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
          tasksCopy = [...taskstodo];
          break;
        case "inprogress":
          tasksCopy = [...tasksinprogress];
          break;
        case "completed":
          tasksCopy = [...taskscompleted];
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
          setTaskstodo(tasksCopy);
          break;
        case "inprogress":
          setTasksinprogress(tasksCopy);
          break;
        case "completed":
          setTaskscompleted(tasksCopy);
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
          tasksSourceCopy = [...taskstodo];
          break;
        case "inprogress":
          tasksSourceCopy = [...tasksinprogress];
          break;
        case "completed":
          tasksSourceCopy = [...taskscompleted];
          break;
      }
      let tasksDestinationCopy = [];
      switch (destination.droppableId) {
        case "todo":
          tasksDestinationCopy = [...taskstodo];
          break;
        case "inprogress":
          tasksDestinationCopy = [...tasksinprogress];
          break;
        case "completed":
          tasksDestinationCopy = [...taskscompleted];
          break;
      }
      const movedTaskCopy = tasksSourceCopy[source.index];
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
          setTaskstodo(tasksSourceCopy);
          break;
        case "inprogress":
          setTasksinprogress(tasksSourceCopy);
          break;
        case "completed":
          setTaskscompleted(tasksSourceCopy);
          break;
      }
      switch (destination.droppableId) {
        case "todo":
          setTaskstodo(tasksDestinationCopy);
          break;
        case "inprogress":
          setTasksinprogress(tasksDestinationCopy);
          break;
        case "completed":
          setTaskscompleted(tasksDestinationCopy);
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
          taskstodo={taskstodo}
          tasksinprogress={tasksinprogress}
          taskscompleted={taskscompleted}
          setTaskstodo={setTaskstodoCallback}
          setTasksinprogress={setTasksinprogressCallback}
          setTaskscompleted={setTaskscompletedCallback}
          currProject={props.currProject}
          currUser={props.currUser}
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
          currUser={props.currUser}
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
          currUser={props.currUser}
        ></TaskArea>
      </DragDropContext>
    </Box>
  );
}
