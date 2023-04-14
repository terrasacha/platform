import React, { Component } from 'react'

// Bootstrap
import { Carousel } from 'react-bootstrap'
// GraphQL
import { API, Auth, graphqlOperation } from 'aws-amplify'
import { listProducts } from '../../../graphql/queries'
// Util
import WebAppConfig from '../../common/_conf/WebAppConfig'
// Components
import HeaderNavbar from '../Navbars/HeaderNavbar'
import Products from '../Products'
import s from './LandingPage.module.css'
import ProductCard from '../../productCard/ProductCard'

export default class LandingPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      productsLanding: [],
      productsImagesIsOnCarousel: []
    }
    this.logOut = this.logOut.bind(this)
  }

  componentDidMount = async () => {
    await this.loadProducts()
  }

  async loadProducts() {
    const limit = 6;
    const filter = {
    isActive: {eq: true}
    }
    const query = `query ListProducts($limit: Int, $filter: ModelProductFilterInput) {
      listProducts(limit: $limit, filter: $filter) {
        items {
          id
          name
          description
          isActive
          counterNumberOfTimesBuyed
          amountToBuy
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
              isVerifable
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

    const variables = { limit, filter };

    const listProductsResult = await API.graphql(graphqlOperation(query, variables));
    /* let tempProductsImagesIsOnCarousel = this.state.productsImagesIsOnCarousel */
    let tempListProductsResult = listProductsResult.data.listProducts.items.map((product) => {
/*         // Ordering images
        product.images.items.sort((a, b) => (a.order > b.order) ? 1 : -1)
        // Adding is on carousel images
        product.images.items.map( (image) => {
          if (image.isOnCarousel) { 
            tempProductsImagesIsOnCarousel.push(image)
          }
          return image
        }) */
        return product
    })
    tempListProductsResult.sort((a, b) => (a.order > b.order) ? 1 : -1)
    tempListProductsResult = tempListProductsResult.filter(product => product.images.items.length > 0 && product.productFeatures.items.length > 0)
    this.setState({productsLanding: tempListProductsResult/* , productsImagesIsOnCarousel: tempProductsImagesIsOnCarousel */})
}
  async logOut(){
    await Auth.signOut()
    window.location.href="/"
    localStorage.removeItem('role')
  }

  render() {
    const urlS3Image = WebAppConfig.url_s3_public_images
    return (
      <div style={{minHeight: '100vh'}}>
        <HeaderNavbar logOut={this.logOut}></HeaderNavbar>
{/*         <Carousel>
        {this.state.productsImagesIsOnCarousel.map((image, idx) => (
            <Carousel.Item key={idx}>
                <img
                className="d-block w-100"
                src={urlS3Image+image.imageURL}
                alt="First slide"
                />
                <Carousel.Caption>
                <h3>{image.carouselLabel}</h3>
                <p>{image.carouselDescription}</p>
                </Carousel.Caption>
                </Carousel.Item>
        ))}
        </Carousel> */}
        <div className={s.container}>
          <h1>Aceleramos la
              transición hacia un
              mundo de
              carbono neutral</h1>
          <p>Una plataforma para invertir en activos  ambientales en desarrollo ,
              fácil, rápido y seguro.</p>
          {/* <button>EXPLORE MARKET</button> */}
        </div>
        <div className={s.titleContainerProducts}>
          <h1 className={s.title}>Proyectos que puedes apoyar</h1>
            {/* <h3>Featured Projects</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore quidem nulla blanditiis odio dolorem exercitationem culpa nobis ea nam deleniti accusamus corporis, animi hic magnam a illum </p> */}
        </div>
        <div  className={s.containerFeaturedProducts}>
          {this.state.productsLanding.map(product => <ProductCard product={product} urlS3Image={urlS3Image} key={product.id}/>)}
        </div>
        <div className={s.contactContainer}>
            <h2>Conoce más acerca de Suan</h2>
            <a href='https://suan.global/about_us'><button>Conocer más</button></a>
        </div>
      </div>
    )
  }
}
