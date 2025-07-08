import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { getProperty } from "utilities/customQueries";

export default function PropertyChatHistory({ propertyId, featureChat }) {
  const [verifications, setVerifications] = useState([]);

  useEffect(() => {
    const fetchVerifications = async () => {
      try {
        const response = await API.graphql(
          graphqlOperation(getProperty, { id: propertyId })
        );

        const property = response.data.getProperty;
        const matchedFeatures = property.propertyFeatures.items.filter(
          (feature) => feature.featureID === featureChat
        );

        const allVerifications = matchedFeatures.flatMap(
          (f) => f.verifications?.items || []
        );

        // Solo las que tienen mensajes
        const verificationsWithComments = allVerifications.filter(
          (v) => v.verificationComments?.items?.length > 0
        );

        setVerifications(verificationsWithComments);
      } catch (error) {
        console.error("❌ Error al cargar historial de chat:", error);
      }
    };

    fetchVerifications();
  }, [propertyId, featureChat]);

  return (
    <div className="space-y-4">
      {verifications.length === 0 ? (
        <p className="text-gray-600 text-sm">No hay historial de mensajes.</p>
      ) : (
        verifications.map((v, index) => (
          <div key={index} className="border rounded-md p-4 bg-gray-50">
            <p className="text-sm text-gray-500 mb-2">
              Verificación ID: {v.id}
            </p>
            {v.verificationComments.items
              .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
              .map((msg, i) => (
                <div
                  key={i}
                  className={`mb-2 p-2 rounded-md ${
                    msg.isCommentByVerifier
                      ? "bg-blue-100"
                      : "bg-gray-200"
                  }`}
                >
                  <p className="text-sm font-medium">
                    {msg.isCommentByVerifier ? "Verificador" : "Propietario"}:
                  </p>
                  <p className="text-sm">{msg.comment}</p>
                  <p className="text-xs text-right text-gray-500">
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
          </div>
        ))
      )}
    </div>
  );
}
