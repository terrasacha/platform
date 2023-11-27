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
import { useProjectData } from "context/ProjectDataContext";
import { useAuth } from "context/AuthContext";
import { fetchProjectDataByProjectID } from "./api";
import { formatNumberWithThousandsSeparator } from "./utils";
import NewHeaderNavbar from "components/common/NewHeaderNavbar";
import { Auth } from "aws-amplify";
import ProjectFileManager from "./ProjectFileManager/ProjectFileManager";
import FinanceCard from "./ProjectFiles/InfoCards/FinanceFilesCard";
import { getProjectProgress } from "services/getProjectProgress";
import { CheckIcon } from "components/common/icons/CheckIcon";
import { HourGlassIcon } from "components/common/icons/HourGlassIcon";
// Mostrar si tiene asignado validador
// Tiempo restante para verificar

export default function ProjectPage() {
  const { id } = useParams();
  const { projectData, handleProjectData } = useProjectData();
  const { user } = useAuth();

  const [progressObj, setProgressObj] = useState(null);
  const [activeSection, setActiveSection] = useState("details");
  const [autorizedUser, setAutorizedUser] = useState(false);
  const [isPostulant, setIsPostulant] = useState(false);
  const [isVerifier, setIsVerifier] = useState(false);

  const projectStatusMapper = {
    draft: "En borrador",
    verified: "Verificado",
    on_verification: "En verificación",
    in_blockchain: "En blockchain",
    in_equilibrium: "En equilibrio",
    Prefactibilidad: "En Prefactibilidad",
    Factibilidad: "En Factibilidad",
    "Documento de diseño del proyecto": "En diseño de documento del proyecto",
    "Validación externa": "En validación externa",
    "Registro del proyecto": "Registrado",
  };

  useEffect(() => {
    const getProjectData = async () => {
      const data = await fetchProjectDataByProjectID(id);
      if (data) {
        await handleProjectData(data);
      }
    };

    getProjectData();
  }, []);

  useEffect(() => {
    if (user && projectData) {
      const verifiers = projectData?.projectVerifiers;
      const postulant = projectData?.projectPostulant?.id;
      const authorizedUsers =
        projectData?.projectInfo.projectAge < 20
          ? [...verifiers, postulant]
          : [...verifiers];
      setAutorizedUser(authorizedUsers.includes(user.id));
      setIsPostulant(postulant === user.id);
      setIsVerifier(verifiers.includes(user.id));
    }
  }, [projectData]);

  useEffect(() => {
    if (user && projectData.projectInfo) {
      const progress = async () => {
        try {
          const obj = await getProjectProgress(
            projectData?.projectInfo.id,
            user.subrole
          );
          setProgressObj(obj);
        } catch (error) {
          console.error("Error al obtener datos:", error);
        }
      };
      progress();
    }
  }, [projectData]);

  const postulante = projectData.projectPostulant;

  return (
    <div className="container-sm">
      <div className="mb-5">
        <NewHeaderNavbar></NewHeaderNavbar>
      </div>
      <div className="my-2">-</div>
      <div>
        <div className="pt-3 px-4 mb-4 mt-4 border rounded shadow">
          <div className="row gy-2">
            <header className="d-flex justify-content-between">
              <p className="fs-3 mb-0">{projectData.projectInfo?.title}</p>
              <Stack direction="horizontal" gap={2}>
                <Badge bg="primary">
                  {projectStatusMapper[projectData.projectInfo?.status]}
                </Badge>
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
                {projectData.projectInfo?.description}
              </p>
            </section>
            <section>
              <p className="fs-6 mb-0 fw-bold">Tokenomics:</p>
              <div className="d-flex">
                {projectData.projectInfo?.token.name && (
                  <MiniInfoCard
                    label="Nombre del token"
                    value={projectData.projectInfo?.token.name}
                    className="me-2 bg-dark text-white"
                  />
                )}
                {projectData.projectInfo?.token.actualPeriodTokenAmount && (
                  <MiniInfoCard
                    label="Cantidad de tokens"
                    value={formatNumberWithThousandsSeparator(
                      projectData.projectInfo?.token.actualPeriodTokenAmount
                    )}
                    className="me-2 bg-dark text-white"
                  />
                )}
                {projectData.projectInfo?.token.actualPeriodTokenPrice && (
                  <MiniInfoCard
                    label="Valor del token"
                    value={
                      projectData.projectInfo?.token.actualPeriodTokenPrice +
                      " " +
                      projectData.projectInfo?.token.currency
                    }
                    className="me-2 bg-dark text-white"
                  />
                )}
              </div>
            </section>
            {projectData.projectVerifierNames?.length > 0 && (
              <section>
                <p className="fs-6 mb-0 fw-bold">Validadores:</p>
                <Stack direction="horizontal" gap={2}>
                  {projectData.projectVerifierNames?.map((pvn, index) => {
                    return (
                      <Badge bg="success" className="w-auto" key={index}>
                        Validador {index + 1}: {pvn}
                      </Badge>
                    );
                  })}
                </Stack>
              </section>
            )}
          </div>
          <Nav
            variant="tabs"
            className="mt-3"
            defaultActiveKey={"#" + activeSection}
          >
            <Nav.Item>
              <Nav.Link
                href="#details"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection("details");
                }}
              >
                Detalles
                {(autorizedUser || isPostulant) &&
                  (!progressObj?.sectionsStatus.projectInfo ||
                    !progressObj?.sectionsStatus.geodataInfo ||
                    !progressObj?.sectionsStatus.ownersInfo) && (
                    <HourGlassIcon className="text-danger ms-2" />
                  )}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                href="#files"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection("files");
                }}
              >
                Validación
                {(autorizedUser || isPostulant) &&
                  !progressObj?.sectionsStatus.validationsComplete && (
                    <HourGlassIcon className="text-danger ms-2" />
                  )}
              </Nav.Link>
            </Nav.Item>
            {(isVerifier || user?.role === "admon") && (
              <>
                <Nav.Item>
                  <Nav.Link
                    href="#file_manager"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveSection("file_manager");
                    }}
                  >
                    Sistema de datos
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    href="#settings"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveSection("settings");
                    }}
                  >
                    Configuración
                    {autorizedUser &&
                      (!progressObj?.sectionsStatus.technicalInfo ||
                        !progressObj?.sectionsStatus.financialInfo) && (
                        <HourGlassIcon className="text-danger ms-2" />
                      )}
                  </Nav.Link>
                </Nav.Item>
              </>
            )}
            {user?.id && (isPostulant || isVerifier) && (
              <>
                <Nav.Item>
                  <Nav.Link
                    href="#finance"
                    onClick={() => setActiveSection("finance")}
                  >
                    Finanzas
                    {(autorizedUser || isPostulant) &&
                      !progressObj?.sectionsStatus.ownerAcceptsConditions && (
                        <HourGlassIcon className="text-danger ms-2" />
                      )}
                  </Nav.Link>
                </Nav.Item>
              </>
            )}
          </Nav>
        </div>
        {activeSection === "details" && <ProjectDetails />}
        {activeSection === "file_manager" && <ProjectFileManager />}
        {activeSection === "files" && <ProjectFiles />}
        {activeSection === "finance" && <FinanceCard />}
        {activeSection === "settings" &&
          (isVerifier || user?.role === "admon") && <ProjectSettings />}
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
}
