export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const MAX_OWNER_FILE_SIZE_MB = 5;
export const MAX_OWNER_FILE_SIZE_BYTES = MAX_OWNER_FILE_SIZE_MB * 1024 * 1024;

export const OWNER_NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
export const OWNER_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PHONE_DIGITS = 7;
export const MAX_PHONE_DIGITS = 15;

export const getOwnerFileError = (file) => {
  if (!file) {
    return "Este documento es obligatorio";
  }

  if (!(file instanceof File)) {
    return null;
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Formato no válido. Usa JPG, PNG o WEBP";
  }

  if (file.size > MAX_OWNER_FILE_SIZE_BYTES) {
    return `El archivo supera el tamaño máximo de ${MAX_OWNER_FILE_SIZE_MB} MB`;
  }

  return null;
};

const hasExistingDocument = (ownerData, field) => {
  const file = ownerData[field];
  const s3Key = ownerData[`${field}S3Key`];
  const url = ownerData[`${field}Url`];

  if (file instanceof File) {
    return getOwnerFileError(file) === null;
  }

  if (typeof file === "string" && file.trim()) {
    return true;
  }

  if (s3Key || url) {
    return true;
  }

  return false;
};

export const validateOwnerForm = (ownerData, options = {}) => {
  const { requireFiles = true } = options;
  const fieldErrors = {};

  const name = ownerData?.name?.trim() || "";
  if (!name) {
    fieldErrors.name = "El nombre es obligatorio";
  } else if (name.length < 2) {
    fieldErrors.name = "El nombre debe tener al menos 2 caracteres";
  } else if (!OWNER_NAME_REGEX.test(name)) {
    fieldErrors.name = "Solo se permiten letras y espacios";
  }

  const email = ownerData?.email?.trim() || "";
  if (!email) {
    fieldErrors.email = "El correo electrónico es obligatorio";
  } else if (!OWNER_EMAIL_REGEX.test(email)) {
    fieldErrors.email = "Ingresa un correo electrónico válido";
  }

  const phoneDigits = (ownerData?.phone || "").replace(/\D/g, "");
  if (!ownerData?.phone?.trim()) {
    fieldErrors.phone = "El teléfono es obligatorio";
  } else if (
    phoneDigits.length < MIN_PHONE_DIGITS ||
    phoneDigits.length > MAX_PHONE_DIGITS
  ) {
    fieldErrors.phone = `Ingresa un teléfono válido (${MIN_PHONE_DIGITS}-${MAX_PHONE_DIGITS} dígitos)`;
  }

  if (requireFiles) {
    const documentFields = [
      { key: "idFront", label: "La cédula (frente)" },
      { key: "idBack", label: "La cédula (reverso)" },
      { key: "selfie", label: "La selfie" },
    ];

    documentFields.forEach(({ key, label }) => {
      const file = ownerData[key];

      if (file instanceof File) {
        const fileError = getOwnerFileError(file);
        if (fileError) {
          fieldErrors[key] = fileError;
        }
        return;
      }

      if (!hasExistingDocument(ownerData, key)) {
        fieldErrors[key] = `${label} es obligatoria`;
      }
    });
  }

  return {
    isValid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
  };
};

export const getModalContextDescription = (modalType, isThirdParty) => {
  if (modalType === "postulante") {
    if (isThirdParty) {
      return "Estás registrando tus datos como postulante de este predio. Completa tu información personal y documentos de identidad.";
    }
    return "Estás registrando tu información como postulante y propietario del predio.";
  }

  return "Estás registrando la información de un propietario adicional del predio (persona distinta al postulante).";
};
