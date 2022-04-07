import { Button } from "@mui/material";
import React from "react";

const AuthModule = ({ whop, updateAuthStatus }) => {
  const handleSignInClick = async () => {
    await whop.login();
    updateAuthStatus();
  };
  return (
    <Button variant="contained" onClick={handleSignInClick} xs={5}>
      Sign In
    </Button>
  );
};

export default AuthModule;
