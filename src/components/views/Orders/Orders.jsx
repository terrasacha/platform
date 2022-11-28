import React, { Component } from 'react'
// Bootstrap
import { Container } from 'react-bootstrap'

import { Auth } from 'aws-amplify'
import WebAppConfig from '../../common/_conf/WebAppConfig'
// import '@aws-amplify/ui-react/styles.css'
import md5 from 'md5'
import { ArrowLeft, DashLg, PlusLg } from 'react-bootstrap-icons'
import Bootstrap from "../../common/themes"
import './Orders.css'
// Util
import { v4 as uuidv4 } from 'uuid'

import { API, graphqlOperation } from 'aws-amplify'
import { createOrder, createUserProduct } from '../../../graphql/mutations'
import { listUserProducts } from '../../../graphql/queries'


class Orders extends Component {
    constructor(props) {
        super(props)
        this.state = {
            actualUser: null,
            isAlreadyExistUserProduct: false,
            index: 0,
            quantity: 0,
            refferenceCode: uuidv4().replaceAll('-','_'),
            tokenPrice:this.props.product.tokenPrice !== undefined? 
            this.props.product.tokenPrice.productFeatureResultAssigned? this.props.product.tokenPrice.productFeatureResultAssigned: this.props.product.tokenPrice.value
                : '!value'
        }      
    }

    async componentDidMount() {
                let actualUser = await  Auth.currentAuthenticatedUser()
                let actualUserID = actualUser.attributes.sub
                this.setState({
                    actualUser: actualUserID
                })
        
                const filterByUserIDAndProductID = {
                    filter: { 
                        productID: {
                            eq: this.props.product.id
                        },
                        userID: {
                            eq: actualUserID
                        }
                    },
                    limit: 200
                }
                const result = await API.graphql(graphqlOperation(listUserProducts, filterByUserIDAndProductID))
                // Doesn't exists the relation UserProduct
                if (result.data.listUserProducts.items.length !== 0) {
                    await this.setState({isAlreadyExistUserProduct: true})
                }
     }
    async handleCreateUserProduct(event, pProduct) {
        // Creating UserProduct
        let userProductID = uuidv4().replaceAll('-','_')
        const filterByUserIDAndProductID = {
            filter: { 
                productID: {
                    eq: this.props.product.id
                },
                userID: {
                    eq: this.state.actualUser
                }
            },
            limit: 200
        }
        const result = await API.graphql(graphqlOperation(listUserProducts, filterByUserIDAndProductID))
        console.log(result, 'result')
        if (result.data.listUserProducts.items.length === 0) {
            const payLoadNewUserProduct = {
                id: userProductID,
                userID: this.state.actualUser,
                productID: this.props.product.id,
                isFavorite: true
            }
            await API.graphql(graphqlOperation(createUserProduct, { input: payLoadNewUserProduct }))
            //Creating Order for NewUserProduct
            const payloadNewOrder = {
                id: this.state.refferenceCode,
                userProductID: userProductID,
                amountOfTokens: this.state.quantity,
                statusCode: 'pendding',
            }
            await API.graphql(graphqlOperation(createOrder, { input: payloadNewOrder }))
            
            // Doesn't exists the relation UserProduct
        } else {
            await this.setState({isAlreadyExistUserProduct: true})
        }
    }
    
    
    handleChangeQuantity(prop){
        if(prop === 'minus' && this.state.quantity > 0) this.setState({quantity: this.state.quantity - 1, tokenPrice: this.state.tokenPrice * (this.state.quantity -1)})
        if(prop === 'plus') this.setState({quantity: this.state.quantity + 1, tokenPrice: this.state.tokenPrice * (this.state.quantity +1)})
    }
    render() {
        let {product} = this.props
        let {quantity, tokenPrice, isAlreadyExistUserProduct, actualUser, refferenceCode } = this.state
        let role = localStorage.getItem('role')
        const urlS3Image = WebAppConfig.url_s3_public_images
        let signature = `4Vj8eK4rloUd272L48hsrarnUA~508029~${refferenceCode}~${product.tokenPrice !== undefined?
            tokenPrice: '!value'}~COP`
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
                                {role && role === 'investor'? 
                                    <>
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
                                            <input name="referenceCode"   type="hidden"  value={refferenceCode} />
                                            <input name="amount"          type="hidden"  value={tokenPrice}   />
                                            <input name="tax"             type="hidden"  value="0"  />
                                            <input name="taxReturnBase"   type="hidden"  value='0' />
                                            <input name="currency"        type="hidden"  value="COP" />
                                            <input name="signature"       type="hidden"  value={signature}/>
                                            <input name="test"            type="hidden"  value="1" />
                                            <input name="extra1"          type="hidden"  value={actualUser} />
                                            <input name="extra2"          type="hidden"  value={product.id} />
                                            <input name="buyerEmail"      type="hidden"  value="test@test.com" />
                                            <input name="responseUrl"     type="hidden"  value="http://localhost:3000/success_order" />
                                            <input name="confirmationUrl" type="hidden"  value="http://www.test.com/confirmation" />
    {/*                                         <button type='submit' className='buy-now' value="Send" onClick={(e) => this.handleCreateUserProduct(e, product)} disabled={!isAlreadyExistUserProduct}>Buy now</button> */}
                                            <button type='submit' className={quantity !== 0 || !isAlreadyExistUserProduct?'buy-now' : 'buy-now-disabled'} value="Send" disabled={quantity === 0? true: false} onClick={(e) => this.handleCreateUserProduct(e, product)}>Buy now</button>
                                        </form>
                                    </div>
                                    </>:
                                    ''
                                }
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
export default Orders