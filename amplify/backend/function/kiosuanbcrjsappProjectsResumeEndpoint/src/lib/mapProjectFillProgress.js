const calcularPorcentajeTrue = (objeto) => {
  // Obtén las claves del objeto
  const claves = Object.keys(objeto);

  // Filtra las claves que tienen el valor true
  const clavesTrue = claves.filter((clave) => objeto[clave] === "Si");

  // Calcula el porcentaje
  const porcentaje = (clavesTrue.length / claves.length) * 100;

  return porcentaje;
};

const getProjectInfoStatus = (data) => {
  let tempStatus = "Si"; 

  const area =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "D_area";
    })[0]?.value || null;
  const vereda =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "A_vereda";
    })[0]?.value || null;
  const municipio =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "A_municipio";
    })[0]?.value || null;
  const matricula =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "A_matricula";
    })[0]?.value || null;
  const fichaCatrastal =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "A_ficha_catastral";
    })[0]?.value || null;
  const planoPredio =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "C_plano_predio";
    })[0]?.value || null;

  if (!data.name) tempStatus = "No";
  if (!data.description) tempStatus = "No";
  if (!data.categoryID) tempStatus = "No";
  if (!area) tempStatus = "No";
  if (!vereda) tempStatus = "No";
  if (!municipio) tempStatus = "No";
  if (!matricula) tempStatus = "No";
  if (!fichaCatrastal) tempStatus = "No";
  if (!planoPredio) tempStatus = "No";

  return tempStatus;
};

const getGeodataInfoStatus = (data) => {
  let tempStatus = "Si"; 

  const coordenadas =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "C_ubicacion";
    })[0]?.value || null;

  if (!coordenadas) tempStatus = "No";

  return tempStatus;
};

const getOwnersInfoStatus = (data) => {
  let tempStatus = "Si"; 

  const ownersData = JSON.parse(
    data.productFeatures.items.filter((item) => {
      return item.featureID === "B_owners";
    })[0]?.value || "[]"
  );

  if (Object.keys(ownersData).length === 0) tempStatus = "No";

  return tempStatus;
};

const getFinancialInfoStatus = (data) => {
  let tempStatus = "Si"; 

  const financialConditions =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "GLOBAL_VALIDATOR_SET_FINANCIAL_CONDITIONS";
    })[0]?.value || null;

  if (financialConditions !== "true") tempStatus = "No";

  return tempStatus;
};

const getTechnicalInfoStatus = (data) => {
  let tempStatus = "Si"; 

  const technicalConditions =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "GLOBAL_VALIDATOR_SET_TECHNICAL_CONDITIONS";
    })[0]?.value || null;

  if (technicalConditions !== "true") tempStatus = "No";

  return tempStatus;
};

const getOwnerAcceptsConditionsInfoStatus = (data) => {
  let tempStatus = "Si"; 

  const technicalConditions =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "GLOBAL_OWNER_ACCEPTS_CONDITIONS";
    })[0]?.value || null;

  if (technicalConditions !== "true") tempStatus = "No";

  return tempStatus;
};

const getValidationsCompleteInfoStatus = (data) => {
  let tempStatus = "Si"; 
  const PFNameMapper = {
    B_owner_certificado: "Certificado de tradición",
    C_plano_predio: "Plano del predio",
  };

  const ownersData = JSON.parse(
    data.productFeatures.items.filter((item) => {
      return item.featureID === "B_owners";
    })[0]?.value || "[]"
  );

  const verifiablePF = data.productFeatures.items.filter(
    (pf) => pf.feature.isVerifable === true
  );
  
  const documents = verifiablePF.map((pf) =>
    pf.documents.items
      .filter((document) => document.status !== "validatorFile")
      .map((document) => {
        const ownerName =
          ownersData.find((owner) => owner.documentID === document.id)?.name ||
          null;
        return {
          id: document.id,
          pfID: pf.id,
          title: `${PFNameMapper[pf.feature.name]} ${
            ownerName ? `(${ownerName})` : ""
          }`,
          isApproved: document.isApproved,
        };
      })
  ).flat();

  const approvedDocuments = documents.filter(projectFile => projectFile.isApproved === true)
  if(documents.length !== approvedDocuments.length) tempStatus = "No"
  
  return tempStatus;
};

const mapProjectFillProgress = async (data) => {
  let sectionsStatus = {
    projectInfo: "No",
    geodataInfo: "No",
    ownersInfo: "No",
    financialInfo: "No",
    technicalInfo: "No",
    validationsComplete: "No",
    ownerAcceptsConditions: "No"
    // actualUseInfo: false,
    // limitationsInfo: false,
    // ecosystemInfo: false,
    // generalInfo: false,
    // relationsInfo: false,
  };
  
  // Requerimientos postulante
  sectionsStatus.projectInfo = getProjectInfoStatus(data);
  sectionsStatus.geodataInfo = getGeodataInfoStatus(data);
  sectionsStatus.ownersInfo = getOwnersInfoStatus(data);
  sectionsStatus.ownerAcceptsConditions = getOwnerAcceptsConditionsInfoStatus(data)

  // Requerimientos equipo SUAN
  sectionsStatus.financialInfo = getFinancialInfoStatus(data);
  sectionsStatus.technicalInfo = getTechnicalInfoStatus(data);
  sectionsStatus.validationsComplete = getValidationsCompleteInfoStatus(data);

  // sectionsStatus.actualUseInfo = getActualUseInfoStatus(data);
  // sectionsStatus.limitationsInfo = getLimitationsInfoStatus(data);
  // sectionsStatus.ecosystemInfo = getEcosystemInfoStatus(data);
  // sectionsStatus.generalInfo = getGeneralInfoStatus(data);
  // sectionsStatus.relationsInfo = getRelationsInfoStatus(data);

  return {
    ...sectionsStatus,
    progressValue: calcularPorcentajeTrue(sectionsStatus),
  };
};

module.exports = { mapProjectFillProgress };