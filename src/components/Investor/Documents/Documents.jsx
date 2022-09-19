import React, { Component } from 'react'
// Amplify
import { withAuthenticator } from '@aws-amplify/ui-react'
// Bootstrap
import { Container, Table, Row, Col, Card, ButtonGroup, ToggleButton, Button } from 'react-bootstrap'
// GraphQL
import { API, graphqlOperation } from 'aws-amplify'
import { listFeatures } from '../../../graphql/queries'
// import { createVerification, createDocument } from '../../../graphql/mutations'
// Auth css custom
import Bootstrap from "../../common/themes"

class Documents extends Component {

  constructor(props) {
    super(props)
    this.state = {
      user: '',
      features: [],
      userSelectList: [],
      isOrderToUpdate: false,
      radios: [
        { name: 'Buying', value: 'buying' },
        { name: 'To Location', value: 'to_location' },
        { name: 'Delivered', value: 'delivered' },
      ],
      radioValue: '1',
    }

    this.handleOnSelectUser = this.handleOnSelectUser.bind(this)
  }

  async componentDidMount() { 
    // if (this.props.user.id === '') {
    //   this.props.changeHeaderNavBarRequest('investor_profile')
    // } else {
    //   await this.loadFeaturesToBlockChain()
    // }
    await this.loadFeaturesToBlockChain()
  }


  async loadFeaturesToBlockChain() {
    // if (this.props.user.id !== '') {

      const filterIsToBlockChain = {
        filter: {isToBlockChain: {eq: true}},
        limit: 200
      }

      const listFeaturesResult = await API.graphql(graphqlOperation(listFeatures, filterIsToBlockChain))
      if (listFeaturesResult.data.listFeatures.items.length > 0) {
          let tempFeatures = listFeaturesResult.data.listFeatures.items
          // Featureing orders by ScheduleTimestamp (epoch)
          tempFeatures.sort((a, b) => (a.scheduleTimestamp > b.scheduleTimestamp) ? 1 : -1)
          this.setState({features: tempFeatures})
      }
      
    // }
    
  }

  
  handleOnSelectUser(event, pOrder) {
    let tempOrders = this.state.orders
    let indexFoundOrder = tempOrders.findIndex(order => order.id === pOrder.id)
    if (indexFoundOrder !== -1) {
      pOrder.userWillerID = event.value.id
      pOrder.userWiller = event.value
      tempOrders[indexFoundOrder] = pOrder
      this.setState({orders: tempOrders, isOrderToUpdate: true})
    }
  }

  async onChangeOrderStatus(event, pOrder) {
    await this.setState({radioValue: event.target.value})
    let tempOrders = this.state.orders
    let indexFoundOrder = tempOrders.findIndex(order => order.id === pOrder.id)
    if (indexFoundOrder !== -1) {
      pOrder.status = event.target.value
      tempOrders[indexFoundOrder] = pOrder
      this.setState({orders: tempOrders, isOrderToUpdate: true})
    }
  }

  async handleUOrder(event, pOrder) {
    // Updating Order
    const updateOrderPL = {
        id: pOrder.id,
        scheduleDate: pOrder.scheduleDate,
        scheduleTimestamp: pOrder.scheduleTimestamp,
        status: pOrder.status,
        paymentMethod: pOrder.paymentMethod,
        userClientID: pOrder.userClientID,
        userWillerID: pOrder.userWillerID,
    }
    // await API.graphql(graphqlOperation(updateOrder, {input: updateOrderPL}))
  }
  

  // RENDER
  render() {
    let {user, features, radios, radioValue, isOrderToUpdate} = this.state

    const conditionalRenderFeature = (pPurchase) => {
      if (pPurchase.feature !== null) {
          return (
              pPurchase.feature.name
          )
      } else {
          return (
              "N/A"
          )
      }
    }

    const renderOrderPurchases = (pOrder) => { 
      return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Cantidad</th>
                    <th>Característica</th>
                    <th>Recomendación</th>
                </tr>
            </thead>
            <tbody>
                    {pOrder.purchases.items.map(purchase => (
                        <tr key={purchase.product.id}>
                            <td>{purchase.product.name}</td>
                            <td>{purchase.quantity} {purchase.product.measure.name}</td>
                            <td>{conditionalRenderFeature(purchase)}</td>
                            <td>{purchase.recomendation}</td>
                        </tr>
                    ))}
            </tbody>
          </Table>
      )
    }

    const renderOrders = () => { 
      if (features.length > 0) {
        return (
            <Container>
              {features.map(feature => (
                <Row>

                  <Col>
                  <Card style={{ width: '18rem' }}>
                    <Card.Body>
                      <Card.Title>DOCUMENTS TO VERIFY</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">Name: {feature.name}</Card.Subtitle>
                      <Card.Text>
                        Description: {feature.description}
                      </Card.Text>
                      
                      <ButtonGroup>
                        {radios.map((radio, idx) => (
                          <ToggleButton
                              key={idx}
                              id={`radio-${idx}`}
                              type="radio"
                              variant={idx % 2 ? 'outline-success' : 'outline-danger'}
                              name="radio"
                              value={radio.value}
                              checked={radioValue === radio.value}
                              onChange={(e) => this.onChangeOrderStatus(e, feature)}
                          >
                              Upload document
                          </ToggleButton>
                          ))}
                        </ButtonGroup>
                    </Card.Body>
                  </Card>
                    
                  </Col>

                  
                  <hr/>

                </Row>

               

              ))}
              

            </Container>
        )
      }
    }

    const renderClient = (pOrder) => { 
      return (
        <Card style={{ width: '18rem' }}>
          <Card.Body>
            <Card.Title>CLIENT DATA</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">ID: {pOrder.userClient.id}</Card.Subtitle>
            <Card.Subtitle className="mb-2 text-muted">Name: {pOrder.userClient.name}</Card.Subtitle>
            <Card.Subtitle className="mb-2 text-muted">Fecha: {pOrder.userClient.cellphone}</Card.Subtitle>
            <Card.Text>
              Is Profile Updated: {pOrder.userClient.isProfileUpdated ? 'YES' : 'NO'}
            </Card.Text>
          </Card.Body>
        </Card>
      )
    }

    const renderWiller = (pOrder) => { 
      return (
        <Card style={{ width: '18rem' }}>
          <Card.Body>
            <Card.Title>WILLER DATA</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">ID: {pOrder.userWiller.id}</Card.Subtitle>
            <Card.Subtitle className="mb-2 text-muted">Name: {pOrder.userWiller.name}</Card.Subtitle>
            <Card.Subtitle className="mb-2 text-muted">Fecha: {pOrder.userWiller.cellphone}</Card.Subtitle>
            <Card.Text>
              Is Profile Updated: {pOrder.userWiller.isProfileUpdated ? 'YES' : 'NO'}
            </Card.Text>
          </Card.Body>
        </Card>
      )
    }

    const conditionalRenderUpdateOrder = (pOrder) => {
      if (isOrderToUpdate) {
          return (
              <Button 
                  variant='primary'
                  size='lg' 
                  block='true'
                  onClick={(e) => this.handleUOrder(e, pOrder)}
                  // disabled={!order.isCompleteOrder}
              >UPDATE ORDEN</Button>
          )
      }
    }


    return (
      <Container> 
        <Row>
          {renderOrders()}
        </Row>
      </Container>
    )
  }
}

export default withAuthenticator(Documents, {
  theme: Bootstrap,
  includeGreetings: true,
  signUpConfig: {
      hiddenDefaults: ['phone_number'],
      signUpFields: [
      { label: 'Name', key: 'name', required: true, type: 'string' }
  ]
}})