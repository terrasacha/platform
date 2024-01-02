const { parseSerializedKoboData } = require("./utils.js");

const mapProjectUses = async (project) => {
  
  const projectUses =
  project.productFeatures.items.filter((item) => {
      return item.featureID === "D_actual_use";
    })[0]?.value || "";

  let parsedData
  if (project) {
    parsedData = parseSerializedKoboData(projectUses);
  }
  return parsedData
}

module.exports = { mapProjectUses };