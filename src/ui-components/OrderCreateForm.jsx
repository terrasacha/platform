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
import { createOrder } from "../graphql/mutations";
export default function OrderCreateForm(props) {
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
    statusCode: "",
    tokenPolicyId: "",
    tokenName: "",
    tokenAmount: "",
    utxos: "",
    value: "",
  };
  const [statusCode, setStatusCode] = React.useState(initialValues.statusCode);
  const [tokenPolicyId, setTokenPolicyId] = React.useState(
    initialValues.tokenPolicyId
  );
  const [tokenName, setTokenName] = React.useState(initialValues.tokenName);
  const [tokenAmount, setTokenAmount] = React.useState(
    initialValues.tokenAmount
  );
  const [utxos, setUtxos] = React.useState(initialValues.utxos);
  const [value, setValue] = React.useState(initialValues.value);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setStatusCode(initialValues.statusCode);
    setTokenPolicyId(initialValues.tokenPolicyId);
    setTokenName(initialValues.tokenName);
    setTokenAmount(initialValues.tokenAmount);
    setUtxos(initialValues.utxos);
    setValue(initialValues.value);
    setErrors({});
  };
  const validations = {
    statusCode: [],
    tokenPolicyId: [],
    tokenName: [],
    tokenAmount: [],
    utxos: [],
    value: [],
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
          statusCode,
          tokenPolicyId,
          tokenName,
          tokenAmount,
          utxos,
          value,
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
            query: createOrder.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "OrderCreateForm")}
      {...rest}
    >
      <TextField
        label="Status code"
        isRequired={false}
        isReadOnly={false}
        value={statusCode}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              statusCode: value,
              tokenPolicyId,
              tokenName,
              tokenAmount,
              utxos,
              value,
            };
            const result = onChange(modelFields);
            value = result?.statusCode ?? value;
          }
          if (errors.statusCode?.hasError) {
            runValidationTasks("statusCode", value);
          }
          setStatusCode(value);
        }}
        onBlur={() => runValidationTasks("statusCode", statusCode)}
        errorMessage={errors.statusCode?.errorMessage}
        hasError={errors.statusCode?.hasError}
        {...getOverrideProps(overrides, "statusCode")}
      ></TextField>
      <TextField
        label="Token policy id"
        isRequired={false}
        isReadOnly={false}
        value={tokenPolicyId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              statusCode,
              tokenPolicyId: value,
              tokenName,
              tokenAmount,
              utxos,
              value,
            };
            const result = onChange(modelFields);
            value = result?.tokenPolicyId ?? value;
          }
          if (errors.tokenPolicyId?.hasError) {
            runValidationTasks("tokenPolicyId", value);
          }
          setTokenPolicyId(value);
        }}
        onBlur={() => runValidationTasks("tokenPolicyId", tokenPolicyId)}
        errorMessage={errors.tokenPolicyId?.errorMessage}
        hasError={errors.tokenPolicyId?.hasError}
        {...getOverrideProps(overrides, "tokenPolicyId")}
      ></TextField>
      <TextField
        label="Token name"
        isRequired={false}
        isReadOnly={false}
        value={tokenName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              statusCode,
              tokenPolicyId,
              tokenName: value,
              tokenAmount,
              utxos,
              value,
            };
            const result = onChange(modelFields);
            value = result?.tokenName ?? value;
          }
          if (errors.tokenName?.hasError) {
            runValidationTasks("tokenName", value);
          }
          setTokenName(value);
        }}
        onBlur={() => runValidationTasks("tokenName", tokenName)}
        errorMessage={errors.tokenName?.errorMessage}
        hasError={errors.tokenName?.hasError}
        {...getOverrideProps(overrides, "tokenName")}
      ></TextField>
      <TextField
        label="Token amount"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={tokenAmount}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              statusCode,
              tokenPolicyId,
              tokenName,
              tokenAmount: value,
              utxos,
              value,
            };
            const result = onChange(modelFields);
            value = result?.tokenAmount ?? value;
          }
          if (errors.tokenAmount?.hasError) {
            runValidationTasks("tokenAmount", value);
          }
          setTokenAmount(value);
        }}
        onBlur={() => runValidationTasks("tokenAmount", tokenAmount)}
        errorMessage={errors.tokenAmount?.errorMessage}
        hasError={errors.tokenAmount?.hasError}
        {...getOverrideProps(overrides, "tokenAmount")}
      ></TextField>
      <TextField
        label="Utxos"
        isRequired={false}
        isReadOnly={false}
        value={utxos}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              statusCode,
              tokenPolicyId,
              tokenName,
              tokenAmount,
              utxos: value,
              value,
            };
            const result = onChange(modelFields);
            value = result?.utxos ?? value;
          }
          if (errors.utxos?.hasError) {
            runValidationTasks("utxos", value);
          }
          setUtxos(value);
        }}
        onBlur={() => runValidationTasks("utxos", utxos)}
        errorMessage={errors.utxos?.errorMessage}
        hasError={errors.utxos?.hasError}
        {...getOverrideProps(overrides, "utxos")}
      ></TextField>
      <TextField
        label="Value"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={value}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              statusCode,
              tokenPolicyId,
              tokenName,
              tokenAmount,
              utxos,
              value: value,
            };
            const result = onChange(modelFields);
            value = result?.value ?? value;
          }
          if (errors.value?.hasError) {
            runValidationTasks("value", value);
          }
          setValue(value);
        }}
        onBlur={() => runValidationTasks("value", value)}
        errorMessage={errors.value?.errorMessage}
        hasError={errors.value?.hasError}
        {...getOverrideProps(overrides, "value")}
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
