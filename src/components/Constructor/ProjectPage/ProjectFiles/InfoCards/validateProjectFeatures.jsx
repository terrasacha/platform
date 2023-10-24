export function validateProjectFeatures(projectFeatures) {
  const NewprojectFeatures = projectFeatures.reduce((resultado, item) => {
    if (typeof item.value === 'string') {
      try {
        // Intenta analizar el valor como JSON
        const parsedValue = JSON.parse(item.value);
        if (Array.isArray(parsedValue)) {
          resultado[item.featureID] = parsedValue;
        } else {
          resultado[item.featureID] = item.value;
        }
      } catch (error) {
        // Si no es JSON válido, asigna el valor como una cadena
        resultado[item.featureID] = item.value;
      }
    } else {
      resultado[item.featureID] = item.value;
    }
    return resultado;
  }, {});

  // Comprobar si hay propiedades con valores vacíos - SI SI HAY VACIOS RETORNA TRUE
  const hasEmptyValues = Object.values(NewprojectFeatures).some(value => {
    if (typeof value === 'string') {
      return value === '';
    }
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    return false; // Si encuentra que todos esta llenos arroja un falso
  });

  return hasEmptyValues
}