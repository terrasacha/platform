export const getPredialDataByCadastralNumber = async (cadastralNumbers) => {
  // URL de la consulta
  const url =
    "https://services2.arcgis.com/RVvWzU3lgJISqdke/arcgis/rest/services/CATASTRO_PUBLICO_Noviembre_2023_gdb/FeatureServer/17/query";

  const whereClause = `NUMERO_DEL_PREDIO IN ('${cadastralNumbers.join(
    "','"
  )}')`;

  // Parámetros de la consulta
  const queryParams = {
    where: whereClause,
    outFields: "*",
    f: "pjson",
    token: "", // Asegúrate de reemplazar "tu_token_aqui" con el token real
  };

  // Construir la URL completa con los parámetros
  const fullUrl = `${url}?${new URLSearchParams(queryParams)}`;

  try {
    const response = await fetch(fullUrl);
    const data = await response.json();
    const mappedData = data.features.reduce((result, feature) => {
      const numeroDelPredio = feature.attributes.NUMERO_DEL_PREDIO;
      const areaTerreno = feature.attributes.AREA_TERRENO;
      const direccionPredio = feature.attributes.DIRECCION;

      result[numeroDelPredio] = {
        area: areaTerreno,
        predio: direccionPredio,
      };
      return result;
    }, {});
    return mappedData;
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
  }
};
