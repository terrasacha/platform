import React, { Component } from 'react'
// Bootstrap
import { Container } from 'react-bootstrap'
// Amplify
import { withAuthenticator } from '@aws-amplify/ui-react'
import { Auth } from 'aws-amplify'
import WebAppConfig from '../../common/_conf/WebAppConfig'
// import '@aws-amplify/ui-react/styles.css'
import md5 from 'md5'
import { ArrowLeft, DashLg, PlusLg } from 'react-bootstrap-icons'
import Bootstrap from "../../common/themes"
import './Orders.css'


class Orders extends Component {
    constructor(props) {
        super(props)
        this.state = {
            index: 0,
            quantity: 0,
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
    handleChangeQuantity(prop){
        if(prop === 'minus' && this.state.quantity > 0) this.setState({quantity: this.state.quantity - 1})
        if(prop === 'plus') this.setState({quantity: this.state.quantity + 1,})
    }
    render() {
        let {product} = this.props
        let {quantity} = this.state
        console.log(product)
        const urlS3Image = WebAppConfig.url_s3_public_images
        let signature = `4Vj8eK4rloUd272L48hsrarnUA~508029~TestPayU22~${product.tokenPrice !== undefined? 
            product.tokenPrice.productFeatureResultAssigned? product.tokenPrice.productFeatureResultAssigned : product.tokenPrice.value 
            : '!value'}~COP`
        signature = md5(signature)
        const renderProductOrder = () => {
            if (product !== null) {
                return (
                    <div>
                        <div className='go-back' onClick={() => this.props.handleGoBackFromProduct()}><ArrowLeft/></div>
                        <div className='product-detail-container'   >
                            <div>
                                <div className='image-container'>
                                    <img  src={urlS3Image+product.images.items[0].imageURL && urlS3Image+product.images.items[this.state.index].imageURL} alt={product.images.items[0].title}className='product-detail-image' />
                                    <div className='product_status'>NEW</div>
                                </div>
                                <div className="small-images-container">
                                    {product.images.items?.map((item, i) => (
                                    <img 
                                        key={i}
                                        alt={item.title}
                                        src={urlS3Image+item.imageURL}
                                        className={i === this.state.index ? 'small-image selected-image' : 'small-image'}
                                        onMouseEnter={() => this.setState({index: i})}
                                    />
                                    ))}
                                </div>
                            </div>
                            <div className='product-detail-desc'>
                                <h1>{product.name}</h1>
                                <p style={{color: '#D88E03'}}>Available tokens {product.amountToBuy? product.amountToBuy : '' }</p>
                                <h6 >Details:</h6>
                                <p>{product.description}</p>
                                <h5 style={{textAlign:'left'}}>Token Price</h5>
                                <h3 className='price'>${product.tokenPrice !== undefined? 
                                    product.tokenPrice.productFeatureResultAssigned? product.tokenPrice.productFeatureResultAssigned : product.tokenPrice.value 
                                    : '!value'}</h3>
                                <div className='quantity'>
                                    <h5>Quantity:</h5>
                                    <p className='quantity-desc'>
                                        <span className='minus' onClick={() => this.handleChangeQuantity('minus')}><DashLg/></span>
                                        <span className='num'>{quantity}</span>
                                        <span className='plus' onClick={() => this.handleChangeQuantity('plus')}><PlusLg/></span>
                                    </p>
                                </div>
                                <h5 style={{textAlign:'left'}}>Total</h5>
                                <h3 className='total-price'>${product.totalPrice !== undefined? 
                                    product.tokenPrice.productFeatureResultAssigned? product.tokenPrice.productFeatureResultAssigned * quantity: product.tokenPrice.value * quantity 
                                    : '!value'}</h3>
                                <div className='buttons'>
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
                                        <button type='submit' className='buy-now' value="Send" >Buy now</button>
                                    </form>
                                </div>
                            </div>
                        </div>
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
