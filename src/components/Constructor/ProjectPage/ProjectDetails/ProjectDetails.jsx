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
import { getProjectProgress } from "services/getProjectProgress";
import { CheckIcon } from "components/common/icons/CheckIcon";
import { XIcon } from "components/common/icons/XIcon";
import { HourGlassIcon } from "components/common/icons/HourGlassIcon";
import CadastralRecordsInfoCard from "./InfoCards/CadastralRecordsInfoCard";

export default function ProjectDetails({ visible }) {
  const { projectData } = useProjectData();
  const [autorizedUser, setAutorizedUser] = useState(false);
  const [isPostulant, setIsPostulant] = useState(false);
  const [isVerifier, setIsVerifier] = useState(false);
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
      setAutorizedUser(authorizedUsers.includes(user.id) || user.role === "admon");
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
  }, [projectData, progressChange]);

  return (
    <>
      {visible && (
        <div className="">
          {autorizedUser && !(user?.role === "validator" || user?.role === "admon") && (
            <div className="col-span-2 md:col-span-1">
              <div className="bg-green-100 border-t-4 border-green-500 rounded-b text-green-900 px-4 py-3 shadow-md mb-0">
                <h2>Hola, {user?.name}</h2>
                <p>
                  Podrás realizar ajustes a la información del proyecto durante los primeros
                  20 días después de su postulación. Posterior a esto se congelan los
                  cambios a menos que exista solicitud formal y se abra manualmente en casos
                  excepcionales.
                </p>
                <hr className="my-2" />
                <p className="mb-0">
                  {20 - parseInt(projectData?.projectInfo.projectAge)} Días restantes
                </p>
              </div>
            </div>
          )}

          {(autorizedUser || isPostulant) && progressObj && (
            <div className="col-span-2 md:col-span-1">
              <div className="bg-yellow-100 border-t-4 border-yellow-500 rounded-b text-yellow-900 px-4 py-3 shadow-md mb-20">
                <h2 className="font-bold">
                  Estado de requerimientos para la publicación del proyecto en{" "}
                  <a
                    href="https://marketplace.suan.global/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 underline"
                  >
                    Marketplace
                  </a>
                </h2>
                <p>
                  Para garantizar la transparencia, confiabilidad y calidad de los proyectos
                  presentados, es necesario cumplir con las siguientes condiciones antes de
                  que un proyecto pueda ser visualizado en el Marketplace para su
                  comercialización:
                </p>
                
                <div className="grid grid-cols-2">
    {isPostulant && (
                    <div>
                      <p className="mb-0">Requerimientos del postulante</p>
                      <ul>
                        <li className="font-bold flex items-center">
                          {progressObj.sectionsStatus.projectInfo ? (
                            <svg
                              className="h-4 w-4 text-success mr-1"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1.293-6.707a1 1 0 0 1 1.414 0l4 4a1 1 0 1 1-1.414 1.414L9 12.414l-3.293 3.293a1 1 0 0 1-1.414-1.414l4-4a1 1 0 0 1 0-1.414z"
                              ></path>
                            </svg>
                          ) : (
                            <svg
                              className="h-4 w-4 text-danger mr-1"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M11.414 10l5.293-5.293a1 1 0 0 0-1.414-1.414L10 8.586 4.707 3.293a1 1 0 0 0-1.414 1.414L8.586 10l-5.293 5.293a1 1 0 0 0 1.414 1.414L10 11.414l5.293 5.293a1 1 0 0 0 1.414-1.414L11.414 10z"
                              ></path>
                            </svg>
                          )}
                          Completar información del proyecto
                        </li>
                        <li className="font-bold flex items-center">
                          (
                          {progressObj.sectionsStatus.ownersInfo ? (
                            <CheckIcon className="text-success" />
                          ) : (
                            <HourGlassIcon className="text-danger" />
                          )}
                          ) Completar información de titulares y certificados de
                          tradición
                        </li>
                        <li className="font-bold flex items-center">
                          (
                          {progressObj.sectionsStatus.geodataInfo ? (
                            <CheckIcon className="text-success" />
                          ) : (
                            <HourGlassIcon className="text-danger" />
                          )}
                          ) Completar ubicación geográfica
                        </li>
                        <li className="font-bold flex items-center">
                          (
                          {progressObj.sectionsStatus.ownerAcceptsConditions ? (
                            <CheckIcon className="text-success" />
                          ) : (
                            <HourGlassIcon className="text-danger" />
                          )}
                          ) Aceptar condiciones financieras
                        </li>
                      </ul>
                    </div>
                  )}
                  {isVerifier && (
                    <div>
                      <p className="mb-0">
                        Estado de verificación del proyecto por parte del equipo
                        de validadores SUAN.
                      </p>
                      <ul>
                        <li className="font-bold flex items-center">
                          <p className="mb-0">
                            (
                            {progressObj.sectionsStatus.validationsComplete ? (
                              <CheckIcon className="text-success" />
                            ) : (
                              <HourGlassIcon className="text-danger" />
                            )}
                            ) Validación de documentos
                          </p>
                        </li>
                        <li className="font-bold flex items-center">
                          <p className="mb-0">
                            (
                            {progressObj.sectionsStatus.technicalInfo ? (
                              <CheckIcon className="text-success" />
                            ) : (
                              <HourGlassIcon className="text-danger" />
                            )}
                            ) Oficialización de información Técnica
                          </p>
                        </li>
                        <li className="font-bold flex items-center">
                          <p className="mb-0">
                            (
                            {progressObj.sectionsStatus.financialInfo ? (
                              <CheckIcon className="text-success" />
                            ) : (
                              <HourGlassIcon className="text-danger" />
                            )}
                            ) Oficialización de información Financiera
                          </p>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
                <hr className="my-2" />
                <p className="mb-0">
                  {progressObj.progressValue === 100
                    ? "Este proyecto cumple la totalidad de los requerimientos"
                    : "Este proyecto aún no cumple la totalidad de requerimientos para su publicación"}
                </p>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1">
            <ProjectInfoCard
              autorizedUser={autorizedUser}
              setProgressChange={setProgressChange}
              tooltip={
                (autorizedUser || isPostulant) &&
                (progressObj?.sectionsStatus.projectInfo ? (
                  <CheckIcon className="text-success" />
                ) : (
                  <HourGlassIcon className="text-danger" />
                ))
              }
            />
          </div>
          <div className="col-span-1">
            <GeodataInfoCard
              autorizedUser={autorizedUser}
              setProgressChange={setProgressChange}
              tooltip={
                (autorizedUser || isPostulant) &&
                (progressObj?.sectionsStatus.geodataInfo ? (
                  <CheckIcon className="text-success" />
                ) : (
                  <HourGlassIcon className="text-danger" />
                ))
              }
            />
          </div>
          <div className="col-span-2">
            <CadastralRecordsInfoCard
              autorizedUser={autorizedUser}
              setProgressChange={setProgressChange}
            />
          </div>
          {/* <div className="col-span-1">
            <OwnerInfoCard
              autorizedUser={autorizedUser}
              setProgressChange={setProgressChange}
              tooltip={
                (autorizedUser || isPostulant) &&
                (progressObj?.sectionsStatus.ownersInfo ? (
                  <CheckIcon className="text-success" />
                ) : (
                  <HourGlassIcon className="text-danger" />
                ))
              }
            />
          </div> */}
          <div className="col-span-1">
            <PostulantInfoCard autorizedUser={autorizedUser} />
          </div>
          <div
            className={
              projectData.projectUses?.replaceUse.types.length > 0 ||
              projectData.projectUses?.actualUse.types.length > 0
                ? "col-span-2 lg:col-span-1"
                : "col-span-1"
            }
          >
            <ActualUseAndPotentialInfoCard autorizedUser={autorizedUser} />
          </div>
          <div
            className={
              projectData.projectUses?.replaceUse.types.length > 0 ||
              projectData.projectUses?.actualUse.types.length > 0
                ? "col-span-2 lg:col-span-1"
                : "col-span-1"
            }
          >
            <UseRestrictionsInfoCard autorizedUser={autorizedUser} />
          </div>
          <div className="col-span-2 lg:col-span-1">
            <EcosystemInfoCard autorizedUser={autorizedUser} />
          </div>
          <div className="col-span-1">
            <PropertyInfoCard autorizedUser={autorizedUser} />
          </div>
          <div className="col-span-1">
            <RelationsInfoCard autorizedUser={autorizedUser} />
          </div>
        </div>
        </div>
      )}
    </>
  );
}
