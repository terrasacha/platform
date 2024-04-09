import React, { Component } from 'react'
import { Modal } from 'react-bootstrap';
import s from './GuardarParcialmente.module.css'
import LOGO from '../../../common/_images/suan_logo.png'
import 'react-toastify/dist/ReactToastify.css';
export default class GuardarParcialmente extends Component {
    constructor(props) {
        super(props)
        this.state = {
            accept: false,
            error: ''
        }
        this.handleCRUDProduct = this.props.handleCRUDProduct.bind(this)
        this.check = this.check.bind(this)
    }

    check(){
        if(!this.state.accept) return this.setState({error:'Debe marcar el checkbox para poder continuar'})
        this.handleCRUDProduct()
        this.setState({
            accept: false,
            error: ''
        })
    }
  render() {
    return (
        <Modal
        show={this.props.renderGuardarParcialmente}
        onHide={(e) => this.props.onHideModalGuardarP()}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        >
        <Modal.Body style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            <div className={s.termsTitle}>
                <img src={LOGO} alt='' style={{width: '100px'}}/>
            </div>
            <h5 className={s.title}>Guarda parcialmente la información del proyecto</h5>
            <p className={s.tycText}>En caso de que no cuentes con toda la  documentación necesaria para enviar el formulario completo puedes enviar
            parcialemente la información y continuar más tarde.
            Ten en cuenta que solo podrás salvar tu formulario parcialmente solo una vez, por lo que si decides hacerto asegurate de recopilar todos los datos
            antes seguir nuevamente. Esto no significa que si ingresas nuevamente y no completas los campos perderas todo el progreso, sino que no podrás guardar
            la nueva información como lo hiciste anteriormente.
            </p>
            <fieldset className={s.checkbox}>
                <input type="checkbox"  name="terms" onChange={() => this.setState({accept: !this.state.accept})}/>
                <label>Quiero guardar la información incompleta de mi proyecto</label>
            </fieldset>
            <button className={s.sendButton} onClick={this.check}>{this.props.loading?'GUARDANDO':'GUARDAR'}</button>
            <span style={{color: 'red'}}>{this.state.error}</span>
        </Modal.Body>
    </Modal>
    )
  }
}
