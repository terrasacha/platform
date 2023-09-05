export const parseSerializedKoboData = async (data) => {
  const contenido = data.replace(/[{}[\]]/g, '');
  const pares = contenido.split(", ");

  const parsedData = {};

  pares.forEach((par) => {
    const [clave, valor] = par.split("=");
    if(clave === "D_actual_use" || clave === "D_replace_use") {
      parsedData[clave] = valor.split("|");
    } else {
      parsedData[clave] = valor;
    }
  });

  return parsedData;
}


export const getLocationData = async (location) => {
  let locationData = {
    lat: "",
    lng: "",
    alt: "",
    pres: "",
  };
  if (location) {
    const data = location.split(" ");

    locationData.lat = parseFloat(data[0]);
    locationData.lng = parseFloat(data[1]);
    locationData.alt = parseFloat(data[2]);
    locationData.pres = parseFloat(data[3]);
  }
  return locationData;
}

export const convertAWSDatetimeToDate = async(AWSDatetime) => {
  const fechaObjeto = new Date(AWSDatetime);
  const anio = fechaObjeto.getFullYear();
  const mes = String(fechaObjeto.getMonth() + 1).padStart(2, '0');
  const dia = String(fechaObjeto.getDate()).padStart(2, '0');

  return `${anio}-${mes}-${dia}`;
}

export const formatNumberWithThousandsSeparator = async (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}