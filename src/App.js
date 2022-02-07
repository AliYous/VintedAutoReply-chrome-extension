/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
import { Grid } from "@mui/material";
import "./App.css";
import AutoSendMessagesModule from "./modules/AutoSendMessagesModule";

function App() {
  return (
    <Grid container direction="column" className="App">
      <Header />
      <AutoSendMessagesModule />
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
