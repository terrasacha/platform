import React, { useEffect, useState } from "react";
import NewHeaderNavbar from "components/common/NewHeaderNavbar";
import { useNavigate, useParams } from "react-router";
import Card from "components/common/Card";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { getCampaign } from "utilities/customQueries";
import { FiEdit3, FiShare2, FiHelpCircle, FiEye, FiLock, FiCalendar, FiMapPin } from "react-icons/fi";
import PropertiesTable from "./PropertiesTable";
import ModalEditCampaign from "./ModalEditCampaign";
import ModalEndCampaign from "./ModalEndCampaign";
import ModalAcceptProperty from "./ModalAcceptProperty";
import ModalLogin from "./ModalLogin";
import ModalNewProperty from "./ModalNewProperty";
import { toast, ToastContainer } from "react-toastify";
import { formatArea } from "../ProjectPage/mappers";
import { onUpdateProperty } from "graphql/subscriptions";
import { WindowFullscreen } from "react-bootstrap-icons";
import ModalEditImage from "./ModalEditImage";
import Imagen from "../../common/_images/Campaña.png";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import ModalAssignProperty from "./ModalAssignProperty";

export default function Campaign() {
  const [campaign, setCampaign] = useState(null);
  const [editable, setEditable] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userLogged, setUserLogged] = useState(false);
  const [showModalNewProperty, setShowModalNewProperty] = useState(false);
  const [showModalEndCampaign, setShowModalEndCampaign] = useState(false);
  const [showModalLogin, setShowModalLogin] = useState(false);
  const [projectVerifiers, setProjectVerifiers] = useState([]);
  const [showModalEditImage, setShowModalEditImage] = useState(false);
  const [registeredProperties, setRegisteredProperties] = useState(0);
  const [chosenProperties, setChosenProperties] = useState(0);
  const [totalChosenProperties, setTotalChosenProperties] = useState(0);
  const [showModalAssignProperty, setShowModalAssignProperty] = useState(false);

  const handleCloseNewProperty = () => setShowModalNewProperty(false);
  const handleShowNewProperty = () => setShowModalNewProperty(true);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleShowEditImage = () => setShowModalEditImage(true);
  const handleCloseEditImage = () => setShowModalEditImage(false);

  const handleCloseEndCampaign = () => setShowModalEndCampaign(false);
  const handleShowEndCampaign = () => setShowModalEndCampaign(true);
  const handleCloseLogin = () => setShowModalLogin(false);

  const navigate = useNavigate();
  const { id } = useParams();

  const handleClickSeeProject = async (id) => {
    try {
      await Auth.currentAuthenticatedUser();
      navigate(`/project/${id}`);
    } catch (error) {
      setShowModalLogin(true);
    }
  };
  const fetchCampaign = async () => {
    try {
      const data = await API.graphql(graphqlOperation(getCampaign, { id }));

      const campaignData = data.data.getCampaign;
      
      // Debug: Log de la campaña completa
      console.log("Campaign data received:", campaignData);
      console.log("Campaign images field:", campaignData.images);
      
      setCampaign(campaignData);
      const product = campaignData.products.items[0];

      const projectVerifiers = product?.userProducts?.items
        .filter((up) => up.user?.role === "validator")
        .map((userProduct) => {
          return { id: userProduct.user.id, name: userProduct.user.name };
        });
      setRegisteredProperties(campaignData.properties.items.length);
      setChosenProperties(
        campaignData.properties.items.filter((camp) => camp.status === "APPROVED")
          .length
      );
      // Inicializamos la suma total
      let totalDArea = 0;

      // Recorremos cada propiedad
      campaignData.properties.items
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
        campaignData?.userID,
        ...projectVerifiers?.map((pv) => pv.id),
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
  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onUpdateProperty)
    ).subscribe({
      next: () => {
        fetchCampaign();
      },
      error: (err) => console.error("Error in subscription", err),
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [campaign?.id]);

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

  // Función para obtener la imagen de la campaña
  const getCampaignImage = () => {
    try {
      console.log("Campaign images raw:", campaign.images);
      
      if (!campaign.images) {
        console.log("No images found, using default");
        return Imagen;
      }

      let imagesArray;
      
      // Si ya es un array, usarlo directamente
      if (Array.isArray(campaign.images)) {
        imagesArray = campaign.images;
      } else {
        // Intentar parsear como JSON
        imagesArray = JSON.parse(campaign.images);
      }

      console.log("Parsed images array:", imagesArray);
      
      if (Array.isArray(imagesArray) && imagesArray.length > 0) {
        const firstImage = imagesArray[0];
        console.log("First image URL:", firstImage);
        return firstImage;
      }
      
      console.log("No valid images found, using default");
      return Imagen;
    } catch (error) {
      console.error("Error parsing campaign images:", error);
      console.log("Campaign images value:", campaign.images);
      return Imagen;
    }
  };

  const redirectToLoginPage = (id) => {
    const redirectArray = ["campaign", id];
    window.sessionStorage.setItem(
      "redirect_after_login",
      JSON.stringify(redirectArray)
    );
    navigate("/login");
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("¡Enlace copiado al portapapeles!");
    } catch (error) {
      console.error("Error al copiar:", error);
      toast.error("No se pudo copiar el enlace");
    }
  };

  return (
    <div className="min-h-screen bg-terrasacha-earth/5">
      <style jsx>{`
        .tab-button {
          @apply px-3 sm:px-4 py-2 font-typographica text-sm sm:text-base font-medium text-gray-500 rounded-t-lg transition-all duration-300;
        }
        .tab-button.active {
          @apply text-terrasacha-secondary1 bg-white border-x border-t border-gray-200 shadow-sm;
        }
        .tab-button:not(.active):hover {
          @apply text-terrasacha-primary bg-gray-50;
        }
        .shadow-text {
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
      `}</style>
      
      {/* Navbar sin margen inferior para eliminar el espaciado blanco */}
      <div className="mb-0">
        <NewHeaderNavbar />
      </div>

      {/* Hero Section - Responsive */}
      <section className="relative h-[40vh] sm:h-[50vh] md:h-[60vh] min-h-[300px] sm:min-h-[350px] md:min-h-[400px] max-h-[500px] sm:max-h-[550px] md:max-h-[600px] w-full flex items-center justify-center text-white text-center overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <img
          src={getCampaignImage()}
          alt="Imagen de la campaña"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-champagne text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl leading-tight shadow-text px-2">
            {campaign.name}
          </h1>
          <p className="font-typographica text-base sm:text-lg md:text-xl lg:text-2xl mt-2 sm:mt-3 md:mt-4 text-terrasacha-earth px-4">
            "Pioneros del Mañana"
          </p>
        </div>
      </section>

      {/* Main Content - Ajustado para mejor integración - Responsive */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-[-80px] sm:mt-[-100px] md:mt-[-120px] relative z-20 mb-8 sm:mb-12 md:mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8">
          {/* Main Content Area - Responsive */}
          <div className="lg:col-span-8">
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-terrasacha-xl">
              {/* Campaign Header - Mejorado el espaciado - Responsive */}
              <div className="mb-6 sm:mb-8 md:mb-10">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6">
                  <h2 className="font-champagne text-2xl sm:text-3xl md:text-4xl text-terrasacha-secondary1 mb-2 sm:mb-0">
                    {campaign.name}
                    {editable && (
                      <FiEdit3
                        onClick={handleShow}
                        className="inline ml-2 sm:ml-3 text-terrasacha-primary hover:text-terrasacha-secondary1 transition-all duration-300 cursor-pointer w-5 h-5 sm:w-6 sm:h-6"
                      />
                    )}
                  </h2>
                  <div className="flex items-center text-gray-500 font-typographica mt-2 sm:mt-1.5 whitespace-nowrap text-sm sm:text-base">
                    <FiCalendar className="text-lg sm:text-xl mr-2 text-terrasacha-secondary2" />
                    <span>Fecha límite: {formatDate(campaign.endDate)}</span>
                  </div>
                </div>
                <p className="font-champagne text-lg sm:text-xl md:text-2xl text-terrasacha-secondary2 mb-3 sm:mb-4">"Pioneros del Mañana"</p>
                <p className="font-typographica text-sm sm:text-base text-gray-600 max-w-3xl leading-relaxed">
                  {campaign.description}
                </p>
              </div>

              {/* Statistics Cards - Mejorado el espaciado - Responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12 md:mb-14">
                <div className="bg-terrasacha-earth/10 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-gray-200/80 flex items-center space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-3 bg-terrasacha-light/30 rounded-full">
                    <FiMapPin className="text-2xl sm:text-3xl text-terrasacha-primary" />
                  </div>
                  <div>
                    <p className="font-champagne text-2xl sm:text-3xl md:text-4xl text-terrasacha-secondary1">{registeredProperties}</p>
                    <p className="font-typographica text-xs sm:text-sm text-gray-500 uppercase tracking-wide">Predios Inscritos</p>
                  </div>
                </div>
                <div className="bg-terrasacha-earth/10 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-gray-200/80 flex items-center space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-3 bg-terrasacha-light/30 rounded-full">
                    <FiEye className="text-2xl sm:text-3xl text-terrasacha-primary" />
                  </div>
                  <div>
                    <p className="font-champagne text-2xl sm:text-3xl md:text-4xl text-terrasacha-secondary1">{chosenProperties}</p>
                    <p className="font-typographica text-xs sm:text-sm text-gray-500 uppercase tracking-wide">Seleccionados</p>
                  </div>
                </div>
                <div className="bg-terrasacha-earth/10 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-gray-200/80 flex items-center space-x-3 sm:space-x-4 sm:col-span-2 lg:col-span-1">
                  <div className="p-2 sm:p-3 bg-terrasacha-light/30 rounded-full">
                    <FiMapPin className="text-2xl sm:text-3xl text-terrasacha-primary" />
                  </div>
                  <div>
                    <p className="font-champagne text-2xl sm:text-3xl md:text-4xl text-terrasacha-secondary1">
                      {totalChosenProperties} <span className="text-lg sm:text-xl md:text-2xl">m²</span>
                    </p>
                    <p className="font-typographica text-xs sm:text-sm text-gray-500 uppercase tracking-wide">Área Total</p>
                  </div>
                </div>
              </div>

              {/* Properties Section - Responsive */}
              {campaign.properties.items.length > 0 && userLogged && (
                <div>
                  <div className="border-b border-gray-200 bg-gray-50/70 rounded-t-lg sm:rounded-t-xl">
                    <nav aria-label="Tabs" className="-mb-px flex flex-wrap sm:flex-nowrap space-x-1 sm:space-x-2 px-2 sm:px-4">
                      <button className="tab-button active flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                        <FiMapPin className="text-sm sm:text-lg" />
                        <span className="hidden sm:inline">Predios Postulados</span>
                        <span className="sm:hidden">Predios</span>
                        <span className="hidden sm:inline">({campaign.properties.items.length})</span>
                        <span className="sm:hidden">({campaign.properties.items.length})</span>
                      </button>
                      <button className="tab-button flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                        <FiEye className="text-sm sm:text-lg" />
                        <span className="hidden sm:inline">Seleccionados</span>
                        <span className="sm:hidden">Sel.</span>
                      </button>
                      <button className="tab-button flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                        <FiMapPin className="text-sm sm:text-lg" />
                        <span>Mapa</span>
                      </button>
                    </nav>
                  </div>
                  <div className="space-y-4 py-6 sm:py-8">
                    <PropertiesTable editable={editable} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Responsive */}
          <aside className="lg:col-span-4 mt-6 lg:mt-0">
            <div className="lg:sticky lg:top-32 space-y-6 sm:space-y-8">
              {/* Campaign Actions - Responsive */}
              <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-terrasacha-xl border border-gray-100">
                <h3 className="font-champagne text-xl sm:text-2xl text-terrasacha-secondary1 mb-4 sm:mb-6">Acciones de Campaña</h3>
                <div className="space-y-3 sm:space-y-4">
                  {campaign.available ? (
                    <>
                      <button
                        onClick={() =>
                          editable
                            ? handleShowEndCampaign()
                            : userLogged
                            ? handleShowNewProperty()
                            : redirectToLoginPage(campaign.id)
                        }
                        className={`w-full flex items-center justify-center space-x-2 py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl font-typographica font-semibold transition-all duration-300 text-sm sm:text-base ${
                          editable
                            ? "bg-red-500 hover:bg-red-600 text-white shadow-terrasacha hover:shadow-terrasacha-lg"
                            : "bg-terrasacha-primary hover:bg-terrasacha-secondary1 text-white shadow-terrasacha hover:shadow-terrasacha-lg"
                        }`}
                      >
                        <FiLock className="text-lg sm:text-xl" />
                        <span className="hidden sm:inline">
                          {editable ? "Cerrar Campaña" : "Postular Predio"}
                        </span>
                        <span className="sm:hidden">
                          {editable ? "Cerrar" : "Postular"}
                        </span>
                      </button>
                      <button
                        onClick={handleShare}
                        className="w-full flex items-center justify-center space-x-2 py-2.5 sm:py-3 px-4 sm:px-6 bg-white text-terrasacha-primary border border-terrasacha-light rounded-lg sm:rounded-xl font-typographica font-semibold shadow-sm hover:shadow-md hover:border-terrasacha-primary transition-all duration-300 text-sm sm:text-base"
                      >
                        <FiShare2 className="text-lg sm:text-xl" />
                        <span>Compartir</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        disabled
                        className="w-full py-2.5 sm:py-3 px-4 sm:px-6 bg-gray-400 text-white font-typographica font-semibold rounded-lg sm:rounded-xl text-center cursor-not-allowed text-sm sm:text-base"
                      >
                        Convocatoria cerrada
                      </button>
                      <button
                        onClick={() => handleClickSeeProject(campaign.products.items[0].id)}
                        className="w-full flex items-center justify-center space-x-2 py-2.5 sm:py-3 px-4 sm:px-6 bg-terrasacha-primary hover:bg-terrasacha-secondary1 text-white rounded-lg sm:rounded-xl font-typographica font-semibold shadow-terrasacha hover:shadow-terrasacha-lg transition-all duration-300 text-sm sm:text-base"
                      >
                        <FiEye className="text-lg sm:text-xl" />
                        <span className="hidden sm:inline">Ver proyecto</span>
                        <span className="sm:hidden">Ver</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Campaign Consultant - Responsive */}
              {projectVerifiers.length > 0 && (
                <div className="bg-terrasacha-earth/30 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-terrasacha-xl border border-terrasacha-earth/50">
                  <h3 className="font-champagne text-xl sm:text-2xl text-terrasacha-secondary1 mb-3 sm:mb-4">Consultor de Campaña</h3>
                  <div className="space-y-4 sm:space-y-5">
                    {projectVerifiers.map((pvn, index) => (
                      <div key={index} className="flex items-center space-x-3 sm:space-x-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-terrasacha-primary flex items-center justify-center text-white font-typographica font-bold text-sm sm:text-lg">
                          {pvn.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-champagne text-base sm:text-lg text-terrasacha-secondary1">Consultor {index + 1}</p>
                          <p className="font-typographica text-xs sm:text-sm text-gray-600">{pvn.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

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
      <ModalLogin showModal={showModalLogin} handleClose={handleCloseLogin} />
      <ModalEditImage
        show={showModalEditImage}
        handleClose={handleCloseEditImage}
        campaignId={campaign.id}
        fetchCampaign={fetchCampaign}
      />

      <ToastContainer />
      <ModalAssignProperty
        showModal={showModalAssignProperty}
        handleClose={() => setShowModalAssignProperty(false)}
        campaignId={campaign.id}
        fetchCampaign={fetchCampaign}
      />
    </div>
  );
}
  