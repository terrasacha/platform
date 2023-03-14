import React from "react"
import HeaderNavbar from '../Navbars/HeaderNavbar'
import s from './UseTerms.module.css'
import arrowSteps from '../_images/chevron-forward-outline.svg'

export default function UseTerms() {   

  return (
    <>
    <HeaderNavbar></HeaderNavbar>
    <div className={s.container}>
        <div className={s.steps}>
            <ul>
                <li><span>CONOCE TUS DERECHOS AQUÍ</span><a href="#t_c"><img src={arrowSteps} className={s.arrowSteps}/></a></li>
                <li><span>TRATAMIENTO Y FINALIDAD</span><a href="#enmienda"><img src={arrowSteps} className={s.arrowSteps}/></a></li>
            </ul>
        </div>
        <div className={s.containerSteps}>
            <div className={s.titleContainer}>
                <h2 id='t_c'>CONOCE TUS DERECHOS AQUÍ</h2>
                <p>El equipo de  SUAN GLOBAL como responsable del tratamiento de datos personales te da la bienvenida a su sitio web (en adelante, La Plataforma) para que puedas hacer uso de nuestros productos y servicios.

SUAN GLOBAL es una empresa localizada en la XXXXX, XXXXXX, Colombia, que está identificada con el NIT XXXXXX. Para cualquier inquietud el correo electrónico XXXXX está disponible para atender toda duda que pueda surgir.


DERECHOS DEL TITULAR


Todos los Titulares de la información que han entregado a SUAN GLOBAL tendrán los siguientes derechos:
                </p>
                <ul>
                    <li>
                    Ser informado sobre el tratamiento y finalidad por la que va a ser usada la información, la cual se encuentra en este documento.
                    </li>
                    <li>
                    Conocer, actualizar y rectificar sus datos personales frente a SUAN GLOBAL. Este derecho se puede ejercer, entre otros, frente a datos parciales, incompletos o inexactos, que induzcan al error, o aquellos cuyo tratamiento esté expresamente prohibido por la ley 1581 de 2012 referidos en la presente Política de Datos.

                    </li>
                    <li>
                    Solicitar prueba de la autorización otorgada para el tratamiento de sus datos personales, salvo cuando expresamente se exceptúa como requisito para el Tratamiento, de conformidad con lo previsto en el artículo 10 de la ley 1281 de 2012.

                    </li>
                    <li>
                    Solicitar información a SUAN GLOBAL sobre el tratamiento y uso de sus datos, la cual se encuentra impresa en esta Política de Datos.
                    </li>
                    <li>
                    Presentar cualquier petición, queja, reclamo o sugerencia respecto al tratamiento de sus datos personales, la cual será atendida por los canales dispuestos en estas Política de Datos

                    </li>
                    <li>
                    Presentar ante la Superintendencia de Industria y Comercio quejas por infracciones a lo dispuesto en la ley 1581 de 2012 y sus respectivas normas complementarias.

                    </li>
                    <li>
                    Revocar la autorización del uso de los datos, en cualquier momento o cuando en el tratamiento no se respeten los principios, derechos y garantías constitucionales y legales. La revocatoria procederá cuando la Superintendencia de Industria y Comercio haya determinado que el incumplimiento de la ley 1581 de 2012.
                    </li>
                    <li>
                    Acceder en forma gratuita a sus datos personales que hayan sido objeto de tratamiento por parte de SUAN GLOBAL

                    </li>
                    <li>
                    Abstenerse de responder las preguntas sobre datos sensibles o sobre datos de las niñas, niños y adolescentes.
                    </li>
                    <li>
                    Acceder gratuitamente a la información visual tratada mediante sistemas de video vigilancia
                    </li>
                    <li>
                    Solicitar la supresión de la información, excepto en los casos que dicha información recolectada constituya prueba de la presunta comisión de un delito.
                    </li>
                </ul>
            </div>
            <div className={s.titleContainer}>
                <h2 id="enmienda">TRATAMIENTO Y FINALIDAD</h2>
                <p>El tratamiento que realizará SUAN GLOBAL. con la información y datos personales será la siguiente: La recolección, almacenamiento, actualización, transmisión, transferencia, utilización y cualquier otro tipo de tratamiento para:
                </p>
                <ul>
                <li>
                Desarrollar relaciones comerciales con SUAN GLOBAL

                </li>
                <li>
                Efectuar las gestiones pertinentes para el desarrollo del objeto social de la compañía en lo que tiene que ver con el cumplimiento del objeto de la presentación de servicios con el Titular de la información.

                </li>
                <li>
                Contactar al Titular a través de medios telefónicos, correo electrónico o cualquier medio de comunicación para la confirmación de datos personales necesarios para la ejecución de una relación contractual y/o relación comercial.

                </li>
                <li>
                Contactar al Titular a través de correo electrónico para el envío de estados de cuenta o facturas en relación con las obligaciones derivadas de la relación comercial y/o el contrato celebrado entre las partes.

                </li>
                <li>
                Contactar al Titular a través de medio telefónicos, cualquier tipo de mensajería, por medios físicos o electrónicos y correo electrónico, para enviar y recibir la información pertinente para la correcta ejecución de los contratos celebrados con el Titular.

                </li>
                <li>
                Suministrar la información a terceros con los cuales SUAN GLOBAL tenga relación contractual y que sea necesario entregársela para el cumplimiento del objeto contratado con el Titular.
                </li>
                <li>
                Realizar invitaciones a eventos y ofrecer nuevos productos y servicios.
                </li>
                <li>
                Gestionar trámites (solicitudes, quejas, reclamos). De acuerdo a la ley 1581 de 2012
                </li>
                <li>
                Efectuar encuestas de satisfacción respecto de los bienes y servicios ofrecidos por SUAN GLOBAL
                </li>
                <li>
                Ofrecer y dar mayor seguridad y seguimiento de las actividades realizadas dentro del establecimiento de comercio, en el caso de los datos recolectados por las cámaras de video vigilancia.
                </li>
                <li>
                Prestar un mejor y atento servicio basado en los datos sensibles suministrados, para evitar cualquier circunstancia que pueda afectar al Titular como cliente del servicio prestado.

                </li>
                <li>
                Los datos de menores son recolectados para dar seguimiento a los productos adquiridos para ellos mismos o terceros. En todo caso no serán almacenados y solo serán usados para este fin.
                </li>
                <li>
                Consultar en las centrales de riesgo los datos e información relevante para hacer los estudios de riesgo respectivos a la relación jurídica que se esté celebrando o pueda celebrar en un futuro.
                </li>
                <li>
                Reportar en las centrales de riesgo los cumplimientos e incumplimientos de las obligaciones que los Titulares de la información tengan con la empresa.
                </li>
                <li>
                Suministrar a las centrales de riesgo información pertinente a las relaciones comerciales.
                </li>
            </ul>
            </div>
        </div>
    </div>
    </>
  )
}
