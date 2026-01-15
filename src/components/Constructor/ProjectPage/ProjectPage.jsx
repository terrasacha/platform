import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Auth } from "aws-amplify";
// Sections
import ProjectDetails from "./ProjectDetails/ProjectDetails";
import ProjectFiles from "./ProjectFiles/ProjectFiles";
import ProjectSettings from "./ProjectSettings/ProjectSettings";

// Components

// Contexts
import { useProjectData } from "context/ProjectDataContext";
import { useAuth } from "context/AuthContext";
import { S3ClientProvider } from "context/s3ClientContext";
import { fetchProjectDataByProjectID } from "./api";
import { formatNumberWithThousandsSeparator } from "./utils";
import { formatArea } from "./mappers";
import ProjectFileManager from "./ProjectFileManager/ProjectFileManager";
import FinanceCard from "./ProjectFiles/InfoCards/FinanceFilesCard";
import { getProjectProgress } from "services/getProjectProgress";
import { HourGlassIcon } from "components/common/icons/HourGlassIcon";
import { CheckIcon } from "components/common/icons/CheckIcon";
import { API, graphqlOperation } from "aws-amplify";
import ProjectAnalysis from "./ProjectAnalysis/ProjectAnalysis";
import AlertMessage from "./AlertMessage";
import { FiEdit3 } from "react-icons/fi";
import TimelineProject from "./TimeLineProject";
import LOGO from "../../common/_images/suan_logo.png";
import TerrasachaLogo from "components/common/TerrasachaLogo";
import { marketplaceURLMapper } from "./mappers";

// Mostrar si tiene asignado validador
// Tiempo restante para verificar

const GET_PRODUCT_QUERY = `
  query MyQuery($id: ID!) {
    getProduct(id: $id) {
      id
      name
      campaign {
        name
        id
        available
        initialDate
        endDate
        description
      }
      campaignID
    }
  }
`;

