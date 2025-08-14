import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Auth } from "aws-amplify";
// Sections
import ProjectDetails from "./ProjectDetails/ProjectDetails";
import ProjectFiles from "./ProjectFiles/ProjectFiles";
import ProjectSettings from "./ProjectSettings/ProjectSettings";

// Components
import MiniInfoCard from "../../common/MiniInfoCard";

// Contexts
import { useProjectData } from "context/ProjectDataContext";
import { useAuth } from "context/AuthContext";
import { S3ClientProvider } from "context/s3ClientContext";
import { fetchProjectDataByProjectID } from "./api";
import { formatNumberWithThousandsSeparator } from "./utils";
import NewHeaderNavbar from "components/common/NewHeaderNavbar";
import ProjectFileManager from "./ProjectFileManager/ProjectFileManager";
import FinanceCard from "./ProjectFiles/InfoCards/FinanceFilesCard";
import { getProjectProgress } from "services/getProjectProgress";
import { HourGlassIcon } from "components/common/icons/HourGlassIcon";
import { API, graphqlOperation } from "aws-amplify";
import ProjectAnalysis from "./ProjectAnalysis/ProjectAnalysis";
import AlertMessage from "./AlertMessage";
import { FiEdit3, FiCalendar, FiFileText, FiDollarSign, FiUsers, FiCheckCircle, FiXCircle, FiInfo } from "react-icons/fi";
import TimelineProject from "./TimeLineProject";
import LOGO from "../../common/TerrasachaLogo";

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
  const [activeSection, setActiveSection] = useState("details");
  const [autorizedUser, setAutorizedUser] = useState(false);
  const [isPostulant, setIsPostulant] = useState(false);
  const [isVerifier, setIsVerifier] = useState(false);
  const [isAdmon, setIsAdmon] = useState(false);
  const [isAnalyst, setIsAnalyst] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editableTitle, setEditableTitle] = useState("");
  const [campaign, setCampaign] = useState(null);
  const [userGroup, setUserGroup] = useState("");
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
      <div className="mb-8">
        {projectData ? (
          <div className="container-sm">
            <div className="mb-5">
              <NewHeaderNavbar></NewHeaderNavbar>
            </div>
            
            <div>
              {/* Header principal del proyecto */}
              <div className="pt-4 px-3 px-md-4 mb-4 mt-4 border rounded shadow-lg" style={{ borderColor: '#b1c181', backgroundColor: '#f8f9fa' }}>
                <div className="row gy-3">
                  {/* Título y botones de estado */}
                  <header className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                    <div className="d-flex align-items-center gap-3 flex-wrap">
                      {isEditingTitle ? (
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          <input
                            type="text"
                            className="form-control fs-3"
                            style={{ borderColor: '#b1c181', color: '#6e6c35', minWidth: '200px' }}
                            value={editableTitle}
                            onChange={(e) => setEditableTitle(e.target.value)}
                            placeholder="Nombre del proyecto"
                          />
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm"
                              style={{ backgroundColor: '#849b50', borderColor: '#849b50', color: 'white' }}
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
                              <FiCheckCircle className="me-1" />
                              Confirmar
                            </button>
                            <button
                              className="btn btn-sm"
                              style={{ backgroundColor: '#dc3545', borderColor: '#dc3545', color: 'white' }}
                              onClick={() => {
                                setEditableTitle(projectData.projectInfo.title);
                                setIsEditingTitle(false);
                              }}
                            >
                              <FiXCircle className="me-1" />
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h1 className="fs-3 mb-0 d-flex align-items-center gap-2" style={{ color: '#6e6c35' }}>
                            <FiFileText style={{ color: '#849b50' }} />
                            {editableTitle}
                          </h1>
                          {isPostulant && (
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => setIsEditingTitle(true)}
                              title="Editar título"
                              style={{ borderColor: '#b1c181', color: '#44482c' }}
                            >
                              <FiEdit3 size={16} />
                            </button>
                          )}
                        </>
                      )}
                    </div>

                    {/* Badges de estado */}
                    <div className="d-flex flex-wrap gap-2">
                      {projectData.projectInfo.status && (
                        <div className="d-flex align-items-center gap-1 text-xs text-white font-bold px-3 py-2 rounded-pill text-nowrap h-8" style={{ backgroundColor: '#6e6c35' }}>
                          <FiInfo size={12} />
                          {projectStatusMapper[projectData.projectInfo.status]}
                        </div>
                      )}
                      <div
                        className="d-flex align-items-center gap-1 text-xs text-white font-bold px-3 py-2 rounded-pill text-nowrap h-8"
                        style={{ 
                          backgroundColor: projectData.projectVerifiers?.length > 0 ? '#849b50' : '#dc3545'
                        }}
                      >
                        {projectData.projectVerifiers?.length > 0 ? (
                          <>
                            <FiUsers size={12} />
                            Consultor asignado
                          </>
                        ) : (
                          <>
                            <FiXCircle size={12} />
                            Sin consultor
                          </>
                        )}
                      </div>
                    </div>
                  </header>

                  {/* Información del proyecto */}
                  <div className="col-12">
                    <div className="row g-2 g-md-3">
                      <div className="col-md-6">
                        <div className="d-flex align-items-center gap-2 p-3 rounded" style={{ backgroundColor: '#f0f4e6', border: '1px solid #e8d79a' }}>
                          <FiCalendar style={{ color: '#6e6c35' }} />
                          <div className="flex-grow-1">
                            <p className="fs-6 mb-0 fw-bold" style={{ color: '#44482c' }}>Fecha de creación:</p>
                            <p className="fs-6 mb-0" style={{ color: '#6e6c35' }}>
                              {projectData.projectInfo.createdAt}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-6">
                        <div className="d-flex align-items-center gap-2 p-3 rounded" style={{ backgroundColor: '#f0f4e6', border: '1px solid #e8d79a' }}>
                          <FiFileText style={{ color: '#6e6c35' }} />
                          <div className="flex-grow-1">
                            <p className="fs-6 mb-0 fw-bold" style={{ color: '#44482c' }}>Descripción:</p>
                            <p className="fs-6 mb-0 text-truncate" style={{ color: '#6e6c35', maxWidth: '200px' }} title={projectData.projectInfo.description}>
                              {projectData.projectInfo.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sección de campaña y timeline */}
                  {campaign && (
                    <div className="col-12">
                      <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between gap-3 gap-lg-4 p-3 p-md-4 rounded" style={{ backgroundColor: '#f0f4e6', border: '1px solid #e8d79a' }}>
                        <div className="d-flex align-items-center gap-2">
                          <FiInfo style={{ color: '#6e6c35' }} />
                          <div>
                            <p className="fs-6 mb-0 fw-bold" style={{ color: '#44482c' }}>
                              Pertenece a la campaña:
                            </p>
                            <p className="fs-6 mb-0 fw-bold" style={{ color: '#6e6c35' }}>{campaign.name}</p>
                          </div>
                        </div>
                        <div className="w-100 w-lg-75">
                          <TimelineProject
                            currentStep={currentStep}
                            onStepChange={(step) => setCurrentStep(step)}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sección de tokenomics */}
                  {projectData.projectInfo.token.actualPeriodTokenAmount &&
                    projectData.projectInfo.token.actualPeriodTokenPrice && (
                      <div className="col-12">
                        <div className="p-3 p-md-4 rounded" style={{ backgroundColor: '#44482c', border: '2px solid #b1c181' }}>
                          <div className="d-flex align-items-center gap-2 mb-3">
                            <FiDollarSign style={{ color: 'white' }} />
                            <h6 className="mb-0 text-white fw-bold">Tokenomics del Proyecto</h6>
                          </div>
                          <div className="row g-2 g-md-3">
                            {projectData.projectInfo.token.actualPeriodTokenAmount && (
                              <div className="col-md-6">
                                <div className="p-3 rounded" style={{ backgroundColor: 'white', border: '2px solid #b1c181' }}>
                                  <MiniInfoCard
                                    label="Cantidad total de tokens"
                                    value={formatNumberWithThousandsSeparator(
                                      projectData.projectInfo.token.totalTokenAmount
                                    )}
                                    className="mb-0"
                                    style={{ backgroundColor: 'transparent', color: '#6e6c35', border: 'none' }}
                                  />
                                </div>
                              </div>
                            )}
                            {projectData.projectInfo.token.actualPeriodTokenPrice && (
                              <div className="col-md-6">
                                <div className="p-3 rounded" style={{ backgroundColor: 'white', border: '2px solid #b1c181' }}>
                                  <MiniInfoCard
                                    label="Valor del token"
                                    value={
                                      projectData.projectInfo.token.actualPeriodTokenPrice +
                                      " " +
                                      projectData.projectInfo.token.currency
                                    }
                                    className="mb-0"
                                    style={{ backgroundColor: 'transparent', color: '#6e6c35', border: 'none' }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Estado del marketplace */}
                  <div className="col-12">
                    <div className="d-flex justify-content-center">
                      <div
                        className="d-flex align-items-center gap-2 text-xs text-white font-bold px-3 px-md-4 py-2 py-md-3 rounded-pill"
                        style={{ 
                          backgroundColor: projectData.projectInfo.isActive ? '#849b50' : '#dc3545'
                        }}
                      >
                        {projectData.projectInfo.isActive ? (
                          <>
                            <FiCheckCircle size={14} />
                            Publicado en marketplace
                          </>
                        ) : (
                          <>
                            <FiXCircle size={14} />
                            No publicado en marketplace
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Lista de consultores */}
                  {projectData.projectVerifierNames.length > 0 && (
                    <div className="col-12">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <FiUsers style={{ color: '#44482c' }} />
                        <p className="fs-6 mb-0 fw-bold" style={{ color: '#44482c' }}>Consultores asignados:</p>
                      </div>
                      <div className="d-flex flex-wrap gap-2">
                        {projectData.projectVerifierNames.map((pvn, index) => {
                          return (
                            <div
                              className="d-flex align-items-center gap-2 text-xs text-white font-bold px-3 py-2 rounded-pill"
                              style={{ backgroundColor: '#6e6c35' }}
                              key={index}
                            >
                              <FiUsers size={12} />
                              Consultor {index + 1}: {pvn}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Navegación por pestañas */}
                <div className="mt-4 pt-3 border-top" style={{ borderColor: '#b1c181' }}>
                  <nav className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">
                    <button
                      onClick={() => setActiveSection("details")}
                      className={`d-flex align-items-center gap-2 py-2 px-3 rounded-pill text-decoration-none border-0 ${
                        activeSection === "details"
                          ? "fw-bold"
                          : ""
                      }`}
                      style={{ 
                        backgroundColor: activeSection === "details" ? '#6e6c35' : 'transparent',
                        color: activeSection === "details" ? 'white' : '#849b50',
                        border: activeSection === "details" ? '2px solid #b1c181' : '2px solid transparent'
                      }}
                      aria-current={activeSection === "details" ? "page" : undefined}
                    >
                      <FiFileText size={16} />
                      Detalles
                      {(autorizedUser || isPostulant || isAdmon) &&
                        (!progressObj?.sectionsStatus.projectInfo ||
                          !progressObj?.sectionsStatus.geodataInfo) && (
                          <HourGlassIcon className="text-danger ms-1" />
                        )}
                    </button>

                    {(isVerifier || isAdmon || isAnalyst) && (
                      <button
                        onClick={() => setActiveSection("file_manager")}
                        className={`d-flex align-items-center gap-2 py-2 px-3 rounded-pill text-decoration-none border-0 ${
                          activeSection === "file_manager"
                            ? "fw-bold"
                            : ""
                        }`}
                        style={{ 
                          backgroundColor: activeSection === "file_manager" ? '#6e6c35' : 'transparent',
                          color: activeSection === "file_manager" ? 'white' : '#849b50',
                          border: activeSection === "file_manager" ? '2px solid #b1c181' : '2px solid transparent'
                        }}
                      >
                        <FiFileText size={16} />
                        Sistema de datos
                      </button>
                    )}

                    {(isVerifier || isAdmon) && (
                      <button
                        onClick={() => setActiveSection("settings")}
                        className={`d-flex align-items-center gap-2 py-2 px-3 rounded-pill text-decoration-none border-0 ${
                          activeSection === "settings"
                            ? "fw-bold"
                            : ""
                        }`}
                        style={{ 
                          backgroundColor: activeSection === "settings" ? '#6e6c35' : 'transparent',
                          color: activeSection === "settings" ? 'white' : '#849b50',
                          border: activeSection === "settings" ? '2px solid #b1c181' : '2px solid transparent'
                        }}
                      >
                        <FiFileText size={16} />
                        Configuración
                        {(autorizedUser || isAdmon) &&
                          (!progressObj?.sectionsStatus.technicalInfo ||
                            !progressObj?.sectionsStatus.financialInfo) && (
                              <HourGlassIcon className="text-danger ms-1" />
                            )}
                      </button>
                    )}

                    {user?.id &&
                      (isPostulant || isVerifier || isAdmon) &&
                      projectData.isFinancialFreeze &&
                      projectData.isTechnicalFreeze && (
                        <button
                          onClick={() => setActiveSection("finance")}
                          className={`d-flex align-items-center gap-2 py-2 px-3 rounded-pill text-decoration-none border-0 ${
                            activeSection === "finance"
                              ? "fw-bold"
                              : ""
                          }`}
                          style={{ 
                            backgroundColor: activeSection === "finance" ? '#6e6c35' : 'transparent',
                            color: activeSection === "finance" ? 'white' : '#849b50',
                            border: activeSection === "finance" ? '2px solid #b1c181' : '2px solid transparent'
                          }}
                        >
                          <FiDollarSign size={16} />
                          Finanzas
                          {(autorizedUser || isPostulant || isAdmon) &&
                            !progressObj?.sectionsStatus
                              .ownerAcceptsConditions && (
                                <HourGlassIcon className="text-danger ms-1" />
                              )}
                        </button>
                      )}
                      
                    {(isAdmon || isAnalyst) && (
                      <button
                        onClick={() => setActiveSection("analysis")}
                        className={`d-flex align-items-center gap-2 py-2 px-3 rounded-pill text-decoration-none border-0 ${
                          activeSection === "analysis"
                            ? "fw-bold"
                            : ""
                        }`}
                        style={{ 
                          backgroundColor: activeSection === "analysis" ? '#6e6c35' : 'transparent',
                          color: activeSection === "analysis" ? 'white' : '#849b50',
                          border: activeSection === "analysis" ? '2px solid #b1c181' : '2px solid transparent'
                        }}
                      >
                        <FiFileText size={16} />
                        Análisis
                      </button>
                    )}
                  </nav>
                </div>
              </div>

              {/* Contenido de las secciones */}
              <AlertMessage />
              <ProjectDetails visible={activeSection === "details"} />
              <ProjectFileManager
                visible={activeSection === "file_manager"}
                userGroup={userGroup}
              />
              <FinanceCard visible={activeSection === "finance"} />
              <ProjectSettings
                visible={activeSection === "settings" && (isVerifier || isAdmon)}
                campaign={campaign}
              />
              <ProjectAnalysis
                visible={activeSection === "analysis"}
              ></ProjectAnalysis>
            </div>
            
            <ToastContainer></ToastContainer>
          </div>
        ) : (
          <div className="loading-overlay d-flex align-items-center justify-content-center" style={{ backgroundColor: '#6e6c35', minHeight: '100vh' }}>
            <div className="text-center">
              <LOGO className="loading-logo mb-4" alt="logo" style={{ width: '40px', height: '40px' }} />
              <div className="text-white fs-5">
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                Cargando proyecto...
              </div>
            </div>
          </div>
        )}
      </div>
    </S3ClientProvider>
  );
}
