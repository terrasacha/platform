const parseSerializedKoboData = (data) => {
  const contenido = data.replace(/[{}[\]]/g, "");
  const pares = contenido.split(", ");

  const parsedData = {};

  pares.forEach((par) => {
    const [clave, valor] = par.split("=");
    if (clave === "D_actual_use" || clave === "D_replace_use") {
      parsedData[clave] = valor.split("|");
    } else {
      parsedData[clave] = valor;
    }
  });

  return parsedData;
};

const formatearNumero = (entrada) => {
  // Reemplaza ',' con '.' y elimina los puntos
  const valorLimpio = entrada.replace(/[,]/g, '').replace(/\./g, '');

  // Convierte la entrada a un número
  const numero = parseFloat(valorLimpio);

  // Si el número es un entero, devuelve un entero, de lo contrario, devuelve el número flotante
  return Number.isInteger(numero) ? parseInt(numero) : numero;
}


module.exports = { parseSerializedKoboData, formatearNumero };