import React, { Component } from "react";
//Bootstrap
import { Container } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Stack from "react-bootstrap/Stack";
// GraphQL
import WebAppConfig from "../../common/_conf/WebAppConfig";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { createVerificationComment } from "../../../graphql/mutations";
import { getUser } from "../../../graphql/queries";
import { onCreateVerificationComment } from "../../../graphql/subscriptions";
import { getImagesCategories, getYearFromAWSDatetime } from "../ProjectPage/utils";

class ProductsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      vertificationComments: [],
      actualUserID: null,
      productToShow: null,
      isRenderModalProductAttachments: false,
      selectedIDProductToShow: null,
      selectedVerificableProductFeaturesToShow: null,
      productFeaturesVerificables: null,
      newVerificationComment: {
        verificationID: "",
        isCommentByVerifier: false,
        comment: "",
      },
    };
    this.handleHideModal = this.handleHideModal.bind(this);
    this.handleInputCreateVerificationComment =
      this.handleInputCreateVerificationComment.bind(this);
    this.handleCreateVerificaionComment =
      this.handleCreateVerificaionComment.bind(this);
  }

  componentDidMount = async () => {
    let actualUser = await Auth.currentAuthenticatedUser();
    const actualUserID = actualUser.attributes.sub;
    this.setState({
      actualUserID: actualUserID,
    });
    await this.loadUserProducts(actualUserID);

    this.createDocumentListener = API.graphql(
      graphqlOperation(onCreateVerificationComment)
    ).subscribe({
      next: async (createdVerificationComment) => {
        await this.loadUserProducts(actualUserID);
      },
    });
  };

  async loadUserProducts(ActualUserID) {
    let userResult = await API.graphql({
      query: getUser,
      variables: { id: ActualUserID },
    });
    let listUserProducts = userResult.data.getUser.userProducts.items;
    this.setState({
      products: listUserProducts,
      productFeaturesVerificables: listUserProducts,
    });
  }

  async handleHideModal(event, pModal) {
    if (pModal === "hide_modal_product_attatchments") {
      this.setState({
        isRenderModalProductAttachments:
          !this.state.isRenderModalProductAttachments,
      });
    }
  }

  async handleLoadModal(event, productID, pModal) {
    if (pModal === "show_modal_product_attatchments") {
      this.setState({
        isRenderModalProductAttachments: true,
        selectedIDProductToShow: productID,
      });
    }
  }

  async handleInputCreateVerificationComment(e) {
    if (e.target.name === "verificationComment") {
      await this.setState((prevState) => ({
        newVerificationComment: {
          ...prevState.newVerificationComment,
          comment: e.target.value,
        },
      }));
    }
  }

  async handleCreateVerificaionComment(verificationID) {
    await this.setState((prevState) => ({
      newVerificationComment: {
        ...prevState.newVerificationComment,
        verificationID: verificationID,
      },
    }));

    let tempNewVerificationComment = this.state.newVerificationComment;
    await API.graphql(
      graphqlOperation(createVerificationComment, {
        input: tempNewVerificationComment,
      })
    );
    await this.cleanState();
  }

  cleanState = () => {
    this.setState({
      newVerificationComment: {
        verificationID: null,
        isCommentByVerifier: false,
        comment: "",
      },
    });
  };

  render() {
    let { products } = this.state;
    console.log(products);
    const listAllUserProducts = () => {
      if (products) {
        return (
            <div className="row row-cols-1 row-cols-lg-3 g-2 mt-4">
              {products.map((product, index) => {
                return (
                  <Card key={product.productID} className="p-0">
                    <img
                      variant="top"
                      src={getImagesCategories(product?.product?.categoryID)}
                      style={{ height: "150px" }}
                      alt="Hola"
                    />
                    <Card.Body>
                      <div className="d-flex">
                        <Stack direction="horizontal" gap={2}>
                          <Badge bg="primary">{getYearFromAWSDatetime(product?.createdAt)}</Badge>
                          <Badge bg="primary">{product?.product?.categoryID}</Badge>
                        </Stack>
                      </div>
                      <p className="fs-5 my-2">{product?.product?.name}</p>
                      <hr className="mb-2" />
                      <p className="fs-6 my-2">
                        {product?.product?.description}
                      </p>
                    </Card.Body>
                    <Card.Footer>
                      <div className="d-flex justify-content-center align-items-center">
                        <a href={"project_details/" + product.productID}>
                          <Button oncli>Ver más</Button>
                        </a>
                      </div>
                    </Card.Footer>
                  </Card>
                );
              })}
            </div>
          // <Container className="mt-4 ">
          //   <Row xs={1} md={2} className="g-4">
          //     {products.map((product) => {
          //       return (
          //         <Col key={product.productID}>
          //           <Card>
          //             <Card.Img
          //               variant="top"
          //               src={`${url}${product.product.images.items[0]?.imageURL}`}
          //               style={{ height: "24rem", width: "auto" }}
          //             />
          //             <Card.Body>
          //               <Card.Title>
          //                 <h5>{product.product.name}</h5>
          //               </Card.Title>
          //               <Row className="my-3 px-3">
          //                 <Badge pill bg="primary">
          //                   {product.product.category.name}
          //                 </Badge>
          //               </Row>
          //               <div className="mb-2">
          //                 <div className="fw-bold">Fecha de inscripción:</div>
          //                 {product.createdAt}
          //               </div>
          //               <div className="mb-2">
          //                 <div className="fw-bold">Estado del proyecto:</div>
          //                 {product.product.status === "draft" ? (
          //                   "En espera"
          //                 ) : product.product.status === "verified" ? (
          //                   "Verificado"
          //                 ) : product.product.status === "in_blockchain" ? (
          //                   "En blockchain"
          //                 ) : product.product.status === "in_equilibrium" ? (
          //                   "Financiado"
          //                 ) : (
          //                   <XCircle size={25} color="#CC0000" />
          //                 )}
          //               </div>
          //               <div className="mb-2">
          //                 <div className="fw-bold">
          //                   Descripcion del proyecto:
          //                 </div>
          //                 <div style={scrollable}>
          //                   <Card.Text style={cardTextStyle}>
          //                     {product.product.description}
          //                   </Card.Text>
          //                 </div>
          //               </div>

          //               <div className="d-flex justify-content-center mt-3 px-2 ">
          //                 <a href={"/project_details/" + product.product.id}>
          //                   <Button variant="secondary">Ver detalles</Button>
          //                 </a>
          //               </div>
          //             </Card.Body>
          //             <Card.Footer>
          //               <small className="text-muted">
          //                 Last updated 3 mins ago
          //               </small>
          //             </Card.Footer>
          //           </Card>
          //         </Col>
          //       );
          //     })}
          //   </Row>
          // </Container>
        );
      }
    };

    return (
      <Container>
        <Container>{listAllUserProducts()}</Container>
      </Container>
    );
  }
}
export default ProductsList;
