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
const listUserValidators = `
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
      subrole
      status
      createdAt
    }
    nextToken
  }
}
`;
class Validators extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validators: [],
      newUser: {
        id: "",
        username: "",
        email: "",
        role: "validator",
        subRole: "financial",
      },
      showModal: false,
      showModalCreate: false,
      userToDelete: { id: null, username: null },
    };
    this.handleCRUDUser = this.handleCRUDUser.bind(this);
  }

  componentDidMount = async () => {
    // OnCreate User
    await this.loadValidatorUsers();
    this.createValidatorListener = API.graphql(
      graphqlOperation(onCreateUser)
    ).subscribe({
      next: (createdUser) => {
        this.loadValidatorUsers();
      },
    });
    this.deleteValidatorListener = API.graphql(
      graphqlOperation(onDeleteUser)
    ).subscribe({
      next: (deleteUser) => {
        this.loadValidatorUsers();
      },
    });
    this.updateUserListener = API.graphql(
      graphqlOperation(onUpdateUser)
    ).subscribe({
      next: (updatedUserData) => {
        let tempValidators = this.state.validators.map((mapValidators) => {
          if (updatedUserData.value.data.onUpdateUser.id === mapValidators.id) {
            return updatedUserData.value.data.onUpdateUser;
          } else {
            return mapValidators;
          }
        });
        this.setState({ validators: tempValidators });
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
      .then((result) => {
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
    // Set the user to delete and show the modal
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
        showModal: false, // Hide the modal after confirmation
      });
    }
  }
  async loadValidatorUsers() {
    let filter = {
      role: {
        contains: "validator",
      },
    };
    const listUsersResult = await API.graphql({
      query: listUserValidators,
      variables: { filter: filter },
    });
    this.setState({ validators: listUsersResult.data.listUsers.items });
  }
  handleOnChangeInputForm = async (event) => {
    let tempNewUser = this.state.newUser;
    if (event.target.name === "newUser.username") {
      tempNewUser.username = event.target.value;
    }
    if (event.target.name === "newUser.email") {
      tempNewUser.email = event.target.value;
    }
    if (event.target.name === "newUser.subRole") {
      tempNewUser.subRole = event.target.value;
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
        role: "Validador",
        subRole: "financial",
      },
      showModalCreate: false,
    });
  }
  async signUp() {
    const { username, email, role, subRole } = this.state.newUser;
    if (username !== "" && email !== "") {
      try {
        const userPayload = {
          id: uuidv4().split("-")[4],
          name: username,
          email: email,
          isProfileUpdated: false,
          role: `${role}_${subRole}`,
        };
        await API.graphql(graphqlOperation(createUser, { input: userPayload }));
      } catch (error) {
        console.log(
           "El nombre de usuario ya existe. Por favor, escoja otro."
        );
      }
    } else {
      console.log("Agregar usuario e email");
    }
  }
  render() {
    let { validators, newUser } = this.state;

    const renderValidators = () => {
      if (validators.length > 0) {
        return (
          <div className="container mx-auto mt-8 bg-white p-4 rounded-lg shadow-sm mb-4">
            <h4 className="text-lg font-semibold mb-4">Lista Validadores</h4>
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Nombe</th>
                    <th className="border px-4 py-2">Email</th>
                    <th className="border px-4 py-2">Subrol</th>
                    <th className="border px-4 py-2">Creado:</th>
                    <th className="border px-4 py-2">Confirmacion</th>
                    <th className="border px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {validators.map((validator) => (
                    <tr key={validator.id}>
                      <td className="border px-4 py-2">{validator.name}</td>
                      <td className="border px-4 py-2">{validator.email}</td>
                      <td className="border px-4 py-2">{validator.subrole}</td>
                      <td className="border px-4 py-2">
                        {`${validator.createdAt.split("T")[0].split("-")[2]}-${
                          validator.createdAt.split("T")[0].split("-")[1]
                        }-${validator.createdAt.split("T")[0].split("-")[0]}`}
                      </td>
                      <td className="border px-4 py-2">
                        {validator.isProfileUpdated ? "Confirmado" : "Pendiente"}
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ${
                            !validator.isProfileUpdated
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          disabled={!validator.isProfileUpdated}
                          onClick={() =>
                            this.showModalDelete({
                              id: validator.id,
                              username: validator.name,
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
          <h4 className="text-lg">Crear un nuevo validador</h4>
          <form className="mt-4">
            <div className="mb-4">
              <label htmlFor="formGridUsername" className="block font-semibold">
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
               Tipo de validador
              </label>
              <select
                id="formGridValidatorType"
                name="newUser.subRole"
                value={newUser.subRole}
                onChange={(e) => this.handleOnChangeInputForm(e)}
                className="block w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-blue-500"
              >
                <option value="financial">Financiero</option>
                <option value="technical">Técnico</option>
                <option value="fullaccessvalidator">Full access</option>
              </select>
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
        {renderValidators()}
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
                  <th className="border px-4 py-2">Sub rol</th>
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
                  <td className="border px-4 py-2">
                    {this.state.newUser.subRole}
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
              Cancelar
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

export default Validators;