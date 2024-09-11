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
import { getProduct } from "../graphql/queries";
import { updateProduct } from "../graphql/mutations";
export default function ProductUpdateForm(props) {
  const {
    id: idProp,
    product: productModelProp,
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
    description: "",
    isActive: false,
    isActiveOnPlatform: false,
    showOn: "",
    order: "",
    status: "",
    timeOnVerification: "",
    projectReadiness: false,
    tokenClaimedByOwner: false,
    tokenGenesis: false,
  };
  const [name, setName] = React.useState(initialValues.name);
  const [description, setDescription] = React.useState(
    initialValues.description
  );
  const [isActive, setIsActive] = React.useState(initialValues.isActive);
  const [isActiveOnPlatform, setIsActiveOnPlatform] = React.useState(
    initialValues.isActiveOnPlatform
  );
  const [showOn, setShowOn] = React.useState(initialValues.showOn);
  const [order, setOrder] = React.useState(initialValues.order);
  const [status, setStatus] = React.useState(initialValues.status);
  const [timeOnVerification, setTimeOnVerification] = React.useState(
    initialValues.timeOnVerification
  );
  const [projectReadiness, setProjectReadiness] = React.useState(
    initialValues.projectReadiness
  );
  const [tokenClaimedByOwner, setTokenClaimedByOwner] = React.useState(
    initialValues.tokenClaimedByOwner
  );
  const [tokenGenesis, setTokenGenesis] = React.useState(
    initialValues.tokenGenesis
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = productRecord
      ? { ...initialValues, ...productRecord }
      : initialValues;
    setName(cleanValues.name);
    setDescription(cleanValues.description);
    setIsActive(cleanValues.isActive);
    setIsActiveOnPlatform(cleanValues.isActiveOnPlatform);
    setShowOn(cleanValues.showOn);
    setOrder(cleanValues.order);
    setStatus(cleanValues.status);
    setTimeOnVerification(cleanValues.timeOnVerification);
    setProjectReadiness(cleanValues.projectReadiness);
    setTokenClaimedByOwner(cleanValues.tokenClaimedByOwner);
    setTokenGenesis(cleanValues.tokenGenesis);
    setErrors({});
  };
  const [productRecord, setProductRecord] = React.useState(productModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await API.graphql({
              query: getProduct.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getProduct
        : productModelProp;
      setProductRecord(record);
    };
    queryData();
  }, [idProp, productModelProp]);
  React.useEffect(resetStateValues, [productRecord]);
  const validations = {
    name: [{ type: "Required" }],
    description: [],
    isActive: [{ type: "Required" }],
    isActiveOnPlatform: [],
    showOn: [],
    order: [],
    status: [],
    timeOnVerification: [],
    projectReadiness: [],
    tokenClaimedByOwner: [],
    tokenGenesis: [],
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
          name,
          description: description ?? null,
          isActive,
          isActiveOnPlatform: isActiveOnPlatform ?? null,
          showOn: showOn ?? null,
          order: order ?? null,
          status: status ?? null,
          timeOnVerification: timeOnVerification ?? null,
          projectReadiness: projectReadiness ?? null,
          tokenClaimedByOwner: tokenClaimedByOwner ?? null,
          tokenGenesis: tokenGenesis ?? null,
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
            query: updateProduct.replaceAll("__typename", ""),
            variables: {
              input: {
                id: productRecord.id,
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
      {...getOverrideProps(overrides, "ProductUpdateForm")}
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
              description,
              isActive,
              isActiveOnPlatform,
              showOn,
              order,
              status,
              timeOnVerification,
              projectReadiness,
              tokenClaimedByOwner,
              tokenGenesis,
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
        label="Description"
        isRequired={false}
        isReadOnly={false}
        value={description}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description: value,
              isActive,
              isActiveOnPlatform,
              showOn,
              order,
              status,
              timeOnVerification,
              projectReadiness,
              tokenClaimedByOwner,
              tokenGenesis,
            };
            const result = onChange(modelFields);
            value = result?.description ?? value;
          }
          if (errors.description?.hasError) {
            runValidationTasks("description", value);
          }
          setDescription(value);
        }}
        onBlur={() => runValidationTasks("description", description)}
        errorMessage={errors.description?.errorMessage}
        hasError={errors.description?.hasError}
        {...getOverrideProps(overrides, "description")}
      ></TextField>
      <SwitchField
        label="Is active"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isActive}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              name,
              description,
              isActive: value,
              isActiveOnPlatform,
              showOn,
              order,
              status,
              timeOnVerification,
              projectReadiness,
              tokenClaimedByOwner,
              tokenGenesis,
            };
            const result = onChange(modelFields);
            value = result?.isActive ?? value;
          }
          if (errors.isActive?.hasError) {
            runValidationTasks("isActive", value);
          }
          setIsActive(value);
        }}
        onBlur={() => runValidationTasks("isActive", isActive)}
        errorMessage={errors.isActive?.errorMessage}
        hasError={errors.isActive?.hasError}
        {...getOverrideProps(overrides, "isActive")}
      ></SwitchField>
      <SwitchField
        label="Is active on platform"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isActiveOnPlatform}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              name,
              description,
              isActive,
              isActiveOnPlatform: value,
              showOn,
              order,
              status,
              timeOnVerification,
              projectReadiness,
              tokenClaimedByOwner,
              tokenGenesis,
            };
            const result = onChange(modelFields);
            value = result?.isActiveOnPlatform ?? value;
          }
          if (errors.isActiveOnPlatform?.hasError) {
            runValidationTasks("isActiveOnPlatform", value);
          }
          setIsActiveOnPlatform(value);
        }}
        onBlur={() =>
          runValidationTasks("isActiveOnPlatform", isActiveOnPlatform)
        }
        errorMessage={errors.isActiveOnPlatform?.errorMessage}
        hasError={errors.isActiveOnPlatform?.hasError}
        {...getOverrideProps(overrides, "isActiveOnPlatform")}
      ></SwitchField>
      <TextField
        label="Show on"
        isRequired={false}
        isReadOnly={false}
        value={showOn}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description,
              isActive,
              isActiveOnPlatform,
              showOn: value,
              order,
              status,
              timeOnVerification,
              projectReadiness,
              tokenClaimedByOwner,
              tokenGenesis,
            };
            const result = onChange(modelFields);
            value = result?.showOn ?? value;
          }
          if (errors.showOn?.hasError) {
            runValidationTasks("showOn", value);
          }
          setShowOn(value);
        }}
        onBlur={() => runValidationTasks("showOn", showOn)}
        errorMessage={errors.showOn?.errorMessage}
        hasError={errors.showOn?.hasError}
        {...getOverrideProps(overrides, "showOn")}
      ></TextField>
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
              name,
              description,
              isActive,
              isActiveOnPlatform,
              showOn,
              order: value,
              status,
              timeOnVerification,
              projectReadiness,
              tokenClaimedByOwner,
              tokenGenesis,
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
              description,
              isActive,
              isActiveOnPlatform,
              showOn,
              order,
              status: value,
              timeOnVerification,
              projectReadiness,
              tokenClaimedByOwner,
              tokenGenesis,
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
        label="Time on verification"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={
          timeOnVerification &&
          convertToLocal(convertTimeStampToDate(timeOnVerification))
        }
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : Number(new Date(e.target.value));
          if (onChange) {
            const modelFields = {
              name,
              description,
              isActive,
              isActiveOnPlatform,
              showOn,
              order,
              status,
              timeOnVerification: value,
              projectReadiness,
              tokenClaimedByOwner,
              tokenGenesis,
            };
            const result = onChange(modelFields);
            value = result?.timeOnVerification ?? value;
          }
          if (errors.timeOnVerification?.hasError) {
            runValidationTasks("timeOnVerification", value);
          }
          setTimeOnVerification(value);
        }}
        onBlur={() =>
          runValidationTasks("timeOnVerification", timeOnVerification)
        }
        errorMessage={errors.timeOnVerification?.errorMessage}
        hasError={errors.timeOnVerification?.hasError}
        {...getOverrideProps(overrides, "timeOnVerification")}
      ></TextField>
      <SwitchField
        label="Project readiness"
        defaultChecked={false}
        isDisabled={false}
        isChecked={projectReadiness}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              name,
              description,
              isActive,
              isActiveOnPlatform,
              showOn,
              order,
              status,
              timeOnVerification,
              projectReadiness: value,
              tokenClaimedByOwner,
              tokenGenesis,
            };
            const result = onChange(modelFields);
            value = result?.projectReadiness ?? value;
          }
          if (errors.projectReadiness?.hasError) {
            runValidationTasks("projectReadiness", value);
          }
          setProjectReadiness(value);
        }}
        onBlur={() => runValidationTasks("projectReadiness", projectReadiness)}
        errorMessage={errors.projectReadiness?.errorMessage}
        hasError={errors.projectReadiness?.hasError}
        {...getOverrideProps(overrides, "projectReadiness")}
      ></SwitchField>
      <SwitchField
        label="Token claimed by owner"
        defaultChecked={false}
        isDisabled={false}
        isChecked={tokenClaimedByOwner}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              name,
              description,
              isActive,
              isActiveOnPlatform,
              showOn,
              order,
              status,
              timeOnVerification,
              projectReadiness,
              tokenClaimedByOwner: value,
              tokenGenesis,
            };
            const result = onChange(modelFields);
            value = result?.tokenClaimedByOwner ?? value;
          }
          if (errors.tokenClaimedByOwner?.hasError) {
            runValidationTasks("tokenClaimedByOwner", value);
          }
          setTokenClaimedByOwner(value);
        }}
        onBlur={() =>
          runValidationTasks("tokenClaimedByOwner", tokenClaimedByOwner)
        }
        errorMessage={errors.tokenClaimedByOwner?.errorMessage}
        hasError={errors.tokenClaimedByOwner?.hasError}
        {...getOverrideProps(overrides, "tokenClaimedByOwner")}
      ></SwitchField>
      <SwitchField
        label="Token genesis"
        defaultChecked={false}
        isDisabled={false}
        isChecked={tokenGenesis}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              name,
              description,
              isActive,
              isActiveOnPlatform,
              showOn,
              order,
              status,
              timeOnVerification,
              projectReadiness,
              tokenClaimedByOwner,
              tokenGenesis: value,
            };
            const result = onChange(modelFields);
            value = result?.tokenGenesis ?? value;
          }
          if (errors.tokenGenesis?.hasError) {
            runValidationTasks("tokenGenesis", value);
          }
          setTokenGenesis(value);
        }}
        onBlur={() => runValidationTasks("tokenGenesis", tokenGenesis)}
        errorMessage={errors.tokenGenesis?.errorMessage}
        hasError={errors.tokenGenesis?.hasError}
        {...getOverrideProps(overrides, "tokenGenesis")}
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
          isDisabled={!(idProp || productModelProp)}
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
              !(idProp || productModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
