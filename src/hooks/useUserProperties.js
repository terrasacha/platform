import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import getPropertiesByUserID from "../services/getUserProperties";

export default function useUserProperties() {
  const { user } = useAuth()
  const [userProperties, setUserProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(true);

  useEffect(() => {
    if(user) {
      setIsLoading(true);
  
      getPropertiesByUserID({userID: user.id}).then((properties) => {
        setUserProperties(properties);
        setIsLoading(false);
      }).catch(err => {
        setIsLoading(false)
        setIsError(true)
      })

    }
  }, [user]);

  return { userProperties, isLoading, isError };
}
