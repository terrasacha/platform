import React, { Component } from "react";
import { Storage, Auth } from "aws-amplify";
import awsmobile from "aws-exports";
import { FaArrowLeft } from "react-icons/fa";

export default class PQRForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prqDescription: "",
      prqFile: null, // Cambiado de prqImage a prqFile para admitir imágenes y PDFs
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
      window.location.href = "/";
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
          level: "public", // Asegurar que el nivel es público
        });

        // Construir la URL pública completa del archivo
        const bucketName = awsmobile.aws_user_files_s3_bucket;
        const region = awsmobile.aws_user_files_s3_bucket_region;
        const bucketUrl = `https://${bucketName}.s3.${region}.amazonaws.com/public`;
        const fileUrl = `${bucketUrl}/${result.key}`;

        // Asignar URL a la variable correcta según el tipo de archivo
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
          modalMessage: "Tu PQR se envió exitosamente.",
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
      <div className="min-h-screen bg-gradient-terrasacha-subtle flex items-center justify-center">
        <div className="w-full max-w-6xl mx-auto py-16 px-8">
          <div className="bg-white rounded-2xl shadow-terrasacha-xl p-8">
            <button
              onClick={() => window.history.back()}
              className="text-terrasacha-secondary1 hover:text-terrasacha-primary mb-6 inline-flex items-center gap-2 transition-all duration-300 bg-transparent border-none p-0 cursor-pointer"
            >
              <FaArrowLeft className="text-lg" />
              <span>Regresar</span>
            </button>
            
            <h2 className="text-4xl font-bold text-center text-terrasacha-secondary1 mb-8">
              Envía tu PQRS
            </h2>
            
            <form onSubmit={this.handlePRQSubmit} className="space-y-6">
              <div>
                <label htmlFor="prqDescription" className="text-terrasacha-secondary1 font-semibold text-lg mb-2 block">
                  Descripción de la consulta
                </label>
                <textarea
                  id="prqDescription"
                  rows={4}
                  value={prqDescription}
                  onChange={(e) =>
                    this.setState({ prqDescription: e.target.value })
                  }
                  required
                  minLength="30"
                  placeholder="Describe detalladamente tu consulta"
                  className="w-full border-2 border-terrasacha-light rounded-xl p-4 focus:border-terrasacha-primary focus:ring-2 focus:ring-terrasacha-primary focus:ring-opacity-20 transition-all duration-300 resize-none"
                />
                <div className="flex justify-between text-sm text-terrasacha-light mt-2">
                  <p>La descripción debe tener al menos 30 caracteres.</p>
                  <p className={prqDescription.length >= 30 ? "text-terrasacha-secondary2" : "text-red-500"}>
                    {prqDescription.length} caracteres
                  </p>
                </div>
              </div>
              
              <div>
                <label htmlFor="prqFile" className="text-terrasacha-secondary1 font-semibold text-lg mb-2 block">
                  Archivo (opcional)
                </label>
                <input
                  id="prqFile"
                  type="file"
                  accept="image/png, image/gif, image/jpeg, image/jpg, application/pdf"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const maxFileSize = 15 * 1024 * 1024; // 15 MB en bytes
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
                        e.target.value = null; // Limpiar el campo de archivo
                      } else if (file.size > maxFileSize) {
                        alert(
                          "El tamaño máximo permitido para el archivo es de 15 MB."
                        );
                        e.target.value = null; // Limpiar el campo de archivo
                      } else {
                        this.setState({ prqFile: file });
                      }
                    }
                  }}
                  className="w-full border-2 border-terrasacha-light rounded-xl p-3 focus:border-terrasacha-primary focus:ring-2 focus:ring-terrasacha-primary focus:ring-opacity-20 transition-all duration-300"
                />
                <p className="text-terrasacha-light text-sm mt-2">
                  Formatos aceptados: PNG, GIF, JPEG, PDF, JPG. Tamaño máximo: 15 MB.
                </p>
              </div>

              <div>
                <label htmlFor="prqEmail" className="text-terrasacha-secondary1 font-semibold text-lg mb-2 block">
                  Correo de contacto
                </label>
                <input
                  id="prqEmail"
                  type="email"
                  value={prqEmail}
                  onChange={(e) => this.setState({ prqEmail: e.target.value })}
                  required
                  placeholder="Ingresa tu correo electrónico"
                  className="w-full border-2 border-terrasacha-light rounded-xl p-4 focus:border-terrasacha-primary focus:ring-2 focus:ring-terrasacha-primary focus:ring-opacity-20 transition-all duration-300"
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-terrasacha-primary hover:bg-terrasacha-secondary1 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-terrasacha-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Enviando...
                  </div>
                ) : (
                  "Enviar PQRS"
                )}
              </button>
            </form>

            {/* Modal */}
            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-scale-in">
                <div className="bg-white rounded-2xl max-w-md w-full mx-4 shadow-terrasacha-2xl">
                  {/* Modal Header */}
                  <div className="bg-terrasacha-earth border-b border-terrasacha-light rounded-t-2xl p-6 flex justify-between items-center">
                    <h3 className="text-terrasacha-secondary1 font-bold text-lg">
                      {modalType === "success" ? "Éxito" : "Error"}
                    </h3>
                    <button
                      onClick={this.closeModal}
                      className="text-terrasacha-secondary1 hover:text-terrasacha-primary transition-all duration-300 text-2xl font-bold"
                    >
                      ×
                    </button>
                  </div>
                  
                  {/* Modal Body */}
                  <div className="p-6 text-terrasacha-secondary1">
                    {modalMessage}
                  </div>
                  
                  {/* Modal Footer */}
                  <div className="bg-terrasacha-earth border-t border-terrasacha-light rounded-b-2xl p-6">
                    <button 
                      onClick={this.closeModal}
                      className="bg-terrasacha-primary hover:bg-terrasacha-secondary1 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-terrasacha"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
