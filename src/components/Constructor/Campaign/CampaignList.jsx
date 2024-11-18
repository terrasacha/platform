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
      return result.data.listCampaigns.items;
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      return [];
    }
  };

  if (!campaignList.length) return null;

  return (
    <div className="container-sm">
      <div className="mb-24">
        <NewHeaderNavbar />
      </div>
      <h1>Campañas</h1>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Nombre</th>
            <th className="border border-gray-300 px-4 py-2">Descripción</th>
            <th className="border border-gray-300 px-4 py-2">Fecha Inicio</th>
            <th className="border border-gray-300 px-4 py-2">Fecha Fin</th>
            <th className="border border-gray-300 px-4 py-2">Disponible</th>
            <th className="border border-gray-300 px-4 py-2">Imágenes</th>
            <th className="border border-gray-300 px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {campaignList.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{item.name}</td>
              <td className="border border-gray-300 px-4 py-2">
                {item.description.length > 120
                  ? `${item.description.slice(0, 120).trim()}...`
                  : item.description}
              </td>

              <td className="border border-gray-300 px-4 py-2">
                {new Date(item.initialDate * 1000).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(item.endDate * 1000).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {item.available ? 'Sí' : 'No'}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {JSON.parse(item.images || '[]').map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Imagen ${i + 1}`}
                    className="w-20 h-20 object-cover"
                  />
                ))}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <a
                  href={`/campaign/${item.id}`}
                  className="text-blue-500 hover:underline"
                >
                  Ver Detalle
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
