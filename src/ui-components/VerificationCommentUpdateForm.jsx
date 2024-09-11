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
import { getVerificationComment } from "../graphql/queries";
import { updateVerificationComment } from "../graphql/mutations";
export default function VerificationCommentUpdateForm(props) {
  const {
    id: idProp,
    verificationComment: verificationCommentModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    comment: "",
    isCommentByVerifier: false,
  };
  const [comment, setComment] = React.useState(initialValues.comment);
  const [isCommentByVerifier, setIsCommentByVerifier] = React.useState(
    initialValues.isCommentByVerifier
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = verificationCommentRecord
      ? { ...initialValues, ...verificationCommentRecord }
      : initialValues;
    setComment(cleanValues.comment);
    setIsCommentByVerifier(cleanValues.isCommentByVerifier);
    setErrors({});
  };
  const [verificationCommentRecord, setVerificationCommentRecord] =
    React.useState(verificationCommentModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await API.graphql({
              query: getVerificationComment.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getVerificationComment
        : verificationCommentModelProp;
      setVerificationCommentRecord(record);
    };
    queryData();
  }, [idProp, verificationCommentModelProp]);
  React.useEffect(resetStateValues, [verificationCommentRecord]);
  const validations = {
    comment: [],
    isCommentByVerifier: [],
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
          comment: comment ?? null,
          isCommentByVerifier: isCommentByVerifier ?? null,
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
            query: updateVerificationComment.replaceAll("__typename", ""),
            variables: {
              input: {
                id: verificationCommentRecord.id,
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
      {...getOverrideProps(overrides, "VerificationCommentUpdateForm")}
      {...rest}
    >
      <TextField
        label="Comment"
        isRequired={false}
        isReadOnly={false}
        value={comment}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              comment: value,
              isCommentByVerifier,
            };
            const result = onChange(modelFields);
            value = result?.comment ?? value;
          }
          if (errors.comment?.hasError) {
            runValidationTasks("comment", value);
          }
          setComment(value);
        }}
        onBlur={() => runValidationTasks("comment", comment)}
        errorMessage={errors.comment?.errorMessage}
        hasError={errors.comment?.hasError}
        {...getOverrideProps(overrides, "comment")}
      ></TextField>
      <SwitchField
        label="Is comment by verifier"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isCommentByVerifier}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              comment,
              isCommentByVerifier: value,
            };
            const result = onChange(modelFields);
            value = result?.isCommentByVerifier ?? value;
          }
          if (errors.isCommentByVerifier?.hasError) {
            runValidationTasks("isCommentByVerifier", value);
          }
          setIsCommentByVerifier(value);
        }}
        onBlur={() =>
          runValidationTasks("isCommentByVerifier", isCommentByVerifier)
        }
        errorMessage={errors.isCommentByVerifier?.errorMessage}
        hasError={errors.isCommentByVerifier?.hasError}
        {...getOverrideProps(overrides, "isCommentByVerifier")}
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
          isDisabled={!(idProp || verificationCommentModelProp)}
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
              !(idProp || verificationCommentModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
