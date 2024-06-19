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
import { createWallet } from "../graphql/mutations";
export default function WalletCreateForm(props) {
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
    name: "",
    status: "",
    password: "",
    seed: "",
    address: "",
    stake_address: "",
    isSelected: false,
    isAdmin: false,
    claimed_token: false,
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
  const [claimed_token, setClaimed_token] = React.useState(
    initialValues.claimed_token
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setName(initialValues.name);
    setStatus(initialValues.status);
    setPassword(initialValues.password);
    setSeed(initialValues.seed);
    setAddress(initialValues.address);
    setStake_address(initialValues.stake_address);
    setIsSelected(initialValues.isSelected);
    setIsAdmin(initialValues.isAdmin);
    setClaimed_token(initialValues.claimed_token);
    setErrors({});
  };
  const validations = {
    name: [],
    status: [],
    password: [],
    seed: [],
    address: [{ type: "Required" }],
    stake_address: [{ type: "Required" }],
    isSelected: [],
    isAdmin: [],
    claimed_token: [],
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
          name,
          status,
          password,
          seed,
          address,
          stake_address,
          isSelected,
          isAdmin,
          claimed_token,
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
            query: createWallet.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "WalletCreateForm")}
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
              claimed_token,
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
              claimed_token,
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
              claimed_token,
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
              claimed_token,
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
              claimed_token,
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
              claimed_token,
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
              claimed_token,
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
              claimed_token,
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
      <SwitchField
        label="Claimed token"
        defaultChecked={false}
        isDisabled={false}
        isChecked={claimed_token}
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
              isAdmin,
              claimed_token: value,
            };
            const result = onChange(modelFields);
            value = result?.claimed_token ?? value;
          }
          if (errors.claimed_token?.hasError) {
            runValidationTasks("claimed_token", value);
          }
          setClaimed_token(value);
        }}
        onBlur={() => runValidationTasks("claimed_token", claimed_token)}
        errorMessage={errors.claimed_token?.errorMessage}
        hasError={errors.claimed_token?.hasError}
        {...getOverrideProps(overrides, "claimed_token")}
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
