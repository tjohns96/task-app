import React from "react";
import { useState, useEffect } from "react";
import { List } from "@mui/material";
import Project from "./Project";

export default function ProjectList() {
  return (
    <List>
      <Project name="First Project"></Project>
      <Project name="Second Project"></Project>
    </List>
  );
}
