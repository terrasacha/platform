export const getEconomicDestiny = (cod) => {
  const economicDestinyList = [
    {
      CODIGO_DESTINOECONOMICO: "A",
      NOMBRE_DESTINOECONOMICO: "Habitacional",
      DESCRIPCION_DESTINOECONOMICO:
        "Predios destinados a vivienda. Se incluyen dentro de esta clase los parqueaderos, garajes y depósitos contenidos en el reglamento de propiedad horizontal, ligado a este destino.",
    },
    {
      CODIGO_DESTINOECONOMICO: "B",
      NOMBRE_DESTINOECONOMICO: "Industrial",
      DESCRIPCION_DESTINOECONOMICO:
        "Predios en los cuales se desarrollan actividades de elaboración y transformación de materias primas.",
    },
    {
      CODIGO_DESTINOECONOMICO: "C",
      NOMBRE_DESTINOECONOMICO: "Comercial",
      DESCRIPCION_DESTINOECONOMICO:
        "Predios destinados al intercambio de bienes y/o servicios con el fin de satisfacer las necesidades de una colectividad.",
    },
    {
      CODIGO_DESTINOECONOMICO: "D",
      NOMBRE_DESTINOECONOMICO: "Agropecuario",
      DESCRIPCION_DESTINOECONOMICO:
        "Predios con destinación agrícola y pecuaria.",
    },
    {
      CODIGO_DESTINOECONOMICO: "E",
      NOMBRE_DESTINOECONOMICO: "Minero",
      DESCRIPCION_DESTINOECONOMICO:
        "Predios destinados a la extracción y explotación de minerales.",
    },
    {
      CODIGO_DESTINOECONOMICO: "F",
      NOMBRE_DESTINOECONOMICO: "Cultural",
      DESCRIPCION_DESTINOECONOMICO:
        "Predios destinados al desarrollo de actividades artísticas e intelectuales.",
    },
    {
      CODIGO_DESTINOECONOMICO: "G",
      NOMBRE_DESTINOECONOMICO: "Recreacional",
      DESCRIPCION_DESTINOECONOMICO:
        "Predios dedicados al desarrollo o a la práctica de actividades de esparcimiento y entretenimiento.",
    },
    {
      CODIGO_DESTINOECONOMICO: "H",
      NOMBRE_DESTINOECONOMICO: "Salubridad",
      DESCRIPCION_DESTINOECONOMICO:
        "Predios destinados a clínicas, hospitales y puestos de salud.",
    },
    {
      CODIGO_DESTINOECONOMICO: "I",
      NOMBRE_DESTINOECONOMICO: "Institucionales",
      DESCRIPCION_DESTINOECONOMICO:
        "Predios destinados a la administración y prestación de servicios del Estado y que no están incluidos en los literales de este artículo.",
    },
    {
      CODIGO_DESTINOECONOMICO: "J",
      NOMBRE_DESTINOECONOMICO: "Educativo",
      DESCRIPCION_DESTINOECONOMICO:
        "Predios destinados al desarrollo de actividades académicas.",
    },
    {
      CODIGO_DESTINOECONOMICO: "K",
      NOMBRE_DESTINOECONOMICO: "Religioso",
      DESCRIPCION_DESTINOECONOMICO:
        "Predios destinados a la práctica de culto religioso.",
    },
    {
      CODIGO_DESTINOECONOMICO: "L",
      NOMBRE_DESTINOECONOMICO: "Agrícola",
      DESCRIPCION_DESTINOECONOMICO:
        "Predios destinados a la siembra y aprovechamiento de especies vegetales.",
    },
    {
      CODIGO_DESTINOECONOMICO: "M",
      NOMBRE_DESTINOECONOMICO: "Pecuario",
      DESCRIPCION_DESTINOECONOMICO:
        "Predios destinados a la cría, beneficio y aprovechamiento de especies animales.",
    },
    {
      CODIGO_DESTINOECONOMICO: "N",
      NOMBRE_DESTINOECONOMICO: "Agroindustrial",
      DESCRIPCION_DESTINOECONOMICO:
        "Predios destinados a la actividad que implica cultivo y transformación en los sectores agrícola, pecuario y forestal.",
    },
    {
      CODIGO_DESTINOECONOMICO: "O",
      NOMBRE_DESTINOECONOMICO: "Forestal",
      DESCRIPCION_DESTINOECONOMICO:
        "Predios destinados a la explotación de especies maderables y no maderables.",
    },
    {
      CODIGO_DESTINOECONOMICO: "P",
      NOMBRE_DESTINOECONOMICO: "Uso Público",
      DESCRIPCION_DESTINOECONOMICO:
        "Predios cuyo uso es abierto a la comunidad y que no están incluidos en los literales anteriores.",
    },
    {
      CODIGO_DESTINOECONOMICO: "Q",
      NOMBRE_DESTINOECONOMICO: "Servicios Especiales",
      DESCRIPCION_DESTINOECONOMICO:
        "Predios que genera alto impacto ambiental y /o Social. Entre otros, están: Centro de Almacenamiento de Combustible, Cementerios, Embalses, Rellenos Sanitarios, Lagunas de Oxidación, Mataderos, Frigoríficos y Cárceles.",
    },
  ];

  const economicDestiny = economicDestinyList.find(
    (department) => department.CODIGO_DESTINOECONOMICO === cod
  );

  if (economicDestiny) {
    return economicDestiny;
  }

  return false;
};
