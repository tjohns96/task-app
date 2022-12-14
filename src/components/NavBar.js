import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Button,
  Typography,
} from "@mui/material";
import { Menu, AccountCircle, CalendarMonth } from "@mui/icons-material";
import { auth, storage, db } from "../firebase-config";
import {
  ref,
  uploadBytes,
  deleteObject,
  getDownloadURL,
} from "firebase/storage";
import {
  doc,
  setDoc,
  query,
  collection,
  getDocs,
  where,
} from "firebase/firestore";
import uniqid from "uniqid";
import TasksCalendar from "./TasksCalendar";
export default function NavBar(props) {
  const [profilePic, setProfilePic] = useState();
  const [isProfilePic, setIsProfilePic] = useState();
  const [marginLeft, setMarginLeft] = useState(0);
  const [calendarIsOpen, setCalendarIsOpen] = useState(false);

  useEffect(() => {
    checkProfilePic();
  }, [props.currUser]);

  useEffect(() => {
    updateProfilePic();
  }, [isProfilePic]);
  useEffect(() => {
    if (props.drawerIsOpen) {
      setMarginLeft(43.75);
    } else {
      setMarginLeft(0);
    }
  }, [props.drawerIsOpen]);

  async function signOut() {
    await auth.signOut();
    await props.signOut();
  }

  async function queryProfilePic() {
    if (!props.currUser) return 0;
    const q = query(
      collection(db, "profile-picture"),
      where("id", "==", props.currUser)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  }

  async function checkProfilePic() {
    const querySnapshot = await queryProfilePic();
    querySnapshot === 0 || querySnapshot.docs.length === 0
      ? setIsProfilePic(false)
      : setIsProfilePic(true);
  }

  async function uploadProfilePic() {
    const selectedFile = document.getElementById("profile-submit").files[0];
    if (selectedFile == null) return;
    if (isProfilePic) {
      const querySnapshot = await queryProfilePic();
      const oldFileName = await getFileName();
      removeProfilePic(oldFileName);
    }
    const fileName = selectedFile.name + uniqid();
    const profilePicRef = ref(storage, `${fileName}`);
    let res = await uploadBytes(profilePicRef, selectedFile);
    res = await setDoc(doc(db, "profile-picture", `${props.currUser}`), {
      id: props.currUser,
      fileName: fileName,
    });
    setIsProfilePic(true);
  }

  async function getFileName() {
    const querySnapshot = await queryProfilePic();
    let fileName;
    querySnapshot.forEach((doc) => {
      fileName = doc.data().fileName;
    });
    return fileName;
  }
  async function uploadAndUpdate() {
    let wait = await uploadProfilePic();
    wait = await updateProfilePic();
  }
  async function updateProfilePic() {
    if (isProfilePic) {
      const fileName = await getFileName();
      const fileNameRef = ref(storage, fileName);
      const profilePicURL = await getProfilePicURL(fileNameRef);
      setProfilePic(profilePicURL);
    }
  }

  async function removeProfilePic(fileName) {
    const profilePicRef = ref(storage, fileName);
    let res = await deleteObject(profilePicRef);
  }

  async function getProfilePicURL(fileName) {
    const profilePicRef = ref(storage, fileName);
    const url = await getDownloadURL(profilePicRef);
    return url;
  }

  function closeCalendarCallback() {
    setCalendarIsOpen(false);
  }

  return (
    <Box
      className="nav-bar"
      sx={{
        flexGrow: 1,
        ml: marginLeft,
      }}
    >
      <AppBar position="static">
        <Toolbar>
          {!props.drawerIsOpen && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 1 }}
              onClick={props.openDrawer}
            >
              <Menu></Menu>
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, mr: 1 }}>
            Taskinator
          </Typography>
          <div>
            <CalendarMonth
              sx={{ mr: 1 }}
              className="calendar-icon"
              onClick={() => {
                setCalendarIsOpen(!calendarIsOpen);
              }}
            ></CalendarMonth>
            {calendarIsOpen && (
              <TasksCalendar
                taskstodo={props.taskstodo}
                taskscompleted={props.taskscompleted}
                tasksinprogress={props.tasksinprogress}
                calendarIsOpen={calendarIsOpen}
                closeCalendar={closeCalendarCallback}
              ></TasksCalendar>
            )}
          </div>
          <Button
            color="inherit"
            size="large"
            onClick={props.currUser ? signOut : props.toggleLoginPage}
            sx={{ mr: 1 }}
          >
            {props.currUser ? "Sign out" : "Login/Sign-up"}
          </Button>
          {props.currUser &&
            (isProfilePic ? (
              <div className="image-upload">
                <label htmlFor="profile-submit">
                  <img src={profilePic} />
                </label>

                <input
                  id="profile-submit"
                  accept="image/*"
                  type="file"
                  onInput={uploadAndUpdate}
                />
              </div>
            ) : (
              <IconButton
                color="inherit"
                aria-label="profile picture submit"
                size="large"
                component="label"
              >
                <input
                  hidden
                  id="profile-submit"
                  accept="image/*"
                  type="file"
                  onInput={uploadAndUpdate}
                />
                <AccountCircle></AccountCircle>
              </IconButton>
            ))}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
