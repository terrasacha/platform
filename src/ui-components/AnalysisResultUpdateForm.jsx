/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { API } from "aws-amplify";
import { getAnalysisResult } from "../graphql/queries";
import { updateAnalysisResult } from "../graphql/mutations";
export default function AnalysisResultUpdateForm(props) {
  const {
    id: idProp,
    analysisResult: analysisResultModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    fuente: "",
    modelo: "",
    cobertura: "",
    valor: "",
    unidad: "",
    proyecto: "",
    nombreImagen: "",
    data: "",
  };
  const [fuente, setFuente] = React.useState(initialValues.fuente);
  const [modelo, setModelo] = React.useState(initialValues.modelo);
  const [cobertura, setCobertura] = React.useState(initialValues.cobertura);
  const [valor, setValor] = React.useState(initialValues.valor);
  const [unidad, setUnidad] = React.useState(initialValues.unidad);
  const [proyecto, setProyecto] = React.useState(initialValues.proyecto);
  const [nombreImagen, setNombreImagen] = React.useState(
    initialValues.nombreImagen
  );
  const [data, setData] = React.useState(initialValues.data);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = analysisResultRecord
      ? { ...initialValues, ...analysisResultRecord }
      : initialValues;
    setFuente(cleanValues.fuente);
    setModelo(cleanValues.modelo);
    setCobertura(cleanValues.cobertura);
    setValor(cleanValues.valor);
    setUnidad(cleanValues.unidad);
    setProyecto(cleanValues.proyecto);
    setNombreImagen(cleanValues.nombreImagen);
    setData(cleanValues.data);
    setErrors({});
  };
  const [analysisResultRecord, setAnalysisResultRecord] = React.useState(
    analysisResultModelProp
  );
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await API.graphql({
              query: getAnalysisResult.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getAnalysisResult
        : analysisResultModelProp;
      setAnalysisResultRecord(record);
    };
    queryData();
  }, [idProp, analysisResultModelProp]);
  React.useEffect(resetStateValues, [analysisResultRecord]);
  const validations = {
    fuente: [{ type: "Required" }],
    modelo: [{ type: "Required" }],
    cobertura: [{ type: "Required" }],
    valor: [{ type: "Required" }],
    unidad: [{ type: "Required" }],
    proyecto: [{ type: "Required" }],
    nombreImagen: [{ type: "Required" }],
    data: [{ type: "Required" }],
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
          fuente,
          modelo,
          cobertura,
          valor,
          unidad,
          proyecto,
          nombreImagen,
          data,
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
            query: updateAnalysisResult.replaceAll("__typename", ""),
            variables: {
              input: {
                id: analysisResultRecord.id,
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
      {...getOverrideProps(overrides, "AnalysisResultUpdateForm")}
      {...rest}
    >
      <TextField
        label="Fuente"
        isRequired={true}
        isReadOnly={false}
        value={fuente}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              fuente: value,
              modelo,
              cobertura,
              valor,
              unidad,
              proyecto,
              nombreImagen,
              data,
            };
            const result = onChange(modelFields);
            value = result?.fuente ?? value;
          }
          if (errors.fuente?.hasError) {
            runValidationTasks("fuente", value);
          }
          setFuente(value);
        }}
        onBlur={() => runValidationTasks("fuente", fuente)}
        errorMessage={errors.fuente?.errorMessage}
        hasError={errors.fuente?.hasError}
        {...getOverrideProps(overrides, "fuente")}
      ></TextField>
      <TextField
        label="Modelo"
        isRequired={true}
        isReadOnly={false}
        value={modelo}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              fuente,
              modelo: value,
              cobertura,
              valor,
              unidad,
              proyecto,
              nombreImagen,
              data,
            };
            const result = onChange(modelFields);
            value = result?.modelo ?? value;
          }
          if (errors.modelo?.hasError) {
            runValidationTasks("modelo", value);
          }
          setModelo(value);
        }}
        onBlur={() => runValidationTasks("modelo", modelo)}
        errorMessage={errors.modelo?.errorMessage}
        hasError={errors.modelo?.hasError}
        {...getOverrideProps(overrides, "modelo")}
      ></TextField>
      <TextField
        label="Cobertura"
        isRequired={true}
        isReadOnly={false}
        value={cobertura}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              fuente,
              modelo,
              cobertura: value,
              valor,
              unidad,
              proyecto,
              nombreImagen,
              data,
            };
            const result = onChange(modelFields);
            value = result?.cobertura ?? value;
          }
          if (errors.cobertura?.hasError) {
            runValidationTasks("cobertura", value);
          }
          setCobertura(value);
        }}
        onBlur={() => runValidationTasks("cobertura", cobertura)}
        errorMessage={errors.cobertura?.errorMessage}
        hasError={errors.cobertura?.hasError}
        {...getOverrideProps(overrides, "cobertura")}
      ></TextField>
      <TextField
        label="Valor"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={valor}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              fuente,
              modelo,
              cobertura,
              valor: value,
              unidad,
              proyecto,
              nombreImagen,
              data,
            };
            const result = onChange(modelFields);
            value = result?.valor ?? value;
          }
          if (errors.valor?.hasError) {
            runValidationTasks("valor", value);
          }
          setValor(value);
        }}
        onBlur={() => runValidationTasks("valor", valor)}
        errorMessage={errors.valor?.errorMessage}
        hasError={errors.valor?.hasError}
        {...getOverrideProps(overrides, "valor")}
      ></TextField>
      <TextField
        label="Unidad"
        isRequired={true}
        isReadOnly={false}
        value={unidad}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              fuente,
              modelo,
              cobertura,
              valor,
              unidad: value,
              proyecto,
              nombreImagen,
              data,
            };
            const result = onChange(modelFields);
            value = result?.unidad ?? value;
          }
          if (errors.unidad?.hasError) {
            runValidationTasks("unidad", value);
          }
          setUnidad(value);
        }}
        onBlur={() => runValidationTasks("unidad", unidad)}
        errorMessage={errors.unidad?.errorMessage}
        hasError={errors.unidad?.hasError}
        {...getOverrideProps(overrides, "unidad")}
      ></TextField>
      <TextField
        label="Proyecto"
        isRequired={true}
        isReadOnly={false}
        value={proyecto}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              fuente,
              modelo,
              cobertura,
              valor,
              unidad,
              proyecto: value,
              nombreImagen,
              data,
            };
            const result = onChange(modelFields);
            value = result?.proyecto ?? value;
          }
          if (errors.proyecto?.hasError) {
            runValidationTasks("proyecto", value);
          }
          setProyecto(value);
        }}
        onBlur={() => runValidationTasks("proyecto", proyecto)}
        errorMessage={errors.proyecto?.errorMessage}
        hasError={errors.proyecto?.hasError}
        {...getOverrideProps(overrides, "proyecto")}
      ></TextField>
      <TextField
        label="Nombre imagen"
        isRequired={true}
        isReadOnly={false}
        value={nombreImagen}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              fuente,
              modelo,
              cobertura,
              valor,
              unidad,
              proyecto,
              nombreImagen: value,
              data,
            };
            const result = onChange(modelFields);
            value = result?.nombreImagen ?? value;
          }
          if (errors.nombreImagen?.hasError) {
            runValidationTasks("nombreImagen", value);
          }
          setNombreImagen(value);
        }}
        onBlur={() => runValidationTasks("nombreImagen", nombreImagen)}
        errorMessage={errors.nombreImagen?.errorMessage}
        hasError={errors.nombreImagen?.hasError}
        {...getOverrideProps(overrides, "nombreImagen")}
      ></TextField>
      <TextField
        label="Data"
        isRequired={true}
        isReadOnly={false}
        value={data}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              fuente,
              modelo,
              cobertura,
              valor,
              unidad,
              proyecto,
              nombreImagen,
              data: value,
            };
            const result = onChange(modelFields);
            value = result?.data ?? value;
          }
          if (errors.data?.hasError) {
            runValidationTasks("data", value);
          }
          setData(value);
        }}
        onBlur={() => runValidationTasks("data", data)}
        errorMessage={errors.data?.errorMessage}
        hasError={errors.data?.hasError}
        {...getOverrideProps(overrides, "data")}
      ></TextField>
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
          isDisabled={!(idProp || analysisResultModelProp)}
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
              !(idProp || analysisResultModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
