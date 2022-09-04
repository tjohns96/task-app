import { uiConfig, auth } from "../firebase-config";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import CloseIcon from "@mui/icons-material/Close";
export default function LoginPage(props) {
  return (
    <div className="login-background">
      <div className="wrapper">
        <StyledFirebaseAuth
          className="login-area"
          uiConfig={uiConfig}
          firebaseAuth={auth}
        ></StyledFirebaseAuth>
        <CloseIcon
          className="close-login"
          onClick={props.toggleLoginPage}
        ></CloseIcon>
      </div>
    </div>
  );
}
