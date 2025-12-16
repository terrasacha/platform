import React from "react";
import { useFormContext } from "react-hook-form";
import FormSection from "../components/FormSection";
import FormField from "../components/FormField";

const IdentificacionPredio = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <FormSection
      title="Identificación del Predio"
      description="Datos de identificación y ubicación del predio"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Número de Matrícula Inmobiliaria"
          name="numeroMatriculaInmobiliaria"
          error={errors.numeroMatriculaInmobiliaria}
          required
        >
          <input
            type="text"
            id="numeroMatriculaInmobiliaria"
            {...register("numeroMatriculaInmobiliaria")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
            placeholder="Ej: 123456789"
          />
        </FormField>

        <FormField
          label="Código Catastral"
          name="codigoCatastral"
          error={errors.codigoCatastral}
          required
        >
          <input
            type="text"
            id="codigoCatastral"
            {...register("codigoCatastral")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
            placeholder="Código catastral del predio"
          />
        </FormField>

        <FormField
          label="Dirección del Predio"
          name="direccionPredio"
          error={errors.direccionPredio}
          required
          className="sm:col-span-2"
        >
          <input
            type="text"
            id="direccionPredio"
            {...register("direccionPredio")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
            placeholder="Dirección completa del predio"
          />
        </FormField>

        <FormField
          label="Departamento"
          name="departamento"
          error={errors.departamento}
          required
        >
          <input
            type="text"
            id="departamento"
            {...register("departamento")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
            placeholder="Nombre del departamento"
          />
        </FormField>

        <FormField
          label="Municipio"
          name="municipio"
          error={errors.municipio}
          required
        >
          <input
            type="text"
            id="municipio"
            {...register("municipio")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
            placeholder="Nombre del municipio"
          />
        </FormField>
      </div>
    </FormSection>
  );
};

export default IdentificacionPredio;

