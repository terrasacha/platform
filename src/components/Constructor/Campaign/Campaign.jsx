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

export default function Campaign() {
  const [campaign, setCampaign] = useState(null);
  const [editable, setEditable] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalNewProperty, setShowModalNewProperty] = useState(false);
  const [showModalEndCampaign, setShowModalEndCampaign] = useState(false);
  const [projectVerifiers, setProjectVerifiers] = useState([]);

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

      const projectVerifiers = data.data.getCampaign.product.userProducts.items
        .filter((up) => up.user?.role === "validator")
        .map((userProduct) => {
          return { id: userProduct.user.id, name: userProduct.user.name};
        });

      console.log('up', data.data.getCampaign.product.userProducts.items)

      const isAuthorResult = await isAuthor([data.data.getCampaign.userID, ...projectVerifiers.map((pv) => pv.id)]);
      setEditable(isAuthorResult);
      setProjectVerifiers(projectVerifiers)
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
      console.log('ids', ids)
  
      // Verificar si el ID del usuario autenticado está en el array de IDs
      if (ids.includes(userLogged.attributes.sub)) {
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
              {campaign.available ? (
                editable ? (
                  <button
                    onClick={handleShowEndCampaign}
                    className="bg-gray-400 py-3 text-md font-medium text-gray-100 rounded-md w-3/6 hover:bg-red-600 transition-colors duration-300"
                  >
                    Cerrar convocatoria ahora
                  </button>
                ) : (
                  <button
                    onClick={handleShowNewProperty}
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
                  <button onClick={() => navigate(`/project/${campaign.productID}`)} className="bg-green-600 py-3 mt-3 text-md text-center font-medium text-gray-100 rounded-md w-3/6 active:bg-green-700">
                    Ver campaña
                  </button>
                </>
              )}
              {projectVerifiers.length > 0 && (
                <section>
                  <p className="fs-6 mb-0 fw-bold text-gray-500 mt-3">Validadores asignados:</p>
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
          <h2 className="text-2xl text-gray-600 mb-2">Predios postulados</h2>
          <PropertiesTable editable={editable}/>
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
        productId={campaign.productID}
        fetchCampaign={fetchCampaign}
      />
      <ToastContainer />
    </div>
  );
}
