import React, { useEffect, useState } from "react";

import { API, graphqlOperation } from "aws-amplify";
import { createPropertyFeature, updatePropertyFeature } from "graphql/mutations";
import { useAuth } from "context/AuthContext";
import { usePropertyData } from "context/PropertyDataContext";
import { notify } from "utilities/notify";
import Card from "components/common/Card";
import FormGroup from "components/common/FormGroup";

export default function Relations(props) {
  const { className, autorizedUser } = props;
  const { propertyData, refresh } = usePropertyData();
  const { user } = useAuth();

  const [formData, setFormData] = useState([{}]);
  const [executedOnce, setExecutedOnce] = useState(false);
  const [asistenciaPfID, setAsistenciaPfID] = useState(null);
  const [aliadosPfID, setAliadosPfID] = useState(null);
  const [grupoPfID, setGrupoPfID] = useState(null);

  useEffect(() => {
    if (propertyData && propertyData.propertyFeatures && user && !executedOnce) {
      const pfIDAsistencia =
        propertyData.propertyFeatures.filter((item) => {
          return item.featureID === "H_asistance_desc";
        })[0]?.id || null;
      setAsistenciaPfID(pfIDAsistencia);

      const pfIDAliados =
        propertyData.propertyFeatures.filter((item) => {
          return item.featureID === "H_aliados_estrategicos_desc";
        })[0]?.id || null;
      setAliadosPfID(pfIDAliados);

      const pfIDGrupo =
        propertyData.propertyFeatures.filter((item) => {
          return item.featureID === "H_grupo_comunitario_desc";
        })[0]?.id || null;
      setGrupoPfID(pfIDGrupo);

      setFormData((prevState) => ({
        ...prevState,
        projectRelationsTechnicalAssitance:
          propertyData.projectRelations?.technicalAssistance,
        projectRelationsStrategicAllies:
          propertyData.projectRelations?.strategicAllies,
        projectRelationsCommunityGroups:
          propertyData.projectRelations?.communityGroups,
      }));
      setExecutedOnce(true);
    }
  }, [propertyData, user]);

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
        const updatedPropertyFeature = {
          id: asistenciaPfID,
          value: formData.projectRelationsTechnicalAssitance,
        };
        await API.graphql(
          graphqlOperation(updatePropertyFeature, {
            input: updatedPropertyFeature,
          })
        );
      } else {
        const newPropertyFeature = {
          propertyID: propertyData.propertyInfo.id,
          featureID: "H_asistance_desc",
          value: formData.projectRelationsTechnicalAssitance,
        };

        const response = await API.graphql(
          graphqlOperation(createPropertyFeature, {
            input: newPropertyFeature,
          })
        );
        setAsistenciaPfID(response.data.createPropertyFeature.id);
      }
      refresh()
    }

    if (toSave === "projectRelationsStrategicAllies") {
      if (aliadosPfID) {
        const updatedPropertyFeature = {
          id: aliadosPfID,
          value: formData.projectRelationsStrategicAllies,
        };
        await API.graphql(
          graphqlOperation(updatePropertyFeature, {
            input: updatedPropertyFeature,
          })
        );
      } else {
        const newPropertyFeature = {
          propertyID: propertyData.propertyInfo.id,
          featureID: "H_aliados_estrategicos_desc",
          value: formData.projectRelationsStrategicAllies,
        };

        const response = await API.graphql(
          graphqlOperation(createPropertyFeature, {
            input: newPropertyFeature,
          })
        );
        setAliadosPfID(response.data.createPropertyFeature.id);
      }
      refresh()
    }

    if (toSave === "projectRelationsCommunityGroups") {
      if (grupoPfID) {
        const updatedPropertyFeature = {
          id: grupoPfID,
          value: formData.projectRelationsCommunityGroups,
        };
        await API.graphql(
          graphqlOperation(updatePropertyFeature, {
            input: updatedPropertyFeature,
          })
        );
      } else {
        const newPropertyFeature = {
          propertyID: propertyData.propertyInfo.id,
          featureID: "H_grupo_comunitario_desc",
          value: formData.projectRelationsCommunityGroups,
        };

        const response = await API.graphql(
          graphqlOperation(createPropertyFeature, {
            input: newPropertyFeature,
          })
        );
        setGrupoPfID(response.data.createPropertyFeature.id);
      }
      refresh()
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
                propertyData.projectRelations?.technicalAssistance ===
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
                propertyData.projectRelations?.strategicAllies ===
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
                propertyData.projectRelations?.communityGroups ===
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
