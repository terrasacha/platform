import React, { Component } from 'react'
// Bootstrap
import { Carousel } from 'react-bootstrap'
// Utils
import WebAppConfig from '../common/_conf/WebAppConfig'

export default class Carousels extends Component {
  render() {
    let {productsImagesIsOnCarousel} = this.props
    const urlS3Image = WebAppConfig.url_s3_public_images
    return (
        <Carousel>
            {productsImagesIsOnCarousel.map((image, idx) => (
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
        </Carousel>

    )
  }
}
