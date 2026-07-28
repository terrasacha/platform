export const campaignStatusMapper = {
  ACTIVE: {
    key: "ACTIVE",
    label: "En curso",
    badge:
      "bg-terrasacha-secondary2 text-white border border-terrasacha-secondary2 shadow-sm",
    filterDot: "bg-terrasacha-secondary2",
    tooltip: "La campaña sigue activa.",
  },
  FINISHED: {
    key: "FINISHED",
    label: "Finalizada",
    badge:
      "bg-terrasacha-secondary1 text-white border border-terrasacha-secondary1 shadow-sm",
    filterDot: "bg-terrasacha-secondary1",
    tooltip: "La campaña ya ha finalizado.",
  },
};

export const getCampaignStatus = (campaign) => {
  if (!campaign?.endDate) {
    return campaignStatusMapper.ACTIVE;
  }

  const endDate = new Date(campaign.endDate * 1000);
  const isFinished = endDate < new Date();

  return isFinished
    ? campaignStatusMapper.FINISHED
    : campaignStatusMapper.ACTIVE;
};

export const convocatoriaStatusMapper = {
  OPEN: {
    key: "OPEN",
    label: "Convocatoria abierta",
    badge:
      "bg-terrasacha-secondary2 text-white border border-terrasacha-secondary2 shadow-sm",
    tooltip: "La campaña acepta postulaciones de predios.",
  },
  CLOSED: {
    key: "CLOSED",
    label: "Convocatoria cerrada",
    badge:
      "bg-terrasacha-secondary1 text-white border border-terrasacha-secondary1 shadow-sm",
    tooltip:
      "Esta campaña ya no admite postulaciones ni modificaciones.",
  },
};

export const getConvocatoriaStatus = (campaign) =>
  campaign?.available
    ? convocatoriaStatusMapper.OPEN
    : convocatoriaStatusMapper.CLOSED;

/** Textos unificados para la acción de cierre de convocatoria (available → false). */
export const convocatoriaActions = {
  closeButtonLabel: "Cerrar convocatoria",
  closeButtonLabelShort: "Cerrar",
  closeModalTitle: "Cerrar convocatoria",
  closeAriaLabel:
    "Cerrar convocatoria. No se aceptarán nuevas postulaciones de predios.",
  closeConfirmMessage:
    "Al confirmar, la convocatoria quedará cerrada. No se aceptarán nuevas postulaciones de predios; la campaña y el proyecto asociado permanecerán disponibles para consulta y seguimiento.",
  closeConfirmQuestion: "¿Deseas cerrar la convocatoria?",
  closeWithPendingIntro:
    "Antes de cerrar la convocatoria, revisa los siguientes predios que aún están pendientes de aprobación:",
  closeWithPendingQuestion:
    "¿Deseas cerrar la convocatoria de todas formas?",
};
