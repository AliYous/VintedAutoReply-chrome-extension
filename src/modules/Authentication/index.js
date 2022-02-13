import React, { useEffect, useState } from "react";
import SignInModule from "./SignInModule";
// import SignUpModule from "./SignUpModule";

const AuthModule = () => {
  const [signupOrSignin, setSignupOrSignin] = useState("signin");
  useEffect(() => {
    console.log(signupOrSignin);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
