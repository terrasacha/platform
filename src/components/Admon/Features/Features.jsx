import React, { Component } from 'react'
// Bootstrap
import { Container, Button } from 'react-bootstrap'

export default class Features extends Component {
    constructor(props) {
        super(props)
        this.state = {
            date: new Date(),
            isButtonDisable: true
        }
        this.handleChangeObjectElement = this.handleChangeObjectElement.bind(this)
    }

    render() {
        return (
        <Container>
            <Button 
                variant='primary'
                size='lg' 
                block
                onClick={this.handleChangeObjectElement}
                disabled={this.state.isButtonDisable}
            >Hola Ignacio</Button>
        </Container>
        )
    }
}
