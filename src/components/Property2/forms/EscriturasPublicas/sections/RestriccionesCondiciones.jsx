import React from "react";
import { useFormContext } from "react-hook-form";
import FormSection from "../components/FormSection";
import FormField from "../components/FormField";

const RestriccionesCondiciones = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <FormSection
      title="Restricciones y Condiciones Especiales"
      description="Restricciones, condiciones y regulaciones especiales aplicables al inmueble"
    >
      <FormField
        label="Condiciones Resolutivas"
        name="condicionesResolutivas"
        error={errors.condicionesResolutivas}
      >
        <textarea
          {...register("condicionesResolutivas")}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica resize-none"
          placeholder="Condiciones resolutivas que puedan afectar la propiedad"
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
          placeholder="Restricciones de uso aplicables al inmueble"
        />
      </FormField>

      <FormField
        label="Regulaciones Especiales"
        name="regulacionesEspeciales"
        error={errors.regulacionesEspeciales}
      >
        <textarea
          {...register("regulacionesEspeciales")}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica resize-none"
          placeholder="Regulaciones especiales, normativas específicas, etc."
        />
      </FormField>
    </FormSection>
  );
};

export default RestriccionesCondiciones;

