import React from "react";
import { useState, useEffect } from "react";
import { List } from "@mui/material";
import Project from "./Project";

import { db } from "../firebase-config";

export default function ProjectList(props) {
  const projects = props.projects;
  let projectItems;
  projectItems = projects.map((project) => (
    <Project
      key={project.id}
      id={project.id}
      currProject={props.currProject}
      chooseProject={props.chooseProject}
      thisProject={project}
      setProjects={props.setProjects}
      projects={props.projects}
      currUser={props.currUser}
    ></Project>
  ));
  return <List>{projectItems}</List>;
}
