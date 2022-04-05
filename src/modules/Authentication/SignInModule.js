import { Button, Grid } from "@mui/material";
import React, { useState } from "react";

const SignInModule = ({ setSignupOrSignin }) => {
  // eslint-disable-next-line no-undef
  let whop = new Whop("bb43d1070bdd751d2adc44bae31fff8466f2f46a9c");

  const handleSignInClick = async () => {
    console.log("User logged in: ", whop.isLoggedIn());
    let plans = await whop.getPlans();
    console.log(plans);
    let user = await whop.login();
    console.log("whop signing");
    console.log(user);
  };

  return (
    <Grid
      container
      item
      xs={12}
      justifyContent="center"
      alignItems="center"
      alignContent="center"
    >
      <Grid
        item
        xs={12}
        mt={1}
        mb={1}
        alignItems="center"
        alignContent="center"
      >
        <Button variant="contained" onClick={handleSignInClick} xs={5}>
          Sign In
        </Button>
      </Grid>
    </Grid>
  );
};

export default SignInModule;
