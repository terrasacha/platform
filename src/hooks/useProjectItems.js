import { useState, useEffect } from "react";
import { getProjectItems } from "services/getProjectItems";

export default function useProjectItems() {
  const [projectItems, setProjectItemsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    getProjectItems()
      .then((categories) => {
        setProjectItemsList(categories);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setIsError(true);
      });
  }, []);

  return { projectItems, isLoading, isError };
}
