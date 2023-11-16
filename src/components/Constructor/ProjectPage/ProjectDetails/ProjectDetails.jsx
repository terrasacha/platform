import React, { useEffect, useState } from "react";
import PostulantInfoCard from "./InfoCards/PostulantInfoCard";
import ProjectInfoCard from "./InfoCards/ProjectInfoCard";
import OwnerInfoCard from "./InfoCards/OwnerInfoCard";
import ActualUseAndPotentialInfoCard from "./InfoCards/ActualUseAndPotentialInfoCard";
import EcosystemInfoCard from "./InfoCards/EcosystemInfoCard";
import PropertyInfoCard from "./InfoCards/PropertyInfoCard";
import RelationsInfoCard from "./InfoCards/RelationsInfoCard";
import GeodataInfoCard from "./InfoCards/GeodataInfoCard";
import { useProjectData } from "../../../../context/ProjectDataContext";
import UseRestrictionsInfoCard from "./InfoCards/UseRestrictionsInfoCard";
import { useAuth } from "context/AuthContext";
import { Alert, ProgressBar } from "react-bootstrap";
import { getProjectProgress } from "services/getProjectProgress";
import { CheckIcon } from "components/common/icons/CheckIcon";
import { XIcon } from "components/common/icons/XIcon";
import { HourGlassIcon } from "components/common/icons/HourGlassIcon";
import { AlertCircleIcon } from "components/common/icons/AlertCircleIcon";

