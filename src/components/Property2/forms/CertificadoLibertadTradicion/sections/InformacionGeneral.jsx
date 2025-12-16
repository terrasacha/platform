import React from "react";
import { useFormContext } from "react-hook-form";
import FormSection from "../components/FormSection";
import FormField from "../components/FormField";

const InformacionGeneral = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <FormSection
      title="Información General del Certificado"
      description="Datos básicos del certificado de libertad y tradición"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="PIN del Certificado"
          name="pinCertificado"
          error={errors.pinCertificado}
          required
        >
          <input
            type="text"
            id="pinCertificado"
            {...register("pinCertificado")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
            placeholder="Ingrese el PIN del certificado"
          />
        </FormField>

        <FormField
          label="Fecha de Expedición"
          name="fechaExpedicion"
          error={errors.fechaExpedicion}
          required
        >
          <input
            type="date"
            id="fechaExpedicion"
            {...register("fechaExpedicion")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
          />
        </FormField>

        <FormField
          label="Estado del Folio"
          name="estadoFolio"
          error={errors.estadoFolio}
          required
        >
          <input
            type="text"
            id="estadoFolio"
            {...register("estadoFolio")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
            placeholder="Ej: Libre, Gravado, etc."
          />
        </FormField>
      </div>

      <FormField
        label="Datos de Complementación"
        name="datosComplementacion"
        error={errors.datosComplementacion}
      >
        <textarea
          id="datosComplementacion"
          {...register("datosComplementacion")}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica resize-none"
          placeholder="Información adicional o complementaria del certificado"
        />
      </FormField>
    </FormSection>
  );
};

export default InformacionGeneral;

