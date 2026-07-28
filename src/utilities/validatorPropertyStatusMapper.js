export const validatorPropertyStatusMapper = {
  PENDING: {
    key: "PENDING",
    label: "Pendiente",
    badge:
      "bg-terrasacha-earth text-terrasacha-secondary1 border border-terrasacha-secondary1 shadow-sm",
    filterDot: "bg-terrasacha-earth border border-terrasacha-secondary1/40",
    filterInactive:
      "bg-terrasacha-earth/40 text-terrasacha-secondary1 border border-terrasacha-earth",
    tooltip: "Pendiente: El predio está pendiente de revisión.",
    iconKey: "clock",
    canAssignToCampaign: false,
    assignBlockedReason:
      "El predio está pendiente. Solo los predios en estado Seleccionable pueden asignarse a una campaña.",
  },
  DOC_UPLOADED: {
    key: "DOC_UPLOADED",
    label: "Documentos cargados",
    badge:
      "bg-terrasacha-secondary2 text-white border border-terrasacha-secondary2 shadow-sm",
    filterDot: "bg-terrasacha-secondary2",
    filterInactive:
      "bg-terrasacha-secondary2/20 text-terrasacha-secondary1 border border-terrasacha-secondary2/50",
    tooltip: "El usuario ha cargado la documentación requerida para el predio.",
    iconKey: "file",
    canAssignToCampaign: false,
    assignBlockedReason:
      "El predio tiene documentos cargados, pero aún debe quedar en estado Seleccionable.",
  },
  SELECTABLE: {
    key: "SELECTABLE",
    label: "Seleccionable",
    badge:
      "bg-terrasacha-primary text-white border border-terrasacha-primary shadow-sm",
    filterDot: "bg-terrasacha-primary",
    filterInactive:
      "bg-terrasacha-primary/15 text-terrasacha-primary border border-terrasacha-primary/40",
    tooltip: "Seleccionable: El predio es elegible para asignarse a una campaña.",
    iconKey: "checkCircle",
    canAssignToCampaign: true,
    assignBlockedReason: "",
  },
  NOT_SELECTABLE: {
    key: "NOT_SELECTABLE",
    label: "No elegible",
    badge: "bg-red-600 text-white border border-red-700 shadow-sm",
    filterDot: "bg-red-600",
    filterInactive: "bg-red-100 text-red-700 border border-red-400",
    tooltip: "No elegible: El predio no puede continuar el proceso.",
    iconKey: "ban",
    canAssignToCampaign: false,
    assignBlockedReason:
      "Este predio no es elegible y no puede asignarse a una campaña.",
  },
  APPROVED: {
    key: "APPROVED",
    label: "Aprobado",
    badge:
      "bg-terrasacha-secondary1 text-white border border-terrasacha-secondary1 shadow-sm",
    filterDot: "bg-terrasacha-secondary1",
    filterInactive:
      "bg-terrasacha-secondary1/15 text-terrasacha-secondary1 border border-terrasacha-secondary1/40",
    tooltip: "Aprobado: El predio ha sido aprobado.",
    iconKey: "check",
    canAssignToCampaign: false,
    assignBlockedReason:
      "Los predios aprobados ya completaron el proceso y no requieren asignación.",
  },
  REJECTED: {
    key: "REJECTED",
    label: "Rechazado",
    badge: "bg-red-700 text-white border border-red-800 shadow-sm",
    filterDot: "bg-red-700",
    filterInactive: "bg-red-100 text-red-700 border border-red-400",
    tooltip: "Rechazado: El predio no cumple los requisitos.",
    iconKey: "times",
    canAssignToCampaign: false,
    assignBlockedReason:
      "Los predios rechazados no pueden asignarse a una campaña.",
  },
};

const fallbackStatus = {
  key: "UNKNOWN",
  label: "Sin definir",
  badge:
    "bg-gray-500 text-white border border-gray-600 shadow-sm",
  filterDot: "bg-gray-500",
  filterInactive: "bg-gray-200 text-gray-700 border border-gray-400",
  tooltip: "Estado indefinido",
  iconKey: "clock",
  canAssignToCampaign: false,
  assignBlockedReason:
    "No es posible asignar este predio hasta definir su estado.",
};

export const getValidatorPropertyStatus = (status) => {
  const normalized = status ? String(status).toUpperCase().trim() : "";
  return validatorPropertyStatusMapper[normalized] || fallbackStatus;
};

export const canPropertyBeAssignedToCampaign = (status) =>
  getValidatorPropertyStatus(status).canAssignToCampaign;

export const getPropertyAssignBlockedReason = (status) =>
  getValidatorPropertyStatus(status).assignBlockedReason;
