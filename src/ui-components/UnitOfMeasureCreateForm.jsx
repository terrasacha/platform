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
  TextField,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { API } from "aws-amplify";
import { createUnitOfMeasure } from "../graphql/mutations";
export default function UnitOfMeasureCreateForm(props) {
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
    engineeringUnit: "",
    description: "",
    isFloat: false,
  };
  const [engineeringUnit, setEngineeringUnit] = React.useState(
    initialValues.engineeringUnit
  );
  const [description, setDescription] = React.useState(
    initialValues.description
  );
  const [isFloat, setIsFloat] = React.useState(initialValues.isFloat);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setEngineeringUnit(initialValues.engineeringUnit);
    setDescription(initialValues.description);
    setIsFloat(initialValues.isFloat);
    setErrors({});
  };
  const validations = {
    engineeringUnit: [{ type: "Required" }],
    description: [],
    isFloat: [],
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
          engineeringUnit,
          description,
          isFloat,
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
            query: createUnitOfMeasure.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "UnitOfMeasureCreateForm")}
      {...rest}
    >
      <TextField
        label="Engineering unit"
        isRequired={true}
        isReadOnly={false}
        value={engineeringUnit}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              engineeringUnit: value,
              description,
              isFloat,
            };
            const result = onChange(modelFields);
            value = result?.engineeringUnit ?? value;
          }
          if (errors.engineeringUnit?.hasError) {
            runValidationTasks("engineeringUnit", value);
          }
          setEngineeringUnit(value);
        }}
        onBlur={() => runValidationTasks("engineeringUnit", engineeringUnit)}
        errorMessage={errors.engineeringUnit?.errorMessage}
        hasError={errors.engineeringUnit?.hasError}
        {...getOverrideProps(overrides, "engineeringUnit")}
      ></TextField>
      <TextField
        label="Description"
        isRequired={false}
        isReadOnly={false}
        value={description}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              engineeringUnit,
              description: value,
              isFloat,
            };
            const result = onChange(modelFields);
            value = result?.description ?? value;
          }
          if (errors.description?.hasError) {
            runValidationTasks("description", value);
          }
          setDescription(value);
        }}
        onBlur={() => runValidationTasks("description", description)}
        errorMessage={errors.description?.errorMessage}
        hasError={errors.description?.hasError}
        {...getOverrideProps(overrides, "description")}
      ></TextField>
      <SwitchField
        label="Is float"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isFloat}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              engineeringUnit,
              description,
              isFloat: value,
            };
            const result = onChange(modelFields);
            value = result?.isFloat ?? value;
          }
          if (errors.isFloat?.hasError) {
            runValidationTasks("isFloat", value);
          }
          setIsFloat(value);
        }}
        onBlur={() => runValidationTasks("isFloat", isFloat)}
        errorMessage={errors.isFloat?.errorMessage}
        hasError={errors.isFloat?.hasError}
        {...getOverrideProps(overrides, "isFloat")}
      ></SwitchField>
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
