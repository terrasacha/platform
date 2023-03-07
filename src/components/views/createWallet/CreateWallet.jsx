import React from "react"
import HeaderNavbar from '../Navbars/HeaderNavbar'
import s from './CreateWallet.module.css'
import image1 from '../_images/paso_B_creacion_wallet.png'
import image2 from '../_images/paso_D_creacion_wallet.png'
import image3 from '../_images/paso_E_creacion_wallet.png'
import image4 from '../_images/paso_F_creacion_wallet.png'
import image5 from '../_images/paso_G_creacion_wallet.png'
import image6 from '../_images/paso_H_creacion_wallet.png'
import image7 from '../_images/paso_I_creacion_wallet.png'
import arrowSteps from '../_images/chevron-forward-outline.svg'

export default function LogIn() {   

  return (
    <>
    <HeaderNavbar></HeaderNavbar>
    <div className={s.container}>
        <div className={s.steps}>
            <ul>
                <li><span>Obtener billetera</span><a href="#obtener_billetera"><img src={arrowSteps} className={s.arrowSteps}/></a></li>
                <li><span>Obtener fondos mínimos</span><a href="#obtener_fondos_minimos"><img src={arrowSteps} className={s.arrowSteps}/></a></li>
                <li><span>Conectar la billetera a la plataforma Suan</span><a href="#conectar_la_billetera"><img src={arrowSteps} className={s.arrowSteps}/></a></li>
            </ul>
        </div>
        <div className={s.containerSteps}>
            <div className={s.titleContainer}>
                <h2 id='obtener_billetera'>Obtener billetera</h2>
                <p>Su billetera en Cardano es la herramienta principal utilizada para interactuar con la Blockchain.
                    En ella, lo más importante son las llaves privadas, que en el caso de la mayoría de billeteras están 
                    representadas por una combinación de palabras o frase de recuperación las cuales deben ser guardadas fuera de línea en un sitio seguro. 
                </p>
                <p>Las billeteras más populares en Cardano son: 
                    <ul>
                        <li><a href="https://eternl.io/" target="_blank" rel="noreferrer">Eternl</a></li>
                        <li><a href="https://gerowallet.io" target="_blank" rel="noreferrer">Gero</a></li>
                        <li><a href="https://namiwallet.io" target="_blank" rel="noreferrer">Nami</a></li>
                        <li><a href="https://yoroi-wallet.com" target="_blank" rel="noreferrer">Yoroi</a></li>
                    </ul>
                    Nuestra plataforma permite la conexión con cualquiera de estas billeteras desde su navegador de preferencia
                     Chrome, Firefox, Brave, Edge o como aplicación de iOS o Android.
                </p>
            </div>
            <ul>
                <li>
                    Descargue y cree la billetera de su preferencia utilizando los links mencionados y siga los pasos intuitivos de instalación.
                </li>
                <li>
                    Una vez instalada la aplicación una ventana similar se visualiza.
                    (Las imágenes están asociadas al proceso de instalación de la billetera Eternl, sin embargo los pasos son muy similares en otras billeteras)
                    <img src={image1} alt =''/>
                </li>
                <li>
                    Asegúrese que en la parte inferior derecha se encuentre en la red adecuada de Cardano (Mainnet) la red principal habilitada por nuestra plataforma. 
                    Así mismo, en la parte superior izquierda, haga click en “Add Wallet”. Puede restaurar una billetera si cuenta con frases de recuperación previamente creadas o 
                    simplemente Crear una nueva en “Create wallet”.
                </li>
                <li>
                    Una vez instalada la aplicación una ventana similar se visualiza.
                    (Las imágenes están asociadas al proceso de instalación de la billetera Eternl, sin embargo los pasos son muy similares en otras billeteras)
                    <img src={image2} alt =''/>
                </li>
                <li>
                    Crear 1 cuenta
                    <img src={image3} alt =''/>
                </li>
                <li>
                    Click en el recuadro de confirmación que explica que cualquier persona que pueda ver o tener acceso a las palabras que van a ser mostradas a continuación podrá acceder a los fondos.
                    <img src={image4} alt =''/>
                </li>
                <li>
                    Anotar las palabras en el órden mostrado y confirmar ya que estas se tienen que confirmar como validación en el paso siguiente. 
                    Se recomienda utilizar siempre una combinación de 24 palabras, opción por defecto en la billetera eternl.
                    <img src={image5} alt =''/>
                </li>
                <li>
                    Una vez ingresadas la aplicación solicita confirmar que se conoce claramente que la única manera de recuperar la billetera en caso de pérdida de la máquina en donde se está creando es a través de estas palabras.
                    Por lo tanto, guarde las palabras en un sitio seguro, preferiblemente fuera de línea e independiente de la máquina actual en donde está creando la billetera. 
                    <img src={image6} alt =''/>
                </li>
                <li>
                    Al confirmar, una billetera nueva es creada con un saldo de cero ADAs en la cuenta. 
                    <img src={image7} alt =''/>
                </li>
            </ul>
            <div className={s.titleContainer}>
                <h2 id="obtener_fondos_minimos">Obtener fondos mínimos</h2>
                <p>La billetera recién creada es el sitio donde se van a guardar sus tokens de inversión. 
                    Cualquier movimiento, o transacción en la blockchain tiene un costo asociado que en el caso de Cardano se paga en la moneda nativa llamada ADA. 
                    Si ya invirtió, como inversionista simplemente recibirá una cantidad de tokens proporcional a su inversión con un número mínimo de ADAs como valor necesario mínimo para mover los tokens durante la transacción inicial. 
                    
                </p>
                <p>
                    Si posteriormente desea mover los tokens ya sea cambiarlos de billetera o venderlos necesitará tener un saldo adicional en ADAs para pagar los fees de transacción. 
                    Existen múltiples opciones para adquirir ADAs a partir de dinero fiduciario en casas de cambio conocidas en línea. Si presenta alguna inquietud en este proceso, por favor contacte a soporte. 
                </p>
            </div>
            <div className={s.titleContainer}>
                <h2 id='conectar_la_billetera'>Conectar la billetera a la plataforma Suan</h2>
                <p>Una vez creada su billetera puede conectarla de forma segura al sitio web de Suan. En este caso, un botón de conectar se encuentra disponible en la parte superior derecha. </p>
            </div>
        </div>
    </div>
    </>
  )
}
