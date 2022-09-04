import React from "react";
import { useState, useEffect } from "react";
import { Drawer, IconButton, Divider, List } from "@mui/material";
import { ChevronLeft, Add } from "@mui/icons-material";
import { minHeight } from "@mui/system";
import ProjectList from "./ProjectList";
import uniqid from "uniqid";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase-config";

export default function ProjectArea(props) {
  const [drawerWidth, setDrawerWidth] = useState(350);
  useEffect(() => {
    if (window.innerWidth < 900) {
      setDrawerWidth(window.innerWidth);
    }
  }, []);

  useEffect(() => {
    if (drawerWidth == window.innerWidth) {
      props.closeDrawer();
    }
  }, [props.currProject]);

  function handleResize() {
    if (window.innerWidth < 900) {
      setDrawerWidth(window.innerWidth);
    } else if (drawerWidth !== 350) {
      setDrawerWidth(350);
    }
  }
  function handleClickAddBtn() {
    const newTask = {
      id: uniqid(),
      data: {
        projectName: "New project",
        uid: props.currUser,
        order: props.projects.length,
      },
    };
    props.setProjects((arr) => [...arr, newTask]);
    if (props.currUser) {
      setDoc(doc(db, "projects", newTask.id), {
        order: newTask.data.order,
        projectName: newTask.data.projectName,
        uid: newTask.data.uid,
      });
    }
  }
  window.addEventListener("resize", handleResize);
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      className="drawer"
      variant="persistent"
      anchor="left"
      open={props.drawerIsOpen}
    >
      <div className="drawer-header">
        <Add className="add-btn" onClick={handleClickAddBtn}></Add>
        <span>Projects</span>
        <IconButton onClick={props.closeDrawer}>
          <ChevronLeft />
        </IconButton>
      </div>
      <Divider></Divider>
      <ProjectList
        currProject={props.currProject}
        chooseProject={props.chooseProject}
        currUser={props.currUser}
        projects={props.projects}
        setProjects={props.setProjects}
      ></ProjectList>
    </Drawer>
  );
}
