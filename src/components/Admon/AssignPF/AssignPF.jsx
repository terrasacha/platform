import React, { Component } from "react";
//Bootstrap
import {
  Button,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
// GraphQL
import { API, graphqlOperation } from "aws-amplify";
import { v4 as uuidv4 } from "uuid";
import {
  createUserProduct,
  updateUser,
  createVerification,
  deleteUserProduct,
} from "../../../graphql/mutations";
import {
  onCreateUserProduct,
  onCreateVerification,
  onDeleteUserProduct,
} from "../../../graphql/subscriptions";
import { listUsers } from "../../../graphql/queries";
import { graphql } from "graphql";
import { XIcon } from "components/common/icons/XIcon";
import { notify } from "utilities/notify";

export const listproductsAssignPF = /* GraphQL */ `
  query Listproducts(
    $filter: ModelProductFeatureFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listproducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        isVerifable
        product {
          name
          description
          userProducts {
            items {
              id
              user {
                name
                role
                id
              }
            }
          }
        }
        featureID
        feature {
          id
          name
          description
          isVerifable
          featureTypeID
        }
        documents {
          items {
            status
          }
        }
        verifications {
          items {
            id
            userVerifiedID
            userVerifierID
            userVerifier {
              name
            }
          }
        }
      }
      nextToken
    }
  }
`;
export const listProductsAssign = /* GraphQL */ `
  query ListProducts(
    $filter: ModelProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        categoryID
        productFeatures {
          items {
            id
            product {
              userProducts {
                items {
                  id
                  user {
                    name
                    role
                    id
                  }
                }
              }
            }
            featureID
            feature {
              id
              name
              description
              isVerifable
              featureTypeID
            }
            documents {
              items {
                id
                status
              }
            }
            verifications {
              items {
                id
                userVerifiedID
                userVerifierID
                userVerifier {
                  name
                }
              }
            }
          }
        }
        userProducts {
          items {
            id
            user {
              name
              role
              id
            }
          }
        }
        transactions {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
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
export default class AssignPF extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      usersCopy: [],
      products: [],
      showModalRole: false,
      userSelected: null,
      productselected: null,
    };
    this.loadUsers = this.loadUsers.bind(this);
    this.loadProducts = this.loadProducts.bind(this);
    this.handleSelectUser = this.handleSelectUser.bind(this);
    this.handleSelectProduct = this.handleSelectProduct.bind(this);
    this.handleAssignProduct = this.handleAssignProduct.bind(this);
  }
  componentDidMount = async () => {
    Promise.all([this.loadUsers(), this.loadProducts()]);

    this.createUserProductListener = API.graphql(
      graphqlOperation(onCreateUserProduct)
    ).subscribe({
      next: () => {
        this.loadProducts();
      },
    });
    this.deleteUserProductListener = API.graphql(
      graphqlOperation(onDeleteUserProduct)
    ).subscribe({
      next: () => {
        this.loadProducts();
      },
    });
  };
  async loadUsers() {
    let filter = {
      role: {
        eq: "validator",
      },
    };
    const listUsersResults = await API.graphql({
      query: listUserValidators,
      variables: { filter: filter },
    });
    this.setState({
      users: listUsersResults.data.listUsers.items,
      usersCopy: listUsersResults.data.listUsers.items,
    });
  }
  async loadProducts() {
    const listproductsResults = await API.graphql({
      query: listProductsAssign,
    });
    let productTemplates = listproductsResults.data.listProducts.items.sort(
      (a, b) => {
        let nameA = a.name.toUpperCase();
        let nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      }
    );
    this.setState({ products: productTemplates });
  }
  handleSelectUser(user) {
    this.setState({ userSelected: user });
  }
  handleSelectProduct(product) {
    this.setState({ productselected: product });
  }
  assignRole(user) {
    this.handleSelectUser(user);
    this.setState({ showModalRole: true });
  }
  async handleAssignProduct() {
    const isSelectedValidatorAlreadyAssignedInProject =
      this.state.productselected.userProducts.items.some(
        (up) => up.user.id === this.state.userSelected.id
      );
    console.log(
      "isSelectedValidatorAlreadyAssignedInProject",
      isSelectedValidatorAlreadyAssignedInProject
    );
    if (!isSelectedValidatorAlreadyAssignedInProject) {
      let tempUserProduct = {
        productID: this.state.productselected.id,
        userID: this.state.userSelected.id,
      };
      await API.graphql(
        graphqlOperation(createUserProduct, { input: tempUserProduct })
      );
      notify({ msg: "Validador asignado", type: "success" });
    } else {
      notify({
        msg: "El validador ya se encuentra asignado al proyecto",
        type: "error",
      });
    }
    this.cleanState();
  }
  async handleRemoveValidatorFromProject(userProductId) {
    let tempDeleteUserProduct = {
      id: userProductId,
    };
    await API.graphql(
      graphqlOperation(deleteUserProduct, { input: tempDeleteUserProduct })
    );
  }
  cleanState() {
    this.setState({
      showModalRole: false,
      userSelected: null,
      productselected: null,
    });
  }
  render() {
    let { usersCopy, products, userSelected, productselected } = this.state;

    const renderUsers = () => {
      if (usersCopy.length > 0) {
        return (
          <div className="mx-auto mt-8">
            <h2 className="text-xl font-semibold mb-4">Users</h2>
            <table className="w-full border-collapse border border-gray-300 hover:border-blue-500">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Subrole</th>
                </tr>
              </thead>
              <tbody>
                {usersCopy?.map((user) => {
                  return (
                    <tr
                      key={user.id}
                      onClick={() => this.handleSelectUser(user)}
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      <td className="border px-4 py-2">{user.name}</td>
                      <td className="border px-4 py-2">{user.subrole}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }
    };

    const renderProducts = () => {
      console.log(products);
      if (products.length > 0) {
        return (
          <div className="mx-auto mt-8 ml-2">
            <h2 className="text-xl font-semibold mb-4">Products</h2>
            <table className="w-full border-collapse border border-gray-300 hover:border-blue-500">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2">Proyecto</th>
                  <th className="px-4 py-2">Categoría</th>
                  <th className="px-4 py-2">Verificadores</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product) => {
                  let verificadores = product.userProducts.items.filter(
                    (up) => up.user.role === "validator"
                  );
                  return (
                    <tr
                      key={product.id}
                      onClick={() => this.handleSelectProduct(product)}
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      <td className="border px-4 py-2">{product.name}</td>
                      <td className="border px-4 py-2">{product.categoryID}</td>
                      <td className="border px-4 py-2">
                        <ul className="list-none p-0">
                          {verificadores.length > 0 ? (
                            verificadores.map((v) => (
                              <li key={v.id} className="mb-2">
                                <div className="flex items-center">
                                  {v.user.name}
                                  <button
                                    className="ml-2 text-white bg-red-500 border border-red-600 rounded-sm w-6 h-6 flex items-center justify-center"
                                    onClick={() =>
                                      this.handleRemoveValidatorFromProject(
                                        v.id
                                      )
                                    }
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      className="w-4 h-4"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M14.293 5.293a1 1 0 011.414 1.414L11.414 12l4.293 4.293a1 1 0 11-1.414 1.414L10 13.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 12 4.293 7.707a1 1 0 111.414-1.414L10 10.586l4.293-4.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </li>
                            ))
                          ) : (
                            <li>Sin asignar</li>
                          )}
                        </ul>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }
    };

    const renderUserProducts = () => {
      if (products.length > 0) {
        return (
          <div className="mx-auto mt-8">
            <h2 className="text-xl font-semibold mb-4">Products</h2>
            <table className="w-full border-collapse border border-gray-300 hover:border-blue-500">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2">Proyecto</th>
                  <th className="px-4 py-2">Categoría</th>
                  <th className="px-4 py-2">Verificadores</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product) => {
                  let verificadores = product.userProducts.items.filter(
                    (up) => up.user.role === "validator"
                  );
                  return (
                    <tr
                      key={product.id}
                      onClick={() => this.handleSelectProduct(product)}
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      <td className="border px-4 py-2">{product.name}</td>
                      <td className="border px-4 py-2">{product.categoryID}</td>
                      <td className="border px-4 py-2">
                        <ul className="list-none p-0">
                          {verificadores.length > 0 ? (
                            verificadores.map((v) => (
                              <li key={v.id}>{v.user.name}</li>
                            ))
                          ) : (
                            <li>Sin asignar</li>
                          )}
                        </ul>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }
    };

    return (
      <div className="container mx-auto">
        <div className="container">
          <h2 className="text-2xl font-semibold">Assign Product</h2>
          <form>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="col-span-1">
                <label htmlFor="user" className="block mb-1">
                  User
                </label>
                <input
                  id="user"
                  type="text"
                  placeholder="Seleccionar un usuario"
                  value={userSelected ? userSelected.name : ""}
                  onChange={() => ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  readOnly
                />
              </div>
              <div className="col-span-1">
                <label htmlFor="project" className="block mb-1">
                  Proyecto
                </label>
                <input
                  id="project"
                  type="text"
                  placeholder="Seleccionar un proyecto"
                  value={productselected ? productselected.name : ""}
                  onChange={() => ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  readOnly
                />
              </div>
            </div>

            <div className="mt-4">
              <button
                type="button"
                className={`px-4 py-2 bg-blue-500 text-white rounded-md ${
                  userSelected && productselected
                    ? ""
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!userSelected || !productselected}
                onClick={() => this.handleAssignProduct()}
              >
                ASIGNAR VERIFICADOR
              </button>
            </div>
          </form>
        </div>

        <div className="flex flex-col md:flex-row mt-4 h-96 overflow-auto">
          <div className="md:w-2/5 overflow-auto">{renderUsers()}</div>
          <div className="md:w-3/5 overflow-auto">{renderProducts()}</div>
        </div>

        <div>{renderUserProducts()}</div>
      </div>
    );
  }
}
