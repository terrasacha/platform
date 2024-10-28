import React, { Component } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Row,
  Table,
  Modal,
} from "react-bootstrap";

import { API, graphqlOperation, Auth } from "aws-amplify";
import {
  onCreateUser,
  onUpdateUser,
  onDeleteUser,
} from "../../../graphql/subscriptions";
import {
  createUser,
  updateUser,
  deleteUser,
  deleteUserProduct,
} from "../../../graphql/mutations";
import { listUserProducts } from "../../../graphql/queries";
import { v4 as uuidv4 } from "uuid";

const listUserAnalysts = `
query ListUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      email
      isProfileUpdated
      role
      status
      createdAt
    }
    nextToken
  }
}
`;

class Analysts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      analysts: [],
      newUser: {
        id: "",
        username: "",
        email: "",
        role: "analyst"
      },
      showModal: false,
      showModalCreate: false,
      userToDelete: { id: null, username: null },
    };
    this.handleCRUDUser = this.handleCRUDUser.bind(this);
  }

  componentDidMount = async () => {
    await this.loadAnalystUsers();
    this.createAnalystListener = API.graphql(
      graphqlOperation(onCreateUser)
    ).subscribe({
      next: (createdUser) => {
        this.loadAnalystUsers();
      },
    });
    this.deleteAnalystListener = API.graphql(
      graphqlOperation(onDeleteUser)
    ).subscribe({
      next: (deleteUser) => {
        this.loadAnalystUsers();
      },
    });
    this.updateUserListener = API.graphql(
      graphqlOperation(onUpdateUser)
    ).subscribe({
      next: (updatedUserData) => {
        let tempAnalysts = this.state.analysts.map((mapAnalysts) => {
          if (updatedUserData.value.data.onUpdateUser.id === mapAnalysts.id) {
            return updatedUserData.value.data.onUpdateUser;
          } else {
            return mapAnalysts;
          }
        });
        this.setState({ analysts: tempAnalysts });
      },
    });
  };

  handleDeleteUser = async (id) => {
    const input = { id };
    let promises = [];
    API.graphql(
      graphqlOperation(listUserProducts, { filter: { userID: { eq: id } } })
    ).then((result) => {
      if (result.data.listUserProducts.items.length > 0) {
        result.data.listUserProducts.items.map((mapUserProducts) => {
          promises.push(
            API.graphql(
              graphqlOperation(deleteUserProduct, {
                input: { id: mapUserProducts.id },
              })
            )
          );
        });
      }
    });
    promises.push(API.graphql(graphqlOperation(deleteUser, { input: input })));
    await Promise.all(promises)
      .then(() => {
        console.log("información eliminada exitosamente");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  showModalCreate() {
    this.setState({
      showModalCreate: true,
    });
  }

  showModalDelete(user) {
    this.setState({
      userToDelete: user,
      showModal: true,
    });
  }

  async confirmCreateUser() {
    const { newUser } = this.state;
    if (newUser) {
      await this.handleCRUDUser();
      this.cleanUserOnCreate();
    }
  }

  confirmDeleteUser() {
    const { userToDelete } = this.state;
    if (userToDelete) {
      this.handleDeleteUser(userToDelete.id);
      this.setState({
        userToDelete: { id: null, username: null },
        showModal: false,
      });
    }
}

  async loadAnalystUsers() {
    let filter = {
      role: {
        contains: "analyst", // Filtrar usuarios con rol "analyst"
      },
    };
    const listUsersResult = await API.graphql({
      query: listUserAnalysts,
      variables: { filter: filter },
    });
    this.setState({ analysts: listUsersResult.data.listUsers.items });
  }

  handleOnChangeInputForm = async (event) => {
    let tempNewUser = this.state.newUser;
    if (event.target.name === "newUser.username") {
      tempNewUser.username = event.target.value;
    }
    if (event.target.name === "newUser.email") {
      tempNewUser.email = event.target.value;
    }

    this.setState({ newUser: tempNewUser });
  };

  async handleCRUDUser() {
    let tempNewUser = this.state.newUser;
    await this.signUp(
      tempNewUser.username,
      tempNewUser.email,
      tempNewUser.role
    );
  }

  handleHideModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  handleHideModalCreate() {
    this.setState({ showModalCreate: !this.state.showModalCreate });
  }

  cleanUserOnCreate() {
    this.setState({
      newUser: {
        id: "",
        username: "",
        email: "",
        role: "analyst", // Mantener rol de "analyst"
      },
      showModalCreate: false,
    });
  }

  async signUp() {
    const { username, email, role } = this.state.newUser;
    if (username !== "" && email !== "") {
      try {
        const userPayload = {
          id: uuidv4().split("-")[4],
          name: username,
          email: email,
          isProfileUpdated: false,
          role: `${role}`,
        };
       const response = await API.graphql(graphqlOperation(createUser, { input: userPayload }));
       console.log(response);
       this.setState({ message: "Usuario creado exitosamente!" });
        this.handleHideModalCreate();
        this.cleanUserOnCreate();
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Agregar usuario e email");
    }
  }

  render() {
    let { analysts, newUser } = this.state;

    const renderAnalysts = () => {
      if (analysts.length > 0) {
        return (
          <div className="container mx-auto mt-8 bg-white p-4 rounded-lg shadow-sm mb-4">
            <h4 className="text-lg font-semibold mb-4">Lista de analista</h4>
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Nombre</th>
                    <th className="border px-4 py-2">Email</th>
                    <th className="border px-4 py-2">Creado :</th>
                    <th className="border px-4 py-2">Confirmacion</th>
                    <th className="border px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {analysts.map((analyst) => (
                    <tr key={analyst.id}>
                      <td className="border px-4 py-2">{analyst.name}</td>
                      <td className="border px-4 py-2">{analyst.email}</td>
                      <td className="border px-4 py-2">
                        {`${analyst.createdAt.split("T")[0].split("-")[2]}-${
                          analyst.createdAt.split("T")[0].split("-")[1]
                        }-${analyst.createdAt.split("T")[0].split("-")[0]}`}
                      </td>
                      <td className="border px-4 py-2">
                        {analyst.isProfileUpdated
                          ? "Confirmado"
                          : "Pendiente"}
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ${
                            !analyst.isProfileUpdated
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          disabled={!analyst.isProfileUpdated}
                          onClick={() =>
                            this.showModalDelete({
                              id: analyst.id,
                              username: analyst.name,
                            })
                          }
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }
    };

    return (
      <div className="container mx-auto ">
        <div className="mt-8 bg-white p-4 rounded-lg shadow-sm mb-4">
          <h4 className="text-lg">Crea un nuevo analista</h4>
          <form className="mt-4">
            <div className="mb-4">
              <label
                htmlFor="formGridUsername"
                className="block font-semibold"
              >
                Nombre de usuario
              </label>
              <input
                type="text"
                placeholder="Username"
                id="formGridUsername"
                name="newUser.username"
                value={newUser.username}
                onChange={(e) => this.handleOnChangeInputForm(e)}
                className="block w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="formGridEmail" className="block font-semibold">
                Email
              </label>
              <input
                type="text"
                placeholder="Email"
                id="formGridEmail"
                name="newUser.email"
                value={newUser.email}
                onChange={(e) => this.handleOnChangeInputForm(e)}
                className="block w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="formGridValidatorType"
                className="block font-semibold"
              >
                Tipo de analista
              </label>
            </div>
            <button
              type="button"
              onClick={() => this.showModalCreate()}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Crear
            </button>
          </form>
        </div>
        {renderAnalysts()}
        <Modal
          show={this.state.showModal}
          onHide={() => this.setState({ showModal: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirmar eliminación</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {`¿Estás seguro que quieres borrar el usuario ${this.state.userToDelete.username}?`}
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              onClick={() => this.setState({ showModal: false })}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => this.confirmDeleteUser()}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Delete
            </button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.showModalCreate}
          onHide={() => this.setState({ showModalCreate: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirmar datos de nuevo usuario</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table className="table-auto">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Nombre</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Rol</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">
                    {this.state.newUser.username}
                  </td>
                  <td className="border px-4 py-2">
                    {this.state.newUser.email}
                  </td>
                  <td className="border px-4 py-2">
                    {this.state.newUser.role}
                  </td>
                </tr>
              </tbody>
            </table>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              onClick={() => this.setState({ showModalCreate: false })}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => this.confirmCreateUser()}
              className="bg-green-700 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Confirmar
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Analysts;
