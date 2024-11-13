import React, { useEffect, useState } from 'react';
import { listCampaigns } from 'utilities/customQueries';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import NewHeaderNavbar from 'components/common/NewHeaderNavbar';
export default function CampaignList() {
  const [campaignList, setCampaignList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUser();
      if (user) {
        const campaigns = await fetchListCampaigns(user.attributes.sub);
        setCampaignList(campaigns);
      }
    };
    fetchData();
  }, []);

  const getUser = async () => {
    try {
      const result = await Auth.currentAuthenticatedUser();
      return result;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  };

  const fetchListCampaigns = async (userID) => {
    try {
      const result = await API.graphql(
        graphqlOperation(listCampaigns, { filter: { userID: { eq: userID } } })
      );
      console.log(result.data.listCampaigns.items);
      return result.data.listCampaigns.items;
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      return [];
    }
  };

  if (!campaignList) return null;

  return (
    <div className="container-sm">
      <div className="mb-24">
        <NewHeaderNavbar />
      </div>
        <ul className="flex flex-col">
        {campaignList.map((item, index) => (
            <a key={index} href={`/campaign/${item.id}`}>{item.name}</a>
        ))}
        </ul>
    </div>
  );
}
