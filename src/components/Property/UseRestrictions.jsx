import React, { useEffect, useState } from "react";

import { useAuth } from "context/AuthContext";
import { API, graphqlOperation } from "aws-amplify";
import { createPropertyFeature, updatePropertyFeature } from "graphql/mutations";
import { usePropertyData } from "context/PropertyDataContext";
import Card from "components/common/Card";
import { notify } from "utilities/notify";
import FormGroup from "components/common/FormGroup";

export default function UseRestrictions(props) {
  const { className, autorizedUser } = props;
  const { propertyData, refresh } =
    usePropertyData();
  const { user } = useAuth();

  const [formData, setFormData] = useState([{}]);
  const [executedOnce, setExecutedOnce] = useState(false);
  const [resDescPfID, setResDescPfID] = useState(null);
  const [resOtherPfID, setResOtherPfID] = useState(null);

  useEffect(() => {
    if (propertyData && propertyData.propertyFeatures && user && !executedOnce) {
      const pfIDResDesc =
        propertyData.propertyFeatures.filter((item) => {
          return item.featureID === "E_restriccion_desc";
        })[0]?.id || null;
      setResDescPfID(pfIDResDesc);

      const pfIDResOther =
        propertyData.propertyFeatures.filter((item) => {
          return item.featureID === "E_resctriccion_other";
        })[0]?.id || null;
      setResOtherPfID(pfIDResOther);

      setFormData((prevState) => ({
        ...prevState,
        projectRestrictionsDesc: propertyData.projectRestrictions?.desc,
        projectRestrictionsOther: propertyData.projectRestrictions?.other,
      }));
      setExecutedOnce(true);
    }
  }, [propertyData, user]);

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
        const updatedPropertyFeature = {
          id: resDescPfID,
          value: formData.projectRestrictionsDesc,
        };
        await API.graphql(
          graphqlOperation(updatePropertyFeature, {
            input: updatedPropertyFeature,
          })
        );
      } else {
        const newProductFeature = {
          propertyID: propertyData.propertyInfo.id,
          featureID: "E_restriccion_desc",
          value: formData.projectRestrictionsDesc,
        };

        const response = await API.graphql(
          graphqlOperation(createPropertyFeature, {
            input: newProductFeature,
          })
        );
        setResDescPfID(response.data.createPropertyFeature.id);
      }

      refresh()
    }

    if (toSave === "projectRestrictionsOther") {
      if (resOtherPfID) {
        const updatedPropertyFeature = {
          id: resOtherPfID,
          value: formData.projectRestrictionsOther,
        };
        await API.graphql(
          graphqlOperation(updatePropertyFeature, {
            input: updatedPropertyFeature,
          })
        );
      } else {
        const newProductFeature = {
          propertyID: propertyData.propertyInfo.id,
          featureID: "E_resctriccion_other",
          value: formData.projectRestrictionsOther,
        };

        const response = await API.graphql(
          graphqlOperation(createPropertyFeature, {
            input: newProductFeature,
          })
        );
        setResDescPfID(response.data.createPropertyFeature.id);
      }

      refresh()
    }

    notify({ msg: "Información actualizada", type: "success" });
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
                propertyData.projectRestrictions?.desc ===
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
                propertyData.projectRestrictions?.other ===
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
