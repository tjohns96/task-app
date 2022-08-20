import { useEffect, useState } from "react";
import "./App.css";
import NavBar from "./NavBar";
import { db, auth } from "../firebase-config.js";
import { collection, getDocs } from "firebase/firestore";
import LoginPage from "./LoginPage";

function App() {
  const [users, setUsers] = useState([]);
  const [currUser, setCurrUser] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const usersCollectionRef = collection(db, "users");
  const toggleLoginPage = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getUsers();
  }, [usersCollectionRef]);
  return (
    <div>
      <NavBar toggleLoginPage={toggleLoginPage} isOpen={isOpen}></NavBar>
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
