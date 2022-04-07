/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
import { Backdrop, Button, CircularProgress, Grid } from "@mui/material";
import { useState, useEffect } from "react";
import "./App.css";
import AuthModule from "./modules/Authentication";
import AutoSendMessagesModule from "./modules/AutoSendMessagesModule";

function App() {
  let whop = new Whop("bb43d1070bdd751d2adc44bae31fff8466f2f46a9c");
  const [authLoading, setAuthLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasActiveLicense, setHasActiveLicense] = useState(false);

  const checkAuthStatus = () => {
    const loggedIn = whop.isLoggedIn();
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      checkActiveLicense();
    }
    setAuthLoading(false);
  };

  const checkActiveLicense = () => {
    whop.getPlans().then((plans) => {
      const plan = plans.data[0];
      setHasActiveLicense(plan.valid);
    });
  };

  useEffect(() => {
    checkAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid container direction="column" className="App">
      <Header whop={whop} updateAuthStatus={checkAuthStatus} />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={authLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {!authLoading && (
        <>
          {!isLoggedIn && (
            <AuthModule whop={whop} updateAuthStatus={checkAuthStatus} />
          )}
          {isLoggedIn && !hasActiveLicense && <InvalidLicenseRedirect />}
          {isLoggedIn && hasActiveLicense && <AutoSendMessagesModule />}
        </>
      )}
    </Grid>
  );
}

const Header = ({ whop, updateAuthStatus }) => {
  const handleSignOut = async () => {
    whop.logout();
    checkAuthStatus();
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

const InvalidLicenseRedirect = () => {
  const openPurchasePage = () => {
    window.open("https://whop.com/vintmate/home", "_blank");
  };
  return (
    <Grid container direction="column" className="invalid-license">
      <h1>Invalid License</h1>
      <p>
        Your account is not link to an active license. Click the button below to
        gain access!
      </p>
      <Button onClick={openPurchasePage}>Manage License</Button>
    </Grid>
  );
};

export default App;
