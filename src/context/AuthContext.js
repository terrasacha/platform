import { Auth, API, graphqlOperation } from "aws-amplify";
import React, { useContext, useEffect, useState } from "react";
import { getUser } from "../utilities/customQueries";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState();

  useEffect(() => {
    checkUser();
  }, []);
  async function checkUser() {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      const response = await API.graphql(
        graphqlOperation(getUser, { id: currentUser.attributes.sub })
      );

      setUser(response.data.getUser);
      localStorage.setItem("role", currentUser.attributes["custom:role"]);
    } catch (error) {}
  }
  const value = {
    user,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
