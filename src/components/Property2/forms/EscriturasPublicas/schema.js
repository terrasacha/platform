import { z } from "zod";

// Esquema para linderos y medidas
const linderosMedidasSchema = z.object({
  norte: z.string().optional(),
  sur: z.string().optional(),
  este: z.string().optional(),
  oeste: z.string().optional(),
});

// Esquema para propietarios
const propietarioSchema = z.object({
  nombreCompleto: z.string().min(1, "El nombre completo es requerido"),
  tipoDocumento: z.enum(["CC", "NIT", "CE", "Pasaporte"], {
    required_error: "El tipo de documento es requerido",
  }),
  numeroDocumento: z.string().min(1, "El número de documento es requerido"),
  porcentajeParticipacion: z.string().optional().refine((val) => !val || /^\d+(\.\d+)?$/.test(val), {
    message: "Debe ser un número válido",
  }),
  modoAdquisicion: z.string().min(1, "El modo de adquisición es requerido"),
});

// Esquema para gravámenes
const gravamenSchema = z.object({
  descripcionGravamen: z.string().min(1, "La descripción del gravamen es requerida"),
  fechaRegistro: z.string().min(1, "La fecha de registro es requerida"),
  fechaCancelacion: z.string().optional(),
});

// Esquema para servidumbres
const servidumbreSchema = z.object({
  descripcionServidumbre: z.string().min(1, "La descripción de la servidumbre es requerida"),
  fechaRegistroServidumbre: z.string().min(1, "La fecha de registro es requerida"),
  fechaCancelacionServidumbre: z.string().optional(),
});

// Esquema principal del formulario
export const escriturasPublicasSchema = z.object({
  // 1. Información de la Escritura Pública
  numeroEscritura: z.string().min(1, "El número de escritura es requerido"),
  fechaOtorgamiento: z.string().min(1, "La fecha de otorgamiento es requerida"),
  notariaNumero: z.string().min(1, "El número de notaría es requerido"),
  notariaCiudad: z.string().min(1, "La ciudad de la notaría es requerida"),
  tipoActoJuridico: z.string().min(1, "El tipo de acto jurídico es requerido"),
  descripcionActo: z.string().optional(),

  // 2. Identificación del Inmueble
  direccionInmueble: z.string().min(1, "La dirección del inmueble es requerida"),
  matriculaInmobiliaria: z.string().min(1, "La matrícula inmobiliaria es requerida"),
  codigoCatastral: z.string().min(1, "El código catastral es requerido"),
  areaTerrenoM2: z.string().min(1, "El área del terreno es requerida").regex(/^\d+(\.\d+)?$/, "Debe ser un número válido"),
  areaConstruidaM2: z.string().optional().refine((val) => !val || /^\d+(\.\d+)?$/.test(val), {
    message: "Debe ser un número válido",
  }),
  tipoInmueble: z.string().min(1, "El tipo de inmueble es requerido"),
  usoSuelo: z.enum(["Residencial", "Comercial", "Industrial", "Rural", "Mixto"], {
    required_error: "El uso del suelo es requerido",
  }),
  linderosMedidas: linderosMedidasSchema.optional(),

  // 3. Información del Propietario Actual
  propietarios: z.array(propietarioSchema).min(1, "Debe haber al menos un propietario"),
  direccionNotificacion: z.string().optional(),

  // 4. Información del Anterior Propietario
  nombreCompletoAnteriorPropietario: z.string().optional(),
  tipoDocumentoAnterior: z.string().optional(),
  numeroDocumentoAnterior: z.string().optional(),
  formaTransmisionPropiedad: z.string().optional(),
  fechaTraspaso: z.string().optional(),

  // 5. Gravámenes y Servidumbres
  gravamenes: z.array(gravamenSchema).default([]),
  servidumbres: z.array(servidumbreSchema).default([]),

  // 6. Restricciones y Condiciones Especiales
  condicionesResolutivas: z.string().optional(),
  restriccionesUso: z.string().optional(),
  regulacionesEspeciales: z.string().optional(),
});

