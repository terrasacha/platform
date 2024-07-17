/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, SwitchField } from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { API } from "aws-amplify";
import { getUserProduct } from "../graphql/queries";
import { updateUserProduct } from "../graphql/mutations";
export default function UserProductUpdateForm(props) {
  const {
    id: idProp,
    userProduct: userProductModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    isFavorite: false,
  };
  const [isFavorite, setIsFavorite] = React.useState(initialValues.isFavorite);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = userProductRecord
      ? { ...initialValues, ...userProductRecord }
      : initialValues;
    setIsFavorite(cleanValues.isFavorite);
    setErrors({});
  };
  const [userProductRecord, setUserProductRecord] =
    React.useState(userProductModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await API.graphql({
              query: getUserProduct.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getUserProduct
        : userProductModelProp;
      setUserProductRecord(record);
    };
    queryData();
  }, [idProp, userProductModelProp]);
  React.useEffect(resetStateValues, [userProductRecord]);
  const validations = {
    isFavorite: [],
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
          isFavorite: isFavorite ?? null,
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
            query: updateUserProduct.replaceAll("__typename", ""),
            variables: {
              input: {
                id: userProductRecord.id,
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
      {...getOverrideProps(overrides, "UserProductUpdateForm")}
      {...rest}
    >
      <SwitchField
        label="Is favorite"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isFavorite}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              isFavorite: value,
            };
            const result = onChange(modelFields);
            value = result?.isFavorite ?? value;
          }
          if (errors.isFavorite?.hasError) {
            runValidationTasks("isFavorite", value);
          }
          setIsFavorite(value);
        }}
        onBlur={() => runValidationTasks("isFavorite", isFavorite)}
        errorMessage={errors.isFavorite?.errorMessage}
        hasError={errors.isFavorite?.hasError}
        {...getOverrideProps(overrides, "isFavorite")}
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
          isDisabled={!(idProp || userProductModelProp)}
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
              !(idProp || userProductModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
