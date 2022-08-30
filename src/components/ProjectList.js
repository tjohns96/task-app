import React from "react";
import { useState, useEffect } from "react";
import { List } from "@mui/material";
import Project from "./Project";

export default function ProjectList(props) {
  return (
    <List>
      <Project
        name="First Project"
        currProject={props.currProject}
        chooseProject={props.chooseProject}
      ></Project>
      <Project
        name="Second Project"
        currProject={props.currProject}
        chooseProject={props.chooseProject}
      ></Project>
    </List>
  );
}
