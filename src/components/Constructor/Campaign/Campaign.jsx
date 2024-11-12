import React, { useEffect, useState } from 'react';
import NewHeaderNavbar from 'components/common/NewHeaderNavbar';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate, useParams } from 'react-router';
import Card from 'components/common/Card';
import { API, graphqlOperation } from 'aws-amplify';
import { getCampaign } from 'graphql/queries';

export default function Campaign() {
  const [campaign, setCampaign] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    API.graphql(graphqlOperation(getCampaign, { id: id }))
      .then(data => setCampaign(data.data.getCampaign));
  }, []);

  if (!campaign) return null;

  // Convertir el timestamp a una fecha en formato "dd de mes de año"
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000); // Multiplicamos por 1000 porque el timestamp está en segundos
    return date.toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="container-sm">
      <div className="mb-24">
        <NewHeaderNavbar />
      </div>
      <Card>
        <Card.Body>
          <article className='flex w-full'>
            <img src={JSON.parse(campaign.images)[0]} alt='campaign image' className='w-1/2'/>
            <section className='w-1/2 px-4 py-2 text-gray-700 h-full'>
              <h1 className='text-[3rem] font-bold'>{campaign.name}</h1>
              <p className='text-xl font-medium text-gray-500'>Hasta {formatDate(campaign.endDate)}</p>
              <p className='text-lg text-gray-500'>{campaign.description}</p>
              <button className='bg-green-600 py-3 text-xl font-medium text-white rounded-md w-8/12 active:bg-green-700'>
                Postular predio
              </button>
            </section>
          </article>
          <h2 className='text-2xl text-gray-600'>Predios postulados</h2>
        </Card.Body>
      </Card>
      <ToastContainer />
    </div>
  );
}
