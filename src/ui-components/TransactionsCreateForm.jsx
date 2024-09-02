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
import { createTransactions } from "../graphql/mutations";
export default function TransactionsCreateForm(props) {
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
    addressOrigin: "",
    addressDestination: "",
    txIn: "",
    txOutput: "",
    txCborhex: "",
    txHash: "",
    mint: "",
    scriptDataHash: "",
    metadataUrl: "",
    redeemer: "",
    fees: "",
    network: "",
    type: "",
    signed: false,
  };
  const [addressOrigin, setAddressOrigin] = React.useState(
    initialValues.addressOrigin
  );
  const [addressDestination, setAddressDestination] = React.useState(
    initialValues.addressDestination
  );
  const [txIn, setTxIn] = React.useState(initialValues.txIn);
  const [txOutput, setTxOutput] = React.useState(initialValues.txOutput);
  const [txCborhex, setTxCborhex] = React.useState(initialValues.txCborhex);
  const [txHash, setTxHash] = React.useState(initialValues.txHash);
  const [mint, setMint] = React.useState(initialValues.mint);
  const [scriptDataHash, setScriptDataHash] = React.useState(
    initialValues.scriptDataHash
  );
  const [metadataUrl, setMetadataUrl] = React.useState(
    initialValues.metadataUrl
  );
  const [redeemer, setRedeemer] = React.useState(initialValues.redeemer);
  const [fees, setFees] = React.useState(initialValues.fees);
  const [network, setNetwork] = React.useState(initialValues.network);
  const [type, setType] = React.useState(initialValues.type);
  const [signed, setSigned] = React.useState(initialValues.signed);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setAddressOrigin(initialValues.addressOrigin);
    setAddressDestination(initialValues.addressDestination);
    setTxIn(initialValues.txIn);
    setTxOutput(initialValues.txOutput);
    setTxCborhex(initialValues.txCborhex);
    setTxHash(initialValues.txHash);
    setMint(initialValues.mint);
    setScriptDataHash(initialValues.scriptDataHash);
    setMetadataUrl(initialValues.metadataUrl);
    setRedeemer(initialValues.redeemer);
    setFees(initialValues.fees);
    setNetwork(initialValues.network);
    setType(initialValues.type);
    setSigned(initialValues.signed);
    setErrors({});
  };
  const validations = {
    addressOrigin: [],
    addressDestination: [{ type: "JSON" }],
    txIn: [{ type: "JSON" }],
    txOutput: [{ type: "JSON" }],
    txCborhex: [],
    txHash: [],
    mint: [{ type: "JSON" }],
    scriptDataHash: [],
    metadataUrl: [],
    redeemer: [],
    fees: [],
    network: [],
    type: [],
    signed: [{ type: "Required" }],
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
          addressOrigin,
          addressDestination,
          txIn,
          txOutput,
          txCborhex,
          txHash,
          mint,
          scriptDataHash,
          metadataUrl,
          redeemer,
          fees,
          network,
          type,
          signed,
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
            query: createTransactions.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "TransactionsCreateForm")}
      {...rest}
    >
      <TextField
        label="Address origin"
        isRequired={false}
        isReadOnly={false}
        value={addressOrigin}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              addressOrigin: value,
              addressDestination,
              txIn,
              txOutput,
              txCborhex,
              txHash,
              mint,
              scriptDataHash,
              metadataUrl,
              redeemer,
              fees,
              network,
              type,
              signed,
            };
            const result = onChange(modelFields);
            value = result?.addressOrigin ?? value;
          }
          if (errors.addressOrigin?.hasError) {
            runValidationTasks("addressOrigin", value);
          }
          setAddressOrigin(value);
        }}
        onBlur={() => runValidationTasks("addressOrigin", addressOrigin)}
        errorMessage={errors.addressOrigin?.errorMessage}
        hasError={errors.addressOrigin?.hasError}
        {...getOverrideProps(overrides, "addressOrigin")}
      ></TextField>
      <TextAreaField
        label="Address destination"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              addressOrigin,
              addressDestination: value,
              txIn,
              txOutput,
              txCborhex,
              txHash,
              mint,
              scriptDataHash,
              metadataUrl,
              redeemer,
              fees,
              network,
              type,
              signed,
            };
            const result = onChange(modelFields);
            value = result?.addressDestination ?? value;
          }
          if (errors.addressDestination?.hasError) {
            runValidationTasks("addressDestination", value);
          }
          setAddressDestination(value);
        }}
        onBlur={() =>
          runValidationTasks("addressDestination", addressDestination)
        }
        errorMessage={errors.addressDestination?.errorMessage}
        hasError={errors.addressDestination?.hasError}
        {...getOverrideProps(overrides, "addressDestination")}
      ></TextAreaField>
      <TextAreaField
        label="Tx in"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              addressOrigin,
              addressDestination,
              txIn: value,
              txOutput,
              txCborhex,
              txHash,
              mint,
              scriptDataHash,
              metadataUrl,
              redeemer,
              fees,
              network,
              type,
              signed,
            };
            const result = onChange(modelFields);
            value = result?.txIn ?? value;
          }
          if (errors.txIn?.hasError) {
            runValidationTasks("txIn", value);
          }
          setTxIn(value);
        }}
        onBlur={() => runValidationTasks("txIn", txIn)}
        errorMessage={errors.txIn?.errorMessage}
        hasError={errors.txIn?.hasError}
        {...getOverrideProps(overrides, "txIn")}
      ></TextAreaField>
      <TextAreaField
        label="Tx output"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              addressOrigin,
              addressDestination,
              txIn,
              txOutput: value,
              txCborhex,
              txHash,
              mint,
              scriptDataHash,
              metadataUrl,
              redeemer,
              fees,
              network,
              type,
              signed,
            };
            const result = onChange(modelFields);
            value = result?.txOutput ?? value;
          }
          if (errors.txOutput?.hasError) {
            runValidationTasks("txOutput", value);
          }
          setTxOutput(value);
        }}
        onBlur={() => runValidationTasks("txOutput", txOutput)}
        errorMessage={errors.txOutput?.errorMessage}
        hasError={errors.txOutput?.hasError}
        {...getOverrideProps(overrides, "txOutput")}
      ></TextAreaField>
      <TextField
        label="Tx cborhex"
        isRequired={false}
        isReadOnly={false}
        value={txCborhex}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              addressOrigin,
              addressDestination,
              txIn,
              txOutput,
              txCborhex: value,
              txHash,
              mint,
              scriptDataHash,
              metadataUrl,
              redeemer,
              fees,
              network,
              type,
              signed,
            };
            const result = onChange(modelFields);
            value = result?.txCborhex ?? value;
          }
          if (errors.txCborhex?.hasError) {
            runValidationTasks("txCborhex", value);
          }
          setTxCborhex(value);
        }}
        onBlur={() => runValidationTasks("txCborhex", txCborhex)}
        errorMessage={errors.txCborhex?.errorMessage}
        hasError={errors.txCborhex?.hasError}
        {...getOverrideProps(overrides, "txCborhex")}
      ></TextField>
      <TextField
        label="Tx hash"
        isRequired={false}
        isReadOnly={false}
        value={txHash}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              addressOrigin,
              addressDestination,
              txIn,
              txOutput,
              txCborhex,
              txHash: value,
              mint,
              scriptDataHash,
              metadataUrl,
              redeemer,
              fees,
              network,
              type,
              signed,
            };
            const result = onChange(modelFields);
            value = result?.txHash ?? value;
          }
          if (errors.txHash?.hasError) {
            runValidationTasks("txHash", value);
          }
          setTxHash(value);
        }}
        onBlur={() => runValidationTasks("txHash", txHash)}
        errorMessage={errors.txHash?.errorMessage}
        hasError={errors.txHash?.hasError}
        {...getOverrideProps(overrides, "txHash")}
      ></TextField>
      <TextAreaField
        label="Mint"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              addressOrigin,
              addressDestination,
              txIn,
              txOutput,
              txCborhex,
              txHash,
              mint: value,
              scriptDataHash,
              metadataUrl,
              redeemer,
              fees,
              network,
              type,
              signed,
            };
            const result = onChange(modelFields);
            value = result?.mint ?? value;
          }
          if (errors.mint?.hasError) {
            runValidationTasks("mint", value);
          }
          setMint(value);
        }}
        onBlur={() => runValidationTasks("mint", mint)}
        errorMessage={errors.mint?.errorMessage}
        hasError={errors.mint?.hasError}
        {...getOverrideProps(overrides, "mint")}
      ></TextAreaField>
      <TextField
        label="Script data hash"
        isRequired={false}
        isReadOnly={false}
        value={scriptDataHash}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              addressOrigin,
              addressDestination,
              txIn,
              txOutput,
              txCborhex,
              txHash,
              mint,
              scriptDataHash: value,
              metadataUrl,
              redeemer,
              fees,
              network,
              type,
              signed,
            };
            const result = onChange(modelFields);
            value = result?.scriptDataHash ?? value;
          }
          if (errors.scriptDataHash?.hasError) {
            runValidationTasks("scriptDataHash", value);
          }
          setScriptDataHash(value);
        }}
        onBlur={() => runValidationTasks("scriptDataHash", scriptDataHash)}
        errorMessage={errors.scriptDataHash?.errorMessage}
        hasError={errors.scriptDataHash?.hasError}
        {...getOverrideProps(overrides, "scriptDataHash")}
      ></TextField>
      <TextField
        label="Metadata url"
        isRequired={false}
        isReadOnly={false}
        value={metadataUrl}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              addressOrigin,
              addressDestination,
              txIn,
              txOutput,
              txCborhex,
              txHash,
              mint,
              scriptDataHash,
              metadataUrl: value,
              redeemer,
              fees,
              network,
              type,
              signed,
            };
            const result = onChange(modelFields);
            value = result?.metadataUrl ?? value;
          }
          if (errors.metadataUrl?.hasError) {
            runValidationTasks("metadataUrl", value);
          }
          setMetadataUrl(value);
        }}
        onBlur={() => runValidationTasks("metadataUrl", metadataUrl)}
        errorMessage={errors.metadataUrl?.errorMessage}
        hasError={errors.metadataUrl?.hasError}
        {...getOverrideProps(overrides, "metadataUrl")}
      ></TextField>
      <TextField
        label="Redeemer"
        isRequired={false}
        isReadOnly={false}
        value={redeemer}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              addressOrigin,
              addressDestination,
              txIn,
              txOutput,
              txCborhex,
              txHash,
              mint,
              scriptDataHash,
              metadataUrl,
              redeemer: value,
              fees,
              network,
              type,
              signed,
            };
            const result = onChange(modelFields);
            value = result?.redeemer ?? value;
          }
          if (errors.redeemer?.hasError) {
            runValidationTasks("redeemer", value);
          }
          setRedeemer(value);
        }}
        onBlur={() => runValidationTasks("redeemer", redeemer)}
        errorMessage={errors.redeemer?.errorMessage}
        hasError={errors.redeemer?.hasError}
        {...getOverrideProps(overrides, "redeemer")}
      ></TextField>
      <TextField
        label="Fees"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={fees}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              addressOrigin,
              addressDestination,
              txIn,
              txOutput,
              txCborhex,
              txHash,
              mint,
              scriptDataHash,
              metadataUrl,
              redeemer,
              fees: value,
              network,
              type,
              signed,
            };
            const result = onChange(modelFields);
            value = result?.fees ?? value;
          }
          if (errors.fees?.hasError) {
            runValidationTasks("fees", value);
          }
          setFees(value);
        }}
        onBlur={() => runValidationTasks("fees", fees)}
        errorMessage={errors.fees?.errorMessage}
        hasError={errors.fees?.hasError}
        {...getOverrideProps(overrides, "fees")}
      ></TextField>
      <TextField
        label="Network"
        isRequired={false}
        isReadOnly={false}
        value={network}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              addressOrigin,
              addressDestination,
              txIn,
              txOutput,
              txCborhex,
              txHash,
              mint,
              scriptDataHash,
              metadataUrl,
              redeemer,
              fees,
              network: value,
              type,
              signed,
            };
            const result = onChange(modelFields);
            value = result?.network ?? value;
          }
          if (errors.network?.hasError) {
            runValidationTasks("network", value);
          }
          setNetwork(value);
        }}
        onBlur={() => runValidationTasks("network", network)}
        errorMessage={errors.network?.errorMessage}
        hasError={errors.network?.hasError}
        {...getOverrideProps(overrides, "network")}
      ></TextField>
      <TextField
        label="Type"
        isRequired={false}
        isReadOnly={false}
        value={type}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              addressOrigin,
              addressDestination,
              txIn,
              txOutput,
              txCborhex,
              txHash,
              mint,
              scriptDataHash,
              metadataUrl,
              redeemer,
              fees,
              network,
              type: value,
              signed,
            };
            const result = onChange(modelFields);
            value = result?.type ?? value;
          }
          if (errors.type?.hasError) {
            runValidationTasks("type", value);
          }
          setType(value);
        }}
        onBlur={() => runValidationTasks("type", type)}
        errorMessage={errors.type?.errorMessage}
        hasError={errors.type?.hasError}
        {...getOverrideProps(overrides, "type")}
      ></TextField>
      <SwitchField
        label="Signed"
        defaultChecked={false}
        isDisabled={false}
        isChecked={signed}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              addressOrigin,
              addressDestination,
              txIn,
              txOutput,
              txCborhex,
              txHash,
              mint,
              scriptDataHash,
              metadataUrl,
              redeemer,
              fees,
              network,
              type,
              signed: value,
            };
            const result = onChange(modelFields);
            value = result?.signed ?? value;
          }
          if (errors.signed?.hasError) {
            runValidationTasks("signed", value);
          }
          setSigned(value);
        }}
        onBlur={() => runValidationTasks("signed", signed)}
        errorMessage={errors.signed?.errorMessage}
        hasError={errors.signed?.hasError}
        {...getOverrideProps(overrides, "signed")}
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
