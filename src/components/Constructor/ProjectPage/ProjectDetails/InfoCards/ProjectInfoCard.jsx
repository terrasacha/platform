import React, { useEffect, useRef, useState } from "react";

import Card from "../../../../common/Card";
import FormGroup from "../../../../common/FormGroup";
import { useProjectData } from "../../../../../context/ProjectDataContext";
import { API, Storage, graphqlOperation } from "aws-amplify";
import {
  createDocument,
  createProductFeature,
  updateDocument,
  updateProduct,
  updateProductFeature,
} from "graphql/mutations";
import { useAuth } from "context/AuthContext";
import { notify } from "../../../../../utilities/notify";
import useCategories from "hooks/useCategories";
import { Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import WebAppConfig from "components/common/_conf/WebAppConfig";
import { fetchProjectDataByProjectID } from "../../api";

export default function ProjectInfoCard(props) {
  const { className, autorizedUser, setProgressChange, tooltip } = props;
  const {
    projectData,
    handleUpdateContextProjectInfo,
    handleUpdateContextProjectInfoLocation,
    handleUpdateContextProjectFile,
  } = useProjectData();
  const { user } = useAuth();
  const { categoryList } = useCategories();

  const [formData, setFormData] = useState({});
  const [executedOnce, setExecutedOnce] = useState(false);
  const [areaPfID, setAreaPfID] = useState(null);
  const [veredaPfID, setVeredaPfID] = useState(null);
  const [municipioPfID, setMunicipioPfID] = useState(null);
  const [matriculaPfID, setMatriculaPfID] = useState(null);
  const [fichaPfID, setFichaPfID] = useState(null);
  const [planoPfID, setPlanoPfID] = useState(null);
  const [planoURL, setPlanoURL] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (
      projectData.projectInfo &&
      projectData.projectFeatures &&
      user &&
      !executedOnce
    ) {
      const pfIDArea =
        projectData.projectFeatures.filter((item) => {
          return item.featureID === "D_area";
        })[0]?.id || null;
      setAreaPfID(pfIDArea);

      const pfIDVereda =
        projectData.projectFeatures.filter((item) => {
          return item.featureID === "A_vereda";
        })[0]?.id || null;
      setVeredaPfID(pfIDVereda);

      const pfIDMunicipio =
        projectData.projectFeatures.filter((item) => {
          return item.featureID === "A_municipio";
        })[0]?.id || null;
      setMunicipioPfID(pfIDMunicipio);

      const pfIDMatricula =
        projectData.projectFeatures.filter((item) => {
          return item.featureID === "A_matricula";
        })[0]?.id || null;
      setMatriculaPfID(pfIDMatricula);

      const pfIDFicha =
        projectData.projectFeatures.filter((item) => {
          return item.featureID === "A_ficha_catastral";
        })[0]?.id || null;
      setFichaPfID(pfIDFicha);

      const pfIDPlano =
        projectData.projectFeatures.filter((item) => {
          return item.featureID === "C_plano_predio";
        })[0]?.id || null;
      setPlanoPfID(pfIDPlano);
      const planoFile = projectData.projectFiles.find(
        (item) => item.pfID === pfIDPlano
      );
      if (planoFile) {
        setPlanoURL(planoFile.url);
      }

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
      setExecutedOnce(true);
    }
  }, [projectData, user]);

  const handleUploadButton = (index) => {
    Swal.fire({
      title: "Estas seguro?",
      text: "Este archivo será cargado y enviado a validación!",
      showCancelButton: true,
      confirmButtonText: "Cargar archivo",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        fileInputRef.current.click();
      }
    });
  };

  const formatFileName = (fileName) => {
    const removeAccents = (str) => {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };
    const formattedFilename = fileName
      .toLowerCase()
      .trim()
      .replaceAll(" ", "_");
    const filenameWithoutAccents = removeAccents(formattedFilename);
    return encodeURIComponent(filenameWithoutAccents);
  };

  const saveFileOnDB = async (fileToSave) => {
    let docID = null;
    let pfID = planoPfID
    const urlPath = `${projectData.projectInfo.id}/${formatFileName(
      fileToSave.name
    )}`;

    if (pfID) {
      const oldDocument = projectData.projectFiles.find(
        (item) => item.pfID === planoPfID
      );
      docID = oldDocument.id;
      // Si toca actualizar
      const getFilePathRegex = /\/public\/(.+)$/;

      // Eliminar archivo viejo de S3
      const fileToDeleteName = decodeURIComponent(
        oldDocument.url.match(getFilePathRegex)[1]
      );
      try {
        await Storage.remove(fileToDeleteName);
      } catch (error) {
        console.error("Error removing the file:", error);
      }

      //  Cargar archivo nuevo a S3
      try {
        const uploadImageResult = await Storage.put(urlPath, fileToSave, {
          level: "public",
          contentType: "*/*",
        });

        console.log("Archivo seleccionado:", fileToSave);
        console.log("Archivo subido:", uploadImageResult);
      } catch (error) {
        notify({
          msg:
            "Ups!, parece que algo ha fallado al intentar subir el archivo" +
            error,
          type: "error",
        });
        return;
      }

      // Actualizar base de datos (Product Feature y Documento)
      const updatedProductFeature = {
        id: oldDocument.pfID,
        value: fileToSave.name,
      };
      console.log("updatedProductFeature:", updatedProductFeature);
      await API.graphql(
        graphqlOperation(updateProductFeature, { input: updatedProductFeature })
      );

      const updatedDocument = {
        id: oldDocument.id,
        timeStamp: Date.now(),
        status: "pending",
        isApproved: false,
        isUploadedToBlockChain: false,
        url: WebAppConfig.url_s3_public_images + urlPath,
      };

      await API.graphql(
        graphqlOperation(updateDocument, { input: updatedDocument })
      );
    } else {
      // Crear pf y document
      try {
        const uploadImageResult = await Storage.put(urlPath, fileToSave, {
          level: "public",
          contentType: "*/*",
        });

        console.log("Archivo seleccionado:", fileToSave);
        console.log("Archivo subido:", uploadImageResult);
      } catch (error) {
        notify({
          msg: "Ups!, parece que algo ha fallado al intentar subir el archivo",
          type: "error",
        });
        return;
      }

      const newProductFeature = {
        featureID: "C_plano_predio",
        productID: projectData.projectInfo.id,
        value: fileToSave.name,
      };
      console.log("newProductFeature:", newProductFeature);
      const createProductFeatureResponse = await API.graphql(
        graphqlOperation(createProductFeature, { input: newProductFeature })
      );

      setPlanoPfID(createProductFeatureResponse.data.createProductFeature.id);
      pfID = createProductFeatureResponse.data.createProductFeature.id

      const newDocument = {
        productFeatureID:
          createProductFeatureResponse.data.createProductFeature.id,
        userID: user.id,
        timeStamp: Date.now(),
        status: "pending",
        isApproved: false,
        isUploadedToBlockChain: false,
        url: WebAppConfig.url_s3_public_images + urlPath,
      };

      const createDocumentResponse = await API.graphql(
        graphqlOperation(createDocument, { input: newDocument })
      );

      docID = createDocumentResponse.data.createDocument.id;
    }
    setPlanoURL(WebAppConfig.url_s3_public_images + urlPath);

    const updatedProjectData = await fetchProjectDataByProjectID(
      projectData.projectInfo.id
    );

    const mappedDocument = updatedProjectData.projectFiles.find(
      (item) => item.pfID === pfID
    );

    await handleUpdateContextProjectFile(docID, mappedDocument);
    notify({
      msg: "Archivo subido correctamente.",
      type: "success",
    });
  };

  const handleChangeInputValue = async (e) => {
    const { name, value, files } = e.target;
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
    if (name === "projectInfoLocationFile") {
      const fileToSave = files[0];
      if (fileToSave) {
        setPlanoURL(null)
        await saveFileOnDB(fileToSave);
        setProgressChange(true)
      }
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
      if (areaPfID) {
        const updatedProductFeature = {
          id: areaPfID,
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

        const response = await API.graphql(
          graphqlOperation(createProductFeature, {
            input: newProductFeature,
          })
        );
        setAreaPfID(response.data.createProductFeature.id);
      }
      handleUpdateContextProjectInfo({ area: formData.projectInfoArea });
    }

    if (toSave === "projectInfoLocationVereda") {
      if (veredaPfID) {
        const updatedProductFeature = {
          id: veredaPfID,
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

        const response = await API.graphql(
          graphqlOperation(createProductFeature, {
            input: newProductFeature,
          })
        );
        setVeredaPfID(response.data.createProductFeature.id);
      }
      handleUpdateContextProjectInfoLocation({
        vereda: formData.projectInfoLocationVereda,
      });
    }

    if (toSave === "projectInfoLocationMunicipio") {
      if (municipioPfID) {
        const updatedProductFeature = {
          id: municipioPfID,
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

        const response = await API.graphql(
          graphqlOperation(createProductFeature, {
            input: newProductFeature,
          })
        );
        setMunicipioPfID(response.data.createProductFeature.id);
      }
      handleUpdateContextProjectInfoLocation({
        municipio: formData.projectInfoLocationMunicipio,
      });
    }

    if (toSave === "projectInfoLocationMatricula") {
      if (matriculaPfID) {
        const updatedProductFeature = {
          id: matriculaPfID,
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

        const response = await API.graphql(
          graphqlOperation(createProductFeature, {
            input: newProductFeature,
          })
        );
        setMatriculaPfID(response.data.createProductFeature.id);
      }
      handleUpdateContextProjectInfoLocation({
        matricula: formData.projectInfoLocationMatricula,
      });
    }

    if (toSave === "projectInfoLocationFichaCatrastral") {
      if (fichaPfID) {
        const updatedProductFeature = {
          id: fichaPfID,
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

        const response = await API.graphql(
          graphqlOperation(createProductFeature, {
            input: newProductFeature,
          })
        );
        setFichaPfID(response.data.createProductFeature.id);
      }
      handleUpdateContextProjectInfoLocation({
        fichaCatrastal: formData.projectInfoLocationFichaCatrastral,
      });
    }
    setProgressChange(true)

    notify({ msg: "Información actualizada", type: "success" });
  };

  return (
    <Card className={className}>
      <Card.Header title="Información del proyecto" sep={true} tooltip={tooltip}/>
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
              optionList={categoryList.map((category) => {
                return {
                  label: category,
                  value: category,
                };
              })}
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
              <div>
                <Form.Group className="mb-3">
                  <div className="row align-items-center">
                    <Form.Label column sm="5">
                      Cargue un plano del predio (puede ser a mano alzada)
                    </Form.Label>
                    <div className="col">
                      {planoURL ? (
                        <a href={planoURL} target="_blank" rel="noreferrer">
                          Ver Archivo
                        </a>
                      ): "No se ha subido plano de predio"}
                      <input
                        type="file"
                        disabled={!autorizedUser}
                        ref={fileInputRef}
                        name="projectInfoLocationFile"
                        onChange={(e) => handleChangeInputValue(e)}
                        hidden={!autorizedUser}
                      />
                      {/* <Button
                        disabled={!autorizedUser}
                        className="ms-3"
                        onClick={handleUploadButton}
                        size="md"
                      >
                        {planoPfID ? "Actualizar" : "Cargar"}
                      </Button> */}
                    </div>
                  </div>
                </Form.Group>
              </div>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
