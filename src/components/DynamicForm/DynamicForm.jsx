import useXLSXForm from "hooks/useXLSXForm";
import { useEffect, useState } from "react";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import { findObjectByName, getFieldRelevantCondition } from "./utils";
import { notify } from "utilities/notify";
import { ToastContainer } from "react-toastify";
import FormGroup from "components/common/FormGroup";

export default function DynamicForm(props) {
  const {
    XLSFormURL,
    handleSubmit,
    submitBtnLabel,
    formData,
    setFormData,
    formDataErrors,
    setFormDataErrors,
  } = props;

  // Get form data from XLSFormURL
  const { data } = useXLSXForm(XLSFormURL);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const mapXLSXFormFieldsToFormData = (fields) => {
      const result = {};

      function addObjectNamesToResult(obj) {
        if (obj.name) {
          result[obj.name] = "";
        }
        if (obj.items && Array.isArray(obj.items)) {
          obj.items.forEach(addObjectNamesToResult);
        }
      }

      fields.forEach(addObjectNamesToResult);

      return result;
    };

    if (data) {
      const formDataFields = mapXLSXFormFieldsToFormData(data.survey);
      setFormData(formDataFields);
      console.log(data);
    }
  }, [data]);

  const handleFieldChange = (event) => {
    const { name, type, value, checked } = event.target;

    setFormData((prevFormData) => {
      const updatedFormData = { ...prevFormData };

      if (type === "checkbox") {
        if (!Array.isArray(updatedFormData[name])) {
          updatedFormData[name] = [];
        }

        if (checked && !updatedFormData[name].includes(value)) {
          updatedFormData[name].push(value);
        } else if (!checked) {
          updatedFormData[name] = updatedFormData[name].filter(
            (val) => val !== value
          );
        }
      } else if (type === "radio" && checked) {
        updatedFormData[name] = value;
      } else if (type === "file") {
        updatedFormData[name] = event.target.files[0];
      } else {
        updatedFormData[name] = value;
      }

      return updatedFormData;
    });
  };

  const getFormFields = (fields, options, idx = "") => {
    return fields.map((field, index) => {
      let type = field.type;
      if (field.type.includes("select_one")) type = "select_one";
      if (field.type.includes("select_multiple")) type = "select_multiple";
      const fieldComponent = fieldComponents[type];

      // Evaluar si el campo cumple las condiciones para ser visible
      const relevant = field.relevant;
      if (relevant) {
        const relevantData = getFieldRelevantCondition(relevant);
        if (
          relevantData &&
          ((!Array.isArray(formData[relevantData.relevantField]) &&
            formData[relevantData.relevantField] !==
              relevantData.relevantValue) ||
            (Array.isArray(formData[relevantData.relevantField]) &&
              !formData[relevantData.relevantField].includes(
                relevantData.relevantValue
              )))
        ) {
          return null; // No renderizar el campo si no cumple con la condición de visiblidad
        }
      }

      return fieldComponent(field, options, idx);
    });
  };

  const validateFormData = () => {
    const errors = {};
    for (const fieldName in formData) {
      // toDo evaluate constraints too
      const value = formData[fieldName];

      const { required, required_message } = findObjectByName(
        data.survey,
        fieldName
      );
      const isRequired = required === "yes";

      if (isRequired && (value === undefined || value === "")) {
        errors[fieldName] = required_message || "Este campo es requerido";
      }
    }
    return errors;
  };

  const validateAndHandleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    const errors = validateFormData();
    setFormDataErrors(errors);

    const firstErrorField = document.querySelector(
      `[name="${Object.keys(errors)[0]}"]`
    );
    if (firstErrorField) {
      firstErrorField.focus();
      console.log("Datos del formulario:", formData);
      console.log("Errores:", errors);
      notify({
        msg: "Hicieron falta algunos campos por completar",
        type: "error",
      });
      setIsLoading(false);
      return;
    }

    notify({
      msg: "El proyecto será cargado, pronto será redirigido",
      type: "success",
    });

    handleSubmit(e);

    setIsLoading(false);
  };

  const renderFormGroup = (
    inputType,
    inputName,
    label,
    hint,
    required,
    optionList = [],
    disabled = false
  ) => {
    return (
      <FormGroup
        disabled={disabled}
        inputType={inputType}
        inputSize="md"
        label={label}
        hint={hint}
        required={required === "yes"}
        inputName={inputName}
        inputValue={formData[inputName] || ""}
        inputError={formDataErrors[inputName] || ""}
        optionCheckedList={formData[inputName] || ""}
        optionList={optionList}
        onChangeInputValue={handleFieldChange}
      />
    );
  };

  const fieldComponents = {
    note: ({ label }) => <div className="col-12 col-12-lg">{label}</div>,
    text: ({ name, label, appearance, hint, required, readonly }) => {
      const inputType = appearance === "multiline" ? "textarea" : "text";
      const disabled = readonly === "true";
      return renderFormGroup(
        inputType,
        name,
        label,
        hint,
        required,
        [],
        disabled
      );
    },
    integer: ({ name, label, hint, required }) => {
      return renderFormGroup("number", name, label, hint, required);
    },
    select_one: ({ type, name, label, hint, required }, options, idx) => {
      const listName = type.split(" ")[1];
      const optionList = options[listName].map((option) => ({
        label: option.label,
        value: option.name,
      }));
      const final_name = name + idx;
      return renderFormGroup(
        "radio",
        final_name,
        label,
        hint,
        required,
        optionList
      );
    },
    select_multiple: ({ type, name, label, hint, required }, options) => {
      const listName = type.split(" ")[1];
      const optionList = options[listName].map((option) => ({
        label: option.label,
        value: option.name,
      }));

      return renderFormGroup(
        "checkbox",
        name,
        label,
        hint,
        required,
        optionList
      );
    },
    file: ({ name, label, hint, required }) => {
      return renderFormGroup("file", name, label, hint, required);
    },
    image: ({ name, label, hint, required }) => {
      return renderFormGroup("file", name, label, hint, required);
    },
    geopoint: ({ name, label, hint, required }) => {
      function onMapClick({ x, y, lat, lng, event }) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: [{ lat, lng }],
        }));
      }

      return (
        <FormGroup
          inputType="geopoint"
          label={label}
          markers={formData[name] || []}
          onMapClick={onMapClick}
        />
      );
    },
    begin_group: ({ label, items }, options) => (
      <div className="col-12 col-12-lg border p-3">
        <div className="row">
          <div className="col-12 col-12-lg">
            <h4>{label}</h4>
          </div>
          {getFormFields(items, options)}
        </div>
      </div>
    ),
    // begin_repeat: ({ label, items }, options) => {
    //   return <RepeatFormFields label={label} items={items} options={options}/>
    // },
  };

  // function RepeatFormFields({ label, items, options }) {
  //   const [repeatCount, setRepeatCount] = useState(0);

  //   const addNewRecord = () => {
  //     setRepeatCount(repeatCount + 1);
  //   };
  //   const deletRecord = () => {
  //     setRepeatCount(repeatCount - 1);
  //   }

  //   return (
  //     <div className="col-12 col-12-lg border p-3">
  //       <div className="row">
  //         <div className="col-12 col-12-lg">
  //           <h4>{label}</h4>
  //         </div>
  //         {Array.from({ length: repeatCount }).map((_, index) => (
  //           <div key={index} className="border p-3 my-2">{getFormFields(items, options, index)}</div>
  //         ))}
  //         <button onClick={addNewRecord}>Nuevo registro</button>
  //         <button onClick={deletRecord} variant="danger">Eliminar registro</button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <>
      {data && (
        <form onSubmit={validateAndHandleSubmit}>
          <div className="row row-cols-1 border p-2 g-2">
            {getFormFields(data.survey, data.options)}
          </div>
          <div className="d-flex justify-content-center my-5">
            <button type="submit">
              {isLoading ? (
                <Spinner size="sm" className="p-2"></Spinner>
              ) : (
                submitBtnLabel
              )}
            </button>
          </div>
        </form>
      )}
      <ToastContainer></ToastContainer>
    </>
  );
}
