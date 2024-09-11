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
import { getToken } from "../graphql/queries";
import { updateToken } from "../graphql/mutations";
export default function TokenUpdateForm(props) {
  const {
    id: idProp,
    token: tokenModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    policyID: "",
    tokenName: "",
    supply: "",
    oraclePrice: "",
  };
  const [policyID, setPolicyID] = React.useState(initialValues.policyID);
  const [tokenName, setTokenName] = React.useState(initialValues.tokenName);
  const [supply, setSupply] = React.useState(initialValues.supply);
  const [oraclePrice, setOraclePrice] = React.useState(
    initialValues.oraclePrice
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = tokenRecord
      ? { ...initialValues, ...tokenRecord }
      : initialValues;
    setPolicyID(cleanValues.policyID);
    setTokenName(cleanValues.tokenName);
    setSupply(cleanValues.supply);
    setOraclePrice(cleanValues.oraclePrice);
    setErrors({});
  };
  const [tokenRecord, setTokenRecord] = React.useState(tokenModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await API.graphql({
              query: getToken.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getToken
        : tokenModelProp;
      setTokenRecord(record);
    };
    queryData();
  }, [idProp, tokenModelProp]);
  React.useEffect(resetStateValues, [tokenRecord]);
  const validations = {
    policyID: [],
    tokenName: [],
    supply: [],
    oraclePrice: [],
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
          policyID: policyID ?? null,
          tokenName: tokenName ?? null,
          supply: supply ?? null,
          oraclePrice: oraclePrice ?? null,
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
            query: updateToken.replaceAll("__typename", ""),
            variables: {
              input: {
                id: tokenRecord.id,
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
      {...getOverrideProps(overrides, "TokenUpdateForm")}
      {...rest}
    >
      <TextField
        label="Policy id"
        isRequired={false}
        isReadOnly={false}
        value={policyID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              policyID: value,
              tokenName,
              supply,
              oraclePrice,
            };
            const result = onChange(modelFields);
            value = result?.policyID ?? value;
          }
          if (errors.policyID?.hasError) {
            runValidationTasks("policyID", value);
          }
          setPolicyID(value);
        }}
        onBlur={() => runValidationTasks("policyID", policyID)}
        errorMessage={errors.policyID?.errorMessage}
        hasError={errors.policyID?.hasError}
        {...getOverrideProps(overrides, "policyID")}
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
              policyID,
              tokenName: value,
              supply,
              oraclePrice,
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
        label="Supply"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={supply}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              policyID,
              tokenName,
              supply: value,
              oraclePrice,
            };
            const result = onChange(modelFields);
            value = result?.supply ?? value;
          }
          if (errors.supply?.hasError) {
            runValidationTasks("supply", value);
          }
          setSupply(value);
        }}
        onBlur={() => runValidationTasks("supply", supply)}
        errorMessage={errors.supply?.errorMessage}
        hasError={errors.supply?.hasError}
        {...getOverrideProps(overrides, "supply")}
      ></TextField>
      <TextField
        label="Oracle price"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={oraclePrice}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              policyID,
              tokenName,
              supply,
              oraclePrice: value,
            };
            const result = onChange(modelFields);
            value = result?.oraclePrice ?? value;
          }
          if (errors.oraclePrice?.hasError) {
            runValidationTasks("oraclePrice", value);
          }
          setOraclePrice(value);
        }}
        onBlur={() => runValidationTasks("oraclePrice", oraclePrice)}
        errorMessage={errors.oraclePrice?.errorMessage}
        hasError={errors.oraclePrice?.hasError}
        {...getOverrideProps(overrides, "oraclePrice")}
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
          isDisabled={!(idProp || tokenModelProp)}
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
              !(idProp || tokenModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
