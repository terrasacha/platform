import React, { Component } from 'react'

// Bootstrap
import { Container } from 'react-bootstrap'
// GraphQL
import { API, Auth, graphqlOperation } from 'aws-amplify'
import { listProducts } from '../../graphql/queries'
// Components
import Carousels from './Carousels'
import Features from './Features'
import HeaderNavbar from './Navbars/HeaderNavbar'
import Products from './Products'
import TermsAndConditions from './TermsAndConditions'


export default class LandingPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      products: [],
      productsImagesIsOnCarousel: [],
      isRenderCarousel: true,
      isRenderAboutUs: true,
      isRenderProducts: false,
      isRenderTermAndConditions: false
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
      case 'carousel':
        this.setState({
          isRenderCarousel: true,
          isRenderAboutUs: false,
          isRenderProducts: false,
          isRenderTermAndConditions: false
        })
        break
      case 'about_us':
        this.setState({
          isRenderCarousel: false,
          isRenderAboutUs: true,
          isRenderProducts: false,
          isRenderTermAndConditions: false
        })
        break
      case 'products':
        this.setState({
          isRenderCarousel: false,
          isRenderAboutUs: false,
          isRenderProducts: true,
          isRenderTermAndConditions: false
        })
        break
      case 'terms_and_conditions':
        this.setState({
          isRenderCarousel: false,
          isRenderAboutUs: false,
          isRenderProducts: false,
          isRenderTermAndConditions: true
        })
        break
      default:
        this.setState({
          isRenderCarousel: true,
          isRenderAboutUs: false,
          isRenderProducts: false,
          isRenderTermAndConditions: false
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
    let {isRenderCarousel, isRenderAboutUs, isRenderProducts, isRenderTermAndConditions} = this.state

    // Render Carousel
    const renderCarousel = () => {
      if (isRenderCarousel) {
        return (
          <Carousels productsImagesIsOnCarousel={this.state.productsImagesIsOnCarousel}></Carousels>
        )
      }
    }
    // Render About us
    const renderAboutUs = () => {
      if (isRenderAboutUs) {
        return (
          <Features></Features>
        )
      }
    }
    // Render About us
    const renderProducts = () => {
      if (isRenderProducts) {
        return (
          <Products products={this.state.products}></Products>
        )
      }
    }
    // Render Terms and Conditions
    const renderTermAndConditions = () => {
      if (isRenderTermAndConditions) {
        return (
          <TermsAndConditions />
        )
      }
    }

    return (
      <Container>
        <HeaderNavbar handleChangeRenderView={this.handleChangeRenderView} logOut={this.logOut}></HeaderNavbar>
        {renderAboutUs()}
        {renderCarousel()}
        {renderProducts()}
        {renderTermAndConditions()}
      </Container>
    )
  }
}
