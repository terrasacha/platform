import { API, graphqlOperation } from "aws-amplify";
import { getProduct } from "../utilities/customQueries";
import { mapProjectFillProgress } from "mappers/mapProjectFillProgress";

export const getProjectProgress = async (projectID) => {
  try {
    const response = await API.graphql(graphqlOperation(getProduct, { id: projectID }));
    const mappedData = mapProjectFillProgress(response.data.getProduct);
    return mappedData;
  } catch (error) {
    console.error("Error fetching project data:", error);
    return null;
  }
};