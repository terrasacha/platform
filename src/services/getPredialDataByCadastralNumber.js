import { getCityName } from "./getCityName";
import { getDepartmentName } from "./getDepartmentName";
import { getEconomicDestiny } from "./getEconomicDestiny";

export const getPredialDataByCadastralNumber = async (cadastralNumbers) => {
  // URL de la consulta
  const url =
    "https://services2.arcgis.com/RVvWzU3lgJISqdke/ArcGIS/rest/services/CATASTRO_PUBLICO_Mayo_15_2024_gdb/FeatureServer/17/query";

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
      const destinoEconomico = getEconomicDestiny(
        feature.attributes.DESTINO_ECONOMICO
      );
      const nombreDepartamento = getDepartmentName(
        feature.attributes.DEPARTAMENTO
      );

      const nombreMunicipio = getCityName(feature.attributes.MUNICIPIO);

      result[numeroDelPredio] = {
        ...feature.attributes,
        area: areaTerreno,
        predio: direccionPredio,
        NOMBRE_DEPARTAMENTO: nombreDepartamento,
        NOMBRE_MUNICIPIO: nombreMunicipio,
        ...destinoEconomico
      };
      return result;
    }, {});
    return mappedData;
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
  }
};
