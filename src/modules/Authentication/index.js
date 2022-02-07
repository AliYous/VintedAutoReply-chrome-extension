import React, { useState } from "react";
import SignInModule from "./SignInModule";
import SignUpModule from "./SignUpModule";

const AuthModule = () => {
  const [signupOrSignin, setSignupOrSignin] = useState("signin");

  return (
    <>
      {signupOrSignin === "signin" && (
        <SignInModule setSignupOrSignin={setSignupOrSignin} />
      )}
      {signupOrSignin === "signup" && (
        <SignUpModule setSignupOrSignin={setSignupOrSignin} />
      )}
    </>
  );
};

export default AuthModule;
