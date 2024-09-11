import { API, graphqlOperation } from "aws-amplify";
import { getProductItem } from "../utilities/customQueries";

export const getProductItemName = async (productItemID) => {
  try {
    const response = await API.graphql(graphqlOperation(getProductItem, { id: productItemID }));

    const productItemName = response.data.getProductItem.name
    return productItemName;
  } catch (error) {
    console.error("Error fetching project data:", error);
    return null;
  }
};
