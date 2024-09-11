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
import { createFormula } from "../graphql/mutations";
export default function FormulaCreateForm(props) {
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
    varID: "",
    equation: "",
  };
  const [varID, setVarID] = React.useState(initialValues.varID);
  const [equation, setEquation] = React.useState(initialValues.equation);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setVarID(initialValues.varID);
    setEquation(initialValues.equation);
    setErrors({});
  };
  const validations = {
    varID: [{ type: "Required" }],
    equation: [{ type: "Required" }],
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
          varID,
          equation,
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
            query: createFormula.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "FormulaCreateForm")}
      {...rest}
    >
      <TextField
        label="Var id"
        isRequired={true}
        isReadOnly={false}
        value={varID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              varID: value,
              equation,
            };
            const result = onChange(modelFields);
            value = result?.varID ?? value;
          }
          if (errors.varID?.hasError) {
            runValidationTasks("varID", value);
          }
          setVarID(value);
        }}
        onBlur={() => runValidationTasks("varID", varID)}
        errorMessage={errors.varID?.errorMessage}
        hasError={errors.varID?.hasError}
        {...getOverrideProps(overrides, "varID")}
      ></TextField>
      <TextField
        label="Equation"
        isRequired={true}
        isReadOnly={false}
        value={equation}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              varID,
              equation: value,
            };
            const result = onChange(modelFields);
            value = result?.equation ?? value;
          }
          if (errors.equation?.hasError) {
            runValidationTasks("equation", value);
          }
          setEquation(value);
        }}
        onBlur={() => runValidationTasks("equation", equation)}
        errorMessage={errors.equation?.errorMessage}
        hasError={errors.equation?.hasError}
        {...getOverrideProps(overrides, "equation")}
      ></TextField>
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
