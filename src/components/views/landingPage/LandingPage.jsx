import React, { Component } from 'react'

// Bootstrap
import { Container } from 'react-bootstrap'
// GraphQL
import { API, Auth, graphqlOperation } from 'aws-amplify'
import { listProducts } from '../../../graphql/queries'
// Components
import HeaderNavbar from '../Navbars/HeaderNavbar'
import Products from '../Products'
import s from './LandingPage.module.css'

export default class LandingPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      products: [],
      isRenderProducts: false,
    }
    this.handleChangeRenderView = this.handleChangeRenderView.bind(this)
    this.logOut = this.logOut.bind(this)
  }

  componentDidMount = async () => {
    await this.loadProducts()
  }

  async loadProducts() {
    const listProductsResult = await API.graphql(graphqlOperation(listProducts))
    let tempProductsImagesIsOnCarousel = this.state.productsImagesIsOnCarousel
    let tempListProductsResult = listProductsResult.data.listProducts.items.map((product) => {
        // Ordering images
        product.images.items.sort((a, b) => (a.order > b.order) ? 1 : -1)
        // Adding is on carousel images
        product.images.items.map( (image) => {
          if (image.isOnCarousel) { 
            tempProductsImagesIsOnCarousel.push(image)
          }
          return image
        })
        return product
    })
    tempListProductsResult.sort((a, b) => (a.order > b.order) ? 1 : -1)
    this.setState({products: tempListProductsResult, productsImagesIsOnCarousel: tempProductsImagesIsOnCarousel})
}

  async handleChangeRenderView(pView) {
    console.log('handleChangeRenderView: ')
    switch(pView) {
      case 'products':
        this.setState({
          isRenderProducts: true,
        })
        break
      default:
        this.setState({
          isRenderProducts: false,
        })
        break
    }
  }
  async logOut(){
    await Auth.signOut()
    window.location.href="/"
    localStorage.removeItem('role')
  }

  render() {
    let { isRenderProducts } = this.state

    // Render About us
    const renderProducts = () => {
      if (isRenderProducts) {
        return (
          <Products products={this.state.products}></Products>
        )
      }
    }

    return (
      <div style={{minHeight: '100vh'}}>
        <HeaderNavbar handleChangeRenderView={this.handleChangeRenderView} logOut={this.logOut}></HeaderNavbar>
        <div className={s.container}>
          <h3>Lorem ipsum dolor</h3>
          <h3>sit amet consectetur</h3>
          <h1>adipisicing elit Ducimus</h1>
          <p>Una plataforma para invertir en activos  ambientales en desarrollo ,
              fácil, rápido y seguro.</p>
          <button>EXPLORE TOKENS</button>
        </div>
        <div className={s.titleContainerProducts}>
            <h3>Featured Projects</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore quidem nulla blanditiis odio dolorem exercitationem culpa nobis ea nam deleniti accusamus corporis, animi hic magnam a illum </p>
        </div>
        {renderProducts()}
        <div className={s.contactContainer}>
            <h2>Ponte en contacto</h2>
            <button>Contact Us</button>
        </div>
      </div>
    )
  }
}
