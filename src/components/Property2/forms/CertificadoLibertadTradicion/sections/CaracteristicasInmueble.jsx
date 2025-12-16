import React from "react";
import { useFormContext } from "react-hook-form";
import FormSection from "../components/FormSection";
import FormField from "../components/FormField";

const CaracteristicasInmueble = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <FormSection
      title="Características del Inmueble"
      description="Información sobre las características físicas del inmueble"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Tipo de Predio"
          name="tipoPredio"
          error={errors.tipoPredio}
          required
        >
          <select
            id="tipoPredio"
            {...register("tipoPredio")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
          >
            <option value="">Seleccione un tipo</option>
            <option value="Urbano">Urbano</option>
            <option value="Suburbano">Suburbano</option>
            <option value="Rústico">Rústico</option>
            <option value="Hipotecario">Hipotecario</option>
            <option value="Dominante">Dominante</option>
            <option value="Sirviente">Sirviente</option>
          </select>
        </FormField>

        <FormField
          label="Tipo de Inmueble"
          name="tipoInmueble"
          error={errors.tipoInmueble}
          required
        >
          <select
            id="tipoInmueble"
            {...register("tipoInmueble")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
          >
            <option value="">Seleccione un tipo</option>
            <option value="Casa">Casa</option>
            <option value="Apartamento">Apartamento</option>
            <option value="Lote">Lote</option>
            <option value="Finca">Finca</option>
            <option value="Local">Local</option>
            <option value="Oficina">Oficina</option>
            <option value="Bodega">Bodega</option>
            <option value="Otro">Otro</option>
          </select>
        </FormField>

        <FormField
          label="Área del Terreno (m²)"
          name="areaTerrenoM2"
          error={errors.areaTerrenoM2}
          required
        >
          <input
            type="number"
            id="areaTerrenoM2"
            step="0.01"
            min="0"
            {...register("areaTerrenoM2")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
            placeholder="Ej: 150.50"
          />
        </FormField>

        <FormField
          label="Área Construida (m²)"
          name="areaConstruidaM2"
          error={errors.areaConstruidaM2}
        >
          <input
            type="number"
            id="areaConstruidaM2"
            step="0.01"
            min="0"
            {...register("areaConstruidaM2")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
            placeholder="Ej: 120.00"
          />
        </FormField>
      </div>
    </FormSection>
  );
};

export default CaracteristicasInmueble;

