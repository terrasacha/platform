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
import { createProductFeature } from "../graphql/mutations";
export default function ProductFeatureCreateForm(props) {
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
    value: "",
    isToBlockChain: false,
    order: "",
    isOnMainCard: false,
    isResult: false,
  };
  const [value, setValue] = React.useState(initialValues.value);
  const [isToBlockChain, setIsToBlockChain] = React.useState(
    initialValues.isToBlockChain
  );
  const [order, setOrder] = React.useState(initialValues.order);
  const [isOnMainCard, setIsOnMainCard] = React.useState(
    initialValues.isOnMainCard
  );
  const [isResult, setIsResult] = React.useState(initialValues.isResult);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setValue(initialValues.value);
    setIsToBlockChain(initialValues.isToBlockChain);
    setOrder(initialValues.order);
    setIsOnMainCard(initialValues.isOnMainCard);
    setIsResult(initialValues.isResult);
    setErrors({});
  };
  const validations = {
    value: [],
    isToBlockChain: [],
    order: [],
    isOnMainCard: [],
    isResult: [],
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
          value,
          isToBlockChain,
          order,
          isOnMainCard,
          isResult,
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
            query: createProductFeature.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "ProductFeatureCreateForm")}
      {...rest}
    >
      <TextField
        label="Value"
        isRequired={false}
        isReadOnly={false}
        value={value}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              value: value,
              isToBlockChain,
              order,
              isOnMainCard,
              isResult,
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
      <SwitchField
        label="Is to block chain"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isToBlockChain}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              value,
              isToBlockChain: value,
              order,
              isOnMainCard,
              isResult,
            };
            const result = onChange(modelFields);
            value = result?.isToBlockChain ?? value;
          }
          if (errors.isToBlockChain?.hasError) {
            runValidationTasks("isToBlockChain", value);
          }
          setIsToBlockChain(value);
        }}
        onBlur={() => runValidationTasks("isToBlockChain", isToBlockChain)}
        errorMessage={errors.isToBlockChain?.errorMessage}
        hasError={errors.isToBlockChain?.hasError}
        {...getOverrideProps(overrides, "isToBlockChain")}
      ></SwitchField>
      <TextField
        label="Order"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={order}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              value,
              isToBlockChain,
              order: value,
              isOnMainCard,
              isResult,
            };
            const result = onChange(modelFields);
            value = result?.order ?? value;
          }
          if (errors.order?.hasError) {
            runValidationTasks("order", value);
          }
          setOrder(value);
        }}
        onBlur={() => runValidationTasks("order", order)}
        errorMessage={errors.order?.errorMessage}
        hasError={errors.order?.hasError}
        {...getOverrideProps(overrides, "order")}
      ></TextField>
      <SwitchField
        label="Is on main card"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isOnMainCard}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              value,
              isToBlockChain,
              order,
              isOnMainCard: value,
              isResult,
            };
            const result = onChange(modelFields);
            value = result?.isOnMainCard ?? value;
          }
          if (errors.isOnMainCard?.hasError) {
            runValidationTasks("isOnMainCard", value);
          }
          setIsOnMainCard(value);
        }}
        onBlur={() => runValidationTasks("isOnMainCard", isOnMainCard)}
        errorMessage={errors.isOnMainCard?.errorMessage}
        hasError={errors.isOnMainCard?.hasError}
        {...getOverrideProps(overrides, "isOnMainCard")}
      ></SwitchField>
      <SwitchField
        label="Is result"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isResult}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              value,
              isToBlockChain,
              order,
              isOnMainCard,
              isResult: value,
            };
            const result = onChange(modelFields);
            value = result?.isResult ?? value;
          }
          if (errors.isResult?.hasError) {
            runValidationTasks("isResult", value);
          }
          setIsResult(value);
        }}
        onBlur={() => runValidationTasks("isResult", isResult)}
        errorMessage={errors.isResult?.errorMessage}
        hasError={errors.isResult?.hasError}
        {...getOverrideProps(overrides, "isResult")}
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
