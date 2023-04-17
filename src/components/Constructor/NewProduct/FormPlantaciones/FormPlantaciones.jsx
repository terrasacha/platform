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
        this.selectImage = this.selectImage.bind(this)
    }
    selectImage(e) {
        this.setState({ imageToUpload: e })
    }
    render(){

        return(
            <form className={s.formInputs1}>
                <fieldset className={s.inputContainer}>
                    <legend>Representación</legend>
                    <p>Certificado de existencia y representación </p>
                    <DragArea
                        selectImage={this.selectImage}
                    />
                    <span style={{ color: 'red', fontSize: '.6em' }}>{/* {this.state.errors.ubicacion} */}</span>
                </fieldset>
                <fieldset className={s.inputContainer}>
                    <legend>Forma de tenecia de la tierra</legend>
                    <p>Contrato de arriendo o comodato, etc...(En caso de ser un predio que no es propio)</p>
                    <textarea
                        name='PP_form_ten_tie'
                        value={''}
                        onChange={(e) => this.props.handleOnChangeInputForm(e)} />
                    <span style={{ color: 'red', fontSize: '.6em' }}>{/* {this.state.errors.coord} */}</span>
                </fieldset>
                <fieldset className={s.inputContainer}>
                    <legend>Preparación de suelos y tierra</legend>
                    <p>Documento que evidencie la fecha de inicio del proyecto forestal (contrato de preparación de suelos o siembras</p>
                    <DragArea
                        selectImage={this.selectImage}
                    />
                </fieldset>
                <fieldset className={s.inputContainer}>
                    <legend>Vinculaciones</legend>
                    <p>Contrato de vinculación firmado </p>
                    <DragArea
                        selectImage={this.selectImage}
                    />
                </fieldset>
                <fieldset className={s.inputContainer}>
                    <legend>
                        Registro de plantaciones
                    </legend>
                    <p>Registro ICA de las plantaciones</p>
                    <DragArea
                        selectImage={this.selectImage}
                    />
                </fieldset>
                <fieldset className={s.inputContainer}>
                    <legend>Plan de manejo forestal</legend>
                    <p>Plan de establecimiento y manejo forestal PEMF </p>
                    <DragArea
                        selectImage={this.selectImage}
                    />
                </fieldset>
                <fieldset className={s.inputContainer}>
                    <legend>Polígonos de delimitación</legend>
                    <p>Información geografica del proyecto: Poligonos de la delimitación del predio y de los lotes de siembra (en formato shp, kmz, gdb, dwg o gpx). </p>
                    <DragArea
                        selectImage={this.selectImage}
                    />
                </fieldset>
                <fieldset className={s.inputContainer}>
                    <legend>Plan de siembras</legend>
                    <p>Plan de siembras ( area plantada o por platar por especie cada año) Tabla de excel </p>
                    <DragArea
                        selectImage={this.selectImage}
                    />
                </fieldset>
                <fieldset className={s.inputContainer}>
                    <legend>Monitoreo</legend>
                    <p>Establecimiento de parcelas de monitoreo</p>
                    <DragArea
                        selectImage={this.selectImage}
                    />
                </fieldset>
                <fieldset className={s.inputContainer}>
                    <legend>Perturbación</legend>
                    <p>Formato de nuevas plantaciones y eventos de perturbación </p>
                    <textarea
                        name='PP_pert'
                        value={''}
                        onChange={(e) =>  this.props.handleOnChangeInputForm(e)} />
                    <span style={{ color: 'red', fontSize: '.6em' }}>{/* {this.state.errors.coord} */}</span>
                </fieldset>
            </form>
        )
    }
}

export default FromPlantaciones