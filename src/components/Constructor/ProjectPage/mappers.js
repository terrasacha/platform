import {
  parseSerializedKoboData,
  convertAWSDatetimeToDate,
  getElapsedTime,
  capitalizeWords,
} from "./utils";

const mapProjectVerifiers = async (data) => {
  const verifiablePF = data.productFeatures.items.filter(
    (pf) => pf.feature.isVerifable === true
  );
  let projectVerifiers = [];
  verifiablePF.forEach((pf) => {
    pf.verifications.items.forEach((vf) => {
      projectVerifiers.push(vf.userVerifierID);
    });
  });

  return projectVerifiers;
};

const mapVerificationsData = async (verifications) => {
  const verificationData = verifications.map(async (verification) => {
    return {
      id: verification.id,
      verifierID: verification.userVerifierID,
      verifierName: verification.userVerifier.name,
      postulantName: verification.userVerified.name,
      postulantID: verification.userVerifiedID,
      messages: await Promise.all(
        verification.verificationComments.items
          .sort(function (a, b) {
            return new Date(a.createdAt) - new Date(b.createdAt);
          })
          .map(async (msg) => {
            return {
              ...msg,
              userName: await capitalizeWords(
                msg.isCommentByVerifier
                  ? verification.userVerifier.name
                  : verification.userVerified.name
              ),
              createdAt: await convertAWSDatetimeToDate(msg.createdAt),
              elapsedTime: await getElapsedTime(msg.createdAt),
            };
          })
      ),
    };
  });

  // Esperar a que todas las promesas se resuelvan y devolver la primera
  const resolvedVerificationData = await Promise.all(verificationData);

  return resolvedVerificationData[0];
};

const mapDocumentsData = async (data) => {
  const PFNameMapper = {
    B_owner_certificado: "Certificado de tradición",
    C_plano_predio: "Plano del predio",
  };
  const verifiablePF = data.productFeatures.items.filter(
    (pf) => pf.feature.isVerifable === true
  );

  const documentsPromises = verifiablePF.map((pf) =>
    pf.documents.items.map(async (document) => {
      return {
        id: document.id,
        title: PFNameMapper[pf.feature.name],
        url: document.url,
        signed: document.signed,
        signedHash: document.signedHash,
        isUploadedToBlockChain: document.isUploadedToBlockChain,
        isApproved: document.isApproved,
        verification: await mapVerificationsData(pf.verifications.items),
        updatedAt: await convertAWSDatetimeToDate(pf.updatedAt),
        status: document.status,
      };
    })
  );
  const documents = await Promise.all(documentsPromises.flat());
  return documents;
};

const mapLocationData = async (location) => {
  if (!location) {
    return {
      lat: "",
      lng: "",
      alt: "",
      pres: "",
    };
  }

  const [lat, lng, alt, pres] = location.split(" ").map(parseFloat);

  return {
    lat: isNaN(lat) ? "" : lat,
    lng: isNaN(lng) ? "" : lng,
    alt: isNaN(alt) ? "" : alt,
    pres: isNaN(pres) ? "" : pres,
  };
};

const mapStatus = async (obj) => {
  const mapper = {
    draft: "En borrador",
    verified: "Verificado",
    on_verification: "En verificación",
    in_blockchain: "En blockchain",
    in_equilibrium: "En equilibrio",
  };

  return mapper[obj] || false;
};

const mapCategory = async (obj) => {
  const mapper = {
    PROYECTO_PLANTACIONES: "Proyecto Plantaciones",
    "REDD+": "REDD+",
  };

  return mapper[obj] || false;
};

const mapUseTypes = async (types) => {
  const mapper = {
    potreros: "Potreros",
    plantaciones_forestales1: "Plantaciones Forestales 1",
    plantaciones_forestales2: "Plantaciones Forestales 2",
    plantaciones_forestales3: "Plantaciones Forestales 3",
    frutales1: "Frutales 1",
    frutales2: "Frutales 2",
    otros: "Otros",
  };

  if (Array.isArray(types)) {
    const mappedData = types.map((type) => mapper[type]);
    return mappedData;
  }

  return false;
};

const mapTrueOrFalseAnswers = async (answer) => {
  const mapper = {
    yes: "Si",
    no: "No",
  };

  return mapper[answer] || false;
};

const mapTemporalOrPermanent = async (answer) => {
  const mapper = {
    temporal: "Temporal",
    permanente: "Permanente",
  };

  return mapper[answer] || false;
};

