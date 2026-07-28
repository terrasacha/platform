export const newCampaignFormSteps = [
  {
    id: "name",
    label: "Nombre de la campaña",
    shortLabel: "Nombre",
    percent: 25,
    required: true,
    isComplete: (formData) => formData.name?.trim().length >= 3,
    completeMessage: "Has completado el nombre de la campaña — 25% del formulario.",
    pendingHint: "Ingresa un nombre con al menos 3 caracteres.",
  },
  {
    id: "description",
    label: "Descripción",
    shortLabel: "Descripción",
    percent: 50,
    required: true,
    isComplete: (formData) => formData.description?.trim().length >= 10,
    completeMessage: "Has completado la descripción — 50% del formulario.",
    pendingHint: "Describe tu campaña con al menos 10 caracteres.",
  },
  {
    id: "dates",
    label: "Fechas de la campaña",
    shortLabel: "Fechas",
    percent: 75,
    required: true,
    isComplete: (formData) =>
      Boolean(formData.initialDate) &&
      Boolean(formData.endDate) &&
      formData.endDate >= formData.initialDate,
    completeMessage: "Has completado las fechas — 75% del formulario.",
    pendingHint: "Indica la fecha de inicio y de finalización.",
  },
  {
    id: "images",
    label: "Imágenes de la campaña",
    shortLabel: "Imágenes",
    percent: 100,
    required: false,
    isComplete: (_formData, images = []) => images.length > 0,
    completeMessage: "Has agregado imágenes — 100% del formulario.",
    pendingHint: "Opcional: agrega imágenes que representen tu campaña.",
  },
];

export const getNewCampaignFormProgress = (formData, images = []) => {
  let progress = 0;
  let lastCompletedStep = null;
  let nextStep = newCampaignFormSteps[0];
  const completedSteps = [];

  for (const step of newCampaignFormSteps) {
    if (step.isComplete(formData, images)) {
      progress = step.percent;
      lastCompletedStep = step;
      completedSteps.push(step);
    } else {
      nextStep = step;
      break;
    }
  }

  if (completedSteps.length === newCampaignFormSteps.length) {
    nextStep = null;
  }

  const feedbackMessage = lastCompletedStep?.completeMessage ?? null;
  const nextStepHint = nextStep
    ? nextStep.pendingHint
    : "Todos los pasos están completos. Puedes crear la campaña.";

  return {
    progress,
    lastCompletedStep,
    nextStep,
    completedSteps,
    feedbackMessage,
    nextStepHint,
    isReadyToSubmit:
      newCampaignFormSteps
        .filter((step) => step.required)
        .every((step) => step.isComplete(formData, images)),
  };
};
