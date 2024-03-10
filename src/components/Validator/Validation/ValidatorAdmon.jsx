import React, { Component } from "react";

//Bootstrap
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import Container from '../../ui/Container';
import Stack from '../../ui/Stack';
import Badge from '../../ui/Badge';

import HeaderNavbar from "../../Investor/Navbars/HeaderNavbar";
// GraphQL
import { API, Auth, graphqlOperation, Storage } from "aws-amplify";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { listProducts } from "../../../utilities/customQueries";
import {
  getImagesCategories,
  getYearFromAWSDatetime,
} from "../../Constructor/ProjectPage/utils";

export const listDocuments = /* GraphQL */ `
  query ListDocuments(
    $filter: ModelDocumentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDocuments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        data
        timeStamp
        docHash
        signedHash
        signed
        url
        signed
        signedHash
        isApproved
        status
        isUploadedToBlockChain
        productFeatureID
        productFeature {
          id
          value
          isToBlockChain
          order
          isOnMainCard
          productID
          featureID
          createdAt
          updatedAt
          feature {
            name
            id
            isVerifable
            description
            featureType {
              id
              name
            }
          }
          product {
            id
            name
            transactions {
              items {
                id
              }
            }
            category {
              name
            }
            productFeatures {
              items {
                id
                featureID
                value
              }
            }
          }
          verifications {
            items {
              id
              userVerifierID
              userVerifier {
                name
              }
              userVerifiedID
              userVerified {
                name
              }
              updatedOn
              sign
              createdOn
              verificationComments {
                items {
                  comment
                  createdAt
                  id
                  isCommentByVerifier
                  verificationID
                }
              }
            }
          }
        }
        userID
        user {
          id
          name
          dateOfBirth
          isProfileUpdated
          addresss
          cellphone
          role
          status
          email
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
class ValidatorAdmon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      actualUser: "",
      documents: [],
      tokenPrices: {},
      tokenNames: {},
      amountTokens: {},
      documentsPending: [],
      otherDocuments: [],
      featuresVerifables: [],
      showPending: true,
      showOther: false,
      isShowProductDocuments: true,
      isShowUsers: false,
      showModalDocument: false,
      showModalComments: false,
      showModalValidate: false,
      showModalDetailsValidation: false,
      selectedDocument: null,
      selectedDocumentID: null,
      selectedProductValidation: null,
      selectedProductVerificationID: null,
      creatingVerification: false,
      users: [],
      verification: {
        id: "",
        createdOn: "",
        updatedOn: "",
        sign: "",
        userVerifierID: "",
        userVerifiedID: "",
        productFeatureID: "",
        documentStatus: "",
      },
      newVerificationComment: {
        verificationID: "",
        isCommentByVerifier: true,
        comment: "",
      },
    };
    this.changeHeaderNavBarRequest = this.changeHeaderNavBarRequest.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  componentDidMount = async () => {
    let actualUser = await Auth.currentAuthenticatedUser();
    actualUser = actualUser.attributes.sub;
    this.setState({ actualUser: actualUser });

    await this.loadVerifierProducts();
  };

  async loadVerifierProducts() {
    const response = await API.graphql(graphqlOperation(listProducts));
    const verifierAssignedProducts = response.data.listProducts.items.filter(
      (product) => {
        const isProjectVerifier = product.userProducts?.items.some(up => up.user.id === this.state.actualUser);
        return isProjectVerifier;
      }
    );

    this.setState({ products: verifierAssignedProducts });
  }
  async changeHeaderNavBarRequest(pRequest) {
    if (pRequest === "product_documents") {
      this.setState({
        isShowProductDocuments: true,
        isShowUsers: false,
      });
    }
    if (pRequest === "users") {
      this.setState({
        isShowProductDocuments: false,
        isShowUsers: true,
      });
    }
  }
  async logOut() {
    await Auth.signOut();
    window.location.href = "/";
    localStorage.removeItem("role");
  }

  render() {
    const { products } = this.state;
    const renderValidatingProjects = () => {
      console.log("products", products);
      if (products) {
        return (
          <>
          <h2 className="mt-5">Tus Proyectos Asignados</h2>
          <div className="row row-cols-1 row-cols-sm-3 g-2 m-4">
            {products.length > 0 &&
              products.map((product, index) => {
                return (
                  <div className="p-3">
                  <div key={product.id} className="p-0">
                    <img
                      className="w-full h-48 object-cover"
                      src={getImagesCategories(product.categoryID)}
                      alt="Hola"
                    />
                    <div className="p-4">
                      <div className="flex">
                        <span className="bg-primary text-white px-2 py-1 mr-2">
                          {getYearFromAWSDatetime(product.createdAt)}
                        </span>
                        <span className="bg-primary text-white px-2 py-1">
                          {product.categoryID}
                        </span>
                      </div>
                      <p className="text-lg my-2">{product.name}</p>
                      <hr className="my-2" />
                      <p className="text-base my-2">{product.description}</p>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-center items-center">
                        <a href={"project/" + product.id}>
                          <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                            Ver más
                          </button>
                        </a>
                      </div>
                    </div>
                  </div>

                  </div>
                );
              })}
          </div>
        </>
        );
      } else {
        return <div>is loading ...</div>;
      }
    };
    return (
      <Container style={{ paddingTop: 70, minHeight: "100vh" }}>
        <HeaderNavbar
          logOut={this.logOut}
          changeHeaderNavBarRequest={this.changeHeaderNavBarRequest}
    ></HeaderNavbar>
        <ToastContainer />
        {renderValidatingProjects()}
      </Container>
    );
  }
}
export default ValidatorAdmon;
