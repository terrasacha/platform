import { useState, useEffect } from "react";
import { getCategories } from "services/getCategories";

export default function useCategories() {
  const [categoryList, setCategoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    getCategories()
      .then((categories) => {
        setCategoryList(categories);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setIsError(true);
      });
  }, []);

  return { categoryList, isLoading, isError };
}
