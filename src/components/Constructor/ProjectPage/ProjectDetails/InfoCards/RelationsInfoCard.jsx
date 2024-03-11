import React, { useEffect, useState } from "react";

import Card from "../../../../common/Card";
import FormGroup from "../../../../common/FormGroup";
import { useProjectData } from "../../../../../context/ProjectDataContext";
import { API, graphqlOperation } from "aws-amplify";
import { createProductFeature, updateProductFeature } from "graphql/mutations";
import { useAuth } from "context/AuthContext";
import { notify } from "../../../../../utilities/notify";

export default function RelationsInfoCard(props) {
  const { className, autorizedUser } = props;
  const { projectData, handleUpdateContextProjectRelations } = useProjectData();
  const { user } = useAuth();

  const [formData, setFormData] = useState([{}]);
  const [executedOnce, setExecutedOnce] = useState(false);
  const [asistenciaPfID, setAsistenciaPfID] = useState(null);
  const [aliadosPfID, setAliadosPfID] = useState(null);
  const [grupoPfID, setGrupoPfID] = useState(null);

  useEffect(() => {
    if (projectData && projectData.projectFeatures && user && !executedOnce) {
      const pfIDAsistencia =
        projectData.projectFeatures.filter((item) => {
          return item.featureID === "H_asistance_desc";
        })[0]?.id || null;
      setAsistenciaPfID(pfIDAsistencia);

      const pfIDAliados =
        projectData.projectFeatures.filter((item) => {
          return item.featureID === "H_aliados_estrategicos_desc";
        })[0]?.id || null;
      setAliadosPfID(pfIDAliados);

      const pfIDGrupo =
        projectData.projectFeatures.filter((item) => {
          return item.featureID === "H_grupo_comunitario_desc";
        })[0]?.id || null;
      setGrupoPfID(pfIDGrupo);

      setFormData((prevState) => ({
        ...prevState,
        projectRelationsTechnicalAssitance:
          projectData.projectRelations?.technicalAssistance,
        projectRelationsStrategicAllies:
          projectData.projectRelations?.strategicAllies,
        projectRelationsCommunityGroups:
          projectData.projectRelations?.communityGroups,
      }));
      setExecutedOnce(true);
    }
  }, [projectData, user]);

  const handleChangeInputValue = async (e) => {
    const { name, value } = e.target;
    if (name === "projectRelationsTechnicalAssitance") {
      setFormData((prevState) => ({
        ...prevState,
        projectRelationsTechnicalAssitance: value,
      }));
      return;
    }
    if (name === "projectRelationsStrategicAllies") {
      setFormData((prevState) => ({
        ...prevState,
        projectRelationsStrategicAllies: value,
      }));
      return;
    }
    if (name === "projectRelationsCommunityGroups") {
      setFormData((prevState) => ({
        ...prevState,
        projectRelationsCommunityGroups: value,
      }));
      return;
    }
  };
  const handleSaveBtn = async (toSave) => {
    if (toSave === "projectRelationsTechnicalAssitance") {
      if (asistenciaPfID) {
        const updatedProductFeature = {
          id: asistenciaPfID,
          value: formData.projectRelationsTechnicalAssitance,
        };
        await API.graphql(
          graphqlOperation(updateProductFeature, {
            input: updatedProductFeature,
          })
        );
      } else {
        const newProductFeature = {
          productID: projectData.projectInfo.id,
          featureID: "H_asistance_desc",
          value: formData.projectRelationsTechnicalAssitance,
        };

        const response = await API.graphql(
          graphqlOperation(createProductFeature, {
            input: newProductFeature,
          })
        );
        setAsistenciaPfID(response.data.createProductFeature.id);
      }
      handleUpdateContextProjectRelations({
        technicalAssistance: formData.projectRelationsTechnicalAssitance,
      });
    }

    if (toSave === "projectRelationsStrategicAllies") {
      if (aliadosPfID) {
        const updatedProductFeature = {
          id: aliadosPfID,
          value: formData.projectRelationsStrategicAllies,
        };
        await API.graphql(
          graphqlOperation(updateProductFeature, {
            input: updatedProductFeature,
          })
        );
      } else {
        const newProductFeature = {
          productID: projectData.projectInfo.id,
          featureID: "H_aliados_estrategicos_desc",
          value: formData.projectRelationsStrategicAllies,
        };

        const response = await API.graphql(
          graphqlOperation(createProductFeature, {
            input: newProductFeature,
          })
        );
        setAliadosPfID(response.data.createProductFeature.id);
      }
      handleUpdateContextProjectRelations({
        strategicAllies: formData.projectRelationsStrategicAllies,
      });
    }

    if (toSave === "projectRelationsCommunityGroups") {
      if (grupoPfID) {
        const updatedProductFeature = {
          id: grupoPfID,
          value: formData.projectRelationsCommunityGroups,
        };
        await API.graphql(
          graphqlOperation(updateProductFeature, {
            input: updatedProductFeature,
          })
        );
      } else {
        const newProductFeature = {
          productID: projectData.projectInfo.id,
          featureID: "H_grupo_comunitario_desc",
          value: formData.projectRelationsCommunityGroups,
        };

        const response = await API.graphql(
          graphqlOperation(createProductFeature, {
            input: newProductFeature,
          })
        );
        setGrupoPfID(response.data.createProductFeature.id);
      }
      handleUpdateContextProjectRelations({
        communityGroups: formData.projectRelationsCommunityGroups,
      });
    }

    notify({ msg: "Información actualizada", type: "success" });
  };

  return (
    <div className={`${className} card`}>
  <div className="card-header">
    <h5 className="card-title">Relaciones con entidades y aliados estratégicos</h5>
  </div>
  <div className="card-body">
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div className="col-12 col-lg-12">
        <FormGroup
          disabled={!autorizedUser}
          type={autorizedUser && "flex"}
          inputType="textarea"
          label="¿Recibe asistencia técnica en el predio?"
          inputName="projectRelationsTechnicalAssitance"
          inputValue={formData.projectRelationsTechnicalAssitance}
          saveBtnDisabled={
            projectData.projectRelations?.technicalAssistance ===
            formData.projectRelationsTechnicalAssitance
              ? true
              : false
          }
          onChangeInputValue={(e) => handleChangeInputValue(e)}
          onClickSaveBtn={() =>
            handleSaveBtn("projectRelationsTechnicalAssitance")
          }
        />
      </div>
      <div className="col-12 col-lg-12">
        <FormGroup
          disabled={!autorizedUser}
          type={autorizedUser && "flex"}
          inputType="textarea"
          label="¿Cuenta con aliados estratégicos?"
          inputName="projectRelationsStrategicAllies"
          inputValue={formData.projectRelationsStrategicAllies}
          saveBtnDisabled={
            projectData.projectRelations?.strategicAllies ===
            formData.projectRelationsStrategicAllies
              ? true
              : false
          }
          onChangeInputValue={(e) => handleChangeInputValue(e)}
          onClickSaveBtn={() =>
            handleSaveBtn("projectRelationsStrategicAllies")
          }
        />
      </div>
      <div className="col-12 col-lg-12">
        <FormGroup
          disabled={!autorizedUser}
          type={autorizedUser && "flex"}
          inputType="textarea"
          label="¿Pertenece a algún grupo comunitario?"
          inputName="projectRelationsCommunityGroups"
          inputValue={formData.projectRelationsCommunityGroups}
          saveBtnDisabled={
            projectData.projectRelations?.communityGroups ===
            formData.projectRelationsCommunityGroups
              ? true
              : false
          }
          onChangeInputValue={(e) => handleChangeInputValue(e)}
          onClickSaveBtn={() =>
            handleSaveBtn("projectRelationsCommunityGroups")
          }
        />
      </div>
    </div>
  </div>
</div>

    );
}
