import React, { Component } from "react";
import { Storage, Auth } from "aws-amplify";
import awsmobile from "aws-exports";
import { FaArrowLeft, FaPaperPlane, FaFileUpload, FaEnvelope, FaEdit } from "react-icons/fa";
import { navigate } from "../../../utilities/navigate";

export default class PQRForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prqDescription: "",
      prqFile: null,
      prqEmail: "",
      showModal: false,
      modalMessage: "",
      modalType: "",
      isAuthenticated: false,
      isLoading: false,
    };
    this.handlePRQSubmit = this.handlePRQSubmit.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  async componentDidMount() {
    try {
      await Auth.currentSession();
      this.setState({ isAuthenticated: true });
    } catch (error) {
      console.error("Usuario no autenticado:", error);
      navigate("/");
    }
  }

  async handlePRQSubmit(e) {
    e.preventDefault();
    const { prqDescription, prqFile, prqEmail } = this.state;

    this.setState({ isLoading: true });

    let imageUrl = null;
    let pdfUrl = null;

    if (prqFile) {
      const fileName = `prq-files/${Date.now()}_${prqFile.name}`;
      try {
        const result = await Storage.put(fileName, prqFile, {
          contentType: prqFile.type,
          level: "public",
        });

        const bucketName = awsmobile.aws_user_files_s3_bucket;
        const region = awsmobile.aws_user_files_s3_bucket_region;
        const bucketUrl = `https://${bucketName}.s3.${region}.amazonaws.com/public`;
        const fileUrl = `${bucketUrl}/${result.key}`;

        if (prqFile.type === "application/pdf") {
          pdfUrl = fileUrl;
        } else {
          imageUrl = fileUrl;
        }
      } catch (error) {
        console.error("Error subiendo el archivo a S3:", error);
        this.setState({
          showModal: true,
          modalMessage: "Error al subir el archivo. Inténtalo de nuevo.",
          modalType: "error",
        });
        return;
      }
    }

    const requestBody = {
      prqDescription,
      imageUrl,
      pdfUrl,
      prqEmail,
    };

    try {
      const response = await fetch(process.env["REACT_APP_URL_API_PQR"], {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        this.setState({
          showModal: true,
          modalMessage: "Tu PQR se envió exitosamente. Nos pondremos en contacto contigo pronto.",
          modalType: "success",
          prqDescription: "",
          prqFile: null,
          prqEmail: "",
          isLoading: false,
        });
      } else {
        this.setState({
          showModal: true,
          modalMessage: "Hubo un error al enviar el PQR. Inténtalo de nuevo.",
          modalType: "error",
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Error enviando el PQR:", error);
      this.setState({
        showModal: true,
        modalMessage: "Hubo un error al enviar el PQR. Inténtalo de nuevo.",
        modalType: "error",
        isLoading: false,
      });
    }
  }

  closeModal() {
    this.setState({ showModal: false });
  }

  render() {
    const {
      showModal,
      modalMessage,
      modalType,
      prqDescription,
      prqEmail,
      isAuthenticated,
      isLoading,
    } = this.state;

    if (!isAuthenticated) {
      return null;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-terrasacha-light/20 via-terrasacha-earth/30 to-terrasacha-secondary2/20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-terrasacha-earth/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-terrasacha-light/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-terrasacha-secondary2/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto py-16 px-6">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-terrasacha-primary to-terrasacha-secondary2 rounded-full shadow-terrasacha-xl mb-6">
              <FaPaperPlane className="text-3xl text-white" />
            </div>
            <h1 className="font-typographica text-5xl font-bold text-terrasacha-secondary1 mb-4">
              Centro de Atención PQRS
            </h1>
            <p className="font-champagne text-xl text-terrasacha-secondary2 max-w-2xl mx-auto leading-relaxed">
              Somos pioneros del mañana. Tu voz es importante para nosotros. 
              Envíanos tu consulta y te responderemos con la excelencia que nos caracteriza.
            </p>
          </div>

          {/* Main Form Card */}
          <div className="glassmorphism-card p-10 shadow-terrasacha-2xl">
            {/* Back Button */}
            <button
              onClick={() => window.history.back()}
              className="group text-terrasacha-secondary1 hover:text-terrasacha-primary mb-8 inline-flex items-center gap-3 transition-all duration-300 bg-white/80 hover:bg-white px-4 py-2 rounded-xl shadow-terrasacha border border-terrasacha-light/30"
            >
              <FaArrowLeft className="text-lg group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-champagne font-semibold">Regresar</span>
            </button>
            
            <form onSubmit={this.handlePRQSubmit} className="space-y-8">
              {/* Description Field */}
              <div className="form-field-group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-terrasacha-primary to-terrasacha-secondary2 rounded-lg flex items-center justify-center shadow-terrasacha">
                    <FaEdit className="text-white text-lg" />
                  </div>
                  <label htmlFor="prqDescription" className="text-terrasacha-secondary1 font-typographica font-bold text-xl">
                    Descripción de tu consulta
                  </label>
                </div>
                <textarea
                  id="prqDescription"
                  rows={5}
                  value={prqDescription}
                  onChange={(e) =>
                    this.setState({ prqDescription: e.target.value })
                  }
                  required
                  minLength="30"
                  placeholder="Describe detalladamente tu consulta, sugerencia, reclamo o petición..."
                  className="form-input"
                />
                <div className="flex justify-between items-center mt-3">
                  <p className="text-sm text-terrasacha-secondary2 font-champagne">
                    La descripción debe tener al menos 30 caracteres
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-terrasacha-light/30 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          prqDescription.length >= 30 
                            ? 'bg-gradient-to-r from-terrasacha-secondary2 to-terrasacha-primary' 
                            : 'bg-gradient-to-r from-red-400 to-red-500'
                        }`}
                        style={{ width: `${Math.min((prqDescription.length / 30) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-bold font-champagne ${
                      prqDescription.length >= 30 ? 'text-terrasacha-secondary2' : 'text-red-500'
                    }`}>
                      {prqDescription.length}/30
                    </span>
                  </div>
                </div>
              </div>
              
              {/* File Upload Field */}
              <div className="form-field-group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-terrasacha-light to-terrasacha-earth rounded-lg flex items-center justify-center shadow-terrasacha">
                    <FaFileUpload className="text-terrasacha-secondary1 text-lg" />
                  </div>
                  <label htmlFor="prqFile" className="text-terrasacha-secondary1 font-typographica font-bold text-xl">
                    Archivo de respaldo (opcional)
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="prqFile"
                    type="file"
                    accept="image/png, image/gif, image/jpeg, image/jpg, application/pdf"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const maxFileSize = 15 * 1024 * 1024;
                        if (
                          ![
                            "image/png",
                            "image/gif",
                            "image/jpeg",
                            "image/jpg",
                            "application/pdf",
                          ].includes(file.type)
                        ) {
                          alert(
                            "Solo se aceptan imágenes en formato PNG, GIF, PDF, JPEG o JPG."
                          );
                          e.target.value = null;
                        } else if (file.size > maxFileSize) {
                          alert(
                            "El tamaño máximo permitido para el archivo es de 15 MB."
                          );
                          e.target.value = null;
                        } else {
                          this.setState({ prqFile: file });
                        }
                      }
                    }}
                    className="hidden"
                  />
                  <label 
                    htmlFor="prqFile" 
                    className="file-upload-label"
                  >
                    <div className="text-center">
                      <FaFileUpload className="text-3xl text-terrasacha-secondary2 mx-auto mb-3" />
                      <p className="font-champagne font-semibold text-terrasacha-secondary1">
                        {this.state.prqFile ? this.state.prqFile.name : "Haz clic para seleccionar un archivo"}
                      </p>
                      <p className="text-sm text-terrasacha-secondary2 mt-2">
                        PNG, GIF, JPEG, PDF • Máx. 15 MB
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Email Field */}
              <div className="form-field-group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-terrasacha-earth to-terrasacha-light rounded-lg flex items-center justify-center shadow-terrasacha">
                    <FaEnvelope className="text-terrasacha-secondary1 text-lg" />
                  </div>
                  <label htmlFor="prqEmail" className="text-terrasacha-secondary1 font-typographica font-bold text-xl">
                    Correo de contacto
                  </label>
                </div>
                <input
                  id="prqEmail"
                  type="email"
                  value={prqEmail}
                  onChange={(e) => this.setState({ prqEmail: e.target.value })}
                  required
                  placeholder="tu@email.com"
                  className="form-input"
                />
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="submit-button"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent"></div>
                    <span>Enviando tu consulta...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <FaPaperPlane className="text-xl" />
                    <span>Enviar PQRS</span>
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Enhanced Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-scale-in">
            <div className="glassmorphism-card max-w-md w-full mx-6 shadow-terrasacha-2xl border border-terrasacha-light/20">
              {/* Modal Header */}
              <div className={`p-6 border-b border-terrasacha-light/20 ${
                modalType === "success" 
                  ? "bg-gradient-to-r from-terrasacha-secondary2 to-terrasacha-primary" 
                  : "bg-gradient-to-r from-red-500 to-red-600"
              } rounded-t-2xl`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    {modalType === "success" ? (
                      <FaPaperPlane className="text-white text-lg" />
                    ) : (
                      <span className="text-white text-2xl font-bold">!</span>
                    )}
                  </div>
                  <h3 className="text-white font-typographica font-bold text-xl">
                    {modalType === "success" ? "¡Consulta Enviada!" : "Error"}
                  </h3>
                </div>
              </div>
              
              {/* Modal Body */}
              <div className="p-6">
                <p className="text-terrasacha-secondary1 font-champagne text-lg leading-relaxed">
                  {modalMessage}
                </p>
              </div>
              
              {/* Modal Footer */}
              <div className="p-6 border-t border-terrasacha-light/20">
                <button 
                  onClick={this.closeModal}
                  className="w-full bg-gradient-to-r from-terrasacha-primary to-terrasacha-secondary2 hover:from-terrasacha-secondary1 hover:to-terrasacha-primary text-white font-typographica font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-terrasacha-lg"
                >
                  {modalType === "success" ? "Entendido" : "Intentar de nuevo"}
                </button>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          .glassmorphism-card {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(177, 193, 129, 0.3);
            border-radius: 1.5rem;
            box-shadow: 0 8px 32px 0 rgba(110, 108, 53, 0.1);
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          }
          .glassmorphism-card:hover {
            box-shadow: 0 16px 45px 0 rgba(110, 108, 53, 0.15);
            transform: translateY(-2px);
            border-color: rgba(177, 193, 129, 0.5);
          }
          .form-field-group {
            position: relative;
          }
          .form-input {
            width: 100%;
            background: rgba(255, 255, 255, 0.9);
            border: 2px solid rgba(177, 193, 129, 0.4);
            border-radius: 1rem;
            padding: 1rem 1.25rem;
            font-size: 1rem;
            font-family: 'Champagne & Limousines', sans-serif;
            transition: all 0.3s ease;
            backdrop-filter: blur(4px);
          }
          .form-input:focus {
            outline: none;
            border-color: #6e6c35;
            box-shadow: 0 0 0 3px rgba(110, 108, 53, 0.1);
            background: rgba(255, 255, 255, 1);
          }
          .form-input::placeholder {
            color: rgba(110, 108, 53, 0.6);
            font-style: italic;
          }
          .file-upload-label {
            display: block;
            width: 100%;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.8);
            border: 2px dashed rgba(177, 193, 129, 0.6);
            border-radius: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(4px);
          }
          .file-upload-label:hover {
            background: rgba(255, 255, 255, 0.95);
            border-color: #6e6c35;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(110, 108, 53, 0.15);
          }
          .submit-button {
            width: 100%;
            background: linear-gradient(135deg, #6e6c35 0%, #849b50 100%);
            color: white;
            font-family: 'Typographica', sans-serif;
            font-weight: 700;
            font-size: 1.125rem;
            padding: 1.25rem 2rem;
            border: none;
            border-radius: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            transform: translateY(0);
            box-shadow: 0 10px 30px rgba(110, 108, 53, 0.3);
          }
          .submit-button:hover:not(:disabled) {
            background: linear-gradient(135deg, #44482c 0%, #6e6c35 100%);
            transform: translateY(-3px);
            box-shadow: 0 20px 40px rgba(110, 108, 53, 0.4);
          }
          .submit-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
          }
        `}</style>
      </div>
    );
  }
}
