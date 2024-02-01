import React, { Component } from 'react'
import  Modal  from '../../../ui/Modal';
import s from './ProductOnDraft.module.css'
import LOGO from '../../../common/_images/suan_logo.png'
import 'react-toastify/dist/ReactToastify.css';
import { deleteAllProduct } from '../../functions/functions';
export default class ProductOnDraft extends Component {
    constructor(props) {
        super(props)
        this.state = {
            deleting: false
        }
    }
    async deleteFormInfo(id){
        this.setState({deleting: true})
        await deleteAllProduct(id)
        this.props.onHideModalProductOnDraft()

    }
  render() {
    let { deleting } = this.state
    return (
        <Modal
        show={this.props.renderModalProductOnDraft}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        >
        <Modal.Body style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            <div className={s.termsTitle}>
                <img src={LOGO} alt='' style={{width: '100px'}}/>
            </div>
            <h5 className={s.title}>Tienes un proyecto guardado con información parcial</h5>
            <p className={s.tycText}>
                ¿Quieres continuar con el formulario de <b>{this.props.productOnDraft.name}</b>, creado el {this.props.productOnDraft.createdAt.slice(8, 10) + '/' + this.props.productOnDraft.createdAt.slice(5, 7) + '/' + this.props.productOnDraft.createdAt.slice(2, 4)}?
            </p>
            <span className={s.spanEliminar}>Si eliminas la información se perderán todos los datos asociados al proyecto</span>
            <div className={s.buttonContainer}>
                <button className={deleting? s.deleting :s.eliminarButton} disabled={deleting} 
                            onClick={() => this.deleteFormInfo(this.props.productOnDraft.id)}>{deleting?'ELIMINANDO':'ELIMINAR'}</button>
                <button className={s.continuarButton} onClick={() => this.props.fillFormWithProductOnDraft()}>CONTINUAR</button>
            </div>
        </Modal.Body>
    </Modal>
    )
  }
}