export default function ProjectDetails() {
  const { projectData } = useProjectData();
  const [autorizedUser, setAutorizedUser] = useState(false);
  const [isPostulant, setIsPostulant] = useState(false);
  const { user } = useAuth();

  const [progressChange, setProgressChange] = useState(false);
  const [progressObj, setProgressObj] = useState(null);

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
      console.log("projectData", projectData);
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
  }, [projectData, progressChange]);

  console.log(progressObj, "progress");
  return (
    <div className="row row-cols-1 row-cols-xl-2 g-4">
      {autorizedUser && !(user?.role === "validator") && (
        <div className="col-12 col-xl-12">
          <Alert variant="success" className="mb-0">
            <Alert.Heading>Hola, {user?.name}</Alert.Heading>
            <p>
              Podras realizar ajustes a la información del proyecto durante los
              primeros 20 dias despues de su postulación. Posterior a esto se
              congelan los cambios a menos que exista solicitud formal y se abra
              manualmente en casos excepcionales.
            </p>
            <hr />
            <p className="mb-0">
              {20 - parseInt(projectData?.projectInfo.projectAge)} Dias
              restantes
            </p>
          </Alert>
        </div>
      )}
      {autorizedUser && progressObj && (
        <div className="col-12 col-xl-12">
          <Alert variant="warning" className="mb-0">
            <Alert.Heading>
              Estado de requerimientos para la publicación del proyecto en{" "}
              <a
                href="https://marketplace.suan.global/"
                target="_blank"
                rel="noreferrer"
              >
                Marketplace
              </a>
            </Alert.Heading>
            <p>
              Para garantizar la transparencia, confiabilidad y calidad de los
              proyectos presentados, es necesario cumplir con las siguientes
              condiciones antes de que un proyecto pueda ser visualizado en el
              Marketplace para su comercialización:
            </p>
            <p>
              Como <span className="fs-6 fw-bold">postulante</span> asegúrate de
              completar los siguientes detalles con precisión, proporcionando la
              base sólida que necesitas para destacar en nuestro Marketplace.
            </p>
            <ul>
              <li className="fw-bold">
                (
                {progressObj.sectionsStatus.projectInfo ? (
                  <CheckIcon className="text-success" />
                ) : (
                  <HourGlassIcon className="text-danger" />
                )}
                ) Completar información del proyecto
              </li>
              <li className="fw-bold">
                (
                {progressObj.sectionsStatus.ownersInfo ? (
                  <CheckIcon className="text-success" />
                ) : (
                  <HourGlassIcon className="text-danger" />
                )}
                ) Completar información de titulares y certificados de tradición
              </li>
              <li className="fw-bold">
                (
                {progressObj.sectionsStatus.geodataInfo ? (
                  <CheckIcon className="text-success" />
                ) : (
                  <HourGlassIcon className="text-danger" />
                )}
                ) Completar ubicación geográfica
              </li>
              <li className="fw-bold">
                (
                {progressObj.sectionsStatus.ownerAcceptsConditions ? (
                  <CheckIcon className="text-success" />
                ) : (
                  <HourGlassIcon className="text-danger" />
                )}
                ) Aceptar condiciones financieras
              </li>
            </ul>
            <p>
              Estado de verificación del proyecto por parte del equipo de
              validadores SUAN.
            </p>
            <ul>
              <li className="fw-bold">
                <p className="mb-0">
                  (
                  {progressObj.sectionsStatus.validationsComplete ? (
                    <CheckIcon className="text-success" />
                  ) : (
                    <HourGlassIcon className="text-primary" />
                  )}
                  ) Validación de documentos
                </p>
                <p className="fw-normal">
                  La validación de documentos, como {" "}
                  <span className="fs-6 fw-bold">
                    certificados de tradición y plano del predio
                  </span>
                  , por parte de nuestros especialistas asegura la autenticidad
                  y legalidad del proyecto. Esto es esencial para proteger a
                  todas las partes involucradas y brindar la seguridad necesaria
                  para el desarrollo del proyecto.
                </p>
              </li>
              <li className="fw-bold">
                <p className="mb-0">
                  (
                  {progressObj.sectionsStatus.technicalInfo ? (
                    <CheckIcon className="text-success" />
                  ) : (
                    <HourGlassIcon className="text-primary" />
                  )}
                  ) Oficialización de información Técnica
                </p>
                <p className="fw-normal">
                  La validación de la información técnica por parte de nuestro
                  validador técnico garantizar la viabilidad y conformidad del
                  proyecto con base a los estándares establecidos. Esto no solo
                  ayuda a mitigar riesgos para los inversores, sino que también
                  contribuye a la reputación positiva de los proyectos en
                  nuestra plataforma.
                </p>
              </li>
              <li className="fw-bold">
                <p className="mb-0">
                  (
                  {progressObj.sectionsStatus.financialInfo ? (
                    <CheckIcon className="text-success" />
                  ) : (
                    <HourGlassIcon className="text-primary" />
                  )}
                  ) Oficialización de información Financiera
                </p>
                <p className="fw-normal">
                  La validación de la información financiera por parte de
                  nuestro validador financiero es crucial para asegurar la
                  solidez económica del proyecto. Los inversores confían en que
                  esta información sea precisa y verificada, permitiéndoles
                  tomar decisiones informadas sobre su participación.
                </p>
              </li>
            </ul>
            <hr />
            <p className="mb-0">
              {progressObj.progressValue === 100
                ? "Este proyecto cumple la totalidad de los requerimientos"
                : "Este proyecto aún no cumple la totalidad de requerimientos para su publicación"}
            </p>
            {/* <hr />
            <div>
              <div>
                <ProgressBar
                  striped
                  variant="danger"
                  now={progressObj.progressValue}
                />
              </div>
            </div> */}
          </Alert>
        </div>
      )}
      <div className="col">
        <ProjectInfoCard
          autorizedUser={autorizedUser}
          setProgressChange={setProgressChange}
          tooltip={autorizedUser && (progressObj?.sectionsStatus.projectInfo ? <CheckIcon className="text-success"/> : <AlertCircleIcon className="text-danger"/>)}
        />
      </div>
      <div className="col">
        <GeodataInfoCard
          autorizedUser={autorizedUser}
          setProgressChange={setProgressChange}
          tooltip={autorizedUser && (progressObj?.sectionsStatus.geodataInfo ? <CheckIcon className="text-success"/> : <AlertCircleIcon className="text-danger"/>)}
        />
      </div>
      <div className="col">
        <OwnerInfoCard
          autorizedUser={autorizedUser}
          setProgressChange={setProgressChange}
          tooltip={autorizedUser && (progressObj?.sectionsStatus.ownersInfo ? <CheckIcon className="text-success"/> : <AlertCircleIcon className="text-danger"/>)}
        />
      </div>
      <div className="col">
        <PostulantInfoCard autorizedUser={autorizedUser} />
      </div>
      <div
        className={
          projectData.projectUses?.replaceUse.types.length > 0 ||
          projectData.projectUses?.actualUse.types.length > 0
            ? "col-12 col-lg-12"
            : "col-12"
        }
      >
        <ActualUseAndPotentialInfoCard autorizedUser={autorizedUser} />
      </div>
      <div
        className={
          projectData.projectUses?.replaceUse.types.length > 0 ||
          projectData.projectUses?.actualUse.types.length > 0
            ? "col-12 col-lg-12"
            : "col-12"
        }
      >
        <UseRestrictionsInfoCard autorizedUser={autorizedUser} />
      </div>
      <div className="col-12 col-lg-12">
        <EcosystemInfoCard autorizedUser={autorizedUser} />
      </div>
      <div className="col">
        <PropertyInfoCard autorizedUser={autorizedUser} />
      </div>
      <div className="col">
        <RelationsInfoCard autorizedUser={autorizedUser} />
      </div>
    </div>
  );
}
