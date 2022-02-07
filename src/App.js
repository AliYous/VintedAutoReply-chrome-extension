/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
import { Grid } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import "./App.css";
import { auth } from "./firebaseConfig";
import AuthModule from "./modules/Authentication";
import AutoSendMessagesModule from "./modules/AutoSendMessagesModule";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  onAuthStateChanged(auth, (currentUser) => {
    setCurrentUser(currentUser);
  });

  return (
    <Grid container direction="column" className="App">
      <Header />
      {!currentUser ? <AuthModule /> : <AutoSendMessagesModule />}
    </Grid>
  );
}

const Header = () => {
  return (
    <Grid
      container
      item
      xs={12}
      className="header"
      justifyContent="flex-start"
      alignItems="center"
    >
      <img src="images/vintmate-logo.png" alt={"logo"} className="logo" />
    </Grid>
  );
};

export default App;
