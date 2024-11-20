import useFetchPropertiesCampaign from "hooks/useFetchPropertiesCampaign";
import ModalAcceptProperty from "./ModalAcceptProperty";
import { useState, useEffect} from "react";
import { Spinner, DropdownButton, Dropdown} from "react-bootstrap";
import { updateProperty } from "graphql/customMutations";
import { API, graphqlOperation } from 'aws-amplify'
import { mapPropertyData } from "../ProjectPage/mappers";
  const status = {
    REJECTED: 'REJECTED',
    ACCEPTED: 'APPROVED',
    PENDING: 'PENDING'
}
export default function PropertiesTable({editable}) {
  const [showModalAcceptProperty, setShowModalAcceptProperty] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [mappedProperties, setMappedProperties] = useState([])
  const { loading, properties, error } = useFetchPropertiesCampaign();

  useEffect(() => {
    const mapData = async () => {
      const mappedProp = await Promise.all(properties.map((prop) => mapPropertyData(prop)));
      setMappedProperties(mappedProp);
    };
    mapData();
  }, [properties]);
  
  const handleCloseModalAcceptProperty = () => {
    setShowModalAcceptProperty(false)
    setSelectedProperty(null)
  }
  const handleShowModalAcceptProperty = (property) => {
    setSelectedProperty(property)
    setShowModalAcceptProperty(true)
  }
  const handleRevokeValidation = async (propertyID) =>{
    try {
      await API.graphql(graphqlOperation(updateProperty, { input: {
        id: propertyID,
        status: status.PENDING,
        reason: ''
      }}))
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }
  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-20">
        <Spinner variant="success" />
      </div>
    );
  }

  console.log('mappedProperties', mappedProperties)

  return (
    <div className="row">
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left" style={{ width: "180px" }}>Nombre del conjunto</th>
            <th className="text-left" style={{ width: "240px" }}>Identificador catastral</th>
            <th className="text-left" style={{ width: "180px" }}>Área Total</th>
            <th style={{ width: "120px" }}></th>
            <th style={{ width: "120px" }}></th>
          </tr>
        </thead>
        <tbody>
          {mappedProperties.map((property, index) => (
            <tr key={property.propertyInfo.id} className="border-b-2" style={{ height: "3rem" }}>
              <td className="text-left">{property.propertyInfo.name}</td>
              <td className="text-left">{property.projectCadastralRecords.cadastralNumbers}</td>
              <td className="text-left">{property.projectCadastralRecords.totalAreaFormatted}</td>
              <td>
                <a href={`/property/${property.propertyInfo.id}`} className="border-2 border-yellow-500 bg-yellow-500 rounded-md px-2 py-1 active:bg-yellow-600 active:border-yellow-600">
                  Detalles
                </a>
              </td>
              {
                editable && (
                  <td className="w-32 flex justify-end">
                    {property.propertyInfo.status === status.PENDING ? (
                      <DropdownButton title="VALIDACIÓN" variant='secondary'>
                        <Dropdown.Item onClick={() => handleShowModalAcceptProperty(property)}>Validar predio</Dropdown.Item>
                      </DropdownButton>
                    ) : property.propertyInfo.status === status.ACCEPTED ? (
                      <DropdownButton title="APPROVED" variant='success'>
                        <Dropdown.Item href="#/action-2" onClick={() =>handleRevokeValidation(property.propertyInfo.id)}>Revocar valicación</Dropdown.Item>
                      </DropdownButton>
                    ) : (
                      <DropdownButton title="REJECTED" variant='danger'>
                        <Dropdown.Item href="#/action-2" onClick={() =>handleRevokeValidation(property.propertyInfo.id)}>Revocar valicación</Dropdown.Item>
                      </DropdownButton>
                    )}
                  </td>
                )
              }
            </tr>
          ))}
        </tbody>
      </table>
      <ModalAcceptProperty handleCloseModalAcceptProperty={handleCloseModalAcceptProperty} showModalAcceptProperty={showModalAcceptProperty} selectedProperty={selectedProperty}/>
    </div>
  );
}
