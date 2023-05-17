import React, { Component } from "react";
import s from './FormRedd.module.css'
import DragArea from "../dragArea/DragArea";

class FormRedd extends Component {
    constructor(props){
        super(props)
        this.state = {
            imageToUpload: ''
        }
        this.selectImage = this.props.selectImage.bind(this)
        this.cleanDragArea = this.props.cleanDragArea.bind(this)
    }
    render(){

        return(
            <form className={s.formInputs1}>
                <fieldset className={s.inputContainer}>
                    <legend>Mapa*</legend>
                    <p>Mapa del territorio ( en archivo shapefiles o kmz) con coordenadas en donde se desarrollara el proyecto REDD</p>
                    <DragArea
                        id='redd_map'
                        idFile={this.props.productFeature.redd.redd_map}
                        selectImage={this.selectImage}
                        cleanDragArea={this.cleanDragArea}
                    />
                    <span style={{ color: 'red', fontSize: '.6em' }}>{/* {this.state.errors.ubicacion} */}</span>
                </fieldset>
                <fieldset className={s.inputContainer}>
                    <legend>Amenaza de deforestación*</legend>
                    <p>¿Existen amenazas de deforestación para el área del proyecto? ¿Cuáles?</p>
                    <textarea
                        name='redd_ame_def'
                        value={this.props.productFeature.redd.redd_ame_def}
                        onChange={(e) => this.props.handleOnChangeInputForm(e)} />
                    <span style={{ color: 'red', fontSize: '.6em' }}>{/* {this.state.errors.coordenadas} */}</span>
                </fieldset>
                <fieldset className={s.inputContainer}>
                    <legend>Gobernanza*</legend>
                    <p>Tipo de propiedad de la tierra (incluir certificados de propiedad)</p>
                    <DragArea
                        id='redd_gob'
                        idFile={this.props.productFeature.redd.redd_gob}
                        selectImage={this.selectImage}
                        cleanDragArea={this.cleanDragArea}
                    />
                </fieldset>
                <fieldset className={s.inputContainer}>
                    <legend>Actividades Proyecto*</legend>
                    <p>Actividades a desarrollar como parte del esquema REDD. Iniciativas que tengran como objetivo evitar la deforestacion.</p>
                    <textarea
                        name='redd_act_pro'
                        value={this.props.productFeature.redd.redd_act_pro}
                        onChange={(e) => this.props.handleOnChangeInputForm(e)} />
                    <span style={{ color: 'red', fontSize: '.6em' }}>{/* {this.state.errors.coordenadas} */}</span>
                </fieldset>
                <fieldset className={s.inputContainer}>
                    <legend>Turberas*</legend>
                    <p>¿Existen en el área suelos orgánicos (turberas) que serán drenados? Explique</p>
                    <textarea
                        name='redd_tur'
                        value={this.props.productFeature.redd.redd_tur}
                        onChange={(e) => this.props.handleOnChangeInputForm(e)} />
                    <span style={{ color: 'red', fontSize: '.6em' }}>{/* {this.state.errors.coordenadas} */}</span>
                </fieldset>
                <fieldset className={s.inputContainer}>
                    <legend>Escenario sin proyecto*</legend>
                    <p>¿Qué le hubiera pasado al área del proyecto en ausencia de su proyecto propuesto? Ha tenido otras alternativas de uso de tierra?</p>
                    <textarea
                        name='redd_esc_sin_pro'
                        value={this.props.productFeature.redd.redd_esc_sin_pro}
                        onChange={(e) => this.props.handleOnChangeInputForm(e)} />
                    <span style={{ color: 'red', fontSize: '.6em' }}>{/* {this.state.errors.coordenadas} */}</span>
                </fieldset>
                <fieldset className={s.inputContainer}>
                    <legend>Créditos de carbono considerado desde el inicio de la concepción del proyecto*</legend>
                    <p>Documento que mencione que el aporte extra de los créditos de carbono ha sido considerado desde el inicio de la concepción del proyecto. El documento debe estar fechado antes del inicio de proyecto o del primer recibo relativo a la inversión.</p>
                    <DragArea
                        id='redd_cre_car'
                        idFile={this.props.productFeature.redd.redd_cre_car}
                        selectImage={this.selectImage}
                        cleanDragArea={this.cleanDragArea}
                    />
                </fieldset>
                <fieldset className={s.inputContainer}>
                    <legend>Participantes/Beneficios*</legend>
                    <p>Quienes son los participantes del proyecto? Cual es el mecanismo de distribucion de beneficios?</p>
                    <textarea
                        name='redd_par_ben'
                        value={this.props.productFeature.redd.redd_par_ben}
                        onChange={(e) => this.props.handleOnChangeInputForm(e)} />
                    <span style={{ color: 'red', fontSize: '.6em' }}>{/* {this.state.errors.coordenadas} */}</span>
                </fieldset>
                <fieldset className={s.inputContainer}>
                    <legend>Consultas locales, o procesos de localización*</legend>
                    <p>¿Se han llevado a cabo consultas locales o procesos de socialización del proyecto? ¿Cuales? Se puede soportar con actas de asistencia, etc. Explique.</p>
                    <textarea
                        name='redd_con_loc'
                        value={this.props.productFeature.redd.redd_con_loc}
                        onChange={(e) => this.props.handleOnChangeInputForm(e)} />
                    <span style={{ color: 'red', fontSize: '.6em' }}>{/* {this.state.errors.coordenadas} */}</span>
                </fieldset>
                <fieldset className={s.inputContainer}>
                    <legend>Documento que contenga la descripción general del área del proyecto y las actividades*</legend>
                    <p>¿Cuenta con un documento que contenga la descripción general del área del proyecto y las actividades?</p>
                    <textarea
                        name='redd_doc_des_gen_pro_act'
                        value={this.props.productFeature.redd.redd_doc_des_gen_pro_act}
                        onChange={(e) => this.props.handleOnChangeInputForm(e)} />
                    <span style={{ color: 'red', fontSize: '.6em' }}>{/* {this.state.errors.coordenadas} */}</span>
                </fieldset>
            </form>
        )
    }
}

export default FormRedd