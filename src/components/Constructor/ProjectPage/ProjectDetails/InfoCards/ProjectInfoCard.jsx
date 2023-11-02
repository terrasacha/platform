import React, { useEffect, useState } from "react";

import Card from "../../../../common/Card";
import FormGroup from "../../../../common/FormGroup";
import { useProjectData } from "../../../../../context/ProjectDataContext";
import { API, graphqlOperation } from "aws-amplify";
import {
  createProductFeature,
  updateProduct,
  updateProductFeature,
} from "graphql/mutations";
import { useAuth } from "context/AuthContext";
import { notify } from "../../../../../utilities/notify";

export default function ProjectInfoCard(props) {
  const { className, autorizedUser } = props;
  const {
    projectData,
    handleUpdateContextProjectInfo,
    handleUpdateContextProjectInfoLocation,
  } = useProjectData();
  const { user } = useAuth();

  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (projectData && user) {
      setFormData((prevState) => ({
        ...prevState,
        projectInfoTitle: projectData.projectInfo?.title,
        projectInfoArea: projectData.projectInfo?.area,
        projectInfoDescription: projectData.projectInfo?.description,
        projectInfoCategory: projectData.projectInfo?.category,
        projectInfoLocationVereda: projectData.projectInfo?.location.vereda,
        projectInfoLocationMunicipio:
          projectData.projectInfo?.location.municipio,
        projectInfoLocationMatricula:
          projectData.projectInfo?.location.matricula,
        projectInfoLocationFichaCatrastral:
          projectData.projectInfo?.location.fichaCatrastal,
      }));
    }
  }, [projectData, user]);

  const handleChangeInputValue = async (e) => {
    const { name, value } = e.target;
    if (name === "projectInfoTitle") {
      setFormData((prevState) => ({
        ...prevState,
        projectInfoTitle: value,
      }));
      return;
    }
    if (name === "projectInfoArea") {
      setFormData((prevState) => ({
        ...prevState,
        projectInfoArea: value,
      }));
      return;
    }
    if (name === "projectInfoDescription") {
      setFormData((prevState) => ({
        ...prevState,
        projectInfoDescription: value,
      }));
      return;
    }
    if (name === "projectInfoCategory") {
      setFormData((prevState) => ({
        ...prevState,
        projectInfoCategory: value,
      }));
      return;
    }
    if (name === "projectInfoLocationVereda") {
      setFormData((prevState) => ({
        ...prevState,
        projectInfoLocationVereda: value,
      }));
      return;
    }
    if (name === "projectInfoLocationMunicipio") {
      setFormData((prevState) => ({
        ...prevState,
        projectInfoLocationMunicipio: value,
      }));
      return;
    }
    if (name === "projectInfoLocationMatricula") {
      setFormData((prevState) => ({
        ...prevState,
        projectInfoLocationMatricula: value,
      }));
      return;
    }
    if (name === "projectInfoLocationFichaCatrastral") {
      setFormData((prevState) => ({
        ...prevState,
        projectInfoLocationFichaCatrastral: value,
      }));
      return;
    }
  };

  const handleSaveBtn = async (toSave) => {
    let error = false;

    if (toSave === "projectInfoTitle") {
      const updatedProduct = {
        id: projectData.projectInfo.id,
        name: formData.projectInfoTitle,
      };
      await API.graphql(
        graphqlOperation(updateProduct, {
          input: updatedProduct,
        })
      );
      handleUpdateContextProjectInfo({ title: formData.projectInfoTitle });
    }

    if (toSave === "projectInfoDescription") {
      const updatedProduct = {
        id: projectData.projectInfo.id,
        description: formData.projectInfoDescription,
      };
      await API.graphql(
        graphqlOperation(updateProduct, {
          input: updatedProduct,
        })
      );
      handleUpdateContextProjectInfo({
        description: formData.projectInfoDescription,
      });
    }

    if (toSave === "projectInfoCategory") {
      const updatedProduct = {
        id: projectData.projectInfo.id,
        categoryID: formData.projectInfoCategory,
      };
      await API.graphql(
        graphqlOperation(updateProduct, {
          input: updatedProduct,
        })
      );
      handleUpdateContextProjectInfo({
        category: formData.projectInfoCategory,
      });
    }

    if (toSave === "projectInfoArea") {
      const pfID =
        projectData.projectFeatures.filter((item) => {
          return item.featureID === "D_area";
        })[0]?.id || null;
      if (pfID) {
        const updatedProductFeature = {
          id: pfID,
          value: formData.projectInfoArea,
        };
        await API.graphql(
          graphqlOperation(updateProductFeature, {
            input: updatedProductFeature,
          })
        );
      } else {
        const newProductFeature = {
          productID: projectData.projectInfo.id,
          featureID: "D_area",
          value: formData.projectInfoArea,
        };

        await API.graphql(
          graphqlOperation(createProductFeature, {
            input: newProductFeature,
          })
        );
      }
      handleUpdateContextProjectInfo({ area: formData.projectInfoArea });
    }

    if (toSave === "projectInfoLocationVereda") {
      const pfID =
        projectData.projectFeatures.filter((item) => {
          return item.featureID === "A_vereda";
        })[0]?.id || null;
      if (pfID) {
        const updatedProductFeature = {
          id: pfID,
          value: formData.projectInfoLocationVereda,
        };
        await API.graphql(
          graphqlOperation(updateProductFeature, {
            input: updatedProductFeature,
          })
        );
      } else {
        const newProductFeature = {
          productID: projectData.projectInfo.id,
          featureID: "A_vereda",
          value: formData.projectInfoLocationVereda,
        };

        await API.graphql(
          graphqlOperation(createProductFeature, {
            input: newProductFeature,
          })
        );
      }
      handleUpdateContextProjectInfoLocation({
        vereda: formData.projectInfoLocationVereda,
      });
    }

    if (toSave === "projectInfoLocationMunicipio") {
      const pfID =
        projectData.projectFeatures.filter((item) => {
          return item.featureID === "A_municipio";
        })[0]?.id || null;
      if (pfID) {
        const updatedProductFeature = {
          id: pfID,
          value: formData.projectInfoLocationMunicipio,
        };
        await API.graphql(
          graphqlOperation(updateProductFeature, {
            input: updatedProductFeature,
          })
        );
      } else {
        const newProductFeature = {
          productID: projectData.projectInfo.id,
          featureID: "A_municipio",
          value: formData.projectInfoLocationMunicipio,
        };

        await API.graphql(
          graphqlOperation(createProductFeature, {
            input: newProductFeature,
          })
        );
      }
      handleUpdateContextProjectInfoLocation({
        municipio: formData.projectInfoLocationMunicipio,
      });
    }

    if (toSave === "projectInfoLocationMatricula") {
      const pfID =
        projectData.projectFeatures.filter((item) => {
          return item.featureID === "A_matricula";
        })[0]?.id || null;
      if (pfID) {
        const updatedProductFeature = {
          id: pfID,
          value: formData.projectInfoLocationMatricula,
        };
        await API.graphql(
          graphqlOperation(updateProductFeature, {
            input: updatedProductFeature,
          })
        );
      } else {
        const newProductFeature = {
          productID: projectData.projectInfo.id,
          featureID: "A_matricula",
          value: formData.projectInfoLocationMatricula,
        };

        await API.graphql(
          graphqlOperation(createProductFeature, {
            input: newProductFeature,
          })
        );
      }
      handleUpdateContextProjectInfoLocation({
        matricula: formData.projectInfoLocationMatricula,
      });
    }

    if (toSave === "projectInfoLocationFichaCatrastral") {
      const pfID =
        projectData.projectFeatures.filter((item) => {
          return item.featureID === "A_ficha_catastral";
        })[0]?.id || null;
      if (pfID) {
        const updatedProductFeature = {
          id: pfID,
          value: formData.projectInfoLocationFichaCatrastral,
        };
        await API.graphql(
          graphqlOperation(updateProductFeature, {
            input: updatedProductFeature,
          })
        );
      } else {
        const newProductFeature = {
          productID: projectData.projectInfo.id,
          featureID: "A_ficha_catastral",
          value: formData.projectInfoLocationFichaCatrastral,
        };

        await API.graphql(
          graphqlOperation(createProductFeature, {
            input: newProductFeature,
          })
        );
      }
      handleUpdateContextProjectInfoLocation({
        fichaCatrastal: formData.projectInfoLocationFichaCatrastral,
      });
    }

    notify({ msg: "Información actualizada", type: "success" });
  };

  return (
    <Card className={className}>
      <Card.Header title="Información del proyecto" sep={true} />
      <Card.Body>
        <div className="row">
          <div
            className={autorizedUser ? "col-12 col-md-12" : "col-12 col-md-6"}
          >
            <FormGroup
              disabled={!autorizedUser}
              type={autorizedUser && "flex"}
              label="Nombre del proyecto"
              inputName="projectInfoTitle"
              inputValue={formData.projectInfoTitle}
              saveBtnDisabled={
                projectData.projectInfo?.title === formData.projectInfoTitle
                  ? true
                  : false
              }
              onChangeInputValue={(e) => handleChangeInputValue(e)}
              onClickSaveBtn={() => handleSaveBtn("projectInfoTitle")}
            />
          </div>
          <div
            className={autorizedUser ? "col-12 col-md-12" : "col-12 col-md-6"}
          >
            <FormGroup
              disabled={!autorizedUser}
              type={autorizedUser && "flex"}
              label="Área total (hectáreas)"
              inputName="projectInfoArea"
              inputValue={formData.projectInfoArea}
              saveBtnDisabled={
                projectData.projectInfo?.area === formData.projectInfoArea
                  ? true
                  : false
              }
              onChangeInputValue={(e) => handleChangeInputValue(e)}
              onClickSaveBtn={() => handleSaveBtn("projectInfoArea")}
            />
          </div>
          <div className="col-12">
            <FormGroup
              disabled={!autorizedUser}
              type={autorizedUser && "flex"}
              inputType="textarea"
              label="Descripción"
              inputName="projectInfoDescription"
              inputValue={formData.projectInfoDescription}
              saveBtnDisabled={
                projectData.projectInfo?.description ===
                formData.projectInfoDescription
                  ? true
                  : false
              }
              onChangeInputValue={(e) => handleChangeInputValue(e)}
              onClickSaveBtn={() => handleSaveBtn("projectInfoDescription")}
            />
          </div>
          <div
            className={autorizedUser ? "col-12 col-md-12" : "col-12 col-md-6"}
          >
            <FormGroup
              disabled={!autorizedUser}
              type={autorizedUser && "flex"}
              label="Categoria del proyecto"
              inputType="radio"
              optionList={[
                { label: "REDD+", value: "REDD+" },
                {
                  label: "PROYECTO_PLANTACIONES",
                  value: "PROYECTO_PLANTACIONES",
                },
              ]}
              optionCheckedList={formData.projectInfoCategory}
              inputName="projectInfoCategory"
              saveBtnDisabled={
                projectData.projectInfo?.category ===
                formData.projectInfoCategory
                  ? true
                  : false
              }
              onChangeInputValue={(e) => handleChangeInputValue(e)}
              onClickSaveBtn={() => handleSaveBtn("projectInfoCategory")}
            />
          </div>
          <div className="col-12">
            <div
              className={
                autorizedUser
                  ? "row row-cols-1"
                  : "row row-cols-1 row-cols-md-2"
              }
            >
              <FormGroup
                disabled={!autorizedUser}
                type={autorizedUser && "flex"}
                label="Vereda al que pertenece el Predio"
                inputName="projectInfoLocationVereda"
                inputValue={formData.projectInfoLocationVereda}
                saveBtnDisabled={
                  projectData.projectInfo?.location.vereda ===
                  formData.projectInfoLocationVereda
                    ? true
                    : false
                }
                onChangeInputValue={(e) => handleChangeInputValue(e)}
                onClickSaveBtn={() =>
                  handleSaveBtn("projectInfoLocationVereda")
                }
              />
              <FormGroup
                disabled={!autorizedUser}
                type={autorizedUser && "flex"}
                label="Municipio al que pertenece el predio"
                inputName="projectInfoLocationMunicipio"
                inputValue={formData.projectInfoLocationMunicipio}
                saveBtnDisabled={
                  projectData.projectInfo?.location.municipio ===
                  formData.projectInfoLocationMunicipio
                    ? true
                    : false
                }
                onChangeInputValue={(e) => handleChangeInputValue(e)}
                onClickSaveBtn={() =>
                  handleSaveBtn("projectInfoLocationMunicipio")
                }
              />
              <FormGroup
                disabled={!autorizedUser}
                type={autorizedUser && "flex"}
                label="Número de matrícula inmobiliaria del predio"
                inputName="projectInfoLocationMatricula"
                inputValue={formData.projectInfoLocationMatricula}
                saveBtnDisabled={
                  projectData.projectInfo?.location.matricula ===
                  formData.projectInfoLocationMatricula
                    ? true
                    : false
                }
                onChangeInputValue={(e) => handleChangeInputValue(e)}
                onClickSaveBtn={() =>
                  handleSaveBtn("projectInfoLocationMatricula")
                }
              />
              <FormGroup
                disabled={!autorizedUser}
                type={autorizedUser && "flex"}
                label="Número de ficha catastral que aparece en el impuesto predial del municipio del predio"
                inputName="projectInfoLocationFichaCatrastral"
                inputValue={formData.projectInfoLocationFichaCatrastral}
                saveBtnDisabled={
                  projectData.projectInfo?.location.fichaCatrastal ===
                  formData.projectInfoLocationFichaCatrastral
                    ? true
                    : false
                }
                onChangeInputValue={(e) => handleChangeInputValue(e)}
                onClickSaveBtn={() =>
                  handleSaveBtn("projectInfoLocationFichaCatrastral")
                }
              />
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
