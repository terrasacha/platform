import React, { Component } from 'react'
// Bootstrap
import { Container } from 'react-bootstrap'
// Amplify
import { withAuthenticator } from '@aws-amplify/ui-react'
import { Auth } from 'aws-amplify'
// import '@aws-amplify/ui-react/styles.css'
import md5 from 'md5'
import Bootstrap from "../../common/themes"


class Orders extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }      
    }

    async componentDidMount() {
        // const instance = axios.create({
        //     timeout: 1000,
        //     headers: {
        //         'Content-Type': 'application/json', 
        //         'Authorization': 'Bearer 3e5cac39-7e38-4139-8fd6-30adc06a61bd', 
        //         'Access-Control-Allow-Origin': '*', 
        //         'Access-Control-Allow-Credentials': 'true',
        //         'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
        //     },
        //     crossDomain: true,
        // });
        // const result = await instance.post('https://secure.snd.payu.com/api/v2_1/orders',this.state.data)
        // console.log('### result: ', result)
     }

    render() {
        let {product} = this.props
        console.log(product)
        let signature = `4Vj8eK4rloUd272L48hsrarnUA~508029~TestPayU22~${product.tokenPrice !== undefined? 
            product.tokenPrice.productFeatureResultAssigned? product.tokenPrice.productFeatureResultAssigned : product.tokenPrice.value 
            : '!value'}~COP`
        signature = md5(signature)
        const renderProductOrder = () => {
            if (product !== null) {
                return (
                    <div>
                        <h1>{product.name}</h1>
                        <h2>${product.totalPrice !== undefined? 
                            product.totalPrice.productFeatureResultAssigned? product.totalPrice.productFeatureResultAssigned : product.totalPrice.value 
                            : '!value'}</h2>
                        <form method="post" action="https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/" target='blank'>
                            <input name="merchantId"     type="hidden"   value="508029"   />
                            <input name="accountId"       type="hidden"  value="512321" />
                            <input name="description"     type="hidden"  value={product.name}  />
                            <input name="referenceCode"   type="hidden"  value="TestPayU22" />
                            <input name="amount"          type="hidden"  value={product.tokenPrice !== undefined? 
                                                                                product.tokenPrice.productFeatureResultAssigned? product.tokenPrice.productFeatureResultAssigned : product.tokenPrice.value 
                                                                                : '!value'}   />
                            <input name="tax"             type="hidden"  value="0"  />
                            <input name="taxReturnBase"   type="hidden"  value='0' />
                            <input name="currency"        type="hidden"  value="COP" />
                            <input name="signature"       type="hidden"  value={signature}/>
                            <input name="test"            type="hidden"  value="1" />
                            <input name="buyerEmail"      type="hidden"  value="test@test.com" />
                            <input name="responseUrl"     type="hidden"  value="http://www.test.com/response" />
                            <input name="confirmationUrl" type="hidden"  value="http://www.test.com/confirmation" />
                            <input name="Submit"          type="submit"  value="Send" />
                        </form>
{/*                          <form method="post" action="https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/" target='blank'>
                            <input name="merchantId"      type="hidden"  value="508029"   />
                            <input name="accountId"       type="hidden"  value="512321" />
                            <input name="description"     type="hidden"  value="Test PAYU"  />
                            <input name="referenceCode"   type="hidden"  value="TestPayU" />
                            <input name="amount"          type="hidden"  value="20000"   />
                            <input name="tax"             type="hidden"  value="3193"  />
                            <input name="taxReturnBase"   type="hidden"  value="16806" />
                            <input name="currency"        type="hidden"  value="COP" />
                            <input name="signature"       type="hidden"  value="7ee7cf808ce6a39b17481c54f2c57acc"  />
                            <input name="test"            type="hidden"  value="0" />
                            <input name="buyerEmail"      type="hidden"  value="test@test.com" />
                            <input name="responseUrl"     type="hidden"  value="http://www.test.com/response" />
                            <input name="confirmationUrl" type="hidden"  value="http://www.test.com/confirmation" />
                            <input name="Submit"          type="submit"  value="Enviar" />
                        </form> */}
                    </div>
                )
            }
        }

        return (
            <Container>
                {renderProductOrder()}
            </Container>
        )
    }
}
export default withAuthenticator(Orders, {
    theme: Bootstrap,
    includeGreetings: true,
    signUpConfig: {
        hiddenDefaults: ['phone_number'],
        signUpFields: [
        { label: 'Name', key: 'name', required: true, type: 'string' }
    ]
}})
