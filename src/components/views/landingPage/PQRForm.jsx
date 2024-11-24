import React, { Component } from "react";
import { Form, Button, Modal, Container } from "react-bootstrap";
import { Storage, Auth } from "aws-amplify";
import s from "./LandingPage.module.css"; // Estilos personalizados
import { FaArrowLeft } from "react-icons/fa"; // Importa el ícono


export default class PQRForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prqDescription: "",
      prqImage: null,
      prqEmail: "",
      showModal: false,
      modalMessage: "",
      modalType: "",
      isAuthenticated: false,
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
    const { prqDescription, prqImage, prqEmail } = this.state;

    let imageUrl = null;
    if (prqImage) {
      const fileName = `prq-images/${Date.now()}_${prqImage.name}`;
      const result = await Storage.put(fileName, prqImage, {
        contentType: prqImage.type,
        level: "public",
      });
      imageUrl = `https://${result.key}`;
    }

    const requestBody = {
      prqDescription,
      imageUrl,
      prqEmail,
    };

    try {
      const response = await fetch("https://4e2uo1y7p0.execute-api.us-east-1.amazonaws.com/prod/pqr", {
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
          prqImage: null,
          prqEmail: "",
        });
      } else {
        this.setState({
          showModal: true,
          modalMessage: "Hubo un error al enviar el PQR. Inténtalo de nuevo.",
          modalType: "error",
        });
      }
    } catch (error) {
      console.error("Error enviando el PQR:", error);
      this.setState({
        showModal: true,
        modalMessage: "Hubo un error al enviar el PQR. Inténtalo de nuevo.",
        modalType: "error",
      });
    }
  }

  closeModal() {
    this.setState({ showModal: false });
  }

  render() {
    const { showModal, modalMessage, modalType, prqDescription, prqEmail, isAuthenticated } = this.state;

    if (!isAuthenticated) {
      return (
        <Modal show={showModal} onHide={this.closeModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Acceso Restringido</Modal.Title>
          </Modal.Header>
          <Modal.Body>{modalMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.closeModal}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }

    return (
      <div className="container-fluid bg-tecnologia p-5" id="tecnologia">
        <Container className={`${s.pqrContainer} mt-5 p-4`}>
        <Button
          variant="link"
          style={{ color: "#1C3541" }}
          className="mb-4 d-flex align-items-center gap-2"
          onClick={() => (window.location.href = "/")}
        >
          <FaArrowLeft />
          Regresar
        </Button>
          <h2 className="text-center mb-4">Envía tu PQR</h2>
          <Form onSubmit={this.handlePRQSubmit}>
            <Form.Group controlId="prqDescription" className="mb-3">
              <Form.Label>Descripción de la consulta</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={prqDescription}
                onChange={(e) => this.setState({ prqDescription: e.target.value })}
                required
                minLength="30"
                placeholder="Describe detalladamente tu consulta"
              />
              <Form.Text className="text-muted">
                La descripción debe tener al menos 30 caracteres.
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="prqImage" className="mb-3">
  <Form.Label>Imagen (opcional)</Form.Label>
  <Form.Control
    type="file"
    accept="image/png, image/gif, image/jpeg, image/jpg, application/pdf "
    onChange={(e) => {
      const file = e.target.files[0];
      if (file) {
        const maxFileSize = 15 * 1024 * 1024; // 15 MB en bytes
        if (!["image/png", "image/gif", "image/jpeg", "image/jpg", "application/pdf"].includes(file.type)) {
          alert("Solo se aceptan imágenes en formato PNG, GIF, PDF, JPEG o JPG.");
          e.target.value = null; // Limpiar el campo de archivo
        } else if (file.size > maxFileSize) {
          alert("El tamaño máximo permitido para la imagen es de 15 MB.");
          e.target.value = null; // Limpiar el campo de archivo
        } else {
          this.setState({ prqImage: file });
        }
      }
    }}
  />
  <Form.Text className="text-muted">
    Formatos aceptados: PNG, GIF, JPEG, PDF, JPG. Tamaño máximo: 15 MB.
  </Form.Text>
</Form.Group>

            <Form.Group controlId="prqEmail" className="mb-3">
              <Form.Label>Correo de contacto</Form.Label>
              <Form.Control
                type="email"
                value={prqEmail}
                onChange={(e) => this.setState({ prqEmail: e.target.value })}
                required
                placeholder="Ingresa tu correo electrónico"
              />
            </Form.Group>
            <Button  style={{ backgroundColor: "#1C3541", borderColor: "#1C3541", color: "#fff",}} variant="primary" className="w-100 mt-3">
              Enviar PQR
            </Button>
          </Form>

          <Modal show={showModal} onHide={this.closeModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>{modalType === "success" ? "Éxito" : "Error"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{modalMessage}</Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={this.closeModal}>
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    );
  }
}
