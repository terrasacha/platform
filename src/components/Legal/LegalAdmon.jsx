import React, { useState, useEffect } from "react";
import vacio from "../views/_images/caja-vacia-gris.png";
import HeaderNavbar from "components/Investor/Navbars/HeaderNavbar";
import { API, Auth, graphqlOperation } from "aws-amplify";
import useFetchProperties from "hooks/useFetchProperties";
import { useNavigate } from "react-router";
import { formatArea } from "components/Constructor/ProjectPage/mappers";
import { stateMapper } from "utilities/propertyStateMapper";
import { useAuth } from "context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { updateProperty } from "graphql/mutations";

const getPropertyArea = (property) => {
  const areaFeature = property.propertyFeatures?.items.find(
    (feature) => feature?.featureID === "D_area"
  );
  if (!areaFeature) return "No disponible";
  return formatArea(areaFeature?.value) || "No disponible";
};

const DocumentationModal = ({ isOpen, onClose, property, fetchProperties }) => {
  const [reason, setReason] = useState(""); // Estado para manejar el comentario

  const handleEligible = async (option) => {
    // Lógica para manejar la elegibilidad
    try {
      await API.graphql(
        graphqlOperation(updateProperty, {
          input: {
            id: property.id,
            status: option ? "SELECTABLE" : "NOT_SELECTABLE", // Desasignar el usuario legal
            reason: option ? null : reason, // Agregar razón si no es elegible
          },
        })
      );
      toast.success(
        `El estado del predio ahora es: ${option ? "Elegible" : "No elegible"}`
      );
      fetchProperties();
    } catch (error) {
      toast.error("Error al actualizar el estado del predio");
      console.log("error", error);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg h-auto">
        <h2 className="text-xl font-bold mb-4">Documentación del predio</h2>
        {/* Aquí se puede agregar el contenido del documento */}
        <div className="mb-4">
          <p>Listado de documentos aquí...</p>
        </div>
        {(property.status === "PENDING" ||
          property.status === "DOC_UPLOADED") && (
          <div className="mb-4">
            <label htmlFor="reason" className="block mb-2">
              Razón (si no es elegible):
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full"
              rows="3"
              placeholder="Escribe la razón aquí..."
              aria-label="Razón para no elegir el predio"
            />
          </div>
        )}
        <div className="flex justify-end">
          {(property.status === "PENDING" ||
            property.status === "DOC_UPLOADED") && (
            <>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => handleEligible(true)}
              >
                Elegible
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => handleEligible(false)}
              >
                No elegible
              </button>
            </>
          )}
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente principal que muestra la lista de campañas
export default function LegalAdmon() {
  const { properties, fetchProperties } = useFetchProperties();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const { user } = useAuth();

  const navigate = useNavigate();

  async function logOut() {
    await Auth.signOut();
    localStorage.removeItem("role"); // Eliminar el rol del localStorage
    window.location.href = "/"; // Redirigir a la página principal
  }

  const handleOpenModal = (property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleToggleAssign = async (property) => {
    if (property.userLegal !== null) {
      if (property.userLegalID === user.id) {
        // Si el usuario legal es el mismo que el usuario logueado, desasignar
        try {
          await API.graphql(
            graphqlOperation(updateProperty, {
              input: {
                id: property.id,
                userLegalID: null, // Desasignar el usuario legal
              },
            })
          );
          toast.success(`Predio desasignado`);
          fetchProperties();
        } catch (error) {
          toast.error("Error al actualizar el estado del predio");
        }
        console.log("Desasignar predio:", property.id, "del legal:", user.id);
        return; // Salir de la función después de desasignar
      } else {
        toast.error("El predio pertenece a otro legal");
        return;
      }
    }

    // Si no hay usuario legal, asignar el usuario
    try {
      await API.graphql(
        graphqlOperation(updateProperty, {
          input: {
            id: property.id,
            userLegalID: user.id,
          },
        })
      );
      toast.success(`Predio asignado`);
      fetchProperties();
    } catch (error) {
      toast.error("Error al actualizar el estado del predio");
    }
    console.log("Asignar predio:", property.id, "al legal:", user.id);
  };

  let filteredProperties = properties.filter(
    (property) => filterStatus === "" || property.status === filterStatus
  );

  if (filterStatus !== "") {
    filteredProperties = properties.filter(
      (property) => property.status === filterStatus
    );
  }
  console.log(filteredProperties);
  return (
    <>
      <HeaderNavbar logOut={logOut} />

      {/* 📌 Listado de predios */}
      <section className="max-w-6xl mx-auto py-10 mt-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          📌 Listado de predios
        </h2>

        <div className="mb-4">
          <label htmlFor="statusFilter" className="mr-2">
            Filtrar por estado:
          </label>
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="">Todos</option>
            {Object.keys(stateMapper).map((key) => (
              <option key={key} value={key}>
                {stateMapper[key].label}
              </option>
            ))}
          </select>
        </div>

        {properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-100 rounded-lg shadow-md">
            <img src={vacio} className="w-40 h-40 mb-4" alt="Sin propiedades" />
            <p className="text-gray-600 text-lg mb-6">
              😔 No hay propiedades disponibles.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="text-left px-4 py-2">Nombre</th>
                  <th className="text-left px-4 py-2">Descripción</th>
                  <th className="text-left px-4 py-2">Campania asignada</th>
                  <th className="text-left px-4 py-2">Área</th>
                  <th className="text-left px-4 py-2">Departamento</th>
                  <th className="text-left px-4 py-2">Legal Asignado</th>
                  <th className="text-left px-4 py-2">Estado</th>
                  <th className="text-left px-4 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.map((property) => (
                  <tr key={property.id} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2">{property.name}</td>
                    <td className="px-4 py-2">
                      {property.description || "Sin descripción"}
                    </td>
                    <td className="px-4 py-2">
                      {property.campaign?.name || "No disponible"}
                    </td>
                    <td className="px-4 py-2">
                      {getPropertyArea(property) || "No disponible"}
                    </td>
                    <td className="px-4 py-2">
                      {property.department || "No disponible"}
                    </td>
                    <td className="px-4 py-2">
                      {property.userLegal?.name || "Sin Asignar"}
                    </td>
                    <td className="px-4 py-2">
                      {stateMapper[property.status].label || "No disponible"}
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      {property.userLegalID === null &&
                        (property.status !== "REJECTED" && property.status !== "APPROVED") && (
                          <button
                            className="border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600"
                            onClick={() => handleToggleAssign(property)}
                          >
                            Asignar
                          </button>
                        )}
                      {property.userLegalID === user.id &&
                        (property.status !== "REJECTED" && property.status !== "APPROVED") && (
                          <button
                            className="border border-red-500 bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600"
                            onClick={() => handleToggleAssign(property)}
                          >
                            Desasignar
                          </button>
                        )}
                      {property.userLegalID === user.id && (
                        <button
                          className="border border-blue-500 bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
                          onClick={() => handleOpenModal(property)}
                        >
                          Revisar Documentación
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/property/${property.id}`)}
                        className="border border-yellow-500 bg-yellow-500 text-white rounded-md px-4 py-2 hover:bg-yellow-600 active:bg-yellow-700"
                      >
                        Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <DocumentationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        property={selectedProperty}
        fetchProperties={fetchProperties}
      />
      <ToastContainer position="bottom-right" />
    </>
  );
}
