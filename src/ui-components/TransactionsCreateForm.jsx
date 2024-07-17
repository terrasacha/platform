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
    txCborhex: "",
    txHash: "",
    metadataUrl: "",
    fees: "",
    network: "",
    txProcessed: false,
    type: "",
    tokenName: "",
    amountOfTokens: "",
    policyID: "",
    stakeAddress: "",
  };
  const [addressOrigin, setAddressOrigin] = React.useState(
    initialValues.addressOrigin
  );
  const [addressDestination, setAddressDestination] = React.useState(
    initialValues.addressDestination
  );
  const [txIn, setTxIn] = React.useState(initialValues.txIn);
  const [txCborhex, setTxCborhex] = React.useState(initialValues.txCborhex);
  const [txHash, setTxHash] = React.useState(initialValues.txHash);
  const [metadataUrl, setMetadataUrl] = React.useState(
    initialValues.metadataUrl
  );
  const [fees, setFees] = React.useState(initialValues.fees);
  const [network, setNetwork] = React.useState(initialValues.network);
  const [txProcessed, setTxProcessed] = React.useState(
    initialValues.txProcessed
  );
  const [type, setType] = React.useState(initialValues.type);
  const [tokenName, setTokenName] = React.useState(initialValues.tokenName);
  const [amountOfTokens, setAmountOfTokens] = React.useState(
    initialValues.amountOfTokens
  );
  const [policyID, setPolicyID] = React.useState(initialValues.policyID);
  const [stakeAddress, setStakeAddress] = React.useState(
    initialValues.stakeAddress
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setAddressOrigin(initialValues.addressOrigin);
    setAddressDestination(initialValues.addressDestination);
    setTxIn(initialValues.txIn);
    setTxCborhex(initialValues.txCborhex);
    setTxHash(initialValues.txHash);
    setMetadataUrl(initialValues.metadataUrl);
    setFees(initialValues.fees);
    setNetwork(initialValues.network);
    setTxProcessed(initialValues.txProcessed);
    setType(initialValues.type);
    setTokenName(initialValues.tokenName);
    setAmountOfTokens(initialValues.amountOfTokens);
    setPolicyID(initialValues.policyID);
    setStakeAddress(initialValues.stakeAddress);
    setErrors({});
  };
  const validations = {
    addressOrigin: [],
    addressDestination: [],
    txIn: [],
    txCborhex: [],
    txHash: [],
    metadataUrl: [{ type: "JSON" }],
    fees: [],
    network: [],
    txProcessed: [],
    type: [],
    tokenName: [],
    amountOfTokens: [],
    policyID: [],
    stakeAddress: [],
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
          txCborhex,
          txHash,
          metadataUrl,
          fees,
          network,
          txProcessed,
          type,
          tokenName,
          amountOfTokens,
          policyID,
          stakeAddress,
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
              txCborhex,
              txHash,
              metadataUrl,
              fees,
              network,
              txProcessed,
              type,
              tokenName,
              amountOfTokens,
              policyID,
              stakeAddress,
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
      <TextField
        label="Address destination"
        isRequired={false}
        isReadOnly={false}
        value={addressDestination}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              addressOrigin,
              addressDestination: value,
              txIn,
              txCborhex,
              txHash,
              metadataUrl,
              fees,
              network,
              txProcessed,
              type,
              tokenName,
              amountOfTokens,
              policyID,
              stakeAddress,
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
      ></TextField>
      <TextField
        label="Tx in"
        isRequired={false}
        isReadOnly={false}
        value={txIn}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              addressOrigin,
              addressDestination,
              txIn: value,
              txCborhex,
              txHash,
              metadataUrl,
              fees,
              network,
              txProcessed,
              type,
              tokenName,
              amountOfTokens,
              policyID,
              stakeAddress,
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
      ></TextField>
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
              txCborhex: value,
              txHash,
              metadataUrl,
              fees,
              network,
              txProcessed,
              type,
              tokenName,
              amountOfTokens,
              policyID,
              stakeAddress,
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
              txCborhex,
              txHash: value,
              metadataUrl,
              fees,
              network,
              txProcessed,
              type,
              tokenName,
              amountOfTokens,
              policyID,
              stakeAddress,
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
        label="Metadata url"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              addressOrigin,
              addressDestination,
              txIn,
              txCborhex,
              txHash,
              metadataUrl: value,
              fees,
              network,
              txProcessed,
              type,
              tokenName,
              amountOfTokens,
              policyID,
              stakeAddress,
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
      ></TextAreaField>
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
              txCborhex,
              txHash,
              metadataUrl,
              fees: value,
              network,
              txProcessed,
              type,
              tokenName,
              amountOfTokens,
              policyID,
              stakeAddress,
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
              txCborhex,
              txHash,
              metadataUrl,
              fees,
              network: value,
              txProcessed,
              type,
              tokenName,
              amountOfTokens,
              policyID,
              stakeAddress,
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
      <SwitchField
        label="Tx processed"
        defaultChecked={false}
        isDisabled={false}
        isChecked={txProcessed}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              addressOrigin,
              addressDestination,
              txIn,
              txCborhex,
              txHash,
              metadataUrl,
              fees,
              network,
              txProcessed: value,
              type,
              tokenName,
              amountOfTokens,
              policyID,
              stakeAddress,
            };
            const result = onChange(modelFields);
            value = result?.txProcessed ?? value;
          }
          if (errors.txProcessed?.hasError) {
            runValidationTasks("txProcessed", value);
          }
          setTxProcessed(value);
        }}
        onBlur={() => runValidationTasks("txProcessed", txProcessed)}
        errorMessage={errors.txProcessed?.errorMessage}
        hasError={errors.txProcessed?.hasError}
        {...getOverrideProps(overrides, "txProcessed")}
      ></SwitchField>
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
              txCborhex,
              txHash,
              metadataUrl,
              fees,
              network,
              txProcessed,
              type: value,
              tokenName,
              amountOfTokens,
              policyID,
              stakeAddress,
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
      <TextField
        label="Token name"
        isRequired={false}
        isReadOnly={false}
        value={tokenName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              addressOrigin,
              addressDestination,
              txIn,
              txCborhex,
              txHash,
              metadataUrl,
              fees,
              network,
              txProcessed,
              type,
              tokenName: value,
              amountOfTokens,
              policyID,
              stakeAddress,
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
        label="Amount of tokens"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={amountOfTokens}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              addressOrigin,
              addressDestination,
              txIn,
              txCborhex,
              txHash,
              metadataUrl,
              fees,
              network,
              txProcessed,
              type,
              tokenName,
              amountOfTokens: value,
              policyID,
              stakeAddress,
            };
            const result = onChange(modelFields);
            value = result?.amountOfTokens ?? value;
          }
          if (errors.amountOfTokens?.hasError) {
            runValidationTasks("amountOfTokens", value);
          }
          setAmountOfTokens(value);
        }}
        onBlur={() => runValidationTasks("amountOfTokens", amountOfTokens)}
        errorMessage={errors.amountOfTokens?.errorMessage}
        hasError={errors.amountOfTokens?.hasError}
        {...getOverrideProps(overrides, "amountOfTokens")}
      ></TextField>
      <TextField
        label="Policy id"
        isRequired={false}
        isReadOnly={false}
        value={policyID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              addressOrigin,
              addressDestination,
              txIn,
              txCborhex,
              txHash,
              metadataUrl,
              fees,
              network,
              txProcessed,
              type,
              tokenName,
              amountOfTokens,
              policyID: value,
              stakeAddress,
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
        label="Stake address"
        isRequired={false}
        isReadOnly={false}
        value={stakeAddress}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              addressOrigin,
              addressDestination,
              txIn,
              txCborhex,
              txHash,
              metadataUrl,
              fees,
              network,
              txProcessed,
              type,
              tokenName,
              amountOfTokens,
              policyID,
              stakeAddress: value,
            };
            const result = onChange(modelFields);
            value = result?.stakeAddress ?? value;
          }
          if (errors.stakeAddress?.hasError) {
            runValidationTasks("stakeAddress", value);
          }
          setStakeAddress(value);
        }}
        onBlur={() => runValidationTasks("stakeAddress", stakeAddress)}
        errorMessage={errors.stakeAddress?.errorMessage}
        hasError={errors.stakeAddress?.hasError}
        {...getOverrideProps(overrides, "stakeAddress")}
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
