import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import getCampaignsByUserID from "../services/getUserCampaigns";

export default function useUserCampaigns() {
  const { user } = useAuth()
  const [userCampaigns, setUserCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(true);

  useEffect(() => {
    if(user) {
      setIsLoading(true);
  
      getCampaignsByUserID({userID: user.id}).then((campaigns) => {
        setUserCampaigns(campaigns);
        setIsLoading(false);
      }).catch(err => {
        setIsLoading(false)
        setIsError(true)
      })

    }
  }, [user]);

  return { userCampaigns, isLoading, isError };
}
