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
import { createVerification } from "../graphql/mutations";
export default function VerificationCreateForm(props) {
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
    createdOn: "",
    updatedOn: "",
    sign: "",
  };
  const [createdOn, setCreatedOn] = React.useState(initialValues.createdOn);
  const [updatedOn, setUpdatedOn] = React.useState(initialValues.updatedOn);
  const [sign, setSign] = React.useState(initialValues.sign);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setCreatedOn(initialValues.createdOn);
    setUpdatedOn(initialValues.updatedOn);
    setSign(initialValues.sign);
    setErrors({});
  };
  const validations = {
    createdOn: [],
    updatedOn: [],
    sign: [],
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
          createdOn,
          updatedOn,
          sign,
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
            query: createVerification.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "VerificationCreateForm")}
      {...rest}
    >
      <TextField
        label="Created on"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={createdOn && convertToLocal(new Date(createdOn))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              createdOn: value,
              updatedOn,
              sign,
            };
            const result = onChange(modelFields);
            value = result?.createdOn ?? value;
          }
          if (errors.createdOn?.hasError) {
            runValidationTasks("createdOn", value);
          }
          setCreatedOn(value);
        }}
        onBlur={() => runValidationTasks("createdOn", createdOn)}
        errorMessage={errors.createdOn?.errorMessage}
        hasError={errors.createdOn?.hasError}
        {...getOverrideProps(overrides, "createdOn")}
      ></TextField>
      <TextField
        label="Updated on"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={updatedOn && convertToLocal(new Date(updatedOn))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              createdOn,
              updatedOn: value,
              sign,
            };
            const result = onChange(modelFields);
            value = result?.updatedOn ?? value;
          }
          if (errors.updatedOn?.hasError) {
            runValidationTasks("updatedOn", value);
          }
          setUpdatedOn(value);
        }}
        onBlur={() => runValidationTasks("updatedOn", updatedOn)}
        errorMessage={errors.updatedOn?.errorMessage}
        hasError={errors.updatedOn?.hasError}
        {...getOverrideProps(overrides, "updatedOn")}
      ></TextField>
      <TextField
        label="Sign"
        isRequired={false}
        isReadOnly={false}
        value={sign}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              createdOn,
              updatedOn,
              sign: value,
            };
            const result = onChange(modelFields);
            value = result?.sign ?? value;
          }
          if (errors.sign?.hasError) {
            runValidationTasks("sign", value);
          }
          setSign(value);
        }}
        onBlur={() => runValidationTasks("sign", sign)}
        errorMessage={errors.sign?.errorMessage}
        hasError={errors.sign?.hasError}
        {...getOverrideProps(overrides, "sign")}
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
