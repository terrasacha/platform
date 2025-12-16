import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import FormSection from "../components/FormSection";
import FormField from "../components/FormField";
import DynamicList from "../components/DynamicList";

const HistorialJuridico = () => {
  const { register, control, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "historial",
  });

  const handleAdd = () => {
    append({
      fechaEvento: "",
      tipoEvento: "",
      detalleEvento: "",
    });
  };

  return (
    <FormSection
      title="Historial Jurídico del Inmueble"
      description="Registro de eventos jurídicos relacionados con el inmueble"
    >
      <DynamicList
        title="Eventos del Historial"
        items={fields}
        onAdd={handleAdd}
        onRemove={remove}
        emptyMessage="No hay eventos registrados en el historial"
        addButtonText="Agregar Evento"
        renderItem={(item, index) => (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
              label="Fecha del Evento"
              name={`historial.${index}.fechaEvento`}
              error={errors.historial?.[index]?.fechaEvento}
              required
            >
              <input
                type="date"
                {...register(`historial.${index}.fechaEvento`)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
              />
            </FormField>

            <FormField
              label="Tipo de Evento"
              name={`historial.${index}.tipoEvento`}
              error={errors.historial?.[index]?.tipoEvento}
              required
            >
              <input
                type="text"
                {...register(`historial.${index}.tipoEvento`)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
                placeholder="Ej: Transferencia, Embargo, etc."
              />
            </FormField>

            <FormField
              label="Detalle del Evento"
              name={`historial.${index}.detalleEvento`}
              error={errors.historial?.[index]?.detalleEvento}
              required
            >
              <input
                type="text"
                {...register(`historial.${index}.detalleEvento`)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
                placeholder="Descripción detallada del evento"
              />
            </FormField>
          </div>
        )}
      />
    </FormSection>
  );
};

export default HistorialJuridico;

