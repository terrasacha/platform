import React from "react";
import { useFormContext } from "react-hook-form";
import FormSection from "../components/FormSection";
import FormField from "../components/FormField";

const AnteriorPropietario = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <FormSection
      title="Información del Anterior Propietario"
      description="Datos del propietario anterior del inmueble"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Nombre Completo del Anterior Propietario"
          name="nombreCompletoAnteriorPropietario"
          error={errors.nombreCompletoAnteriorPropietario}
          className="sm:col-span-2"
        >
          <input
            type="text"
            {...register("nombreCompletoAnteriorPropietario")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
            placeholder="Nombre completo del anterior propietario"
          />
        </FormField>

        <FormField
          label="Tipo de Documento"
          name="tipoDocumentoAnterior"
          error={errors.tipoDocumentoAnterior}
        >
          <select
            {...register("tipoDocumentoAnterior")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
          >
            <option value="">Seleccione un tipo</option>
            <option value="CC">Cédula de Ciudadanía (CC)</option>
            <option value="NIT">NIT</option>
            <option value="CE">Cédula de Extranjería (CE)</option>
            <option value="Pasaporte">Pasaporte</option>
          </select>
        </FormField>

        <FormField
          label="Número de Documento"
          name="numeroDocumentoAnterior"
          error={errors.numeroDocumentoAnterior}
        >
          <input
            type="text"
            {...register("numeroDocumentoAnterior")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
            placeholder="Número de documento"
          />
        </FormField>

        <FormField
          label="Forma de Transmisión de Propiedad"
          name="formaTransmisionPropiedad"
          error={errors.formaTransmisionPropiedad}
        >
          <input
            type="text"
            {...register("formaTransmisionPropiedad")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
            placeholder="Ej: Compraventa, Herencia, Donación, etc."
          />
        </FormField>

        <FormField
          label="Fecha de Traspaso"
          name="fechaTraspaso"
          error={errors.fechaTraspaso}
        >
          <input
            type="date"
            {...register("fechaTraspaso")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
          />
        </FormField>
      </div>
    </FormSection>
  );
};

export default AnteriorPropietario;

