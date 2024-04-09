export const generateJSONFile = (geoJsonObject, fileName) => {
  try {
    const jsonString = JSON.stringify(geoJsonObject, null, 2);

    // Crear un nuevo Blob con el contenido JSON
    const blob = new Blob([jsonString], { type: "application/json" });

    // Crear un enlace (ancla) para la descarga
    const enlaceDescarga = document.createElement("a");
    enlaceDescarga.href = URL.createObjectURL(blob);

    // Asignar el nombre del archivo
    enlaceDescarga.download = fileName + '.json' || "archivo.json";

    // Agregar el enlace al documento y hacer clic en él para iniciar la descarga
    document.body.appendChild(enlaceDescarga);
    enlaceDescarga.click();

    // Eliminar el enlace del documento
    document.body.removeChild(enlaceDescarga);

    return true;
  } catch (error) {
    console.error("Error al exportar como GeoJSON:", error);
    return false;
  }
};
