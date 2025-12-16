import React from "react";
import { useFormContext } from "react-hook-form";
import FormSection from "../components/FormSection";
import FormField from "../components/FormField";

const UsoSueloNormativa = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <FormSection
      title="Información de Uso del Suelo y Normativa"
      description="Normativa y restricciones aplicables al predio"
    >
      <FormField
        label="Zonificación"
        name="zonificacion"
        error={errors.zonificacion}
      >
        <textarea
          {...register("zonificacion")}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica resize-none"
          placeholder="Descripción de la zonificación y normativa aplicable al predio (residencial, comercial, industrial, etc.)"
        />
      </FormField>

      <FormField
        label="Restricciones de Uso"
        name="restriccionesUso"
        error={errors.restriccionesUso}
      >
        <textarea
          {...register("restriccionesUso")}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica resize-none"
          placeholder="Restricciones de uso, limitaciones constructivas, alturas máximas, etc."
        />
      </FormField>
    </FormSection>
  );
};

export default UsoSueloNormativa;

