/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
import { Backdrop, Button, CircularProgress, Grid } from "@mui/material";
import { useState, useEffect } from "react";
import "./App.css";
import SettingsDropdown from "./components/SettingsDropdown";
import AuthModule from "./modules/Authentication";
import AutoSendMessagesModule from "./modules/AutoSendMessagesModule";

function App() {
  let whop = new Whop("bb43d1070bdd751d2adc44bae31fff8466f2f46a9c");
  const [authLoading, setAuthLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasActiveLicense, setHasActiveLicense] = useState(false);

  const checkAuthStatus = async () => {
    const loggedIn = whop.isLoggedIn();
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      await checkActiveLicense();
    }
    setAuthLoading(false);
  };

  const checkActiveLicense = async () => {
    const validPlanIds = [7445, 7446]; // Pro monthly & Free beta plans
    await whop.getPlans().then(({ data: plans }) => {
      const plan = plans.find(
        (plan) => validPlanIds.includes(plan.company_product.id) && plan.valid
      );
      setHasActiveLicense(plan ? true : false);
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
      <SettingsDropdown updateAuthStatus={updateAuthStatus} whop={whop} />
    </Grid>
  );
};

const InvalidLicenseRedirect = () => {
  const openPurchasePage = () => {
    window.open("https://whop.com/vintmate/checkout?productId=7445", "_blank");
  };
  return (
    <Grid
      container
      direction="column"
      className="invalid-license"
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "280px" }}
    >
      <Grid item alignItems="center" sx={{ maxWidth: "60%" }}>
        <h1>License invalide</h1>
        <p>
          Votre compte ne possède pas/plus de license valide. Cliquez sur 'Gérer
          mon abonnement' pour réactiver ou acheter une license Vintmate.
        </p>
      </Grid>

      <Button onClick={openPurchasePage}>Gérer mon abonnement</Button>
    </Grid>
  );
};

export default App;
