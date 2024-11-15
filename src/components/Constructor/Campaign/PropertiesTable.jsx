import useFetchPropertiesCampaign from "hooks/useFetchPropertiesCampaign";
import ModalAcceptProperty from "./ModalAcceptProperty";
import { useState, useEffect} from "react";
import { Spinner } from "react-bootstrap";

/* const properties = [
    {
      id: "12345",
      certificado: "CT-987654",
      nombrePredio: "Finca La Esperanza",
      area: "5000 m²",
    },
    {
      id: "67890",
      certificado: "CT-123456",
      nombrePredio: "Hacienda El Paraíso",
      area: "7500 m²",
    },
    {
      id: "54321",
      certificado: "CT-789012",
      nombrePredio: "Villa del Sol",
      area: "6200 m²",
    },
  ]; */
  const status = {
    REJECTED: 'REJECTED',
    ACCEPTED: 'APPROVED',
    PENDING: 'PENDING'
}
export default function PropertiesTable() {
  const [showModalAcceptProperty, setShowModalAcceptProperty] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null)
  const { loading, properties, error } = useFetchPropertiesCampaign();
  const handleCloseModalAcceptProperty = () => {
    setShowModalAcceptProperty(false)
    setSelectedProperty(null)
  }
  const handleShowModalAcceptProperty = (property) => {
    setSelectedProperty(property)
    setShowModalAcceptProperty(true)
  }

  if (loading)
    return (
      <div className="w-full flex justify-center items-center h-20">
        <Spinner variant="success" />
      </div>
    );

  const toShowProperties = properties.map((item) => {
    item.certificado = "CT-123456";
    item.nombrePredio = "Villa del Sol";
    item.area = "6200 m²";
    return item;
  });

  return (
    <div className="row">
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left" style={{ width: "240px" }}>Identificador catastral</th>
            <th className="text-left" style={{ width: "180px" }}>Certificado de tradición</th>
            <th className="text-left" style={{ width: "180px" }}>Nombre de predio</th>
            <th className="text-left" style={{ width: "180px" }}>Área</th>
            <th style={{ width: "120px" }}></th>
            <th style={{ width: "120px" }}></th>
          </tr>
        </thead>
        <tbody>
          {toShowProperties.map((property, index) => (
            <tr key={property.id} className="border-b-2" style={{ height: "3rem" }}>
              <td className="text-left">{property.id}</td>
              <td className="text-left">{property.certificado}</td>
              <td className="text-left">{property.nombrePredio}</td>
              <td className="text-left">{property.area}</td>
              <td>
                <button className="border-2 border-yellow-500 bg-yellow-500 rounded-md px-2 py-1 active:bg-yellow-600 active:border-yellow-600">
                  Detalles
                </button>
              </td>
              <td className="align-middle text-center">
                {property.status === status.PENDING ? (
                  <button
                    onClick={() => handleShowModalAcceptProperty(property)}
                    className="border-2 border-gray-400 text-gray-400 rounded-md px-2 py-1 active:bg-gray-500 active:border-gray-500 w-32"
                  >
                    Validación
                  </button>
                ) : property.status === status.ACCEPTED ? (
                  <button
                    className="cursor-not-allowed border-2 border-green-600 text-white rounded-md px-2 py-1 bg-green-600 w-32"
                  >
                    {status.ACCEPTED}
                  </button>
                ) : (
                  <button
                    className="cursor-not-allowed border-2 border-red-600 text-white rounded-md px-2 py-1 bg-red-600 w-32"
                  >
                    {status.REJECTED}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ModalAcceptProperty handleCloseModalAcceptProperty={handleCloseModalAcceptProperty} showModalAcceptProperty={showModalAcceptProperty} selectedProperty={selectedProperty}/>
    </div>
  );
}
