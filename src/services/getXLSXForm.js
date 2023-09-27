import axios from "axios";
import * as XLSX from "xlsx";

function groupElements(formattedJsonData) {

  const result = [];
  let currentGroup = null;

  for (const item of formattedJsonData) {
    if (item.type === "begin_group") {
      if (currentGroup) {
        result.push(currentGroup);
      }
      currentGroup = { ...item, type: "group", items: [] };
    } else if (item.type === "end_group") {
      if (currentGroup) {
        result.push(currentGroup);
        currentGroup = null;
      }
    } else if (currentGroup) {
      currentGroup.items.push(item);
    } else {
      // Si no estamos dentro de un grupo, agregar el elemento directamente
      result.push(item);
    }
  }
  

  return result;
}


export const getXLSXForm = async (url) => {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const data = new Uint8Array(response.data);

    const workbook = XLSX.read(data, { type: "array" });

    // Supongamos que tienes una sola hoja en el archivo XLSX
    const inputs = workbook.SheetNames[0];
    const options = workbook.SheetNames[1];
    const inputsSheet = workbook.Sheets[inputs];
    const optionsSheet = workbook.Sheets[options];

    const inputsJsonData = XLSX.utils.sheet_to_json(inputsSheet, { header: 1 });
    const optionsJsonData = XLSX.utils.sheet_to_json(optionsSheet, { header: 1 });

    // Convierte la hoja de inputs en un objeto JSON y mapea
    const formattedInputsJsonData = inputsJsonData.map((row, index) => ({
      type: row[0],
      name: row[1],
      label: row[2],
      hint: row[3],
      required: row[4],
      appearance: row[5],
      relevant: row[6],
      constraint: row[7],
      required_message: row[8],
    }));
    formattedInputsJsonData.shift();

    // Convierte la hoja de options en un objeto JSON y mapea
    const formattedOptionsJsonData = optionsJsonData.map((row, index) => ({
      list_name: row[0],
      name: row[1],
      label: row[2],
    }));
    // Eliminar primer elemento de formattedJsonData
    formattedOptionsJsonData.shift();
    const groupedFormattedOptionsJsonData = {};

    // Iteramos sobre los elementos y los agrupamos por "list_name"
    formattedOptionsJsonData.forEach(({ list_name, name, label }) => {
        
        if (!groupedFormattedOptionsJsonData[list_name]) {
            groupedFormattedOptionsJsonData[list_name] = [];
        }
        
        groupedFormattedOptionsJsonData[list_name].push({ name, label });
    });
    console.log(groupedFormattedOptionsJsonData)

    return {
      survey: groupElements(formattedInputsJsonData),
      options: groupedFormattedOptionsJsonData,
    }
  } catch (error) {
    throw new Error("Error al descargar el archivo XLSX: " + error.message);
  }
};
