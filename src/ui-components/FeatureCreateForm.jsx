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
import { createFeature } from "../graphql/mutations";
export default function FeatureCreateForm(props) {
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
    description: "",
    isTemplate: false,
    isVerifable: false,
    defaultValue: "",
    formOrder: "",
    formHint: "",
    formRequired: false,
    formAppearance: "",
    formRelevant: "",
    formConstraint: "",
    formRequiredMessage: "",
  };
  const [name, setName] = React.useState(initialValues.name);
  const [description, setDescription] = React.useState(
    initialValues.description
  );
  const [isTemplate, setIsTemplate] = React.useState(initialValues.isTemplate);
  const [isVerifable, setIsVerifable] = React.useState(
    initialValues.isVerifable
  );
  const [defaultValue, setDefaultValue] = React.useState(
    initialValues.defaultValue
  );
  const [formOrder, setFormOrder] = React.useState(initialValues.formOrder);
  const [formHint, setFormHint] = React.useState(initialValues.formHint);
  const [formRequired, setFormRequired] = React.useState(
    initialValues.formRequired
  );
  const [formAppearance, setFormAppearance] = React.useState(
    initialValues.formAppearance
  );
  const [formRelevant, setFormRelevant] = React.useState(
    initialValues.formRelevant
  );
  const [formConstraint, setFormConstraint] = React.useState(
    initialValues.formConstraint
  );
  const [formRequiredMessage, setFormRequiredMessage] = React.useState(
    initialValues.formRequiredMessage
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setName(initialValues.name);
    setDescription(initialValues.description);
    setIsTemplate(initialValues.isTemplate);
    setIsVerifable(initialValues.isVerifable);
    setDefaultValue(initialValues.defaultValue);
    setFormOrder(initialValues.formOrder);
    setFormHint(initialValues.formHint);
    setFormRequired(initialValues.formRequired);
    setFormAppearance(initialValues.formAppearance);
    setFormRelevant(initialValues.formRelevant);
    setFormConstraint(initialValues.formConstraint);
    setFormRequiredMessage(initialValues.formRequiredMessage);
    setErrors({});
  };
  const validations = {
    name: [{ type: "Required" }],
    description: [],
    isTemplate: [],
    isVerifable: [],
    defaultValue: [],
    formOrder: [],
    formHint: [],
    formRequired: [],
    formAppearance: [],
    formRelevant: [],
    formConstraint: [],
    formRequiredMessage: [],
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
          description,
          isTemplate,
          isVerifable,
          defaultValue,
          formOrder,
          formHint,
          formRequired,
          formAppearance,
          formRelevant,
          formConstraint,
          formRequiredMessage,
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
            query: createFeature.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "FeatureCreateForm")}
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
              isTemplate,
              isVerifable,
              defaultValue,
              formOrder,
              formHint,
              formRequired,
              formAppearance,
              formRelevant,
              formConstraint,
              formRequiredMessage,
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
              isTemplate,
              isVerifable,
              defaultValue,
              formOrder,
              formHint,
              formRequired,
              formAppearance,
              formRelevant,
              formConstraint,
              formRequiredMessage,
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
        label="Is template"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isTemplate}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              name,
              description,
              isTemplate: value,
              isVerifable,
              defaultValue,
              formOrder,
              formHint,
              formRequired,
              formAppearance,
              formRelevant,
              formConstraint,
              formRequiredMessage,
            };
            const result = onChange(modelFields);
            value = result?.isTemplate ?? value;
          }
          if (errors.isTemplate?.hasError) {
            runValidationTasks("isTemplate", value);
          }
          setIsTemplate(value);
        }}
        onBlur={() => runValidationTasks("isTemplate", isTemplate)}
        errorMessage={errors.isTemplate?.errorMessage}
        hasError={errors.isTemplate?.hasError}
        {...getOverrideProps(overrides, "isTemplate")}
      ></SwitchField>
      <SwitchField
        label="Is verifable"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isVerifable}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              name,
              description,
              isTemplate,
              isVerifable: value,
              defaultValue,
              formOrder,
              formHint,
              formRequired,
              formAppearance,
              formRelevant,
              formConstraint,
              formRequiredMessage,
            };
            const result = onChange(modelFields);
            value = result?.isVerifable ?? value;
          }
          if (errors.isVerifable?.hasError) {
            runValidationTasks("isVerifable", value);
          }
          setIsVerifable(value);
        }}
        onBlur={() => runValidationTasks("isVerifable", isVerifable)}
        errorMessage={errors.isVerifable?.errorMessage}
        hasError={errors.isVerifable?.hasError}
        {...getOverrideProps(overrides, "isVerifable")}
      ></SwitchField>
      <TextField
        label="Default value"
        isRequired={false}
        isReadOnly={false}
        value={defaultValue}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description,
              isTemplate,
              isVerifable,
              defaultValue: value,
              formOrder,
              formHint,
              formRequired,
              formAppearance,
              formRelevant,
              formConstraint,
              formRequiredMessage,
            };
            const result = onChange(modelFields);
            value = result?.defaultValue ?? value;
          }
          if (errors.defaultValue?.hasError) {
            runValidationTasks("defaultValue", value);
          }
          setDefaultValue(value);
        }}
        onBlur={() => runValidationTasks("defaultValue", defaultValue)}
        errorMessage={errors.defaultValue?.errorMessage}
        hasError={errors.defaultValue?.hasError}
        {...getOverrideProps(overrides, "defaultValue")}
      ></TextField>
      <TextField
        label="Form order"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={formOrder}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              description,
              isTemplate,
              isVerifable,
              defaultValue,
              formOrder: value,
              formHint,
              formRequired,
              formAppearance,
              formRelevant,
              formConstraint,
              formRequiredMessage,
            };
            const result = onChange(modelFields);
            value = result?.formOrder ?? value;
          }
          if (errors.formOrder?.hasError) {
            runValidationTasks("formOrder", value);
          }
          setFormOrder(value);
        }}
        onBlur={() => runValidationTasks("formOrder", formOrder)}
        errorMessage={errors.formOrder?.errorMessage}
        hasError={errors.formOrder?.hasError}
        {...getOverrideProps(overrides, "formOrder")}
      ></TextField>
      <TextField
        label="Form hint"
        isRequired={false}
        isReadOnly={false}
        value={formHint}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description,
              isTemplate,
              isVerifable,
              defaultValue,
              formOrder,
              formHint: value,
              formRequired,
              formAppearance,
              formRelevant,
              formConstraint,
              formRequiredMessage,
            };
            const result = onChange(modelFields);
            value = result?.formHint ?? value;
          }
          if (errors.formHint?.hasError) {
            runValidationTasks("formHint", value);
          }
          setFormHint(value);
        }}
        onBlur={() => runValidationTasks("formHint", formHint)}
        errorMessage={errors.formHint?.errorMessage}
        hasError={errors.formHint?.hasError}
        {...getOverrideProps(overrides, "formHint")}
      ></TextField>
      <SwitchField
        label="Form required"
        defaultChecked={false}
        isDisabled={false}
        isChecked={formRequired}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              name,
              description,
              isTemplate,
              isVerifable,
              defaultValue,
              formOrder,
              formHint,
              formRequired: value,
              formAppearance,
              formRelevant,
              formConstraint,
              formRequiredMessage,
            };
            const result = onChange(modelFields);
            value = result?.formRequired ?? value;
          }
          if (errors.formRequired?.hasError) {
            runValidationTasks("formRequired", value);
          }
          setFormRequired(value);
        }}
        onBlur={() => runValidationTasks("formRequired", formRequired)}
        errorMessage={errors.formRequired?.errorMessage}
        hasError={errors.formRequired?.hasError}
        {...getOverrideProps(overrides, "formRequired")}
      ></SwitchField>
      <TextField
        label="Form appearance"
        isRequired={false}
        isReadOnly={false}
        value={formAppearance}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description,
              isTemplate,
              isVerifable,
              defaultValue,
              formOrder,
              formHint,
              formRequired,
              formAppearance: value,
              formRelevant,
              formConstraint,
              formRequiredMessage,
            };
            const result = onChange(modelFields);
            value = result?.formAppearance ?? value;
          }
          if (errors.formAppearance?.hasError) {
            runValidationTasks("formAppearance", value);
          }
          setFormAppearance(value);
        }}
        onBlur={() => runValidationTasks("formAppearance", formAppearance)}
        errorMessage={errors.formAppearance?.errorMessage}
        hasError={errors.formAppearance?.hasError}
        {...getOverrideProps(overrides, "formAppearance")}
      ></TextField>
      <TextField
        label="Form relevant"
        isRequired={false}
        isReadOnly={false}
        value={formRelevant}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description,
              isTemplate,
              isVerifable,
              defaultValue,
              formOrder,
              formHint,
              formRequired,
              formAppearance,
              formRelevant: value,
              formConstraint,
              formRequiredMessage,
            };
            const result = onChange(modelFields);
            value = result?.formRelevant ?? value;
          }
          if (errors.formRelevant?.hasError) {
            runValidationTasks("formRelevant", value);
          }
          setFormRelevant(value);
        }}
        onBlur={() => runValidationTasks("formRelevant", formRelevant)}
        errorMessage={errors.formRelevant?.errorMessage}
        hasError={errors.formRelevant?.hasError}
        {...getOverrideProps(overrides, "formRelevant")}
      ></TextField>
      <TextField
        label="Form constraint"
        isRequired={false}
        isReadOnly={false}
        value={formConstraint}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description,
              isTemplate,
              isVerifable,
              defaultValue,
              formOrder,
              formHint,
              formRequired,
              formAppearance,
              formRelevant,
              formConstraint: value,
              formRequiredMessage,
            };
            const result = onChange(modelFields);
            value = result?.formConstraint ?? value;
          }
          if (errors.formConstraint?.hasError) {
            runValidationTasks("formConstraint", value);
          }
          setFormConstraint(value);
        }}
        onBlur={() => runValidationTasks("formConstraint", formConstraint)}
        errorMessage={errors.formConstraint?.errorMessage}
        hasError={errors.formConstraint?.hasError}
        {...getOverrideProps(overrides, "formConstraint")}
      ></TextField>
      <TextField
        label="Form required message"
        isRequired={false}
        isReadOnly={false}
        value={formRequiredMessage}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description,
              isTemplate,
              isVerifable,
              defaultValue,
              formOrder,
              formHint,
              formRequired,
              formAppearance,
              formRelevant,
              formConstraint,
              formRequiredMessage: value,
            };
            const result = onChange(modelFields);
            value = result?.formRequiredMessage ?? value;
          }
          if (errors.formRequiredMessage?.hasError) {
            runValidationTasks("formRequiredMessage", value);
          }
          setFormRequiredMessage(value);
        }}
        onBlur={() =>
          runValidationTasks("formRequiredMessage", formRequiredMessage)
        }
        errorMessage={errors.formRequiredMessage?.errorMessage}
        hasError={errors.formRequiredMessage?.hasError}
        {...getOverrideProps(overrides, "formRequiredMessage")}
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
