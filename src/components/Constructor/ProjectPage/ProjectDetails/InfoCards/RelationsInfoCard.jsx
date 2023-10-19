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

  useEffect(() => {
    if (projectData && user) {
      setFormData((prevState) => ({
        ...prevState,
        projectRelationsTechnicalAssitance:
          projectData.projectRelations?.technicalAssistance,
        projectRelationsStrategicAllies:
          projectData.projectRelations?.strategicAllies,
        projectRelationsCommunityGroups:
          projectData.projectRelations?.communityGroups,
      }));
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
      const pfID =
        projectData.projectFeatures.filter((item) => {
          return item.featureID === "H_asistance_desc";
        })[0]?.id || null;
      if (pfID) {
        const updatedProductFeature = {
          id: pfID,
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

        await API.graphql(
          graphqlOperation(createProductFeature, {
            input: newProductFeature,
          })
        );
      }
      handleUpdateContextProjectRelations({
        technicalAssistance: formData.projectRelationsTechnicalAssitance,
      });
    }

    if (toSave === "projectRelationsStrategicAllies") {
      const pfID =
        projectData.projectFeatures.filter((item) => {
          return item.featureID === "H_aliados_estrategicos_desc";
        })[0]?.id || null;
      if (pfID) {
        const updatedProductFeature = {
          id: pfID,
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

        await API.graphql(
          graphqlOperation(createProductFeature, {
            input: newProductFeature,
          })
        );
      }
      handleUpdateContextProjectRelations({
        strategicAllies: formData.projectRelationsStrategicAllies,
      });
    }

    if (toSave === "projectRelationsCommunityGroups") {
      const pfID =
        projectData.projectFeatures.filter((item) => {
          return item.featureID === "H_grupo_comunitario_desc";
        })[0]?.id || null;
      if (pfID) {
        const updatedProductFeature = {
          id: pfID,
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

        await API.graphql(
          graphqlOperation(createProductFeature, {
            input: newProductFeature,
          })
        );
      }
      handleUpdateContextProjectRelations({
        communityGroups: formData.projectRelationsCommunityGroups,
      });
    }
    
    notify({ msg: "Información actualizada", type: "success" });
  };

  return (
    <Card className={className}>
      <Card.Header
        title="Relaciones con entidades y aliados estratégicos"
        sep={true}
      />
      <Card.Body>
        <div className="row row-cols-1 row-cols-md-2">
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
      </Card.Body>
    </Card>
  );
}
