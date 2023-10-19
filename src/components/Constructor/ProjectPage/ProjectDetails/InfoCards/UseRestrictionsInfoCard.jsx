import React, { useEffect, useState } from "react";

import Card from "../../../../common/Card";
import FormGroup from "../../../../common/FormGroup";
import { useProjectData } from "../../../../../context/ProjectDataContext";
import { useAuth } from "context/AuthContext";
import { API, graphqlOperation } from "aws-amplify";
import { createProductFeature, updateProductFeature } from "graphql/mutations";

export default function UseRestrictionsInfoCard(props) {
  const { className, autorizedUser } = props;
  const { projectData, handleUpdateContextProjectRestrictions } =
    useProjectData();
  const { user } = useAuth();

  const [formData, setFormData] = useState([{}]);

  useEffect(() => {
    if (projectData && user) {
      setFormData((prevState) => ({
        ...prevState,
        projectRestrictionsDesc: projectData.projectRestrictions?.desc,
        projectRestrictionsOther: projectData.projectRestrictions?.other,
      }));
    }
  }, [projectData, user]);

  const handleChangeInputValue = async (e) => {
    const { name, value } = e.target;
    if (name === "projectRestrictionsDesc") {
      setFormData((prevState) => ({
        ...prevState,
        projectRestrictionsDesc: value,
      }));
      return;
    }
    if (name === "projectRestrictionsOther") {
      setFormData((prevState) => ({
        ...prevState,
        projectRestrictionsOther: value,
      }));
      return;
    }
  };
  const handleSaveBtn = async (toSave) => {

    if (toSave === "projectRestrictionsDesc") {
      const pfID =
        projectData.projectFeatures.filter((item) => {
          return item.featureID === "E_restriccion_desc";
        })[0]?.id || null;
      if (pfID) {
        const updatedProductFeature = {
          id: pfID,
          value: formData.projectRestrictionsDesc,
        };
        await API.graphql(
          graphqlOperation(updateProductFeature, {
            input: updatedProductFeature,
          })
        );
      } else {
        const newProductFeature = {
          productID: projectData.projectInfo.id,
          featureID: "E_restriccion_desc",
          value: formData.projectRestrictionsDesc,
        };

        await API.graphql(
          graphqlOperation(createProductFeature, {
            input: newProductFeature,
          })
        );
      }
      handleUpdateContextProjectRestrictions({
        desc: formData.projectRestrictionsDesc,
      });
    }

    if (toSave === "projectRestrictionsOther") {
      const pfID =
        projectData.projectFeatures.filter((item) => {
          return item.featureID === "E_resctriccion_other";
        })[0]?.id || null;
      if (pfID) {
        const updatedProductFeature = {
          id: pfID,
          value: formData.projectRestrictionsOther,
        };
        await API.graphql(
          graphqlOperation(updateProductFeature, {
            input: updatedProductFeature,
          })
        );
      } else {
        const newProductFeature = {
          productID: projectData.projectInfo.id,
          featureID: "E_resctriccion_other",
          value: formData.projectRestrictionsOther,
        };

        await API.graphql(
          graphqlOperation(createProductFeature, {
            input: newProductFeature,
          })
        );
      }
      handleUpdateContextProjectRestrictions({
        other: formData.projectRestrictionsOther,
      });
    }
  };

  return (
    <Card className={className}>
      <Card.Header title="Limitaciones de uso de suelo" sep={true} />
      <Card.Body>
        <div className="row row-cols-1">
          <div className="col">
            <FormGroup
              disabled={!autorizedUser}
              type={autorizedUser && "flex"}
              inputType="textarea"
              label="Restricción de uso por encontrarse inmerso en áreas de protección declaradas como parques, zonas de reserva, otros"
              inputName="projectRestrictionsDesc"
              inputValue={formData.projectRestrictionsDesc}
              saveBtnDisabled={
                projectData.projectRestrictions?.desc ===
                formData.projectRestrictionsDesc
                  ? true
                  : false
              }
              onChangeInputValue={(e) => handleChangeInputValue(e)}
              onClickSaveBtn={() => handleSaveBtn("projectRestrictionsDesc")}
            />
          </div>
          <div className="col">
            <FormGroup
              disabled={!autorizedUser}
              type={autorizedUser && "flex"}
              inputType="textarea"
              label="Otros limitantes"
              inputName="projectRestrictionsOther"
              inputValue={formData.projectRestrictionsOther}
              saveBtnDisabled={
                projectData.projectRestrictions?.other ===
                formData.projectRestrictionsOther
                  ? true
                  : false
              }
              onChangeInputValue={(e) => handleChangeInputValue(e)}
              onClickSaveBtn={() => handleSaveBtn("projectRestrictionsOther")}
            />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
