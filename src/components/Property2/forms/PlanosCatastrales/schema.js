import { z } from "zod";

// Esquema para dimensiones del terreno
const dimensionesTerrenoSchema = z.object({
  largoTerreno: z.string().optional(),
  anchoTerreno: z.string().optional(),
  areaTerrenoM2: z.string().min(1, "El área del terreno es requerida").regex(/^\d+(\.\d+)?$/, "Debe ser un número válido"),
});

// Esquema principal del formulario
export const planosCatastralesSchema = z.object({
  // 1. Identificación del Predio
  numeroMatriculaInmobiliaria: z.string().min(1, "El número de matrícula inmobiliaria es requerido"),
  codigoCatastral: z.string().min(1, "El código catastral es requerido"),
  direccionInmueble: z.string().min(1, "La dirección del inmueble es requerida"),

  // 2. Dimensiones y Características del Terreno
  dimensionesTerreno: dimensionesTerrenoSchema,
  formaTerreno: z.string().optional(),
  linderos: z.string().optional(),
  elevacionPendiente: z.string().optional(),
  caracteristicasSuelo: z.string().optional(),

  // 3. Construcciones en el Predio
  ubicacionConstrucciones: z.string().optional(),
  dimensionesConstrucciones: z.string().optional(),
  tiposConstrucciones: z.string().optional(),
  usoConstrucciones: z.string().optional(),

  // 4. Información de Uso del Suelo y Normativa
  zonificacion: z.string().optional(),
  restriccionesUso: z.string().optional(),

  // 5. Aspectos Jurídicos Asociados al Predio
  servidumbres: z.string().optional(),
  gravamenes: z.string().optional(),
});

