import React from "react";
import { Card, CardContent } from "@mui/material";

export default function TodoCard(props) {
  let status;
  switch (props.status) {
    case "todo":
      status = "To do";
      break;
    case "inprogress":
      status = "In progress";
  }
  return (
    <li>
      <Card className="todo-card">
        <CardContent>
          <div>Task Name: {props.taskName}</div>
          <div>Status: {status}</div>
          <div> Description: {props.description}</div>
        </CardContent>
      </Card>
    </li>
  );
}
