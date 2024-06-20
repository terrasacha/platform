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
import { createUser } from "../graphql/mutations";
export default function UserCreateForm(props) {
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
    dateOfBirth: "",
    isProfileUpdated: false,
    isValidatedStep1: false,
    isValidatedStep2: false,
    addresss: "",
    cellphone: "",
    role: "",
    subrole: "",
    status: "",
    email: "",
  };
  const [name, setName] = React.useState(initialValues.name);
  const [dateOfBirth, setDateOfBirth] = React.useState(
    initialValues.dateOfBirth
  );
  const [isProfileUpdated, setIsProfileUpdated] = React.useState(
    initialValues.isProfileUpdated
  );
  const [isValidatedStep1, setIsValidatedStep1] = React.useState(
    initialValues.isValidatedStep1
  );
  const [isValidatedStep2, setIsValidatedStep2] = React.useState(
    initialValues.isValidatedStep2
  );
  const [addresss, setAddresss] = React.useState(initialValues.addresss);
  const [cellphone, setCellphone] = React.useState(initialValues.cellphone);
  const [role, setRole] = React.useState(initialValues.role);
  const [subrole, setSubrole] = React.useState(initialValues.subrole);
  const [status, setStatus] = React.useState(initialValues.status);
  const [email, setEmail] = React.useState(initialValues.email);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setName(initialValues.name);
    setDateOfBirth(initialValues.dateOfBirth);
    setIsProfileUpdated(initialValues.isProfileUpdated);
    setIsValidatedStep1(initialValues.isValidatedStep1);
    setIsValidatedStep2(initialValues.isValidatedStep2);
    setAddresss(initialValues.addresss);
    setCellphone(initialValues.cellphone);
    setRole(initialValues.role);
    setSubrole(initialValues.subrole);
    setStatus(initialValues.status);
    setEmail(initialValues.email);
    setErrors({});
  };
  const validations = {
    name: [{ type: "Required" }],
    dateOfBirth: [],
    isProfileUpdated: [{ type: "Required" }],
    isValidatedStep1: [],
    isValidatedStep2: [],
    addresss: [],
    cellphone: [{ type: "Phone" }],
    role: [{ type: "Required" }],
    subrole: [],
    status: [],
    email: [{ type: "Email" }],
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
          dateOfBirth,
          isProfileUpdated,
          isValidatedStep1,
          isValidatedStep2,
          addresss,
          cellphone,
          role,
          subrole,
          status,
          email,
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
            query: createUser.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "UserCreateForm")}
      {...rest}
    >
      <TextField
        label="Name"
        isRequired={true}
        isReadOnly={false}
        value={name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name: value,
              dateOfBirth,
              isProfileUpdated,
              isValidatedStep1,
              isValidatedStep2,
              addresss,
              cellphone,
              role,
              subrole,
              status,
              email,
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
        label="Date of birth"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={dateOfBirth}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              dateOfBirth: value,
              isProfileUpdated,
              isValidatedStep1,
              isValidatedStep2,
              addresss,
              cellphone,
              role,
              subrole,
              status,
              email,
            };
            const result = onChange(modelFields);
            value = result?.dateOfBirth ?? value;
          }
          if (errors.dateOfBirth?.hasError) {
            runValidationTasks("dateOfBirth", value);
          }
          setDateOfBirth(value);
        }}
        onBlur={() => runValidationTasks("dateOfBirth", dateOfBirth)}
        errorMessage={errors.dateOfBirth?.errorMessage}
        hasError={errors.dateOfBirth?.hasError}
        {...getOverrideProps(overrides, "dateOfBirth")}
      ></TextField>
      <SwitchField
        label="Is profile updated"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isProfileUpdated}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              name,
              dateOfBirth,
              isProfileUpdated: value,
              isValidatedStep1,
              isValidatedStep2,
              addresss,
              cellphone,
              role,
              subrole,
              status,
              email,
            };
            const result = onChange(modelFields);
            value = result?.isProfileUpdated ?? value;
          }
          if (errors.isProfileUpdated?.hasError) {
            runValidationTasks("isProfileUpdated", value);
          }
          setIsProfileUpdated(value);
        }}
        onBlur={() => runValidationTasks("isProfileUpdated", isProfileUpdated)}
        errorMessage={errors.isProfileUpdated?.errorMessage}
        hasError={errors.isProfileUpdated?.hasError}
        {...getOverrideProps(overrides, "isProfileUpdated")}
      ></SwitchField>
      <SwitchField
        label="Is validated step1"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isValidatedStep1}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              name,
              dateOfBirth,
              isProfileUpdated,
              isValidatedStep1: value,
              isValidatedStep2,
              addresss,
              cellphone,
              role,
              subrole,
              status,
              email,
            };
            const result = onChange(modelFields);
            value = result?.isValidatedStep1 ?? value;
          }
          if (errors.isValidatedStep1?.hasError) {
            runValidationTasks("isValidatedStep1", value);
          }
          setIsValidatedStep1(value);
        }}
        onBlur={() => runValidationTasks("isValidatedStep1", isValidatedStep1)}
        errorMessage={errors.isValidatedStep1?.errorMessage}
        hasError={errors.isValidatedStep1?.hasError}
        {...getOverrideProps(overrides, "isValidatedStep1")}
      ></SwitchField>
      <SwitchField
        label="Is validated step2"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isValidatedStep2}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              name,
              dateOfBirth,
              isProfileUpdated,
              isValidatedStep1,
              isValidatedStep2: value,
              addresss,
              cellphone,
              role,
              subrole,
              status,
              email,
            };
            const result = onChange(modelFields);
            value = result?.isValidatedStep2 ?? value;
          }
          if (errors.isValidatedStep2?.hasError) {
            runValidationTasks("isValidatedStep2", value);
          }
          setIsValidatedStep2(value);
        }}
        onBlur={() => runValidationTasks("isValidatedStep2", isValidatedStep2)}
        errorMessage={errors.isValidatedStep2?.errorMessage}
        hasError={errors.isValidatedStep2?.hasError}
        {...getOverrideProps(overrides, "isValidatedStep2")}
      ></SwitchField>
      <TextField
        label="Addresss"
        isRequired={false}
        isReadOnly={false}
        value={addresss}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              dateOfBirth,
              isProfileUpdated,
              isValidatedStep1,
              isValidatedStep2,
              addresss: value,
              cellphone,
              role,
              subrole,
              status,
              email,
            };
            const result = onChange(modelFields);
            value = result?.addresss ?? value;
          }
          if (errors.addresss?.hasError) {
            runValidationTasks("addresss", value);
          }
          setAddresss(value);
        }}
        onBlur={() => runValidationTasks("addresss", addresss)}
        errorMessage={errors.addresss?.errorMessage}
        hasError={errors.addresss?.hasError}
        {...getOverrideProps(overrides, "addresss")}
      ></TextField>
      <TextField
        label="Cellphone"
        isRequired={false}
        isReadOnly={false}
        type="tel"
        value={cellphone}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              dateOfBirth,
              isProfileUpdated,
              isValidatedStep1,
              isValidatedStep2,
              addresss,
              cellphone: value,
              role,
              subrole,
              status,
              email,
            };
            const result = onChange(modelFields);
            value = result?.cellphone ?? value;
          }
          if (errors.cellphone?.hasError) {
            runValidationTasks("cellphone", value);
          }
          setCellphone(value);
        }}
        onBlur={() => runValidationTasks("cellphone", cellphone)}
        errorMessage={errors.cellphone?.errorMessage}
        hasError={errors.cellphone?.hasError}
        {...getOverrideProps(overrides, "cellphone")}
      ></TextField>
      <TextField
        label="Role"
        isRequired={true}
        isReadOnly={false}
        value={role}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              dateOfBirth,
              isProfileUpdated,
              isValidatedStep1,
              isValidatedStep2,
              addresss,
              cellphone,
              role: value,
              subrole,
              status,
              email,
            };
            const result = onChange(modelFields);
            value = result?.role ?? value;
          }
          if (errors.role?.hasError) {
            runValidationTasks("role", value);
          }
          setRole(value);
        }}
        onBlur={() => runValidationTasks("role", role)}
        errorMessage={errors.role?.errorMessage}
        hasError={errors.role?.hasError}
        {...getOverrideProps(overrides, "role")}
      ></TextField>
      <TextField
        label="Subrole"
        isRequired={false}
        isReadOnly={false}
        value={subrole}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              dateOfBirth,
              isProfileUpdated,
              isValidatedStep1,
              isValidatedStep2,
              addresss,
              cellphone,
              role,
              subrole: value,
              status,
              email,
            };
            const result = onChange(modelFields);
            value = result?.subrole ?? value;
          }
          if (errors.subrole?.hasError) {
            runValidationTasks("subrole", value);
          }
          setSubrole(value);
        }}
        onBlur={() => runValidationTasks("subrole", subrole)}
        errorMessage={errors.subrole?.errorMessage}
        hasError={errors.subrole?.hasError}
        {...getOverrideProps(overrides, "subrole")}
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
              dateOfBirth,
              isProfileUpdated,
              isValidatedStep1,
              isValidatedStep2,
              addresss,
              cellphone,
              role,
              subrole,
              status: value,
              email,
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
        label="Email"
        isRequired={false}
        isReadOnly={false}
        value={email}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              dateOfBirth,
              isProfileUpdated,
              isValidatedStep1,
              isValidatedStep2,
              addresss,
              cellphone,
              role,
              subrole,
              status,
              email: value,
            };
            const result = onChange(modelFields);
            value = result?.email ?? value;
          }
          if (errors.email?.hasError) {
            runValidationTasks("email", value);
          }
          setEmail(value);
        }}
        onBlur={() => runValidationTasks("email", email)}
        errorMessage={errors.email?.errorMessage}
        hasError={errors.email?.hasError}
        {...getOverrideProps(overrides, "email")}
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
