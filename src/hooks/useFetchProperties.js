import React, { useEffect, useState } from 'react';
import { listProperties } from 'utilities/customQueries';
import { API, graphqlOperation } from 'aws-amplify';

export default function useFetchProperties() {
    const [isLoading, setIsLoading] = useState(false);
    const [properties, setProperties] = useState([]);
    const [error, setError] = useState(null);

    const fetchProperties = async () => {
        setIsLoading(true);
        try {
            const result = await API.graphql(graphqlOperation(listProperties));
              
            setProperties(result.data.listProperties.items); 
            setError(null);
        } catch (error) {
            console.error(error);
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() =>{
        fetchProperties()
    },[])

    return { isLoading, properties, error, fetchProperties };
}
