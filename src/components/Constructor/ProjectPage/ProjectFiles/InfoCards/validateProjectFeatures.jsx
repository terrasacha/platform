export function validateProjectFeatures(projectFeatures) {
  const hasFinancialConditions = !!projectFeatures.find(item => item.featureID === 'GLOBAL_VALIDATOR_SET_FINANCIAL_CONDITIONS' && item.value === 'true');
  const hasTechnicalConditions = !!projectFeatures.find(item => item.featureID === 'GLOBAL_VALIDATOR_SET_TECHNICAL_CONDITIONS' && item.value === 'true');
  const hasOwnerConditions = !!projectFeatures.find(item => item.featureID === 'GLOBAL_OWNER_ACCEPTS_CONDITIONS' && item.value === 'true');

  const resultValidation = hasFinancialConditions && hasTechnicalConditions && !hasOwnerConditions;

  return resultValidation;
}