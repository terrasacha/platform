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
import { createPayment } from "../graphql/mutations";
export default function PaymentCreateForm(props) {
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
    orderType: "",
    ref: "",
    walletAddress: "",
    statusCode: "",
    walletStakeAddress: "",
    tokenName: "",
    tokenAmount: "",
    fee: "",
    baseValue: "",
    finalValue: "",
    currency: "",
    exchangeRate: "",
    timestamp: "",
    claimedByUser: false,
  };
  const [orderType, setOrderType] = React.useState(initialValues.orderType);
  const [ref, setRef] = React.useState(initialValues.ref);
  const [walletAddress, setWalletAddress] = React.useState(
    initialValues.walletAddress
  );
  const [statusCode, setStatusCode] = React.useState(initialValues.statusCode);
  const [walletStakeAddress, setWalletStakeAddress] = React.useState(
    initialValues.walletStakeAddress
  );
  const [tokenName, setTokenName] = React.useState(initialValues.tokenName);
  const [tokenAmount, setTokenAmount] = React.useState(
    initialValues.tokenAmount
  );
  const [fee, setFee] = React.useState(initialValues.fee);
  const [baseValue, setBaseValue] = React.useState(initialValues.baseValue);
  const [finalValue, setFinalValue] = React.useState(initialValues.finalValue);
  const [currency, setCurrency] = React.useState(initialValues.currency);
  const [exchangeRate, setExchangeRate] = React.useState(
    initialValues.exchangeRate
  );
  const [timestamp, setTimestamp] = React.useState(initialValues.timestamp);
  const [claimedByUser, setClaimedByUser] = React.useState(
    initialValues.claimedByUser
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setOrderType(initialValues.orderType);
    setRef(initialValues.ref);
    setWalletAddress(initialValues.walletAddress);
    setStatusCode(initialValues.statusCode);
    setWalletStakeAddress(initialValues.walletStakeAddress);
    setTokenName(initialValues.tokenName);
    setTokenAmount(initialValues.tokenAmount);
    setFee(initialValues.fee);
    setBaseValue(initialValues.baseValue);
    setFinalValue(initialValues.finalValue);
    setCurrency(initialValues.currency);
    setExchangeRate(initialValues.exchangeRate);
    setTimestamp(initialValues.timestamp);
    setClaimedByUser(initialValues.claimedByUser);
    setErrors({});
  };
  const validations = {
    orderType: [],
    ref: [],
    walletAddress: [],
    statusCode: [],
    walletStakeAddress: [],
    tokenName: [],
    tokenAmount: [],
    fee: [],
    baseValue: [],
    finalValue: [],
    currency: [],
    exchangeRate: [],
    timestamp: [],
    claimedByUser: [],
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
          orderType,
          ref,
          walletAddress,
          statusCode,
          walletStakeAddress,
          tokenName,
          tokenAmount,
          fee,
          baseValue,
          finalValue,
          currency,
          exchangeRate,
          timestamp,
          claimedByUser,
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
            query: createPayment.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "PaymentCreateForm")}
      {...rest}
    >
      <TextField
        label="Order type"
        isRequired={false}
        isReadOnly={false}
        value={orderType}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              orderType: value,
              ref,
              walletAddress,
              statusCode,
              walletStakeAddress,
              tokenName,
              tokenAmount,
              fee,
              baseValue,
              finalValue,
              currency,
              exchangeRate,
              timestamp,
              claimedByUser,
            };
            const result = onChange(modelFields);
            value = result?.orderType ?? value;
          }
          if (errors.orderType?.hasError) {
            runValidationTasks("orderType", value);
          }
          setOrderType(value);
        }}
        onBlur={() => runValidationTasks("orderType", orderType)}
        errorMessage={errors.orderType?.errorMessage}
        hasError={errors.orderType?.hasError}
        {...getOverrideProps(overrides, "orderType")}
      ></TextField>
      <TextField
        label="Ref"
        isRequired={false}
        isReadOnly={false}
        value={ref}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              orderType,
              ref: value,
              walletAddress,
              statusCode,
              walletStakeAddress,
              tokenName,
              tokenAmount,
              fee,
              baseValue,
              finalValue,
              currency,
              exchangeRate,
              timestamp,
              claimedByUser,
            };
            const result = onChange(modelFields);
            value = result?.ref ?? value;
          }
          if (errors.ref?.hasError) {
            runValidationTasks("ref", value);
          }
          setRef(value);
        }}
        onBlur={() => runValidationTasks("ref", ref)}
        errorMessage={errors.ref?.errorMessage}
        hasError={errors.ref?.hasError}
        {...getOverrideProps(overrides, "ref")}
      ></TextField>
      <TextField
        label="Wallet address"
        isRequired={false}
        isReadOnly={false}
        value={walletAddress}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              orderType,
              ref,
              walletAddress: value,
              statusCode,
              walletStakeAddress,
              tokenName,
              tokenAmount,
              fee,
              baseValue,
              finalValue,
              currency,
              exchangeRate,
              timestamp,
              claimedByUser,
            };
            const result = onChange(modelFields);
            value = result?.walletAddress ?? value;
          }
          if (errors.walletAddress?.hasError) {
            runValidationTasks("walletAddress", value);
          }
          setWalletAddress(value);
        }}
        onBlur={() => runValidationTasks("walletAddress", walletAddress)}
        errorMessage={errors.walletAddress?.errorMessage}
        hasError={errors.walletAddress?.hasError}
        {...getOverrideProps(overrides, "walletAddress")}
      ></TextField>
      <TextField
        label="Status code"
        isRequired={false}
        isReadOnly={false}
        value={statusCode}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              orderType,
              ref,
              walletAddress,
              statusCode: value,
              walletStakeAddress,
              tokenName,
              tokenAmount,
              fee,
              baseValue,
              finalValue,
              currency,
              exchangeRate,
              timestamp,
              claimedByUser,
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
        label="Wallet stake address"
        isRequired={false}
        isReadOnly={false}
        value={walletStakeAddress}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              orderType,
              ref,
              walletAddress,
              statusCode,
              walletStakeAddress: value,
              tokenName,
              tokenAmount,
              fee,
              baseValue,
              finalValue,
              currency,
              exchangeRate,
              timestamp,
              claimedByUser,
            };
            const result = onChange(modelFields);
            value = result?.walletStakeAddress ?? value;
          }
          if (errors.walletStakeAddress?.hasError) {
            runValidationTasks("walletStakeAddress", value);
          }
          setWalletStakeAddress(value);
        }}
        onBlur={() =>
          runValidationTasks("walletStakeAddress", walletStakeAddress)
        }
        errorMessage={errors.walletStakeAddress?.errorMessage}
        hasError={errors.walletStakeAddress?.hasError}
        {...getOverrideProps(overrides, "walletStakeAddress")}
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
              orderType,
              ref,
              walletAddress,
              statusCode,
              walletStakeAddress,
              tokenName: value,
              tokenAmount,
              fee,
              baseValue,
              finalValue,
              currency,
              exchangeRate,
              timestamp,
              claimedByUser,
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
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              orderType,
              ref,
              walletAddress,
              statusCode,
              walletStakeAddress,
              tokenName,
              tokenAmount: value,
              fee,
              baseValue,
              finalValue,
              currency,
              exchangeRate,
              timestamp,
              claimedByUser,
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
        label="Fee"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={fee}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              orderType,
              ref,
              walletAddress,
              statusCode,
              walletStakeAddress,
              tokenName,
              tokenAmount,
              fee: value,
              baseValue,
              finalValue,
              currency,
              exchangeRate,
              timestamp,
              claimedByUser,
            };
            const result = onChange(modelFields);
            value = result?.fee ?? value;
          }
          if (errors.fee?.hasError) {
            runValidationTasks("fee", value);
          }
          setFee(value);
        }}
        onBlur={() => runValidationTasks("fee", fee)}
        errorMessage={errors.fee?.errorMessage}
        hasError={errors.fee?.hasError}
        {...getOverrideProps(overrides, "fee")}
      ></TextField>
      <TextField
        label="Base value"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={baseValue}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              orderType,
              ref,
              walletAddress,
              statusCode,
              walletStakeAddress,
              tokenName,
              tokenAmount,
              fee,
              baseValue: value,
              finalValue,
              currency,
              exchangeRate,
              timestamp,
              claimedByUser,
            };
            const result = onChange(modelFields);
            value = result?.baseValue ?? value;
          }
          if (errors.baseValue?.hasError) {
            runValidationTasks("baseValue", value);
          }
          setBaseValue(value);
        }}
        onBlur={() => runValidationTasks("baseValue", baseValue)}
        errorMessage={errors.baseValue?.errorMessage}
        hasError={errors.baseValue?.hasError}
        {...getOverrideProps(overrides, "baseValue")}
      ></TextField>
      <TextField
        label="Final value"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={finalValue}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              orderType,
              ref,
              walletAddress,
              statusCode,
              walletStakeAddress,
              tokenName,
              tokenAmount,
              fee,
              baseValue,
              finalValue: value,
              currency,
              exchangeRate,
              timestamp,
              claimedByUser,
            };
            const result = onChange(modelFields);
            value = result?.finalValue ?? value;
          }
          if (errors.finalValue?.hasError) {
            runValidationTasks("finalValue", value);
          }
          setFinalValue(value);
        }}
        onBlur={() => runValidationTasks("finalValue", finalValue)}
        errorMessage={errors.finalValue?.errorMessage}
        hasError={errors.finalValue?.hasError}
        {...getOverrideProps(overrides, "finalValue")}
      ></TextField>
      <TextField
        label="Currency"
        isRequired={false}
        isReadOnly={false}
        value={currency}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              orderType,
              ref,
              walletAddress,
              statusCode,
              walletStakeAddress,
              tokenName,
              tokenAmount,
              fee,
              baseValue,
              finalValue,
              currency: value,
              exchangeRate,
              timestamp,
              claimedByUser,
            };
            const result = onChange(modelFields);
            value = result?.currency ?? value;
          }
          if (errors.currency?.hasError) {
            runValidationTasks("currency", value);
          }
          setCurrency(value);
        }}
        onBlur={() => runValidationTasks("currency", currency)}
        errorMessage={errors.currency?.errorMessage}
        hasError={errors.currency?.hasError}
        {...getOverrideProps(overrides, "currency")}
      ></TextField>
      <TextField
        label="Exchange rate"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={exchangeRate}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              orderType,
              ref,
              walletAddress,
              statusCode,
              walletStakeAddress,
              tokenName,
              tokenAmount,
              fee,
              baseValue,
              finalValue,
              currency,
              exchangeRate: value,
              timestamp,
              claimedByUser,
            };
            const result = onChange(modelFields);
            value = result?.exchangeRate ?? value;
          }
          if (errors.exchangeRate?.hasError) {
            runValidationTasks("exchangeRate", value);
          }
          setExchangeRate(value);
        }}
        onBlur={() => runValidationTasks("exchangeRate", exchangeRate)}
        errorMessage={errors.exchangeRate?.errorMessage}
        hasError={errors.exchangeRate?.hasError}
        {...getOverrideProps(overrides, "exchangeRate")}
      ></TextField>
      <TextField
        label="Timestamp"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={timestamp && convertToLocal(convertTimeStampToDate(timestamp))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : Number(new Date(e.target.value));
          if (onChange) {
            const modelFields = {
              orderType,
              ref,
              walletAddress,
              statusCode,
              walletStakeAddress,
              tokenName,
              tokenAmount,
              fee,
              baseValue,
              finalValue,
              currency,
              exchangeRate,
              timestamp: value,
              claimedByUser,
            };
            const result = onChange(modelFields);
            value = result?.timestamp ?? value;
          }
          if (errors.timestamp?.hasError) {
            runValidationTasks("timestamp", value);
          }
          setTimestamp(value);
        }}
        onBlur={() => runValidationTasks("timestamp", timestamp)}
        errorMessage={errors.timestamp?.errorMessage}
        hasError={errors.timestamp?.hasError}
        {...getOverrideProps(overrides, "timestamp")}
      ></TextField>
      <SwitchField
        label="Claimed by user"
        defaultChecked={false}
        isDisabled={false}
        isChecked={claimedByUser}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              orderType,
              ref,
              walletAddress,
              statusCode,
              walletStakeAddress,
              tokenName,
              tokenAmount,
              fee,
              baseValue,
              finalValue,
              currency,
              exchangeRate,
              timestamp,
              claimedByUser: value,
            };
            const result = onChange(modelFields);
            value = result?.claimedByUser ?? value;
          }
          if (errors.claimedByUser?.hasError) {
            runValidationTasks("claimedByUser", value);
          }
          setClaimedByUser(value);
        }}
        onBlur={() => runValidationTasks("claimedByUser", claimedByUser)}
        errorMessage={errors.claimedByUser?.errorMessage}
        hasError={errors.claimedByUser?.hasError}
        {...getOverrideProps(overrides, "claimedByUser")}
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
