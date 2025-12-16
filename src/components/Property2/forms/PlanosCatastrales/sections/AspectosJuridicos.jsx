import React from "react";
import { useFormContext } from "react-hook-form";
import FormSection from "../components/FormSection";
import FormField from "../components/FormField";

const AspectosJuridicos = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <FormSection
      title="Aspectos Jurídicos Asociados al Predio"
      description="Servidumbres y gravámenes que afectan el predio"
    >
      <FormField
        label="Servidumbres"
        name="servidumbres"
        error={errors.servidumbres}
      >
        <textarea
          {...register("servidumbres")}
          rows={5}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica resize-none"
          placeholder="Descripción detallada de las servidumbres que afectan el predio (paso, acueducto, etc.)"
        />
      </FormField>

      <FormField
        label="Gravámenes"
        name="gravamenes"
        error={errors.gravamenes}
      >
        <textarea
          {...register("gravamenes")}
          rows={5}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica resize-none"
          placeholder="Descripción detallada de los gravámenes que afectan el predio (hipotecas, embargos, etc.)"
        />
      </FormField>
    </FormSection>
  );
};

export default AspectosJuridicos;

