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
import { getWallet } from "../graphql/queries";
import { updateWallet } from "../graphql/mutations";
export default function WalletUpdateForm(props) {
  const {
    id: idProp,
    wallet: walletModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    name: "",
    status: "",
    password: "",
    seed: "",
    address: "",
    stake_address: "",
    isSelected: false,
    isAdmin: false,
  };
  const [name, setName] = React.useState(initialValues.name);
  const [status, setStatus] = React.useState(initialValues.status);
  const [password, setPassword] = React.useState(initialValues.password);
  const [seed, setSeed] = React.useState(initialValues.seed);
  const [address, setAddress] = React.useState(initialValues.address);
  const [stake_address, setStake_address] = React.useState(
    initialValues.stake_address
  );
  const [isSelected, setIsSelected] = React.useState(initialValues.isSelected);
  const [isAdmin, setIsAdmin] = React.useState(initialValues.isAdmin);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = walletRecord
      ? { ...initialValues, ...walletRecord }
      : initialValues;
    setName(cleanValues.name);
    setStatus(cleanValues.status);
    setPassword(cleanValues.password);
    setSeed(cleanValues.seed);
    setAddress(cleanValues.address);
    setStake_address(cleanValues.stake_address);
    setIsSelected(cleanValues.isSelected);
    setIsAdmin(cleanValues.isAdmin);
    setErrors({});
  };
  const [walletRecord, setWalletRecord] = React.useState(walletModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await API.graphql({
              query: getWallet.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getWallet
        : walletModelProp;
      setWalletRecord(record);
    };
    queryData();
  }, [idProp, walletModelProp]);
  React.useEffect(resetStateValues, [walletRecord]);
  const validations = {
    name: [],
    status: [],
    password: [],
    seed: [],
    address: [{ type: "Required" }],
    stake_address: [{ type: "Required" }],
    isSelected: [],
    isAdmin: [],
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
          name: name ?? null,
          status: status ?? null,
          password: password ?? null,
          seed: seed ?? null,
          address,
          stake_address,
          isSelected: isSelected ?? null,
          isAdmin: isAdmin ?? null,
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
            query: updateWallet.replaceAll("__typename", ""),
            variables: {
              input: {
                id: walletRecord.id,
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
      {...getOverrideProps(overrides, "WalletUpdateForm")}
      {...rest}
    >
      <TextField
        label="Name"
        isRequired={false}
        isReadOnly={false}
        value={name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name: value,
              status,
              password,
              seed,
              address,
              stake_address,
              isSelected,
              isAdmin,
            };
            const result = onChange(modelFields);
            value = result?.name ?? value;
          }
          if (errors.name?.hasError) {
            runValidationTasks("name", value);
          }
          setName(value);
        }}
        onBlur={() => runValidationTasks("name", name)}
        errorMessage={errors.name?.errorMessage}
        hasError={errors.name?.hasError}
        {...getOverrideProps(overrides, "name")}
      ></TextField>
      <TextField
        label="Status"
        isRequired={false}
        isReadOnly={false}
        value={status}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              status: value,
              password,
              seed,
              address,
              stake_address,
              isSelected,
              isAdmin,
            };
            const result = onChange(modelFields);
            value = result?.status ?? value;
          }
          if (errors.status?.hasError) {
            runValidationTasks("status", value);
          }
          setStatus(value);
        }}
        onBlur={() => runValidationTasks("status", status)}
        errorMessage={errors.status?.errorMessage}
        hasError={errors.status?.hasError}
        {...getOverrideProps(overrides, "status")}
      ></TextField>
      <TextField
        label="Password"
        isRequired={false}
        isReadOnly={false}
        value={password}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              status,
              password: value,
              seed,
              address,
              stake_address,
              isSelected,
              isAdmin,
            };
            const result = onChange(modelFields);
            value = result?.password ?? value;
          }
          if (errors.password?.hasError) {
            runValidationTasks("password", value);
          }
          setPassword(value);
        }}
        onBlur={() => runValidationTasks("password", password)}
        errorMessage={errors.password?.errorMessage}
        hasError={errors.password?.hasError}
        {...getOverrideProps(overrides, "password")}
      ></TextField>
      <TextField
        label="Seed"
        isRequired={false}
        isReadOnly={false}
        value={seed}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              status,
              password,
              seed: value,
              address,
              stake_address,
              isSelected,
              isAdmin,
            };
            const result = onChange(modelFields);
            value = result?.seed ?? value;
          }
          if (errors.seed?.hasError) {
            runValidationTasks("seed", value);
          }
          setSeed(value);
        }}
        onBlur={() => runValidationTasks("seed", seed)}
        errorMessage={errors.seed?.errorMessage}
        hasError={errors.seed?.hasError}
        {...getOverrideProps(overrides, "seed")}
      ></TextField>
      <TextField
        label="Address"
        isRequired={true}
        isReadOnly={false}
        value={address}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              status,
              password,
              seed,
              address: value,
              stake_address,
              isSelected,
              isAdmin,
            };
            const result = onChange(modelFields);
            value = result?.address ?? value;
          }
          if (errors.address?.hasError) {
            runValidationTasks("address", value);
          }
          setAddress(value);
        }}
        onBlur={() => runValidationTasks("address", address)}
        errorMessage={errors.address?.errorMessage}
        hasError={errors.address?.hasError}
        {...getOverrideProps(overrides, "address")}
      ></TextField>
      <TextField
        label="Stake address"
        isRequired={true}
        isReadOnly={false}
        value={stake_address}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              status,
              password,
              seed,
              address,
              stake_address: value,
              isSelected,
              isAdmin,
            };
            const result = onChange(modelFields);
            value = result?.stake_address ?? value;
          }
          if (errors.stake_address?.hasError) {
            runValidationTasks("stake_address", value);
          }
          setStake_address(value);
        }}
        onBlur={() => runValidationTasks("stake_address", stake_address)}
        errorMessage={errors.stake_address?.errorMessage}
        hasError={errors.stake_address?.hasError}
        {...getOverrideProps(overrides, "stake_address")}
      ></TextField>
      <SwitchField
        label="Is selected"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isSelected}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              name,
              status,
              password,
              seed,
              address,
              stake_address,
              isSelected: value,
              isAdmin,
            };
            const result = onChange(modelFields);
            value = result?.isSelected ?? value;
          }
          if (errors.isSelected?.hasError) {
            runValidationTasks("isSelected", value);
          }
          setIsSelected(value);
        }}
        onBlur={() => runValidationTasks("isSelected", isSelected)}
        errorMessage={errors.isSelected?.errorMessage}
        hasError={errors.isSelected?.hasError}
        {...getOverrideProps(overrides, "isSelected")}
      ></SwitchField>
      <SwitchField
        label="Is admin"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isAdmin}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              name,
              status,
              password,
              seed,
              address,
              stake_address,
              isSelected,
              isAdmin: value,
            };
            const result = onChange(modelFields);
            value = result?.isAdmin ?? value;
          }
          if (errors.isAdmin?.hasError) {
            runValidationTasks("isAdmin", value);
          }
          setIsAdmin(value);
        }}
        onBlur={() => runValidationTasks("isAdmin", isAdmin)}
        errorMessage={errors.isAdmin?.errorMessage}
        hasError={errors.isAdmin?.hasError}
        {...getOverrideProps(overrides, "isAdmin")}
      ></SwitchField>
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
          isDisabled={!(idProp || walletModelProp)}
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
              !(idProp || walletModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
