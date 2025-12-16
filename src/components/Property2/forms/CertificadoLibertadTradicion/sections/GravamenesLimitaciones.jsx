import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import FormSection from "../components/FormSection";
import FormField from "../components/FormField";
import DynamicList from "../components/DynamicList";

const GravamenesLimitaciones = () => {
  const { register, control, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "gravamenes",
  });

  const handleAdd = () => {
    append({
      tipoGravamen: "Hipoteca",
      descripcionGravamen: "",
      fechaRegistro: "",
      fechaCancelacion: "",
      entidadPersonaAsociada: "",
    });
  };

  return (
    <FormSection
      title="Gravámenes y Limitaciones al Dominio"
      description="Registro de gravámenes y limitaciones que afectan el dominio del inmueble"
    >
      <DynamicList
        title="Gravámenes Registrados"
        items={fields}
        onAdd={handleAdd}
        onRemove={remove}
        emptyMessage="No hay gravámenes registrados"
        addButtonText="Agregar Gravamen"
        renderItem={(item, index) => (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Tipo de Gravamen"
                name={`gravamenes.${index}.tipoGravamen`}
                error={errors.gravamenes?.[index]?.tipoGravamen}
                required
              >
                <select
                  {...register(`gravamenes.${index}.tipoGravamen`)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
                >
                  <option value="Hipoteca">Hipoteca</option>
                  <option value="Embargo">Embargo</option>
                  <option value="Servidumbre">Servidumbre</option>
                  <option value="Prohibición de Enajenar">Prohibición de Enajenar</option>
                  <option value="Embargo Preventivo">Embargo Preventivo</option>
                  <option value="Otro">Otro</option>
                </select>
              </FormField>

              <FormField
                label="Entidad o Persona Asociada"
                name={`gravamenes.${index}.entidadPersonaAsociada`}
                error={errors.gravamenes?.[index]?.entidadPersonaAsociada}
                required
              >
                <input
                  type="text"
                  {...register(`gravamenes.${index}.entidadPersonaAsociada`)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
                  placeholder="Nombre de la entidad o persona"
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

            <FormField
              label="Descripción del Gravamen"
              name={`gravamenes.${index}.descripcionGravamen`}
              error={errors.gravamenes?.[index]?.descripcionGravamen}
              required
            >
              <textarea
                {...register(`gravamenes.${index}.descripcionGravamen`)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica resize-none"
                placeholder="Descripción detallada del gravamen"
              />
            </FormField>
          </div>
        )}
      />
    </FormSection>
  );
};

export default GravamenesLimitaciones;

