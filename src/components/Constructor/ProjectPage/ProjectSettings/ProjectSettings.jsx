import React, { useState, useEffect } from "react";
import { API, Auth, graphqlOperation } from "aws-amplify";
import s from "../css/ProjectSettings.module.css";
import ProjectSettingsCard from "./SettingCards/ProjectSettingsCard";
import TokenSettingsCard from "./SettingCards/TokenSettingsCard";
import CashFlowSettings from "./SettingCards/CashFlowSettings";
import GenericInputTable from "./SettingCards/GenericInputTable";
import FinancialIndicators from "./SettingCards/FinancialIndicators";
import DescriptionValidator from "./SettingCards/DescriptionValidator";
import { useProjectData } from "context/ProjectDataContext";
import { notify } from "utilities/notify";
import { fetchProjectDataByProjectID } from "../api";
import { createProductFeature, updateProductFeature } from "graphql/mutations";
import useProjectItems from "hooks/useProjectItems";
import TokenDistributionInputTable from "./SettingCards/TokenDistributionInputTable";
import { FiSettings, FiTool, FiDollarSign, FiCheckCircle, FiXCircle, FiInfo, FiSave, FiEdit3 } from "react-icons/fi";

export default function ProjectSettings({ visible, campaign }) {
  const [activeSection, setActiveSection] = useState("technical");
  const [validatorSubRole, setValidatorSubRole] = useState("");
  const [finInfoPfID, setFinInfoPfID] = useState(null);
  const [tecInfoPfID, setTecInfoPfID] = useState(null);
  const { projectData, handleUpdateContextProjectData, fetchProjectData } =
    useProjectData();
  const { projectItems } = useProjectItems();

  useEffect(() => {
    const financialInfoPfID =
      projectData.projectFeatures.filter((item) => {
        return item.featureID === "GLOBAL_VALIDATOR_SET_FINANCIAL_CONDITIONS";
      })[0]?.id || null;
    setFinInfoPfID(financialInfoPfID);

    const technicalInfoPfID =
      projectData.projectFeatures.filter((item) => {
        return item.featureID === "GLOBAL_VALIDATOR_SET_TECHNICAL_CONDITIONS";
      })[0]?.id || null;
    setTecInfoPfID(technicalInfoPfID);

    Auth.currentAuthenticatedUser()
      .then((data) => {
        if (data.attributes["custom:subrole"]) {
          setValidatorSubRole(data.attributes["custom:subrole"]);
        } else {
          setValidatorSubRole(undefined);
        }
      })
      .catch((error) => setValidatorSubRole(undefined));
  }, []);
  
  const checkStakeHolders = (item) => {
    const neededSH = ['BIOC', 'PROPIETARIO', 'BUFFER', 'INVERSIONISTA'];
    const itemConcepts = item.map(i => i.CONCEPTO);
    const allPresent = neededSH.every(sh => itemConcepts.includes(sh));
    return allPresent;
  };
  
  const handleSetValidatorDataComplete = async (item) => {
    const updatedProjectData = await fetchProjectDataByProjectID(
      projectData.projectInfo.id
    );
    const neededStakeHolders = checkStakeHolders(updatedProjectData.projectFinancialInfo.tokenAmountDistribution.tokenAmountDistribution)
    if (item === "technicalInfo") {
      if (!updatedProjectData.isTechnicalComplete) {
        let toFixMessage = "";

        if (!updatedProjectData.technicalProgress.verifierDescription) {
          toFixMessage = "No se ha agregado una descripción del proyecto";
        }

        else if(!updatedProjectData.technicalProgress.revenuesByProduct) {
          toFixMessage = "Aún no se han definido los ingresos por producto";
        }

        else if(!updatedProjectData.technicalProgress.productsOfCycleProject) {
          toFixMessage =
            "Aún no se han definido los productos del ciclo del proyecto";
        }

        else if(!updatedProjectData.technicalProgress.financialIndicators) {
          toFixMessage =
            "Aún no se han definido los indicadores financieros del proyecto";
        }
        notify({
          msg: `Información técnica incompleta. ${toFixMessage}`,
          type: "error",
        });
        return;
      }
      // handleUpdateContextProjectData({ isTechnicalFreeze: true });

      if (tecInfoPfID) {
        const updatedProductFeature = {
          id: tecInfoPfID,
          value: "true",
        };

        await API.graphql(
          graphqlOperation(updateProductFeature, {
            input: updatedProductFeature,
          })
        );
      } else {
        const newProductFeature = {
          productID: projectData.projectInfo.id,
          featureID: "GLOBAL_VALIDATOR_SET_TECHNICAL_CONDITIONS",
          value: true,
        };

        const response = await API.graphql(
          graphqlOperation(createProductFeature, {
            input: newProductFeature,
          })
        );
        setTecInfoPfID(response.data.createProductFeature.id);
      }

      await fetchProjectData();

      notify({
        msg: "Se ha oficializado la información técnica.",
        type: "success",
      });
    }
    if (item === "financialInfo") {
      if (!neededStakeHolders) {
        notify({
          msg: "Es obligatorio distribuir tokens a los siguientes stake holders: BIOC, PROPIETARIO, BUFFER e INVERSIONISTA.",
          type: "error",
        });
        return;
      }
      if (!updatedProjectData.isFinancialComplete) {
        let toFixMessage = "";
        if (!updatedProjectData.financialProgress.tokenHistoricalData) {
          toFixMessage =
            "No han sido definido los valores historicos del token";
        }
        if (!updatedProjectData.financialProgress.tokenCurrency) {
          toFixMessage =
            "No ha sido definida la divisa de comercialización del token";
        }
        if (!updatedProjectData.financialProgress.totalTokens) {
          toFixMessage = "El volumen total de tokens debe ser diferente de 0";
        }
        if (!updatedProjectData.financialProgress.tokenAmountDistribution) {
          toFixMessage = "Aún no se ha definido la distribución de tokens";
        }
        if (!updatedProjectData.financialProgress.cashFlowResume) {
          toFixMessage = "Aún no se ha definido el flujo de caja del proyecto";
        }
        if (!updatedProjectData.financialProgress.financialIndicators) {
          toFixMessage =
            "Aún no se han definido los indicadores financieros del token";
        }
        if (!updatedProjectData.financialProgress.allTokensDistributed) {
          toFixMessage =
            "La cantidad de tokens distribuidos no coincide con el volumen total de tokens";
        }
        notify({
          msg: `Información financiera incompleta. ${toFixMessage}`,
          type: "error",
        });
        return;
      }
      handleUpdateContextProjectData({ isFinancialFreeze: true });

      if (finInfoPfID) {
        const updatedProductFeature = {
          id: finInfoPfID,
          value: "true",
        };

        await API.graphql(
          graphqlOperation(updateProductFeature, {
            input: updatedProductFeature,
          })
        );
      } else {
        const newProductFeature = {
          productID: projectData.projectInfo.id,
          featureID: "GLOBAL_VALIDATOR_SET_FINANCIAL_CONDITIONS",
          value: true,
        };

        const response = await API.graphql(
          graphqlOperation(createProductFeature, {
            input: newProductFeature,
          })
        );

        setFinInfoPfID(response.data.createProductFeature.id);
      }

      await fetchProjectData();

      notify({
        msg: "Se ha oficializado la información financiera.",
        type: "success",
      });
    }
  };
  
  const checkIfIsEditable = (type) => {
    switch (type) {
      case "technical":
        if (projectData.isTechnicalFreeze) {
          return true;
        } else {
          if (
            validatorSubRole === "fullaccessvalidator" ||
            validatorSubRole === "technical"
          )
            return false;
        }
        break;
      case "financial":
        if (projectData.isFinancialFreeze) {
          return true;
        } else {
          if (
            validatorSubRole === "fullaccessvalidator" ||
            validatorSubRole === "financial"
          )
            return false;
        }
        break;
      default:
        return true;
    }
  };

  if (!visible) return null;

  return (
    <div className="mt-4">
      {/* Header de la sección */}
      <div className="d-flex align-items-center gap-2 mb-4 p-3 rounded" style={{ backgroundColor: '#f0f4e6', border: '1px solid #e8d79a' }}>
        <FiSettings style={{ color: '#6e6c35' }} size={24} />
        <div>
          <h4 className="mb-0" style={{ color: '#6e6c35' }}>Configuración del Proyecto</h4>
          <p className="mb-0 small" style={{ color: '#44482c' }}>Ajustes técnicos y financieros del proyecto</p>
        </div>
      </div>

      {/* Contenido principal */}
      <div 
        className="row row-cols-1 g-3" 
        style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '12px', 
          border: '2px solid #b1c181',
          boxShadow: '0 4px 6px rgba(110, 108, 53, 0.1)'
        }}
      >
        {/* Tarjeta de configuración del proyecto */}
        <div className="col">
          <div className="p-3 rounded" style={{ backgroundColor: 'white', border: '1px solid #b1c181' }}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <FiSettings style={{ color: '#849b50' }} />
              <h6 className="mb-0" style={{ color: '#44482c' }}>Configuración General</h6>
            </div>
            <ProjectSettingsCard />
          </div>
        </div>

        {/* Navegación por pestañas */}
        <div className="col-12">
          <div className={`${s.selectSettingTypeContainer} d-flex flex-column flex-sm-row gap-3 p-3 rounded`} style={{ backgroundColor: 'white', border: '1px solid #b1c181' }}>
            <button
              className={`${s.selectSettingType} ${
                activeSection === "technical" ? s.selectSettingTypeActive : ""
              } flex-fill d-flex align-items-center justify-content-center gap-2 py-3 px-4 rounded-pill border-0 transition-all`}
              onClick={() => setActiveSection("technical")}
              style={{ 
                backgroundColor: activeSection === "technical" ? '#6e6c35' : '#b1c181',
                color: activeSection === "technical" ? 'white' : '#44482c',
                borderColor: '#6e6c35',
                transform: activeSection === "technical" ? 'scale(1.02)' : 'scale(1)',
                boxShadow: activeSection === "technical" ? '0 4px 8px rgba(110, 108, 53, 0.3)' : '0 2px 4px rgba(110, 108, 53, 0.1)'
              }}
              title="Configuración técnica del proyecto"
            >
              <FiTool size={18} />
              <span className="d-none d-sm-inline">Configuración técnica</span>
              <span className="d-sm-none">Técnica</span>
            </button>
            
            <button
              className={`${s.selectSettingType} ${
                activeSection === "financial" ? s.selectSettingTypeActive : ""
              } flex-fill d-flex align-items-center justify-content-center gap-2 py-3 px-4 rounded-pill border-0 transition-all`}
              onClick={() => setActiveSection("financial")}
              style={{ 
                backgroundColor: activeSection === "financial" ? '#6e6c35' : '#b1c181',
                color: activeSection === "financial" ? 'white' : '#44482c',
                borderColor: '#6e6c35',
                transform: activeSection === "financial" ? 'scale(1.02)' : 'scale(1)',
                boxShadow: activeSection === "financial" ? '0 4px 8px rgba(110, 108, 53, 0.3)' : '0 2px 4px rgba(110, 108, 53, 0.1)'
              }}
              title="Configuración financiera del proyecto"
            >
              <FiDollarSign size={18} />
              <span className="d-none d-sm-inline">Configuración financiera</span>
              <span className="d-sm-none">Financiera</span>
            </button>
          </div>
        </div>

        {/* Sección técnica */}
        {activeSection === "technical" && (
          <>
            <div className="col-12">
              <div className="p-3 rounded" style={{ backgroundColor: 'white', border: '1px solid #b1c181' }}>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <FiEdit3 style={{ color: '#849b50' }} />
                  <h6 className="mb-0" style={{ color: '#44482c' }}>Descripción del Validador</h6>
                </div>
                <DescriptionValidator
                  canEdit={checkIfIsEditable("technical")}
                />
              </div>
            </div>
            
            <div className="col-12">
              <div className="p-3 rounded" style={{ backgroundColor: 'white', border: '1px solid #b1c181' }}>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <FiDollarSign style={{ color: '#849b50' }} />
                  <h6 className="mb-0" style={{ color: '#44482c' }}>Ingresos por Producto</h6>
                </div>
                <GenericInputTable
                  title={"Ingresos por producto"}
                  fID={"GLOBAL_INGRESOS_POR_PRODUCTO"}
                  financialInfoType={"revenuesByProduct"}
                  canEdit={checkIfIsEditable("technical")}
                  conceptOptions={projectItems["Ingresos por producto"]}
                />
              </div>
            </div>
            
            <div className="col-12">
              <div className="p-3 rounded" style={{ backgroundColor: 'white', border: '1px solid #b1c181' }}>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <FiTool style={{ color: '#849b50' }} />
                  <h6 className="mb-0" style={{ color: '#44482c' }}>Productos del Ciclo del Proyecto</h6>
                </div>
                <GenericInputTable
                  title={"Productos del ciclo del proyecto"}
                  fID={"GLOBAL_PRODUCTOS_DEL_CICLO_DE_PROYECTO"}
                  financialInfoType={"productsOfCycleProject"}
                  canEdit={checkIfIsEditable("technical")}
                  conceptOptions={
                    projectItems["Productos del ciclo del proyecto"]
                  }
                />
              </div>
            </div>
            
            <div className="col-12">
              <div className="p-3 rounded" style={{ backgroundColor: 'white', border: '1px solid #b1c181' }}>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <FiInfo style={{ color: '#849b50' }} />
                  <h6 className="mb-0" style={{ color: '#44482c' }}>Indicadores Financieros del Proyecto</h6>
                </div>
                <GenericInputTable
                  title={"Indicadores financieros (Proyecto)"}
                  fID={"GLOBAL_INDICADORES_FINANCIEROS"}
                  financialInfoType={"financialIndicators"}
                  canEdit={checkIfIsEditable("technical")}
                  conceptOptions={
                    projectItems["Indicadores financieros (Proyecto)"]
                  }
                />
              </div>
            </div>
            
            {/* Botón de oficialización técnica */}
            <div className="col-12">
              <div className="d-flex justify-content-center">
                <button
                  className="d-flex align-items-center gap-2 py-3 px-4 text-white rounded-pill w-100 w-sm-auto border-0 transition-all"
                  disabled={projectData.isTechnicalFreeze || campaign?.available} 
                  onClick={() => handleSetValidatorDataComplete("technicalInfo")}
                  style={{ 
                    backgroundColor: projectData.isTechnicalFreeze ? '#b1c181' : '#6e6c35',
                    borderColor: projectData.isTechnicalFreeze ? '#b1c181' : '#6e6c35',
                    opacity: projectData.isTechnicalFreeze || campaign?.available ? 0.6 : 1,
                    transform: projectData.isTechnicalFreeze || campaign?.available ? 'scale(1)' : 'scale(1)',
                    boxShadow: projectData.isTechnicalFreeze || campaign?.available ? 'none' : '0 4px 8px rgba(110, 108, 53, 0.3)'
                  }}
                  title={projectData.isTechnicalFreeze ? "Información técnica ya oficializada" : campaign?.available ? "Campaña aún no cerrada" : "Oficializar información técnica"}
                >
                  {projectData.isTechnicalFreeze ? (
                    <>
                      <FiCheckCircle size={18} />
                      <span className="d-none d-sm-inline">Información técnica oficializada</span>
                      <span className="d-sm-none">Técnica oficializada</span>
                    </>
                  ) : (
                    <>
                      <FiSave size={18} />
                      <span className="d-none d-sm-inline">Oficializar información técnica</span>
                      <span className="d-sm-none">Oficializar técnica</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Sección financiera */}
        {activeSection === "financial" && (
          <>
            <div className="col-12">
              <div className="p-3 rounded" style={{ backgroundColor: 'white', border: '1px solid #b1c181' }}>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <FiDollarSign style={{ color: '#849b50' }} />
                  <h6 className="mb-0" style={{ color: '#44482c' }}>Configuración de Tokens</h6>
                </div>
                <TokenSettingsCard
                  canEdit={checkIfIsEditable("financial")}
                />
              </div>
            </div>

            <div className="col-12">
              <div className="p-3 rounded" style={{ backgroundColor: 'white', border: '1px solid #b1c181' }}>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <FiDollarSign style={{ color: '#849b50' }} />
                  <h6 className="mb-0" style={{ color: '#44482c' }}>Distribución de Volumen de Tokens</h6>
                </div>
                <TokenDistributionInputTable
                  title={"Distribución volumen de tokens"}
                  fID={"GLOBAL_TOKEN_AMOUNT_DISTRIBUTION"}
                  financialInfoType={"tokenAmountDistribution"}
                  canEdit={checkIfIsEditable("financial")}
                  conceptOptions={
                    projectItems["Distribución volumen de tokens"]
                  }
                />
              </div>
            </div>
            
            <div className="col-12">
              <div className="p-3 rounded" style={{ backgroundColor: 'white', border: '1px solid #b1c181' }}>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <FiDollarSign style={{ color: '#849b50' }} />
                  <h6 className="mb-0" style={{ color: '#44482c' }}>Configuración de Flujo de Caja</h6>
                </div>
                <CashFlowSettings canEdit={checkIfIsEditable("financial")} />
              </div>
            </div>
            
            <div className="col-12">
              <div className="p-3 rounded" style={{ backgroundColor: 'white', border: '1px solid #b1c181' }}>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <FiInfo style={{ color: '#849b50' }} />
                  <h6 className="mb-0" style={{ color: '#44482c' }}>Indicadores Financieros del Token</h6>
                </div>
                <GenericInputTable
                  title={"Indicadores financieros (Token)"}
                  fID={"GLOBAL_INDICADORES_FINANCIEROS_TOKEN"}
                  financialInfoType={"financialIndicatorsToken"}
                  canEdit={checkIfIsEditable("financial")}
                  conceptOptions={
                    projectItems["Indicadores financieros (Token)"]
                  }
                />
              </div>
            </div>
            
            {/* Botón de oficialización financiera */}
            <div className="col-12">
              <div className="d-flex justify-content-center">
                <button
                  className="d-flex align-items-center gap-2 py-3 px-4 text-white rounded-pill w-100 w-sm-auto border-0 transition-all"
                  disabled={projectData.isFinancialFreeze || campaign?.available}
                  onClick={() => handleSetValidatorDataComplete("financialInfo")}
                  style={{ 
                    backgroundColor: projectData.isFinancialFreeze ? '#b1c181' : '#6e6c35',
                    borderColor: projectData.isFinancialFreeze ? '#b1c181' : '#6e6c35',
                    opacity: projectData.isFinancialFreeze || campaign?.available ? 0.6 : 1,
                    transform: projectData.isFinancialFreeze || campaign?.available ? 'scale(1)' : 'scale(1)',
                    boxShadow: projectData.isFinancialFreeze || campaign?.available ? 'none' : '0 4px 8px rgba(110, 108, 53, 0.3)'
                  }}
                  title={projectData.isFinancialFreeze ? "Información financiera ya oficializada" : campaign?.available ? "Campaña aún no cerrada" : "Oficializar información financiera"}
                >
                  {projectData.isFinancialFreeze ? (
                    <>
                      <FiCheckCircle size={18} />
                      <span className="d-none d-sm-inline">Información financiera oficializada</span>
                      <span className="d-sm-none">Financiera oficializada</span>
                    </>
                  ) : (
                    <>
                      <FiSave size={18} />
                      <span className="d-none d-sm-inline">Oficializar información financiera</span>
                      <span className="d-sm-none">Oficializar financiera</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer informativo */}
      <div className="mt-4 p-3 rounded text-center" style={{ backgroundColor: '#f0f4e6', border: '1px solid #e8d79a' }}>
        <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
          <FiInfo style={{ color: '#6e6c35' }} />
          <small style={{ color: '#44482c' }}>
            {activeSection === "technical" ? 
              "Configuración técnica: Define los parámetros técnicos y operativos del proyecto" :
              "Configuración financiera: Establece los parámetros económicos y de tokens del proyecto"
            }
          </small>
        </div>
        <div className="d-flex align-items-center justify-content-center gap-2">
          <FiCheckCircle style={{ color: '#849b50' }} />
          <small style={{ color: '#44482c' }}>
            {activeSection === "technical" ? 
              `Estado técnico: ${projectData.isTechnicalFreeze ? 'Oficializado' : 'Pendiente de oficialización'}` :
              `Estado financiero: ${projectData.isFinancialFreeze ? 'Oficializado' : 'Pendiente de oficialización'}`
            }
          </small>
        </div>
      </div>
    </div>
  );
}
