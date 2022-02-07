import { Button, Grid, TextField } from "@mui/material";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebaseConfig";

const SignInModule = ({ setSignupOrSignin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
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

  const redirectToSignUp = () => setSignupOrSignin("signup");

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
        <h1>Sign In</h1>
      </Grid>
      <Grid
        item
        xs={12}
        mt={1}
        mb={1}
        alignItems="center"
        alignContent="center"
      >
        <TextField
          placeholder="Email"
          defaultValue={email}
          value={email}
          onChange={handleEmailChange}
        />
      </Grid>
      <Grid
        item
        xs={12}
        mt={1}
        mb={1}
        alignItems="center"
        alignContent="center"
      >
        <TextField
          placeholder="Password"
          defaultValue={password}
          value={password}
          onChange={handlePasswordChange}
        />
      </Grid>
      <Grid
        item
        xs={12}
        mt={1}
        mb={1}
        alignItems="center"
        alignContent="center"
      >
        <Button variant="contained" onClick={handleSignIn} xs={5}>
          Sign In
        </Button>

        <p className="authRedirectText" onClick={redirectToSignUp}>
          Or Create an account
        </p>
      </Grid>
    </Grid>
  );
};

export default SignInModule;
