/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Button,
  Flex,
  Grid,
  SwitchField,
  TextAreaField,
  TextField,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { API } from "aws-amplify";
import { getAnalisis } from "../graphql/queries";
import { updateAnalisis } from "../graphql/mutations";
export default function AnalisisUpdateForm(props) {
  const {
    id: idProp,
    analisis: analisisModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    imgAnteriorNombreImg: "",
    imgAnteriorSatellite: "",
    imgAnteriorYear: "",
    imgAnteriorMesInicial: "",
    imgAnteriorMesFinal: "",
    imgAnteriorNubosidadMaxima: "",
    imgAnteriorBandas: "",
    imgPosteriorNombreImg: "",
    imgPosteriorSatellite: "",
    imgPosteriorYear: "",
    imgPosteriorMesInicial: "",
    imgPosteriorMesFinal: "",
    imgPosteriorNubosidadMaxima: "",
    imgPosteriorBandas: "",
    resultados: "",
    ajustado: false,
  };
  const [imgAnteriorNombreImg, setImgAnteriorNombreImg] = React.useState(
    initialValues.imgAnteriorNombreImg
  );
  const [imgAnteriorSatellite, setImgAnteriorSatellite] = React.useState(
    initialValues.imgAnteriorSatellite
  );
  const [imgAnteriorYear, setImgAnteriorYear] = React.useState(
    initialValues.imgAnteriorYear
  );
  const [imgAnteriorMesInicial, setImgAnteriorMesInicial] = React.useState(
    initialValues.imgAnteriorMesInicial
  );
  const [imgAnteriorMesFinal, setImgAnteriorMesFinal] = React.useState(
    initialValues.imgAnteriorMesFinal
  );
  const [imgAnteriorNubosidadMaxima, setImgAnteriorNubosidadMaxima] =
    React.useState(initialValues.imgAnteriorNubosidadMaxima);
  const [imgAnteriorBandas, setImgAnteriorBandas] = React.useState(
    initialValues.imgAnteriorBandas
  );
  const [imgPosteriorNombreImg, setImgPosteriorNombreImg] = React.useState(
    initialValues.imgPosteriorNombreImg
  );
  const [imgPosteriorSatellite, setImgPosteriorSatellite] = React.useState(
    initialValues.imgPosteriorSatellite
  );
  const [imgPosteriorYear, setImgPosteriorYear] = React.useState(
    initialValues.imgPosteriorYear
  );
  const [imgPosteriorMesInicial, setImgPosteriorMesInicial] = React.useState(
    initialValues.imgPosteriorMesInicial
  );
  const [imgPosteriorMesFinal, setImgPosteriorMesFinal] = React.useState(
    initialValues.imgPosteriorMesFinal
  );
  const [imgPosteriorNubosidadMaxima, setImgPosteriorNubosidadMaxima] =
    React.useState(initialValues.imgPosteriorNubosidadMaxima);
  const [imgPosteriorBandas, setImgPosteriorBandas] = React.useState(
    initialValues.imgPosteriorBandas
  );
  const [resultados, setResultados] = React.useState(initialValues.resultados);
  const [ajustado, setAjustado] = React.useState(initialValues.ajustado);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = analisisRecord
      ? { ...initialValues, ...analisisRecord }
      : initialValues;
    setImgAnteriorNombreImg(cleanValues.imgAnteriorNombreImg);
    setImgAnteriorSatellite(cleanValues.imgAnteriorSatellite);
    setImgAnteriorYear(cleanValues.imgAnteriorYear);
    setImgAnteriorMesInicial(cleanValues.imgAnteriorMesInicial);
    setImgAnteriorMesFinal(cleanValues.imgAnteriorMesFinal);
    setImgAnteriorNubosidadMaxima(cleanValues.imgAnteriorNubosidadMaxima);
    setImgAnteriorBandas(cleanValues.imgAnteriorBandas);
    setImgPosteriorNombreImg(cleanValues.imgPosteriorNombreImg);
    setImgPosteriorSatellite(cleanValues.imgPosteriorSatellite);
    setImgPosteriorYear(cleanValues.imgPosteriorYear);
    setImgPosteriorMesInicial(cleanValues.imgPosteriorMesInicial);
    setImgPosteriorMesFinal(cleanValues.imgPosteriorMesFinal);
    setImgPosteriorNubosidadMaxima(cleanValues.imgPosteriorNubosidadMaxima);
    setImgPosteriorBandas(cleanValues.imgPosteriorBandas);
    setResultados(
      typeof cleanValues.resultados === "string" ||
        cleanValues.resultados === null
        ? cleanValues.resultados
        : JSON.stringify(cleanValues.resultados)
    );
    setAjustado(cleanValues.ajustado);
    setErrors({});
  };
  const [analisisRecord, setAnalisisRecord] = React.useState(analisisModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await API.graphql({
              query: getAnalisis.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getAnalisis
        : analisisModelProp;
      setAnalisisRecord(record);
    };
    queryData();
  }, [idProp, analisisModelProp]);
  React.useEffect(resetStateValues, [analisisRecord]);
  const validations = {
    imgAnteriorNombreImg: [],
    imgAnteriorSatellite: [],
    imgAnteriorYear: [],
    imgAnteriorMesInicial: [],
    imgAnteriorMesFinal: [],
    imgAnteriorNubosidadMaxima: [],
    imgAnteriorBandas: [],
    imgPosteriorNombreImg: [],
    imgPosteriorSatellite: [],
    imgPosteriorYear: [],
    imgPosteriorMesInicial: [],
    imgPosteriorMesFinal: [],
    imgPosteriorNubosidadMaxima: [],
    imgPosteriorBandas: [],
    resultados: [{ type: "JSON" }],
    ajustado: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          imgAnteriorNombreImg: imgAnteriorNombreImg ?? null,
          imgAnteriorSatellite: imgAnteriorSatellite ?? null,
          imgAnteriorYear: imgAnteriorYear ?? null,
          imgAnteriorMesInicial: imgAnteriorMesInicial ?? null,
          imgAnteriorMesFinal: imgAnteriorMesFinal ?? null,
          imgAnteriorNubosidadMaxima: imgAnteriorNubosidadMaxima ?? null,
          imgAnteriorBandas: imgAnteriorBandas ?? null,
          imgPosteriorNombreImg: imgPosteriorNombreImg ?? null,
          imgPosteriorSatellite: imgPosteriorSatellite ?? null,
          imgPosteriorYear: imgPosteriorYear ?? null,
          imgPosteriorMesInicial: imgPosteriorMesInicial ?? null,
          imgPosteriorMesFinal: imgPosteriorMesFinal ?? null,
          imgPosteriorNubosidadMaxima: imgPosteriorNubosidadMaxima ?? null,
          imgPosteriorBandas: imgPosteriorBandas ?? null,
          resultados: resultados ?? null,
          ajustado: ajustado ?? null,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await API.graphql({
            query: updateAnalisis.replaceAll("__typename", ""),
            variables: {
              input: {
                id: analisisRecord.id,
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "AnalisisUpdateForm")}
      {...rest}
    >
      <TextField
        label="Img anterior nombre img"
        isRequired={false}
        isReadOnly={false}
        value={imgAnteriorNombreImg}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              imgAnteriorNombreImg: value,
              imgAnteriorSatellite,
              imgAnteriorYear,
              imgAnteriorMesInicial,
              imgAnteriorMesFinal,
              imgAnteriorNubosidadMaxima,
              imgAnteriorBandas,
              imgPosteriorNombreImg,
              imgPosteriorSatellite,
              imgPosteriorYear,
              imgPosteriorMesInicial,
              imgPosteriorMesFinal,
              imgPosteriorNubosidadMaxima,
              imgPosteriorBandas,
              resultados,
              ajustado,
            };
            const result = onChange(modelFields);
            value = result?.imgAnteriorNombreImg ?? value;
          }
          if (errors.imgAnteriorNombreImg?.hasError) {
            runValidationTasks("imgAnteriorNombreImg", value);
          }
          setImgAnteriorNombreImg(value);
        }}
        onBlur={() =>
          runValidationTasks("imgAnteriorNombreImg", imgAnteriorNombreImg)
        }
        errorMessage={errors.imgAnteriorNombreImg?.errorMessage}
        hasError={errors.imgAnteriorNombreImg?.hasError}
        {...getOverrideProps(overrides, "imgAnteriorNombreImg")}
      ></TextField>
      <TextField
        label="Img anterior satellite"
        isRequired={false}
        isReadOnly={false}
        value={imgAnteriorSatellite}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              imgAnteriorNombreImg,
              imgAnteriorSatellite: value,
              imgAnteriorYear,
              imgAnteriorMesInicial,
              imgAnteriorMesFinal,
              imgAnteriorNubosidadMaxima,
              imgAnteriorBandas,
              imgPosteriorNombreImg,
              imgPosteriorSatellite,
              imgPosteriorYear,
              imgPosteriorMesInicial,
              imgPosteriorMesFinal,
              imgPosteriorNubosidadMaxima,
              imgPosteriorBandas,
              resultados,
              ajustado,
            };
            const result = onChange(modelFields);
            value = result?.imgAnteriorSatellite ?? value;
          }
          if (errors.imgAnteriorSatellite?.hasError) {
            runValidationTasks("imgAnteriorSatellite", value);
          }
          setImgAnteriorSatellite(value);
        }}
        onBlur={() =>
          runValidationTasks("imgAnteriorSatellite", imgAnteriorSatellite)
        }
        errorMessage={errors.imgAnteriorSatellite?.errorMessage}
        hasError={errors.imgAnteriorSatellite?.hasError}
        {...getOverrideProps(overrides, "imgAnteriorSatellite")}
      ></TextField>
      <TextField
        label="Img anterior year"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={imgAnteriorYear}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              imgAnteriorNombreImg,
              imgAnteriorSatellite,
              imgAnteriorYear: value,
              imgAnteriorMesInicial,
              imgAnteriorMesFinal,
              imgAnteriorNubosidadMaxima,
              imgAnteriorBandas,
              imgPosteriorNombreImg,
              imgPosteriorSatellite,
              imgPosteriorYear,
              imgPosteriorMesInicial,
              imgPosteriorMesFinal,
              imgPosteriorNubosidadMaxima,
              imgPosteriorBandas,
              resultados,
              ajustado,
            };
            const result = onChange(modelFields);
            value = result?.imgAnteriorYear ?? value;
          }
          if (errors.imgAnteriorYear?.hasError) {
            runValidationTasks("imgAnteriorYear", value);
          }
          setImgAnteriorYear(value);
        }}
        onBlur={() => runValidationTasks("imgAnteriorYear", imgAnteriorYear)}
        errorMessage={errors.imgAnteriorYear?.errorMessage}
        hasError={errors.imgAnteriorYear?.hasError}
        {...getOverrideProps(overrides, "imgAnteriorYear")}
      ></TextField>
      <TextField
        label="Img anterior mes inicial"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={imgAnteriorMesInicial}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              imgAnteriorNombreImg,
              imgAnteriorSatellite,
              imgAnteriorYear,
              imgAnteriorMesInicial: value,
              imgAnteriorMesFinal,
              imgAnteriorNubosidadMaxima,
              imgAnteriorBandas,
              imgPosteriorNombreImg,
              imgPosteriorSatellite,
              imgPosteriorYear,
              imgPosteriorMesInicial,
              imgPosteriorMesFinal,
              imgPosteriorNubosidadMaxima,
              imgPosteriorBandas,
              resultados,
              ajustado,
            };
            const result = onChange(modelFields);
            value = result?.imgAnteriorMesInicial ?? value;
          }
          if (errors.imgAnteriorMesInicial?.hasError) {
            runValidationTasks("imgAnteriorMesInicial", value);
          }
          setImgAnteriorMesInicial(value);
        }}
        onBlur={() =>
          runValidationTasks("imgAnteriorMesInicial", imgAnteriorMesInicial)
        }
        errorMessage={errors.imgAnteriorMesInicial?.errorMessage}
        hasError={errors.imgAnteriorMesInicial?.hasError}
        {...getOverrideProps(overrides, "imgAnteriorMesInicial")}
      ></TextField>
      <TextField
        label="Img anterior mes final"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={imgAnteriorMesFinal}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              imgAnteriorNombreImg,
              imgAnteriorSatellite,
              imgAnteriorYear,
              imgAnteriorMesInicial,
              imgAnteriorMesFinal: value,
              imgAnteriorNubosidadMaxima,
              imgAnteriorBandas,
              imgPosteriorNombreImg,
              imgPosteriorSatellite,
              imgPosteriorYear,
              imgPosteriorMesInicial,
              imgPosteriorMesFinal,
              imgPosteriorNubosidadMaxima,
              imgPosteriorBandas,
              resultados,
              ajustado,
            };
            const result = onChange(modelFields);
            value = result?.imgAnteriorMesFinal ?? value;
          }
          if (errors.imgAnteriorMesFinal?.hasError) {
            runValidationTasks("imgAnteriorMesFinal", value);
          }
          setImgAnteriorMesFinal(value);
        }}
        onBlur={() =>
          runValidationTasks("imgAnteriorMesFinal", imgAnteriorMesFinal)
        }
        errorMessage={errors.imgAnteriorMesFinal?.errorMessage}
        hasError={errors.imgAnteriorMesFinal?.hasError}
        {...getOverrideProps(overrides, "imgAnteriorMesFinal")}
      ></TextField>
      <TextField
        label="Img anterior nubosidad maxima"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={imgAnteriorNubosidadMaxima}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              imgAnteriorNombreImg,
              imgAnteriorSatellite,
              imgAnteriorYear,
              imgAnteriorMesInicial,
              imgAnteriorMesFinal,
              imgAnteriorNubosidadMaxima: value,
              imgAnteriorBandas,
              imgPosteriorNombreImg,
              imgPosteriorSatellite,
              imgPosteriorYear,
              imgPosteriorMesInicial,
              imgPosteriorMesFinal,
              imgPosteriorNubosidadMaxima,
              imgPosteriorBandas,
              resultados,
              ajustado,
            };
            const result = onChange(modelFields);
            value = result?.imgAnteriorNubosidadMaxima ?? value;
          }
          if (errors.imgAnteriorNubosidadMaxima?.hasError) {
            runValidationTasks("imgAnteriorNubosidadMaxima", value);
          }
          setImgAnteriorNubosidadMaxima(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "imgAnteriorNubosidadMaxima",
            imgAnteriorNubosidadMaxima
          )
        }
        errorMessage={errors.imgAnteriorNubosidadMaxima?.errorMessage}
        hasError={errors.imgAnteriorNubosidadMaxima?.hasError}
        {...getOverrideProps(overrides, "imgAnteriorNubosidadMaxima")}
      ></TextField>
      <TextField
        label="Img anterior bandas"
        isRequired={false}
        isReadOnly={false}
        value={imgAnteriorBandas}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              imgAnteriorNombreImg,
              imgAnteriorSatellite,
              imgAnteriorYear,
              imgAnteriorMesInicial,
              imgAnteriorMesFinal,
              imgAnteriorNubosidadMaxima,
              imgAnteriorBandas: value,
              imgPosteriorNombreImg,
              imgPosteriorSatellite,
              imgPosteriorYear,
              imgPosteriorMesInicial,
              imgPosteriorMesFinal,
              imgPosteriorNubosidadMaxima,
              imgPosteriorBandas,
              resultados,
              ajustado,
            };
            const result = onChange(modelFields);
            value = result?.imgAnteriorBandas ?? value;
          }
          if (errors.imgAnteriorBandas?.hasError) {
            runValidationTasks("imgAnteriorBandas", value);
          }
          setImgAnteriorBandas(value);
        }}
        onBlur={() =>
          runValidationTasks("imgAnteriorBandas", imgAnteriorBandas)
        }
        errorMessage={errors.imgAnteriorBandas?.errorMessage}
        hasError={errors.imgAnteriorBandas?.hasError}
        {...getOverrideProps(overrides, "imgAnteriorBandas")}
      ></TextField>
      <TextField
        label="Img posterior nombre img"
        isRequired={false}
        isReadOnly={false}
        value={imgPosteriorNombreImg}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              imgAnteriorNombreImg,
              imgAnteriorSatellite,
              imgAnteriorYear,
              imgAnteriorMesInicial,
              imgAnteriorMesFinal,
              imgAnteriorNubosidadMaxima,
              imgAnteriorBandas,
              imgPosteriorNombreImg: value,
              imgPosteriorSatellite,
              imgPosteriorYear,
              imgPosteriorMesInicial,
              imgPosteriorMesFinal,
              imgPosteriorNubosidadMaxima,
              imgPosteriorBandas,
              resultados,
              ajustado,
            };
            const result = onChange(modelFields);
            value = result?.imgPosteriorNombreImg ?? value;
          }
          if (errors.imgPosteriorNombreImg?.hasError) {
            runValidationTasks("imgPosteriorNombreImg", value);
          }
          setImgPosteriorNombreImg(value);
        }}
        onBlur={() =>
          runValidationTasks("imgPosteriorNombreImg", imgPosteriorNombreImg)
        }
        errorMessage={errors.imgPosteriorNombreImg?.errorMessage}
        hasError={errors.imgPosteriorNombreImg?.hasError}
        {...getOverrideProps(overrides, "imgPosteriorNombreImg")}
      ></TextField>
      <TextField
        label="Img posterior satellite"
        isRequired={false}
        isReadOnly={false}
        value={imgPosteriorSatellite}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              imgAnteriorNombreImg,
              imgAnteriorSatellite,
              imgAnteriorYear,
              imgAnteriorMesInicial,
              imgAnteriorMesFinal,
              imgAnteriorNubosidadMaxima,
              imgAnteriorBandas,
              imgPosteriorNombreImg,
              imgPosteriorSatellite: value,
              imgPosteriorYear,
              imgPosteriorMesInicial,
              imgPosteriorMesFinal,
              imgPosteriorNubosidadMaxima,
              imgPosteriorBandas,
              resultados,
              ajustado,
            };
            const result = onChange(modelFields);
            value = result?.imgPosteriorSatellite ?? value;
          }
          if (errors.imgPosteriorSatellite?.hasError) {
            runValidationTasks("imgPosteriorSatellite", value);
          }
          setImgPosteriorSatellite(value);
        }}
        onBlur={() =>
          runValidationTasks("imgPosteriorSatellite", imgPosteriorSatellite)
        }
        errorMessage={errors.imgPosteriorSatellite?.errorMessage}
        hasError={errors.imgPosteriorSatellite?.hasError}
        {...getOverrideProps(overrides, "imgPosteriorSatellite")}
      ></TextField>
      <TextField
        label="Img posterior year"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={imgPosteriorYear}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              imgAnteriorNombreImg,
              imgAnteriorSatellite,
              imgAnteriorYear,
              imgAnteriorMesInicial,
              imgAnteriorMesFinal,
              imgAnteriorNubosidadMaxima,
              imgAnteriorBandas,
              imgPosteriorNombreImg,
              imgPosteriorSatellite,
              imgPosteriorYear: value,
              imgPosteriorMesInicial,
              imgPosteriorMesFinal,
              imgPosteriorNubosidadMaxima,
              imgPosteriorBandas,
              resultados,
              ajustado,
            };
            const result = onChange(modelFields);
            value = result?.imgPosteriorYear ?? value;
          }
          if (errors.imgPosteriorYear?.hasError) {
            runValidationTasks("imgPosteriorYear", value);
          }
          setImgPosteriorYear(value);
        }}
        onBlur={() => runValidationTasks("imgPosteriorYear", imgPosteriorYear)}
        errorMessage={errors.imgPosteriorYear?.errorMessage}
        hasError={errors.imgPosteriorYear?.hasError}
        {...getOverrideProps(overrides, "imgPosteriorYear")}
      ></TextField>
      <TextField
        label="Img posterior mes inicial"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={imgPosteriorMesInicial}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              imgAnteriorNombreImg,
              imgAnteriorSatellite,
              imgAnteriorYear,
              imgAnteriorMesInicial,
              imgAnteriorMesFinal,
              imgAnteriorNubosidadMaxima,
              imgAnteriorBandas,
              imgPosteriorNombreImg,
              imgPosteriorSatellite,
              imgPosteriorYear,
              imgPosteriorMesInicial: value,
              imgPosteriorMesFinal,
              imgPosteriorNubosidadMaxima,
              imgPosteriorBandas,
              resultados,
              ajustado,
            };
            const result = onChange(modelFields);
            value = result?.imgPosteriorMesInicial ?? value;
          }
          if (errors.imgPosteriorMesInicial?.hasError) {
            runValidationTasks("imgPosteriorMesInicial", value);
          }
          setImgPosteriorMesInicial(value);
        }}
        onBlur={() =>
          runValidationTasks("imgPosteriorMesInicial", imgPosteriorMesInicial)
        }
        errorMessage={errors.imgPosteriorMesInicial?.errorMessage}
        hasError={errors.imgPosteriorMesInicial?.hasError}
        {...getOverrideProps(overrides, "imgPosteriorMesInicial")}
      ></TextField>
      <TextField
        label="Img posterior mes final"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={imgPosteriorMesFinal}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              imgAnteriorNombreImg,
              imgAnteriorSatellite,
              imgAnteriorYear,
              imgAnteriorMesInicial,
              imgAnteriorMesFinal,
              imgAnteriorNubosidadMaxima,
              imgAnteriorBandas,
              imgPosteriorNombreImg,
              imgPosteriorSatellite,
              imgPosteriorYear,
              imgPosteriorMesInicial,
              imgPosteriorMesFinal: value,
              imgPosteriorNubosidadMaxima,
              imgPosteriorBandas,
              resultados,
              ajustado,
            };
            const result = onChange(modelFields);
            value = result?.imgPosteriorMesFinal ?? value;
          }
          if (errors.imgPosteriorMesFinal?.hasError) {
            runValidationTasks("imgPosteriorMesFinal", value);
          }
          setImgPosteriorMesFinal(value);
        }}
        onBlur={() =>
          runValidationTasks("imgPosteriorMesFinal", imgPosteriorMesFinal)
        }
        errorMessage={errors.imgPosteriorMesFinal?.errorMessage}
        hasError={errors.imgPosteriorMesFinal?.hasError}
        {...getOverrideProps(overrides, "imgPosteriorMesFinal")}
      ></TextField>
      <TextField
        label="Img posterior nubosidad maxima"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={imgPosteriorNubosidadMaxima}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              imgAnteriorNombreImg,
              imgAnteriorSatellite,
              imgAnteriorYear,
              imgAnteriorMesInicial,
              imgAnteriorMesFinal,
              imgAnteriorNubosidadMaxima,
              imgAnteriorBandas,
              imgPosteriorNombreImg,
              imgPosteriorSatellite,
              imgPosteriorYear,
              imgPosteriorMesInicial,
              imgPosteriorMesFinal,
              imgPosteriorNubosidadMaxima: value,
              imgPosteriorBandas,
              resultados,
              ajustado,
            };
            const result = onChange(modelFields);
            value = result?.imgPosteriorNubosidadMaxima ?? value;
          }
          if (errors.imgPosteriorNubosidadMaxima?.hasError) {
            runValidationTasks("imgPosteriorNubosidadMaxima", value);
          }
          setImgPosteriorNubosidadMaxima(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "imgPosteriorNubosidadMaxima",
            imgPosteriorNubosidadMaxima
          )
        }
        errorMessage={errors.imgPosteriorNubosidadMaxima?.errorMessage}
        hasError={errors.imgPosteriorNubosidadMaxima?.hasError}
        {...getOverrideProps(overrides, "imgPosteriorNubosidadMaxima")}
      ></TextField>
      <TextField
        label="Img posterior bandas"
        isRequired={false}
        isReadOnly={false}
        value={imgPosteriorBandas}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              imgAnteriorNombreImg,
              imgAnteriorSatellite,
              imgAnteriorYear,
              imgAnteriorMesInicial,
              imgAnteriorMesFinal,
              imgAnteriorNubosidadMaxima,
              imgAnteriorBandas,
              imgPosteriorNombreImg,
              imgPosteriorSatellite,
              imgPosteriorYear,
              imgPosteriorMesInicial,
              imgPosteriorMesFinal,
              imgPosteriorNubosidadMaxima,
              imgPosteriorBandas: value,
              resultados,
              ajustado,
            };
            const result = onChange(modelFields);
            value = result?.imgPosteriorBandas ?? value;
          }
          if (errors.imgPosteriorBandas?.hasError) {
            runValidationTasks("imgPosteriorBandas", value);
          }
          setImgPosteriorBandas(value);
        }}
        onBlur={() =>
          runValidationTasks("imgPosteriorBandas", imgPosteriorBandas)
        }
        errorMessage={errors.imgPosteriorBandas?.errorMessage}
        hasError={errors.imgPosteriorBandas?.hasError}
        {...getOverrideProps(overrides, "imgPosteriorBandas")}
      ></TextField>
      <TextAreaField
        label="Resultados"
        isRequired={false}
        isReadOnly={false}
        value={resultados}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              imgAnteriorNombreImg,
              imgAnteriorSatellite,
              imgAnteriorYear,
              imgAnteriorMesInicial,
              imgAnteriorMesFinal,
              imgAnteriorNubosidadMaxima,
              imgAnteriorBandas,
              imgPosteriorNombreImg,
              imgPosteriorSatellite,
              imgPosteriorYear,
              imgPosteriorMesInicial,
              imgPosteriorMesFinal,
              imgPosteriorNubosidadMaxima,
              imgPosteriorBandas,
              resultados: value,
              ajustado,
            };
            const result = onChange(modelFields);
            value = result?.resultados ?? value;
          }
          if (errors.resultados?.hasError) {
            runValidationTasks("resultados", value);
          }
          setResultados(value);
        }}
        onBlur={() => runValidationTasks("resultados", resultados)}
        errorMessage={errors.resultados?.errorMessage}
        hasError={errors.resultados?.hasError}
        {...getOverrideProps(overrides, "resultados")}
      ></TextAreaField>
      <SwitchField
        label="Ajustado"
        defaultChecked={false}
        isDisabled={false}
        isChecked={ajustado}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              imgAnteriorNombreImg,
              imgAnteriorSatellite,
              imgAnteriorYear,
              imgAnteriorMesInicial,
              imgAnteriorMesFinal,
              imgAnteriorNubosidadMaxima,
              imgAnteriorBandas,
              imgPosteriorNombreImg,
              imgPosteriorSatellite,
              imgPosteriorYear,
              imgPosteriorMesInicial,
              imgPosteriorMesFinal,
              imgPosteriorNubosidadMaxima,
              imgPosteriorBandas,
              resultados,
              ajustado: value,
            };
            const result = onChange(modelFields);
            value = result?.ajustado ?? value;
          }
          if (errors.ajustado?.hasError) {
            runValidationTasks("ajustado", value);
          }
          setAjustado(value);
        }}
        onBlur={() => runValidationTasks("ajustado", ajustado)}
        errorMessage={errors.ajustado?.errorMessage}
        hasError={errors.ajustado?.hasError}
        {...getOverrideProps(overrides, "ajustado")}
      ></SwitchField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || analisisModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || analisisModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
