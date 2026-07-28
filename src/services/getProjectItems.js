import { API, graphqlOperation } from "aws-amplify";
import { listProductItems } from "../utilities/customQueries";
import { groupBy } from "lodash";
import { normalizeItemRecord } from "../utilities/normalizeItemText";

export const getProjectItems = async () => {
  try {
    const response = await API.graphql(graphqlOperation(listProductItems));
    const normalizedItems = response.data.listProductItems.items.map(
      normalizeItemRecord
    );
    const groupedData = groupBy(normalizedItems, "type");
    return groupedData;
  } catch (error) {
    console.error("Error fetching project data:", error);
    return null;
  }
};
