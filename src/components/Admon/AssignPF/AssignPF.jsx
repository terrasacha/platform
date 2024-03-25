import React, { Component } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { v4 as uuidv4 } from 'uuid';
import {
  createUserProduct,
  updateUser,
  createVerification,
  deleteUserProduct,
} from '../../../graphql/mutations';
import {
  onCreateUserProduct,
  onCreateVerification,
  onDeleteUserProduct,
} from '../../../graphql/subscriptions';
import { listUsers } from '../../../graphql/queries';
import { XIcon } from 'components/common/icons/XIcon';
import { notify } from 'utilities/notify';

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
        eq: 'validator',
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
      'isSelectedValidatorAlreadyAssignedInProject',
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
      notify({ msg: 'Validador asignado', type: 'success' });
    } else {
      notify({
        msg: 'El validador ya se encuentra asignado al proyecto',
        type: 'error',
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
          <>
            <div className="flex items-center justify-between mb-5">
              <h2 className="mr-5">Users</h2>
            </div>
            <table className="w-full border-collapse border border-gray-500">
              <thead>
                <tr>
                  <th className="border border-gray-500">Name</th>
                  <th className="border border-gray-500">Subrole</th>
                </tr>
              </thead>
              <tbody>
                {usersCopy?.map((user) => {
                  return (
                    <tr
                      key={user.id}
                      onClick={(e) => this.handleSelectUser(user)}
                      className="cursor-pointer"
                    >
                      <td className="border border-gray-500">{user.name}</td>
                      <td className="border border-gray-500">{user.subrole}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        );
      }
    };
    const renderProducts = () => {
      console.log(products);
      if (products.length > 0) {
        return (
          <>
            <h2>Products</h2>
            <table className="w-full border-collapse border border-gray-500">
              <thead>
                <tr>
                  <th className="border border-gray-500">Proyecto</th>
                  <th className="border border-gray-500">Categoría</th>
                  <th className="border border-gray-500">Verificadores</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product) => {
                  let verificadores = product.userProducts.items.filter(
                    (up) => up.user.role === 'validator'
                  );
                  return (
                    <tr
                      key={product.id}
                      onClick={(e) => this.handleSelectProduct(product)}
                      className="cursor-pointer"
                    >
                      <td className="border border-gray-500">{product.name}</td>
                      <td className="border border-gray-500">{product.categoryID}</td>
                      <td className="border border-gray-500">
                        <ul className="list-none p-0">
                          {verificadores.length > 0
                            ? verificadores.map((v) => (
                                <li key={v.id}>
                                  <div className="flex items-center">
                                    {v.user.name}
                                    <button
                                      className="ml-2 text-red-500"
                                      onClick={() =>
                                        this.handleRemoveValidatorFromProject(
                                          v.id
                                        )
                                      }
                                    >
                                      <XIcon />
                                    </button>
                                  </div>
                                </li>
                              ))
                            : 'Sin asignar'}
                        </ul>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        );
      }
    };
    const renderUserProducts = () => {
      if (products.length > 0) {
        return (
          <>
            <h2>Products</h2>
            <table className="w-full border-collapse border border-gray-500">
              <thead>
                <tr>
                  <th className="border border-gray-500">Proyecto</th>
                  <th className="border border-gray-500">Categoría</th>
                  <th className="border border-gray-500">Verificadores</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product) => {
                  let verificadores = product.userProducts.items.filter(
                    (up) => up.user.role === 'validator'
                  );
                  return (
                    <tr
                      key={product.id}
                      onClick={(e) => this.handleSelectProduct(product)}
                      className="cursor-pointer"
                    >
                      <td className="border border-gray-500">{product.name}</td>
                      <td className="border border-gray-500">{product.categoryID}</td>
                      <td className="border border-gray-500">
                        <ul className="list-none p-0">
                          {verificadores.length > 0
                            ? verificadores.map((v) => (
                                <li key={v.id}>{v.user.name}</li>
                              ))
                            : 'Sin asignar'}
                        </ul>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        );
      }
    };
    return (
      <>
        <div classname="container mx-auto container mx-auto sm:px-4">
          <div classname="container container mx-auto sm:px-4">
            <h2>Assign Product</h2>
            <form>
              <div className="mb-2 grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="user" className="block text-sm font-medium text-gray-700">
                    User
                  </label>
                  <input
                    type="text"
                    id="user"
                    placeholder="Seleccionar un usuario"
                    value={
                      this.state.userSelected !== null
                        ? this.state.userSelected.name
                        : ''
                    }
                    onChange={() => ''}
                    className="mt-1 p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="project" className="block text-sm font-medium text-gray-700">
                    Proyecto
                  </label>
                  <input
                    type="text"
                    id="project"
                    placeholder="Seleccionar un proyecto"
                    value={
                      this.state.productselected !== null
                        ? `${this.state.productselected.name} `
                        : ''
                    }
                    onChange={() => ''}
                    className="mt-1 p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="mb-1">
                <button
                  type="button"
                  classname="btninline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline"
                  disabled={
                    userSelected === null || productselected === null
                      ? true
                      : false
                  }
                  onClick={() => this.handleAssignProduct()}
                >
                  ASIGNAR VERIFICADOR
                </button>
              </div>
            </form>
          </div>
          <div classname="container flex h-96 container mx-auto sm:px-4">
            <div classname="container overflow-auto w-2/5 container mx-auto sm:px-4">{renderUsers()}</div>
            <div classname="container overflow-auto container mx-auto sm:px-4">{renderProducts()}</div>
          </div>
          <div classname="container container mx-auto sm:px-4">{renderUserProducts()}</div>
        </div>
      </>
    );
  }
}
