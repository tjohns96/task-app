import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Button,
  Typography,
} from "@mui/material";
import { Menu, AccountCircle } from "@mui/icons-material";
export default function NavBar(props) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <Menu></Menu>
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Projects
          </Typography>
          <Button color="inherit" size="large" onClick={props.toggleLoginPage}>
            Login/Sign-up
          </Button>
          <IconButton color="inherit" aria-label="profile picture" size="large">
            <AccountCircle></AccountCircle>
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
