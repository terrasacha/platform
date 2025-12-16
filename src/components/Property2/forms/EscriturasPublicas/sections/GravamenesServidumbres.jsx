import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import FormSection from "../components/FormSection";
import FormField from "../components/FormField";
import DynamicList from "../components/DynamicList";

const GravamenesServidumbres = () => {
  const { register, control, formState: { errors } } = useFormContext();
  
  const { fields: gravamenesFields, append: appendGravamen, remove: removeGravamen } = useFieldArray({
    control,
    name: "gravamenes",
  });

  const { fields: servidumbresFields, append: appendServidumbre, remove: removeServidumbre } = useFieldArray({
    control,
    name: "servidumbres",
  });

  const handleAddGravamen = () => {
    appendGravamen({
      descripcionGravamen: "",
      fechaRegistro: "",
      fechaCancelacion: "",
    });
  };

  const handleAddServidumbre = () => {
    appendServidumbre({
      descripcionServidumbre: "",
      fechaRegistroServidumbre: "",
      fechaCancelacionServidumbre: "",
    });
  };

  return (
    <FormSection
      title="Gravámenes y Servidumbres"
      description="Registro de gravámenes y servidumbres que afectan el inmueble"
    >
      {/* Gravámenes */}
      <div className="mb-6">
        <DynamicList
          title="Gravámenes"
          items={gravamenesFields}
          onAdd={handleAddGravamen}
          onRemove={removeGravamen}
          emptyMessage="No hay gravámenes registrados"
          addButtonText="Agregar Gravamen"
          renderItem={(item, index) => (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                label="Descripción del Gravamen"
                name={`gravamenes.${index}.descripcionGravamen`}
                error={errors.gravamenes?.[index]?.descripcionGravamen}
                required
                className="sm:col-span-3"
              >
                <textarea
                  {...register(`gravamenes.${index}.descripcionGravamen`)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica resize-none"
                  placeholder="Descripción detallada del gravamen"
                />
              </FormField>

              <FormField
                label="Fecha de Registro"
                name={`gravamenes.${index}.fechaRegistro`}
                error={errors.gravamenes?.[index]?.fechaRegistro}
                required
              >
                <input
                  type="date"
                  {...register(`gravamenes.${index}.fechaRegistro`)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
                />
              </FormField>

              <FormField
                label="Fecha de Cancelación"
                name={`gravamenes.${index}.fechaCancelacion`}
                error={errors.gravamenes?.[index]?.fechaCancelacion}
              >
                <input
                  type="date"
                  {...register(`gravamenes.${index}.fechaCancelacion`)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
                />
              </FormField>
            </div>
          )}
        />
      </div>

      {/* Servidumbres */}
      <div>
        <DynamicList
          title="Servidumbres"
          items={servidumbresFields}
          onAdd={handleAddServidumbre}
          onRemove={removeServidumbre}
          emptyMessage="No hay servidumbres registradas"
          addButtonText="Agregar Servidumbre"
          renderItem={(item, index) => (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                label="Descripción de la Servidumbre"
                name={`servidumbres.${index}.descripcionServidumbre`}
                error={errors.servidumbres?.[index]?.descripcionServidumbre}
                required
                className="sm:col-span-3"
              >
                <textarea
                  {...register(`servidumbres.${index}.descripcionServidumbre`)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica resize-none"
                  placeholder="Descripción detallada de la servidumbre"
                />
              </FormField>

              <FormField
                label="Fecha de Registro"
                name={`servidumbres.${index}.fechaRegistroServidumbre`}
                error={errors.servidumbres?.[index]?.fechaRegistroServidumbre}
                required
              >
                <input
                  type="date"
                  {...register(`servidumbres.${index}.fechaRegistroServidumbre`)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
                />
              </FormField>

              <FormField
                label="Fecha de Cancelación"
                name={`servidumbres.${index}.fechaCancelacionServidumbre`}
                error={errors.servidumbres?.[index]?.fechaCancelacionServidumbre}
              >
                <input
                  type="date"
                  {...register(`servidumbres.${index}.fechaCancelacionServidumbre`)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
                />
              </FormField>
            </div>
          )}
        />
      </div>
    </FormSection>
  );
};

export default GravamenesServidumbres;

