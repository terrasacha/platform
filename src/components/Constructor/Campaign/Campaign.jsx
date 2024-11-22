import React, { useEffect, useState } from "react";
import NewHeaderNavbar from "components/common/NewHeaderNavbar";
import { useNavigate, useParams } from "react-router";
import Card from "components/common/Card";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { getCampaign } from "utilities/customQueries";
import { FiEdit3 } from "react-icons/fi";
import PropertiesTable from "./PropertiesTable";
import ModalEditCampaign from "./ModalEditCampaign";
import ModalEndCampaign from "./ModalEndCampaign";
import ModalAcceptProperty from "./ModalAcceptProperty";
import ModalNewProperty from "./ModalNewProperty";
import { toast, ToastContainer } from "react-toastify";
import { formatArea } from "../ProjectPage/mappers";

export default function Campaign() {
  const [campaign, setCampaign] = useState(null);
  const [editable, setEditable] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userLogged, setUserLogged] = useState(false);
  const [showModalNewProperty, setShowModalNewProperty] = useState(false);
  const [showModalEndCampaign, setShowModalEndCampaign] = useState(false);
  const [projectVerifiers, setProjectVerifiers] = useState([]);

  const [registeredProperties, setRegisteredProperties] = useState(0);
  const [chosenProperties, setChosenProperties] = useState(0);
  const [totalChosenProperties, setTotalChosenProperties] = useState(0);

  const handleCloseNewProperty = () => setShowModalNewProperty(false);
  const handleShowNewProperty = () => setShowModalNewProperty(true);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleCloseEndCampaign = () => setShowModalEndCampaign(false);
  const handleShowEndCampaign = () => setShowModalEndCampaign(true);
  const navigate = useNavigate();
  const { id } = useParams();

  const fetchCampaign = async () => {
    try {
      const data = await API.graphql(graphqlOperation(getCampaign, { id }));

      console.log(data.data.getCampaign);
      setCampaign(data.data.getCampaign);
      const campaign = data.data.getCampaign;
      const product = campaign.products.items[0];

      const projectVerifiers = product.userProducts.items
        .filter((up) => up.user?.role === "validator")
        .map((userProduct) => {
          return { id: userProduct.user.id, name: userProduct.user.name };
        });
      console.log("campaign", campaign);
      setRegisteredProperties(campaign.properties.items.length);
      setChosenProperties(
        campaign.properties.items.filter((camp) => camp.status === "APPROVED")
          .length
      );
      // Inicializamos la suma total
      let totalDArea = 0;

      // Recorremos cada propiedad
      campaign.properties.items
        .filter((camp) => camp.status === "APPROVED")
        .forEach((property) => {
          // Obtenemos las características de cada propiedad
          const features = property.propertyFeatures?.items || [];

          // Filtramos las características que tienen `featureID` igual a "D_area"
          const dAreaFeatures = features.filter(
            (feature) => feature.featureID === "D_area"
          );

          // Sumamos los valores de estas características
          dAreaFeatures.forEach((feature) => {
            totalDArea += parseFloat(feature.value) || 0; // Convertimos `value` a número para evitar errores
          });
        });

      setTotalChosenProperties(formatArea(totalDArea));

      const isAuthorResult = await isAuthor([
        data.data.getCampaign.userID,
        ...projectVerifiers.map((pv) => pv.id),
      ]);
      setEditable(isAuthorResult);
      setProjectVerifiers(projectVerifiers);
    } catch (error) {
      console.error("Error fetching campaign:", error);
    }
  };
  useEffect(() => {
    fetchCampaign();
  }, []);
  const isAuthor = async (ids) => {
    try {
      const userLogged = await Auth.currentAuthenticatedUser();
      setUserLogged(userLogged);

      // Verificar si el ID del usuario autenticado está en el array de IDs
      if (userLogged && ids.includes(userLogged.attributes.sub)) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  if (!campaign) return null;

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  return (
    <div className="container-sm">
      <div className="mb-24">
        <NewHeaderNavbar />
      </div>
      <Card className="px-10">
        <Card.Body>
          <article className="flex w-full">
            <img
              src={JSON.parse(campaign.images)[0]}
              alt="campaign image"
              className="w-1/2"
            />
            <section className="w-1/2 px-4 py-2 text-gray-700 h-full">
              <h1 className="m-0 text-[2.5rem] font-bold flex items-center">
                {campaign.name}{" "}
                {editable && (
                  <FiEdit3
                    onClick={handleShow}
                    className="text-2xl ml-2 cursor-pointer"
                  />
                )}
              </h1>
              <p className="text-lg font-medium text-gray-500">
                Hasta {formatDate(campaign.endDate)}
              </p>
              <p className="text-md text-gray-500">{campaign.description}</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-100">
                <div class="max-w-sm mx-auto p-4 bg-white shadow-md rounded-lg border border-gray-200">
                  <h2 class="text-lg font-semibold text-gray-800">
                    Predios Inscritos
                  </h2>
                  <p class="mt-2 text-3xl font-bold text-blue-600">
                    {registeredProperties}
                  </p>
                </div>
                <div class="max-w-sm mx-auto p-4 bg-white shadow-md rounded-lg border border-gray-200">
                  <h2 class="text-lg font-semibold text-gray-800">
                    Predios Elegidos
                  </h2>
                  <p class="mt-2 text-3xl font-bold text-blue-600">
                    {chosenProperties}
                  </p>
                </div>
                <div class="max-w-sm mx-auto p-4 bg-white shadow-md rounded-lg border border-gray-200">
                  <h2 class="text-lg font-semibold text-gray-800">
                    Area Total Elegidos
                  </h2>
                  <p class="mt-2 text-3xl font-bold text-blue-600">
                    {totalChosenProperties}
                  </p>
                </div>
              </div>

              {campaign.available ? (
                editable ? (
                  <button
                    onClick={handleShowEndCampaign}
                    className="bg-gray-400 py-3 mt-3 text-md font-medium text-gray-100 rounded-md w-3/6 hover:bg-red-600 transition-colors duration-300"
                  >
                    Cerrar convocatoria ahora
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      userLogged ? handleShowNewProperty() : navigate("/login")
                    }
                    className="bg-green-600 py-3 text-md font-medium text-white rounded-md w-3/6 active:bg-green-700"
                  >
                    Postular predio
                  </button>
                )
              ) : (
                <>
                  <div className="bg-gray-400 py-3 text-md text-center font-medium text-gray-100 rounded-md w-3/6">
                    Convocatoria cerrada
                  </div>
                  <button
                    onClick={() =>
                      navigate(`/project/${campaign.products.items[0].id}`)
                    }
                    className="bg-green-600 py-3 mt-3 text-md text-center font-medium text-gray-100 rounded-md w-3/6 active:bg-green-700"
                  >
                    Ver proyecto
                  </button>
                </>
              )}
              {projectVerifiers.length > 0 && (
                <section>
                  <p className="fs-6 mb-0 fw-bold text-gray-500 mt-3">
                    Validadores asignados:
                  </p>
                  <div className="flex gap-2">
                    {projectVerifiers.map((pvn, index) => {
                      return (
                        <div
                          className="bg-blue-500 text-xs text-white font-bold px-4 py-2 rounded-md text-nowrap "
                          key={index}
                        >
                          Validador {index + 1}: {pvn.name}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </section>
          </article>
          {campaign.properties.items.length > 0 && (
            <>
              <h2 className="text-2xl text-gray-600 my-4">
                Predios postulados
              </h2>
              <PropertiesTable editable={editable} />
            </>
          )}
        </Card.Body>
      </Card>
      <ModalEditCampaign
        showModal={showModal}
        handleClose={handleClose}
        campaign={campaign}
        fetchCampaign={fetchCampaign}
      />
      <ModalEndCampaign
        campaign={campaign}
        fetchCampaign={fetchCampaign}
        showModalEndCampaign={showModalEndCampaign}
        handleCloseEndCampaign={handleCloseEndCampaign}
      />
      <ModalNewProperty
        showModal={showModalNewProperty}
        handleClose={handleCloseNewProperty}
        campaignId={campaign.id}
        productId={campaign.products.items[0].id}
        fetchCampaign={fetchCampaign}
      />
      <ToastContainer />
    </div>
  );
}
