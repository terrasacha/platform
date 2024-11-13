export default function PropertiesTable() {
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
                <button className="round bg-yellow-500 rounded-md p-2">Detalles</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
