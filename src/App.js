import { useEffect, useState } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import { db, auth } from "./firebase-config.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import LoginPage from "./components/LoginPage";
import ProjectArea from "./components/ProjectArea";
import MainBody from "./components/MainBody";

function App() {
  const auth = getAuth();
  const [currUser, setCurrUser] = useState("");
  const [loginIsOpen, setLoginIsOpen] = useState(false);
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const [currProject, setCurrProject] = useState();
  const [projects, setProjects] = useState([]);
  const [taskstodo, setTaskstodo] = useState([]);
  const [tasksinprogress, setTasksinprogress] = useState([]);
  const [taskscompleted, setTaskscompleted] = useState([]);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrUser(user.uid);
      }
    });
  });
  useEffect(() => {
    async function getProjects() {
      if (!currUser) {
        setProjects([]);
        return;
      }
      const projectsRef = collection(db, "projects");
      const q = query(
        projectsRef,
        where("uid", "==", currUser),
        orderBy("order")
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setProjects((projects) => [
          ...projects,
          { id: doc.id, data: doc.data() },
        ]);
      });
    }
    getProjects();
  }, [currUser]);

  useEffect(() => {
    if (!projects[0]) {
      setCurrProject();
    } else if (!currProject) {
      setCurrProject(projects[0]);
    }
  }, [projects]);

  const toggleLoginPage = () => {
    setLoginIsOpen(!loginIsOpen);
  };
  function signOut() {
    setCurrUser();
  }
  function chooseProject(project) {
    setCurrProject(project);
  }
  function openDrawer() {
    setDrawerIsOpen(true);
  }
  function closeDrawer() {
    setDrawerIsOpen(false);
  }
  function setProjectsCallback(arr) {
    setProjects(arr);
  }
  function setTaskstodoCallback(arr) {
    setTaskstodo(arr);
  }
  function setTasksinprogressCallback(arr) {
    setTasksinprogress(arr);
  }
  function setTaskscompletedCallback(arr) {
    setTaskscompleted(arr);
  }
  return (
    <div>
      <NavBar
        toggleLoginPage={toggleLoginPage}
        loginIsOpen={loginIsOpen}
        currUser={currUser}
        signOut={signOut}
        drawerIsOpen={drawerIsOpen}
        openDrawer={openDrawer}
        taskstodo={taskstodo}
        taskscompleted={taskscompleted}
        tasksinprogress={tasksinprogress}
      ></NavBar>
      <ProjectArea
        drawerIsOpen={drawerIsOpen}
        closeDrawer={closeDrawer}
        currProject={currProject}
        chooseProject={chooseProject}
        currUser={currUser}
        setProjects={setProjectsCallback}
        projects={projects}
      ></ProjectArea>
      {loginIsOpen && (
        <LoginPage
          toggleLoginPage={toggleLoginPage}
          isOpen={loginIsOpen}
        ></LoginPage>
      )}
      <MainBody
        drawerIsOpen={drawerIsOpen}
        currProject={currProject}
        currUser={currUser}
        taskstodo={taskstodo}
        taskscompleted={taskscompleted}
        tasksinprogress={tasksinprogress}
        setTaskstodo={setTaskstodoCallback}
        setTasksinprogress={setTasksinprogressCallback}
        setTaskscompleted={setTaskscompletedCallback}
      ></MainBody>
    </div>
  );
}

export default App;
