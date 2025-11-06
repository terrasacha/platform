import React, { Component, useState } from "react";

// GraphQL
import { API, Auth, graphqlOperation } from "aws-amplify";
// Util
import WebAppConfig from "../../common/_conf/WebAppConfig";
// Components
import ProductCard from "../../productCard/ProductCard";
import marketImage from "../_images/projecto.png";
import drones from "../_images/drone-con-camara.png";
import blockchain from "../_images/cadena-de-bloques.png";
import plataforma from "../_images/diseno-de-respuesta.png";
import DropDownProjects from "components/common/DropDownProjects";
import NewHeaderNavbar from "components/common/NewHeaderNavbar";
import { navigate } from "../../../utilities/navigate";

export default class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productsLanding: [],
      productsImagesIsOnCarousel: [],
      userLogged: false,
      show: false
    }
    this.logOut = this.logOut.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
  }

  componentDidMount = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser()
      this.setState({ userLogged: { username: user.username, role: user.attributes["custom:role"] } })
    } catch (error) {

    }
    //await this.loadProducts()
  }
  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    if (this.state.userLogged && this.state.userLogged.role === 'constructor') return navigate('/new_campaign');
    this.setState({ show: true });
  }

  async loadProducts() {
    const limit = 6;
    const query = `query ListProducts($limit: Int) {
      listProducts(limit: $limit) {
        items {
          id
          name
          description
          isActive
          order
          status
          categoryID
          category {
            id
            name
            isSelected
            createdAt
            updatedAt
          }
          images {
            nextToken
            items {
              id
              imageURL
              carouselDescription
              carouselLabel
              format
              isOnCarousel
              isActive
              imageURLToDisplay
              title
              productID
              order
            }
          }
          productFeatures {
            items {
              id
              isToBlockChain
              value
              productID
              feature {
                id
                name
                isTemplate
                description
                featureType {
                  name
                  id
                  description
                }
                unitOfMeasure {
                  engineeringUnit
                  id
                }
              }
              productFeatureResults {
                items {
                  id
                  isActive
                  result {
                    id
                    value
                    formula {
                      id
                      equation
                    }
                  }
                }
              }
            }
          }
          userProducts {
            nextToken
          }
          createdAt
          updatedAt
        }
        nextToken 
      }
    }`;

    const listProductsResult = await API.graphql(graphqlOperation(query));
    /* let tempProductsImagesIsOnCarousel = this.state.productsImagesIsOnCarousel */
    let tempListProductsResult = listProductsResult.data.listProducts.items.map(
      (product) => {
        return product;
      }
    );
    tempListProductsResult.sort((a, b) => (a.order > b.order ? 1 : -1));
    let productsLanding = [];
    tempListProductsResult.map((product) => {
      if (
        product.images.items.length > 0 &&
        product.productFeatures.items.length > 0 &&
        product.status !== "draft" &&
        product.status !== "rejected"
      )
        productsLanding.push(product);
    });
    this.setState({
      productsLanding:
        productsLanding /* , productsImagesIsOnCarousel: tempProductsImagesIsOnCarousel */,
    });
  }
  async logOut() {
    await Auth.signOut();
    localStorage.removeItem("role");
    navigate("/");
  }

  render() {
    const urlS3Image = WebAppConfig.url_s3_public_images;
    return (
      <div className="min-h-screen bg-gradient-to-br from-terrasacha-primary to-terrasacha-secondary2">
        <NewHeaderNavbar/>
        
        {/* Hero Section */}
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-terrasacha-dark text-white overflow-hidden animate-fade-in">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90"
            style={{
              backgroundImage: `url('/nature.png')`,
            }}
          ></div>
          <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 animate-slide-up">
              Aceleramos la transición hacia un<br />
              mundo de <span className="text-terrasacha-earth">carbono neutral</span>
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl mb-12 max-w-4xl mx-auto animate-slide-up" style={{animationDelay: '0.3s'}}>
              Una <strong>plataforma</strong> para <strong>invertir</strong> en<br />
              <strong>activos ambientales</strong> en desarrollo,<br />
              fácil, rápido y seguro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{animationDelay: '0.6s'}}>
              {!this.state.userLogged && (
                <button 
                  className="bg-terrasacha-secondary2 hover:bg-terrasacha-primary text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-terrasacha-lg"
                  onClick={this.handleShow}
                >
                  Tengo un proyecto
                </button>
              )}
              <DropDownProjects className="bg-white hover:bg-terrasacha-earth text-terrasacha-secondary1 font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-terrasacha-lg"/>
            </div>
          </div>
        </div>

        {/* Modal */}
        {this.state.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-scale-in">
            <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 shadow-terrasacha-2xl">
              {/* Modal Header */}
              <div className="bg-terrasacha-earth border-b border-terrasacha-light rounded-t-2xl p-6 flex justify-between items-center">
                <span className="text-terrasacha-secondary1 font-bold text-center w-full text-xl">
                  ¿CÓMO POSTULAR MI PROYECTO?
                </span>
                <button
                  onClick={this.handleClose}
                  className="text-terrasacha-secondary1 hover:text-terrasacha-primary transition-all duration-300 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              {/* Modal Body */}
              <div className="p-6">
                <ol className="space-y-4 text-terrasacha-secondary1">
                  <li className="flex items-start">
                    <span className="bg-terrasacha-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                    <span>Da Click en Registrarme y completa tus datos, escoge en rol <strong>Propietario</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-terrasacha-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                    <span>Ve a Perfil y luego a postular proyecto</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-terrasacha-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                    <span>Completa la información de tu proyecto</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-terrasacha-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                    <span>Tu proyecto será revisado y complementado por nuestros Consultores</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-terrasacha-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">5</span>
                    <span>Revisa la información adicional y aceptala, para que quede publicado en el Marketplace</span>
                  </li>
                </ol>
              </div>
              
              {/* Modal Footer */}
              <div className="bg-terrasacha-earth border-t border-terrasacha-light rounded-b-2xl p-6 text-center">
                <a 
                  className="bg-terrasacha-primary hover:bg-terrasacha-secondary1 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-terrasacha inline-block" 
                  href='/login'
                >
                  Registrarme
                </a>
              </div>
            </div>
          </div>
        )}

        {/* CO2 Reduction Section */}
        <div className="bg-gradient-terrasacha-subtle py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold text-terrasacha-secondary1 mb-6">
                  REDUCIMOS EL CO2
                </h2>
                <p className="text-lg text-terrasacha-secondary1 leading-relaxed">
                  Adquiere la capacidad de <strong>neutralizar carbono</strong>,
                  respalda la agricultura regenerativa y genera un impacto en el
                  que puedas confiar plenamente.
                </p>
                <p className="text-lg text-terrasacha-secondary1 leading-relaxed">
                  Cada Tonelada está respaldada por <strong>tecnología Blockchain</strong>, 
                  y se entrega con un certificado que ofrece una transparencia total sobre el
                  proyecto específico de eliminación de carbono.
                </p>
              </div>
              <div className="flex justify-center">
                <img
                  src={marketImage}
                  alt="imagen plataforma"
                  className="rounded-2xl shadow-terrasacha-xl max-w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Why Terrasacha Section */}
        <div className="bg-terrasacha-earth py-16" id="porque">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-terrasacha-secondary1 mb-16">
              ¿POR QUÉ TERRASACHA?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center space-y-4 p-6 rounded-xl bg-white shadow-terrasacha hover:shadow-terrasacha-lg transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-24 h-24 mx-auto bg-terrasacha-primary rounded-full flex items-center justify-center shadow-terrasacha">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="currentColor"
                    viewBox="0 -960 960 960"
                  >
                    <path d="M80-160v-120h80v-440q0-33 23.5-56.5T240-800h600v80H240v440h240v120H80Zm520 0q-17 0-28.5-11.5T560-200v-400q0-17 11.5-28.5T600-640h240q17 0 28.5 11.5T880-600v400q0 17-11.5 28.5T840-160H600Zm40-120h160v-280H640v280Zm0 0h160-160Z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-terrasacha-secondary1">Tecnología</h4>
                <p className="text-terrasacha-secondary1">
                  Nuestra plataforma se apalanca en tecnología blockchain para
                  lograr total transparencia en los proyectos
                </p>
              </div>
              
              <div className="text-center space-y-4 p-6 rounded-xl bg-white shadow-terrasacha hover:shadow-terrasacha-lg transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-24 h-24 mx-auto bg-terrasacha-primary rounded-full flex items-center justify-center shadow-terrasacha">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="currentColor"
                    viewBox="0 -960 960 960"
                  >
                    <path d="M480-80 120-280v-400l360-200 360 200v400L480-80ZM364-590q23-24 53-37t63-13q33 0 63 13t53 37l120-67-236-131-236 131 120 67Zm76 396v-131q-54-14-87-57t-33-98q0-11 1-20.5t4-19.5l-125-70v263l240 133Zm40-206q33 0 56.5-23.5T560-480q0-33-23.5-56.5T480-560q-33 0-56.5 23.5T400-480q0 33 23.5 56.5T480-400Zm40 206 240-133v-263l-125 70q3 10 4 19.5t1 20.5q0 55-33 98t-87 57v131Z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-terrasacha-secondary1">Confianza</h4>
                <p className="text-terrasacha-secondary1">
                  Tus inversiones se verán reflejadas en tokens que con el
                  tiempo aumentarán su valor
                </p>
              </div>
              
              <div className="text-center space-y-4 p-6 rounded-xl bg-white shadow-terrasacha hover:shadow-terrasacha-lg transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-24 h-24 mx-auto bg-terrasacha-primary rounded-full flex items-center justify-center shadow-terrasacha">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="currentColor"
                    viewBox="0 -960 960 960"
                  >
                    <path d="M280-80v-160H0l154-240H80l280-400 120 172 120-172 280 400h-74l154 240H680v160H520v-160h-80v160H280Zm389-240h145L659-560h67L600-740l-71 101 111 159h-74l103 160Zm-523 0h428L419-560h67L360-740 234-560h67L146-320Zm0 0h155-67 252-67 155-428Zm523 0H566h74-111 197-67 155-145Zm-149 80h160-160Zm201 0Z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-terrasacha-secondary1">Compromiso</h4>
                <p className="text-terrasacha-secondary1">
                  Estamos comprometidos 100% con el medio ambiente
                </p>
              </div>
              
              <div className="text-center space-y-4 p-6 rounded-xl bg-white shadow-terrasacha hover:shadow-terrasacha-lg transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-24 h-24 mx-auto bg-terrasacha-primary rounded-full flex items-center justify-center shadow-terrasacha">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="currentColor"
                    viewBox="0 -960 960 960"
                  >
                    <path d="M480-100q-79 0-148-30t-120.5-81.5Q160-263 130-332t-30-148q0-79 30-148t81.5-120.5Q263-800 332-830t148-30v-100l160 160-160 160v-100q-108 0-184 76t-76 184q0 66 30.5 122.5T332-266q16-28 47.5-47.5T452-338q-3-21-8-42t-12-39q-11 9-24 14t-28 5q-33 0-56.5-23.5T300-480v-40q0-17-5.5-32T280-580q50-1 89 9 34 9 62 29.5t29 61.5q0 9-1.5 16.5T453-448q-13-10-26-18t-27-14q17 13 39 40t41 64q20-49 50-96.5t70-87.5q-23 16-44 34t-41 38q-7-11-11-24.5t-4-27.5q0-42 29-71t71-29h40q23 0 38-6t25-14q11-9 17-20 4 67-7 120-9 45-34 82.5T600-440q-15 0-28.5-4T547-455q-7 19-16 50.5T517-337q38 7 67 26t44 45q51-35 81.5-91T740-480h120q0 79-30 148t-81.5 120.5Q697-160 628-130t-148 30Z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-terrasacha-secondary1">Experiencia</h4>
                <p className="text-terrasacha-secondary1">
                  Contamos con un equipo de expertos que se asegurarán de
                  completar y calificar cada proyecto.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Section */}
        <div className="bg-gradient-terrasacha-subtle py-16" id="tecnologia">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-terrasacha-secondary1 mb-16">
              NUESTRA TECNOLOGÍA
            </h2>
            
            <div className="space-y-16">
              {/* Blockchain */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="flex justify-center">
                  <div className="w-40 h-40 bg-terrasacha-primary rounded-full flex items-center justify-center shadow-terrasacha-xl">
                    <img
                      src={blockchain}
                      alt="blockchain"
                      className="w-24 h-24 object-contain"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-3xl font-bold text-terrasacha-secondary1">BLOCKCHAIN</h4>
                  <p className="text-lg text-terrasacha-secondary1 leading-relaxed">
                    Revolucionamos los mercados de carbono al hacer públicas e inmutables todas las transacciones, 
                    estableciendo un estándar inigualable de transparencia. Cada proceso de eliminación de carbono 
                    se origina, rastrea y completa en la cadena de bloques.
                  </p>
                </div>
              </div>

              <hr className="border-terrasacha-primary border-2" />

              {/* Drones */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-4 order-2 md:order-1">
                  <h4 className="text-3xl font-bold text-terrasacha-secondary1">DRONES</h4>
                  <p className="text-lg text-terrasacha-secondary1 leading-relaxed">
                    Utilizamos drones para la revisión de los terrenos y emitir
                    los resultados de la reducción de CO2
                  </p>
                </div>
                <div className="flex justify-center order-1 md:order-2">
                  <div className="w-40 h-40 bg-terrasacha-secondary2 rounded-full flex items-center justify-center shadow-terrasacha-xl">
                    <img
                      src={drones}
                      alt="drones"
                      className="w-24 h-24 object-contain"
                    />
                  </div>
                </div>
              </div>

              <hr className="border-terrasacha-primary border-2" />

              {/* Platform */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="flex justify-center">
                  <div className="w-40 h-40 bg-terrasacha-light rounded-full flex items-center justify-center shadow-terrasacha-xl">
                    <img
                      src={plataforma}
                      alt="plataforma"
                      className="w-24 h-24 object-contain"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-3xl font-bold text-terrasacha-secondary1">PLATAFORMA TERRASACHA</h4>
                  <p className="text-lg text-terrasacha-secondary1 leading-relaxed">
                    Ten control total de tus proyectos y de tus inversiones
                    desde nuestra plataforma, conecta facilmente tu wallet con
                    nosotros y obten tus tokens de manera inmediata.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Join Us Section */}
          <div className="bg-terrasacha-primary mt-24 py-16">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">
                SE PARTE DE NOSOTROS
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <DropDownProjects className="bg-white hover:bg-terrasacha-earth text-terrasacha-secondary1 font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-terrasacha-lg"/>
                {!this.state.userLogged && (
                  <button 
                    className="bg-terrasacha-secondary2 hover:bg-terrasacha-light text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-terrasacha-lg"
                    onClick={this.handleShow}
                  >
                    Tengo un proyecto
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Learn More Section */}
          <div className="container mx-auto px-4 py-16">
            <h2 className="text-4xl font-bold text-terrasacha-secondary1 mb-8 text-center">
              ¿Quieres conocer más?
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <a
                className="bg-white hover:bg-terrasacha-earth text-terrasacha-secondary1 font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-terrasacha-lg text-center"
                href="https://terrasacha.gitbook.io/terrasacha/readme/guia-de-usuario"
                target="_blank"
                rel="noreferrer"
              >
                ¿Como entrar?
              </a>
              <a
                className="bg-white hover:bg-terrasacha-earth text-terrasacha-secondary1 font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-terrasacha-lg text-center"
                href="https://terrasacha.gitbook.io/terrasacha"
                target="_blank"
                rel="noreferrer"
              >
                Documentación técnica
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

