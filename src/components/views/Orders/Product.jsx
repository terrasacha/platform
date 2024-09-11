import React, { useEffect, useState } from 'react'
// Bootstrap
import { useParams } from 'react-router-dom';
import WebAppConfig from '../../common/_conf/WebAppConfig'
// import '@aws-amplify/ui-react/styles.css'
import s from './Product.module.css'
// Util
import HeaderNavbar from '../Navbars/HeaderNavbar';
import { API, graphqlOperation } from 'aws-amplify'
import { getProduct } from '../../../graphql/queries'


function Product() {
    const { id } = useParams();
    const [product, setProduct] = useState('')
    const urlS3Image = WebAppConfig.url_s3_public_images

    
    useEffect(() => {
        const getInfo = async () => {
            const info = await infoProduct();
            setProduct(info.data.getProduct)
        };
        getInfo();
    }, [])
    const infoProduct = async() =>{
        const result = await API.graphql(graphqlOperation(getProduct, {id: id}))
        return result
    }
    return(
        <div className={s.container}>
            <HeaderNavbar ></HeaderNavbar>
            {product !== ''?
              <div className={s.content}>
              <div className={s.mainInfo}>
                  <div className={s.imageContainer}>
                    <img src={urlS3Image+product.images.items[0].imageURL} alt=''/>
                  </div>
                  <div className={s.description}>
                    <h4>Descripción</h4>
                    <p>
                        {product.description}
                    </p>
                  </div>
              </div>
              <div className={s.summary}>
                  <h4 className={s.summaryTitle}>Información</h4>
                  <ul>
                      <li>
                          <h5>NOMBRE</h5>
                          <p>{product.name}</p>
                      </li>
                      {product.productFeatures?.items.map(pf =>{
                        if(pf.featureID === 'fecha_inscripcion'){
                            let date = Date(pf.value)
                            date = date.split(' ')
                            pf.value = `${date[2]}/${date[1]}/${date[3]}`
                        }   
                          return(
                              <li key={pf.id}>
                                  <h5>{pf.featureID}</h5>
                                  <p>{pf.value}</p>
                              </li>
                          )
                      })}
                  </ul>
              </div>
          </div> 
             :''}
           
        </div>
    )
}
export default Product;