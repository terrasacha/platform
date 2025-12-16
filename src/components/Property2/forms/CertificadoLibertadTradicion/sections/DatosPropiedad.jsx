import React from "react";
import { useFormContext } from "react-hook-form";
import FormSection from "../components/FormSection";
import FormField from "../components/FormField";

const DatosPropiedad = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <FormSection
      title="Datos de Propiedad (Propietario Actual)"
      description="Información del propietario actual del inmueble"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Nombre Completo o Razón Social"
          name="nombreCompletoORazonSocial"
          error={errors.nombreCompletoORazonSocial}
          required
          className="sm:col-span-2"
        >
          <input
            type="text"
            id="nombreCompletoORazonSocial"
            {...register("nombreCompletoORazonSocial")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
            placeholder="Nombre completo o razón social del propietario"
          />
        </FormField>

        <FormField
          label="Tipo de Documento"
          name="tipoDocumento"
          error={errors.tipoDocumento}
          required
        >
          <select
            id="tipoDocumento"
            {...register("tipoDocumento")}
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
          name="numeroDocumento"
          error={errors.numeroDocumento}
          required
        >
          <input
            type="text"
            id="numeroDocumento"
            {...register("numeroDocumento")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
            placeholder="Número de documento"
          />
        </FormField>

        <FormField
          label="Modo de Adquisición Actual"
          name="modoAdquisicionActual"
          error={errors.modoAdquisicionActual}
          required
        >
          <input
            type="text"
            id="modoAdquisicionActual"
            {...register("modoAdquisicionActual")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
            placeholder="Ej: Compraventa, Herencia, etc."
          />
        </FormField>

        <FormField
          label="Fecha de Inscripción"
          name="fechaInscripcion"
          error={errors.fechaInscripcion}
          required
        >
          <input
            type="date"
            id="fechaInscripcion"
            {...register("fechaInscripcion")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
          />
        </FormField>
      </div>
    </FormSection>
  );
};

export default DatosPropiedad;

