import React, { useState, useEffect } from "react";
import useUserCampaigns from "hooks/useUserCampaigns";
import useFetchProperties from "hooks/useFetchProperties";
import vacio from "../../views/_images/caja-vacia-gris.png";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import {
  FaEye,
  FaList,
  FaPlus,
  FaMinus,
  FaInfoCircle,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { Row } from "react-bootstrap";
import NewHeaderNavbar from "components/common/NewHeaderNavbar";
import { toast, ToastContainer } from "react-toastify";
import { API, graphqlOperation } from "aws-amplify";
import { createNotification, updateProperty } from "graphql/mutations";
import { useAuth } from "context/AuthContext";
import { useNavigate } from "react-router";
import { formatArea } from "components/Constructor/ProjectPage/mappers";
import { Modal } from "react-bootstrap";

const getPropertyArea = (property) => {
  const areaFeature = property.propertyFeatures?.items.find(
    (feature) => feature?.featureID === "D_area"
  );
  if (!areaFeature) return "No disponible";
  return formatArea(areaFeature?.value) || "No disponible";
};

const CampaignAssignModal = ({ isOpen, onClose, campaigns, onAssign }) => {
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAssign = async () => {
    if (!selectedCampaign) {
      setError("Debes seleccionar una campaña.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await onAssign(selectedCampaign);
      onClose();
    } catch (e) {
      setError("Ocurrió un error al asignar la campaña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      aria-labelledby="modal-asignar-campania-title"
      centered
      show={isOpen}
      onHide={onClose}
      contentClassName="rounded-2xl shadow-2xl border-0"
    >
      <Modal.Header
        closeButton
        className="bg-blue-50 border-0 rounded-t-2xl flex items-center gap-3"
      >
        <FaPlus className="text-blue-600 text-2xl mr-2" aria-hidden="true" />
        <div>
          <Modal.Title
            id="modal-asignar-campania-title"
            className="text-2xl font-bold text-blue-800"
          >
            Asignar a campaña
          </Modal.Title>
          <div className="text-sm text-gray-600 font-normal mt-1">
            Selecciona la campaña a la que deseas asignar el predio.
          </div>
        </div>
      </Modal.Header>
      <Modal.Body className="py-6 px-4 md:px-8">
        <label
          htmlFor="campaignSelect"
          className="block font-semibold text-gray-700 mb-2"
        >
          Campaña
        </label>
        <select
          id="campaignSelect"
          className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition ${
            error ? "border-red-400" : ""
          }`}
          onChange={(e) => {
            setSelectedCampaign(e.target.value);
            setError("");
          }}
          value={selectedCampaign}
          aria-label="Selecciona una campaña"
          aria-invalid={!!error}
          required
        >
          <option value="" disabled>
            Selecciona una campaña
          </option>
          {campaigns && campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.name.toUpperCase()}
              </option>
            ))
          ) : (
            <option value="" disabled>
              No hay campañas disponibles
            </option>
          )}
        </select>
        {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
      </Modal.Body>
      <hr className="my-0 border-t border-gray-200" />
      <div className="flex flex-col md:flex-row gap-3 justify-between bg-gray-50 rounded-b-2xl border-0 px-4 py-4">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition w-full md:w-auto"
          aria-label="Cancelar asignación"
        >
          <FaTimes className="text-base" />
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleAssign}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-md w-full md:w-auto disabled:opacity-60"
          aria-label="Asignar campaña"
        >
          {loading ? (
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-blue-400 rounded-full"></span>
          ) : (
            <FaCheck className="text-base" />
          )}
          {loading ? "Asignando..." : "Asignar"}
        </button>
      </div>
    </Modal>
  );
};

// Copio el stateMapper de ProductsList.jsx
const stateMapper = {
  PENDING: {
    label: "Pendiente",
    badge: "bg-yellow-100 text-yellow-700 border border-yellow-400",
    tooltip: "Pendiente: El predio está pendiente de revisión.",
  },
  APPROVED: {
    label: "Aprobado",
    badge: "bg-green-100 text-green-700 border border-green-400",
    tooltip: "Aprobado: El predio ha sido aprobado.",
  },
  REJECTED: {
    label: "Rechazado",
    badge: "bg-red-100 text-red-700 border border-red-400",
    tooltip: "Rechazado: El predio no cumple los requisitos.",
  },
  SELECTABLE: {
    label: "Seleccionable",
    badge: "bg-blue-100 text-blue-700 border border-blue-400",
    tooltip: "Seleccionable: El predio es elegible para continuar el proceso.",
  },
  NOT_SELECTABLE: {
    label: "No elegible",
    badge: "bg-red-100 text-red-700 border border-red-400",
    tooltip: "No elegible: El predio no es elegible para continuar el proceso.",
  },
  DOC_UPLOADED: {
    label: "Documentos cargados",
    badge: "bg-indigo-100 text-indigo-700 border border-indigo-400",
    tooltip: "El usuario ha cargado la documentación requerida para el predio.",
  },
};

export default function ValidatorAdmon() {
  const { userCampaigns, isLoading: isLoadingCampaigns } = useUserCampaigns();
  const { properties, fetchProperties, isLoading } = useFetchProperties();
  const [activeTab, setActiveTab] = useState("campaigns");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const { user } = useAuth();

  console.log("userCampaigns", userCampaigns);
  console.log("properties", properties);

  // Opciones de filtro de estado de campañas
  const campaignsStatusFilterOptions = [
    { key: "ALL", label: "Todas" },
    { key: "ACTIVE", label: "En curso" },
    { key: "FINISHED", label: "Finalizadas" },
  ];
  const [campaignsStatusFilter, setCampaignsStatusFilter] = useState("ALL");

  // Campañas
  const sortedCampaigns = Array.isArray(userCampaigns)
    ? [...userCampaigns].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
    : [];

  // Filtrar campañas por estado
  const filteredCampaignsByStatus = sortedCampaigns.filter((c) => {
    if (campaignsStatusFilter === "ALL") return true;
    if (!c.endDate) return campaignsStatusFilter === "ACTIVE";
    const endDate = new Date(c.endDate * 1000);
    const now = new Date();
    if (campaignsStatusFilter === "ACTIVE") return endDate >= now;
    if (campaignsStatusFilter === "FINISHED") return endDate < now;
    return true;
  });

  // Predios sin campaña
  const filteredProperties = properties.filter(
    (property) => property.campaign === null
  );

  // Estados y lógica para paginación y filtros en ambas tablas
  // --- Estados para Mis campañas ---
  const [campaignsCurrentPage, setCampaignsCurrentPage] = useState(1);
  const [campaignsRowsPerPage, setCampaignsRowsPerPage] = useState(10);
  const [campaignsFilterStatus, setCampaignsFilterStatus] = useState("ALL");
  const filteredCampaigns =
    campaignsFilterStatus === "ALL"
      ? filteredCampaignsByStatus
      : filteredCampaignsByStatus.filter(
          (c) => c.status === campaignsFilterStatus
        );
  const campaignsTotalRows = filteredCampaigns.length;
  const campaignsTotalPages =
    Math.ceil(campaignsTotalRows / campaignsRowsPerPage) || 1;
  const paginatedCampaigns = filteredCampaigns.slice(
    (campaignsCurrentPage - 1) * campaignsRowsPerPage,
    campaignsCurrentPage * campaignsRowsPerPage
  );
  useEffect(() => {
    setCampaignsCurrentPage(1);
  }, [campaignsFilterStatus, campaignsRowsPerPage]);

  // --- Estados para Predios sin campaña ---
  const [propertiesCurrentPage, setPropertiesCurrentPage] = useState(1);
  const [propertiesRowsPerPage, setPropertiesRowsPerPage] = useState(10);
  const [propertiesFilterStatus, setPropertiesFilterStatus] = useState("ALL");
  const propertiesFilterOptions = [
    {
      key: "ALL",
      label: "Todos",
      color: "bg-gray-200 text-gray-700 border border-gray-400",
    },
    ...Object.keys(stateMapper).map((key) => ({
      key,
      label: stateMapper[key].label,
      color: stateMapper[key].badge,
    })),
  ];
  const filteredPropertiesByStatus =
    propertiesFilterStatus === "ALL"
      ? filteredProperties
      : filteredProperties.filter((p) => p.status === propertiesFilterStatus);
  const propertiesTotalRows = filteredPropertiesByStatus.length;
  const propertiesTotalPages =
    Math.ceil(propertiesTotalRows / propertiesRowsPerPage) || 1;
  const paginatedProperties = filteredPropertiesByStatus.slice(
    (propertiesCurrentPage - 1) * propertiesRowsPerPage,
    propertiesCurrentPage * propertiesRowsPerPage
  );
  useEffect(() => {
    setPropertiesCurrentPage(1);
  }, [propertiesFilterStatus, propertiesRowsPerPage]);

  // Estado para filas expandidas
  const [expandedRows, setExpandedRows] = useState(new Set());
  const handleToggleExpand = (campaignId) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(campaignId)) {
        newSet.delete(campaignId);
      } else {
        newSet.add(campaignId);
      }
      return newSet;
    });
  };

  const handleAssignCampaign = async (campaignId) => {
    const selectedCampaign = userCampaigns.find(
      (campaign) => campaign.id === campaignId
    );
    if (!selectedCampaign) {
      toast.error("No se encontró la campaña seleccionada.");
      return;
    }

    const productID = selectedCampaign.products?.items?.[0]?.id || null;
    if (!productID) {
      toast.error("No se encontró un producto asociado a la campaña.");
      return;
    }

    if (!productID) {
      toast.error("No se encontró un producto asociado a la campaña.");
      return;
    }

    if (!selectedProperty) {
      toast.error("No se ha seleccionado ningún predio.");
      return;
    }

    if (selectedProperty.status !== "SELECTABLE") {
      toast.error("El predio aún no es elegible.");
      return;
    }

    try {
      await API.graphql(
        graphqlOperation(updateProperty, {
          input: {
            id: selectedProperty.id,
            campaignID: campaignId,
            productID: productID,
          },
        })
      );

      const notificationData = {
        userOriginID: user.id, // Usuario que asigna la campaña
        userID: selectedProperty.userID, // Dueño del predio
        message: `Tu predio ha sido asignado a la campaña: ${selectedCampaign.name}`,
        type: "CAMPAING",
        resourceID: campaignId, // ID de la campaña
        isRead: false,
      };
      await API.graphql(
        graphqlOperation(createNotification, { input: notificationData })
      );

      toast.success(`Predio asignado a campaña exitosamente`);
      fetchProperties();
    } catch (error) {
      toast.error("Error al actualizar el estado del predio");
    }
    console.log(
      "Asignar a campaña predio:",
      selectedProperty.id,
      "con ID de campaña:",
      campaignId
    );
    // Aquí puedes agregar la lógica para asignar la propiedad a la campaña
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-lime-50 pt-16">
      <Row>
        <NewHeaderNavbar />
      </Row>
      {/* Barra de navegación tipo tabs */}
      <div className="w-full max-w-7xl mx-auto flex justify-center mt-8">
        <div className="flex gap-2 bg-white rounded-xl shadow border p-1">
          <button
            className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              activeTab === "campaigns"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-blue-50"
            }`}
            onClick={() => setActiveTab("campaigns")}
            aria-label="Ver mis campañas"
          >
            <FaList className="inline mr-2" /> Mis campañas
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              activeTab === "properties"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-blue-50"
            }`}
            onClick={() => setActiveTab("properties")}
            aria-label="Ver predios sin campaña"
          >
            <FaPlus className="inline mr-2" /> Predios sin campaña
          </button>
        </div>
      </div>
      <div className="flex justify-center px-2 md:px-0">
        <div className="w-full max-w-7xl mt-8 mb-8 bg-white rounded-2xl shadow-2xl md:p-8">
          {/* Sección Mis campañas */}
          {activeTab === "campaigns" && (
            <section className="mx-auto p-2">
              <div className="mb-4">
                <h1
  className="text-2xl font-bold text-left flex-shrink-0"
  style={{ color: '#74742c' }}
>
  Mis campañas
</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Aquí puedes ver y gestionar todas las campañas en las que
                  participas como consultor.
                </p>
              </div>
              {/* Filtros de estado de campaña */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4 mb-2">
                <div className="flex flex-col gap-2 md:flex-row md:gap-2 md:justify-start w-full">
                  {campaignsStatusFilterOptions.map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      className={`flex items-center px-3 py-1 rounded-lg border text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        campaignsStatusFilter === option.key
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                      }`}
                      aria-label={`Filtrar campañas por estado: ${option.label}`}
                      onClick={() => setCampaignsStatusFilter(option.key)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-t-lg shadow-xl border border-gray-100">
                <div className="flex flex-col rounded-t-lg gap-2 md:flex-row md:items-center md:justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <span className="text-sm font-medium text-gray-700">
                      Filas por página:
                    </span>
                    <select
                      value={campaignsRowsPerPage}
                      onChange={(e) =>
                        setCampaignsRowsPerPage(Number(e.target.value))
                      }
                      className="border border-gray-200 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                      {[10, 20, 30, 50].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                    <button
                      className="px-3 py-1 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-50 hover:bg-gray-100 transition-all duration-200 disabled:hover:bg-transparent"
                      onClick={() =>
                        setCampaignsCurrentPage((p) => Math.max(1, p - 1))
                      }
                      disabled={campaignsCurrentPage === 1}
                    >
                      Anterior
                    </button>
                    <span className="text-sm font-medium text-gray-700 px-3 py-1 bg-white rounded-lg border border-gray-200">
                      Página {campaignsCurrentPage} de {campaignsTotalPages}
                    </span>
                    <button
                      className="px-3 py-1 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-50 hover:bg-gray-100 transition-all duration-200 disabled:hover:bg-transparent"
                      onClick={() =>
                        setCampaignsCurrentPage((p) =>
                          Math.min(campaignsTotalPages, p + 1)
                        )
                      }
                      disabled={campaignsCurrentPage === campaignsTotalPages}
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
                {isLoadingCampaigns ? (
                  <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg border border-gray-200">
                    <svg
                      className="animate-spin h-16 w-16 text-blue-500 mb-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      role="status"
                      aria-label="Cargando campañas"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    <p className="text-gray-500 text-lg font-medium">
                      Cargando campañas...
                    </p>
                  </div>
                ) : Array.isArray(userCampaigns) &&
                  userCampaigns.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-lg shadow-lg border border-gray-200">
                    <img
                      src={vacio}
                      className="w-32 h-32 mb-6 opacity-60"
                      alt="Sin campañas"
                    />
                    <p className="text-gray-500 text-lg font-medium">
                      No tienes campañas aún.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto bg-white flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 rounded-t-lg">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                          <th className="text-left px-2 py-1 font-semibold text-xs w-8"></th>
                          <th className="text-left px-2 py-1 font-semibold text-xs">
                            Nombre
                          </th>
                          <th className="text-left px-2 py-1 font-semibold text-xs">
                            Descripción
                          </th>
                          <th className="text-left px-2 py-1 font-semibold text-xs">
                            Fecha de inicio
                          </th>
                          <th className="text-left px-2 py-1 font-semibold text-xs">
                            Fecha de finalización
                          </th>
                          <th className="text-left px-2 py-1 font-semibold text-xs">
                            Estado
                          </th>
                          <th className="text-left px-2 py-1 font-semibold text-xs">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedCampaigns.map((campaign, idx) => {
                          let campaignImage = null;
                          try {
                            const imagesArr = campaign.images
                              ? JSON.parse(campaign.images)
                              : [];
                            if (
                              Array.isArray(imagesArr) &&
                              imagesArr.length > 0
                            ) {
                              campaignImage = imagesArr[0];
                            }
                          } catch (e) {}
                          const isExpanded = expandedRows.has(campaign.id);
                          // Calcular estado de la campaña
                          let campaignStatusLabel = "En curso";
                          let campaignStatusColor =
                            "bg-green-100 text-green-700 border border-green-400";
                          let campaignStatusTooltip =
                            "La campaña sigue activa.";
                          if (campaign.endDate) {
                            const endDate = new Date(campaign.endDate * 1000);
                            const now = new Date();
                            if (endDate < now) {
                              campaignStatusLabel = "Finalizada";
                              campaignStatusColor =
                                "bg-gray-200 text-gray-600 border border-gray-400";
                              campaignStatusTooltip =
                                "La campaña ya ha finalizado.";
                            }
                          }
                          // Filtrar predios asociados a esta campaña
                          const campaignProperties = properties.filter(
                            (property) => property.campaignID === campaign.id
                          );
                          return (
                            <React.Fragment key={campaign.id}>
                              <tr
                                className={`text-xs transition-all duration-200 border-b border-gray-100 hover:bg-blue-100 ${
                                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                                }`}
                              >
                                <td className="px-2 py-1 w-8">
                                  <button
                                    onClick={() =>
                                      handleToggleExpand(campaign.id)
                                    }
                                    aria-label={
                                      isExpanded
                                        ? "Colapsar predios"
                                        : "Expandir predios"
                                    }
                                    className="flex items-center justify-center w-7 h-7 rounded-full border border-gray-300 bg-white hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                    tabIndex={0}
                                    type="button"
                                  >
                                    {isExpanded ? (
                                      <FaMinus size={13} />
                                    ) : (
                                      <FaPlus size={13} />
                                    )}
                                  </button>
                                </td>
                                <td className="px-2 py-1 min-w-36">
                                  {campaign.name.toUpperCase()}
                                </td>
                                <td
                                  className="px-2 py-1 max-w-xs truncate"
                                  data-tooltip-id={`tooltip-campaign-description-${campaign.id}`}
                                  data-tooltip-content={
                                    campaign.description || "Sin descripción"
                                  }
                                >
                                  {campaign.description || "Sin descripción"}
                                  <div className="hidden md:block">
                                    <ReactTooltip
                                      id={`tooltip-campaign-description-${campaign.id}`}
                                      place="top"
                                      effect="solid"
                                      style={{
                                        maxWidth: 300,
                                        whiteSpace: "pre-line",
                                        wordBreak: "break-word",
                                      }}
                                    />
                                  </div>
                                </td>
                                <td className="px-2 py-1 min-w-28">
                                  {campaign.createdAt
                                    ? new Date(
                                        campaign.createdAt
                                      ).toLocaleDateString("es-ES", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                      })
                                    : "-"}
                                </td>
                                <td className="px-2 py-1 min-w-28">
                                  {campaign.endDate
                                    ? (() => {
                                        const endDate = new Date(
                                          campaign.endDate * 1000
                                        );
                                        const now = new Date();
                                        const diffTime =
                                          endDate.getTime() - now.getTime();
                                        const diffDays = Math.ceil(
                                          diffTime / (1000 * 60 * 60 * 24)
                                        );
                                        const showWarning =
                                          diffDays <= 5 && diffDays >= 0;
                                        return (
                                          <span className="flex items-center gap-1">
                                            {endDate.toLocaleDateString(
                                              "es-ES",
                                              {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                              }
                                            )}
                                            {showWarning && (
                                              <span
                                                className="ml-2 text-yellow-500 cursor-pointer"
                                                data-tooltip-id={`tooltip-enddate-warning-${campaign.id}`}
                                                data-tooltip-content="¡Atención! Esta campaña está próxima a finalizar (menos de 5 días)."
                                                tabIndex={0}
                                                aria-label="Advertencia: campaña próxima a finalizar"
                                              >
                                                <FaInfoCircle
                                                  className="inline"
                                                  size={15}
                                                />
                                                <ReactTooltip
                                                  id={`tooltip-enddate-warning-${campaign.id}`}
                                                  place="top"
                                                  effect="solid"
                                                />
                                              </span>
                                            )}
                                          </span>
                                        );
                                      })()
                                    : "-"}
                                </td>
                                <td className="px-2 py-1 min-w-24">
                                  <span
                                    className={`inline-block px-1 py-0 rounded text-[10px] font-semibold whitespace-nowrap uppercase ${campaignStatusColor}`}
                                    data-tooltip-id={`tooltip-campaign-status-${campaign.id}`}
                                    data-tooltip-content={campaignStatusTooltip}
                                  >
                                    {campaignStatusLabel}
                                  </span>
                                  <ReactTooltip
                                    id={`tooltip-campaign-status-${campaign.id}`}
                                    place="top"
                                    effect="solid"
                                  />
                                </td>
                                <td className="px-2 py-1 flex gap-2">
                                  <button
                                    onClick={() =>
                                      window.open(
                                        `/campaign/${campaign.id}`,
                                        "_blank"
                                      )
                                    }
                                    className="border border-yellow-500 bg-yellow-500 text-white rounded-lg p-1 text-xs hover:bg-yellow-600 hover:shadow-md active:bg-yellow-700 transition-all duration-200 flex items-center justify-center w-7 h-7 transform hover:scale-105"
                                    aria-label="Ver campaña"
                                    data-tooltip-id={`tooltip-campaign-link-${campaign.id}`}
                                    data-tooltip-content="Ver campaña"
                                    tabIndex={0}
                                    type="button"
                                  >
                                    <FaList size={13} />
                                  </button>
                                  <ReactTooltip
                                    id={`tooltip-campaign-link-${campaign.id}`}
                                    place="top"
                                    effect="solid"
                                  />
                                  <button
                                    onClick={() =>
                                      campaign.products?.items?.[0]?.id &&
                                      window.open(
                                        `/project/${campaign.products.items[0].id}`,
                                        "_blank"
                                      )
                                    }
                                    className={`border border-blue-500 bg-blue-500 text-white rounded-lg p-1 text-xs hover:bg-blue-600 hover:shadow-md active:bg-blue-700 transition-all duration-200 flex items-center justify-center w-7 h-7 transform hover:scale-105 ${
                                      !campaign.products?.items?.[0]?.id
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                    }`}
                                    aria-label="Ver proyecto"
                                    data-tooltip-id={`tooltip-project-${campaign.id}`}
                                    data-tooltip-content="Ver proyecto"
                                    tabIndex={
                                      campaign.products?.items?.[0]?.id ? 0 : -1
                                    }
                                    type="button"
                                    disabled={
                                      !campaign.products?.items?.[0]?.id
                                    }
                                  >
                                    <FaEye size={13} />
                                  </button>
                                  <ReactTooltip
                                    id={`tooltip-project-${campaign.id}`}
                                    place="top"
                                    effect="solid"
                                  />
                                </td>
                              </tr>
                              {isExpanded &&
                                (campaignProperties.length > 0 ? (
                                  campaignProperties.map((property) => (
                                    <tr
                                      key={property.id}
                                      className="bg-gray-50 border-b border-gray-200"
                                    >
                                      <td></td>
                                      <td
                                        colSpan={5}
                                        className="pl-8 py-2 align-middle"
                                      >
                                        <div className="flex items-center gap-4">
                                          <span className="font-semibold text-gray-700 text-xs">
                                            {property.name
                                              ? property.name.toUpperCase()
                                              : "Predio sin nombre"}
                                          </span>
                                          <span
                                            className={`inline-block px-1 py-0 rounded text-[10px] font-semibold whitespace-nowrap uppercase ${
                                              stateMapper[property.status]
                                                ?.badge ||
                                              "bg-gray-300 text-gray-800 border border-gray-400"
                                            }`}
                                            data-tooltip-id={`tooltip-property-status-${property.id}`}
                                            data-tooltip-content={
                                              stateMapper[property.status]
                                                ?.tooltip || "Estado indefinido"
                                            }
                                          >
                                            {stateMapper[property.status]
                                              ?.label || "SIN DEFINIR"}
                                          </span>
                                          <ReactTooltip
                                            id={`tooltip-property-status-${property.id}`}
                                            place="top"
                                            effect="solid"
                                          />
                                          <span className="text-xs text-gray-500">
                                            {property.createdAt
                                              ? new Date(
                                                  property.createdAt
                                                ).toLocaleDateString("es-ES", {
                                                  year: "numeric",
                                                  month: "2-digit",
                                                  day: "2-digit",
                                                })
                                              : "-"}
                                          </span>
                                        </div>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr className="bg-gray-50 border-b border-gray-200">
                                    <td></td>
                                    <td
                                      colSpan={5}
                                      className="pl-8 py-2 align-middle text-xs text-gray-500 italic"
                                    >
                                      Sin predios asignados
                                    </td>
                                  </tr>
                                ))}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Sección Predios sin campaña */}
          {activeTab === "properties" && (
            <section className="mx-auto p-2">
              <div className="mb-4">
                <h1 className="text-2xl font-bold text-left text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex-shrink-0">
                  Predios sin campaña
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Aquí puedes ver y gestionar todos los predios que aún no han
                  sido asignados a una campaña.
                </p>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4 mb-2">
                <div className="flex flex-col gap-2 md:flex-row md:gap-2 md:justify-start w-full">
                  {propertiesFilterOptions.map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      className={`flex items-center px-3 py-1 rounded-lg border text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        propertiesFilterStatus === option.key
                          ? "bg-blue-600 text-white border-blue-600"
                          : option.color + " hover:bg-blue-50"
                      }`}
                      aria-label={`Filtrar por estado: ${option.label}`}
                      onClick={() => setPropertiesFilterStatus(option.key)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-t-lg shadow-xl border border-gray-100 flex flex-col">
                <div className="flex flex-col rounded-t-lg gap-2 md:flex-row md:items-center md:justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <span className="text-sm font-medium text-gray-700">
                      Filas por página:
                    </span>
                    <select
                      value={propertiesRowsPerPage}
                      onChange={(e) =>
                        setPropertiesRowsPerPage(Number(e.target.value))
                      }
                      className="border border-gray-200 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                      {[10, 20, 30, 50].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                    <button
                      className="px-3 py-1 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-50 hover:bg-gray-100 transition-all duration-200 disabled:hover:bg-transparent"
                      onClick={() =>
                        setPropertiesCurrentPage((p) => Math.max(1, p - 1))
                      }
                      disabled={propertiesCurrentPage === 1}
                    >
                      Anterior
                    </button>
                    <span className="text-sm font-medium text-gray-700 px-3 py-1 bg-white rounded-lg border border-gray-200">
                      Página {propertiesCurrentPage} de {propertiesTotalPages}
                    </span>
                    <button
                      className="px-3 py-1 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-50 hover:bg-gray-100 transition-all duration-200 disabled:hover:bg-transparent"
                      onClick={() =>
                        setPropertiesCurrentPage((p) =>
                          Math.min(propertiesTotalPages, p + 1)
                        )
                      }
                      disabled={propertiesCurrentPage === propertiesTotalPages}
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg border border-gray-200">
                    <svg
                      className="animate-spin h-16 w-16 text-blue-500 mb-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      role="status"
                      aria-label="Cargando predios"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    <p className="text-gray-500 text-lg font-medium">
                      Cargando predios...
                    </p>
                  </div>
                ) : filteredProperties.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-lg shadow-lg border border-gray-200">
                    <img
                      src={vacio}
                      className="w-32 h-32 mb-6 opacity-60"
                      alt="Sin propiedades"
                    />
                    <p className="text-gray-500 text-lg font-medium">
                      No hay propiedades disponibles.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto bg-white flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                          <th className="text-left px-2 py-1 font-semibold text-xs">
                            Nombre
                          </th>
                          <th className="text-left px-2 py-1 font-semibold text-xs">
                            Descripción
                          </th>
                          <th className="text-left px-2 py-1 font-semibold text-xs">
                            Área
                          </th>
                          <th className="text-left px-2 py-1 font-semibold text-xs">
                            Departamento
                          </th>
                          <th className="text-left px-2 py-1 font-semibold text-xs">
                            Estado
                          </th>
                          <th className="text-left px-2 py-1 font-semibold text-xs">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedProperties.map((property, idx) => (
                          <tr
                            key={property.id}
                            className={`text-xs transition-all duration-200 border-b border-gray-100 hover:bg-blue-100 ${
                              idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }`}
                          >
                            <td className="px-2 py-1 min-w-36">
                              {property.name.toUpperCase()}
                            </td>
                            <td
                              className="px-2 py-1 max-w-xs truncate"
                              data-tooltip-id={`tooltip-property-description-${property.id}`}
                              data-tooltip-content={
                                property.description || "Sin descripción"
                              }
                            >
                              {property.description || "Sin descripción"}
                              <div className="hidden md:block">
                                <ReactTooltip
                                  id={`tooltip-property-description-${property.id}`}
                                  place="top"
                                  effect="solid"
                                  style={{
                                    maxWidth: 300,
                                    whiteSpace: "pre-line",
                                    wordBreak: "break-word",
                                  }}
                                />
                              </div>
                            </td>
                            <td className="px-2 py-1 min-w-20">
                              {getPropertyArea(property) || "No disponible"}
                            </td>
                            <td className="px-2 py-1">
                              {property.department || "-"}
                            </td>
                            <td className="px-2 py-1">
                              <span
                                className={`inline-block px-1 py-0 rounded text-[10px] font-semibold whitespace-nowrap uppercase ${
                                  stateMapper[property.status]?.badge ||
                                  "bg-gray-300 text-gray-800 border border-gray-400"
                                }`}
                                data-tooltip-id={`tooltip-status-${property.id}`}
                                data-tooltip-content={
                                  stateMapper[property.status]?.tooltip ||
                                  "Estado indefinido"
                                }
                              >
                                {stateMapper[property.status]?.label ||
                                  "SIN DEFINIR"}
                              </span>
                              <div className="hidden md:block">
                                <ReactTooltip
                                  id={`tooltip-status-${property.id}`}
                                  place="top"
                                  effect="solid"
                                />
                              </div>
                            </td>
                            <td className="px-2 py-1 flex gap-2">
                              <button
                                onClick={() =>
                                  window.open(
                                    `/property/${property.id}`,
                                    "_blank"
                                  )
                                }
                                className="border border-blue-500 bg-blue-500 text-white rounded-lg p-1 text-xs hover:bg-blue-600 hover:shadow-md active:bg-blue-700 transition-all duration-200 flex items-center justify-center w-7 h-7 transform hover:scale-105"
                                aria-label="Ver detalles del predio"
                                data-tooltip-id={`tooltip-details-${property.id}`}
                                data-tooltip-content="Ver detalles del predio"
                                tabIndex={0}
                                type="button"
                              >
                                <FaEye size={13} />
                              </button>
                              <ReactTooltip
                                id={`tooltip-details-${property.id}`}
                                place="top"
                                effect="solid"
                              />
                              <button
                                className="inline-block bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600 transition"
                                onClick={() => {
                                  setSelectedProperty(property);
                                  setIsModalOpen(true);
                                }}
                                aria-label="Asignar"
                                data-tooltip-id={`tooltip-assign-${property.id}`}
                                data-tooltip-content="Asignar a campaña"
                                tabIndex={0}
                                type="button"
                              >
                                Asignar
                              </button>
                              <div className="hidden md:block">
                                <ReactTooltip
                                  id={`tooltip-assign-${property.id}`}
                                  place="top"
                                  effect="solid"
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
      <CampaignAssignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        campaigns={userCampaigns}
        onAssign={handleAssignCampaign}
      />
      <ToastContainer />
    </div>
  );
}
