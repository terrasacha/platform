import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { listProperties } from "graphql/queries";
import { updateProperty } from "graphql/mutations";
import vacio from "../../views/_images/caja-vacia-gris.png";
import Swal from "sweetalert2";
import { FaMapPin, FaEye, FaCheck, FaTimes } from "react-icons/fa";

export default function ModalAssignProperty({ showModal, handleClose, campaignId, productId, fetchCampaign }) {
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    if (showModal) {
      fetchProperties();
    }
  }, [showModal]);

  // Obtener lista de predios sin campaña
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const result = await API.graphql(
        graphqlOperation(listProperties, {
          filter: { campaignID: { attributeExists: false } }
        })
      );
      setProperties(result.data.listProperties.items);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
    setLoading(false);
  };

  // Asignar predio a la campaña y al producto asociado con confirmación de Swal
  const assignProperty = async () => {
    if (!selectedProperty) return;

    // ✅ Mostrar SweetAlert2 antes de asignar
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Este predio será asignado a la campaña y al producto asociado.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, asignar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#849b50", // terrasacha-secondary2
      cancelButtonColor: "#dc3545",
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      await API.graphql(
        graphqlOperation(updateProperty, {
          input: {
            id: selectedProperty,
            campaignID: campaignId,
            productID: productId, // Se asigna también al `productID`
          },
        })
      );

      // ✅ Mostrar mensaje de éxito con SweetAlert
      Swal.fire({
        title: "Asignado con éxito",
        text: "El predio ha sido vinculado correctamente.",
        icon: "success",
        confirmButtonColor: "#849b50", // terrasacha-secondary2
      });

      fetchCampaign(); // Refrescar la campaña actual
      handleClose();
    } catch (error) {
      console.error("Error assigning property:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al asignar el predio.",
        icon: "error",
        confirmButtonColor: "#dc3545",
      });
    }
    setLoading(false);
  };

  return (
    <>
      {/* Custom Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
              onClick={handleClose}
            ></div>

            {/* Modal content - Fullscreen */}
            <div className="inline-block w-full h-full bg-white text-left overflow-hidden shadow-terrasacha-2xl transform transition-all">
              {/* Modal Header */}
              <div className="bg-gradient-terrasacha border-b border-terrasacha-light p-6 flex items-center justify-between">
                <h3 className="flex items-center gap-3 text-xl font-typographica font-bold text-white">
                  <FaMapPin className="text-terrasacha-earth" />
                  Asignar Predio a la Campaña
                </h3>
                <button
                  onClick={handleClose}
                  className="text-white hover:text-terrasacha-light transition-colors"
                  aria-label="Cerrar modal"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="bg-gradient-terrasacha-subtle h-full overflow-y-auto">
                <div className="bg-white shadow-terrasacha-xl rounded-2xl p-8 border border-terrasacha-light m-6">
                  <h2 className="text-2xl font-typographica font-bold text-terrasacha-secondary1 mb-6 text-center flex items-center justify-center gap-3">
                    <FaMapPin className="text-terrasacha-secondary2" />
                    Predios Disponibles para Asignar
                  </h2>

                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terrasacha-primary mx-auto"></div>
                      <p className="text-terrasacha-secondary1 mt-4 font-typographica">Cargando predios...</p>
                    </div>
                  ) : properties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {properties.map((property) => (
                        <div
                          key={property.id}
                          className={`p-6 bg-white shadow-terrasacha-lg rounded-xl border-2 transition-all duration-300 hover:shadow-terrasacha-xl ${
                            selectedProperty === property.id 
                              ? "border-terrasacha-secondary2 shadow-terrasacha-xl bg-gradient-to-br from-terrasacha-earth to-terrasacha-light" 
                              : "border-terrasacha-light hover:border-terrasacha-primary"
                          }`}
                        >
                          <h3 className="text-lg font-typographica font-bold mb-3 text-center text-terrasacha-secondary1">
                            {property.name}
                          </h3>
                          <p className="text-terrasacha-light text-sm text-center mb-4 font-typographica">
                            ID: {property.id}
                          </p>
                          <div className="flex justify-center gap-3">
                            <a
                              href={`/property/${property.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 bg-terrasacha-light hover:bg-terrasacha-secondary2 text-terrasacha-secondary1 text-sm font-typographica font-semibold px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
                            >
                              <FaEye />
                              Ver
                            </a>
                            <button
                              onClick={() => setSelectedProperty(property.id)}
                              className={`flex items-center gap-2 text-white text-sm font-typographica font-semibold px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                                selectedProperty === property.id
                                  ? "bg-terrasacha-secondary2 hover:bg-terrasacha-primary"
                                  : "bg-terrasacha-primary hover:bg-terrasacha-secondary1"
                              }`}
                            >
                              {selectedProperty === property.id ? <FaCheck /> : <FaMapPin />}
                              {selectedProperty === property.id ? "Seleccionado" : "Seleccionar"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <img src={vacio} className="w-32 h-32 mx-auto mb-6 opacity-60" alt="Sin predios" />
                      <p className="text-terrasacha-light text-lg font-typographica">No hay predios disponibles para asignar.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-between bg-gradient-terrasacha border-t border-terrasacha-light p-6">
                <button 
                  onClick={handleClose} 
                  className="flex items-center gap-2 px-6 py-2.5 font-typographica font-semibold text-white bg-terrasacha-secondary1 hover:bg-terrasacha-primary transition-all duration-300 rounded-lg shadow-terrasacha"
                >
                  <FaTimes />
                  Cerrar
                </button>
                <button
                  onClick={assignProperty}
                  disabled={!selectedProperty || loading}
                  className="flex items-center gap-2 px-6 py-2.5 font-typographica font-semibold text-white bg-terrasacha-secondary2 hover:bg-terrasacha-primary transition-all duration-300 rounded-lg shadow-terrasacha disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Asignando...
                    </>
                  ) : (
                    <>
                      <FaCheck />
                      Asignar Predio
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}