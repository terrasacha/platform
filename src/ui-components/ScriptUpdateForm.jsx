/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Badge,
  Button,
  Divider,
  Flex,
  Grid,
  Icon,
  ScrollView,
  SwitchField,
  Text,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { API } from "aws-amplify";
import { getScript } from "../graphql/queries";
import { updateScript } from "../graphql/mutations";
function ArrayField({
  items = [],
  onChange,
  label,
  inputFieldRef,
  children,
  hasError,
  setFieldValue,
  currentFieldValue,
  defaultFieldValue,
  lengthLimit,
  getBadgeText,
  runValidationTasks,
  errorMessage,
}) {
  const labelElement = <Text>{label}</Text>;
  const {
    tokens: {
      components: {
        fieldmessages: { error: errorStyles },
      },
    },
  } = useTheme();
  const [selectedBadgeIndex, setSelectedBadgeIndex] = React.useState();
  const [isEditing, setIsEditing] = React.useState();
  React.useEffect(() => {
    if (isEditing) {
      inputFieldRef?.current?.focus();
    }
  }, [isEditing]);
  const removeItem = async (removeIndex) => {
    const newItems = items.filter((value, index) => index !== removeIndex);
    await onChange(newItems);
    setSelectedBadgeIndex(undefined);
  };
  const addItem = async () => {
    const { hasError } = runValidationTasks();
    if (
      currentFieldValue !== undefined &&
      currentFieldValue !== null &&
      currentFieldValue !== "" &&
      !hasError
    ) {
      const newItems = [...items];
      if (selectedBadgeIndex !== undefined) {
        newItems[selectedBadgeIndex] = currentFieldValue;
        setSelectedBadgeIndex(undefined);
      } else {
        newItems.push(currentFieldValue);
      }
      await onChange(newItems);
      setIsEditing(false);
    }
  };
  const arraySection = (
    <React.Fragment>
      {!!items?.length && (
        <ScrollView height="inherit" width="inherit" maxHeight={"7rem"}>
          {items.map((value, index) => {
            return (
              <Badge
                key={index}
                style={{
                  cursor: "pointer",
                  alignItems: "center",
                  marginRight: 3,
                  marginTop: 3,
                  backgroundColor:
                    index === selectedBadgeIndex ? "#B8CEF9" : "",
                }}
                onClick={() => {
                  setSelectedBadgeIndex(index);
                  setFieldValue(items[index]);
                  setIsEditing(true);
                }}
              >
                {getBadgeText ? getBadgeText(value) : value.toString()}
                <Icon
                  style={{
                    cursor: "pointer",
                    paddingLeft: 3,
                    width: 20,
                    height: 20,
                  }}
                  viewBox={{ width: 20, height: 20 }}
                  paths={[
                    {
                      d: "M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z",
                      stroke: "black",
                    },
                  ]}
                  ariaLabel="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeItem(index);
                  }}
                />
              </Badge>
            );
          })}
        </ScrollView>
      )}
      <Divider orientation="horizontal" marginTop={5} />
    </React.Fragment>
  );
  if (lengthLimit !== undefined && items.length >= lengthLimit && !isEditing) {
    return (
      <React.Fragment>
        {labelElement}
        {arraySection}
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      {labelElement}
      {isEditing && children}
      {!isEditing ? (
        <>
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Add item
          </Button>
          {errorMessage && hasError && (
            <Text color={errorStyles.color} fontSize={errorStyles.fontSize}>
              {errorMessage}
            </Text>
          )}
        </>
      ) : (
        <Flex justifyContent="flex-end">
          {(currentFieldValue || isEditing) && (
            <Button
              children="Cancel"
              type="button"
              size="small"
              onClick={() => {
                setFieldValue(defaultFieldValue);
                setIsEditing(false);
                setSelectedBadgeIndex(undefined);
              }}
            ></Button>
          )}
          <Button size="small" variation="link" onClick={addItem}>
            {selectedBadgeIndex !== undefined ? "Save" : "Add"}
          </Button>
        </Flex>
      )}
      {arraySection}
    </React.Fragment>
  );
}
export default function ScriptUpdateForm(props) {
  const {
    id: idProp,
    script: scriptModelProp,
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
    script_type: "",
    script_category: "",
    pbk: [],
    token_name: "",
    cbor: "",
    testnetAddr: "",
    MainnetAddr: "",
    Active: false,
    base_code: "",
  };
  const [name, setName] = React.useState(initialValues.name);
  const [script_type, setScript_type] = React.useState(
    initialValues.script_type
  );
  const [script_category, setScript_category] = React.useState(
    initialValues.script_category
  );
  const [pbk, setPbk] = React.useState(initialValues.pbk);
  const [token_name, setToken_name] = React.useState(initialValues.token_name);
  const [cbor, setCbor] = React.useState(initialValues.cbor);
  const [testnetAddr, setTestnetAddr] = React.useState(
    initialValues.testnetAddr
  );
  const [MainnetAddr, setMainnetAddr] = React.useState(
    initialValues.MainnetAddr
  );
  const [Active, setActive] = React.useState(initialValues.Active);
  const [base_code, setBase_code] = React.useState(initialValues.base_code);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = scriptRecord
      ? { ...initialValues, ...scriptRecord }
      : initialValues;
    setName(cleanValues.name);
    setScript_type(cleanValues.script_type);
    setScript_category(cleanValues.script_category);
    setPbk(cleanValues.pbk ?? []);
    setCurrentPbkValue("");
    setToken_name(cleanValues.token_name);
    setCbor(cleanValues.cbor);
    setTestnetAddr(cleanValues.testnetAddr);
    setMainnetAddr(cleanValues.MainnetAddr);
    setActive(cleanValues.Active);
    setBase_code(cleanValues.base_code);
    setErrors({});
  };
  const [scriptRecord, setScriptRecord] = React.useState(scriptModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await API.graphql({
              query: getScript.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getScript
        : scriptModelProp;
      setScriptRecord(record);
    };
    queryData();
  }, [idProp, scriptModelProp]);
  React.useEffect(resetStateValues, [scriptRecord]);
  const [currentPbkValue, setCurrentPbkValue] = React.useState("");
  const pbkRef = React.createRef();
  const validations = {
    name: [{ type: "Required" }],
    script_type: [{ type: "Required" }],
    script_category: [{ type: "Required" }],
    pbk: [],
    token_name: [],
    cbor: [{ type: "Required" }],
    testnetAddr: [{ type: "Required" }],
    MainnetAddr: [{ type: "Required" }],
    Active: [{ type: "Required" }],
    base_code: [{ type: "URL" }],
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
          script_type,
          script_category,
          pbk: pbk ?? null,
          token_name: token_name ?? null,
          cbor,
          testnetAddr,
          MainnetAddr,
          Active,
          base_code: base_code ?? null,
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
            query: updateScript.replaceAll("__typename", ""),
            variables: {
              input: {
                id: scriptRecord.id,
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
      {...getOverrideProps(overrides, "ScriptUpdateForm")}
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
              script_type,
              script_category,
              pbk,
              token_name,
              cbor,
              testnetAddr,
              MainnetAddr,
              Active,
              base_code,
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
        label="Script type"
        isRequired={true}
        isReadOnly={false}
        value={script_type}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              script_type: value,
              script_category,
              pbk,
              token_name,
              cbor,
              testnetAddr,
              MainnetAddr,
              Active,
              base_code,
            };
            const result = onChange(modelFields);
            value = result?.script_type ?? value;
          }
          if (errors.script_type?.hasError) {
            runValidationTasks("script_type", value);
          }
          setScript_type(value);
        }}
        onBlur={() => runValidationTasks("script_type", script_type)}
        errorMessage={errors.script_type?.errorMessage}
        hasError={errors.script_type?.hasError}
        {...getOverrideProps(overrides, "script_type")}
      ></TextField>
      <TextField
        label="Script category"
        isRequired={true}
        isReadOnly={false}
        value={script_category}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              script_type,
              script_category: value,
              pbk,
              token_name,
              cbor,
              testnetAddr,
              MainnetAddr,
              Active,
              base_code,
            };
            const result = onChange(modelFields);
            value = result?.script_category ?? value;
          }
          if (errors.script_category?.hasError) {
            runValidationTasks("script_category", value);
          }
          setScript_category(value);
        }}
        onBlur={() => runValidationTasks("script_category", script_category)}
        errorMessage={errors.script_category?.errorMessage}
        hasError={errors.script_category?.hasError}
        {...getOverrideProps(overrides, "script_category")}
      ></TextField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              name,
              script_type,
              script_category,
              pbk: values,
              token_name,
              cbor,
              testnetAddr,
              MainnetAddr,
              Active,
              base_code,
            };
            const result = onChange(modelFields);
            values = result?.pbk ?? values;
          }
          setPbk(values);
          setCurrentPbkValue("");
        }}
        currentFieldValue={currentPbkValue}
        label={"Pbk"}
        items={pbk}
        hasError={errors?.pbk?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("pbk", currentPbkValue)
        }
        errorMessage={errors?.pbk?.errorMessage}
        setFieldValue={setCurrentPbkValue}
        inputFieldRef={pbkRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Pbk"
          isRequired={false}
          isReadOnly={false}
          value={currentPbkValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.pbk?.hasError) {
              runValidationTasks("pbk", value);
            }
            setCurrentPbkValue(value);
          }}
          onBlur={() => runValidationTasks("pbk", currentPbkValue)}
          errorMessage={errors.pbk?.errorMessage}
          hasError={errors.pbk?.hasError}
          ref={pbkRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "pbk")}
        ></TextField>
      </ArrayField>
      <TextField
        label="Token name"
        isRequired={false}
        isReadOnly={false}
        value={token_name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              script_type,
              script_category,
              pbk,
              token_name: value,
              cbor,
              testnetAddr,
              MainnetAddr,
              Active,
              base_code,
            };
            const result = onChange(modelFields);
            value = result?.token_name ?? value;
          }
          if (errors.token_name?.hasError) {
            runValidationTasks("token_name", value);
          }
          setToken_name(value);
        }}
        onBlur={() => runValidationTasks("token_name", token_name)}
        errorMessage={errors.token_name?.errorMessage}
        hasError={errors.token_name?.hasError}
        {...getOverrideProps(overrides, "token_name")}
      ></TextField>
      <TextField
        label="Cbor"
        isRequired={true}
        isReadOnly={false}
        value={cbor}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              script_type,
              script_category,
              pbk,
              token_name,
              cbor: value,
              testnetAddr,
              MainnetAddr,
              Active,
              base_code,
            };
            const result = onChange(modelFields);
            value = result?.cbor ?? value;
          }
          if (errors.cbor?.hasError) {
            runValidationTasks("cbor", value);
          }
          setCbor(value);
        }}
        onBlur={() => runValidationTasks("cbor", cbor)}
        errorMessage={errors.cbor?.errorMessage}
        hasError={errors.cbor?.hasError}
        {...getOverrideProps(overrides, "cbor")}
      ></TextField>
      <TextField
        label="Testnet addr"
        isRequired={true}
        isReadOnly={false}
        value={testnetAddr}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              script_type,
              script_category,
              pbk,
              token_name,
              cbor,
              testnetAddr: value,
              MainnetAddr,
              Active,
              base_code,
            };
            const result = onChange(modelFields);
            value = result?.testnetAddr ?? value;
          }
          if (errors.testnetAddr?.hasError) {
            runValidationTasks("testnetAddr", value);
          }
          setTestnetAddr(value);
        }}
        onBlur={() => runValidationTasks("testnetAddr", testnetAddr)}
        errorMessage={errors.testnetAddr?.errorMessage}
        hasError={errors.testnetAddr?.hasError}
        {...getOverrideProps(overrides, "testnetAddr")}
      ></TextField>
      <TextField
        label="Mainnet addr"
        isRequired={true}
        isReadOnly={false}
        value={MainnetAddr}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              script_type,
              script_category,
              pbk,
              token_name,
              cbor,
              testnetAddr,
              MainnetAddr: value,
              Active,
              base_code,
            };
            const result = onChange(modelFields);
            value = result?.MainnetAddr ?? value;
          }
          if (errors.MainnetAddr?.hasError) {
            runValidationTasks("MainnetAddr", value);
          }
          setMainnetAddr(value);
        }}
        onBlur={() => runValidationTasks("MainnetAddr", MainnetAddr)}
        errorMessage={errors.MainnetAddr?.errorMessage}
        hasError={errors.MainnetAddr?.hasError}
        {...getOverrideProps(overrides, "MainnetAddr")}
      ></TextField>
      <SwitchField
        label="Active"
        defaultChecked={false}
        isDisabled={false}
        isChecked={Active}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              name,
              script_type,
              script_category,
              pbk,
              token_name,
              cbor,
              testnetAddr,
              MainnetAddr,
              Active: value,
              base_code,
            };
            const result = onChange(modelFields);
            value = result?.Active ?? value;
          }
          if (errors.Active?.hasError) {
            runValidationTasks("Active", value);
          }
          setActive(value);
        }}
        onBlur={() => runValidationTasks("Active", Active)}
        errorMessage={errors.Active?.errorMessage}
        hasError={errors.Active?.hasError}
        {...getOverrideProps(overrides, "Active")}
      ></SwitchField>
      <TextField
        label="Base code"
        isRequired={false}
        isReadOnly={false}
        value={base_code}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              script_type,
              script_category,
              pbk,
              token_name,
              cbor,
              testnetAddr,
              MainnetAddr,
              Active,
              base_code: value,
            };
            const result = onChange(modelFields);
            value = result?.base_code ?? value;
          }
          if (errors.base_code?.hasError) {
            runValidationTasks("base_code", value);
          }
          setBase_code(value);
        }}
        onBlur={() => runValidationTasks("base_code", base_code)}
        errorMessage={errors.base_code?.errorMessage}
        hasError={errors.base_code?.hasError}
        {...getOverrideProps(overrides, "base_code")}
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
          isDisabled={!(idProp || scriptModelProp)}
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
              !(idProp || scriptModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
