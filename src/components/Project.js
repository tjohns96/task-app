import React, { useState, useEffect } from "react";
import { IconButton, List, ListItem, ListItemButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { db } from "../firebase-config";
import { getDoc, setDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

export default function Project(props) {
  const [disabled, setDisabled] = useState(true);
  const [projectName, setProjectName] = useState(
    props.thisProject.data.projectName
  );
  const [selected, setSelected] = useState(false);
  const [changed, setChanged] = useState(false);
  useEffect(() => {
    if (props.currProject === props.thisProject) {
      setSelected(true);
    } else {
      setSelected(false);
    }
  }, [props.currProject]);

  useEffect(() => {
    async function updateDatabase() {
      if (changed) {
        const docRef = doc(db, "projects", props.thisProject.id);
        const docSnap = await getDoc(docRef);
        try {
          await updateDoc(docRef, {
            projectName: projectName,
          });
        } catch (error) {
          await setDoc(doc(db, "projects", props.thisProject.id), {
            projectName: projectName,
            uid: props.currUser,
            createdDate: Timestamp.now(),
          });
        }
      }
    }
    updateDatabase();
    setChanged(false);
  }, [changed]);

  async function handleClickEdit(e) {
    e.stopPropagation();
    await setDisabled(false);
    const input = e.target.closest(".project").firstChild.nextSibling;
    input.focus();
    input.select();
  }
  function handleTaskChange(e) {
    if (e.target.value.length < 25) {
      setProjectName(e.target.value);
    }
  }
  function handleTaskEnter(e, onBlur) {
    if (e.key === "Enter" || onBlur) {
      if (e.target.value === "") {
        handleClickEdit(e);
        return;
      }
      setDisabled(true);
      document.activeElement.blur();
      window.getSelection().removeAllRanges();
      const thisProject = (project) => project === props.thisProject;
      const currIndex = props.projects.findIndex(thisProject);
      let projects = [...props.projects];
      let project = { ...projects[currIndex] };
      project.data.projectName = e.target.value;
      projects[currIndex] = project;
      props.setProjects(projects);
      setChanged(true);
    }
  }
  async function handleClickDelete(e) {
    e.stopPropagation();
    await deleteDoc(doc(db, "projects", props.thisProject.id));
    const thisProject = (project) => project === props.thisProject;
    const currIndex = props.projects.findIndex(thisProject);
    let projects = [...props.projects];
    projects.splice(currIndex, 1);
    props.setProjects(projects);
  }
  function handleClickOnInput(e) {
    e.stopPropagation();
  }
  async function handleClickOnProject(e) {
    if (!e.target.firstChild.nextSibling.value) {
      await setDisabled(false);
      const input = e.target.closest(".project").firstChild.nextSibling;
      input.focus();
      input.select();
      return;
    }
    props.chooseProject(props.thisProject);
  }
  return (
    <ListItem
      className={`project ${selected ? "selected" : ""}`}
      onClick={handleClickOnProject}
    >
      <Delete className="delete-btn" onClick={handleClickDelete}></Delete>
      <input
        className="project-name"
        value={projectName}
        disabled={disabled}
        onChange={disabled ? () => {} : handleTaskChange}
        onKeyDown={handleTaskEnter}
        onBlur={(e) => {
          handleTaskEnter(e, true);
        }}
        onClick={handleClickOnInput}
      ></input>
      <Edit className="edit-btn" onClick={handleClickEdit}></Edit>
    </ListItem>
  );
}
