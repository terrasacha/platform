export const parseSerializedKoboData = async (data) => {
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

export const convertAWSDatetimeToDate = async (AWSDatetime) => {
  const fechaObjeto = new Date(AWSDatetime);
  const anio = fechaObjeto.getFullYear();
  const mes = String(fechaObjeto.getMonth() + 1).padStart(2, "0");
  const dia = String(fechaObjeto.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
};

export const getYearFromAWSDatetime = (AWSDatetime) => {
  const fechaObjeto = new Date(AWSDatetime);
  const anio = fechaObjeto.getFullYear();

    return anio
}

export const formatNumberWithThousandsSeparator = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const getElapsedTime = async (initDate, endDate = new Date()) => {
  const diferenciaEnMilisegundos = endDate - new Date(initDate);
  let minutosTranscurridos = Math.floor(diferenciaEnMilisegundos / (1000 * 60));
  let elapsedTime = "";
  if (minutosTranscurridos < 60) {
    elapsedTime = `Hace ${minutosTranscurridos} minutos`;
  }
  if (minutosTranscurridos >= 60 && minutosTranscurridos < 1440) {
    minutosTranscurridos = Math.floor(minutosTranscurridos / 60);
    elapsedTime = `Hace ${minutosTranscurridos} horas`;
  }
  if (minutosTranscurridos >= 1440) {
    minutosTranscurridos = Math.floor(minutosTranscurridos / 1440);
    elapsedTime = `Hace ${minutosTranscurridos} dias`;
  }

  return elapsedTime;
};

export const capitalizeWords = async (str) => {
  const lowercaseStr = str.toLowerCase();

  const words = lowercaseStr.split(' ');

  const capitalizedWords = words.map((word) => {
    if (word.length > 0) {
      return word[0].toUpperCase() + word.slice(1);
    } else {
      return word;
    }
  });

  return capitalizedWords.join(" ");
};

export const getImagesCategories = (category) => {
  try {
    let url = `https://kiosuanbcrjsappcad3eb2dd1b14457b491c910d5aa45dd145518-dev.s3.amazonaws.com/public/category-projects-images/${category}.jpg`;
    url = url.replace("REDD+", "REDD%2B")
    return url
  } catch (error) {
    console.error(error);
    return;
  }
}