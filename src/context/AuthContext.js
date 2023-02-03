import { Auth } from "aws-amplify";
import React, { useContext, useEffect, useState } from "react";


const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState()

  useEffect(() =>{
    checkUser()
    
  },[])

  async function checkUser(){
      try {
          const currentUser = await Auth.currentAuthenticatedUser()
          setUser({user: currentUser.attributes['custom:role']})
          localStorage.setItem('role', currentUser.attributes['custom:role'])
      } catch (error) {
          
      }
  }
  const value = {
    user,
  };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}