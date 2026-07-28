/**
 * Criterio de listo-para-verificar alineado con PropertyGeneral (Property2):
 * 1) Información predial (5 secciones)
 * 2) Propietarios validados
 * 3) Documentación obligatoria subida (incl. memorando)
 */

export const PREDIAL_FEATURE_ID_MAP = {
  usoActualPotencial: [
    "D_USO_ACTUAL_POTENCIAL",
    "ACTUAL_USE_POTENTIAL",
    "D_actual_use",
  ],
  limitacionesUsoSuelo: [
    "D_LIMITACIONES_USO_SUELO",
    "USE_RESTRICTIONS",
    "E_restriccion_desc",
    "E_resctriccion_other",
  ],
  aspectosEcosistema: [
    "D_ASPECTOS_ECOSISTEMA",
    "ECOSYSTEM",
    "D_aspects_ecosystem",
    "F_nacimiento_agua",
  ],
  aspectosPredio: [
    "D_ASPECTOS_PREDIO",
    "GENERAL_ASPECTS",
    "D_aspects_property",
    "G_habita_predio",
  ],
  relacionesEntidades: [
    "D_RELACIONES_ENTIDADES",
    "RELATIONS",
    "D_relations_entities",
    "H_aliados_estrategicos_desc",
    "H_grupo_comunitario_desc",
    "H_asistance_desc",
  ],
};

export const REQUIRED_DOCUMENT_TYPES = [
  {
    key: "certificado",
    label: "Certificado de Libertad y Tradición",
    type: "CERTIFICADO_TRADICION",
  },
  {
    key: "escrituras",
    label: "Escrituras Públicas",
    type: "ESCRITURA_PUBLICA",
  },
  {
    key: "planos",
    label: "Planos Catastrales",
    type: "PLANO_CATASTRAL",
  },
  {
    key: "memorando",
    label: "Memorando de Entendimiento",
    type: "MEMORANDO_ENTENDIMIENTO",
  },
];

const PREDIAL_SECTION_LABELS = {
  usoActualPotencial: "Uso actual y potencial",
  limitacionesUsoSuelo: "Limitaciones de uso de suelo",
  aspectosEcosistema: "Aspectos generales del ecosistema",
  aspectosPredio: "Aspectos generales del predio",
  relacionesEntidades: "Relaciones con entidades y aliados estratégicos",
};

export const isNonEmptyFeatureValue = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.length === 0) return false;
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === "object") {
        if (Array.isArray(parsed)) return parsed.length > 0;
        return Object.keys(parsed).length > 0;
      }
    } catch (_) {
      // string no JSON: válido si no está vacío
    }
    return true;
  }
  if (typeof value === "object") {
    if (Array.isArray(value)) return value.length > 0;
    return Object.keys(value).length > 0;
  }
  return true;
};

const getPropertyDocuments = (propertyData) => {
  const features = propertyData?.propertyFeatures || [];
  return features.flatMap((feature) =>
    feature?.documents?.items ? feature.documents.items : []
  );
};

const parseDocumentData = (document) => {
  try {
    return JSON.parse(document?.data || "{}");
  } catch {
    return {};
  }
};

export const isFeatureGroupCompleted = (propertyData, featureIds) => {
  const features = propertyData?.propertyFeatures || [];
  return features.some(
    (feature) =>
      featureIds.includes(feature?.featureID) &&
      isNonEmptyFeatureValue(feature?.value)
  );
};

export const getOwnersFromPropertyData = (propertyData) => {
  const documents = getPropertyDocuments(propertyData);
  const owners = [];

  documents.forEach((document) => {
    const data = parseDocumentData(document);
    if (data.type !== "OWNER_BUNDLE") return;

    owners.push({
      id: data.ownerId || document.id,
      name: data.name || "Sin nombre",
      status: document.status || "pending_review",
      isApproved: document.isApproved || false,
    });
  });

  return owners;
};

