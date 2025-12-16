import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaMagic } from "react-icons/fa";
import { escriturasPublicasSchema } from "./schema";
import InformacionEscritura from "./sections/InformacionEscritura";
import IdentificacionInmueble from "./sections/IdentificacionInmueble";
import PropietarioActual from "./sections/PropietarioActual";
import AnteriorPropietario from "./sections/AnteriorPropietario";
import GravamenesServidumbres from "./sections/GravamenesServidumbres";
import RestriccionesCondiciones from "./sections/RestriccionesCondiciones";

const EscriturasPublicasForm = ({ 
  initialData, 
  onSubmit, 
  isLoading = false,
  showFixedFooter = false
}) => {
  const methods = useForm({
    resolver: zodResolver(escriturasPublicasSchema),
    defaultValues: {
      numeroEscritura: "",
      fechaOtorgamiento: "",
      notariaNumero: "",
      notariaCiudad: "",
      tipoActoJuridico: "",
      descripcionActo: "",
      direccionInmueble: "",
      matriculaInmobiliaria: "",
      codigoCatastral: "",
      areaTerrenoM2: "",
      areaConstruidaM2: "",
      tipoInmueble: "",
      usoSuelo: "",
      linderosMedidas: {
        norte: "",
        sur: "",
        este: "",
        oeste: "",
      },
      propietarios: [],
      direccionNotificacion: "",
      nombreCompletoAnteriorPropietario: "",
      tipoDocumentoAnterior: "",
      numeroDocumentoAnterior: "",
      formaTransmisionPropiedad: "",
      fechaTraspaso: "",
      gravamenes: [],
      servidumbres: [],
      condicionesResolutivas: "",
      restriccionesUso: "",
      regulacionesEspeciales: "",
      ...initialData,
    },
  });

  // Cargar datos iniciales cuando cambien
  useEffect(() => {
    if (initialData) {
      methods.reset({
        numeroEscritura: "",
        fechaOtorgamiento: "",
        notariaNumero: "",
        notariaCiudad: "",
        tipoActoJuridico: "",
        descripcionActo: "",
        direccionInmueble: "",
        matriculaInmobiliaria: "",
        codigoCatastral: "",
        areaTerrenoM2: "",
        areaConstruidaM2: "",
        tipoInmueble: "",
        usoSuelo: "",
        linderosMedidas: {
          norte: "",
          sur: "",
          este: "",
          oeste: "",
        },
        propietarios: [],
        direccionNotificacion: "",
        nombreCompletoAnteriorPropietario: "",
        tipoDocumentoAnterior: "",
        numeroDocumentoAnterior: "",
        formaTransmisionPropiedad: "",
        fechaTraspaso: "",
        gravamenes: [],
        servidumbres: [],
        condicionesResolutivas: "",
        restriccionesUso: "",
        regulacionesEspeciales: "",
        ...initialData,
      });
    }
  }, [initialData, methods]);

  const handleSubmit = async (data) => {
    if (onSubmit) {
      await onSubmit(data);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col min-h-full">
        <form 
          onSubmit={methods.handleSubmit(handleSubmit)}
          className="flex-1"
        >
          <div className={`space-y-6 ${showFixedFooter ? 'pb-24' : ''}`}>
            <InformacionEscritura />
            <IdentificacionInmueble />
            <PropietarioActual />
            <AnteriorPropietario />
            <GravamenesServidumbres />
            <RestriccionesCondiciones />
          </div>
        </form>

        {/* Footer fijo */}
        <div className={`${showFixedFooter ? 'sticky bottom-0' : ''} bg-white border-t border-gray-200 px-4 sm:px-6 py-4 mt-auto z-10 ${showFixedFooter ? 'shadow-lg' : ''}`}>
          <div className="flex justify-between items-center">
            <button
              type="button"
              disabled={true}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-300 text-gray-500 rounded-lg font-semibold font-typographica cursor-not-allowed opacity-60"
              title="Funcionalidad de autocompletado desde PDF - Próximamente"
            >
              <FaMagic className="w-4 h-4" />
              <span>Autorellenar desde PDF</span>
            </button>
            
            <button
              type="submit"
              onClick={methods.handleSubmit(handleSubmit)}
              disabled={isLoading}
              className="px-6 py-2 bg-[#6e6c35] hover:bg-[#849b50] text-white rounded-lg font-semibold font-typographica transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Guardando..." : "Guardar Información"}
            </button>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default EscriturasPublicasForm;

