import React, { Component } from "react";
import { Container, Table, Form, Button, Alert } from "react-bootstrap";
import { API, graphqlOperation } from "aws-amplify";
import { v4 as uuidv4 } from "uuid";

import { listProducts, listUserProducts } from "graphql/queries"; 
import { createUserProduct, deleteUserProduct } from "graphql/mutations";

const listAnalysts = /* GraphQL */ `
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

export default class AssignAnalyst extends Component {
  constructor(props) {
    super(props);
    this.state = {
      analysts: [],
      products: [],
      userProducts: [],
      selectedAnalyst: "",
      selectedProduct: "",
      showSuccess: false,
      showError: false,
      showDeleteSuccess: false, // Estado para mostrar el mensaje de eliminación
    };
  }

  componentDidMount = async () => {
    try {
      await Promise.all([
        this.loadAnalysts(),
        this.loadProducts(),
        this.loadUserProducts(),
      ]);
      console.log("Datos cargados correctamente");
    } catch (error) {
      console.error("Error cargando los datos:", error);
    }
  };

  async loadAnalysts() {
    const filter = { role: { eq: "analyst" } };
    return API.graphql(graphqlOperation(listAnalysts, { filter }))
      .then((result) => {
        this.setState({ analysts: result.data.listUsers.items });
      });
  }

  async loadProducts() {
    try {
      const result = await API.graphql(graphqlOperation(listProducts));
      // Filtrar productos que no tienen campañas
      const filteredProducts = result.data.listProducts.items.filter(
        (product) => product.campaign === null
      );
      this.setState({ products: filteredProducts });
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  }
  

  async loadUserProducts() {
    return API.graphql(graphqlOperation(listUserProducts))
      .then((result) => {
        const filteredUserProducts = result.data.listUserProducts.items.filter(
          (up) => up.user?.role === "analyst"
        );
        this.setState({ userProducts: filteredUserProducts });
      })
      .catch((error) => {
        console.error("Error al cargar productos asignados:", error);
      });
  }

  handleAssignAnalyst = async () => {
    const { selectedAnalyst, selectedProduct } = this.state;

    if (!selectedAnalyst || !selectedProduct) {
      this.setState({ showError: true });
      return;
    }

    const payload = {
      id: uuidv4(),
      userID: selectedAnalyst,
      productID: selectedProduct,
    };

    await API.graphql(graphqlOperation(createUserProduct, { input: payload }));
    this.setState({
      selectedAnalyst: "",
      selectedProduct: "",
      showSuccess: true,
      showError: false,
    });
    await this.loadUserProducts();
  };

  handleDeleteAssignment = async (userProductId) => {
    try {
      await API.graphql(graphqlOperation(deleteUserProduct, { input: { id: userProductId } }));
      await this.loadUserProducts(); // Refresh the user-products table
      this.setState({ showDeleteSuccess: true }); // Mostrar mensaje de éxito
    } catch (error) {
      console.error("Error al eliminar asignación:", error);
      alert("Error al eliminar la asignación.");
    }
  };

  render() {
    const {
      analysts,
      products,
      userProducts,
      selectedAnalyst,
      selectedProduct,
      showSuccess,
      showError,
      showDeleteSuccess, // Estado del mensaje de eliminación
    } = this.state;

    return (
      <div className="container-fluid bg-tecnologia p-5" id="tecnologia">
        <Container className="mt-5 p-4 bg-light shadow rounded">
          <h2 className="text-center mb-4">Asignar Analista</h2>

          {/* Mensajes de alerta */}
          {showSuccess && (
            <Alert
              variant="success"
              onClose={() => this.setState({ showSuccess: false })}
              dismissible
            >
              Analista asignado correctamente.
            </Alert>
          )}
          {showError && (
            <Alert
              variant="danger"
              onClose={() => this.setState({ showError: false })}
              dismissible
            >
              Por favor, seleccione un analista y un producto antes de continuar.
            </Alert>
          )}
          {showDeleteSuccess && (
            <Alert
              variant="warning"
              onClose={() => this.setState({ showDeleteSuccess: false })}
              dismissible
            >
              Asignación eliminada correctamente.
            </Alert>
          )}

          {/* Formulario de selección */}
          <Form className="mb-4">
            <Form.Group controlId="selectAnalyst" className="mb-3">
              <Form.Label>Seleccionar Analista</Form.Label>
              <Form.Select
                value={selectedAnalyst}
                onChange={(e) => this.setState({ selectedAnalyst: e.target.value })}
              >
                <option value="">-- Seleccione un analista --</option>
                {analysts.map((analyst) => (
                  <option key={analyst.id} value={analyst.id}>
                    {analyst.name} ({analyst.email})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="selectProduct" className="mb-3">
              <Form.Label>Seleccionar Producto</Form.Label>
              <Form.Select
                value={selectedProduct}
                onChange={(e) => this.setState({ selectedProduct: e.target.value })}
              >
                <option value="">-- Seleccione un Projecto --</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.categoryID})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="text-center">
              <Button
                variant="primary"
                onClick={this.handleAssignAnalyst}
                disabled={!selectedAnalyst || !selectedProduct}
              >
                Asignar Analista
              </Button>
            </div>
          </Form>

          {/* Tabla de asignaciones */}
          <h4 className="text-center mb-4">Analistas Asignados</h4>
          <Table striped bordered hover className="mt-4">
            <thead>
              <tr>
                <th>Nombre del Analista</th>
                <th>Producto Asignado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {userProducts.length > 0 ? (
                userProducts.map((up) => (
                  <tr key={up.id}>
                    <td>{up.user?.name || "Desconocido"}</td>
                    <td>{up.product?.name || "Sin nombre"}</td>
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
                  <td colSpan="3" className="text-center">
                    No hay analistas asignados todavía.
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
