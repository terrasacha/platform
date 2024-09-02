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
import { createApiQuery } from "../graphql/mutations";
export default function ApiQueryCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    cedulaCatastral: "",
    imgAnteriorSatellite: "",
    imgAnteriorYear: "",
    imgAnteriorMesInicial: "",
    imgAnteriorMesFinal: "",
    imgAnteriorNubosidadMaxima: "",
    imgPosteriorSatellite: "",
    imgPosteriorYear: "",
    imgPosteriorMesInicial: "",
    imgPosteriorMesFinal: "",
    imgPosteriorNubosidadMaxima: "",
    fechaHoraConsulta: "",
    fechaHoraActualizacion: "",
    verificado: false,
    rawConsulta: "",
    resultadoConsulta: "",
  };
  const [cedulaCatastral, setCedulaCatastral] = React.useState(
    initialValues.cedulaCatastral
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
  const [fechaHoraConsulta, setFechaHoraConsulta] = React.useState(
    initialValues.fechaHoraConsulta
  );
  const [fechaHoraActualizacion, setFechaHoraActualizacion] = React.useState(
    initialValues.fechaHoraActualizacion
  );
  const [verificado, setVerificado] = React.useState(initialValues.verificado);
  const [rawConsulta, setRawConsulta] = React.useState(
    initialValues.rawConsulta
  );
  const [resultadoConsulta, setResultadoConsulta] = React.useState(
    initialValues.resultadoConsulta
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setCedulaCatastral(initialValues.cedulaCatastral);
    setImgAnteriorSatellite(initialValues.imgAnteriorSatellite);
    setImgAnteriorYear(initialValues.imgAnteriorYear);
    setImgAnteriorMesInicial(initialValues.imgAnteriorMesInicial);
    setImgAnteriorMesFinal(initialValues.imgAnteriorMesFinal);
    setImgAnteriorNubosidadMaxima(initialValues.imgAnteriorNubosidadMaxima);
    setImgPosteriorSatellite(initialValues.imgPosteriorSatellite);
    setImgPosteriorYear(initialValues.imgPosteriorYear);
    setImgPosteriorMesInicial(initialValues.imgPosteriorMesInicial);
    setImgPosteriorMesFinal(initialValues.imgPosteriorMesFinal);
    setImgPosteriorNubosidadMaxima(initialValues.imgPosteriorNubosidadMaxima);
    setFechaHoraConsulta(initialValues.fechaHoraConsulta);
    setFechaHoraActualizacion(initialValues.fechaHoraActualizacion);
    setVerificado(initialValues.verificado);
    setRawConsulta(initialValues.rawConsulta);
    setResultadoConsulta(initialValues.resultadoConsulta);
    setErrors({});
  };
  const validations = {
    cedulaCatastral: [],
    imgAnteriorSatellite: [{ type: "Required" }],
    imgAnteriorYear: [{ type: "Required" }],
    imgAnteriorMesInicial: [{ type: "Required" }],
    imgAnteriorMesFinal: [{ type: "Required" }],
    imgAnteriorNubosidadMaxima: [{ type: "Required" }],
    imgPosteriorSatellite: [{ type: "Required" }],
    imgPosteriorYear: [{ type: "Required" }],
    imgPosteriorMesInicial: [{ type: "Required" }],
    imgPosteriorMesFinal: [{ type: "Required" }],
    imgPosteriorNubosidadMaxima: [{ type: "Required" }],
    fechaHoraConsulta: [],
    fechaHoraActualizacion: [],
    verificado: [{ type: "Required" }],
    rawConsulta: [{ type: "JSON" }],
    resultadoConsulta: [{ type: "JSON" }],
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
  const convertTimeStampToDate = (ts) => {
    if (Math.abs(Date.now() - ts) < Math.abs(Date.now() - ts * 1000)) {
      return new Date(ts);
    }
    return new Date(ts * 1000);
  };
  const convertToLocal = (date) => {
    const df = new Intl.DateTimeFormat("default", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      calendar: "iso8601",
      numberingSystem: "latn",
      hourCycle: "h23",
    });
    const parts = df.formatToParts(date).reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});
    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
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
          cedulaCatastral,
          imgAnteriorSatellite,
          imgAnteriorYear,
          imgAnteriorMesInicial,
          imgAnteriorMesFinal,
          imgAnteriorNubosidadMaxima,
          imgPosteriorSatellite,
          imgPosteriorYear,
          imgPosteriorMesInicial,
          imgPosteriorMesFinal,
          imgPosteriorNubosidadMaxima,
          fechaHoraConsulta,
          fechaHoraActualizacion,
          verificado,
          rawConsulta,
          resultadoConsulta,
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
            query: createApiQuery.replaceAll("__typename", ""),
            variables: {
              input: {
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "ApiQueryCreateForm")}
      {...rest}
    >
      <TextField
        label="Cedula catastral"
        isRequired={false}
        isReadOnly={false}
        value={cedulaCatastral}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cedulaCatastral: value,
              imgAnteriorSatellite,
              imgAnteriorYear,
              imgAnteriorMesInicial,
              imgAnteriorMesFinal,
              imgAnteriorNubosidadMaxima,
              imgPosteriorSatellite,
              imgPosteriorYear,
              imgPosteriorMesInicial,
              imgPosteriorMesFinal,
              imgPosteriorNubosidadMaxima,
              fechaHoraConsulta,
              fechaHoraActualizacion,
              verificado,
              rawConsulta,
              resultadoConsulta,
            };
            const result = onChange(modelFields);
            value = result?.cedulaCatastral ?? value;
          }
          if (errors.cedulaCatastral?.hasError) {
            runValidationTasks("cedulaCatastral", value);
          }
          setCedulaCatastral(value);
        }}
        onBlur={() => runValidationTasks("cedulaCatastral", cedulaCatastral)}
        errorMessage={errors.cedulaCatastral?.errorMessage}
        hasError={errors.cedulaCatastral?.hasError}
        {...getOverrideProps(overrides, "cedulaCatastral")}
      ></TextField>
      <TextField
        label="Img anterior satellite"
        isRequired={true}
        isReadOnly={false}
        value={imgAnteriorSatellite}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cedulaCatastral,
              imgAnteriorSatellite: value,
              imgAnteriorYear,
              imgAnteriorMesInicial,
              imgAnteriorMesFinal,
              imgAnteriorNubosidadMaxima,
              imgPosteriorSatellite,
              imgPosteriorYear,
              imgPosteriorMesInicial,
              imgPosteriorMesFinal,
              imgPosteriorNubosidadMaxima,
              fechaHoraConsulta,
              fechaHoraActualizacion,
              verificado,
              rawConsulta,
              resultadoConsulta,
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
        isRequired={true}
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
              cedulaCatastral,
              imgAnteriorSatellite,
              imgAnteriorYear: value,
              imgAnteriorMesInicial,
              imgAnteriorMesFinal,
              imgAnteriorNubosidadMaxima,
              imgPosteriorSatellite,
              imgPosteriorYear,
              imgPosteriorMesInicial,
              imgPosteriorMesFinal,
              imgPosteriorNubosidadMaxima,
              fechaHoraConsulta,
              fechaHoraActualizacion,
              verificado,
              rawConsulta,
              resultadoConsulta,
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
        isRequired={true}
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
              cedulaCatastral,
              imgAnteriorSatellite,
              imgAnteriorYear,
              imgAnteriorMesInicial: value,
              imgAnteriorMesFinal,
              imgAnteriorNubosidadMaxima,
              imgPosteriorSatellite,
              imgPosteriorYear,
              imgPosteriorMesInicial,
              imgPosteriorMesFinal,
              imgPosteriorNubosidadMaxima,
              fechaHoraConsulta,
              fechaHoraActualizacion,
              verificado,
              rawConsulta,
              resultadoConsulta,
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
        isRequired={true}
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
              cedulaCatastral,
              imgAnteriorSatellite,
              imgAnteriorYear,
              imgAnteriorMesInicial,
              imgAnteriorMesFinal: value,
              imgAnteriorNubosidadMaxima,
              imgPosteriorSatellite,
              imgPosteriorYear,
              imgPosteriorMesInicial,
              imgPosteriorMesFinal,
              imgPosteriorNubosidadMaxima,
              fechaHoraConsulta,
              fechaHoraActualizacion,
              verificado,
              rawConsulta,
              resultadoConsulta,
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
        isRequired={true}
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
              cedulaCatastral,
              imgAnteriorSatellite,
              imgAnteriorYear,
              imgAnteriorMesInicial,
              imgAnteriorMesFinal,
              imgAnteriorNubosidadMaxima: value,
              imgPosteriorSatellite,
              imgPosteriorYear,
              imgPosteriorMesInicial,
              imgPosteriorMesFinal,
              imgPosteriorNubosidadMaxima,
              fechaHoraConsulta,
              fechaHoraActualizacion,
              verificado,
              rawConsulta,
              resultadoConsulta,
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
        label="Img posterior satellite"
        isRequired={true}
        isReadOnly={false}
        value={imgPosteriorSatellite}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cedulaCatastral,
              imgAnteriorSatellite,
              imgAnteriorYear,
              imgAnteriorMesInicial,
              imgAnteriorMesFinal,
              imgAnteriorNubosidadMaxima,
              imgPosteriorSatellite: value,
              imgPosteriorYear,
              imgPosteriorMesInicial,
              imgPosteriorMesFinal,
              imgPosteriorNubosidadMaxima,
              fechaHoraConsulta,
              fechaHoraActualizacion,
              verificado,
              rawConsulta,
              resultadoConsulta,
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
        isRequired={true}
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
              cedulaCatastral,
              imgAnteriorSatellite,
              imgAnteriorYear,
              imgAnteriorMesInicial,
              imgAnteriorMesFinal,
              imgAnteriorNubosidadMaxima,
              imgPosteriorSatellite,
              imgPosteriorYear: value,
              imgPosteriorMesInicial,
              imgPosteriorMesFinal,
              imgPosteriorNubosidadMaxima,
              fechaHoraConsulta,
              fechaHoraActualizacion,
              verificado,
              rawConsulta,
              resultadoConsulta,
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
        isRequired={true}
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
              cedulaCatastral,
              imgAnteriorSatellite,
              imgAnteriorYear,
              imgAnteriorMesInicial,
              imgAnteriorMesFinal,
              imgAnteriorNubosidadMaxima,
              imgPosteriorSatellite,
              imgPosteriorYear,
              imgPosteriorMesInicial: value,
              imgPosteriorMesFinal,
              imgPosteriorNubosidadMaxima,
              fechaHoraConsulta,
              fechaHoraActualizacion,
              verificado,
              rawConsulta,
              resultadoConsulta,
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
        isRequired={true}
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
              cedulaCatastral,
              imgAnteriorSatellite,
              imgAnteriorYear,
              imgAnteriorMesInicial,
              imgAnteriorMesFinal,
              imgAnteriorNubosidadMaxima,
              imgPosteriorSatellite,
              imgPosteriorYear,
              imgPosteriorMesInicial,
              imgPosteriorMesFinal: value,
              imgPosteriorNubosidadMaxima,
              fechaHoraConsulta,
              fechaHoraActualizacion,
              verificado,
              rawConsulta,
              resultadoConsulta,
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
        isRequired={true}
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
              cedulaCatastral,
              imgAnteriorSatellite,
              imgAnteriorYear,
              imgAnteriorMesInicial,
              imgAnteriorMesFinal,
              imgAnteriorNubosidadMaxima,
              imgPosteriorSatellite,
              imgPosteriorYear,
              imgPosteriorMesInicial,
              imgPosteriorMesFinal,
              imgPosteriorNubosidadMaxima: value,
              fechaHoraConsulta,
              fechaHoraActualizacion,
              verificado,
              rawConsulta,
              resultadoConsulta,
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
        label="Fecha hora consulta"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={
          fechaHoraConsulta &&
          convertToLocal(convertTimeStampToDate(fechaHoraConsulta))
        }
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : Number(new Date(e.target.value));
          if (onChange) {
            const modelFields = {
              cedulaCatastral,
              imgAnteriorSatellite,
              imgAnteriorYear,
              imgAnteriorMesInicial,
              imgAnteriorMesFinal,
              imgAnteriorNubosidadMaxima,
              imgPosteriorSatellite,
              imgPosteriorYear,
              imgPosteriorMesInicial,
              imgPosteriorMesFinal,
              imgPosteriorNubosidadMaxima,
              fechaHoraConsulta: value,
              fechaHoraActualizacion,
              verificado,
              rawConsulta,
              resultadoConsulta,
            };
            const result = onChange(modelFields);
            value = result?.fechaHoraConsulta ?? value;
          }
          if (errors.fechaHoraConsulta?.hasError) {
            runValidationTasks("fechaHoraConsulta", value);
          }
          setFechaHoraConsulta(value);
        }}
        onBlur={() =>
          runValidationTasks("fechaHoraConsulta", fechaHoraConsulta)
        }
        errorMessage={errors.fechaHoraConsulta?.errorMessage}
        hasError={errors.fechaHoraConsulta?.hasError}
        {...getOverrideProps(overrides, "fechaHoraConsulta")}
      ></TextField>
      <TextField
        label="Fecha hora actualizacion"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={
          fechaHoraActualizacion &&
          convertToLocal(convertTimeStampToDate(fechaHoraActualizacion))
        }
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : Number(new Date(e.target.value));
          if (onChange) {
            const modelFields = {
              cedulaCatastral,
              imgAnteriorSatellite,
              imgAnteriorYear,
              imgAnteriorMesInicial,
              imgAnteriorMesFinal,
              imgAnteriorNubosidadMaxima,
              imgPosteriorSatellite,
              imgPosteriorYear,
              imgPosteriorMesInicial,
              imgPosteriorMesFinal,
              imgPosteriorNubosidadMaxima,
              fechaHoraConsulta,
              fechaHoraActualizacion: value,
              verificado,
              rawConsulta,
              resultadoConsulta,
            };
            const result = onChange(modelFields);
            value = result?.fechaHoraActualizacion ?? value;
          }
          if (errors.fechaHoraActualizacion?.hasError) {
            runValidationTasks("fechaHoraActualizacion", value);
          }
          setFechaHoraActualizacion(value);
        }}
        onBlur={() =>
          runValidationTasks("fechaHoraActualizacion", fechaHoraActualizacion)
        }
        errorMessage={errors.fechaHoraActualizacion?.errorMessage}
        hasError={errors.fechaHoraActualizacion?.hasError}
        {...getOverrideProps(overrides, "fechaHoraActualizacion")}
      ></TextField>
      <SwitchField
        label="Verificado"
        defaultChecked={false}
        isDisabled={false}
        isChecked={verificado}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              cedulaCatastral,
              imgAnteriorSatellite,
              imgAnteriorYear,
              imgAnteriorMesInicial,
              imgAnteriorMesFinal,
              imgAnteriorNubosidadMaxima,
              imgPosteriorSatellite,
              imgPosteriorYear,
              imgPosteriorMesInicial,
              imgPosteriorMesFinal,
              imgPosteriorNubosidadMaxima,
              fechaHoraConsulta,
              fechaHoraActualizacion,
              verificado: value,
              rawConsulta,
              resultadoConsulta,
            };
            const result = onChange(modelFields);
            value = result?.verificado ?? value;
          }
          if (errors.verificado?.hasError) {
            runValidationTasks("verificado", value);
          }
          setVerificado(value);
        }}
        onBlur={() => runValidationTasks("verificado", verificado)}
        errorMessage={errors.verificado?.errorMessage}
        hasError={errors.verificado?.hasError}
        {...getOverrideProps(overrides, "verificado")}
      ></SwitchField>
      <TextAreaField
        label="Raw consulta"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cedulaCatastral,
              imgAnteriorSatellite,
              imgAnteriorYear,
              imgAnteriorMesInicial,
              imgAnteriorMesFinal,
              imgAnteriorNubosidadMaxima,
              imgPosteriorSatellite,
              imgPosteriorYear,
              imgPosteriorMesInicial,
              imgPosteriorMesFinal,
              imgPosteriorNubosidadMaxima,
              fechaHoraConsulta,
              fechaHoraActualizacion,
              verificado,
              rawConsulta: value,
              resultadoConsulta,
            };
            const result = onChange(modelFields);
            value = result?.rawConsulta ?? value;
          }
          if (errors.rawConsulta?.hasError) {
            runValidationTasks("rawConsulta", value);
          }
          setRawConsulta(value);
        }}
        onBlur={() => runValidationTasks("rawConsulta", rawConsulta)}
        errorMessage={errors.rawConsulta?.errorMessage}
        hasError={errors.rawConsulta?.hasError}
        {...getOverrideProps(overrides, "rawConsulta")}
      ></TextAreaField>
      <TextAreaField
        label="Resultado consulta"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              cedulaCatastral,
              imgAnteriorSatellite,
              imgAnteriorYear,
              imgAnteriorMesInicial,
              imgAnteriorMesFinal,
              imgAnteriorNubosidadMaxima,
              imgPosteriorSatellite,
              imgPosteriorYear,
              imgPosteriorMesInicial,
              imgPosteriorMesFinal,
              imgPosteriorNubosidadMaxima,
              fechaHoraConsulta,
              fechaHoraActualizacion,
              verificado,
              rawConsulta,
              resultadoConsulta: value,
            };
            const result = onChange(modelFields);
            value = result?.resultadoConsulta ?? value;
          }
          if (errors.resultadoConsulta?.hasError) {
            runValidationTasks("resultadoConsulta", value);
          }
          setResultadoConsulta(value);
        }}
        onBlur={() =>
          runValidationTasks("resultadoConsulta", resultadoConsulta)
        }
        errorMessage={errors.resultadoConsulta?.errorMessage}
        hasError={errors.resultadoConsulta?.hasError}
        {...getOverrideProps(overrides, "resultadoConsulta")}
      ></TextAreaField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
