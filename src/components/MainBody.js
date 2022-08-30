import { Box } from "@mui/system";
import React, { useState, useEffect } from "react";
import TaskArea from "./TaskArea";

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
      <h1>{props.currProject}</h1>
      <TaskArea name="To do"></TaskArea>
      <TaskArea name="In progress"></TaskArea>
      <TaskArea name="Completed"></TaskArea>
    </Box>
  );
}
