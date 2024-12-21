import React, { useEffect, useState } from 'react';
import { listProperties } from 'utilities/customQueries';
import { API, graphqlOperation } from 'aws-amplify';
import { useParams } from 'react-router';
import { useProjectData } from 'context/ProjectDataContext'
export default function useFetchPropertiesProject() {
    const { projectData } = useProjectData()
    const [loading, setLoading] = useState(false);
    const [properties, setProperties] = useState([]);
    const [error, setError] = useState(null);

    const fetchProperties = async () => {
        setLoading(true);
        console.log(projectData.projectInfo.id, 'projectData.projectInfo.id')
        try {
            const result = await API.graphql(graphqlOperation(listProperties, {
                filter: {
                  productID: { eq: projectData.projectInfo.id },
                  status: { eq: 'APPROVED' }
                }
              }));
              
            console.log(result.data.listProperties.items, 'useFetchProperties')
            setProperties(result.data.listProperties.items); 
            setError(null);
        } catch (error) {
            console.error(error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() =>{
        fetchProperties()
    },[])

    return { loading, properties, error, fetchProperties };
}
