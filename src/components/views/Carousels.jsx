import React, { Component } from 'react'
// Bootstrap
import { Carousel } from 'react-bootstrap'
// Import images

export default class Carousels extends Component {
  render() {
    let {productsImagesIsOnCarousel} = this.props
    const urlS3Image = 'https://kiosuanbcrjsappcad3eb2dd1b14457b491c910d5aa45dd145518-dev.s3.amazonaws.com/public/'
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
