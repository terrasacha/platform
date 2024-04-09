import { API, graphqlOperation } from "aws-amplify";
import { listCategories } from "../utilities/customQueries";

export const getCategories = async () => {
  try {
    const response = await API.graphql(graphqlOperation(listCategories));

    const categoryList = response.data.listCategories.items.map(
      (category) => category.id
    );
    return categoryList;
  } catch (error) {
    console.error("Error fetching project data:", error);
    return null;
  }
};