const mapProjectGeneralAspects = async (data) => {
  let parsedData = "";
  if (data) {
    parsedData = await parseSerializedKoboData(data);
  }

  return {
    postulant: {
      livesOnProperty:
        (await mapTrueOrFalseAnswers(parsedData?.G_habita_predio)) || "",
      timeLivingOnProperty: parsedData?.G_habita_years || "",
      typeOfStay:
        (await mapTemporalOrPermanent(parsedData?.G_Temporal_permanente)) || "",
    },
    households: parsedData?.G_viviendas_number || "",
    familiesNumber: parsedData?.G_familias || "",
    membersPerFamily: parsedData?.G_familias_miembros || "",
    roadsStatus: parsedData?.G_vias_state || "",
    municipalDistance: parsedData?.G_distancia_predio_municipal || "",
    conveyance: parsedData?.G_transport_mean || "",
    neighborhoodRoads:
      (await mapTrueOrFalseAnswers(parsedData?.G_caminos_existence)) || "",
    collapseRisk: parsedData?.G_risks_erosion_derrumbe || "",
  };
};

const mapProjectEcosystems = async (data) => {
  let parsedData = "";
  if (data) {
    parsedData = await parseSerializedKoboData(data);
  }

  return {
    waterSprings: {
      exist: (await mapTrueOrFalseAnswers(parsedData?.F_nacimiento_agua)) || "",
      quantity: parsedData?.F_nacimiento_agua_quantity || "",
    },
    concessions: {
      exist: (await mapTrueOrFalseAnswers(parsedData?.F_agua_concede)) || "",
      entity: parsedData?.F_agua_concede_entity || "",
    },
    deforestationThreats: parsedData?.F_amenazas_defo_desc || "",
    conservationProjects: parsedData?.F_conservacion_desc || "",
    diversity: {
      fauna: parsedData?.F_especies_fauna || "",
      flora: parsedData?.F_especies_flora || "",
      mammals: parsedData?.F_especies_mamiferos || "",
      birds: parsedData?.F_especies_aves || "",
    },
  };
};

const mapProjectUses = async (data) => {
  let parsedData = "";
  if (data) {
    parsedData = await parseSerializedKoboData(data);
  }

  return {
    actualUse: {
      types: (await mapUseTypes(parsedData?.D_actual_use)) || [],
      potreros: {
        ha: parsedData?.D_area_potrero || "",
      },
      plantacionesForestales1: {
        especie: parsedData?.D_especie_plantaciones1 || "",
        ha: parsedData?.D_ha_plantaciones1 || "",
      },
      plantacionesForestales2: {
        especie: parsedData?.D_especie_plantaciones2 || "",
        ha: parsedData?.D_ha_plantaciones2 || "",
      },
      plantacionesForestales3: {
        especie: parsedData?.D_especie_plantaciones3 || "",
        ha: parsedData?.D_ha_plantaciones3 || "",
      },
      frutales1: {
        especie: parsedData?.D_especie_frutales1 || "",
        ha: parsedData?.D_ha_frutales1 || "",
      },
      frutales2: {
        especie: parsedData?.D_especie_frutales2 || "",
        ha: parsedData?.D_ha_frutales2 || "",
      },
      otros: {
        especie: parsedData?.D_especie_otros || "",
        ha: parsedData?.D_ha_otros || "",
      },
    },
    replaceUse: {
      types: (await mapUseTypes(parsedData?.D_replace_use)) || [],
      potreros: {
        newUse: parsedData?.D_replace_potrero_use || "",
        ha: parsedData?.D_replace_ha_potrero_use || "",
      },
      plantacionesForestales1: {
        newUse: parsedData?.D_replace_plantaciones1_use || "",
        ha: parsedData?.D_replace_ha_plantaciones1_use || "",
      },
      plantacionesForestales2: {
        newUse: parsedData?.D_replace_plantaciones2_use || "",
        ha: parsedData?.D_replace_ha_plantaciones2_use || "",
      },
      plantacionesForestales3: {
        newUse: parsedData?.D_replace_plantaciones3_use || "",
        ha: parsedData?.D_replace_ha_plantaciones3_use || "",
      },
      frutales1: {
        newUse: parsedData?.D_replace_frutales1_use || "",
        ha: parsedData?.D_replace_ha_frutales1_use || "",
      },
      frutales2: {
        newUse: parsedData?.D_replace_frutales2_use || "",
        ha: parsedData?.D_replace_ha_frutales2_use || "",
      },
      otros: {
        newUse: parsedData?.D_replace_otros_use || "",
        ha: parsedData?.D_replace_ha_otros_use || "",
      },
    },
  };
};

