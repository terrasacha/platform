import React, { useEffect, useState } from 'react';
import NewHeaderNavbar from 'components/common/NewHeaderNavbar';
import { useNavigate, useParams } from 'react-router';
import Card from 'components/common/Card';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import { getCampaign } from 'graphql/queries';
import { FiEdit3 } from "react-icons/fi";
export default function Campaign() {
  const [campaign, setCampaign] = useState(null);
  const [editable, setEditable] = useState(false)
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    API.graphql(graphqlOperation(getCampaign, { id: id }))
      .then(data =>{ 
        setCampaign(data.data.getCampaign)
        return data.data.getCampaign.userID
      })
      .then(id => {return isAuthor(id)})
      .then(data => setEditable(data))
  }, []);
  const isAuthor = async(id) =>{
    try {
      const userLogged = await Auth.currentAuthenticatedUser()

      if(userLogged.attributes.sub === id){
        return true
      }else{
        return false
      }
    } catch (error) {
      console.error(error)
      return false
    }
  }
  if (!campaign) return null;

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
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
              <h1 className='m-0 text-[2.5rem] font-bold flex'>{campaign.name} {editable && <FiEdit3 className='text-2xl ml-2 cursor-pointer'/>}</h1>
              <p className='text-lg font-medium text-gray-500'>Hasta {formatDate(campaign.endDate)}</p>
              <p className='text-md text-gray-500'>{campaign.description}</p>
              <button className='bg-green-600 py-3 text-md font-medium text-white rounded-md w-3/6 active:bg-green-700'>
                Postular predio
              </button>
            </section>
          </article>
          <h2 className='text-2xl text-gray-600'>Predios postulados</h2>
        </Card.Body>
      </Card>
    </div>
  );
}
