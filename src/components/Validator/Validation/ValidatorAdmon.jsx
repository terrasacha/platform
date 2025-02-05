import React from "react";
import useUserCampaigns from "hooks/useUserCampaigns";
import vacio from "../../views/_images/caja-vacia-gris.png";
import { getImagesCategories, getYearFromAWSDatetime  } from "components/Constructor/ProjectPage/utils";


// Componente para representar una campaña individual
const CampaignCard = ({ campaign }) => {
  let campaignImages = [];
  try {
    campaignImages = campaign?.images ? JSON.parse(campaign.images) : [];
  } catch (error) {
    console.error("Error al parsear las imágenes de la campaña:", error);
  }

  const campaignImage =
    campaignImages.length > 0
      ? campaignImages[0]
      : getImagesCategories(campaign?.products?.items?.[0]?.categoryID);

  return (
    <div className="p-4">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <img
          className="h-40 w-full object-cover"
          src={campaignImage}
          alt="Imagen de la campaña"
        />
        <div className="p-4">
          <div className="flex space-x-2 mb-2">
            <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded">
              {getYearFromAWSDatetime(campaign?.products?.items?.[0]?.createdAt)}
            </span>
            <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded">
              {campaign?.products?.items?.[0]?.categoryID}
            </span>
          </div>
          <h3 className="text-lg font-bold mb-2">{campaign?.name}</h3>
          <p className="text-gray-600 text-sm mb-4">{campaign?.description}</p>
          <div className="flex justify-between items-center mt-3 space-x-4">
            <a
              href={`campaign/${campaign?.id}`}
              className="inline-block bg-blue-500 text-white text-sm px-4 py-2 rounded hover:bg-blue-600"
            >
              Ver Campaña
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal que muestra la lista de campañas
export default function ValidatorAdmon() {
  const { userCampaigns } = useUserCampaigns();

  return (
    <>
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Tus Campañas
        </h2>

        {userCampaigns.length === 0 ? (
          <div className="py-12 text-center">
            <img
              src={vacio}
              className="w-32 h-32 mx-auto mb-4"
              alt="Sin campañas"
            />
            <p className="text-gray-500 mb-4">
              No tienes campañas aún. Para crear la primera, da click en Crear Campaña.
            </p>
            <a
              href="/new_campaign"
              className="bg-blue-500 text-white text-sm px-4 py-2 rounded hover:bg-blue-600"
            >
              Crear Campaña
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
