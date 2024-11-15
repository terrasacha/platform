import React, { useEffect, useState } from 'react'
import { listProperties } from 'utilities/customQueries'
import { API, graphqlOperation } from 'aws-amplify'
import { useParams } from 'react-router';

export default function useFetchPropertiesCampaign() {
    const { id } = useParams();
    const [loading, setLoading] = useState(false)
    const [properties, setProperties] = useState([])
    const [error, setError] = useState(null)

    const fetchProperties = async () => {
        setLoading(true)
        try {
            const result = await API.graphql(graphqlOperation(listProperties, { filter: { campaignID: { eq: id } } }))
            console.log(result)
            setProperties(result.data.listProperties.items)
            setError(null)
        } catch (error) {
            console.error(error)
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) {
            fetchProperties()
        }
    }, [id])

    return { loading, properties, error }
}
