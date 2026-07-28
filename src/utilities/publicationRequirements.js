export const arePublicationPrerequisitesMet = (sectionsStatus) => {
  if (!sectionsStatus) {
    return false;
  }

  return (
    sectionsStatus.projectInfo &&
    sectionsStatus.geodataInfo &&
    sectionsStatus.predialInfo &&
    sectionsStatus.ownerAcceptsConditions &&
    sectionsStatus.financialInfo &&
    sectionsStatus.technicalInfo &&
    sectionsStatus.tokenGenesis
  );
};

export const getMarketplaceRequirementDisplay = (sectionsStatus) => {
  const requirementMet = Boolean(sectionsStatus?.projectOnMarketplace);
  const marketplacePublished = Boolean(sectionsStatus?.marketplacePublished);

  if (requirementMet) {
    return { variant: "complete", helperText: null };
  }

  if (marketplacePublished) {
    return {
      variant: "partial",
      helperText:
        "El proyecto está visible en marketplace, pero este requisito se completará solo cuando se cumplan todos los requisitos previos, incluida la distribución de tokens.",
    };
  }

  return { variant: "pending", helperText: null };
};
