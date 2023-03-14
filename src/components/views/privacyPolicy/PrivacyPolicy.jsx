import React from "react"
import HeaderNavbar from '../Navbars/HeaderNavbar'
import s from './PrivacyPolicy.module.css'
import arrowSteps from '../_images/chevron-forward-outline.svg'

export default function LogIn() {   

  return (
    <>
    <HeaderNavbar></HeaderNavbar>
    <div className={s.container}>
        <div className={s.steps}>
            <ul>
                <li><span>COLECCIÓN DE INFORMACIÓN</span><a href="#t_c"><img src={arrowSteps} className={s.arrowSteps}/></a></li>
                <li><span>NUESTRO USO DE COOKIES</span><a href="#enmienda"><img src={arrowSteps} className={s.arrowSteps}/></a></li>
                <li><span>USO DE SU INFORMACIÓN PERSONAL</span><a href="#uso"><img src={arrowSteps} className={s.arrowSteps}/></a></li>
                <li><span>DIVULGACIÓN DE INFORMACIÓN PERSONAL</span><a href="#disponibilidad"><img src={arrowSteps} className={s.arrowSteps}/></a></li>
                <li><span>ALMACENAMIENTO Y SEGURIDAD DE SU INFORMACIÓN PERSONAL</span><a href="#materiales_uso"><img src={arrowSteps} className={s.arrowSteps}/></a></li>
                <li><span>ACCESO Y CORRECCIÓN</span><a href="#prop_intelectual"><img src={arrowSteps} className={s.arrowSteps}/></a></li>
                <li><span>RETIRO DEL CONSENTIMIENTO</span><a href="#ningun_consejo"><img src={arrowSteps} className={s.arrowSteps}/></a></li>
                <li><span>ENLACES A OTROS SITIOS WEB</span><a href="#enlaces_terceros"><img src={arrowSteps} className={s.arrowSteps}/></a></li>
                <li><span>CAMBIOS FUTUROS</span><a href="#enlaces_web"><img src={arrowSteps} className={s.arrowSteps}/></a></li>
                <li><span>INQUIETUDES Y QUEJAS</span><a href="#acceso"><img src={arrowSteps} className={s.arrowSteps}/></a></li>
                <li><span>CONTÁCTENOS</span><a href="#info_personal"><img src={arrowSteps} className={s.arrowSteps}/></a></li>
            </ul>
        </div>
        <div className={s.containerSteps}>
            <div className={s.titleContainer}>
                <h2 id='t_c'>COLECCIÓN DE INFORMACIÓN</h2>
                <p>Suan recopila principalmente la siguiente información personal:
                </p>
                <ul>
                    <li>
                    Datos personales necesarios para abrir una cuenta en Suan Registry. Esto
incluye nombre, número de teléfono, correo electrónico, cargo del
representante autorizado, administrador de cuenta y contacto de facturación
identificado por un titular de cuenta para su cuenta.
                    </li>
                    <li>
                    Detalles de contacto para comunicaciones con partes interesadas, socios
estratégicos y otras partes relevantes para las actividades de Suan. Esto
incluye nombre, número de teléfono, correo electrónico, cargo de los
representantes de estas partes que se comunicarán con Suan.
                    </li>
                    <li>
                    Si el titular de la cuenta, parte interesada, socio estratégico u otra parte es un
individuo, se pueden recopilar detalles adicionales sobre esa persona, como la
cuenta bancaria y la dirección física y, si corresponde, los detalles necesarios
para realizar comprobaciones de verificación, como la fecha de nacimiento o
emitido por el gobierno. identificador
                    </li>
                    <li>
                    Detalles sobre la actividad en el Registro, como detalles de transacciones que
podrían identificar a una persona.
                    </li>
                    <li>
                    Información personal contenida en las comunicaciones con Suan, incluso a
través del sitio web, durante reuniones cara a cara, correspondencia por
correo electrónico o conversaciones telefónicas. Esto también puede incluir
información personal contenida en informes, encuestas, cuestionarios y
formularios proporcionados a Suan para participar en el Registro de Suan o
aplicar para hacer cosas como usar nuestros logotipos.
                    </li>
                    <li>
                    Información recopilada automáticamente de una visita al sitio web, como la
dirección IP.
                    </li>
                </ul>
                <p>En algunos casos, Suan puede recopilar información personal de alguien que no
sea el individuo en cuestión (por ejemplo, de la persona que abre la cuenta del
titular de la cuenta).Si proporciona a Suan información personal sobre otra
persona, Suan confía en que haya cumplido con todos los consentimientos,
notificaciones y otros requisitos pertinentes para permitir que Suan procese la
información personal para el propósito de recopilación de Suan.
Si no se proporciona a Suan toda la información personal solicitada, es posible
que Suan no pueda registrar un titular de cuenta, proporcionar los servicios y
recursos del Programa Suan solicitados o responder completamente a una
solicitud.</p>
            </div>
            <div className={s.titleContainer}>
                <h2 id="enmienda">NUESTRO USO DE COOKIES</h2>
                <p>Las cookies son piezas de información que un sitio web transfiere al disco duro de
su computadora. La mayoría de los navegadores de Internet están configurados
para aceptar cookies. Suan utiliza cookies para que su uso del sitio web, los
recursos y los servicios sea más conveniente. Las cookies se utilizan, por ejemplo,
para estimar el número total de usuarios del sitio web y determinar los patrones de
tráfico a través del sitio web.
Si no desea recibir cookies, puede configurar su navegador para que rechace las
cookies, pero esto puede afectar su capacidad para aprovechar al máximo los
servicios y recursos del sitio web.
                </p>
            </div>
            <div className={s.titleContainer}>
                <h2 id="uso">USO DE SU INFORMACIÓN PERSONAL</h2>
                <p>Suan utiliza la información personal para los siguientes propósitos:</p>
                <ul>
                <li>
                Operar el Registro Suan, proporcionar los servicios y recursos del Programa
Suan e iniciativas y actividades relacionadas.
                </li>
                <li>
                Emitir, realizar, recopilar, gestionar y analizar informes, cuestionarios y
encuestas y elaborar informes y/o calificaciones en función de las respuestas.
                </li>
                <li>
                Responder a las consultas o solicitudes de información de los interesados.
                </li>
                <li>
                Administrar y mantener el Sitio Web.
                </li>
                <li>
                Mejorar los servicios y recursos de Suan.
                </li>
                <li>
                Para otros fines con su consentimiento o cuando lo permita o exija la ley.
                </li>
            </ul>
            </div>
            <div className={s.titleContainer}>
                <h2 id='disponibilidad'>DIVULGACIÓN DE INFORMACIÓN PERSONA</h2>
                <p>Suan divulga información personal de la siguiente manera:
                </p>
                <ul>
                <li>
                Con el fin de brindar servicios y brindar acceso a los recursos (incluso a través
del sitio web), y para mejorar esos servicios y el acceso, a veces podemos
divulgar información personal a terceros, como afiliados, socios, proveedores
de servicios, contratistas independientes, consultores, almacenamiento de
seguridad del sitio o proveedores de TI, servidores de sitios web y otros socios
de Suan.
                </li>
                <li>
                También podemos compartir y divulgar información anónima y agregada con
fines de investigación y actividades promocionales. Por ejemplo, podemos
divulgar datos agregados de informes de visitantes del sitio web, registros de
eventos, informes completos, cuestionarios y encuestas, y poner dichos datos
a disposición en el sitio web o a través deotros medios.
                </li>
                <li>
                Suan puede divulgar información personal en relación con una venta o
transacción que involucre la totalidad o una parte del negocio a los
representantes de un posible comprador, y cuando así lo exija la ley aplicable.
                </li>
                <li>
                Suan también puede divulgar información personal con su consentimiento o
cuando lo permita o exija la ley.
                </li>
            </ul>
            </div>
            <div className={s.titleContainer}>
            <h2 id="materiales_uso">ALMACENAMIENTO Y SEGURIDAD DE SU INFORMACIÓN PERSONAL</h2>
                <p>Suan se esforzará por tomar todas las medidas razonables para mantener segura
la información del usuario y mantener esta información precisa y actualizada. La
información se almacena en servidores seguros en los XXXXXXXXX que están
protegidos en instalaciones controladas. Exigimos a nuestros empleados y
procesadores de datos que respeten la confidencialidad de cualquier información
personal en poder de Suan.
                </p>
            </div>
            <div className={s.titleContainer}>
                <h2 id="prop_intelectual">ACCESO Y CORRECCIÓN</h2>
                <p>Por favor, asegúrese de que los detalles que nos proporciona se mantengan
actualizados. Cuando proporcionemos instalaciones para actualizar los cambios
en los detalles, utilice esas instalaciones. Además, para solicitar el acceso o la
corrección de la información personal que tenemos, comuníquese con nosotros
utilizando los detalles en la sección Contáctenos a continuación. En algunos
casos, podemos responder que una solicitud no será procesada cuando lo permita
o exija la ley. Incluya suficientes detalles para que podamos entender la naturaleza
de su solicitud. Es posible que necesitemos solicitar información personal para
verificar su identidad.
                </p>
            </div>
            <div className={s.titleContainer}>
                <h2 id="ningun_consejo">RETIRO DEL CONSENTIMIENTO</h2>
                <p>Para retirar cualquier consentimiento proporcionado para que procesemos
información personal, comuníquese con nosotros utilizando los detalles en la
sección Contáctenos a continuación. Si se retira el consentimiento, puede tener
consecuencias, como que ya no podamos proporcionar ciertos servicios o
comunicaciones. Incluso si se retira el consentimiento, aún podemos procesar
información personal donde lo permita o lo exija la ley. Incluya suficientes detalles
para que podamos entender la naturaleza de su solicitud. Es posible que
necesitemos solicitar información personal para verificar su identidad.
                </p>
            </div>
            
            <div className={s.titleContainer}>
                <h2 id="enlaces_terceros">ENLACES A OTROS SITIOS WEB</h2>
                <p>Suan proporciona, a través del sitio web, acceso a sitios web de terceros cuyo
contenido no está controlado por Suan. Estos sitios web vinculados no están bajo
el control de Suan, y no somos responsables del contenido o la conducta de las
organizaciones a las que se accede a través de enlaces a dichos sitios web de
terceros a través del sitio web. Antes de divulgar su información personal en
cualquier sitio web, le sugerimos que examine los términos y condiciones y la
política de privacidad de ese sitio web.
                </p>
            </div>
            <div className={s.titleContainer}>
                <h2 id="enlaces_web">CAMBIOS FUTUROS</h2>
                <p>Suan puede, de vez en cuando, modificar esta Política de privacidad de
Suan. Dichas modificaciones se publicarán en el sitio web y entrarán en vigencia
al menos catorce (14) días después de dicha publicación. Por lo tanto, siga
revisando esta Política de privacidad de Suan para asegurarse de conocer los
términos de la versión actual.
                </p>
            </div>
            <div className={s.titleContainer}>
                <h2 id="acceso">ENLACES A SITIO WEB</h2>
                <p>Si tiene alguna inquietud o queja sobre nuestro procesamiento de su información
personal, incluido nuestro cumplimiento de las leyes de protección de datos
aplicables, comuníquese con nosotros utilizando los detalles en la sección
Contáctenos a continuación. Consideraremos y responderemos con prontitud a los
problemas planteados. Incluya suficientes detalles para que podamos entender la
naturaleza de su inquietud. Es posible que necesitemos solicitar información
personal para verificar su identidad.
                </p>
            </div>
            <div className={s.titleContainer}>
                <h2 id="info_personal">CONTÁCTENOS</h2>
                <p>Se nos puede contactar en relación con asuntos de privacidad, incluido lo
contemplado en esta Política de privacidad de Suan, de la siguiente manera:
Dirección:
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.
Correo electrónico: privacidad@suan.global
                </p>
            </div>
        </div>
    </div>
    </>
  )
}
