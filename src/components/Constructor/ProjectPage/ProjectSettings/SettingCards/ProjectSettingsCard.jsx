import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";

import Card from "../../../../common/Card";
import FormGroup from "../../../../common/FormGroup";

import { useProjectData } from "../../../../../context/ProjectDataContext";
import {
  createProductFeature,
  updateProduct,
} from "../../../../../graphql/mutations";
import { notify } from "../../../../../utilities/notify";
import { Button } from "react-bootstrap";

import { fetchProjectDataByProjectID } from "../../api";

export default function ProjectSettingsCard(props) {
  const { className } = props;

  const { projectData, handleUpdateContextProjectData } = useProjectData();
  const [projectIsActive, setProjectIsActive] = useState(false);
  const [projectStatus, setProjectStatus] = useState("");

  useEffect(() => {
    if (projectData) {
      setProjectIsActive(projectData.projectInfo.isActive);
      setProjectStatus(projectData.projectInfo.status);
    }
  }, [projectData]);

  const handleChangeProjectIsActiveStatus = async () => {
    setProjectIsActive(!projectIsActive);
    let updatedProduct = {
      id: projectData.projectInfo.id,
      isActive: !projectIsActive,
    };
    await API.graphql(
      graphqlOperation(updateProduct, { input: updatedProduct })
    );

    if (!projectIsActive === true) {
      notify({
        msg: "Ahora el proyecto sera visible en Marketplace",
        type: "success",
      });
    } else {
      notify({
        msg: "El proyecto ha sido ocultado en Marketplace",
        type: "success",
      });
    }
  };

  const handleChangeProjectStatus = (event) => {
    const { name, type, value, checked } = event.target;
    setProjectStatus(value);
  };

  const handleSaveProjectStatus = async () => {
    let updatedProduct = {
      id: projectData.projectInfo.id,
      status: projectStatus,
    };
    await API.graphql(
      graphqlOperation(updateProduct, { input: updatedProduct })
    );
    notify({
      msg: "El estado del proyecto ha sido actualizado",
      type: "success",
    });
  };

  const handleSetValidatorDataComplete = async (item) => {
    const updatedProjectData = await fetchProjectDataByProjectID(
      projectData.projectInfo.id
    );
    console.log(updatedProjectData, "updatedProjectData");
    let newProductFeature = {
      productID: projectData.projectInfo.id,
      value: true,
    };
    if (item === "technicalInfo") {
      if (!updatedProjectData.isTechnicalComplete) {
        notify({
          msg: "Información técnica incompleta. Primero registra toda la información técnica",
          type: "error",
        });
        return;
      }
      handleUpdateContextProjectData({isTechnicalFreeze: true})
      newProductFeature.featureID = "GLOBAL_VALIDATOR_SET_TECHNICAL_CONDITIONS";

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
      handleUpdateContextProjectData({isFinancialFreeze: true})
      newProductFeature.featureID = "GLOBAL_VALIDATOR_SET_FINANCIAL_CONDITIONS";
      
      notify({
        msg: "Se ha oficializado la información financiera.",
        type: "success",
      });
    }

    console.log(newProductFeature);

    await API.graphql(
      graphqlOperation(createProductFeature, { input: newProductFeature })
    );
  };

  return (
    <Card className={className}>
      <Card.Header title="Configuración del Proyecto" sep={true} />
      <Card.Body>
        <FormGroup
          type="flex"
          label="Estado del proyecto"
          inputType="select"
          inputSize="md"
          optionList={[
            { value: "Prefactibilidad", label: "Prefactibilidad" },
            { value: "Factibilidad", label: "Factibilidad" },
            {
              value: "Documento de diseño del proyecto",
              label: "Documento de diseño del proyecto",
            },
            { value: "Validación externa", label: "Validación externa" },
            { value: "Registro del proyecto", label: "Registro del proyecto" },
          ]}
          inputValue={projectStatus}
          saveBtnDisabled={
            projectData.projectInfo?.status === projectStatus ? true : false
          }
          onChangeInputValue={(e) => handleChangeProjectStatus(e)}
          onClickSaveBtn={() => handleSaveProjectStatus()}
        />
        <FormGroup
          label="Proyecto visible en Marketplace"
          inputType="switch"
          checked={projectIsActive}
          onChangeInputValue={() => handleChangeProjectIsActiveStatus()}
        />
        <div className="d-flex justify-content-center gap-4">
          <Button
            disabled={projectData.isTechnicalFreeze}
            onClick={() => handleSetValidatorDataComplete("technicalInfo")}
          >
            Oficializar información técnica
          </Button>
          <Button
            disabled={projectData.isFinancialFreeze}
            onClick={() => handleSetValidatorDataComplete("financialInfo")}
          >
            Oficializar información financiera
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
