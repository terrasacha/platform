import React, { Component } from "react";
import s from './FormRedd.module.css'
import DragArea from "../dragArea/DragArea";

class FormRedd extends Component {
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
                    <legend>Mapa</legend>
                    <p>Mapa del territorio ( en archivo shapefiles o kmz) con coordenadas en donde se desarrollara el proyecto REDD</p>
                    <DragArea
                        selectImage={this.selectImage}
                    />
                    <span style={{ color: 'red', fontSize: '.6em' }}>{/* {this.state.errors.ubicacion} */}</span>
                </fieldset>
                <fieldset className={s.inputContainer}>
                    <legend>Localización del Proyecto</legend>
                    <p>Localización con cooordenadas del perimetro del predio</p>
                    <textarea
                        name='PP_form_ten_tie'
                        value={''}
                        onChange={(e) => this.props.handleOnChangeInputForm(e)} />
                    <span style={{ color: 'red', fontSize: '.6em' }}>{/* {this.state.errors.coord} */}</span>
                </fieldset>
                <fieldset className={s.inputContainer}>
                    <legend>Gobernanza</legend>
                    <p>Tipo de propiedad de la tierra (incluir certificados de propiedad)</p>
                    <DragArea
                        selectImage={this.selectImage}
                    />
                </fieldset>
                <fieldset className={s.inputContainer}>
                    <legend>Actividades Proyecto </legend>
                    <p>Actividades a desarrollar como parte del esquema REDD. Iniciativas que tengran como objetivo evitar la deforestacion.</p>
                    <textarea
                        name='PP_form_ten_tie'
                        value={''}
                        onChange={(e) => this.props.handleOnChangeInputForm(e)} />
                    <span style={{ color: 'red', fontSize: '.6em' }}>{/* {this.state.errors.coord} */}</span>
                </fieldset>
                <fieldset className={s.inputContainer}>
                    <legend>Turberas</legend>
                    <p>¿Existen en el área suelos orgánicos (turberas) que serán drenados? Explique</p>
                    <textarea
                        name='PP_form_ten_tie'
                        value={''}
                        onChange={(e) => this.props.handleOnChangeInputForm(e)} />
                    <span style={{ color: 'red', fontSize: '.6em' }}>{/* {this.state.errors.coord} */}</span>
                </fieldset>
                <fieldset className={s.inputContainer}>
                    <legend>Escenario sin proyecto</legend>
                    <p>¿Qué le hubiera pasado al área del proyecto en ausencia de su proyecto propuesto? Ha tenido otras alternativas de uso de tierra?</p>
                    <textarea
                        name='PP_form_ten_tie'
                        value={''}
                        onChange={(e) => this.props.handleOnChangeInputForm(e)} />
                    <span style={{ color: 'red', fontSize: '.6em' }}>{/* {this.state.errors.coord} */}</span>
                </fieldset>
                <fieldset className={s.inputContainer}>
                    <legend>Créditos de carbono considerado desde el inicio de la concepción del proyecto</legend>
                    <p>Documento que mencione que el aporte extra de los créditos de carbono ha sido considerado desde el inicio de la concepción del proyecto. El documento debe estar fechado antes del inicio de proyecto o del primer recibo relativo a la inversión.</p>
                    <DragArea
                        selectImage={this.selectImage}
                    />
                </fieldset>
                <fieldset className={s.inputContainer}>
                    <legend>Participantes/Beneficios</legend>
                    <p>Quienes son los participantes del proyecto? Cual es el mecanismo de distribucion de beneficios?</p>
                    <textarea
                        name='PP_form_ten_tie'
                        value={''}
                        onChange={(e) => this.props.handleOnChangeInputForm(e)} />
                    <span style={{ color: 'red', fontSize: '.6em' }}>{/* {this.state.errors.coord} */}</span>
                </fieldset>
                <fieldset className={s.inputContainer}>
                    <legend>Consultas locales, o procesos de localización</legend>
                    <p>¿Se han llevado a cabo consultas locales o procesos de socialización del proyecto? ¿Cuales? Se puede soportar con actas de asistencia, etc. Explique.</p>
                    <textarea
                        name='PP_form_ten_tie'
                        value={''}
                        onChange={(e) => this.props.handleOnChangeInputForm(e)} />
                    <span style={{ color: 'red', fontSize: '.6em' }}>{/* {this.state.errors.coord} */}</span>
                </fieldset>
            </form>
        )
    }
}

export default FormRedd