import { useAuth } from "context/AuthContext";

const calcularPorcentajeTrue = (objeto) => {
  // Obtén las claves del objeto
  const claves = Object.keys(objeto);

  // Filtra las claves que tienen el valor true
  const clavesTrue = claves.filter((clave) => objeto[clave]);

  // Calcula el porcentaje
  const porcentaje = (clavesTrue.length / claves.length) * 100;

  return porcentaje;
};

const getProjectInfoStatus = (data) => {
  let tempStatus = true;

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
  // const planoPredio =
  //   data.productFeatures.items.filter((item) => {
  //     return item.featureID === "C_plano_predio";
  //   })[0]?.value || null;

  if (!data.name) tempStatus = false;
  if (!data.description) tempStatus = false;
  if (!data.categoryID) tempStatus = false;
  if (!area) tempStatus = false;
  if (!vereda) tempStatus = false;
  if (!municipio) tempStatus = false;
  if (!matricula) tempStatus = false;
  if (!fichaCatrastal) tempStatus = false;
  // if (!planoPredio) tempStatus = false;

  return tempStatus;
};

const getGeodataInfoStatus = (data) => {
  let tempStatus = true;

  const coordenadas =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "C_ubicacion";
    })[0]?.value || null;

  if (!coordenadas) tempStatus = false;

  return tempStatus;
};

const getOwnersInfoStatus = (data) => {
  let tempStatus = true;

  const ownersData = JSON.parse(
    data.productFeatures.items.filter((item) => {
      return item.featureID === "B_owners";
    })[0]?.value || "[]"
  );

  if (Object.keys(ownersData).length === 0) tempStatus = false;

  return tempStatus;
};

const getActualUseInfoStatus = (data) => {
  let tempStatus = true;

  const projectUses =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "D_actual_use";
    })[0]?.value || null;

  if (!projectUses) tempStatus = false;

  return tempStatus;
};

const getLimitationsInfoStatus = (data) => {
  let tempStatus = true;

  const restrictionsDesc =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "E_restriccion_desc";
    })[0]?.value || null;

  const restrictionsOther =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "E_resctriccion_other";
    })[0]?.value || null;

  if (!restrictionsDesc) tempStatus = false;
  if (!restrictionsOther) tempStatus = false;

  return tempStatus;
};

const getEcosystemInfoStatus = (data) => {
  let tempStatus = true;

  const projectEcosystem =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "F_nacimiento_agua";
    })[0]?.value || null;

  if (!projectEcosystem) tempStatus = false;

  return tempStatus;
};

const getGeneralInfoStatus = (data) => {
  let tempStatus = true;

  const propertyGeneralAspects =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "G_habita_predio";
    })[0]?.value || null;

  if (!propertyGeneralAspects) tempStatus = false;

  return tempStatus;
};

const getRelationsInfoStatus = (data) => {
  let tempStatus = true;

  const technicalAssistance =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "H_asistance_desc";
    })[0]?.value || null;

  const strategicAllies =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "H_aliados_estrategicos_desc";
    })[0]?.value || null;

  const communityGroups =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "H_grupo_comunitario_desc";
    })[0]?.value || null;

  if (!technicalAssistance) tempStatus = false;
  if (!strategicAllies) tempStatus = false;
  if (!communityGroups) tempStatus = false;

  return tempStatus;
};

const getFinancialInfoStatus = (data) => {
  let tempStatus = true;

  const financialConditions =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "GLOBAL_VALIDATOR_SET_FINANCIAL_CONDITIONS";
    })[0]?.value || null;

  if (financialConditions !== "true") tempStatus = false;

  return tempStatus;
};

const getTechnicalInfoStatus = (data) => {
  let tempStatus = true;

  const technicalConditions =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "GLOBAL_VALIDATOR_SET_TECHNICAL_CONDITIONS";
    })[0]?.value || null;

  if (technicalConditions !== "true") tempStatus = false;

  return tempStatus;
};

const getOwnerAcceptsConditionsInfoStatus = (data) => {
  let tempStatus = true;

  const technicalConditions =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "GLOBAL_OWNER_ACCEPTS_CONDITIONS";
    })[0]?.value || null;

  if (technicalConditions !== "true") tempStatus = false;

  return tempStatus;
};

const getValidationsCompleteInfoStatus = (data) => {
  let tempStatus = true;
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
  if(documents.length !== approvedDocuments.length) tempStatus = false
  
  return tempStatus;
};

export const mapProjectFillProgress = async (data, userRole) => {
  let sectionsStatus = {
    projectInfo: false,
    geodataInfo: false,
    ownersInfo: false,
    financialInfo: false,
    technicalInfo: false,
    validationsComplete: false,
    ownerAcceptsConditions: false
    // actualUseInfo: false,
    // limitationsInfo: false,
    // ecosystemInfo: false,
    // generalInfo: false,
    // relationsInfo: false,
  };
  
  // Requerimientos postulante
  sectionsStatus.projectInfo = getProjectInfoStatus(data);
  sectionsStatus.geodataInfo = getGeodataInfoStatus(data);
  // sectionsStatus.ownersInfo = getOwnersInfoStatus(data);
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
    sectionsStatus: sectionsStatus,
    progressValue: calcularPorcentajeTrue(sectionsStatus),
  };
};
