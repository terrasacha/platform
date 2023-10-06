import NewHeaderNavbar from "components/common/NewHeaderNavbar";
import { useEffect, useState } from "react";
import useXLSXForm from "hooks/useXLSXForm";
import FormGroup from "components/common/FormGroup";
import { Button, Spinner } from "react-bootstrap";
import { API, Storage, graphqlOperation } from "aws-amplify";
import {
  createDocument,
  createProduct,
  createProductFeature,
  createUserProduct,
} from "graphql/mutations";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "context/AuthContext";
import WebAppConfig from "components/common/_conf/WebAppConfig";
import { notify } from "utilities/notify";
import { ToastContainer } from "react-toastify";
import DynamicForm from "components/DynamicForm/DynamicForm";

export default function NewProject() {
  const formURL =
    "https://kiosuanbcrjsappcad3eb2dd1b14457b491c910d5aa45dd145518-dev.s3.amazonaws.com/public/XLSForms/FORMULARIO+POSTULACION+PREDIOS.xlsx";

  const { user } = useAuth();
  const { data } = useXLSXForm(formURL); 
  const [formData, setFormData] = useState({});
  const [formDataErrors, setFormDataErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const mapXLSXFormFieldsToFormData = (fields) => {
      const result = {};

      function addObjectNamesToResult(obj) {
        if (obj.name) {
          result[obj.name] = "";
        }
        if (obj.items && Array.isArray(obj.items)) {
          obj.items.forEach(addObjectNamesToResult);
        }
      }

      fields.forEach(addObjectNamesToResult);

      return result;
    };

    if (data && user) {
      const formDataFields = mapXLSXFormFieldsToFormData(data.survey);
      setFormData(formDataFields);
      setFormData((prevFormData) => ({
        ...prevFormData,
        A_postulante_email: user.email,
      }));
    }
  }, [data, user]);

  console.log(data);
  const fieldComponents = {
    note: ({ label }) => <div className="col-12 col-12-lg">{label}</div>,
    text: ({ name, label, appearance, hint, required }) => {
      const inputType = appearance === "multiline" ? "textarea" : "text";
      let disabled = false;
      if (name === "A_postulante_email") {
        disabled = true;
      }
      return renderFormGroup(
        inputType,
        name,
        label,
        hint,
        required,
        [],
        disabled
      );
    },
    integer: ({ name, label, hint, required }) => {
      return renderFormGroup("number", name, label, hint, required);
    },
    select_one: ({ type, name, label, hint, required }, options) => {
      const listName = type.split(" ")[1];
      const optionList = options[listName].map((option) => ({
        label: option.label,
        value: option.name,
      }));
      return renderFormGroup("radio", name, label, hint, required, optionList);
    },
    select_multiple: ({ type, name, label, hint, required }, options) => {
      const listName = type.split(" ")[1];
      const optionList = options[listName].map((option) => ({
        label: option.label,
        value: option.name,
      }));

      return renderFormGroup(
        "checkbox",
        name,
        label,
        hint,
        required,
        optionList
      );
    },
    file: ({ name, label, hint, required }) => {
      return renderFormGroup("file", name, label, hint, required);
    },
    image: ({ name, label, hint, required }) => {
      return renderFormGroup("file", name, label, hint, required);
    },
    geopoint: ({ name, label, hint, required }) => {
      function onMapClick({ x, y, lat, lng, event }) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: [{ lat, lng }],
        }));
      }

      return (
        <FormGroup
          inputType="geopoint"
          label={label}
          markers={formData[name] || []}
          onMapClick={onMapClick}
        />
      );
    },
    group: ({ label, items }, options) => (
      <div className="col-12 col-12-lg border p-3">
        <div className="row">
          <div className="col-12 col-12-lg">
            <h4>{label}</h4>
          </div>
          {getForm(items, options)}
        </div>
      </div>
    ),
  };

  const renderFormGroup = (
    inputType,
    inputName,
    label,
    hint,
    required,
    optionList = [],
    disabled = false
  ) => {
    return (
      <FormGroup
        disabled={disabled}
        inputType={inputType}
        inputSize="md"
        label={label}
        hint={hint}
        required={required === "yes"}
        inputName={inputName}
        inputValue={formData[inputName] || ""}
        inputError={formDataErrors[inputName] || ""}
        optionCheckedList={formData[inputName] || ""}
        optionList={optionList}
        onChangeInputValue={handleFieldChange}
      />
    );
  };

  function getFieldCondition(relevant) {
    const regex =
      /(?:selected\(\$\{(.*?)\},\s*'([^']+)'\)|\$\{(.*?)\}='([^']+)')/;

    const match = relevant.match(regex);

    if (match) {
      const relevantField = match[1] || match[3];
      const relevantValue = match[2] || match[4];

      return { relevantField, relevantValue };
    }
    return null;
  }

  const getForm = (fields, options) => {
    if (!fields) return null;

    return fields.map((field, index) => {
      let type = field.type;
      if (field.type.includes("select_one")) type = "select_one";
      if (field.type.includes("select_multiple")) type = "select_multiple";
      const fieldComponent = fieldComponents[type];

      const relevant = field.relevant;
      if (relevant) {
        const relevantData = getFieldCondition(relevant);
        if (
          relevantData &&
          !Array.isArray(formData[relevantData.relevantField]) &&
          formData[relevantData.relevantField] !== relevantData.relevantValue
        )
          return null;
        if (
          relevantData &&
          Array.isArray(formData[relevantData.relevantField]) &&
          !formData[relevantData.relevantField].includes(
            relevantData.relevantValue
          )
        )
          return null;
      }

      return fieldComponent ? fieldComponent(field, options) : null;
    });
  };

  const handleFieldChange = (event) => {
    const { name, type, value, checked } = event.target;

    setFormData((prevFormData) => {
      const updatedFormData = { ...prevFormData };

      if (type === "checkbox") {
        if (!Array.isArray(updatedFormData[name])) {
          updatedFormData[name] = [];
        }

        if (checked && !updatedFormData[name].includes(value)) {
          updatedFormData[name].push(value);
        } else if (!checked) {
          updatedFormData[name] = updatedFormData[name].filter(
            (val) => val !== value
          );
        }
      } else if (type === "radio" && checked) {
        updatedFormData[name] = value;
      } else if (type === "file") {
        updatedFormData[name] = event.target.files[0];
      } else {
        updatedFormData[name] = value;
      }

      return updatedFormData;
    });
  };

  const findObjectByName = (objArray, nameToFind) => {
    for (let i = 0; i < objArray.length; i++) {
      const currentObject = objArray[i];
      if (currentObject.name === nameToFind) {
        return currentObject;
      } else if (currentObject.items && Array.isArray(currentObject.items)) {
        const nestedObject = findObjectByName(currentObject.items, nameToFind);
        if (nestedObject) {
          return nestedObject;
        }
      }
    }
    return null;
  };

  const validateFormData = () => {
    const errors = {};
    for (const fieldName in formData) {
      // toDo evaluate constraints too
      const value = formData[fieldName];

      const { required, required_message } = findObjectByName(
        data.survey,
        fieldName
      );
      const isRequired = required === "yes";

      if (isRequired && (value === undefined || value === "")) {
        errors[fieldName] = required_message || "Este campo es requerido";
      }
    }
    return errors;
  };

  const createProductFeatures = async (productID) => {
    const productFeaturesToCreate = [
      "A_postulante_doctype",
      "A_matricula",
      "B_owner_id",
      "D_area",
      "A_postulante_id",
      "A_postulante_email",
      "A_vereda",
      "C_ubicacion",
      "A_ficha_catastral",
      "B_owner_doctype",
      "A_municipio",
      "B_owner",
      "A_postulante_name",
      "E_restriccion_desc",
      "E_resctriccion_other",
      "H_asistance_desc",
      "H_aliados_estrategicos_desc",
      "H_grupo_comunitario_desc",
    ];
    const productFeaturesGroupsToCreate1 = [
      "D_actual_use",
      "D_area_potrero",
      "D_especie_plantaciones1",
      "D_ha_plantaciones1",
      "D_especie_plantaciones2",
      "D_ha_plantaciones2",
      "D_especie_plantaciones3",
      "D_ha_plantaciones3",
      "D_especie_frutales1",
      "D_ha_frutales1",
      "D_especie_frutales2",
      "D_ha_frutales2",
      "D_especie_otros",
      "D_ha_otros",
      "D_replace_use",
      "D_replace_potrero_use",
      "D_replace_ha_potrero_use",
      "D_replace_plantaciones1_use",
      "D_replace_ha_plantaciones1_use",
      "D_replace_plantaciones2_use",
      "D_replace_ha_plantaciones2_use",
      "D_replace_plantaciones3_use",
      "D_replace_ha_plantaciones3_use",
      "D_replace_frutales1_use",
      "D_replace_ha_frutales1_use",
      "D_replace_frutales2_use",
      "D_replace_ha_frutales2_use",
      "D_replace_otros_use",
      "D_replace_ha_otros_use",
    ]; // storage on D_actual_use
    const productFeaturesGroupsToCreate2 = [
      "G_habita_predio",
      "G_Temporal_permanente",
      "G_habita_years",
      "G_viviendas_number",
      "G_familias",
      "G_familias_miembros",
      "G_vias_state",
      "G_distancia_predio_municipal",
      "G_transport_mean",
      "G_caminos_existence",
      "G_risks_erosion_derrumbe",
    ]; // storage on G_habita_predio
    const productFeaturesGroupsToCreate3 = [
      "F_nacimiento_agua",
      "F_nacimiento_agua_quantity",
      "F_agua_concede",
      "F_agua_concede_entity",
      "F_amenazas_defo_desc",
      "F_conservacion_desc",
      "F_especies_fauna",
      "F_especies_mamiferos",
      "F_especies_aves",
      "F_especies_flora",
    ]; // storage on F_nacimiento_agua
    const productFeaturesWithFilesToCreate = [
      "B_owner_certificado",
      "C_plano_predio",
    ];

    // Creación de pf Token Name GLOBAL_TOKEN_NAME
    const newProductFeatureTokenName = {
      featureID: "GLOBAL_TOKEN_NAME",
      productID: productID,
      value: `SUAN-${productID.split("-")[4]}`,
    };
    console.log("newProductFeature:", newProductFeatureTokenName);
    await API.graphql(
      graphqlOperation(createProductFeature, {
        input: newProductFeatureTokenName,
      })
    );

    // Creación de pf normales
    for (let i = 0; i < productFeaturesToCreate.length; i++) {
      const feature = productFeaturesToCreate[i];
      let value;

      if (feature === "C_ubicacion") {
        value =
          formData[feature].length > 0
            ? `${formData[feature][0]?.lat}, ${formData[feature][0]?.lng} 0 0`
            : "";
      } else {
        value = Array.isArray(formData[feature])
          ? formData[feature].join("|")
          : formData[feature];
      }
      if (value !== "" && value.length > 0) {
        const newProductFeature = {
          featureID: feature,
          productID: productID,
          value: value,
        };
        console.log("newProductFeature:", newProductFeature);
        await API.graphql(
          graphqlOperation(createProductFeature, { input: newProductFeature })
        );
      }
    }

    let newProductFeature;

    // Creación de pf con grupos 1
    let values = [];
    for (let i = 0; i < productFeaturesGroupsToCreate1.length; i++) {
      const feature = productFeaturesGroupsToCreate1[i];

      const valueSegment = Array.isArray(formData[feature])
        ? formData[feature].join("|")
        : formData[feature];
      const segment = `{${feature}=${valueSegment}}`;
      valueSegment !== "" && valueSegment.length > 0 && values.push(segment);
    }
    if (values.length > 0) {
      newProductFeature = {
        featureID: "D_actual_use",
        productID: productID,
        value: `[${values.join(", ")}]`,
      };
      console.log("newProductFeature:", newProductFeature);
      await API.graphql(
        graphqlOperation(createProductFeature, { input: newProductFeature })
      );
    }

    // Creación de pf con grupos 2
    values = [];
    for (let i = 0; i < productFeaturesGroupsToCreate2.length; i++) {
      const feature = productFeaturesGroupsToCreate2[i];

      const valueSegment = Array.isArray(formData[feature])
        ? formData[feature].join("|")
        : formData[feature];
      const segment = `{${feature}=${valueSegment}}`;
      valueSegment !== "" && valueSegment.length > 0 && values.push(segment);
    }
    if (values.length > 0) {
      newProductFeature = {
        featureID: "G_habita_predio",
        productID: productID,
        value: `[${values.join(", ")}]`,
      };
      console.log("newProductFeature:", newProductFeature);
      await API.graphql(
        graphqlOperation(createProductFeature, { input: newProductFeature })
      );
    }

    // Creación de pf con grupos 3
    values = [];
    for (let i = 0; i < productFeaturesGroupsToCreate3.length; i++) {
      const feature = productFeaturesGroupsToCreate3[i];

      const valueSegment = Array.isArray(formData[feature])
        ? formData[feature].join("|")
        : formData[feature];
      const segment = `{${feature}=${valueSegment}}`;
      valueSegment !== "" && valueSegment.length > 0 && values.push(segment);
    }
    if (values.length > 0) {
      newProductFeature = {
        featureID: "F_nacimiento_agua",
        productID: productID,
        value: `[${values.join(", ")}]`,
      };
      console.log("newProductFeature:", newProductFeature);
      await API.graphql(
        graphqlOperation(createProductFeature, { input: newProductFeature })
      );
    }

    // Creación de pf con archivos
    for (let i = 0; i < productFeaturesWithFilesToCreate.length; i++) {
      const feature = productFeaturesWithFilesToCreate[i];
      const file = formData[feature];

      const removeAccents = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      };

      const formatFileName = (fileName) => {
        const formattedFilename = fileName
          .toLowerCase()
          .trim()
          .replaceAll(" ", "_");
        const filenameWithoutAccents = removeAccents(formattedFilename);
        return encodeURIComponent(filenameWithoutAccents);
      };

      if (file !== "") {
        const urlPath = `${productID}/${formatFileName(file.name)}`;
        try {
          const uploadImageResult = await Storage.put(urlPath, file, {
            level: "public",
            contentType: "*/*",
          });

          console.log("Archivo seleccionado:", file);
          console.log("Archivo subido:", uploadImageResult);
        } catch (error) {
          console.log("Error al subir el archivo:", error);
        }

        const newProductFeature = {
          featureID: feature,
          productID: productID,
          value: file.name,
        };
        console.log("newProductFeature:", newProductFeature);
        const createProductFeatureResponse = await API.graphql(
          graphqlOperation(createProductFeature, { input: newProductFeature })
        );

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

        await API.graphql(
          graphqlOperation(createDocument, { input: newDocument })
        );
      }
    }
  };

  const handleSubmit = async () => {
    // setIsLoading(true);

    // const errors = validateFormData();
    // setFormDataErrors(errors);

    // const firstErrorField = document.querySelector(
    //   `[name="${Object.keys(errors)[0]}"]`
    // );
    // if (firstErrorField) {
    //   firstErrorField.focus();
    //   console.log("Datos del formulario:", formData);
    //   console.log("Errores:", errors);
    //   notify({
    //     msg: "Hicieron falta algunos campos por completar",
    //     type: "error",
    //   });
    //   setIsLoading(false);
    //   return;
    // }
    // notify({
    //   msg: "El proyecto será cargado, pronto será redirigido",
    //   type: "success",
    // });

    const productID = uuidv4();
    // Subir datos a la base de datos con API de graphql
    const newProduct = {
      id: productID,
      name: formData["A_asset_names"],
      description: formData["A_description"],
      isActive: false,
      status: "Prefactibilidad",
      categoryID: formData["A_category"],
      order: 0,
    };
    console.log("newProduct:", newProduct);
    await API.graphql(graphqlOperation(createProduct, { input: newProduct }));

    // const newUserProduct = {
    //   productID: productID,
    //   userID: user.id,
    // };
    // console.log("newUserProduct:", newUserProduct);
    // await API.graphql(
    //   graphqlOperation(createUserProduct, { input: newUserProduct })
    // );

    await createProductFeatures(productID);

    // setIsLoading(false);

    return (window.location.href = `/project/${productID}`);
  };

  return (
    <div className="container-sm">
      <div className="mb-5">
        <NewHeaderNavbar></NewHeaderNavbar>
      </div>
      <div className="my-2">-</div>
      <section className="mb-5">
        <h2>Creación de un nuevo proyecto</h2>
        <p>
          Para crear un proyecto en nuestra plataforma, es necesario que
          completes el siguiente formulario. Es importante que ingreses toda la
          información requerida de manera precisa y detallada para que podamos
          evaluar tu solicitud.
        </p>
        <p>
          Una vez que hayas completado el formulario, nuestro equipo revisará la
          información proporcionada y te informaremos si tu proyecto ha sido
          aprobado o no. Si es aprobado, el equipo de Suan te enviará un
          contrato en el que se te especificará como continuar el proceso.
        </p>
      </section>
      <DynamicForm
        XLSFormURL={formURL}
        formData={formData}
        setFormData={setFormData}
        formDataErrors={formDataErrors}
        setFormDataErrors={setFormDataErrors}
        handleSubmit={handleSubmit}
        submitBtnLabel="Postular este proyecto"
      />
      {/* <form onSubmit={handleSubmit}>
        <div className="row row-cols-1 border p-2 g-2">
          {data && getForm(data.survey, data.options)}
        </div>
        <div className="d-flex justify-content-center my-5">
          <Button type="submit">
            {isLoading ? (
              <Spinner size="sm" className="p-2"></Spinner>
            ) : (
              "Postular este proyecto"
            )}
          </Button>
        </div>
      </form> 
      <ToastContainer></ToastContainer>*/}
    </div>
  );
}
