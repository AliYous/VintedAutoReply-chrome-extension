import React, { useEffect, useState } from "react";
import SignInModule from "./SignInModule";
// import SignUpModule from "./SignUpModule";

const AuthModule = () => {
  const [signupOrSignin, setSignupOrSignin] = useState("signin");

  return (
    <>
      <SignInModule setSignupOrSignin={setSignupOrSignin} />
      {/* {signupOrSignin === "signin" && (
        <SignInModule setSignupOrSignin={setSignupOrSignin} />
      )}
      {signupOrSignin === "signup" && (
        <SignUpModule setSignupOrSignin={setSignupOrSignin} />
      )} */}
    </>
  );
};

export default AuthModule;
