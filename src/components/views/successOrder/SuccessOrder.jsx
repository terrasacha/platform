import { API, graphqlOperation } from 'aws-amplify';
import React, { Component } from 'react';
import  Button  from '../../ui/Button';
import { updateOrder } from '../../../graphql/mutations';

import './successOrder.css';

class SuccessOrder extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    async componentDidMount() {
        const sp = new URLSearchParams(this.props.location.search)
        if(sp.has('referenceCode') && sp.has('extra1')){
            let idOrder = sp.get('referenceCode') 
            await API.graphql(graphqlOperation(updateOrder, { input:{
                id: idOrder,
                statusCode: 'approved',
            } }))
        }
    }    


  render() {
    return (
        <div className={'supremeContainer'}>
            <div className={'container_success'}>
                <div className={'containerCheck'}>
                    <input type="checkbox" id="check" checked className={'input'} onChange={() => ''}/>
                        <label className={'label'}>
                            <div className={'checkIcon'}></div>
                        </label>
                </div>    
                <div><div>
                    <h3 variant="h3" className={'title'}>¡Gracias!</h3>
                    <h3 variant="h6" className={'text'}>
                        Ya puede subir la documentación correspondiente
                    </h3>
                    </div>
                    <div className={'containerButton'} style={{marginTop: '160px'}}>
                    <div className={'button'}><button variant="contained" color="buttonGracias" size="small" href="/investor_admon">Subir documentación</button></div>
                </div>
                </div>


            </div>
        </div>
    )
  }
}
export default SuccessOrder
