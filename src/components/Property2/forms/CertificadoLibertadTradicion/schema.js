import { z } from "zod";

// Esquema de validación para Historial Jurídico
const historialItemSchema = z.object({
  fechaEvento: z.string().min(1, "La fecha del evento es requerida"),
  tipoEvento: z.string().min(1, "El tipo de evento es requerido"),
  detalleEvento: z.string().min(1, "El detalle del evento es requerido"),
});

// Esquema de validación para Gravámenes
const gravamenItemSchema = z.object({
  tipoGravamen: z.enum([
    "Hipoteca",
    "Embargo",
    "Servidumbre",
    "Prohibición de Enajenar",
    "Embargo Preventivo",
    "Otro",
  ], {
    required_error: "El tipo de gravamen es requerido",
  }),
  descripcionGravamen: z.string().min(1, "La descripción del gravamen es requerida"),
  fechaRegistro: z.string().min(1, "La fecha de registro es requerida"),
  fechaCancelacion: z.string().optional(),
  entidadPersonaAsociada: z.string().min(1, "La entidad o persona asociada es requerida"),
});

// Esquema principal del formulario
export const certificadoLibertadTradicionSchema = z.object({
  // 1. Información General del Certificado
  pinCertificado: z.string().min(1, "El PIN del certificado es requerido"),
  fechaExpedicion: z.string().min(1, "La fecha de expedición es requerida"),
  estadoFolio: z.string().min(1, "El estado del folio es requerido"),
  datosComplementacion: z.string().optional(),

  // 2. Identificación del Predio
  numeroMatriculaInmobiliaria: z.string().min(1, "El número de matrícula inmobiliaria es requerido"),
  codigoCatastral: z.string().min(1, "El código catastral es requerido"),
  direccionPredio: z.string().min(1, "La dirección del predio es requerida"),
  departamento: z.string().min(1, "El departamento es requerido"),
  municipio: z.string().min(1, "El municipio es requerido"),

  // 3. Características del Inmueble
  tipoPredio: z.enum([
    "Urbano",
    "Suburbano",
    "Rural",
    "Hipotecario",
    "Dominante",
    "Sirviente",
  ], {
    required_error: "El tipo de predio es requerido",
  }),
  tipoInmueble: z.enum([
    "Casa",
    "Apartamento",
    "Lote",
    "Finca",
    "Local",
    "Oficina",
    "Bodega",
    "Otro",
  ], {
    required_error: "El tipo de inmueble es requerido",
  }),
  areaTerrenoM2: z.string().min(1, "El área del terreno es requerida").regex(/^\d+(\.\d+)?$/, "Debe ser un número válido"),
  areaConstruidaM2: z.string().optional().refine((val) => !val || /^\d+(\.\d+)?$/.test(val), {
    message: "Debe ser un número válido",
  }),

  // 4. Datos de Propiedad (Propietario Actual)
  nombreCompletoORazonSocial: z.string().min(1, "El nombre completo o razón social es requerido"),
  tipoDocumento: z.enum(["CC", "NIT", "CE", "Pasaporte"], {
    required_error: "El tipo de documento es requerido",
  }),
  numeroDocumento: z.string().min(1, "El número de documento es requerido"),
  modoAdquisicionActual: z.string().min(1, "El modo de adquisición es requerido"),
  fechaInscripcion: z.string().min(1, "La fecha de inscripción es requerida"),

  // 5. Historial Jurídico del Inmueble
  historial: z.array(historialItemSchema).default([]),

  // 6. Gravámenes y Limitaciones al Dominio
  gravamenes: z.array(gravamenItemSchema).default([]),
});

