import useFetchPropertiesCampaign from "hooks/useFetchPropertiesCampaign";
import ModalAcceptProperty from "./ModalAcceptProperty";
import { useState, useEffect} from "react";
import { Spinner, DropdownButton, Dropdown} from "react-bootstrap";
import { updateProperty } from "graphql/customMutations";
import { API, graphqlOperation } from 'aws-amplify'
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
  const handleRevokeValidation = async (property) =>{
    try {
      await API.graphql(graphqlOperation(updateProperty, { input: {
        id: property.id,
        status: status.PENDING,
        reason: ''
      }}))
      return true
    } catch (error) {
      console.error(error)
      return false
    }
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
              <td className="text-left">{property.cadastralNumber}</td>
              <td className="text-left">{property.certificado}</td>
              <td className="text-left">{property.nombrePredio}</td>
              <td className="text-left">{property.area}</td>
              <td>
                <button className="border-2 border-yellow-500 bg-yellow-500 rounded-md px-2 py-1 active:bg-yellow-600 active:border-yellow-600">
                  Detalles
                </button>
              </td>
              <td className="w-32 flex justify-end">
                {property.status === status.PENDING ? (
                  <DropdownButton title="VALIDACIÓN" variant='secondary'>
                    <Dropdown.Item onClick={() => handleShowModalAcceptProperty(property)}>Validar predio</Dropdown.Item>
                  </DropdownButton>
                ) : property.status === status.ACCEPTED ? (
                  <DropdownButton title="APPROVED" variant='success'>
                    <Dropdown.Item href="#/action-2" onClick={() =>handleRevokeValidation(property)}>Revocar valicación</Dropdown.Item>
                  </DropdownButton>
                ) : (
                  <DropdownButton title="REJECTED" variant='danger'>
                    <Dropdown.Item href="#/action-2" onClick={() =>handleRevokeValidation(property)}>Revocar valicación</Dropdown.Item>
                  </DropdownButton>
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
