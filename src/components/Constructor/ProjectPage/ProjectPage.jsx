import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Sections
import ProjectDetails from "./ProjectDetails/ProjectDetails";
import ProjectFiles from "./ProjectFiles/ProjectFiles";
import ProjectSettings from "./ProjectSettings/ProjectSettings";

// Components
import MiniInfoCard from "../../common/MiniInfoCard";
import Nav from "react-bootstrap/Nav";
import Badge from "react-bootstrap/Badge";
import Stack from "react-bootstrap/Stack";

// Contexts
import { useProjectData } from "../../../context/ProjectDataContext";
import { useAuth } from "../../../context/AuthContext";
import { fetchProjectDataByProjectID } from "./api";
import { formatNumberWithThousandsSeparator } from "./utils";
// Mostrar si tiene asignado validador
// Tiempo restante para verificar

export default function ProjectPage() {
  const { id } = useParams();
  const { projectData, handleProjectData } = useProjectData();
  const { user } = useAuth();

  const [activeSection, setActiveSection] = useState("details");
  
  useEffect(() => {
    const getProjectData = async () => {
      const data = await fetchProjectDataByProjectID(id);
      if (data) {
        await handleProjectData(data);
      }
    };

    getProjectData();

  }, []);

  return (
    <div className="container-sm">
      <div className="pt-3 px-4 mb-4 mt-4 border rounded shadow">
        <div className="row gy-2">
          <header className="d-flex justify-content-between">
            <p className="fs-3 mb-0">{projectData.projectInfo?.title}</p>
            <Stack direction="horizontal" gap={2}>
              <Badge bg="primary">{projectData.projectInfo?.status}</Badge>
              <Badge
                bg={
                  projectData.projectVerifiers?.length > 0
                    ? "success"
                    : "danger"
                }
              >
                {projectData.projectVerifiers?.length > 0
                  ? "Validador asignado"
                  : "Sin validador"}
              </Badge>
            </Stack>
          </header>
          <section>
            <p className="fs-6 mb-0 fw-bold">Fecha de creación:</p>
            <p className="fs-6 mb-0">{projectData.projectInfo?.createdAt}</p>
          </section>
          <section>
            <p className="fs-6 mb-0 fw-bold">Descripción:</p>
            <p className="fs-6 mb-0">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Habitasse platea dictumst quisque sagittis purus sit amet. Eu
              ultrices vitae auctor eu augue ut lectus arcu. Libero id faucibus
              nisl tincidunt eget nullam non. Dictum varius duis at consectetur
              lorem donec massa sapien. Quisque sagittis purus sit amet volutpat
              consequat mauris. Quisque non tellus orci ac auctor augue mauris.
              Molestie nunc non blandit massa enim nec dui nunc mattis. Congue
              eu consequat ac felis donec. Ac auctor augue mauris augue neque
              gravida. Sit amet luctus venenatis lectus magna fringilla urna
            </p>
          </section>
          <section>
            <p className="fs-6 mb-0 fw-bold">Tokenomics:</p>
            <div className="d-flex">
              {projectData.projectInfo?.token.name && (
                <MiniInfoCard
                  label="Nombre del token"
                  value={
                    projectData.projectInfo?.token.name
                  }
                  className="me-2 bg-dark text-white"
                />
              )}
              {projectData.projectInfo?.token.amount && (
                <MiniInfoCard
                  label="Cantidad de tokens"
                  value={formatNumberWithThousandsSeparator(projectData.projectInfo?.token.amount)}
                  className="me-2 bg-dark text-white"
                />
              )}
              {projectData.projectInfo?.token.price && (
                <MiniInfoCard
                  label="Valor del token"
                  value={
                    projectData.projectInfo?.token.price +
                    " " +
                    projectData.projectInfo?.token.priceCurrency
                  }
                  className="me-2 bg-dark text-white"
                />
              )}
            </div>
          </section>
        </div>
        <Nav
          variant="tabs"
          className="mt-3"
          defaultActiveKey={"#" + activeSection}
        >
          <Nav.Item>
            <Nav.Link
              href="#details"
              onClick={() => setActiveSection("details")}
            >
              Detalles
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#files" onClick={() => setActiveSection("files")}>
              Archivos
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              href="#history"
              onClick={() => setActiveSection("history")}
            >
              Actividad
            </Nav.Link>
          </Nav.Item>
          {user?.role === "validator" && (
          <Nav.Item>
            <Nav.Link
              href="#settings"
              onClick={() => setActiveSection("settings")}
            >
              Configuración
            </Nav.Link>
          </Nav.Item>

          )}
        </Nav>
      </div>
      {activeSection === "details" && <ProjectDetails />}
      {activeSection === "files" && <ProjectFiles />}
      {activeSection === "settings" && user?.role === "validator" && <ProjectSettings />}
      <ToastContainer></ToastContainer>
    </div>
  );
}
