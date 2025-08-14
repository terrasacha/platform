import useFetchPropertiesCampaign from "hooks/useFetchPropertiesCampaign";
import ModalAcceptProperty from "./ModalAcceptProperty";
import { useState, useEffect } from "react";
import { Spinner, DropdownButton, Dropdown } from "react-bootstrap";
import { updateProperty } from "graphql/customMutations";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { mapPropertyData } from "../ProjectPage/mappers";
import { useNavigate } from "react-router";
import { FaEye, FaExclamationTriangle } from "react-icons/fa";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const status = {
  REJECTED: "REJECTED",
  ACCEPTED: "APPROVED",
  PENDING: "PENDING",
};

const getUserById = async (userId) => {
  try {
    const user = await API.graphql(
      graphqlOperation(
        `query GetUser($id: ID!) {
          getUser(id: $id) {
            email
          }
        }`,
        { id: userId }
      )
    );
    return user.data.getUser.email || "N/A";
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    return "N/A";
  }
};

const canViewCadastralNumbers = (property, userId, userRole) => {
  return (
    userRole === "admin" ||
    userRole === "validator" ||
    property.projectPostulant.id === userId ||
    property.propertyCampaign.userId === userId
  );
};

export default function PropertiesTable({ editable }) {
  const [showModalAcceptProperty, setShowModalAcceptProperty] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [mappedProperties, setMappedProperties] = useState([]);
  const [cadastralDuplicates, setCadastralDuplicates] = useState({});
  const [userEmails, setUserEmails] = useState({});
  const { loading, properties } = useFetchPropertiesCampaign();
  const navigate = useNavigate();

  // Estados para paginación y búsqueda
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAuthenticatedUser = async () => {
      try {
        const data = await Auth.currentAuthenticatedUser();
        setUserId(data.attributes.sub);
        setUserRole(data.attributes["custom:role"]);
      } catch (error) {
        console.error("Error fetching authenticated user:", error);
      }
    };

    fetchAuthenticatedUser();
  }, []);

  useEffect(() => {
    const mapData = async () => {
      if (!properties || properties.length === 0) return;

      // Map property data
      const mappedProp = await Promise.all(
        properties.map((prop) => mapPropertyData(prop))
      );
      setMappedProperties(mappedProp);

      // Detect duplicates across all properties, across all campaigns
      const duplicates = {};

      mappedProp.forEach((property) => {
        const cadastralNumbers = property.projectCadastralRecords.cadastralNumbers
          ? property.projectCadastralRecords.cadastralNumbers.split(",").map((num) => num.trim())
          : [];

        cadastralNumbers.forEach((num) => {
          if (duplicates[num]) {
            duplicates[num].push(property.propertyInfo.id);
          } else {
            duplicates[num] = [property.propertyInfo.id];
          }
        });
      });

      setCadastralDuplicates(duplicates);

      // Fetch associated user emails
      const userIds = [...new Set(mappedProp.map((prop) => prop.projectPostulant.id))];
      const emails = {};
      for (const id of userIds) {
        emails[id] = await getUserById(id);
      }
      setUserEmails(emails);
    };

    mapData();
  }, [properties]);

  // Filtrar por nombre de predio (buscador)
  const searchFilteredProperties = mappedProperties.filter((property) =>
    property.propertyInfo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const totalRows = searchFilteredProperties.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage) || 1;
  const paginatedProperties = searchFilteredProperties.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Resetear página si cambia el filtro, búsqueda o cantidad por página
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, rowsPerPage]);

  const hideData = (data) => "*".repeat(data.length);

  const handleCloseModalAcceptProperty = () => {
    setShowModalAcceptProperty(false);
    setSelectedProperty(null);
  };

  const handleShowModalAcceptProperty = (property) => {
    setSelectedProperty(property);
    setShowModalAcceptProperty(true);
  };

  const handleRevokeValidation = async (propertyID) => {
    try {
      await API.graphql(
        graphqlOperation(updateProperty, {
          input: {
            id: propertyID,
            status: status.PENDING,
            reason: "",
          },
        })
      );
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-terrasacha-earth to-terrasacha-light shadow-terrasacha-lg border border-terrasacha-light rounded-lg">
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
    );
  }

  return (
    <div className="bg-white rounded-t-lg rounded-b-lg shadow-terrasacha-xl border border-terrasacha-light flex flex-col">
      {/* Buscador y paginación */}
      <div className="flex flex-col rounded-t-lg gap-2 md:flex-row md:items-center md:justify-between px-3 py-2 bg-terrasacha-earth border-b border-terrasacha-light">
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
              className="px-3 py-1 rounded-lg border border-terrasacha-light text-sm font-medium disabled:opacity-50 hover:bg-terrasacha-earth transition-all duration-200 disabled:hover:bg-transparent text-terrasacha-secondary1 font-typographica"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <span className="text-sm font-medium text-terrasacha-secondary1 px-3 py-1 bg-white rounded-lg border border-terrasacha-light font-typographica">
              Página {currentPage} de {totalPages}
            </span>
            <button
              className="px-3 py-1 rounded-lg border border-terrasacha-light text-sm font-medium disabled:opacity-50 hover:bg-terrasacha-earth transition-all duration-200 disabled:hover:bg-transparent text-terrasacha-secondary1 font-typographica"
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
      {mappedProperties.length === 0 ? (
        <div className="flex rounded-b-lg flex-col items-center justify-center py-16 bg-gradient-to-br from-terrasacha-earth to-terrasacha-light shadow-terrasacha-lg border border-terrasacha-light">
          <div className="w-32 h-32 mb-6 opacity-60 flex items-center justify-center">
            <svg
              className="w-full h-full text-terrasacha-secondary1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
          </div>
          <p className="text-terrasacha-secondary1 text-lg font-medium font-typographica">
            No hay predios postulados en esta campaña.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-terrasacha-light scrollbar-track-terrasacha-earth">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-terrasacha-earth to-terrasacha-light border-b border-terrasacha-light">
                <th className="text-left px-2 py-1 font-semibold text-xs text-terrasacha-secondary1 font-typographica"></th>
                <th className="text-left px-2 py-1 font-semibold text-xs text-terrasacha-secondary1 font-typographica">
                  Nombre del conjunto
                </th>
                <th className="text-left px-2 py-1 font-semibold text-xs text-terrasacha-secondary1 font-typographica">
                  Identificador catastral
                </th>
                <th className="text-left px-2 py-1 font-semibold text-xs text-terrasacha-secondary1 font-typographica">
                  Área Total
                </th>
                <th className="text-left px-2 py-1 font-semibold text-xs text-terrasacha-secondary1 font-typographica">
                  Correo
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedProperties.map((property, idx) => {
                const cadastralNumbers = property.projectCadastralRecords.cadastralNumbers
                  ? property.projectCadastralRecords.cadastralNumbers.split(",").map((num) => num.trim())
                  : [];

                const isDuplicate = cadastralNumbers.some(
                  (num) => cadastralDuplicates[num]?.length > 1
                );

                return (
                  <tr
                    key={property.propertyInfo.id}
                    className={`text-xs transition-all duration-200 uppercase border-b border-terrasacha-light hover:bg-terrasacha-earth ${
                      idx % 2 === 0 ? "bg-white" : "bg-terrasacha-earth"
                    }`}
                  >
                    <td className="px-3 py-2">
                      {(property.projectPostulant.id === userId ||
                        property.propertyCampaign.userId === userId ||
                        editable) && (
                        <button
                          onClick={() =>
                            navigate(`/property/${property.propertyInfo.id}`)
                          }
                          className="border border-terrasacha-primary bg-terrasacha-primary text-white rounded-lg p-1 text-xs hover:bg-terrasacha-secondary1 hover:shadow-terrasacha active:bg-terrasacha-secondary1 transition-all duration-200 flex items-center justify-center w-7 h-7 transform hover:scale-105"
                          aria-label="Ver detalles del predio"
                          data-tooltip-id={`tooltip-details-${property.propertyInfo.id}`}
                          data-tooltip-content="Ver detalles del predio"
                        >
                          <FaEye size={13} />
                        </button>
                      )}
                      <ReactTooltip
                        id={`tooltip-details-${property.propertyInfo.id}`}
                        place="top"
                        effect="solid"
                      />
                    </td>
                    <td className="px-2 py-1 min-w-36 text-terrasacha-secondary1 font-typographica">
                      {property.propertyInfo.name}
                    </td>
                    <td className="px-2 py-1 min-w-36">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-terrasacha-secondary1 font-typographica ${
                            isDuplicate ? "text-red-600 font-semibold" : ""
                          }`}
                        >
                          {canViewCadastralNumbers(property, userId, userRole)
                            ? cadastralNumbers.join(", ")
                            : hideData(cadastralNumbers.join(", "))}
                        </span>
                        {isDuplicate && (
                          <>
                            <FaExclamationTriangle 
                              className="text-red-500 text-sm" 
                              data-tooltip-id="tooltipDuplicados"
                              data-tooltip-content="Los números prediales que aparecen en rojo son aquellos que están duplicados y ya han sido colocados más de una vez."
                            />
                            <span className="text-xs text-red-600 font-semibold bg-red-100 px-2 py-1 rounded-full">
                              Duplicado
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-2 py-1 text-terrasacha-secondary1 font-typographica">
                      {property.projectCadastralRecords.totalAreaFormatted}
                    </td>
                    <td className="px-2 py-1 text-terrasacha-secondary1 font-typographica">
                      {canViewCadastralNumbers(property, userId, userRole)
                        ? userEmails[property.projectPostulant.id] || "N/A"
                        : "********"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ModalAcceptProperty
        handleCloseModalAcceptProperty={handleCloseModalAcceptProperty}
        showModalAcceptProperty={showModalAcceptProperty}
        selectedProperty={selectedProperty}
      />
    </div>
  );
}