export const mapProjectData = async (data) => {

  const projectID = data.id
  const projecIsActive = data.isActive

  const tokenName =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "GLOBAL_TOKEN_NAME";
    })[0]?.value || "";
  const pfTokenNameID =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "GLOBAL_TOKEN_NAME";
    })[0]?.id || "";

  const tokenPrice =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "GLOBAL_TOKEN_PRICE";
    })[0]?.value || "0";
  const pfTokenPriceID =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "GLOBAL_TOKEN_PRICE";
    })[0]?.id || "";

  const tokenAmount =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "GLOBAL_AMOUNT_OF_TOKENS";
    })[0]?.value || "0";

  const pfTokenAmountID =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "GLOBAL_AMOUNT_OF_TOKENS";
    })[0]?.id || "";

  // A
  const postulantName =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "A_postulante_name";
    })[0]?.value || "";
  const postulantDocType =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "A_postulante_doctype";
    })[0]?.value || "";
  const postulantDocNumber =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "A_postulante_id";
    })[0]?.value || "";
  const postulantEmail =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "A_postulante_email";
    })[0]?.value || "";
  const vereda =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "A_vereda";
    })[0]?.value || "";
  const municipio =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "A_municipio";
    })[0]?.value || "";
  const matricula =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "A_matricula";
    })[0]?.value || "";
  const fichaCatrastal =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "A_ficha_catastral";
    })[0]?.value || "";

  // B
  const ownerName =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "B_owner";
    })[0]?.value || "";
  const ownerDocType =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "B_owner_doctype";
    })[0]?.value || "";
  const ownerDocNumber =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "B_owner_id";
    })[0]?.value || "";

  // C
  const location =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "C_ubicacion";
    })[0]?.value || "";

  // D
  const area =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "D_area";
    })[0]?.value || "0";
  const projectUses =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "D_actual_use";
    })[0]?.value || "";

  // E
  const restrictionsDesc =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "E_restriccion_desc";
    })[0]?.value || "";

  const restrictionsOther =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "E_resctriccion_other";
    })[0]?.value || "";

  // F
  const projectEcosystem =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "F_nacimiento_agua";
    })[0]?.value || "";

  // G
  const propertyGeneralAspects =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "G_habita_predio";
    })[0]?.value || "";

  // H
  const technicalAssistance =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "H_asistance_desc";
    })[0]?.value || "";

  const strategicAllies =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "H_aliados_estrategicos_desc";
    })[0]?.value || "";

  const communityGroups =
    data.productFeatures.items.filter((item) => {
      return item.featureID === "H_grupo_comunitario_desc";
    })[0]?.value || "";

  const postulantID =
    data.userProducts.items.filter((up) => up.user.role === "constructor")[0]
      ?.user.id || "";

  return {
    projectInfo: {
      id: projectID,
      status: await mapStatus(data.status),
      isActive: projecIsActive,
      title: data.name,
      description: data.description,
      category: await mapCategory(data.categoryID),
      area: area,
      token: {
        pfIDs: {
          pfTokenNameID: pfTokenNameID,
          pfTokenPriceID: pfTokenPriceID,
          pfTokenAmountID: pfTokenAmountID,
        },
        name: tokenName,
        price: tokenPrice,
        priceCurrency: "USD",
        amount: tokenAmount,
      },
      location: {
        vereda: vereda,
        municipio: municipio,
        matricula: matricula,
        fichaCatrastal: fichaCatrastal,
        coords: await mapLocationData(location),
      },
      verificationLimitDate: data.timeOnVerification,
      createdAt: await convertAWSDatetimeToDate(data.createdAt),
    },
    projectPostulant: {
      id: postulantID,
      name: postulantName,
      docType: postulantDocType.toUpperCase(),
      docNumber: postulantDocNumber,
      email: postulantEmail,
    },
    projectOwner: {
      name: ownerName,
      docType: ownerDocType.toUpperCase(),
      docNumber: ownerDocNumber,
    },
    projectUses: await mapProjectUses(projectUses),
    projectRestrictions: {
      desc: restrictionsDesc,
      other: restrictionsOther,
    },
    projectEcosystem: await mapProjectEcosystems(projectEcosystem),
    projectGeneralAspects: await mapProjectGeneralAspects(
      propertyGeneralAspects
    ),
    projectRelations: {
      technicalAssistance: technicalAssistance,
      strategicAllies: strategicAllies,
      communityGroups: communityGroups,
    },
    projectFiles: await mapDocumentsData(data),
    projectVerifiers: await mapProjectVerifiers(data),
  };
};