export const getRequiredDocumentsStatus = (propertyData) => {
  const documents = getPropertyDocuments(propertyData);
  const statusByKey = {};

  REQUIRED_DOCUMENT_TYPES.forEach((requirement) => {
    statusByKey[requirement.key] = {
      ...requirement,
      uploaded: false,
    };
  });

  documents.forEach((document) => {
    const data = parseDocumentData(document);
    const requirement = REQUIRED_DOCUMENT_TYPES.find(
      (entry) => entry.type === data.type
    );
    if (!requirement) return;

    statusByKey[requirement.key] = {
      ...requirement,
      uploaded: true,
      documentId: document.id,
      status: document.status || "pending_review",
      isApproved: document.isApproved || false,
    };
  });

  return Object.values(statusByKey);
};

export const getPredialRequirementsStatus = (propertyData) =>
  Object.entries(PREDIAL_FEATURE_ID_MAP).map(([key, featureIds]) => ({
    key,
    label: PREDIAL_SECTION_LABELS[key] || key,
    completed: isFeatureGroupCompleted(propertyData, featureIds),
  }));

/**
 * @param {object|null|undefined} propertyData
 * @returns {{
 *   isReady: boolean,
 *   pending: string[],
 *   steps: Array<{
 *     id: string,
 *     title: string,
 *     isComplete: boolean,
 *     done: number,
 *     total: number,
 *     progress: number,
 *     pendingLabels: string[],
 *   }>,
 *   message: string|null,
 * }}
 */
export const getPropertyVerificationGate = (propertyData) => {
  if (!propertyData) {
    return {
      isReady: false,
      pending: ["Cargando información del predio"],
      steps: [],
      message: "Cargando información del predio…",
    };
  }

  const predialItems = getPredialRequirementsStatus(propertyData);
  const predialDone = predialItems.filter((item) => item.completed).length;
  const predialTotal = predialItems.length;
  const predialPending = predialItems
    .filter((item) => !item.completed)
    .map((item) => item.label);

  const owners = getOwnersFromPropertyData(propertyData);
  const validatedOwners = owners.filter(
    (owner) => owner.isApproved || owner.status === "approved"
  );
  const ownersComplete =
    owners.length > 0 && validatedOwners.length === owners.length;
  const ownersPendingLabels = [];
  if (owners.length === 0) {
    ownersPendingLabels.push("Registrar al menos un propietario");
  } else if (!ownersComplete) {
    ownersPendingLabels.push(
      `Validar propietarios (${validatedOwners.length}/${owners.length})`
    );
  }

  const documents = getRequiredDocumentsStatus(propertyData);
  const uploadedDocs = documents.filter((doc) => doc.uploaded);
  const docsComplete = uploadedDocs.length === documents.length;
  const docsPending = documents
    .filter((doc) => !doc.uploaded)
    .map((doc) => doc.label);

  const steps = [
    {
      id: "requirements",
      title: "Información Predial",
      isComplete: predialDone === predialTotal,
      done: predialDone,
      total: predialTotal,
      progress: Math.round((predialDone / Math.max(predialTotal, 1)) * 100),
      pendingLabels: predialPending,
    },
    {
      id: "owners",
      title: "Propietarios",
      isComplete: ownersComplete,
      done: validatedOwners.length,
      total: owners.length || 1,
      progress:
        owners.length === 0
          ? 0
          : Math.round((validatedOwners.length / owners.length) * 100),
      pendingLabels: ownersPendingLabels,
    },
    {
      id: "documentation",
      title: "Documentación",
      isComplete: docsComplete,
      done: uploadedDocs.length,
      total: documents.length,
      progress: Math.round(
        (uploadedDocs.length / Math.max(documents.length, 1)) * 100
      ),
      pendingLabels: docsPending,
    },
  ];

  const pending = steps
    .filter((step) => !step.isComplete)
    .flatMap((step) => {
      if (step.pendingLabels.length > 0) {
        return step.pendingLabels.map(
          (label) => `${step.title}: ${label}`
        );
      }
      return [`${step.title} incompleto`];
    });

  const isReady = steps.every((step) => step.isComplete);

  const message = isReady
    ? null
    : `Pendiente: ${pending.slice(0, 4).join("; ")}${
        pending.length > 4 ? "…" : ""
      }`;

  return {
    isReady,
    pending,
    steps,
    message,
  };
};
