export const PROJECT_STATUS_LABELS = {
  draft: "En borrador",
  verified: "Verificado",
  on_verification: "En verificación",
  in_blockchain: "En blockchain",
  in_equilibrium: "En equilibrio",
  Prefactibilidad: "En Prefactibilidad",
  Factibilidad: "En Factibilidad",
  "Documento de diseño del proyecto": "En diseño de documento del proyecto",
  "Validación externa": "En validación externa",
  "Registro del proyecto": "Registrado",
};

const defaultGuidance = {
  statusMeaning:
    "Consulta el estado actual del proyecto y su progreso en el flujo de publicación.",
  roleScope:
    "Como consultor, puedes revisar la información del proyecto. Si estás asignado, también tendrás acceso a Sistema de datos y Configuración.",
  restrictions:
    "No puedes editar información del postulante ni gestionar la publicación en marketplace desde esta vista.",
};

const guidanceByStatus = {
  Prefactibilidad: {
    statusMeaning:
      "El proyecto está en fase inicial de evaluación. Se revisa la viabilidad técnica, financiera y documental antes de avanzar a factibilidad.",
    roleScope:
      "Tu rol es de revisión y seguimiento. Puedes consultar la información general, los detalles y —si estás asignado— el sistema de datos y la configuración técnica.",
    restrictions:
      "No puedes modificar datos del postulante ni publicar en marketplace. Los indicadores en verde son informativos y no implican acciones pendientes para ti.",
  },
  Factibilidad: {
    statusMeaning:
      "El proyecto avanzó a factibilidad y continúa su validación técnica y financiera.",
    roleScope:
      "Puedes revisar el avance, verificar documentación y apoyar el seguimiento del proyecto asignado.",
    restrictions:
      "Las acciones de edición del postulante y publicación en marketplace no están disponibles para tu rol en esta vista.",
  },
  "Documento de diseño del proyecto": {
    statusMeaning:
      "El proyecto está en elaboración del documento de diseño antes de validaciones externas.",
    roleScope:
      "Puedes consultar el estado y la documentación asociada como parte del equipo consultor.",
    restrictions:
      "Esta vista es principalmente informativa para tu rol; no incluye gestión de postulación ni marketplace.",
  },
};

export const getConsultantProjectGuidance = (status) => {
  const guidance = guidanceByStatus[status] || defaultGuidance;
  const statusLabel = PROJECT_STATUS_LABELS[status] || status || "Sin definir";

  return {
    statusLabel,
    ...guidance,
  };
};

export const getCampaignConvocatoriaLabel = (isAvailable) =>
  isAvailable ? "Convocatoria abierta" : "Convocatoria cerrada";

export const getCampaignProjectStatusExplanation = ({
  campaignAvailable,
  currentStep = 1,
}) => {
  if (campaignAvailable) {
    return {
      title: "Campaña y proyecto en curso",
      message:
        "La convocatoria sigue abierta para nuevas postulaciones. El estado del proyecto en los hitos inferiores se actualiza de forma independiente.",
    };
  }

  if (currentStep >= 5) {
    return {
      title: "Convocatoria cerrada — proyecto publicado",
      message:
        "El cierre de la convocatoria solo indica que ya no se aceptan nuevas postulaciones. El proyecto permanece activo y publicado en marketplace.",
    };
  }

  if (currentStep >= 2) {
    return {
      title: "Convocatoria cerrada — proyecto en avance",
      message:
        "El cierre de la convocatoria no detiene el ciclo de vida del proyecto. Los hitos completados reflejan el avance del proyecto, no el estado de la campaña.",
    };
  }

  return {
    title: "Convocatoria cerrada",
    message:
      "El cierre se refiere únicamente a la recepción de postulaciones. El proyecto puede continuar su proceso en los hitos siguientes.",
  };
};
