import React, { useEffect, useState } from "react";

import Card from "../../../../common/Card";
import FormGroup from "../../../../common/FormGroup";
import { useProjectData } from "../../../../../context/ProjectDataContext";
import { useAuth } from "context/AuthContext";
import { API, graphqlOperation } from "aws-amplify";
import { createProductFeature, updateProductFeature } from "graphql/mutations";
import { notify } from "../../../../../utilities/notify";

export default function UseRestrictionsInfoCard(props) {
  const { className, autorizedUser } = props;
  const { projectData, handleUpdateContextProjectRestrictions } =
    useProjectData();
  const { user } = useAuth();

  const [formData, setFormData] = useState([{}]);
  const [executedOnce, setExecutedOnce] = useState(false);
  const [resDescPfID, setResDescPfID] = useState(null);
  const [resOtherPfID, setResOtherPfID] = useState(null);

  useEffect(() => {
    if (projectData && projectData.projectFeatures && user && !executedOnce) {
      const pfIDResDesc =
        projectData.projectFeatures.filter((item) => {
          return item.featureID === "E_restriccion_desc";
        })[0]?.id || null;
      setResDescPfID(pfIDResDesc);

      const pfIDResOther =
        projectData.projectFeatures.filter((item) => {
          return item.featureID === "E_resctriccion_other";
        })[0]?.id || null;
      setResOtherPfID(pfIDResOther);

      setFormData((prevState) => ({
        ...prevState,
        projectRestrictionsDesc: projectData.projectRestrictions?.desc,
        projectRestrictionsOther: projectData.projectRestrictions?.other,
      }));
      setExecutedOnce(true);
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
      if (resDescPfID) {
        const updatedProductFeature = {
          id: resDescPfID,
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

        const response = await API.graphql(
          graphqlOperation(createProductFeature, {
            input: newProductFeature,
          })
        );
        setResDescPfID(response.data.createProductFeature.id);
      }
      handleUpdateContextProjectRestrictions({
        desc: formData.projectRestrictionsDesc,
      });
    }

    if (toSave === "projectRestrictionsOther") {
      if (resOtherPfID) {
        const updatedProductFeature = {
          id: resOtherPfID,
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

        const response = await API.graphql(
          graphqlOperation(createProductFeature, {
            input: newProductFeature,
          })
        );
        setResDescPfID(response.data.createProductFeature.id);
      }
      handleUpdateContextProjectRestrictions({
        other: formData.projectRestrictionsOther,
      });
    }

    notify({ msg: "Información actualizada", type: "success" });
  };

  return (
    <div className={className}>
  <div className="border-b border-gray-300">
    <h2 className="text-xl font-semibold mb-4">Limitaciones de uso de suelo</h2>
  </div>
  <div className="p-6">
    <div className="grid grid-cols-1">
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
  </div>
</div>
  );
}
