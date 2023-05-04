import React, { Component } from "react";
import s from './FormPlantaciones.module.css'
import { InfoCircle } from 'react-bootstrap-icons'
import DragArea from "../dragArea/DragArea";
class FromPlantaciones extends Component {
    constructor(props){
        super(props)
        this.state = {
            imageToUpload: ''
        }
        this.selectImage = this.props.selectImage.bind(this)
    }

    render(){

        return(
            <form className={s.formInputs1}>
                <fieldset className={s.inputContainer}>
                    <legend>Representación</legend>
                    <p>Certificado de existencia y representación*</p>
                    <DragArea
                        id='PP_rep'
                        selectImage={this.selectImage}
                    />
                    <span style={{ color: 'red', fontSize: '.6em' }}>{/* {this.state.errors.ubicacion} */}</span>
                </fieldset>
                <fieldset className={s.inputContainer}>
                    <legend>Forma de tenecia de la tierra*</legend>
                    <p>Contrato de arriendo o comodato, etc...(En caso de ser un predio que no es propio)</p>
                    <textarea
                        name='PP_for_ten_tie'
                        value={this.props.productFeature.PP.PP_for_ten_tie}
                        onChange={(e) => this.props.handleOnChangeInputForm(e)} />
                    <span style={{ color: 'red', fontSize: '.6em' }}>{/* {this.state.errors.coord} */}</span>
                </fieldset>
                <fieldset className={s.inputContainer}>
                    <legend>Preparación de suelos y tierra*</legend>
                    <p>Documento que evidencie la fecha de inicio del proyecto forestal (contrato de preparación de suelos o siembras</p>
                    <DragArea
                        id='PP_pre_sue_tie'
                        selectImage={this.selectImage}
                    />
                </fieldset>
                <fieldset className={s.inputContainer}>
                    <legend>Vinculaciones</legend>
                    <p>Contrato de vinculación firmado*</p>
                    <textarea
                        name='PP_vin'
                        value={this.props.productFeature.PP.PP_vin}
                        onChange={(e) => this.props.handleOnChangeInputForm(e)} />
                    <span style={{ color: 'red', fontSize: '.6em' }}>{/* {this.state.errors.coord} */}</span>
                </fieldset>
                <fieldset className={s.inputContainer}>
                    <legend>
                        Registro de plantaciones*
                    </legend>
                    <p>Registro ICA de las plantaciones</p>
                    <DragArea
                        id='PP_reg_pla'
                        selectImage={this.selectImage}
                    />
                </fieldset>
                <fieldset className={s.inputContainer}>
                    <legend>Plan de manejo forestal*</legend>
                    <p>Plan de establecimiento y manejo forestal PEMF </p>
                    <DragArea
                        id='PP_pla_man_for'
                        selectImage={this.selectImage}
                    />
                </fieldset>
                <fieldset className={s.inputContainer}>
                    <legend>Polígonos de delimitación*</legend>
                    <p>Información geografica del proyecto: Poligonos de la delimitación del predio y de los lotes de siembra (en formato shp, kmz, gdb, dwg o gpx). </p>
                    <DragArea
                        id='PP_pol_del'
                        selectImage={this.selectImage}
                    />
                </fieldset>
                <fieldset className={s.inputContainer}>
                    <legend>Plan de siembras*</legend>
                    <p>Plan de siembras ( area plantada o por platar por especie cada año) Tabla de excel </p>
                    <DragArea
                        id='PP_pla_sie'
                        selectImage={this.selectImage}
                    />
                </fieldset>
                <fieldset className={s.inputContainer}>
                    <legend>Monitoreo*</legend>
                    <p>Establecimiento de parcelas de monitoreo</p>
                    <DragArea
                        id='PP_mon'
                        selectImage={this.selectImage}
                    />
                </fieldset>
                <fieldset className={s.inputContainer}>
                    <legend>Perturbación*</legend>
                    <p>Formato de nuevas plantaciones y eventos de perturbación </p>
                    <textarea
                        name='PP_pert'
                        value={this.props.productFeature.PP.PP_pert}
                        onChange={(e) =>  this.props.handleOnChangeInputForm(e)} />
                    <span style={{ color: 'red', fontSize: '.6em' }}>{/* {this.state.errors.coord} */}</span>
                </fieldset>
            </form>
        )
    }
}

export default FromPlantaciones