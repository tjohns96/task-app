import React from "react";
import { useState, useEffect } from "react";
import { List } from "@mui/material";
import Project from "./Project";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { doc, updateDoc } from "firebase/firestore";

import { db } from "../firebase-config";

export default function ProjectList(props) {
  const projects = props.projects;
  const projectItems = projects.map((project) => (
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
  function handleDragEnd(result) {
    if (
      !result.destination ||
      result.destination.index === result.source.index
    ) {
      return;
    }
    const projectsCopy = [...props.projects];
    const movedProject = projectsCopy[result.source.index];
    const currProject = props.currProject;
    projectsCopy.splice(result.source.index, 1);
    projectsCopy.splice(result.destination.index, 0, movedProject);
    for (let i = 0; i < projectsCopy.length; i++) {
      projectsCopy[i].data.order = i;
    }
    props.setProjects(projectsCopy);
    props.chooseProject(currProject);
    if (props.currUser) {
      projectsCopy.forEach(async (project) => {
        const docRef = doc(db, "projects", project.id);
        await updateDoc(docRef, { order: project.data.order });
      });
    }
  }
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="1">
        {(provided) => (
          <ul
            className="project-list"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {projectItems}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
}
