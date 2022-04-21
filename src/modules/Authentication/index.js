import { Button, Grid } from "@mui/material";
import React from "react";

const AuthModule = ({ whop, updateAuthStatus }) => {
  const handleSignInClick = async () => {
    await whop.login();
    updateAuthStatus();
  };
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "280px" }}
    >
      <Grid item alignItems="center" sx={{ maxWidth: "60%" }}>
        <Button variant="contained" onClick={handleSignInClick} xs={5}>
          Se connecter avec Discord
        </Button>
      </Grid>
    </Grid>
  );
};

export default AuthModule;
