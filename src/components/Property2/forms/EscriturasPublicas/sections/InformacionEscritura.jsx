import React from "react";
import { useFormContext } from "react-hook-form";
import FormSection from "../components/FormSection";
import FormField from "../components/FormField";

const InformacionEscritura = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <FormSection
      title="Información de la Escritura Pública"
      description="Datos básicos de la escritura pública"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Número de Escritura"
          name="numeroEscritura"
          error={errors.numeroEscritura}
          required
        >
          <input
            type="text"
            id="numeroEscritura"
            {...register("numeroEscritura")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
            placeholder="Ej: 1234"
          />
        </FormField>

        <FormField
          label="Fecha de Otorgamiento"
          name="fechaOtorgamiento"
          error={errors.fechaOtorgamiento}
          required
        >
          <input
            type="date"
            id="fechaOtorgamiento"
            {...register("fechaOtorgamiento")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
          />
        </FormField>

        <FormField
          label="Número de Notaría"
          name="notariaNumero"
          error={errors.notariaNumero}
          required
        >
          <input
            type="text"
            id="notariaNumero"
            {...register("notariaNumero")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
            placeholder="Ej: Primera, Segunda, etc."
          />
        </FormField>

        <FormField
          label="Ciudad de la Notaría"
          name="notariaCiudad"
          error={errors.notariaCiudad}
          required
        >
          <input
            type="text"
            id="notariaCiudad"
            {...register("notariaCiudad")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
            placeholder="Nombre de la ciudad"
          />
        </FormField>

        <FormField
          label="Tipo de Acto Jurídico"
          name="tipoActoJuridico"
          error={errors.tipoActoJuridico}
          required
          className="sm:col-span-2"
        >
          <select
            id="tipoActoJuridico"
            {...register("tipoActoJuridico")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
          >
            <option value="">Seleccione un tipo</option>
            <option value="Compraventa">Compraventa</option>
            <option value="Hipoteca">Hipoteca</option>
            <option value="Donación">Donación</option>
            <option value="Herencia">Herencia</option>
            <option value="Permuta">Permuta</option>
            <option value="División de Propiedad">División de Propiedad</option>
            <option value="Fusión de Propiedades">Fusión de Propiedades</option>
            <option value="Otro">Otro</option>
          </select>
        </FormField>

        <FormField
          label="Descripción del Acto"
          name="descripcionActo"
          error={errors.descripcionActo}
          className="sm:col-span-2"
        >
          <textarea
            id="descripcionActo"
            {...register("descripcionActo")}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica resize-none"
            placeholder="Descripción detallada del acto jurídico realizado"
          />
        </FormField>
      </div>
    </FormSection>
  );
};

export default InformacionEscritura;

