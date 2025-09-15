import React from "react";
import Card from "components/common/Card";
import useFetchPropertiesProject from "hooks/useFetchPropertiesProject";
import { formatArea, getAreaFromPf } from "../../mappers";
export default function PropertiesTable() {
  const { properties } = useFetchPropertiesProject();

  return (
    <Card>
      <Card.Header title="Tabla de predios asociados" sep={true} />
      <Card.Body>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left" style={{ width: "180px" }}>
                Nombre de predio
              </th>
              <th className="text-left" style={{ width: "180px" }}>
                Área (m^2)
              </th>
              <th style={{ width: "120px" }}></th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property, index) => (
              <tr
                key={property.id}
                className="border-b-2"
                style={{ height: "3rem" }}
              >
                <td className="text-left">{property.name}</td>
                <td className="text-left">
                  {formatArea(getAreaFromPf(property))}
                </td>
                <td>
                  <a
                    href={`/property/${property.id}`}
                    className="border-2 border-terrasacha-secondary2 bg-terrasacha-secondary2 hover:bg-terrasacha-secondary2-dark text-white rounded-md px-3 py-2 transition-all duration-300 hover:scale-105 shadow-terrasacha"
                  >
                    Detalles
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card.Body>
    </Card>
  );
}
