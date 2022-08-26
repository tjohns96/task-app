import { useEffect, useState } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import { db, auth } from "./firebase-config.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import LoginPage from "./components/LoginPage";

function App() {
  const auth = getAuth();
  const [currUser, setCurrUser] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const toggleLoginPage = () => {
    setIsOpen(!isOpen);
  };
  function signOut() {
    setCurrUser();
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
        isOpen={isOpen}
        currUser={currUser}
        signOut={signOut}
      ></NavBar>
      {isOpen && (
        <LoginPage
          toggleLoginPage={toggleLoginPage}
          isOpen={isOpen}
        ></LoginPage>
      )}
    </div>
  );
}

export default App;
