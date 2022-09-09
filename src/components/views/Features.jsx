import React, { Component } from 'react'
// Bootstrap
import { Container } from 'react-bootstrap'
import './Views.css';

export default class Features extends Component {
  render() {
    return (
      <Container className='feature_block'>
        <h1>
        Construyamos juntos!
        </h1>
        <p >
          Haz parte del proyecto inmobiliario que mas te guste...
        </p>
      </Container>
    )
  }
}
