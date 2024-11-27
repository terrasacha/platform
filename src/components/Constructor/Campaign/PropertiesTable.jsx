import useFetchPropertiesCampaign from "hooks/useFetchPropertiesCampaign";
import ModalAcceptProperty from "./ModalAcceptProperty";
import { useState, useEffect } from "react";
import { Spinner, DropdownButton, Dropdown } from "react-bootstrap";
import { updateProperty } from "graphql/customMutations";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { mapPropertyData } from "../ProjectPage/mappers";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
const status = {
  REJECTED: "REJECTED",
  ACCEPTED: "APPROVED",
  PENDING: "PENDING",
};
export default function PropertiesTable({ editable }) {
  const [showModalAcceptProperty, setShowModalAcceptProperty] = useState(false);
  const [userId, setUserId] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [mappedProperties, setMappedProperties] = useState([]);
  const { loading, properties, error } = useFetchPropertiesCampaign();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthenticatedUser = async () => {
      try {
        const data = await Auth.currentAuthenticatedUser();
        setUserId(data.attributes.sub);
      } catch (error) {
        console.error("Error fetching authenticated user:", error);
      }
    };

    fetchAuthenticatedUser();
  }, []);

  useEffect(() => {
    const mapData = async () => {
      const mappedProp = await Promise.all(
        properties.map((prop) => mapPropertyData(prop))
      );
      setMappedProperties(mappedProp);
    };
    mapData();
  }, [properties]);

  const hideData = (data) => {
    return "*".repeat(data.length);
  };

  const handleCloseModalAcceptProperty = () => {
    setShowModalAcceptProperty(false);
    setSelectedProperty(null);
  };
  const handleShowModalAcceptProperty = (property) => {
    console.log("property", property);
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
      <div className="w-full flex justify-center items-center h-20">
        <Spinner variant="success" />
      </div>
    );
  }

  console.log("mappedProperties", mappedProperties);

  return (
    <div className="row">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="text-left px-4 py-2 w-44">Nombre del conjunto</th>
            <th className="text-left px-4 py-2 w-60">
              Identificador catastral
            </th>
            <th className="text-left px-4 py-2 w-44">Área Total</th>
            <th className="text-left px-4 py-2 w-32">Estado</th>
            <th className="text-left px-4 py-2 w-32">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {mappedProperties.map((property, index) => (
            <tr
              key={property.propertyInfo.id}
              className={`border-b ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-gray-100`}
            >
              <td className="px-4 py-2">{property.propertyInfo.name}</td>
              <td className="px-4 py-2">
                {property.projectPostulant.id === userId ||
                property.propertyCampaign.userId === userId
                  ? property.projectCadastralRecords.cadastralNumbers
                  : hideData(property.projectCadastralRecords.cadastralNumbers)}
              </td>
              <td className="px-4 py-2">
                {property.projectCadastralRecords.totalAreaFormatted}
              </td>
              {editable ? (
                <td className="px-4 py-2">
                  {property.propertyInfo.status === status.PENDING ? (
                    <DropdownButton title="VALIDACIÓN" variant="secondary">
                      <Dropdown.Item
                        onClick={() => handleShowModalAcceptProperty(property)}
                      >
                        Validar predio
                      </Dropdown.Item>
                    </DropdownButton>
                  ) : property.propertyInfo.status === status.ACCEPTED ? (
                    <DropdownButton title="APROBADO" variant="success">
                      <Dropdown.Item
                        onClick={() =>
                          handleRevokeValidation(property.propertyInfo.id)
                        }
                      >
                        Revocar validación
                      </Dropdown.Item>
                    </DropdownButton>
                  ) : (
                    <DropdownButton title="RECHAZADO" variant="danger">
                      <Dropdown.Item
                        onClick={() =>
                          handleRevokeValidation(property.propertyInfo.id)
                        }
                      >
                        Revocar validación
                      </Dropdown.Item>
                    </DropdownButton>
                  )}
                </td>
              ) : (
                <td className="px-4 py-2">
                  {property.propertyInfo.status === "APPROVED" && "Aceptado"}
                  {property.propertyInfo.status === "PENDING" && "Pendiente"}
                  {property.propertyInfo.status === "REJECTED" && "Rechazado"}
                </td>
              )}
              <td className="px-4 py-2">
                {property.projectPostulant.id === userId ||
                property.propertyCampaign.userId === userId || editable ? (
                  <button
                    onClick={() =>
                      navigate(`/property/${property.propertyInfo.id}`)
                    }
                    className="border border-yellow-500 bg-yellow-500 text-white rounded-md px-4 py-2 hover:bg-yellow-600 active:bg-yellow-700"
                  >
                    Detalles
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ModalAcceptProperty
        handleCloseModalAcceptProperty={handleCloseModalAcceptProperty}
        showModalAcceptProperty={showModalAcceptProperty}
        selectedProperty={selectedProperty}
      />
    </div>
  );
}
