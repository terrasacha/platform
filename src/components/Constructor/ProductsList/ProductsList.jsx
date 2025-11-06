import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserProperties from "hooks/useUserProperties";
import vacio from "../../views/_images/caja-vacia-gris.png";
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

// Componente para mostrar el listado de predios
export default function ProductsList() {
  const navigate = useNavigate();
  const { userProperties, isLoading } = useUserProperties();
  const sortedProperties = [...userProperties].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Estados para paginación y búsqueda
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Colores de estado y labels - Aplicando paleta Terrasacha
  const stateMapper = {
    PENDING: {
      label: "Pendiente",
      badge:
        "bg-terrasacha-earth text-terrasacha-secondary1 border border-terrasacha-earth",
      tooltip: "Pendiente: El predio está pendiente de revisión.",
      icon: <FaClock className="inline mr-1" />,
    },
    APPROVED: {
      label: "Aprobado",
      badge:
        "bg-terrasacha-secondary2 text-white border border-terrasacha-secondary2",
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
      badge:
        "bg-terrasacha-light text-terrasacha-secondary1 border border-terrasacha-light",
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
    <section className="mx-auto">
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
          <div className="flex items-baseline gap-2">
            <h1 className="text-2xl font-typographica font-bold text-left flex-shrink-0 text-terrasacha-primary">
              Mis predios
            </h1>
          </div>
          <p className="text-sm text-terrasacha-secondary1 mt-1 font-typographica">
            Aquí puedes ver, filtrar y gestionar todos los predios que has
            registrado en la plataforma.
          </p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4 mb-2">
        <div className="flex flex-col gap-2 md:flex-row md:gap-2 md:justify-start w-full">
          {filterOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              className={`flex items-center px-3 py-1 rounded-lg border text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-terrasacha-primary ${
                filterStatus === option.key
                  ? "bg-terrasacha-primary text-white border-terrasacha-primary shadow-terrasacha"
                  : "bg-white text-terrasacha-secondary1 border-terrasacha-light hover:bg-gray-50 hover:border-terrasacha-primary"
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
      <div className="bg-white rounded-t-lg rounded-b-lg shadow-lg border border-terrasacha-light flex flex-col">
        {/* Buscador y paginación */}
        <div className="flex flex-col rounded-t-lg gap-2 md:flex-row md:items-center md:justify-between px-3 py-2 bg-white border-b border-terrasacha-light">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <label
              htmlFor="searchInput"
              className="text-sm font-medium text-terrasacha-secondary1 font-typographica"
            >
              Buscar predio:
            </label>
            <input
              id="searchInput"
              type="text"
              placeholder="Nombre del predio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-terrasacha-light rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-terrasacha-primary focus:border-terrasacha-primary transition-all duration-200 hover:border-terrasacha-primary flex-1 min-w-0 font-typographica"
            />
          </div>
          <div className="flex flex-col gap-2 w-full md:w-auto md:flex-row md:gap-4 md:justify-end">
            <div className="flex items-center gap-2 w-full md:w-auto md:order-1">
              <span className="text-sm font-medium text-terrasacha-secondary1 font-typographica">
                Filas por página:
              </span>
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="border border-terrasacha-light rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-terrasacha-primary focus:border-terrasacha-primary transition-all duration-200 font-typographica"
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
                className="px-3 py-1 rounded-lg border border-terrasacha-light text-sm font-medium disabled:opacity-50 hover:bg-gray-50 transition-all duration-200 disabled:hover:bg-transparent text-terrasacha-secondary1 font-typographica"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              <span className="text-sm font-medium text-terrasacha-secondary1 px-3 py-1 bg-white rounded-lg border border-terrasacha-light font-typographica">
                Página {currentPage} de {totalPages}
              </span>
              <button
                className="px-3 py-1 rounded-lg border border-terrasacha-light text-sm font-medium disabled:opacity-50 hover:bg-gray-50 transition-all duration-200 disabled:hover:bg-transparent text-terrasacha-secondary1 font-typographica"
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
          <div className="flex flex-col items-center justify-center py-16 bg-white shadow-lg border border-terrasacha-light">
            <svg
              className="animate-spin h-16 w-16 text-terrasacha-primary mb-6"
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
            <p className="text-terrasacha-secondary1 text-lg font-medium font-typographica">
              Cargando predios...
            </p>
          </div>
        ) : sortedProperties.length === 0 ? (
          <div className="flex rounded-b-lg flex-col items-center justify-center py-16 bg-gradient-to-br from-terrasacha-earth to-terrasacha-light shadow-terrasacha-lg border border-terrasacha-light">
            <img
              src={vacio}
              className="w-32 h-32 mb-6 opacity-60"
              alt="Sin predios"
            />
            <p className="text-terrasacha-secondary1 text-lg font-medium font-typographica">
              No tienes predios postulados.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-terrasacha-light scrollbar-track-terrasacha-earth">
            <table className="min-w-full">
              <thead>
                <tr className="bg-white border-b border-terrasacha-light">
                  <th className="text-left px-2 py-1 font-semibold text-xs text-terrasacha-secondary1 font-typographica"></th>
                  <th className="text-left px-2 py-1 font-semibold text-xs text-terrasacha-secondary1 font-typographica">
                    Predio
                  </th>
                  <th className="text-left px-2 py-1 font-semibold text-xs text-terrasacha-secondary1 font-typographica">
                    Descripción
                  </th>
                  <th className="text-left px-2 py-1 font-semibold text-xs text-terrasacha-secondary1 font-typographica">
                    Campaña
                  </th>
                  <th className="text-left px-2 py-1 font-semibold text-xs text-terrasacha-secondary1 font-typographica">
                    Fecha de inscripción
                  </th>
                  <th className="text-left px-2 py-1 font-semibold text-xs text-terrasacha-secondary1 font-typographica">
                    Departamento
                  </th>
                  <th className="text-left px-2 py-1 font-semibold text-xs text-terrasacha-secondary1 font-typographica">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedProperties.map((property, idx) => (
                  <tr
                    key={property.id}
                    className={`text-xs transition-all duration-200 uppercase border-b border-terrasacha-light hover:bg-gray-50 ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-3 py-2">
                      <button
                        onClick={() => navigate(`/property/${property.id}`)}
                        className="border border-terrasacha-primary bg-terrasacha-primary text-white rounded-lg p-1 text-xs hover:bg-terrasacha-secondary1 hover:shadow-terrasacha active:bg-terrasacha-secondary1 transition-all duration-200 flex items-center justify-center w-7 h-7 transform hover:scale-105"
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
                    <td className="px-2 py-1 min-w-36 text-terrasacha-secondary1 font-typographica">
                      {property.name}
                    </td>
                    <td className="px-2 py-1 max-w-xs truncate text-terrasacha-secondary1 font-typographica">
                      {property.description || "Sin descripción"}
                    </td>
                    <td className="px-2 py-1 min-w-36">
                      {property.campaign?.name ? (
                        (() => {
                          let campaignImage = null;
                          try {
                            const imagesArr = property.campaign.images
                              ? JSON.parse(property.campaign.images)
                              : [];
                            if (
                              Array.isArray(imagesArr) &&
                              imagesArr.length > 0
                            ) {
                              campaignImage = imagesArr[0];
                            }
                          } catch (e) {}
                          return (
                            <>
                              <span
                                className="inline-block px-1 py-0 rounded text-[10px] font-semibold whitespace-nowrap uppercase bg-terrasacha-light text-terrasacha-secondary1 border border-terrasacha-light cursor-pointer hover:bg-terrasacha-secondary2 hover:text-white transition"
                                data-tooltip-id={`tooltip-campaign-${property.id}`}
                                aria-label={`Información de la campaña: ${property.campaign.name}`}
                                as="a"
                              >
                                <a
                                  href={`/campaign/${property.campaign.id}`}
                                  tabIndex={0}
                                  className="outline-none focus:ring-2 focus:ring-terrasacha-primary rounded"
                                  onClick={(e) => e.stopPropagation()}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                      navigate(`/campaign/${property.campaign.id}`);
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
                                        className="w-32 h-20 object-cover rounded mb-2 border border-terrasacha-light shadow-terrasacha"
                                      />
                                    )}
                                    <div className="text-xs text-left">
                                      <div className="font-bold mb-1">
                                        {property.campaign.name}
                                      </div>
                                      {property.campaign.description && (
                                        <div className="mb-1">
                                          {property.campaign.description}
                                        </div>
                                      )}
                                      <div className="text-terrasacha-secondary1">
                                        Fecha:{" "}
                                        {property.campaign.endDate
                                          ? new Date(
                                              property.campaign.endDate * 1000
                                            ).toLocaleDateString("es-ES", {
                                              year: "numeric",
                                              month: "2-digit",
                                              day: "2-digit",
                                            })
                                          : "-"}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              />
                            </>
                          );
                        })()
                      ) : (
                        <span className="inline-block px-1 py-0 rounded text-[10px] font-semibold whitespace-nowrap uppercase bg-gray-200 text-gray-700 border border-gray-400">
                          SIN ASIGNAR
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-1 min-w-28 text-terrasacha-secondary1 font-typographica">
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
                    <td className="px-2 py-1 text-terrasacha-secondary1 font-typographica">
                      {property.department || "-"}
                    </td>
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
    </section>
  );
}
