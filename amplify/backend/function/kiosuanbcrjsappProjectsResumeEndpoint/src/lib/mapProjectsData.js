const { mapProjectFillProgress } = require("./mapProjectFillProgress.js");
const { mapProjectUses } = require("./mapProjectUses.js");
const { formatearNumero } = require("./utils.js");
function createJSONObject(fields, values) {
  const jsonObject = {};

  fields.forEach((field, index) => {
    jsonObject[field] = values[index];
  });

  // Recorrer el objeto para detectar arrays
  for (const key in jsonObject) {
    if (Array.isArray(jsonObject[key])) {
      const arrayValues = jsonObject[key];
      delete jsonObject[key];

      // Crear un objeto por cada elemento del array
      const arrayObjects = arrayValues.map((element) => ({
        ...jsonObject,
        [key]: element,
      }));

      return arrayObjects;
    }
  }

  return [jsonObject];
}

const mapProjectsData = async (projects) => {
  const mappedProjects = await Promise.all(
    projects.map(async (project) => {
      const indicadoresFinacierosFields = [
        "indicadorFinanciero_inversionCapital",
        "indicadorFinanciero_tasaDescuento",
        "indicadorFinanciero_van",
        "indicadorFinanciero_tir",
        "indicadorFinanciero_beneficioCosto",
      ];
      const indicadoresFinacierosTokenFields = [
        "indicadorFinancieroToken_npv",
        "indicadorFinancieroToken_inversion",
        "indicadorFinancieroToken_tirToken",
      ];
      const ingresosProductoFields = [
        "Ingresos_CarbonoForestal",
        "Ingresos_Madera",
        "Ingresos_CIF",
        "Ingresos_CarbonoREDD",
        "Ingresos_Resina",
        "Ingresos_Latex",
      ];
      const productosCicloProyectoFields = [
        "Cantidad_LatexTon",
        "Cantidad_MaderaM3",
        "Cantidad_ResinaTon",
        "Cantidad_CarbonoREDDTon",
        "Cantidad_CarbonoForestalTon",
      ];
      const fields = [
        "proyecto",
        "categoria",
        "estado",
        "area",
        "progressValue",
        ...indicadoresFinacierosFields,
        ...indicadoresFinacierosTokenFields,
        ...ingresosProductoFields,
        ...productosCicloProyectoFields,
      ];
      // Mapeo de condiciones para visualizacion en marketplace
      const progressData = await mapProjectFillProgress(project);
      const usesData = await mapProjectUses(project);

      // Indicadores financieros (Proyecto)
      const financialIndicators = JSON.parse(
        project.productFeatures.items.filter((item) => {
          return item.featureID === "GLOBAL_INDICADORES_FINANCIEROS";
        })[0]?.value || "[]"
      );

      let inversionCapital = 0;
      let tasaDescuento = 0;
      let van = 0;
      let tir = 0;
      let beneficioCosto = 0;

      financialIndicators.forEach(({ CONCEPTO: concepto, CANTIDAD: value }) => {
        if (concepto === "INVERSIÓN DE CAPITAL") {
          inversionCapital = parseFloat(value);
        }
        if (concepto === "TASA DE DESCUENTO") {
          tasaDescuento = parseFloat(value);
        }
        if (concepto === "VALOR ACTUAL NETO (VAN)") {
          van = parseFloat(value);
        }
        if (concepto === "TASA INTERNA DE RETORNO (TIR)") {
          tir = parseFloat(value);
        }
        if (concepto === "RELACIÓN BENEFICIO -COSTO B/C") {
          beneficioCosto = parseFloat(value);
        }
      });

      // Indicadores financieros (Token)
      const financialIndicatorsToken = JSON.parse(
        project.productFeatures.items.filter((item) => {
          return item.featureID === "GLOBAL_INDICADORES_FINANCIEROS_TOKEN";
        })[0]?.value || "[]"
      );

      let npv = 0;
      let inversion = 0;
      let tirToken = 0;

      financialIndicatorsToken.forEach(
        ({ CONCEPTO: concepto, CANTIDAD: value }) => {
          if (concepto === "NPV") {
            npv = parseFloat(value);
          }
          if (concepto === "INVERSIÓN") {
            inversion = parseFloat(value);
          }
          if (concepto === "TIR") {
            tirToken = parseFloat(value);
          }
        }
      );

      // Ingresos por producto
      const ingresosPorProducto = JSON.parse(
        project.productFeatures.items.filter((item) => {
          return item.featureID === "GLOBAL_INGRESOS_POR_PRODUCTO";
        })[0]?.value || "[]"
      );

      let carbonoForestal = 0;
      let madera = 0;
      let cif = 0;
      let carbonoRedd = 0;
      let resina = 0;
      let latex = 0;

      ingresosPorProducto.forEach(({ CONCEPTO: concepto, CANTIDAD: value }) => {
        if (concepto === "CARBONO FORESTAL") {
          carbonoForestal = parseFloat(value);
        }
        if (concepto === "MADERA") {
          madera = parseFloat(value);
        }
        if (concepto === "CIF") {
          cif = parseFloat(value);
        }
        if (concepto === "CARBONO REDD") {
          carbonoRedd = parseFloat(value);
        }
        if (concepto === "RESINA") {
          resina = parseFloat(value);
        }
        if (concepto === "LATEX") {
          latex = parseFloat(value);
        }
      });

      // Productos del ciclo del proyecto
      const productosCicloProyecto = JSON.parse(
        project.productFeatures.items.filter((item) => {
          return item.featureID === "GLOBAL_PRODUCTOS_DEL_CICLO_DE_PROYECTO";
        })[0]?.value || "[]"
      );

      let latexCiclo = 0;
      let maderaCiclo = 0;
      let resinaCiclo = 0;
      let carbonoReddCiclo = 0;
      let carbonoForestalCiclo = 0;

      productosCicloProyecto.forEach(
        ({ CONCEPTO: concepto, CANTIDAD: value }) => {
          if (concepto === "LATEX 7-30") {
            latexCiclo = parseFloat(value);
          }
          if (concepto === "MADERA 6-12-17-21") {
            maderaCiclo = parseFloat(value);
          }
          if (concepto === "RESINA 7-20") {
            resinaCiclo = parseFloat(value);
          }
          if (concepto === "CARBONO REDD") {
            carbonoReddCiclo = parseFloat(value);
          }
          if (concepto === "CARBONO FORESTAL") {
            carbonoForestalCiclo = parseFloat(value);
          }
        }
      );

      const values = fields.map((field) => {
        let value = "";
        if (field === "proyecto") {
          value = project.name;
        }
        if (field === "descripcion") {
          value = project.description;
        }
        if (field === "categoria") {
          value = project.categoryID;
        }
        if (field === "estado") {
          value = project.status;
        }
        if (field === "area") {
          const area =
            project.productFeatures.items.filter((item) => {
              return item.featureID === "D_area";
            })[0]?.value || 0;
          value = area;
        }
        if (field === "progressValue") {
          value = progressData.progressValue;
        }

        // Indicador Financiero
        if (field === "indicadorFinanciero_inversionCapital") {
          value = inversionCapital;
        }
        if (field === "indicadorFinanciero_tasaDescuento") {
          value = tasaDescuento;
        }
        if (field === "indicadorFinanciero_van") {
          value = van;
        }
        if (field === "indicadorFinanciero_tir") {
          value = tir;
        }
        if (field === "indicadorFinanciero_beneficioCosto") {
          value = beneficioCosto;
        }

        // Indicador Financiero Token
        if (field === "indicadorFinancieroToken_npv") {
          value = npv;
        }
        if (field === "indicadorFinancieroToken_inversion") {
          value = inversion;
        }
        if (field === "indicadorFinancieroToken_tirToken") {
          value = tirToken;
        }

        // Ingresos por producto
        if (field === "Ingresos_CarbonoForestal") {
          value = carbonoForestal;
        }
        if (field === "Ingresos_CarbonoREDD") {
          value = carbonoRedd;
        }
        if (field === "Ingresos_Madera") {
          value = madera;
        }
        if (field === "Ingresos_CIF") {
          value = cif;
        }
        if (field === "Ingresos_Resina") {
          value = resina;
        }
        if (field === "Ingresos_Latex") {
          value = latex;
        }

        // Productos del ciclo de proyecto
        if (field === "Cantidad_LatexTon") {
          value = latexCiclo;
        }
        if (field === "Cantidad_MaderaM3") {
          value = maderaCiclo;
        }
        if (field === "Cantidad_ResinaTon") {
          value = resinaCiclo;
        }
        if (field === "Cantidad_CarbonoREDDTon") {
          value = carbonoReddCiclo;
        }
        if (field === "Cantidad_CarbonoForestalTon") {
          value = carbonoForestalCiclo;
        }

        // if (field === "uso") {
        //   value = {
        //     "Plantaciones Forestales 1": 22,
        //     "Plantaciones Forestales 2": 33,
        //     "Plantaciones Forestales 3": 11,
        //   };
        // }
        return value;
      });

      let jsonObj = createJSONObject(fields, values);
      //console.log(jsonObj);

      return jsonObj;

      // Recorrer usos del proyecto y crear una fila por uso
      // console.log("Hola")
      // return {
      //     name: project.name,
      //     description: project.description,
      //     category: project.categoryID,
      //     ...progressData,
      //     ...usesData
      // };
    })
  );

  return mappedProjects.flat();
};

module.exports = { mapProjectsData };
