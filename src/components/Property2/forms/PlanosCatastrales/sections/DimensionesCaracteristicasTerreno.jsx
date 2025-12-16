import React from "react";
import { useFormContext } from "react-hook-form";
import FormSection from "../components/FormSection";
import FormField from "../components/FormField";

const DimensionesCaracteristicasTerreno = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <FormSection
      title="Dimensiones y Características del Terreno"
      description="Información detallada sobre las dimensiones y características físicas del terreno"
    >
      {/* Dimensiones del Terreno */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
        <h4 className="text-sm font-semibold text-terrasacha-primary font-typographica mb-4">
          Dimensiones del Terreno
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            label="Largo del Terreno (m)"
            name="dimensionesTerreno.largoTerreno"
            error={errors.dimensionesTerreno?.largoTerreno}
          >
            <input
              type="number"
              step="0.01"
              min="0"
              {...register("dimensionesTerreno.largoTerreno")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
              placeholder="Ej: 25.50"
            />
          </FormField>

          <FormField
            label="Ancho del Terreno (m)"
            name="dimensionesTerreno.anchoTerreno"
            error={errors.dimensionesTerreno?.anchoTerreno}
          >
            <input
              type="number"
              step="0.01"
              min="0"
              {...register("dimensionesTerreno.anchoTerreno")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
              placeholder="Ej: 15.30"
            />
          </FormField>

          <FormField
            label="Área del Terreno (m²)"
            name="dimensionesTerreno.areaTerrenoM2"
            error={errors.dimensionesTerreno?.areaTerrenoM2}
            required
          >
            <input
              type="number"
              step="0.01"
              min="0"
              {...register("dimensionesTerreno.areaTerrenoM2")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
              placeholder="Ej: 390.15"
            />
          </FormField>
        </div>
      </div>

      <FormField
        label="Forma del Terreno"
        name="formaTerreno"
        error={errors.formaTerreno}
      >
        <input
          type="text"
          {...register("formaTerreno")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
          placeholder="Ej: Rectangular, irregular, triangular, etc."
        />
      </FormField>

      <FormField
        label="Linderos"
        name="linderos"
        error={errors.linderos}
      >
        <textarea
          {...register("linderos")}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica resize-none"
          placeholder="Descripción detallada de los linderos del predio (Norte, Sur, Este, Oeste)"
        />
      </FormField>

      <FormField
        label="Elevación y Pendiente"
        name="elevacionPendiente"
        error={errors.elevacionPendiente}
      >
        <input
          type="text"
          {...register("elevacionPendiente")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
          placeholder="Ej: Terreno plano, pendiente suave, pendiente pronunciada, etc."
        />
      </FormField>

      <FormField
        label="Características del Suelo"
        name="caracteristicasSuelo"
        error={errors.caracteristicasSuelo}
      >
        <textarea
          {...register("caracteristicasSuelo")}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica resize-none"
          placeholder="Composición del suelo, presencia de cuerpos de agua, vegetación, etc."
        />
      </FormField>
    </FormSection>
  );
};

export default DimensionesCaracteristicasTerreno;

