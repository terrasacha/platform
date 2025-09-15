import React, { Component } from 'react';

import { Storage } from 'aws-amplify';
// Bootstrap reemplazado con Tailwind CSS y sistema Terrasacha

export default class Configure extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fileToUpload: null,
            updatingLogo: false
        }
        this.handleInputUploadLogo = this.handleInputUploadLogo.bind(this)
        this.handleUploadLogo = this.handleUploadLogo.bind(this)
    }

    handleInputUploadLogo = (e) => {
        if(e.target.name === 'selected_file'){
            const { target: { files } } = e;
            const [file,] = files || [];
            if (!file) {
                return
            }
            this.setState({fileToUpload: file})
        }
    }
    handleUploadLogo = async() => {
          this.setState({updatingLogo: true})
          let uploadImageResult = null
          let fileNameSplitByDotfileArray = this.state.fileToUpload.name.split('.')
          // Getting extension
          let imageExtension = fileNameSplitByDotfileArray[fileNameSplitByDotfileArray.length-1]
          let imageName = 'logo.' + imageExtension
          // Uploading image TO DO  MOVE TO PRIVATE
          uploadImageResult = await Storage.put(imageName, this.state.fileToUpload, {
            level: "public/",
            contentType: "image/jpeg",
          });
          this.cleanState()


          
    }
    cleanState() {
        this.setState({
            fileToUpload: null,
            updatingLogo: false
        })
    }
    
  render() {
    const modalDocument = () => {
        return (
            <div className="bg-white rounded-xl shadow-terrasacha-lg border border-terrasacha-light/20 overflow-hidden">
                {/* Header */}
                <div className="bg-terrasacha-primary text-white px-6 py-4">
                    <h3 className="text-lg font-bold font-champagne tracking-wide">
                        🖼️ Cambiar Logo del Sistema
                    </h3>
                    <p className="text-sm text-terrasacha-earth/80 font-typographica mt-1">
                        Sube un nuevo logo para personalizar la identidad visual
                    </p>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <div className="space-y-3">
                        <label className="form-terrasacha-label">
                            📁 Seleccionar Archivo de Logo
                        </label>
                        <input
                            type="file"
                            name="selected_file"
                            accept="image/*"
                            className="form-terrasacha-input file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-terrasacha-primary file:text-white hover:file:bg-terrasacha-primary/80 file:cursor-pointer"
                            onChange={(e) => this.handleInputUploadLogo(e)}
                        />
                        {this.state.fileToUpload && (
                            <div className="bg-terrasacha-light/10 border border-terrasacha-light/20 rounded-lg p-3">
                                <p className="text-sm text-terrasacha-secondary1 font-typographica">
                                    <span className="font-bold">Archivo seleccionado:</span> {this.state.fileToUpload.name}
                                </p>
                                <p className="text-xs text-terrasacha-secondary1/70 font-typographica mt-1">
                                    Tamaño: {(this.state.fileToUpload.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-terrasacha-light/20">
                        <div className="text-sm text-terrasacha-secondary1 font-typographica">
                            Formatos soportados: JPG, PNG, SVG
                        </div>
                        <button
                            disabled={this.state.updatingLogo || !this.state.fileToUpload}
                            className={`font-typographica font-bold py-3 px-6 rounded-lg transition-all duration-200 ${
                                this.state.updatingLogo || !this.state.fileToUpload
                                    ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                                    : 'btn-terrasacha-primary'
                            }`}
                            onClick={() => this.handleUploadLogo()}
                        >
                            {this.state.updatingLogo ? (
                                <div className="flex items-center space-x-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Subiendo...</span>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <span>📤</span>
                                    <span>Subir Logo</span>
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className="space-y-6 animate-fade-in">
            {modalDocument()}
        </div>
    )
  }
}
