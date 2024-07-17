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
import { getDocument } from "../graphql/queries";
import { updateDocument } from "../graphql/mutations";
export default function DocumentUpdateForm(props) {
  const {
    id: idProp,
    document: documentModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    data: "",
    timeStamp: "",
    docHash: "",
    url: "",
    signed: "",
    signedHash: "",
    isApproved: false,
    status: "",
    isUploadedToBlockChain: false,
  };
  const [data, setData] = React.useState(initialValues.data);
  const [timeStamp, setTimeStamp] = React.useState(initialValues.timeStamp);
  const [docHash, setDocHash] = React.useState(initialValues.docHash);
  const [url, setUrl] = React.useState(initialValues.url);
  const [signed, setSigned] = React.useState(initialValues.signed);
  const [signedHash, setSignedHash] = React.useState(initialValues.signedHash);
  const [isApproved, setIsApproved] = React.useState(initialValues.isApproved);
  const [status, setStatus] = React.useState(initialValues.status);
  const [isUploadedToBlockChain, setIsUploadedToBlockChain] = React.useState(
    initialValues.isUploadedToBlockChain
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = documentRecord
      ? { ...initialValues, ...documentRecord }
      : initialValues;
    setData(
      typeof cleanValues.data === "string" || cleanValues.data === null
        ? cleanValues.data
        : JSON.stringify(cleanValues.data)
    );
    setTimeStamp(cleanValues.timeStamp);
    setDocHash(cleanValues.docHash);
    setUrl(cleanValues.url);
    setSigned(cleanValues.signed);
    setSignedHash(cleanValues.signedHash);
    setIsApproved(cleanValues.isApproved);
    setStatus(cleanValues.status);
    setIsUploadedToBlockChain(cleanValues.isUploadedToBlockChain);
    setErrors({});
  };
  const [documentRecord, setDocumentRecord] = React.useState(documentModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await API.graphql({
              query: getDocument.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getDocument
        : documentModelProp;
      setDocumentRecord(record);
    };
    queryData();
  }, [idProp, documentModelProp]);
  React.useEffect(resetStateValues, [documentRecord]);
  const validations = {
    data: [{ type: "JSON" }],
    timeStamp: [],
    docHash: [],
    url: [{ type: "URL" }],
    signed: [],
    signedHash: [],
    isApproved: [],
    status: [],
    isUploadedToBlockChain: [],
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
          data: data ?? null,
          timeStamp: timeStamp ?? null,
          docHash: docHash ?? null,
          url: url ?? null,
          signed: signed ?? null,
          signedHash: signedHash ?? null,
          isApproved: isApproved ?? null,
          status: status ?? null,
          isUploadedToBlockChain: isUploadedToBlockChain ?? null,
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
            query: updateDocument.replaceAll("__typename", ""),
            variables: {
              input: {
                id: documentRecord.id,
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
      {...getOverrideProps(overrides, "DocumentUpdateForm")}
      {...rest}
    >
      <TextAreaField
        label="Data"
        isRequired={false}
        isReadOnly={false}
        value={data}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              data: value,
              timeStamp,
              docHash,
              url,
              signed,
              signedHash,
              isApproved,
              status,
              isUploadedToBlockChain,
            };
            const result = onChange(modelFields);
            value = result?.data ?? value;
          }
          if (errors.data?.hasError) {
            runValidationTasks("data", value);
          }
          setData(value);
        }}
        onBlur={() => runValidationTasks("data", data)}
        errorMessage={errors.data?.errorMessage}
        hasError={errors.data?.hasError}
        {...getOverrideProps(overrides, "data")}
      ></TextAreaField>
      <TextField
        label="Time stamp"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={timeStamp && convertToLocal(convertTimeStampToDate(timeStamp))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : Number(new Date(e.target.value));
          if (onChange) {
            const modelFields = {
              data,
              timeStamp: value,
              docHash,
              url,
              signed,
              signedHash,
              isApproved,
              status,
              isUploadedToBlockChain,
            };
            const result = onChange(modelFields);
            value = result?.timeStamp ?? value;
          }
          if (errors.timeStamp?.hasError) {
            runValidationTasks("timeStamp", value);
          }
          setTimeStamp(value);
        }}
        onBlur={() => runValidationTasks("timeStamp", timeStamp)}
        errorMessage={errors.timeStamp?.errorMessage}
        hasError={errors.timeStamp?.hasError}
        {...getOverrideProps(overrides, "timeStamp")}
      ></TextField>
      <TextField
        label="Doc hash"
        isRequired={false}
        isReadOnly={false}
        value={docHash}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              data,
              timeStamp,
              docHash: value,
              url,
              signed,
              signedHash,
              isApproved,
              status,
              isUploadedToBlockChain,
            };
            const result = onChange(modelFields);
            value = result?.docHash ?? value;
          }
          if (errors.docHash?.hasError) {
            runValidationTasks("docHash", value);
          }
          setDocHash(value);
        }}
        onBlur={() => runValidationTasks("docHash", docHash)}
        errorMessage={errors.docHash?.errorMessage}
        hasError={errors.docHash?.hasError}
        {...getOverrideProps(overrides, "docHash")}
      ></TextField>
      <TextField
        label="Url"
        isRequired={false}
        isReadOnly={false}
        value={url}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              data,
              timeStamp,
              docHash,
              url: value,
              signed,
              signedHash,
              isApproved,
              status,
              isUploadedToBlockChain,
            };
            const result = onChange(modelFields);
            value = result?.url ?? value;
          }
          if (errors.url?.hasError) {
            runValidationTasks("url", value);
          }
          setUrl(value);
        }}
        onBlur={() => runValidationTasks("url", url)}
        errorMessage={errors.url?.errorMessage}
        hasError={errors.url?.hasError}
        {...getOverrideProps(overrides, "url")}
      ></TextField>
      <TextField
        label="Signed"
        isRequired={false}
        isReadOnly={false}
        value={signed}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              data,
              timeStamp,
              docHash,
              url,
              signed: value,
              signedHash,
              isApproved,
              status,
              isUploadedToBlockChain,
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
      ></TextField>
      <TextField
        label="Signed hash"
        isRequired={false}
        isReadOnly={false}
        value={signedHash}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              data,
              timeStamp,
              docHash,
              url,
              signed,
              signedHash: value,
              isApproved,
              status,
              isUploadedToBlockChain,
            };
            const result = onChange(modelFields);
            value = result?.signedHash ?? value;
          }
          if (errors.signedHash?.hasError) {
            runValidationTasks("signedHash", value);
          }
          setSignedHash(value);
        }}
        onBlur={() => runValidationTasks("signedHash", signedHash)}
        errorMessage={errors.signedHash?.errorMessage}
        hasError={errors.signedHash?.hasError}
        {...getOverrideProps(overrides, "signedHash")}
      ></TextField>
      <SwitchField
        label="Is approved"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isApproved}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              data,
              timeStamp,
              docHash,
              url,
              signed,
              signedHash,
              isApproved: value,
              status,
              isUploadedToBlockChain,
            };
            const result = onChange(modelFields);
            value = result?.isApproved ?? value;
          }
          if (errors.isApproved?.hasError) {
            runValidationTasks("isApproved", value);
          }
          setIsApproved(value);
        }}
        onBlur={() => runValidationTasks("isApproved", isApproved)}
        errorMessage={errors.isApproved?.errorMessage}
        hasError={errors.isApproved?.hasError}
        {...getOverrideProps(overrides, "isApproved")}
      ></SwitchField>
      <TextField
        label="Status"
        isRequired={false}
        isReadOnly={false}
        value={status}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              data,
              timeStamp,
              docHash,
              url,
              signed,
              signedHash,
              isApproved,
              status: value,
              isUploadedToBlockChain,
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
      <SwitchField
        label="Is uploaded to block chain"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isUploadedToBlockChain}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              data,
              timeStamp,
              docHash,
              url,
              signed,
              signedHash,
              isApproved,
              status,
              isUploadedToBlockChain: value,
            };
            const result = onChange(modelFields);
            value = result?.isUploadedToBlockChain ?? value;
          }
          if (errors.isUploadedToBlockChain?.hasError) {
            runValidationTasks("isUploadedToBlockChain", value);
          }
          setIsUploadedToBlockChain(value);
        }}
        onBlur={() =>
          runValidationTasks("isUploadedToBlockChain", isUploadedToBlockChain)
        }
        errorMessage={errors.isUploadedToBlockChain?.errorMessage}
        hasError={errors.isUploadedToBlockChain?.hasError}
        {...getOverrideProps(overrides, "isUploadedToBlockChain")}
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
          isDisabled={!(idProp || documentModelProp)}
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
              !(idProp || documentModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
