import ModalAcceptProperty from "./ModalAcceptProperty";
import { useState } from "react";
export default function PropertiesTable() {
  const [showModalAcceptProperty, setShowModalAcceptProperty] = useState(false)
  
    const handleCloseModalAcceptProperty = () => setShowModalAcceptProperty(false);
    const handleShowModalAcceptProperty = () => setShowModalAcceptProperty(true);

  const properties = [
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
  ];

  return (
    <div className="row">
      <table>
        <thead className="text-center">
          <tr>
            <th style={{ width: "240px" }}>Identificador catastral</th>
            <th style={{ width: "180px" }}>Certificado de tradición</th>
            <th style={{ width: "180px" }}>Nombre de predio</th>
            <th style={{ width: "180px" }}>Área</th>
            <th style={{ width: "120px" }}></th>
            <th style={{ width: "120px" }}></th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property, index) => (
            <tr
              key={index}
              className="text-center border-b-2"
              style={{ height: "3rem" }}
            >
              <td>{property.id}</td>
              <td>{property.certificado}</td>
              <td>{property.nombrePredio}</td>
              <td>{property.area}</td>
              <td>
                <button className="round border-2 border-yellow-500 bg-yellow-500 rounded-md px-2 py-1 active:bg-yellow-600 active:border-yellow-600">Detalles</button>
              </td>
              <td>
                <button 
                  onClick={handleShowModalAcceptProperty}
                  className="round border-2 border-gray-400 text-gray-400 rounded-md px-2 py-1 active:bg-gray-500 active:border-gray-500">Validación</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ModalAcceptProperty handleCloseModalAcceptProperty={handleCloseModalAcceptProperty} showModalAcceptProperty={showModalAcceptProperty}/>
    </div>
  );
}
