import { useState, useEffect } from "react";
import { getXLSXForm } from "services/getXLSXForm";

export default function useXLSXForm(url) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [isError, setIsError] = useState(null);

  useEffect(() => {
    setIsLoading(true);

    getXLSXForm(url)
      .then((jsonData) => {
        setData(jsonData);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setIsError(true);
      });
  }, [url]);

  return { data, isLoading, isError };
}
