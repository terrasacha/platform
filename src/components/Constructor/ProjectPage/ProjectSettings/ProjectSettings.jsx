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
import { Button } from "react-bootstrap";
import { notify } from "utilities/notify";
import { fetchProjectDataByProjectID } from "../api";
import { createProductFeature, updateProductFeature } from "graphql/mutations";

export default function ProjectSettings() {
  const [activeSection, setActiveSection] = useState("technical");
  const [validatorSubRole, setValidatorSubRole] = useState("");
  const { projectData, handleUpdateContextProjectData } = useProjectData();

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((data) => {
        if (data.attributes["custom:subrole"]) {
          console.log(data.attributes["custom:subrole"]);
          setValidatorSubRole(data.attributes["custom:subrole"]);
        } else {
          setValidatorSubRole(undefined);
        }
      })
      .catch((error) => setValidatorSubRole(undefined));
  }, []);

  const handleSetValidatorDataComplete = async (item) => {
    const updatedProjectData = await fetchProjectDataByProjectID(
      projectData.projectInfo.id
    );
    console.log(updatedProjectData, "updatedProjectData");
    if (item === "technicalInfo") {
      if (!updatedProjectData.isTechnicalComplete) {
        notify({
          msg: "Información técnica incompleta. Primero registra toda la información técnica",
          type: "error",
        });
        return;
      }
      handleUpdateContextProjectData({ isTechnicalFreeze: true });

      const technicalInfoPfID =
        projectData.projectFeatures.filter((item) => {
          return item.featureID === "GLOBAL_VALIDATOR_SET_TECHNICAL_CONDITIONS";
        })[0]?.id || null;

      const updatedProductFeature = {
        id: technicalInfoPfID,
        value: "true",
      };

      await API.graphql(
        graphqlOperation(updateProductFeature, {
          input: updatedProductFeature,
        })
      );

      notify({
        msg: "Se ha oficializado la información técnica.",
        type: "success",
      });
    }
    if (item === "financialInfo") {
      if (!updatedProjectData.isFinancialComplete) {
        notify({
          msg: "Información financiera incompleta. Primero registra toda la información técnica",
          type: "error",
        });
        return;
      }
      handleUpdateContextProjectData({ isFinancialFreeze: true });

      const financialInfoPfID =
        projectData.projectFeatures.filter((item) => {
          return item.featureID === "GLOBAL_VALIDATOR_SET_FINANCIAL_CONDITIONS";
        })[0]?.id || null;

      const updatedProductFeature = {
        id: financialInfoPfID,
        value: "true",
      };

      await API.graphql(
        graphqlOperation(updateProductFeature, {
          input: updatedProductFeature,
        })
      );

      notify({
        msg: "Se ha oficializado la información financiera.",
        type: "success",
      });
    }

  };
  return (
    <div className="row row-cols-1  g-4">
      <div className="col">
        <ProjectSettingsCard />
      </div>
      <div className={s.selectSettingTypeContainer}>
        <button
          className={`${s.selectSettingType} ${
            activeSection === "technical" ? s.selectSettingTypeActive : ""
          }`}
          onClick={() => setActiveSection("technical")}
        >
          Configuración técnica
        </button>
        <button
          className={`${s.selectSettingType} ${
            activeSection === "financial" ? s.selectSettingTypeActive : ""
          }`}
          onClick={() => setActiveSection("financial")}
        >
          Configuración financiera
        </button>
      </div>
      {activeSection === "technical" && (
        <>
          <div className="col">
            <DescriptionValidator
              canEdit={(validatorSubRole === 'fullaccessvalidator' || validatorSubRole === 'technical' || !projectData.isTechnicalFreeze) ? false : true
                /* (validatorSubRole === undefined
                  ? false
                  : activeSection !== validatorSubRole) ||
                !projectData.isTechnicalFreeze */
              }
            />
          </div>
          <div className="col">
            <GenericInputTable
              title={"Ingresos por producto"}
              fID={"GLOBAL_INGRESOS_POR_PRODUCTO"}
              financialInfoType={"revenuesByProduct"}
              canEdit={(validatorSubRole === 'fullaccessvalidator' || validatorSubRole === 'technical' || !projectData.isTechnicalFreeze) ? false : true
              }
            />
          </div>
          <div className="col">
            <GenericInputTable
              title={"Productos del ciclo del proyecto"}
              fID={"GLOBAL_PRODUCTOS_DEL_CICLO_DE_PROYECTO"}
              financialInfoType={"productsOfCycleProject"}
              canEdit={(validatorSubRole === 'fullaccessvalidator' || validatorSubRole === 'technical' || !projectData.isTechnicalFreeze) ? false : true
              }
            />
          </div>
          <div className="col">
            <FinancialIndicators
              title={"Indicadores financieros"}
              fID={"GLOBAL_INDICADORES_FINANCIEROS"}
              financialInfoType={"financialIndicators"}
              canEdit={(validatorSubRole === 'fullaccessvalidator' || validatorSubRole === 'technical' || !projectData.isTechnicalFreeze) ? false : true
              }
            />
          </div>
          <div className="d-flex justify-content-center mb-2">
            <Button
              disabled={projectData.isTechnicalFreeze}
              onClick={() => handleSetValidatorDataComplete("technicalInfo")}
            >
              Oficializar información técnica
            </Button>
          </div>
        </>
      )}
      {activeSection === "financial" && (
        <>
          <div className="col">
            <TokenSettingsCard
              canEdit={(validatorSubRole === 'fullaccessvalidator' || validatorSubRole === 'financial' || !projectData.isTechnicalFreeze) ? false : true
                /* (validatorSubRole === undefined
                  ? false
                  : activeSection !== validatorSubRole) ||
                projectData.isFinancialFreeze */
              }
            />
          </div>
          <div className="col">
            <CashFlowSettings
              canEdit={(validatorSubRole === 'fullaccessvalidator' || validatorSubRole === 'financial' || !projectData.isTechnicalFreeze) ? false : true
              }
            />
          </div>
          <div className="d-flex justify-content-center mb-2">
            <Button
              disabled={projectData.isFinancialFreeze}
              onClick={() => handleSetValidatorDataComplete("financialInfo")}
            >
              Oficializar información financiera
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
