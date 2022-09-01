import { Box } from "@mui/system";
import React, { useState, useEffect } from "react";
import TaskArea from "./TaskArea";
import { DragDropContext } from "react-beautiful-dnd";

export default function MainBody(props) {
  const [marginLeft, setMarginLeft] = useState(0);
  useEffect(() => {
    if (props.drawerIsOpen) {
      setMarginLeft(43.75);
    } else {
      setMarginLeft(0);
    }
  }, [props.drawerIsOpen]);

  return (
    <Box className="main-body" sx={{ ml: marginLeft }}>
      <h1 className="project-name-header">
        {props.currProject.data.projectName}
      </h1>

      <TaskArea name="To do"></TaskArea>
      <TaskArea name="In progress"></TaskArea>
      <TaskArea name="Completed"></TaskArea>
    </Box>
  );
}
