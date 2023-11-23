import { API, graphqlOperation } from "aws-amplify";
import { getFeature } from "../utilities/customQueries";

export const getFilteredProductFeatures = async (featureID) => {
  try {
    const response = await API.graphql(graphqlOperation(getFeature, { id: featureID }));

    const productFeatureList = response.data.getFeature.productFeatures.items
    return productFeatureList;
  } catch (error) {
    console.error("Error fetching project data:", error);
    return null;
  }
};
