import React, { Component } from 'react'
//bootstrap
import {  Button, Form, Col, Table } from 'react-bootstrap'
//Utils
import Select from 'react-select'

export default class CRUDProductFeatures extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
  render() {
    let {CRUD_Product, featuresSelectList, selectedFeature} = this.props

    const renderCRUDProductFeatures = () => {
        return (
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Features</th>
                    <th>Description</th>
                    <th>Value</th>
                </tr>
                </thead>
                <tbody>
                {CRUD_Product.features.map(feature => (
                    <tr key={feature.id}>
                        <td>
                            <Form.Group as={Col} controlId='formGridCRUD_ProductFeature'>
                                <Form.Label>Select one</Form.Label>
                                    <Select options={featuresSelectList} onChange={this.handleOnSelectFeature} />
                            </Form.Group>
                        </td>
                        <td>
                            <Form.Group as={Col} controlId='formGridCRUD_ProductFeature_Description'>
                                <Form.Label>{selectedFeature?this.state.selectedFeature.description : '-'}</Form.Label>
                                    
                            </Form.Group>
                        </td>
                        <td>
                            <Form.Group as={Col} controlId='formGridCRUD_ProductOrder'>
                                <Form.Control
                                    type='number'
                                    placeholder=''
                                    name='valueProductFeature'
                                    value={this.state.valueProductFeature}
                                    onChange={(e) => this.setState({valueProductFeature: e.target.value})} />
                            </Form.Group>
                        </td>
                        <td>
                            <Form.Group as={Col} controlId='formGridCRUD_ProductFeatureIsToBlockChain'>
                                    <Form.Label>Is to Blockchain?</Form.Label>
                                    <Button 
                                        variant='primary'
                                        size='sm' 
                                        onClick={(e) => this.handleOnChangeInputFormProductFeatures(e, feature, 'CRUD_ProductFeatureIsToBlockChain')}
                                    >{feature.isToBlockChain? 'YES' : 'NO'}</Button>
                                </Form.Group>
                        </td>
                        <td>
                            <Form.Group as={Col} controlId='formGridCRUD_ProductFeatureIsVerifable'>
                                    <Form.Label>Is to Verifable?</Form.Label>
                                    <Button 
                                        variant='primary'
                                        size='sm' 
                                        onClick={(e) => this.handleOnChangeInputFormProductFeatures(e, feature, 'CRUD_ProductFeatureIsVerifable')}
                                    >{feature.isVerifable? 'YES' : 'NO'}</Button>
                                </Form.Group>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        )
    }
    return (
      <>
        {renderCRUDProductFeatures()}
      </>
    )
  }
}
