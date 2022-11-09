import React, { Component } from 'react'
import axios from "axios"

export default class Orders extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {
                notifyUrl: "https://your.eshop.com/notify",
                customerIp: "127.0.0.1",
                merchantPosId: "145227",
                description: "RTV market",
                currencyCode: "PLN",
                totalAmount: "21000",
                buyer: {
                    email: "john.doe@example.com",
                    phone: "654111654",
                    firstName: "John",
                    lastName: "Doe",
                    language: "pl"
                },
                products: [
                    {
                        name: "Wireless Mouse for Laptop",
                        unitPrice: "15000",
                        quantity: "1"
                    },
                    {
                        name: "HDMI cable",
                        unitPrice: "6000",
                        quantity: "1"
                    }
                ],
            post: null
        }
        }      
    }

    async componentDidMount() {
        const instance = axios.create({
            timeout: 1000,
            headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer 3e5cac39-7e38-4139-8fd6-30adc06a61bd'}
        });
        const result = instance.post('https://secure.payu.com/api/v2_1/orders',this.state.data)
        console.log('### result: ', result)
     }

    render() {
        let {post} = this.state

        return (
        <div>
            <h1>Hola</h1>
            <p>Nachichin</p>
        </div>
        )
    }
}
