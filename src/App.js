/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
import { Backdrop, CircularProgress, Grid } from "@mui/material";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useState } from "react";
import "./App.css";
import { auth } from "./firebaseConfig";
import AuthModule from "./modules/Authentication";
import AutoSendMessagesModule from "./modules/AutoSendMessagesModule";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  onAuthStateChanged(auth, (currentUser) => {
    setCurrentUser(currentUser);
    setAuthLoading(false);
  });

  return (
    <Grid container direction="column" className="App">
      <Header />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={authLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {!authLoading && !currentUser ? (
        <AuthModule />
      ) : (
        <AutoSendMessagesModule />
      )}
    </Grid>
  );
}

const Header = () => {
  const handleSignOut = async () => {
    await signOut(auth);
  };
  return (
    <Grid
      container
      item
      xs={12}
      className="header"
      justifyContent="space-between"
      alignItems="center"
    >
      <img src="images/vintmate-logo.png" alt={"logo"} className="logo" />
      <p style={{ cursor: "pointer" }} onClick={handleSignOut}>
        logout
      </p>
    </Grid>
  );
};

export default App;
