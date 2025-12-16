import React from "react";
import { useFormContext } from "react-hook-form";
import FormSection from "../components/FormSection";
import FormField from "../components/FormField";

const ConstruccionesPredio = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <FormSection
      title="Construcciones en el Predio"
      description="Información sobre las construcciones existentes en el predio"
    >
      <FormField
        label="Ubicación de las Construcciones"
        name="ubicacionConstrucciones"
        error={errors.ubicacionConstrucciones}
      >
        <textarea
          {...register("ubicacionConstrucciones")}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica resize-none"
          placeholder="Descripción de la ubicación de las construcciones dentro del predio"
        />
      </FormField>

      <FormField
        label="Dimensiones de las Construcciones"
        name="dimensionesConstrucciones"
        error={errors.dimensionesConstrucciones}
      >
        <textarea
          {...register("dimensionesConstrucciones")}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica resize-none"
          placeholder="Dimensiones, áreas construidas, número de pisos, etc."
        />
      </FormField>

      <FormField
        label="Tipos de Construcciones"
        name="tiposConstrucciones"
        error={errors.tiposConstrucciones}
      >
        <input
          type="text"
          {...register("tiposConstrucciones")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
          placeholder="Ej: Casa, edificio, bodega, garaje, etc."
        />
      </FormField>

      <FormField
        label="Uso de las Construcciones"
        name="usoConstrucciones"
        error={errors.usoConstrucciones}
      >
        <select
          {...register("usoConstrucciones")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
        >
          <option value="">Seleccione un uso</option>
          <option value="Habitacional">Habitacional</option>
          <option value="Comercial">Comercial</option>
          <option value="Industrial">Industrial</option>
          <option value="Mixto">Mixto</option>
          <option value="Institucional">Institucional</option>
          <option value="Recreativo">Recreativo</option>
          <option value="Otro">Otro</option>
        </select>
      </FormField>
    </FormSection>
  );
};

export default ConstruccionesPredio;

