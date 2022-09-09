import React, { Component } from 'react'
// Bootstrap
import { Carousel } from 'react-bootstrap'
// Import images

export default class Carousels extends Component {
  render() {
    let {productsImagesIsOnCarousel} = this.props
    const urlS3Image = 'https://kioproyectobrjsapp627f51dfee5f4a219ed7016e45916213406-dev.s3.amazonaws.com/public/'
    return (
        <Carousel>
            {productsImagesIsOnCarousel.map(image => (
                <Carousel.Item>
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
