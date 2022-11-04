import React, { Component } from 'react'
// GraphQL
import { API, graphqlOperation } from 'aws-amplify'
import { listUserProducts } from '../../../graphql/queries'


export default class Documents extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
        }

    componentDidMount = async () => {
        await this.loadUserProducts()

        console.log(this.state.data)
    }
    async loadUserProducts() {
        let listUserProductsResult = await API.graphql(graphqlOperation(listUserProducts))
        listUserProductsResult.data.listUserProducts.items.sort((a, b) => (a.id > b.id) ? 1 : -1)
        listUserProductsResult = listUserProductsResult.data.listUserProducts.items
        this.setState({data: listUserProductsResult})

        let userProductsWithoutDoc = listUserProductsResult.map(up => up.product.productFeatures.items.filter(pf =>{
            if(pf.feature.featureType.id === "ADMON_DOCUMENT"){
                return up
            }
            return 0
        })
        )
        
        console.log(userProductsWithoutDoc)
        }
    
    
  render() {
    return (
      <div>Documents</div>
    )
  }
}
