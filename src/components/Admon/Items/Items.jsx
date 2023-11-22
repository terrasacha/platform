import React, { Component } from "react";
// Amplify
// import '@aws-amplify/ui-react/styles.css'
// Bootstrap
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
// GraphQL
import { API, graphqlOperation } from "aws-amplify";
import {
  createProductItem,
  updateProductItem,
} from "../../../graphql/mutations";
import { listProductItems } from "../../../graphql/queries";
import {
  onCreateProductItem,
  onUpdateProductItem,
} from "../../../graphql/subscriptions";

class Items extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categorys: [],
      CRUDButtonName: "CREATE",
      isCRUDButtonDisable: true,
      newCategory: { name: "", type: "" },
    };
    this.handleOnChangeInputForm = this.handleOnChangeInputForm.bind(this);
    this.handleCRUDCategory = this.handleCRUDCategory.bind(this);
    this.handleLoadEditCategory = this.handleLoadEditCategory.bind(this);
  }

  componentDidMount = async () => {
    await this.loadItems();

    // Subscriptions
    // OnCreate Category
    this.createCategoryListener = API.graphql(
      graphqlOperation(onCreateProductItem)
    ).subscribe({
      next: async (createdCategoryData) => {
        await this.loadItems();
      },
    });

    // OnUpdate Category
    this.updateCategoryListener = API.graphql(
      graphqlOperation(onUpdateProductItem)
    ).subscribe({
      next: (updatedCategoryData) => {
        let tempCategorys = this.state.categorys.map((mapCategory) => {
          if (
            updatedCategoryData.value.data.onUpdateProductItem.id ===
            mapCategory.id
          ) {
            return updatedCategoryData.value.data.onUpdateProductItem;
          } else {
            return mapCategory;
          }
        });
        // Ordering categorys by name
        tempCategorys.sort((a, b) => (a.name > b.name ? 1 : -1));
        this.setState((state) => ({ categorys: tempCategorys }));
      },
    });
  };
  componentWillUnmount() {}

  async loadItems() {
    const listProductItemsResult = await API.graphql(
      graphqlOperation(listProductItems)
    );
    listProductItemsResult.data.listProductItems.items.sort((a, b) =>
      a.type > b.type ? 1 : -1
    );
    this.setState({
      categorys: listProductItemsResult.data.listProductItems.items,
    });
  }

  handleOnChangeInputForm = async (event) => {
    let tempNewCategory = this.state.newCategory;
    if (event.target.name === "category.name") {
      tempNewCategory.name = event.target.value.toUpperCase();
    }
    if (event.target.name === "category.type") {
      tempNewCategory.type = event.target.value;
    }
    this.setState({ newCategory: tempNewCategory });
    this.validateCRUDCategory();
  };

  async validateCRUDCategory() {
    if (this.state.newCategory.name !== "") {
      this.setState({ isCRUDButtonDisable: false });
    }
  }

  async handleCRUDCategory() {
    let tempNewCategory = this.state.newCategory;

    if (this.state.CRUDButtonName === "CREATE") {
      const resposne = await API.graphql(
        graphqlOperation(createProductItem, { input: tempNewCategory })
      );
      console.log(tempNewCategory)
      console.log(resposne)
      await this.cleanCategoryOnCreate();
    }

    if (this.state.CRUDButtonName === "UPDATE") {
      let tempNewCategory = {
        id: this.state.newCategory.id,
        name: this.state.newCategory.name,
        type: this.state.newCategory.type
      };
      await API.graphql(
        graphqlOperation(updateProductItem, { input: tempNewCategory })
      );
      await this.cleanCategoryOnCreate();
    }
  }

  handleLoadEditCategory = async (category, event) => {
    this.setState({
      newCategory: category,
      CRUDButtonName: "UPDATE",
      isCRUDButtonDisable: false,
    });
    this.validateCRUDCategory();
  };

  async cleanCategoryOnCreate() {
    this.setState({
      CRUDButtonName: "CREATE",
      isCRUDButtonDisable: true,
      newCategory: { name: "", type: "" },
    });
  }

  // RENDER
  render() {
    // State Varibles
    let { categorys, newCategory, CRUDButtonName } = this.state;

    const renderCategorys = () => {
      if (categorys.length > 0) {
        return (
          <Container>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {categorys.map((category) => (
                  <tr key={category.id}>
                    <td>{category.name}</td>
                    <td>{category.type}</td>
                    <td>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={(e) =>
                          this.handleLoadEditCategory(category, e)
                        }
                      >
                        Editar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Container>
        );
      }
    };

    return (
      <Container style={{ display: "flex", flexDirection: "column" }}>
        <Container>
          <h2>
            {CRUDButtonName} Items de proyecto: {newCategory.name}
          </h2>
          <Form>
            <Row className="mb-2">
              <Form.Group as={Col} controlId="formGridNewCategoryName">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ex. NUEVO CONCEPTO"
                  name="category.name"
                  value={newCategory.name}
                  onChange={(e) => this.handleOnChangeInputForm(e)}
                />
                <Form.Label>Categoria</Form.Label>
                <Form.Select
                  name="category.type"
                  onChange={(e) => this.handleOnChangeInputForm(e)}
                  value={newCategory.type}
                >
                  <option disabled value="">
                    Selecciona una opción
                  </option>
                  <option value="Ingresos por producto">
                    Ingresos por producto
                  </option>
                  <option value="Productos del ciclo del proyecto">
                    Productos del ciclo del proyecto
                  </option>
                  <option value="Indicadores financieros (Proyecto)">
                    Indicadores financieros (Proyecto)
                  </option>
                  <option value="Indicadores financieros (Token)">
                    Indicadores financieros (Token)
                  </option>
                </Form.Select>
              </Form.Group>
            </Row>

            <Row className="mb-1">
              <Button
                variant="primary"
                size="sm"
                onClick={this.handleCRUDCategory}
                disabled={this.state.isCRUDButtonDisable}
              >
                {CRUDButtonName}
              </Button>
            </Row>
          </Form>
        </Container>
        <br></br>
        {renderCategorys()}
      </Container>
    );
  }
}

export default Items;
