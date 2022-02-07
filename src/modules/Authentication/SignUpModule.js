import { Button, Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";

const SignUpModule = ({ setSignupOrSignin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      console.log(user);
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const redirectToSignIn = () => setSignupOrSignin("signin");

  return (
    <Grid
      container
      style={{
        minWidth: "100%",
      }}
      justifyContent="center"
      alignItems="center"
      alignContent="center"
    >
      <Grid item xs={12} mt={1} mb={1}>
        <h1>Sign Up</h1>
      </Grid>
      <Grid item xs={12} mt={1} mb={1}>
        <TextField
          id="outlined-multiline-static"
          placeholder="Email"
          defaultValue={email}
          value={email}
          onChange={handleEmailChange}
        />
      </Grid>
      <Grid item xs={12} mt={1} mb={1}>
        <TextField
          id="outlined-multiline-static"
          placeholder="Password"
          defaultValue={password}
          value={password}
          onChange={handlePasswordChange}
        />
      </Grid>
      <Grid item xs={12} mt={1} mb={1}>
        <Button variant="contained" onClick={handleSignUp} xs={12}>
          Sign Up
        </Button>
        <p className="authRedirectText" onClick={redirectToSignIn}>
          already have an account ? Sign In
        </p>
      </Grid>
    </Grid>
  );
};

export default SignUpModule;
