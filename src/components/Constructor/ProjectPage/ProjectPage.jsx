import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Sections
import ProjectDetails from "./ProjectDetails/ProjectDetails";
import ProjectFiles from "./ProjectFiles/ProjectFiles";
import ProjectSettings from "./ProjectSettings/ProjectSettings";

// Components
import MiniInfoCard from "../../common/MiniInfoCard";
import Nav from "../../ui/Nav";
import Badge from "../../ui/Badge";
import Stack from "../../ui/Stack";
// import TailwindHeaderNavbar from "../../common/TailwindHeaderNarvbar"


// Contexts
import { useProjectData } from "context/ProjectDataContext";
import { useAuth } from "context/AuthContext";
import { fetchProjectDataByProjectID } from "./api";
import { formatNumberWithThousandsSeparator } from "./utils";
import NewHeaderNavbar from "components/common/NewHeaderNavbar";
import ProjectFileManager from "./ProjectFileManager/ProjectFileManager";
import FinanceCard from "./ProjectFiles/InfoCards/FinanceFilesCard";
import { getProjectProgress } from "services/getProjectProgress";
import { HourGlassIcon } from "components/common/icons/HourGlassIcon";

export default function ProjectPage() {
  const { id } = useParams();
  const { projectData, setNewProjectID } = useProjectData();
  const { user } = useAuth();

  const [progressObj, setProgressObj] = useState(null);
  const [activeSection, setActiveSection] = useState("details");
  const [autorizedUser, setAutorizedUser] = useState(false);
  const [isPostulant, setIsPostulant] = useState(false);
  const [isVerifier, setIsVerifier] = useState(false);
  const [isAdmon, setIsAdmon] = useState(false);

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
    setNewProjectID(id);
  }, [id, setNewProjectID]);

  useEffect(() => {
    if (projectData && user) {
      const verifiers = projectData.projectVerifiers;
      const postulant = projectData.projectPostulant.id;
      const authorizedUsers =
        projectData.projectInfo.projectAge < 20
          ? [...verifiers, postulant]
          : [...verifiers];
      setAutorizedUser(authorizedUsers.includes(user.id));
      setIsPostulant(postulant === user.id);
      setIsVerifier(verifiers.includes(user.id));
      setIsAdmon(user?.role === "admon");
    }
  }, [projectData, user]);

  useEffect(() => {
    if (projectData && user) {
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
  }, [projectData, user]);

  return (
    <div>
      {projectData ? (
        <div classname="container-sm container mx-auto sm:px-4">
          <div className="mb-5">
          <NewHeaderNavbar></NewHeaderNavbar>
          </div>
              <div>
            <div className="pt-3 px-4 mb-4 mt-4 border rounded shadow">
              <div classname="rowflex flex-wrap ">
                <header classname="d-flex justify-content-between flex justify-between">
                  <p className="fs-3 mb-0">{projectData.projectInfo.title}</p>
                  <Stack direction="horizontal" gap={2}>
                    <Badge bg="primary">
                      {projectStatusMapper[projectData.projectInfo.status]}
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
                  <p className="fs-6 mb-0">
                    {projectData.projectInfo.createdAt}
                  </p>
                </section>
                <section>
                  <p className="fs-6 mb-0 fw-bold">Descripción:</p>
                  <p className="fs-6 mb-0">
                    {projectData.projectInfo.description}
                  </p>
                </section>
                <section>
                  <p className="fs-6 mb-0 fw-bold">Tokenomics:</p>
                  <div classname="d-flex flex">
                    {projectData.projectInfo.token.name && (
                      <MiniInfoCard
                        label="Nombre del token"
                        value={projectData.projectInfo.token.name}
                        className="me-2 bg-dark text-white"
                      />
                    )}
                    {projectData.projectInfo.token.actualPeriodTokenAmount && (
                      <MiniInfoCard
                        label="Cantidad de tokens"
                        value={formatNumberWithThousandsSeparator(
                          projectData.projectInfo.token.actualPeriodTokenAmount
                        )}
                        className="me-2 bg-dark text-white"
                      />
                    )}
                    {projectData.projectInfo.token.actualPeriodTokenPrice && (
                      <MiniInfoCard
                        label="Valor del token"
                        value={
                          projectData.projectInfo.token.actualPeriodTokenPrice +
                          " " +
                          projectData.projectInfo.token.currency
                        }
                        className="me-2 bg-dark text-white"
                      />
                    )}
                  </div>
                </section>
                {projectData.projectVerifierNames.length > 0 && (
                  <section>
                    <p className="fs-6 mb-0 fw-bold">Validadores:</p>
                    <Stack direction="horizontal" gap={2}>
                      {projectData.projectVerifierNames.map((pvn, index) => {
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
              <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                <li className="me-2">
                  <a href="#details" className="inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500" onClick={(e) => {
                    e.preventDefault();
                    setActiveSection("details"); }}>
                    Detalles
                    {(autorizedUser || isPostulant || isAdmon) &&
                      (!progressObj?.sectionsStatus.projectInfo ||
                        !progressObj?.sectionsStatus.geodataInfo ||
                        !progressObj?.sectionsStatus.ownersInfo) && (
                          <HourGlassIcon className="text-danger ms-2" />
                      )}
                  </a>
                </li>
                <li className="me-2">
                  <a href="#files" className="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300" onClick={(e) => {
                    e.preventDefault();
                    setActiveSection("files");
                  }}>
                    Validación
                    {(autorizedUser || isPostulant || isAdmon) &&
                      !progressObj?.sectionsStatus.validationsComplete && (
                        <HourGlassIcon className="text-danger ms-2" />
                      )}
                  </a>
                </li>
                {(isVerifier || isAdmon) && (
                  <>
                    <li className="me-2">
                      <a href="#file_manager" className="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300" onClick={(e) => {
                        e.preventDefault();
                        setActiveSection("file_manager");
                      }}>
                        Sistema de datos
                      </a>
                    </li>
                    <li className="me-2">
                      <a href="#settings" className="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300" onClick={(e) => {
                        e.preventDefault();
                        setActiveSection("settings");
                      }}>
                        Configuración
                        {(autorizedUser || isAdmon) &&
                          (!progressObj?.sectionsStatus.technicalInfo ||
                            !progressObj?.sectionsStatus.financialInfo) && (
                              <HourGlassIcon className="text-danger ms-2" />
                          )}
                      </a>
                    </li>
                  </>
                )}
                {user?.id && (isPostulant || isVerifier || isAdmon) && (
                  <>
                    <li className="me-2">
                      <a href="#finance" className="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300" onClick={() => setActiveSection("finance")}>
                        Finanzas
                        {(autorizedUser || isPostulant || isAdmon) &&
                          !progressObj?.sectionsStatus.ownerAcceptsConditions && (
                            <HourGlassIcon className="text-danger ms-2" />
                          )}
                      </a>
                    </li>
                  </>
                )}
              </ul>

            </div>
            <ProjectDetails visible={activeSection === "details"} />
            <ProjectFileManager visible={activeSection === "file_manager"} />
            <ProjectFiles visible={activeSection === "files"} />
            <FinanceCard visible={activeSection === "finance"} />
            <ProjectSettings
              visible={
                activeSection === "settings" &&
                (isVerifier || isAdmon)
              }
            />
          </div>
          <ToastContainer></ToastContainer>
        </div>
      ) : (
        <p>Loading or no data available</p>
      )}
    </div>
  );
}
