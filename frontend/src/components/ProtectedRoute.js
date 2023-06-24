import React, { useContext } from "react";
import { Store } from "../Store";
import SigninScreen from "../screens/SigninScreen";

const ProtectedRoute = ( {children} ) => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  return userInfo ? children : <SigninScreen />;
};

export default ProtectedRoute;
