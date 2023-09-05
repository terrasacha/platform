import React, { useEffect, useState } from "react";
import Nav from "react-bootstrap/Nav";
import ProjectDetails from "./ProjectDetails";
import MiniInfoCard from "../../common/MiniInfoCard";
import { useParams } from "react-router-dom";
import { fetchProjectDataByProjectID } from "./api";
import { useProjectData } from "../../../context/ProjectDataContext";
// Mostrar si tiene asignado validador
// Tiempo restante para verificar

export default function ProjectPage() {
  const { id } = useParams();
  const { projectData, handleProjectData } = useProjectData();

  const [activeSection, setActiveSection] = useState("details");

  useEffect(() => {
    const getProjectData = async () => {
      const data = await fetchProjectDataByProjectID(id);
      if (data) {
        handleProjectData(data);
      }
    };

    getProjectData();
  }, [id]);

  return (
    <div className="container-sm">
      <div className="pt-3 px-4 mb-4 mt-4 border rounded shadow">
        <div className="row gy-2">
          <p className="fs-3 mb-0">{projectData.projectInfo?.title}</p>
          <div className="d-flex">
            <MiniInfoCard
              label="Estado"
              value={projectData.projectInfo?.status}
              className="me-2 bg-success text-white"
            />
            <MiniInfoCard
              label="Fecha de creación"
              value={projectData.projectInfo?.createdAt}
              className="me-2 bg-dark text-white"
            />
            {projectData.projectInfo?.token.price && (
              <MiniInfoCard
                label="Valor del token"
                value={projectData.projectInfo?.token.price + " " + projectData.projectInfo?.token.priceCurrency}
                className="me-2 bg-dark text-white"
              />
            )}
            {projectData.projectInfo?.token.amount && (
              <MiniInfoCard
                label="Cantidad de tokens"
                value={projectData.projectInfo?.token.amount}
                className="me-2 bg-dark text-white"
              />
            )}
          </div>
          <section>
            <p className="fs-6 mb-0 fw-bold">Descripción:</p>
            <p className="fs-6">
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
        </div>
        <Nav
          variant="tabs"
          className="mt-3"
          defaultActiveKey={"#" + activeSection}
        >
          <Nav.Item>
            <Nav.Link
              href="#details"
              onClick={(e) => setActiveSection("details")}
            >
              Detalles
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              href="#statistics"
              onClick={(e) => setActiveSection("statistics")}
            >
              Estadisticas
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#files" onClick={(e) => setActiveSection("files")}>
              Archivos
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              href="#history"
              onClick={(e) => setActiveSection("history")}
            >
              Actividad
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>
      {activeSection === "details" && <ProjectDetails />}
    </div>
  );
}
