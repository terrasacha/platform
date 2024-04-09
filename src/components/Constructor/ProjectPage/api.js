import { API, graphqlOperation } from "aws-amplify";
import { getProduct } from "../../../utilities/customQueries";
import { mapProjectData } from "./mappers";

export const fetchProjectDataByProjectID = async (projectId) => {
  console.log("projectId", projectId);
  if (projectId) {
    console.log("projectId", projectId);
    try {
      const response = await API.graphql(
        graphqlOperation(getProduct, { id: projectId })
      );
      const mappedData = mapProjectData(response.data.getProduct);
      console.log(response);
      return mappedData;
    } catch (error) {
      console.error("Error fetching project data:", error);
      return null;
    }
  }

  return null;
};
