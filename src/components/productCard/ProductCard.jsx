import React from "react";
import s from './ProductCard.module.css'
import * as Icon from 'react-bootstrap-icons';
import IMAGE from '../views/_images/tnc_55933050 1.jpg'
function ProductCard({product, urlS3Image}) {

    return (
      <div className={s.cardContainer}>
        <div className={s.imageContainer}>
            <img 
                src={urlS3Image+product.images.items[0].imageURL} 
                alt={product.name} />
        </div>
            <div className={s.titleContainer}>
                <div className={s.title}>{product.name}</div>
                <div className={s.location}><Icon.GeoAltFill color="#4DBC5E" /><div>742 de Evergreen Terrace | 2.1 ha.</div></div>
            </div>
            <div className={s.infoContainer}>
                <div className={s.price}>
                    <div className={s.text}>PRICE</div>
                    <div className={s.value}>${product.tokenPrice !== undefined? 
                                                    product.tokenPrice.productFeatureResultAssigned? product.tokenPrice.productFeatureResultAssigned : product.tokenPrice.value 
                                                    : '!value'}</div>
                </div>
                <div className={s.tokens}>
                    <div className={s.text}>TOKENS AVAILABLE</div>
                    <div className={s.value}>{product.amountToBuy}</div>
                </div>
            </div>
            <button>BUY TOKENS</button>          
        </div>
    );
  }
  export default ProductCard;