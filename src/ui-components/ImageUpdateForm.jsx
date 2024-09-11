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
import { getImage } from "../graphql/queries";
import { updateImage } from "../graphql/mutations";
export default function ImageUpdateForm(props) {
  const {
    id: idProp,
    image: imageModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    imageURL: "",
    format: "",
    title: "",
    imageURLToDisplay: "",
    isOnCarousel: false,
    carouselLabel: "",
    carouselDescription: "",
    isActive: false,
    order: "",
  };
  const [imageURL, setImageURL] = React.useState(initialValues.imageURL);
  const [format, setFormat] = React.useState(initialValues.format);
  const [title, setTitle] = React.useState(initialValues.title);
  const [imageURLToDisplay, setImageURLToDisplay] = React.useState(
    initialValues.imageURLToDisplay
  );
  const [isOnCarousel, setIsOnCarousel] = React.useState(
    initialValues.isOnCarousel
  );
  const [carouselLabel, setCarouselLabel] = React.useState(
    initialValues.carouselLabel
  );
  const [carouselDescription, setCarouselDescription] = React.useState(
    initialValues.carouselDescription
  );
  const [isActive, setIsActive] = React.useState(initialValues.isActive);
  const [order, setOrder] = React.useState(initialValues.order);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = imageRecord
      ? { ...initialValues, ...imageRecord }
      : initialValues;
    setImageURL(cleanValues.imageURL);
    setFormat(cleanValues.format);
    setTitle(cleanValues.title);
    setImageURLToDisplay(cleanValues.imageURLToDisplay);
    setIsOnCarousel(cleanValues.isOnCarousel);
    setCarouselLabel(cleanValues.carouselLabel);
    setCarouselDescription(cleanValues.carouselDescription);
    setIsActive(cleanValues.isActive);
    setOrder(cleanValues.order);
    setErrors({});
  };
  const [imageRecord, setImageRecord] = React.useState(imageModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await API.graphql({
              query: getImage.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getImage
        : imageModelProp;
      setImageRecord(record);
    };
    queryData();
  }, [idProp, imageModelProp]);
  React.useEffect(resetStateValues, [imageRecord]);
  const validations = {
    imageURL: [{ type: "Required" }],
    format: [{ type: "Required" }],
    title: [],
    imageURLToDisplay: [],
    isOnCarousel: [],
    carouselLabel: [],
    carouselDescription: [],
    isActive: [{ type: "Required" }],
    order: [],
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
          imageURL,
          format,
          title: title ?? null,
          imageURLToDisplay: imageURLToDisplay ?? null,
          isOnCarousel: isOnCarousel ?? null,
          carouselLabel: carouselLabel ?? null,
          carouselDescription: carouselDescription ?? null,
          isActive,
          order: order ?? null,
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
            query: updateImage.replaceAll("__typename", ""),
            variables: {
              input: {
                id: imageRecord.id,
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
      {...getOverrideProps(overrides, "ImageUpdateForm")}
      {...rest}
    >
      <TextField
        label="Image url"
        isRequired={true}
        isReadOnly={false}
        value={imageURL}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              imageURL: value,
              format,
              title,
              imageURLToDisplay,
              isOnCarousel,
              carouselLabel,
              carouselDescription,
              isActive,
              order,
            };
            const result = onChange(modelFields);
            value = result?.imageURL ?? value;
          }
          if (errors.imageURL?.hasError) {
            runValidationTasks("imageURL", value);
          }
          setImageURL(value);
        }}
        onBlur={() => runValidationTasks("imageURL", imageURL)}
        errorMessage={errors.imageURL?.errorMessage}
        hasError={errors.imageURL?.hasError}
        {...getOverrideProps(overrides, "imageURL")}
      ></TextField>
      <TextField
        label="Format"
        isRequired={true}
        isReadOnly={false}
        value={format}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              imageURL,
              format: value,
              title,
              imageURLToDisplay,
              isOnCarousel,
              carouselLabel,
              carouselDescription,
              isActive,
              order,
            };
            const result = onChange(modelFields);
            value = result?.format ?? value;
          }
          if (errors.format?.hasError) {
            runValidationTasks("format", value);
          }
          setFormat(value);
        }}
        onBlur={() => runValidationTasks("format", format)}
        errorMessage={errors.format?.errorMessage}
        hasError={errors.format?.hasError}
        {...getOverrideProps(overrides, "format")}
      ></TextField>
      <TextField
        label="Title"
        isRequired={false}
        isReadOnly={false}
        value={title}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              imageURL,
              format,
              title: value,
              imageURLToDisplay,
              isOnCarousel,
              carouselLabel,
              carouselDescription,
              isActive,
              order,
            };
            const result = onChange(modelFields);
            value = result?.title ?? value;
          }
          if (errors.title?.hasError) {
            runValidationTasks("title", value);
          }
          setTitle(value);
        }}
        onBlur={() => runValidationTasks("title", title)}
        errorMessage={errors.title?.errorMessage}
        hasError={errors.title?.hasError}
        {...getOverrideProps(overrides, "title")}
      ></TextField>
      <TextField
        label="Image url to display"
        isRequired={false}
        isReadOnly={false}
        value={imageURLToDisplay}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              imageURL,
              format,
              title,
              imageURLToDisplay: value,
              isOnCarousel,
              carouselLabel,
              carouselDescription,
              isActive,
              order,
            };
            const result = onChange(modelFields);
            value = result?.imageURLToDisplay ?? value;
          }
          if (errors.imageURLToDisplay?.hasError) {
            runValidationTasks("imageURLToDisplay", value);
          }
          setImageURLToDisplay(value);
        }}
        onBlur={() =>
          runValidationTasks("imageURLToDisplay", imageURLToDisplay)
        }
        errorMessage={errors.imageURLToDisplay?.errorMessage}
        hasError={errors.imageURLToDisplay?.hasError}
        {...getOverrideProps(overrides, "imageURLToDisplay")}
      ></TextField>
      <SwitchField
        label="Is on carousel"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isOnCarousel}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              imageURL,
              format,
              title,
              imageURLToDisplay,
              isOnCarousel: value,
              carouselLabel,
              carouselDescription,
              isActive,
              order,
            };
            const result = onChange(modelFields);
            value = result?.isOnCarousel ?? value;
          }
          if (errors.isOnCarousel?.hasError) {
            runValidationTasks("isOnCarousel", value);
          }
          setIsOnCarousel(value);
        }}
        onBlur={() => runValidationTasks("isOnCarousel", isOnCarousel)}
        errorMessage={errors.isOnCarousel?.errorMessage}
        hasError={errors.isOnCarousel?.hasError}
        {...getOverrideProps(overrides, "isOnCarousel")}
      ></SwitchField>
      <TextField
        label="Carousel label"
        isRequired={false}
        isReadOnly={false}
        value={carouselLabel}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              imageURL,
              format,
              title,
              imageURLToDisplay,
              isOnCarousel,
              carouselLabel: value,
              carouselDescription,
              isActive,
              order,
            };
            const result = onChange(modelFields);
            value = result?.carouselLabel ?? value;
          }
          if (errors.carouselLabel?.hasError) {
            runValidationTasks("carouselLabel", value);
          }
          setCarouselLabel(value);
        }}
        onBlur={() => runValidationTasks("carouselLabel", carouselLabel)}
        errorMessage={errors.carouselLabel?.errorMessage}
        hasError={errors.carouselLabel?.hasError}
        {...getOverrideProps(overrides, "carouselLabel")}
      ></TextField>
      <TextField
        label="Carousel description"
        isRequired={false}
        isReadOnly={false}
        value={carouselDescription}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              imageURL,
              format,
              title,
              imageURLToDisplay,
              isOnCarousel,
              carouselLabel,
              carouselDescription: value,
              isActive,
              order,
            };
            const result = onChange(modelFields);
            value = result?.carouselDescription ?? value;
          }
          if (errors.carouselDescription?.hasError) {
            runValidationTasks("carouselDescription", value);
          }
          setCarouselDescription(value);
        }}
        onBlur={() =>
          runValidationTasks("carouselDescription", carouselDescription)
        }
        errorMessage={errors.carouselDescription?.errorMessage}
        hasError={errors.carouselDescription?.hasError}
        {...getOverrideProps(overrides, "carouselDescription")}
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
              imageURL,
              format,
              title,
              imageURLToDisplay,
              isOnCarousel,
              carouselLabel,
              carouselDescription,
              isActive: value,
              order,
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
              imageURL,
              format,
              title,
              imageURLToDisplay,
              isOnCarousel,
              carouselLabel,
              carouselDescription,
              isActive,
              order: value,
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
          isDisabled={!(idProp || imageModelProp)}
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
              !(idProp || imageModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
