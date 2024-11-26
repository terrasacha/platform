import React from "react";
//Bootstrap
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Stack from "react-bootstrap/Stack";
// GraphQL
import {
  getImagesCategories,
  getYearFromAWSDatetime,
} from "../ProjectPage/utils";
import useUserProjects from "hooks/useUserProjects";

// Import images
import vacio from "../../views/_images/caja-vacia-gris.png";
import useUserProperties from "hooks/useUserProperties";
import useUserCampaigns from "hooks/useUserCampaigns";

const CampaignCard = ({ campaign }) => (
  <div className="p-4">
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <img
        className="h-40 w-full object-cover"
        src={getImagesCategories(campaign?.products.items[0].categoryID)}
        alt="Imagen de la campaña"
      />
      <div className="p-4">
        <div className="flex space-x-2 mb-2">
          <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded">
            {getYearFromAWSDatetime(campaign?.products.items[0].createdAt)}
          </span>
          <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded">
            {campaign?.products.items[0].categoryID}
          </span>
        </div>
        <h3 className="text-lg font-bold mb-2">{campaign?.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{campaign?.description}</p>
        <a
          href={`campaign/${campaign?.id}`}
          className="inline-block bg-blue-500 text-white text-sm px-4 py-2 rounded hover:bg-blue-600"
        >
          Ver Campaña
        </a>
      </div>
    </div>
  </div>
);

const PropertyCard = ({ property }) => (
  <div className="p-4">
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex space-x-2 mb-2">
          <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded">
            {getYearFromAWSDatetime(property?.createdAt)}
          </span>
          <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded">
            Vinculado a campaña
          </span>
        </div>
        <h3 className="text-lg font-bold mb-2">{property?.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{property?.campaign.name}</p>
        <a
          href={`property/${property?.id}`}
          className="inline-block bg-blue-500 text-white text-sm px-4 py-2 rounded hover:bg-blue-600"
        >
          Ver más
        </a>
      </div>
    </div>
  </div>
);

const ProjectCard = ({ project }) => (
  <div className="p-4">
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <img
        className="h-40 w-full object-cover"
        src={getImagesCategories(project?.product.categoryID)}
        alt="Imagen del proyecto"
      />
      <div className="p-4">
        <div className="flex space-x-2 mb-2">
          <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded">
            {getYearFromAWSDatetime(project?.product.createdAt)}
          </span>
          <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded">
            {project?.product.categoryID}
          </span>
        </div>
        <h3 className="text-lg font-bold mb-2">{project?.product.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{project?.product.description}</p>
        <a
          href={`project/${project?.product.id}`}
          className="inline-block bg-blue-500 text-white text-sm px-4 py-2 rounded hover:bg-blue-600"
        >
          Ver más
        </a>
      </div>
    </div>
  </div>
);

export default function ProductsList() {
  const { userProjects } = useUserProjects();
  const { userProperties } = useUserProperties();
  const { userCampaigns } = useUserCampaigns();

  const userProjectsFiltered = userProjects.filter(
    (project) => project.product?.isActiveOnPlatform === true
  );

  console.log(userCampaigns, "userCampaigns");

  return (
    <>
    {userCampaigns.length > 0 && (
      <section>
        <h2 className="text-xl font-bold mt-8 mb-4">Tus Campañas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </section>
    )}

    {userProperties.length > 0 && (
      <section>
        <h2 className="text-xl font-bold mt-8 mb-4">Tus Predios Postulados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>
    )}

    <section>
      <h2 className="text-xl font-bold mt-8 mb-4">Tus Proyectos</h2>
      {userProjectsFiltered.length === 0 ? (
        <div className="text-center py-12">
          <img
            src={vacio}
            className="w-32 h-32 mx-auto mb-4"
            alt="Sin proyectos"
          />
          <p className="text-gray-500 mb-4">
            No tienes proyectos aún. Para crear el primero, da click en Postular proyecto.
          </p>
          <a
            href="/new_project"
            className="bg-blue-500 text-white text-sm px-4 py-2 rounded hover:bg-blue-600"
          >
            Postular Proyecto
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userProjectsFiltered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  </>
  );
}
