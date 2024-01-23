// const convertToGoogleMapsPaths = (coordinates, geometryType) => {
//   if (geometryType === "MultiPolygon") {
//     // Manejar MultiPolygon
//     return coordinates.map((polygon) => {
//       return polygon.map((ring) => {
//         return ring.map((coord) => {
//           return { lat: coord[1], lng: coord[0] };
//         });
//       });
//     });
//   } else {
//     // Manejar otros tipos de geometría (por ejemplo, Polygon)
//     return coordinates.map((ring) => {
//       return ring.map((coord) => {
//         return { lat: coord[1], lng: coord[0] };
//       });
//     });
//   }
// };

export const getPolygonByCadastralNumber = async (cadastralNumbers) => {
  // URL de la consulta
  const url =
    "https://services2.arcgis.com/RVvWzU3lgJISqdke/ArcGIS/rest/services/CATASTRO_PUBLICO_Noviembre_2023_gdb/FeatureServer/14/query";

  const whereClause = `CODIGO IN ('${cadastralNumbers.join("','")}')`;

  // Parámetros de la consulta
  const queryParams = {
    where: whereClause,
    objectIds: "",
    time: "",
    geometry: "",
    geometryType: "esriGeometryPoint",
    inSR: "",
    spatialRel: "esriSpatialRelIntersects",
    resultType: "none",
    distance: 0.0,
    units: "esriSRUnit_Meter",
    relationParam: "",
    returnGeodetic: false,
    outFields: "*",
    returnGeometry: true,
    returnCentroid: false,
    returnEnvelope: false,
    featureEncoding: "esriDefault",
    multipatchOption: "xyFootprint",
    maxAllowableOffset: "",
    geometryPrecision: "",
    outSR: "",
    defaultSR: "",
    datumTransformation: "",
    applyVCSProjection: false,
    returnIdsOnly: false,
    returnUniqueIdsOnly: false,
    returnCountOnly: false,
    returnExtentOnly: false,
    returnQueryGeometry: false,
    returnDistinctValues: false,
    cacheHint: false,
    orderByFields: "",
    groupByFieldsForStatistics: "",
    outStatistics: "",
    having: "",
    resultOffset: "",
    resultRecordCount: "",
    returnZ: false,
    returnM: false,
    returnExceededLimitFeatures: true,
    quantizationParameters: "",
    sqlFormat: "none",
    f: "pgeojson",
    token: "",
  };

  // Construir la URL completa con los parámetros
  const fullUrl = `${url}?${new URLSearchParams(queryParams)}`;

  try {
    const response = await fetch(fullUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
  }
};
