import React from "react";
import s from './ProductCard.module.css'
import * as Icon from 'react-bootstrap-icons';
import IMAGE from '../views/_images/tnc_55933050 1.jpg'
function ProductCard({product, urlS3Image}) {

    let periodoP = product.productFeatures.items.filter(pf => pf.feature.id === "periodo_permanencia")
    let ubicacion = product.productFeatures.items.filter(pf => pf.feature.id === "ubicacion")
    return (
        <div className={s.cardContainer}>
            <div className={s.infoContainer}>
                <div className={s.titleContainer}>
                    <div className={s.title}>{product.name}</div>
                    <div className={s.location}><Icon.GeoAltFill color="#4DBC5E" /><div>{ubicacion[0].value}</div></div>
                </div>
                <div className={s.description}>
                    {product.description}
                </div>
                <div className={s.info}>
                    <div className={s.infoProduct}>
                        <div className={s.text}>CATEGORÍA</div>
                        <div className={s.value}>{product.category.name}</div>
                    </div>
                    <div className={s.infoProduct}>
                        <div className={s.text}>PERIODO DE PERMANENCIA</div>
                        <div className={s.value}>{periodoP[0].value} años</div>
                    </div>
                    <div className={s.tokensInfo}>
                        <div className={s.infoProduct}>
                            <div className={s.textTokensInfo}>PRECIO</div>
                                <div className={s.valueTokensInfo}>${product.tokenPrice !== undefined? 
                                                                product.tokenPrice.productFeatureResultAssigned? product.tokenPrice.productFeatureResultAssigned : product.tokenPrice.value 
                                                                : '12.77'}</div>
                            </div>
                            <div className={s.infoProduct}>
                                <div className={s.textTokensInfo}>TOKENS DISPONIBLES</div>
                                <div className={s.valueTokensInfo}>{/* {product.amountToBuy} */} 12</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={s.imageContainer}>
                <img 
                src={urlS3Image+product.images.items[0].imageURL} 
                alt={product.name} />
            </div>
        </div>
        );
    }
    export default ProductCard;
/*  <div className={s.cardContainer}>
      <div className={s.imageContainer}>
          <img 
              src={urlS3Image+product.images.items[0].imageURL} 
              alt={product.name} />
      </div>
      <div className={s.infoContainer}>
          <div className={s.titleContainer}>
              <div className={s.title}>{product.name}</div>
              <div className={s.location}><Icon.GeoAltFill color="#4DBC5E" /><div>742 de Evergreen Terrace | 2.1 ha.</div>{product.category.name}</div>
          </div>
          <div className={s.info}>
              <div className={s.price}>
                  <div className={s.text}>PRICE</div>
                  <div className={s.value}>${product.tokenPrice !== undefined? 
                                                  product.tokenPrice.productFeatureResultAssigned? product.tokenPrice.productFeatureResultAssigned : product.tokenPrice.value 
                                                  : '12.77'}</div>
              </div>
              <div className={s.tokens}>
                  <div className={s.text}>TOKENS AVAILABLE</div>
                  <div className={s.value}>{product.amountToBuy}</div>
              </div>
          </div>
          <button>BUY TOKENS</button>
      </div>          
      </div> */