import React, { useState } from "react";
import useUserProperties from "hooks/useUserProperties";
import vacio from "../../views/_images/caja-vacia-gris.png";
import ModalNewProperty from "../Campaign/ModalNewProperty";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import {
  FaList,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaCheck,
  FaBan,
  FaEye,
} from "react-icons/fa";

// Mantengo solo la lógica de paginación, filtros, tabla, banner, modal y tooltips
export default function ProductsList() {
  const { userProperties, isLoading } = useUserProperties();
  const sortedProperties = [...userProperties].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  console.log('userProperties', userProperties)
  const [showModal, setShowModal] = useState(false);

  // Estados para paginación y búsqueda
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Colores de estado y labels
  const stateMapper = {
    PENDING: {
      label: "Pendiente",
      badge: "bg-yellow-100 text-yellow-700 border border-yellow-400",
      tooltip: "Pendiente: El predio está pendiente de revisión.",
      icon: <FaClock className="inline mr-1" />,
    },
    APPROVED: {
      label: "Aprobado",
      badge: "bg-green-100 text-green-700 border border-green-400",
      tooltip: "Aprobado: El predio ha sido aprobado.",
      icon: <FaCheckCircle className="inline mr-1" />,
    },
    REJECTED: {
      label: "Rechazado",
      badge: "bg-red-100 text-red-700 border border-red-400",
      tooltip: "Rechazado: El predio no cumple los requisitos.",
      icon: <FaTimesCircle className="inline mr-1" />,
    },
    SELECTABLE: {
      label: "Seleccionable",
      badge: "bg-blue-100 text-blue-700 border border-blue-400",
      tooltip:
        "Seleccionable: El predio es elegible para continuar el proceso.",
      icon: <FaCheck className="inline mr-1" />,
    },
    NOT_SELECTABLE: {
      label: "No elegible",
      badge: "bg-red-100 text-red-700 border border-red-400",
      tooltip:
        "No elegible: El predio no es elegible para continuar el proceso.",
      icon: <FaBan className="inline mr-1" />,
    },
  };

  const filterOptions = [
    { key: "ALL", label: "Todos", icon: <FaList className="inline mr-1" /> },
    {
      key: "PENDING",
      label: stateMapper.PENDING.label,
      icon: stateMapper.PENDING.icon,
    },
    {
      key: "APPROVED",
      label: stateMapper.APPROVED.label,
      icon: stateMapper.APPROVED.icon,
    },
    {
      key: "REJECTED",
      label: stateMapper.REJECTED.label,
      icon: stateMapper.REJECTED.icon,
    },
    {
      key: "SELECTABLE",
      label: stateMapper.SELECTABLE.label,
      icon: stateMapper.SELECTABLE.icon,
    },
    {
      key: "NOT_SELECTABLE",
      label: stateMapper.NOT_SELECTABLE.label,
      icon: stateMapper.NOT_SELECTABLE.icon,
    },
  ];

  const [filterStatus, setFilterStatus] = useState("ALL");

  // Filtrar por estado
  const filteredProperties =
    filterStatus === "ALL"
      ? sortedProperties
      : sortedProperties.filter((property) => property.status === filterStatus);

  // Filtrar por nombre de predio (buscador)
  const searchFilteredProperties = filteredProperties.filter((property) =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const totalRows = searchFilteredProperties.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage) || 1;
  const paginatedProperties = searchFilteredProperties.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Resetear página si cambia el filtro, búsqueda o cantidad por página
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, rowsPerPage, filterStatus]);

  return (
    <section className="mx-auto p-2">
      {/* Banner */}
      <div className="bg-gray-100 rounded-3xl p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-left mb-10 md:mb-0 md:pr-12 relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
              Gestiona tus <span className="text-green-600">predios</span> para
              un futuro sostenible
            </h1>
            <p className="mt-4 text-gray-600 text-lg">
              Convierte tu predio en un activo ambiental, accede a beneficios y
              contribuye a la sostenibilidad gestionando toda la información y
              el estado de tus predios desde un solo lugar.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-8 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300"
            >
              Registrar predio
            </button>
          </div>
          {/* Decoracion */}
          <div className="md:w-1/2 relative flex justify-center items-center">
            <div className="relative w-[350px] h-[350px] md:w-[500px] md:h-[500px]">
              <div className="absolute -bottom-12 -right-16 w-60 h-60 pointer-events-none z-0">
                <svg
                  className="w-full h-full text-green-100 opacity-60"
                  fill="currentColor"
                  viewBox="0 0 200 200"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M47.7,-59.8C62.2,-51,74.7,-36.5,78.3,-19.9C81.9,-3.3,76.6,15.4,67.7,30.3C58.8,45.2,46.4,56.3,31.7,64.9C17,73.5,-0.1,79.5,-16,77.2C-31.9,74.9,-46.7,64.2,-58.5,51.3C-70.3,38.4,-79.1,23.3,-81.4,7.1C-83.7,-9.1,-79.5,-26.3,-69.5,-40.7C-59.5,-55.1,-43.7,-66.8,-28.1,-71.4C-12.5,-76,-0.6,-73.4,11.8,-69C24.1,-64.6,33.1,-68.5,47.7,-59.8Z"
                    fill="#A9D6B8"
                    transform="translate(100 100) scale(1.2)"
                  ></path>
                </svg>
              </div>
              <div className="absolute top-0 -left-40 w-52 h-52 pointer-events-none z-0">
                <svg
                  className="w-full h-full text-sky-100 opacity-70"
                  fill="currentColor"
                  viewBox="0 0 200 200"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M52.1,-63.3C66.8,-53.2,77.5,-36.8,79.8,-19.4C82.1,-2,76,16.4,66.1,32.1C56.2,47.8,42.5,60.8,26.5,68.8C10.5,76.8,-7.7,79.8,-25.5,75.4C-43.2,71,-60.5,59.2,-69.7,43.9C-78.9,28.6,-80.1,9.8,-75.9,-6.2C-71.7,-22.2,-62.1,-35.5,-50.3,-46.9C-38.5,-58.3,-24.5,-67.7,-8.7,-70.7C7,-73.7,27.5,-70.5,52.1,-63.3Z"
                    fill="#D1E5F0"
                    transform="translate(100 100) scale(1.1)"
                  ></path>
                </svg>
              </div>
              <div className="absolute top-0 right-20 w-32 h-32 pointer-events-none z-0">
                <svg
                  className="w-full h-full text-purple-100 opacity-50"
                  fill="currentColor"
                  viewBox="0 0 200 200"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M47.7,-59.8C62.2,-51,74.7,-36.5,78.3,-19.9C81.9,-3.3,76.6,15.4,67.7,30.3C58.8,45.2,46.4,56.3,31.7,64.9C17,73.5,-0.1,79.5,-16,77.2C-31.9,74.9,-46.7,64.2,-58.5,51.3C-70.3,38.4,-79.1,23.3,-81.4,7.1C-83.7,-9.1,-79.5,-26.3,-69.5,-40.7C-59.5,-55.1,-43.7,-66.8,-28.1,-71.4C-12.5,-76,-0.6,-73.4,11.8,-69C24.1,-64.6,33.1,-68.5,47.7,-59.8Z"
                    fill="#E9D5FF"
                    transform="translate(100 100) scale(1.1)"
                  ></path>
                </svg>
              </div>
              <div
                className="absolute inset-0 bg-cover bg-center rounded-xl shadow-xl"
                style={{
                  backgroundImage: "url('/hexagon_no_white_bg.png')",
                  clipPath:
                    "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                }}
              ></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-200 text-gray-800 px-6 py-3 rounded-full shadow-lg flex items-center z-10">
                <span className="font-semibold mr-2 text-lg">CO₂</span>
                <FaCheckCircle className="text-green-600 text-3xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Separador decorativo */}
      <hr className="my-10 border-t-2 border-dashed border-gray-300 w-full max-w-4xl mx-auto" />
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
         <h1
  className="text-2xl font-bold text-left flex-shrink-0"
  style={{ color: '#7b7b2c' }}
>
  Mis predios
</h1>

        </div>
        <p className="text-sm text-gray-600 mt-1">
          Aquí puedes ver, filtrar y gestionar todos los predios que has
          registrado en la plataforma.
        </p>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4 mb-2">
        <div className="flex flex-col gap-2 md:flex-row md:gap-2 md:justify-start w-full">
          {filterOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              className={`flex items-center px-3 py-1 rounded-lg border text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                filterStatus === option.key
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
              }`}
              aria-label={`Filtrar por estado: ${option.label}`}
              onClick={() => setFilterStatus(option.key)}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-t-lg shadow-xl border border-gray-100 flex flex-col">
        {/* Buscador y paginación */}
        <div className="flex flex-col rounded-t-lg gap-2 md:flex-row md:items-center md:justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <label
              htmlFor="searchInput"
              className="text-sm font-medium text-gray-700"
            >
              Buscar predio:
            </label>
            <input
              id="searchInput"
              type="text"
              placeholder="Nombre del predio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 flex-1 min-w-0"
            />
          </div>
          <div className="flex flex-col gap-2 w-full md:w-auto md:flex-row md:gap-4 md:justify-end">
            <div className="flex items-center gap-2 w-full md:w-auto md:order-1">
              <span className="text-sm font-medium text-gray-700">
                Filas por página:
              </span>
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="border border-gray-200 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                {[10, 20, 30, 50].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto md:order-2 justify-between md:justify-end">
              <button
                className="px-3 py-1 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-50 hover:bg-gray-100 transition-all duration-200 disabled:hover:bg-transparent"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              <span className="text-sm font-medium text-gray-700 px-3 py-1 bg-white rounded-lg border border-gray-200">
                Página {currentPage} de {totalPages}
              </span>
              <button
                className="px-3 py-1 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-50 hover:bg-gray-100 transition-all duration-200 disabled:hover:bg-transparent"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
        {/* Tabla de predios */}
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
        ) : sortedProperties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg border border-gray-200">
            <img
              src={vacio}
              className="w-32 h-32 mb-6 opacity-60"
              alt="Sin predios"
            />
            <p className="text-gray-500 text-lg font-medium">
              No tienes predios postulados.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="text-left px-2 py-1 font-semibold text-xs"></th>
                  <th className="text-left px-2 py-1 font-semibold text-xs">
                    Predio
                  </th>
                  <th className="text-left px-2 py-1 font-semibold text-xs">
                    Descripción
                  </th>
                  <th className="text-left px-2 py-1 font-semibold text-xs">
                    Campaña
                  </th>
                  <th className="text-left px-2 py-1 font-semibold text-xs">
                    Fecha de inscripción
                  </th>
                  <th className="text-left px-2 py-1 font-semibold text-xs">
                    Departamento
                  </th>
                  <th className="text-left px-2 py-1 font-semibold text-xs">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedProperties.map((property, idx) => (
                  <tr
                    key={property.id}
                    className={`text-xs transition-all duration-200 uppercase border-b border-gray-100 hover:bg-blue-200 ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-3 py-2">
                      <button
                        onClick={() => window.location.href = `/property/${property.id}`}
                        className="border border-blue-500 bg-blue-500 text-white rounded-lg p-1 text-xs hover:bg-blue-600 hover:shadow-md active:bg-blue-700 transition-all duration-200 flex items-center justify-center w-7 h-7 transform hover:scale-105"
                        aria-label="Ver detalles del predio"
                        data-tooltip-id={`tooltip-details-${property.id}`}
                        data-tooltip-content="Ver detalles del predio"
                      >
                        <FaEye size={13} />
                      </button>
                      <ReactTooltip
                        id={`tooltip-details-${property.id}`}
                        place="top"
                        effect="solid"
                      />
                    </td>
                    <td className="px-2 py-1 min-w-36">{property.name}</td>
                    <td className="px-2 py-1 max-w-xs truncate">
                      {property.description || "Sin descripción"}
                    </td>
                    <td className="px-2 py-1 min-w-36">
                      {property.campaign?.name ? (() => {
                        let campaignImage = null;
                        try {
                          const imagesArr = property.campaign.images ? JSON.parse(property.campaign.images) : [];
                          if (Array.isArray(imagesArr) && imagesArr.length > 0) {
                            campaignImage = imagesArr[0];
                          }
                        } catch (e) {}
                        return (
                          <>
                            <span
                              className="inline-block px-1 py-0 rounded text-[10px] font-semibold whitespace-nowrap uppercase bg-blue-100 text-blue-700 border border-blue-400 cursor-pointer hover:bg-blue-200 transition"
                              data-tooltip-id={`tooltip-campaign-${property.id}`}
                              aria-label={`Información de la campaña: ${property.campaign.name}`}
                              as="a"
                            >
                              <a
                                href={`/campaign/${property.campaign.id}`}
                                tabIndex={0}
                                className="outline-none focus:ring-2 focus:ring-blue-400 rounded"
                                onClick={e => e.stopPropagation()}
                                onKeyDown={e => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    window.location.href = `/campaign/${property.campaign.id}`;
                                  }
                                }}
                              >
                                {property.campaign.name}
                              </a>
                            </span>
                            <ReactTooltip
                              id={`tooltip-campaign-${property.id}`}
                              place="top"
                              effect="solid"
                              className="max-w-xs whitespace-pre-line"
                              clickable
                              render={() => (
                                <div className="flex flex-col items-center p-2 max-w-xs">
                                  {campaignImage && (
                                    <img
                                      src={campaignImage}
                                      alt="Imagen campaña"
                                      className="w-32 h-20 object-cover rounded mb-2 border border-gray-200 shadow"
                                    />
                                  )}
                                  <div className="text-xs text-left">
                                    <div className="font-bold mb-1">{property.campaign.name}</div>
                                    {property.campaign.description && (
                                      <div className="mb-1">{property.campaign.description}</div>
                                    )}
                                    <div className="text-gray-500">
                                      Fecha: {property.campaign.endDate ? new Date(property.campaign.endDate*1000).toLocaleDateString("es-ES", { year: "numeric", month: "2-digit", day: "2-digit" }) : "-"}
                                    </div>
                                  </div>
                                </div>
                              )}
                            />
                          </>
                        );
                      })() : (
                        <span className="inline-block px-1 py-0 rounded text-[10px] font-semibold whitespace-nowrap uppercase bg-gray-200 text-gray-700 border border-gray-400">
                          SIN ASIGNAR
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-1 min-w-28">
                      {property.createdAt
                        ? new Date(property.createdAt).toLocaleDateString(
                            "es-ES",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            }
                          )
                        : "-"}
                    </td>
                    <td className="px-2 py-1">{property.department || "-"}</td>
                    <td className="px-2 py-1 min-w-36">
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
                        {stateMapper[property.status]?.label || "SIN DEFINIR"}
                      </span>
                      <div className="hidden md:block">
                        <ReactTooltip
                          id={`tooltip-status-${property.id}`}
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
      {/* 📌 Modal para crear predios sin campaña */}
      <ModalNewProperty
        showModal={showModal}
        handleClose={() => setShowModal(false)}
        campaignId={null} // No pasamos campaña
        productId={null} // No pasamos producto
        fetchCampaign={() => {}}
      />
    </section>
  );
}
