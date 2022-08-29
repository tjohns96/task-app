import { useEffect, useState } from "react";
import "./App.css";
import { Drawer } from "@mui/material";
import NavBar from "./components/NavBar";
import { db, auth } from "./firebase-config.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import LoginPage from "./components/LoginPage";
import ProjectArea from "./components/ProjectArea";

function App() {
  const auth = getAuth();
  const [currUser, setCurrUser] = useState();
  const [loginIsOpen, setLoginIsOpen] = useState(false);
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const toggleLoginPage = () => {
    setLoginIsOpen(!loginIsOpen);
  };
  function signOut() {
    setCurrUser();
  }
  function openDrawer() {
    setDrawerIsOpen(true);
  }
  function closeDrawer() {
    setDrawerIsOpen(false);
  }
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrUser(user.uid);
      }
    });
  });
  return (
    <div>
      <NavBar
        toggleLoginPage={toggleLoginPage}
        loginIsOpen={loginIsOpen}
        currUser={currUser}
        signOut={signOut}
        drawerIsOpen={drawerIsOpen}
        openDrawer={openDrawer}
      ></NavBar>
      <ProjectArea
        drawerIsOpen={drawerIsOpen}
        closeDrawer={closeDrawer}
      ></ProjectArea>
      {loginIsOpen && (
        <LoginPage
          toggleLoginPage={toggleLoginPage}
          isOpen={loginIsOpen}
        ></LoginPage>
      )}
    </div>
  );
}

export default App;
