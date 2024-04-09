import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import getProjectsByUserID from "../services/getUserProjects";

export default function useUserProjects() {
  const { user } = useAuth()
  const [userProjects, setUserProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(true);

  useEffect(() => {
    if(user) {
      setIsLoading(true);
  
      getProjectsByUserID({userID: user.id}).then((projects) => {
        setUserProjects(projects);
        setIsLoading(false);
      }).catch(err => {
        setIsLoading(false)
        setIsError(true)
      })

    }
  }, [user]);

  return { userProjects, isLoading, isError };
}