export default function ProjectPage() {
  const { id } = useParams();
  const { projectData, handleProjectData } = useProjectData();
  const { user } = useAuth();

  const [progressObj, setProgressObj] = useState(null);
  const [activeSection, setActiveSection] = useState("general");
  const [autorizedUser, setAutorizedUser] = useState(false);
  const [isPostulant, setIsPostulant] = useState(false);
  const [isVerifier, setIsVerifier] = useState(false);
  const [isAdmon, setIsAdmon] = useState(false);
  const [isAnalyst, setIsAnalyst] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editableTitle, setEditableTitle] = useState("");
  const [campaign, setCampaign] = useState(null);
  const [userGroup, setUserGroup] = useState("");
  const [totalArea, setTotalArea] = useState(0);
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

  // Función helper para obtener colores de badge según estado del proyecto
  const getProjectStatusBadgeStyle = (status) => {
    const statusLower = status?.toLowerCase() || '';
    
    // Estados pendientes/en proceso (amarillo)
    if (statusLower.includes('prefactibilidad') || 
        statusLower.includes('borrador') || 
        statusLower.includes('verificación') ||
        statusLower.includes('diseño')) {
      return {
        backgroundColor: '#e8d79a', // Amarillo Tierra
        color: '#44482c' // Verde Bosques Nublados (texto oscuro)
      };
    }
    
    // Estados aprobados/completados (verde)
    if (statusLower.includes('factibilidad') || 
        statusLower.includes('verificado') || 
        statusLower.includes('registrado') ||
        statusLower.includes('blockchain') ||
        statusLower.includes('equilibrio')) {
      return {
        backgroundColor: '#849b50', // Verde Pradera
        color: 'white'
      };
    }
    
    // Estado por defecto
    return {
      backgroundColor: '#6e6c35', // Verde Bosques Nublados
      color: 'white'
    };
  };

  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
  if (!projectData || !progressObj) return;

  const {
    projectInfo,
    geodataInfo,
    technicalInfo,
    financialInfo,
    ownerAcceptsConditions,
    projectOnMarketplace,
  } = progressObj.sectionsStatus || {};

  console.log("🧠 Evaluando paso actual según reglas nuevas:", {
    campaignAvailable: campaign?.available,
    projectInfo,
    geodataInfo,
    technicalInfo,
    financialInfo,
    technicalFreeze: projectData.isTechnicalFreeze,
    financialFreeze: projectData.isFinancialFreeze,
    ownerAcceptsConditions,
    projectOnMarketplace,
  });

  let step = 2; // 🔵 Paso 2 por defecto: esperando cierre de campaña

  // 🟠 Paso 3: Campaña cerrada pero falta info
  if (
    campaign?.available === false &&
    (!projectInfo || !geodataInfo || !technicalInfo || !financialInfo)
  ) {
    step = 3;
  }

  // 🟡 Paso 4: Datos congelados, pero condiciones no aceptadas
  if (
    projectData.isTechnicalFreeze &&
    projectData.isFinancialFreeze &&
    !ownerAcceptsConditions
  ) {
    step = 4;
  }

  // 🟢 Paso 5: Proyecto publicado
  if (projectOnMarketplace) {
    step = 5;
  }

  setCurrentStep(step);
}, [projectData, progressObj, campaign?.available]);


  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        const groups = user.signInUserSession.idToken.payload[
          "cognito:groups"
        ] || [""];
        setUserGroup(groups[0]);
      } catch (error) {
        console.error("Error fetching user groups: ", error);
      }
    };

    fetchUserGroups();
    const fetchProjectData = async () => {
      await handleProjectData({ pID: id });
    };
    if (id) {
      fetchProjectData();
    }
  }, [id]);

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
      setIsAnalyst(user?.role === "analyst");
      setTotalArea(projectData.projectInfo.area || 0);
    }
  }, [projectData, user]);

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const result = await API.graphql(
          graphqlOperation(GET_PRODUCT_QUERY, { id })
        );
        const campaignData = result?.data?.getProduct?.campaign;
        setCampaign(campaignData); // Actualiza el estado con la campaña asociada
      } catch (error) {
        console.error("Error fetching campaign data: ", error);
      }
    };

    if (id) {
      fetchCampaignData();
    }
  }, [id]);

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

  useEffect(() => {
    if (projectData?.projectInfo?.title) {
      setEditableTitle(projectData.projectInfo.title);
    }
  }, [projectData]);

  const updateProduct = async (productId, newName) => {
    try {
      const mutation = `
        mutation UpdateProduct($input: UpdateProductInput!) {
          updateProduct(input: $input) {
            id
            name
          }
        }
      `;
      const input = {
        id: productId,
        name: newName,
      };
      const response = await API.graphql(graphqlOperation(mutation, { input }));
      return response;
    } catch (error) {
      console.error("Error actualizando el producto:", error);
      throw error;
    }
  };

  const checkDuplicateProjectName = async (name) => {
    try {
      const query = `
        query GetProjectsByName($name: String!) {
          listProducts(filter: { name: { eq: $name } }) {
            items {
              id
              name
            }
          }
        }
      `;
      const response = await API.graphql(graphqlOperation(query, { name }));
      return response.data.listProducts.items; // Devuelve los proyectos que coincidan
    } catch (error) {
      console.error("Error verificando nombres duplicados:", error);
      throw error;
    }
  };

  return (
    <S3ClientProvider>
      <div>
        {projectData ? (
          <div className="pt-8 px-4 pb-4 sm:pt-6 sm:px-6 sm:pb-6 lg:pt-8 lg:px-8 lg:pb-8">
            {/* Header */}
              <div className="mb-6 sm:mb-8 bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-terrasacha-light/20">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Left Column - Información Principal */}
                  <div className="flex-1">
                    {/* Title */}
                    {isEditingTitle ? (
                      <div className="mb-3 flex items-center gap-2">
                        <input
                          type="text"
                          className="flex-1 px-3 py-2 text-2xl sm:text-3xl font-bold text-terrasacha-primary border border-terrasacha-light rounded-lg focus:ring-2 focus:ring-terrasacha-primary focus:border-transparent font-typographica"
                          value={editableTitle}
                          onChange={(e) => setEditableTitle(e.target.value)}
                        />
                        <button
                          className="px-4 py-2 bg-[#849b50] text-white rounded-lg hover:bg-[#6e6c35] transition-colors font-typographica font-medium"
                          onClick={async () => {
                            try {
                              if (editableTitle.trim() === "") {
                                toast.error(
                                  "El título no puede estar vacío."
                                );
                                return;
                              }
                              const duplicates =
                                await checkDuplicateProjectName(
                                  editableTitle
                                );
                              if (
                                duplicates.length > 0 &&
                                duplicates[0].id !==
                                  projectData.projectInfo.id
                              ) {
                                toast.error(
                                  "El nombre del proyecto ya existe. Elige otro."
                                );
                                setEditableTitle(
                                  projectData.projectInfo.title
                                );
                                return;
                              }

                              await updateProduct(
                                projectData.projectInfo.id,
                                editableTitle
                              );
                              await handleProjectData({
                                pID: projectData.projectInfo.id,
                              });
                              toast.success(
                                "Título actualizado exitosamente"
                              );
                            } catch (error) {
                              console.error(
                                "Error actualizando el título:",
                                error
                              );
                              toast.error(
                                "Error al actualizar el título. Intenta nuevamente."
                              );
                            } finally {
                              setIsEditingTitle(false);
                            }
                          }}
                        >
                          Confirmar
                        </button>
                        <button
                          className="px-4 py-2 bg-[#dc3545] text-white rounded-lg hover:bg-[#c82333] transition-colors font-typographica font-medium"
                          onClick={() => {
                            setEditableTitle(projectData.projectInfo.title);
                            setIsEditingTitle(false);
                          }}
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mb-3">
                        <h1 className="text-2xl sm:text-3xl font-bold text-terrasacha-primary font-typographica">
                          {editableTitle}
                        </h1>
                        {isPostulant && (
                          <button
                            className="bg-transparent border-0 p-0 hover:opacity-70 transition-opacity"
                            onClick={() => setIsEditingTitle(true)}
                            title="Editar título"
                            aria-label="Editar título"
                          >
                            <FiEdit3 size={20} className="text-terrasacha-secondary1" />
                          </button>
                        )}
                      </div>
                    )}

                    {/* Información del Proyecto en Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                      {/* Fecha de creación */}
                      {projectData.projectInfo.createdAt && (
                        <div className="flex items-start space-x-2">
                          <svg className="w-5 h-5 text-terrasacha-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <p className="text-xs text-terrasacha-secondary1 font-typographica">Fecha de creación</p>
                            <p className="text-sm font-semibold text-terrasacha-primary font-typographica">
                              {projectData.projectInfo.createdAt}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Categoría */}
                      {projectData.projectInfo.category && (
                        <div className="flex items-start space-x-2">
                          <svg className="w-5 h-5 text-terrasacha-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          <div>
                            <p className="text-xs text-terrasacha-secondary1 font-typographica">Categoría</p>
                            <p className="text-sm font-semibold text-terrasacha-primary font-typographica">
                              {projectData.projectInfo.category}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Área total */}
                      {totalArea > 0 && (
                        <div className="flex items-start space-x-2">
                          <svg className="w-5 h-5 text-terrasacha-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                          <div>
                            <p className="text-xs text-terrasacha-secondary1 font-typographica">Área total</p>
                            <p className="text-sm font-semibold text-terrasacha-primary font-typographica">
                              {formatArea(totalArea)}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Ubicación */}
                      {(projectData.projectInfo.location?.municipio || projectData.projectInfo.location?.vereda) && (
                        <div className="flex items-start space-x-2">
                          <svg className="w-5 h-5 text-terrasacha-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div>
                            <p className="text-xs text-terrasacha-secondary1 font-typographica">Ubicación</p>
                            <p className="text-sm font-semibold text-terrasacha-primary font-typographica">
                              {projectData.projectInfo.location.municipio || "No especificado"}
                              {projectData.projectInfo.location.vereda && `, ${projectData.projectInfo.location.vereda}`}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Tokens totales */}
                      {projectData.projectInfo.token?.totalTokenAmount && (
                        <div className="flex items-start space-x-2">
                          <svg className="w-5 h-5 text-terrasacha-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <p className="text-xs text-terrasacha-secondary1 font-typographica">Tokens totales</p>
                            <p className="text-sm font-semibold text-terrasacha-primary font-typographica">
                              {formatNumberWithThousandsSeparator(projectData.projectInfo.token.totalTokenAmount)}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Consultores */}
                      {projectData.projectVerifierNames?.length > 0 && (
                        <div className="flex items-start space-x-2">
                          <svg className="w-5 h-5 text-terrasacha-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <div className="flex-1">
                            <p className="text-xs text-terrasacha-secondary1 font-typographica mb-1">Consultores</p>
                            <div className="flex flex-wrap gap-1.5">
                              {projectData.projectVerifierNames.map((name, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 bg-terrasacha-light/20 text-terrasacha-primary text-xs rounded-md font-typographica"
                                >
                                  {name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Descripción */}
                    {projectData.projectInfo.description && (
                      <div className="mt-4 pt-4 border-t border-terrasacha-light/20">
                        <p className="text-sm text-terrasacha-secondary1 font-typographica">
                          {projectData.projectInfo.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Estado y Badges */}
                  <div className="flex flex-col items-end lg:items-start gap-3">
                    {projectData.projectInfo.status && (
                      <div className="flex items-center space-x-2">
                        <span
                          className="text-xs font-bold px-3 py-1.5 rounded-lg font-typographica shadow-sm"
                          style={getProjectStatusBadgeStyle(projectData.projectInfo.status)}
                        >
                          {projectStatusMapper[projectData.projectInfo.status] || projectData.projectInfo.status}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg font-typographica shadow-sm ${
                          projectData.projectVerifiers?.length > 0
                            ? "bg-[#849b50] text-white"
                            : "bg-[#dc3545] text-white"
                        }`}
                      >
                        {projectData.projectVerifiers?.length > 0
                          ? "Consultor asignado"
                          : "Sin consultor"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg font-typographica shadow-sm ${
                          projectData.projectInfo.isActive
                            ? "bg-[#849b50] text-white"
                            : "bg-[#dc3545] text-white"
                        }`}
                      >
                        {projectData.projectInfo.isActive
                          ? "Publicado en marketplace"
                          : "No publicado en marketplace"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información Contextual: Verificación y Marketplace */}
              <div className="mb-6 sm:mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Card de Verificación */}
                <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-terrasacha-light/20 p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-10 h-10 bg-[#849b50]/10 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#849b50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-base font-bold text-terrasacha-primary font-typographica">
                      Estado de Verificación
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-terrasacha-secondary1 font-typographica">Verificación Técnica</span>
                      {projectData.isTechnicalFreeze ? (
                        <div className="flex items-center space-x-1">
                          <CheckIcon className="text-[#849b50] w-4 h-4" />
                          <span className="text-xs font-semibold text-[#849b50] font-typographica">Completada</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <HourGlassIcon className="text-[#e8d79a] w-4 h-4" />
                          <span className="text-xs font-semibold text-[#e8d79a] font-typographica">Pendiente</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-terrasacha-light/20">
                      <span className="text-xs text-terrasacha-secondary1 font-typographica">Verificación Financiera</span>
                      {projectData.isFinancialFreeze ? (
                        <div className="flex items-center space-x-1">
                          <CheckIcon className="text-[#849b50] w-4 h-4" />
                          <span className="text-xs font-semibold text-[#849b50] font-typographica">Completada</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <HourGlassIcon className="text-[#e8d79a] w-4 h-4" />
                          <span className="text-xs font-semibold text-[#e8d79a] font-typographica">Pendiente</span>
                        </div>
                      )}
                    </div>
                    {projectData.projectVerifierNames?.length > 0 && (
                      <div className="pt-2 border-t border-terrasacha-light/20">
                        <p className="text-xs text-terrasacha-secondary1 font-typographica mb-2">Consultores asignados</p>
                        <div className="flex flex-wrap gap-1.5">
                          {projectData.projectVerifierNames.map((name, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 bg-[#849b50]/10 text-[#849b50] text-xs rounded-md font-typographica"
                            >
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card de Marketplace */}
                <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-terrasacha-light/20 p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-10 h-10 bg-terrasacha-primary/10 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-terrasacha-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                    <h3 className="text-base font-bold text-terrasacha-primary font-typographica">
                      Marketplace
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-terrasacha-secondary1 font-typographica">Estado de publicación</span>
                      {projectData.projectInfo.isActive ? (
                        <div className="flex items-center space-x-1">
                          <CheckIcon className="text-[#849b50] w-4 h-4" />
                          <span className="text-xs font-semibold text-[#849b50] font-typographica">Publicado</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <HourGlassIcon className="text-[#e8d79a] w-4 h-4" />
                          <span className="text-xs font-semibold text-[#e8d79a] font-typographica">No publicado</span>
                        </div>
                      )}
                    </div>
                    {projectData.projectInfo.marketplaceID && (
                      <div className="pt-2 border-t border-terrasacha-light/20">
                        <p className="text-xs text-terrasacha-secondary1 font-typographica mb-1">Marketplace</p>
                        <p className="text-sm font-semibold text-terrasacha-primary font-typographica capitalize">
                          {projectData.projectInfo.marketplaceID}
                        </p>
                      </div>
                    )}
                    {projectData.projectInfo.isActive && projectData.projectInfo.marketplaceID && (
                      <div className="pt-2 border-t border-terrasacha-light/20">
                        <a
                          href={marketplaceURLMapper[projectData.projectInfo.marketplaceID]?.[process.env.REACT_APP_ENV]}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center text-xs text-[#849b50] hover:text-[#6e6c35] font-semibold font-typographica underline"
                        >
                          Ver en Marketplace
                          <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="mb-4 sm:mb-5">
                <nav className="flex flex-wrap gap-1.5 sm:gap-2 overflow-x-auto px-3 sm:px-4 py-2 bg-terrasacha-light/10 border border-terrasacha-light/20 rounded-md">
                  <button
                    onClick={() => setActiveSection("general")}
                    className={`py-1.5 px-3 sm:px-4 rounded-md font-typographica font-medium transition-all whitespace-nowrap text-xs sm:text-sm ${
                      activeSection === "general"
                        ? "bg-white text-[#6e6c35] shadow-lg"
                        : "text-terrasacha-secondary1 hover:bg-terrasacha-light/20"
                    }`}
                    aria-label="Información general del proyecto"
                  >
                    General
                  </button>

                  {(autorizedUser || isPostulant) && progressObj && (
                    <button
                      onClick={() => setActiveSection("requirements")}
                      className={`py-1.5 px-3 sm:px-4 rounded-md font-typographica font-medium transition-all whitespace-nowrap text-xs sm:text-sm flex items-center ${
                        activeSection === "requirements"
                          ? "bg-white text-[#6e6c35] shadow-lg"
                          : "text-terrasacha-secondary1 hover:bg-terrasacha-light/20"
                      }`}
                      aria-label="Requerimientos para publicación en Marketplace"
                    >
                      Requerimientos
                      {progressObj.progressValue !== 100 && (
                        <HourGlassIcon className="text-terrasacha-danger ms-2" />
                      )}
                    </button>
                  )}

                  <button
                    onClick={() => setActiveSection("details")}
                    className={`py-1.5 px-3 sm:px-4 rounded-md font-typographica font-medium transition-all whitespace-nowrap text-xs sm:text-sm flex items-center ${
                      activeSection === "details"
                        ? "bg-white text-[#6e6c35] shadow-lg"
                        : "text-terrasacha-secondary1 hover:bg-terrasacha-light/20"
                    }`}
                    aria-label="Ver detalles del proyecto"
                  >
                    Detalles
                    {(autorizedUser || isPostulant || isAdmon) &&
                      (!progressObj?.sectionsStatus.projectInfo ||
                        !progressObj?.sectionsStatus.geodataInfo) && (
                        <HourGlassIcon className="text-terrasacha-danger ms-2" />
                      )}
                  </button>

                  {(isVerifier || isAdmon || isAnalyst) && (
                    <button
                      onClick={() => setActiveSection("file_manager")}
                      className={`py-1.5 px-3 sm:px-4 rounded-md font-typographica font-medium transition-all whitespace-nowrap text-xs sm:text-sm ${
                        activeSection === "file_manager"
                          ? "bg-white text-[#6e6c35] shadow-lg"
                          : "text-terrasacha-secondary1 hover:bg-terrasacha-light/20"
                      }`}
                      aria-label="Sistema de datos"
                    >
                      Sistema de datos
                    </button>
                  )}

                  {(isVerifier || isAdmon) && (
                    <button
                      onClick={() => setActiveSection("settings")}
                      className={`py-1.5 px-3 sm:px-4 rounded-md font-typographica font-medium transition-all whitespace-nowrap text-xs sm:text-sm flex items-center ${
                        activeSection === "settings"
                          ? "bg-white text-[#6e6c35] shadow-lg"
                          : "text-terrasacha-secondary1 hover:bg-terrasacha-light/20"
                      }`}
                      aria-label="Configuración del proyecto"
                    >
                      Configuración
                      {(autorizedUser || isAdmon) &&
                        (!progressObj?.sectionsStatus.technicalInfo ||
                          !progressObj?.sectionsStatus.financialInfo) && (
                          <HourGlassIcon className="text-terrasacha-danger ms-2" />
                        )}
                    </button>
                  )}

                  {user?.id &&
                    (isPostulant || isVerifier || isAdmon) &&
                    projectData.isFinancialFreeze &&
                    projectData.isTechnicalFreeze && (
                      <button
                        onClick={() => setActiveSection("finance")}
                        className={`py-1.5 px-3 sm:px-4 rounded-md font-typographica font-medium transition-all whitespace-nowrap text-xs sm:text-sm flex items-center ${
                          activeSection === "finance"
                            ? "bg-white text-[#6e6c35] shadow-lg"
                            : "text-terrasacha-secondary1 hover:bg-terrasacha-light/20"
                        }`}
                        aria-label="Información financiera"
                      >
                        Finanzas
                        {(autorizedUser || isPostulant || isAdmon) &&
                          !progressObj?.sectionsStatus
                            .ownerAcceptsConditions && (
                            <HourGlassIcon className="text-terrasacha-danger ms-2" />
                          )}
                      </button>
                    )}
                  {(isAdmon || isAnalyst) && (
                    <button
                      onClick={() => setActiveSection("analysis")}
                      className={`py-1.5 px-3 sm:px-4 rounded-md font-typographica font-medium transition-all whitespace-nowrap text-xs sm:text-sm ${
                        activeSection === "analysis"
                          ? "bg-white text-[#6e6c35] shadow-lg"
                          : "text-terrasacha-secondary1 hover:bg-terrasacha-light/20"
                      }`}
                      aria-label="Análisis del proyecto"
                    >
                      Análisis
                    </button>
                  )}
                </nav>
              </div>
              
              {/* Content Sections */}
              <div className="space-y-6 sm:space-y-8">
                {/* Sección General */}
                {activeSection === "general" && campaign && (
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-terrasacha-light/20 p-4 sm:p-6">
                    <div className="flex items-center space-x-2 mb-6">
                      <div className="w-10 h-10 bg-terrasacha-secondary2/10 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-terrasacha-secondary2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-bold text-terrasacha-primary font-typographica">
                        Información de la Campaña
                      </h2>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div>
                        <p className="text-xs text-terrasacha-secondary1 font-typographica mb-1">
                          Nombre
                        </p>
                        <p className="text-base font-semibold text-terrasacha-primary font-typographica">
                          {campaign.name}
                        </p>
                      </div>
                      
                      {(campaign.initialDate || campaign.endDate) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-terrasacha-light/20">
                          <div>
                            <p className="text-xs text-terrasacha-secondary1 font-typographica mb-1">
                              Fecha de inicio
                            </p>
                            <p className="text-sm font-semibold text-terrasacha-primary font-typographica">
                              {campaign.initialDate
                                ? new Date(
                                    campaign.initialDate * 1000
                                  ).toLocaleDateString("es-ES", { day: '2-digit', month: 'long', year: 'numeric' })
                                : "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-terrasacha-secondary1 font-typographica mb-1">
                              Fecha de fin
                            </p>
                            <p className="text-sm font-semibold text-terrasacha-primary font-typographica">
                              {campaign.endDate
                                ? new Date(
                                    campaign.endDate * 1000
                                  ).toLocaleDateString("es-ES", { day: '2-digit', month: 'long', year: 'numeric' })
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {campaign.description && (
                        <div className="pt-4 border-t border-terrasacha-light/20">
                          <p className="text-xs text-terrasacha-secondary1 font-typographica mb-2">
                            Descripción
                          </p>
                          <p className="text-sm text-terrasacha-secondary1 font-typographica leading-relaxed">
                            {campaign.description}
                          </p>
                        </div>
                      )}
                      
                      <div className="pt-4 border-t border-terrasacha-light/20">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-3 py-1.5 text-sm rounded-md font-typographica font-medium ${
                            campaign.available
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {campaign.available ? "Disponible" : "Cerrada"}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Timeline sin steps - Versión mejorada */}
                    <div className="pt-6 border-t border-terrasacha-light/20">
                      <h3 className="text-lg font-bold text-terrasacha-primary font-typographica mb-4">
                        Estado del Proyecto
                      </h3>
                      <div className="space-y-3">
                        {[
                          { id: 1, title: "Proyecto creado", completed: currentStep >= 1, current: currentStep === 1 },
                          { id: 2, title: "Cierre de convocatoria", completed: currentStep >= 2, current: currentStep === 2 },
                          { id: 3, title: "Completar información", completed: currentStep >= 3, current: currentStep === 3 },
                          { id: 4, title: "Condiciones financieras", completed: currentStep >= 4, current: currentStep === 4 },
                          { id: 5, title: "Proyecto subido a marketplace", completed: currentStep >= 5, current: currentStep === 5 },
                        ].map((step) => (
                          <div
                            key={step.id}
                            className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                              step.current
                                ? "bg-terrasacha-earth/10 border-terrasacha-earth shadow-md"
                                : step.completed
                                ? "bg-terrasacha-success/10 border-terrasacha-success"
                                : "bg-gray-50 border-gray-200 opacity-60"
                            }`}
                          >
                            <div
                              className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${
                                step.current
                                  ? "bg-terrasacha-earth text-white animate-pulse"
                                  : step.completed
                                  ? "bg-terrasacha-success text-white"
                                  : "bg-gray-300 text-gray-500"
                              }`}
                            >
                              {step.completed ? "✓" : step.id}
                            </div>
                            <div className="flex-1">
                              <p
                                className={`text-sm font-semibold font-typographica ${
                                  step.current
                                    ? "text-terrasacha-earth"
                                    : step.completed
                                    ? "text-terrasacha-success"
                                    : "text-gray-500"
                                }`}
                              >
                                {step.title}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {activeSection === "general" && !campaign && (
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-terrasacha-light/20 p-4 sm:p-6">
                    <div className="text-center py-8">
                      <p className="text-terrasacha-secondary1 font-typographica">
                        No hay información de campaña disponible
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Sección de Requerimientos de Marketplace */}
                {activeSection === "requirements" && (autorizedUser || isPostulant) && progressObj && (
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-terrasacha-light/20 p-4 sm:p-6">
                    <div className="flex items-center space-x-2 mb-6">
                      <div className="w-10 h-10 bg-[#6e6c35]/10 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#6e6c35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-[#6e6c35] font-typographica">
                          Estado de Requerimientos
                        </h2>
                        <p className="text-sm text-[#44482c] font-typographica">
                          Para publicación en{" "}
                          <a
                            href={marketplaceURLMapper[projectData.projectInfo.marketplaceID || 'suan']?.[process.env.REACT_APP_ENV]}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#849b50] hover:text-[#6e6c35] underline font-semibold"
                          >
                            Marketplace
                          </a>
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-[#44482c] font-typographica leading-relaxed">
                        Para garantizar la transparencia, confiabilidad y calidad de los proyectos presentados, 
                        es necesario cumplir con las siguientes condiciones antes de que un proyecto pueda ser 
                        visualizado en el Marketplace para su comercialización:
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                      {/* Requerimientos del Postulante */}
                      <div className="bg-[#e8d79a]/10 rounded-lg p-4 border border-[#e8d79a]/30">
                        <h3 className="text-base font-bold text-[#44482c] font-champagne mb-4">
                          Requerimientos del Postulante
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {progressObj.sectionsStatus.projectInfo &&
                              progressObj.sectionsStatus.geodataInfo &&
                              progressObj.sectionsStatus.predialInfo ? (
                                <div className="w-6 h-6 rounded-full bg-[#849b50] flex items-center justify-center">
                                  <CheckIcon className="text-white w-3.5 h-3.5" />
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-[#dc3545] flex items-center justify-center">
                                  <HourGlassIcon className="text-white w-3.5 h-3.5" />
                                </div>
                              )}
                            </div>
                            <p className={`text-sm font-typographica flex-1 ${
                              progressObj.sectionsStatus.projectInfo &&
                              progressObj.sectionsStatus.geodataInfo &&
                              progressObj.sectionsStatus.predialInfo
                                ? "text-[#44482c]"
                                : "text-[#44482c]/70"
                            }`}>
                              Completar información del proyecto
                            </p>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {progressObj.sectionsStatus.ownerAcceptsConditions ? (
                                <div className="w-6 h-6 rounded-full bg-[#849b50] flex items-center justify-center">
                                  <CheckIcon className="text-white w-3.5 h-3.5" />
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-[#dc3545] flex items-center justify-center">
                                  <HourGlassIcon className="text-white w-3.5 h-3.5" />
                                </div>
                              )}
                            </div>
                            <p className={`text-sm font-typographica flex-1 ${
                              progressObj.sectionsStatus.ownerAcceptsConditions
                                ? "text-[#44482c]"
                                : "text-[#44482c]/70"
                            }`}>
                              Aceptar condiciones financieras
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Requerimientos del Equipo SUAN */}
                      <div className="bg-[#b1c181]/10 rounded-lg p-4 border border-[#b1c181]/30">
                        <h3 className="text-base font-bold text-[#44482c] font-champagne mb-4">
                          Estado de Verificación
                        </h3>
                        <p className="text-xs text-[#44482c]/80 font-typographica mb-4">
                          Por parte del equipo de Consultores SUAN
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {progressObj.sectionsStatus.technicalInfo ? (
                                <div className="w-6 h-6 rounded-full bg-[#849b50] flex items-center justify-center">
                                  <CheckIcon className="text-white w-3.5 h-3.5" />
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-[#dc3545] flex items-center justify-center">
                                  <HourGlassIcon className="text-white w-3.5 h-3.5" />
                                </div>
                              )}
                            </div>
                            <p className={`text-sm font-typographica flex-1 ${
                              progressObj.sectionsStatus.technicalInfo
                                ? "text-[#44482c]"
                                : "text-[#44482c]/70"
                            }`}>
                              Oficialización de información Técnica
                            </p>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {progressObj.sectionsStatus.financialInfo ? (
                                <div className="w-6 h-6 rounded-full bg-[#849b50] flex items-center justify-center">
                                  <CheckIcon className="text-white w-3.5 h-3.5" />
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-[#dc3545] flex items-center justify-center">
                                  <HourGlassIcon className="text-white w-3.5 h-3.5" />
                                </div>
                              )}
                            </div>
                            <p className={`text-sm font-typographica flex-1 ${
                              progressObj.sectionsStatus.financialInfo
                                ? "text-[#44482c]"
                                : "text-[#44482c]/70"
                            }`}>
                              Oficialización de información Financiera
                            </p>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {progressObj.sectionsStatus.tokenGenesis ? (
                                <div className="w-6 h-6 rounded-full bg-[#849b50] flex items-center justify-center">
                                  <CheckIcon className="text-white w-3.5 h-3.5" />
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-[#dc3545] flex items-center justify-center">
                                  <HourGlassIcon className="text-white w-3.5 h-3.5" />
                                </div>
                              )}
                            </div>
                            <p className={`text-sm font-typographica flex-1 ${
                              progressObj.sectionsStatus.tokenGenesis
                                ? "text-[#44482c]"
                                : "text-[#44482c]/70"
                            }`}>
                              Distribución de tokens del proyecto
                            </p>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {progressObj.sectionsStatus.projectOnMarketplace ? (
                                <div className="w-6 h-6 rounded-full bg-[#849b50] flex items-center justify-center">
                                  <CheckIcon className="text-white w-3.5 h-3.5" />
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-[#dc3545] flex items-center justify-center">
                                  <HourGlassIcon className="text-white w-3.5 h-3.5" />
                                </div>
                              )}
                            </div>
                            <p className={`text-sm font-typographica flex-1 ${
                              progressObj.sectionsStatus.projectOnMarketplace
                                ? "text-[#44482c]"
                                : "text-[#44482c]/70"
                            }`}>
                              Proyecto visible en Marketplace
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Mensaje de estado final */}
                    <div className={`pt-4 border-t border-terrasacha-light/20 ${
                      progressObj.progressValue === 100
                        ? "bg-[#849b50]/10 rounded-lg p-4"
                        : "bg-[#e8d79a]/10 rounded-lg p-4"
                    }`}>
                      <div className="flex items-center space-x-3">
                        {progressObj.progressValue === 100 ? (
                          <div className="w-8 h-8 rounded-full bg-[#849b50] flex items-center justify-center flex-shrink-0">
                            <CheckIcon className="text-white w-5 h-5" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#e8d79a] flex items-center justify-center flex-shrink-0">
                            <HourGlassIcon className="text-[#44482c] w-5 h-5" />
                          </div>
                        )}
                        <p className={`text-sm font-semibold font-typographica ${
                          progressObj.progressValue === 100
                            ? "text-[#44482c]"
                            : "text-[#44482c]"
                        }`}>
                          {progressObj.progressValue === 100
                            ? "Este proyecto cumple la totalidad de los requerimientos"
                            : "Este proyecto aún no cumple la totalidad de requerimientos para su publicación"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <ProjectDetails visible={activeSection === "details"} />
                <ProjectFileManager
                  visible={activeSection === "file_manager"}
                  userGroup={userGroup}
                />
                {/* <ProjectFiles visible={activeSection === "files"} /> */}
                <FinanceCard visible={activeSection === "finance"} />
                <ProjectSettings
                  visible={activeSection === "settings" && (isVerifier || isAdmon)}
                  campaign={campaign}
                />
                <ProjectAnalysis
                  visible={activeSection === "analysis"}
                ></ProjectAnalysis>
              </div>
            <ToastContainer />
          </div>
        ) : (
          <div className="min-h-screen bg-gradient-to-br from-terrasacha-earth via-terrasacha-light to-white flex items-center justify-center">
            <div className="text-center">
              <div className="relative">
                {/* Logo principal con efecto de pulso */}
                <div className="animate-pulse-terrasacha">
                  <div className="w-48 h-48 mx-auto mb-8 flex items-center justify-center">
                    <div className="relative">
                      <div className="w-32 h-32 bg-terrasacha-primary rounded-full flex items-center justify-center shadow-terrasacha-xl">
                        <div className="w-20 h-20 border-4 border-white rounded-full"></div>
                        <div className="absolute w-12 h-12 border-2 border-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Círculos concéntricos animados */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 border-4 border-terrasacha-primary/20 rounded-full animate-ping"></div>
                  <div
                    className="absolute w-48 h-48 border-4 border-terrasacha-secondary2/30 rounded-full animate-ping"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                  <div
                    className="absolute w-32 h-32 border-4 border-terrasacha-light/40 rounded-full animate-ping"
                    style={{ animationDelay: "1s" }}
                  ></div>
                </div>
              </div>

              {/* Texto de carga */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-terrasacha-primary mb-2 font-typographica">
                  Cargando Proyecto
                </h2>
                <p className="text-terrasacha-secondary1 font-typographica text-lg">
                  Obteniendo información...
                </p>
              </div>

              {/* Indicador de progreso animado */}
              <div className="mt-6 flex justify-center">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-terrasacha-primary rounded-full animate-bounce"></div>
                  <div
                    className="w-3 h-3 bg-terrasacha-secondary2 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-3 h-3 bg-terrasacha-light rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </S3ClientProvider>
  );
}
