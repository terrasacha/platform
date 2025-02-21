import React, { Component } from "react";
import { Container, Table, Form, Button, Alert } from "react-bootstrap";
import { API, graphqlOperation } from "aws-amplify";
import { v4 as uuidv4 } from "uuid";
import { listProperties, listUserProducts } from "graphql/queries"; 
import { createUserProduct, deleteUserProduct } from "graphql/mutations";

const listLegales = /* GraphQL */ `
query ListUsers($filter: ModelUserFilterInput) {
  listUsers(filter: $filter) {
    items {
      id
      name
      email
      role
    }
  }
}
`;

export default class AssignLegal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      legales: [],
      properties: [], 
      availableProperties: [], 
      userProperties: [],
      selectedLegal: "",
      selectedProperty: "",
      showSuccess: false,
      showError: false,
      showDeleteSuccess: false,
    };
  }

  componentDidMount = async () => {
    try {
      await Promise.all([
        this.loadLegales(),
        this.loadProperties(),
        this.loadUserProperties(),
      ]);
    } catch (error) {
      console.error("Error cargando los datos:", error);
    }
  };

  async loadLegales() {
    const filter = { role: { eq: "legal" } };
    return API.graphql(graphqlOperation(listLegales, { filter }))
      .then((result) => {
        this.setState({ legales: result.data.listUsers.items });
      });
  }

  async loadProperties() {
    try {
      const result = await API.graphql(graphqlOperation(listProperties));
      this.setState({ properties: result.data.listProperties.items });
    } catch (error) {
      console.error("Error al cargar propiedades:", error);
    }
  }

  async loadUserProperties() {
    try {
      const result = await API.graphql(graphqlOperation(listUserProducts));
      const filteredUserProperties = result.data.listUserProducts.items.filter(
        (up) => up?.user?.role === "legal"
      );
      this.setState({ userProperties: filteredUserProperties });
    } catch (error) {
      console.error("Error al cargar propiedades asignadas:", error);
    }
  }

  handleSelectLegal = (legalId) => {
    const { userProperties, properties } = this.state;

    const assignedPropertyIds = userProperties
      .filter((up) => up.userID === legalId)
      .map((up) => up.propertyID);

    const availableProperties = properties.filter(
      (property) => !assignedPropertyIds.includes(property.id)
    );

    this.setState({
      selectedLegal: legalId,
      availableProperties,
      selectedProperty: "",
    });
  };

  handleAssignLegal = async () => {
    const { selectedLegal, selectedProperty } = this.state;

    if (!selectedLegal || !selectedProperty) {
      this.setState({ showError: true });
      return;
    }

    const payload = {
      id: uuidv4(),
      userID: selectedLegal,
      propertyID: selectedProperty,
    };

    await API.graphql(graphqlOperation(createUserProduct, { input: payload }));

    this.setState((prevState) => ({
      userProperties: [...prevState.userProperties, payload],
      selectedLegal: "",
      selectedProperty: "",
      showSuccess: true,
      showError: false,
    }));
  };

  handleDeleteAssignment = async (userPropertyId) => {
    if (!userPropertyId) return;

    try {
      await API.graphql(graphqlOperation(deleteUserProduct, { input: { id: userPropertyId } }));

      this.setState((prevState) => ({
        userProperties: prevState.userProperties.filter((up) => up.id !== userPropertyId),
        showDeleteSuccess: true,
      }));
    } catch (error) {
      console.error("Error al eliminar asignación:", error);
      alert("Error al eliminar la asignación.");
    }
  };

  renderAlert(type, message, onClose) {
    return <Alert variant={type} onClose={onClose} dismissible>{message}</Alert>;
  }

  render() {
    const { legales, availableProperties, userProperties, selectedLegal, selectedProperty, showSuccess, showError, showDeleteSuccess } = this.state;

    return (
        <div className="container-fluid bg-tecnologia p-5" id="tecnologia">
      <Container className="mt-5 p-4 bg-light shadow rounded">
        <h2 className="text-center mb-4">Asignar Usuario Legal</h2>

        {showSuccess && this.renderAlert("success", "Usuario legal asignado correctamente.", () => this.setState({ showSuccess: false }))}
        {showError && this.renderAlert("danger", "Seleccione un usuario legal y una propiedad antes de continuar.", () => this.setState({ showError: false }))}
        {showDeleteSuccess && this.renderAlert("warning", "Asignación eliminada correctamente.", () => this.setState({ showDeleteSuccess: false }))}

        {/* Formulario */}
        <Form className="mb-4">
          <Form.Group controlId="selectLegal" className="mb-3">
            <Form.Label>Seleccionar Usuario Legal</Form.Label>
            <Form.Select
              value={selectedLegal}
              onChange={(e) => this.handleSelectLegal(e.target.value)}
            >
              <option value="">-- Seleccione un usuario legal --</option>
              {legales.map((legal) => (
                <option key={legal.id} value={legal.id}>
                  {legal.name} ({legal.email})
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="selectProperty" className="mb-3">
            <Form.Label>Seleccionar Propiedad</Form.Label>
            <Form.Select
              value={selectedProperty}
              onChange={(e) => this.setState({ selectedProperty: e.target.value })}
              disabled={!selectedLegal}
            >
              <option value="">-- Seleccione una Propiedad --</option>
              {availableProperties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.name} ({property.campaign ? property.campaign.name : "Sin campaña"})
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <div className="text-center">
            <Button
              variant="primary"
              onClick={this.handleAssignLegal}
              disabled={!selectedLegal || !selectedProperty}
            >
              Asignar Usuario Legal
            </Button>
          </div>
        </Form>

        {/* Tabla de asignaciones */}
        <h4 className="text-center mb-4">Usuarios Legales Asignados</h4>
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>Nombre del Usuario Legal</th>
              <th>Propiedad Asignada</th>
              <th>Campaña</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {userProperties.length > 0 ? (
              userProperties.map((up) => (
                <tr key={up.id}>
                  <td>{up.user?.name || "Desconocido"}</td>
                  <td>{up.property?.name || "Sin nombre"}</td>
                  <td>{up.property?.campaign ? up.property.campaign.name : "Sin campaña"}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => this.handleDeleteAssignment(up.id)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No hay usuarios legales asignados todavía.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
      </div>
    );
  }
}
