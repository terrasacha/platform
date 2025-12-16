import React from "react";
import { useFormContext } from "react-hook-form";
import FormSection from "../components/FormSection";
import FormField from "../components/FormField";

const IdentificacionInmueble = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <FormSection
      title="Identificación del Inmueble"
      description="Datos de identificación y características del inmueble"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Dirección del Inmueble"
          name="direccionInmueble"
          error={errors.direccionInmueble}
          required
          className="sm:col-span-2"
        >
          <input
            type="text"
            id="direccionInmueble"
            {...register("direccionInmueble")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
            placeholder="Dirección completa del inmueble"
          />
        </FormField>

        <FormField
          label="Matrícula Inmobiliaria"
          name="matriculaInmobiliaria"
          error={errors.matriculaInmobiliaria}
          required
        >
          <input
            type="text"
            id="matriculaInmobiliaria"
            {...register("matriculaInmobiliaria")}
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
            placeholder="Código catastral"
          />
        </FormField>

        <FormField
          label="Área del Terreno (m²)"
          name="areaTerrenoM2"
          error={errors.areaTerrenoM2}
          required
        >
          <input
            type="number"
            step="0.01"
            min="0"
            id="areaTerrenoM2"
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
            step="0.01"
            min="0"
            id="areaConstruidaM2"
            {...register("areaConstruidaM2")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
            placeholder="Ej: 120.00"
          />
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
            <option value="Local Comercial">Local Comercial</option>
            <option value="Oficina">Oficina</option>
            <option value="Bodega">Bodega</option>
            <option value="Otro">Otro</option>
          </select>
        </FormField>

        <FormField
          label="Uso del Suelo"
          name="usoSuelo"
          error={errors.usoSuelo}
          required
        >
          <select
            id="usoSuelo"
            {...register("usoSuelo")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
          >
            <option value="">Seleccione un uso</option>
            <option value="Residencial">Residencial</option>
            <option value="Comercial">Comercial</option>
            <option value="Industrial">Industrial</option>
            <option value="Rural">Rural</option>
            <option value="Mixto">Mixto</option>
          </select>
        </FormField>
      </div>

      {/* Linderos y Medidas */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
        <h4 className="text-sm font-semibold text-terrasacha-primary font-typographica mb-4">
          Linderos y Medidas
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Norte"
            name="linderosMedidas.norte"
            error={errors.linderosMedidas?.norte}
          >
            <input
              type="text"
              {...register("linderosMedidas.norte")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
              placeholder="Descripción del lindero norte"
            />
          </FormField>

          <FormField
            label="Sur"
            name="linderosMedidas.sur"
            error={errors.linderosMedidas?.sur}
          >
            <input
              type="text"
              {...register("linderosMedidas.sur")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
              placeholder="Descripción del lindero sur"
            />
          </FormField>

          <FormField
            label="Este"
            name="linderosMedidas.este"
            error={errors.linderosMedidas?.este}
          >
            <input
              type="text"
              {...register("linderosMedidas.este")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
              placeholder="Descripción del lindero este"
            />
          </FormField>

          <FormField
            label="Oeste"
            name="linderosMedidas.oeste"
            error={errors.linderosMedidas?.oeste}
          >
            <input
              type="text"
              {...register("linderosMedidas.oeste")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c35] font-typographica"
              placeholder="Descripción del lindero oeste"
            />
          </FormField>
        </div>
      </div>
    </FormSection>
  );
};

export default IdentificacionInmueble;

