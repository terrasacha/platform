import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import FormSection from "../components/FormSection";
import FormField from "../components/FormField";
import DynamicList from "../components/DynamicList";

const PropietarioActual = () => {
  const { register, control, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "propietarios",
  });

  const handleAdd = () => {
    append({
      nombreCompleto: "",
      tipoDocumento: "CC",
      numeroDocumento: "",
      porcentajeParticipacion: "",
      modoAdquisicion: "",
    });
  };

  return (
    <FormSection
      title="Información del Propietario Actual"
      description="Datos de los propietarios actuales del inmueble"
    >
      <DynamicList
        title="Propietarios"
        items={fields}
        onAdd={handleAdd}
        onRemove={remove}
        emptyMessage="No hay propietarios registrados"
        addButtonText="Agregar Propietario"
        renderItem={(item, index) => (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Nombre Completo"
                name={`propietarios.${index}.nombreCompleto`}
                error={errors.propietarios?.[index]?.nombreCompleto}
                required
                className="sm:col-span-2"
              >
                <input
                  type="text"
                  {...register(`propietarios.${index}.nombreCompleto`)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
                  placeholder="Nombre completo del propietario"
                />
              </FormField>

              <FormField
                label="Tipo de Documento"
                name={`propietarios.${index}.tipoDocumento`}
                error={errors.propietarios?.[index]?.tipoDocumento}
                required
              >
                <select
                  {...register(`propietarios.${index}.tipoDocumento`)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
                >
                  <option value="CC">Cédula de Ciudadanía (CC)</option>
                  <option value="NIT">NIT</option>
                  <option value="CE">Cédula de Extranjería (CE)</option>
                  <option value="Pasaporte">Pasaporte</option>
                </select>
              </FormField>

              <FormField
                label="Número de Documento"
                name={`propietarios.${index}.numeroDocumento`}
                error={errors.propietarios?.[index]?.numeroDocumento}
                required
              >
                <input
                  type="text"
                  {...register(`propietarios.${index}.numeroDocumento`)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
                  placeholder="Número de documento"
                />
              </FormField>

              <FormField
                label="Porcentaje de Participación (%)"
                name={`propietarios.${index}.porcentajeParticipacion`}
                error={errors.propietarios?.[index]?.porcentajeParticipacion}
              >
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  {...register(`propietarios.${index}.porcentajeParticipacion`)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
                  placeholder="Ej: 50.00"
                />
              </FormField>

              <FormField
                label="Modo de Adquisición"
                name={`propietarios.${index}.modoAdquisicion`}
                error={errors.propietarios?.[index]?.modoAdquisicion}
                required
              >
                <input
                  type="text"
                  {...register(`propietarios.${index}.modoAdquisicion`)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
                  placeholder="Ej: Compra, Sucesión, Donación, etc."
                />
              </FormField>
            </div>
          </div>
        )}
      />

      <FormField
        label="Dirección de Notificación"
        name="direccionNotificacion"
        error={errors.direccionNotificacion}
        className="mt-4"
      >
        <input
          type="text"
          {...register("direccionNotificacion")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
          placeholder="Dirección para notificaciones"
        />
      </FormField>
    </FormSection>
  );
};

export default PropietarioActual;

