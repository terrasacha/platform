import React from "react"
import HeaderNavbar from '../Navbars/HeaderNavbar'
import s from './TermCondition.module.css'
import arrowSteps from '../_images/chevron-forward-outline.svg'

export default function LogIn() {   

  return (
    <>
    <HeaderNavbar></HeaderNavbar>
    <div className={s.container}>
        <div className={s.steps}>
            <ul>
                <li><span>TÉRMINOS Y CONDICIONES DE USO</span><a href="#t_c"><img alt='' src={arrowSteps} className={s.arrowSteps}/></a></li>
                <li><span>ENMIENDA</span><a href="#enmienda"><img alt='' src={arrowSteps} className={s.arrowSteps}/></a></li>
                <li><span>SU USO DEL SITIO WEB</span><a href="#uso"><img alt='' src={arrowSteps} className={s.arrowSteps}/></a></li>
                <li><span>DISPONIBILIDAD DEL SITIO WEB</span><a href="#disponibilidad"><img alt='' src={arrowSteps} className={s.arrowSteps}/></a></li>
                <li><span>MATERIALES DEL SITIO WEB</span><a href="#materiales_uso"><img alt='' src={arrowSteps} className={s.arrowSteps}/></a></li>
                <li><span>PROPIEDAD INTELECTUAL</span><a href="#prop_intelectual"><img alt='' src={arrowSteps} className={s.arrowSteps}/></a></li>
                <li><span>NINGÚN CONSEJO</span><a href="#ningun_consejo"><img alt='' src={arrowSteps} className={s.arrowSteps}/></a></li>
                <li><span>ENLACES A SITIOS WEB DE TERCEROS</span><a href="#enlaces_terceros"><img alt='' src={arrowSteps} className={s.arrowSteps}/></a></li>
                <li><span>ENLACES A SITIO WEB</span><a href="#enlaces_web"><img alt='' src={arrowSteps} className={s.arrowSteps}/></a></li>
                <li><span>ACCESO</span><a href="#acceso"><img alt='' src={arrowSteps} className={s.arrowSteps}/></a></li>
                <li><span>INFORMACIÓN PERSONAL</span><a href="#info_personal"><img alt='' src={arrowSteps} className={s.arrowSteps}/></a></li>
                <li><span>SIN GARANTÍA</span><a href="#sin_garantia"><img alt='' src={arrowSteps} className={s.arrowSteps}/></a></li>
                <li><span>ACCESO</span><a href="#acceso"><img alt='' src={arrowSteps} className={s.arrowSteps}/></a></li>
                <li><span>RESPONSABILIDAD</span><a href="#responsabilidad"><img alt='' src={arrowSteps} className={s.arrowSteps}/></a></li>
                <li><span>GENERAL</span><a href="#general"><img alt='' src={arrowSteps} className={s.arrowSteps}/></a></li>
                <li><span>CONTÁCTENOS</span><a href="#contacto"><img alt='' src={arrowSteps} className={s.arrowSteps}/></a></li>
            </ul>
        </div>
        <div className={s.containerSteps}>
            <div className={s.titleContainer}>
                <h2 id='t_c'>TÉRMINOS Y CONDICIONES DE USO</h2>
                <p>Este documento describe los términos generales y condiciones
                    aplicables al uso de los contenidos y servicios disponibles y
                    ofertados a través de la sede electrónica ubicada en el link
                     <a href="https://suan.global/"> suan.global</a> (sitio web) del cual es propiedad y
                    está operado por Suan Global, identificada con NIT xxxxxxx y
                    cuyo domicilio se encuentra en XXXXXXXXXXXXXXX, Colombia.
                    Estos términos y condiciones de uso ( Términos y condiciones )
                    son entre Suan y usted como usuario del sitio web (usted y/o su) y
                    rigen su uso del sitio web.
                    Lea estos Términos y condiciones detenidamente antes de
                    continuar. El uso del sitio web se le ofrece con la condición de
                    que acepte estos Términos y condiciones. Al acceder al sitio web,
                    usted acepta estar sujeto a estos Términos y condiciones.
                    Al acceder al sitio web, también acepta estar sujeto a la Política
                    de Protección de Datos de Suan ( Política de Privacidad )
                    publicada en el siguiente en el enlace xxxxxxxxxxxxxx y
                    actualizada por Suan periódicamente.
                    Si no está de acuerdo con estos Términos y condiciones o la
                    Política de privacidad, debe dejar de usar el sitio web de
                    inmediato.
                </p>
            </div>
            <div className={s.titleContainer}>
                <h2 id="enmienda">ENMIENDA</h2>
                <p>Suan Global puede modificar estos Términos y condiciones y/o la
                    Política de privacidad en cualquier momento, y todas las
                    modificaciones entrarán en vigencia inmediatamente después de
                    la publicación de los Términos y condiciones y/o la Política de
                    privacidad modificados en el sitio web.
                </p>
                <p>
                    Usted es responsable de revisar regularmente estos Términos y
                    condiciones y/o la Política de privacidad y su uso continuado del
                    sitio web constituye su aceptación de todos los términos y
                    condiciones y/o la política de privacidad modificados. 
                </p>
            </div>
            <div className={s.titleContainer}>
                <h2 id="uso">SU USO DEL SITIO WEB</h2>
                <p>Subir o enviar cualquier contenido que sea o pueda ser
                    considerado material que:</p>
                <ul>
                <li>
                    es ilegal, abusivo, acosador, amenazante, difamatorio,
                    ofensivo, humillante, vulgar, obsceno, pornográfico,
                    racista, discriminatorio o invasivo de la privacidad de otra
                    persona;
                </li>
                <li>
                contiene plagio, infringe la propiedad intelectual de otra
parte y/o no esde su propiedad;
                </li>
                <li>
                es falso o engañoso y/o contraviene o puede contravenir
cualquier ley, reglamento, código o norma aplicable ;
                </li>
                <li>
                constituya contenido delictivo o contenido que pueda
alentar cualquier actividad delictiva o quede otro modo
constituya una base para procedimientos legales;
                </li>
                <li>
                perturbe o dañe el sitio web o los bienes y/o servicios
ofrecidos por Suan y/ocause cualquier daño a Suan o a un
tercero; y/o
                </li>
                <li>
                incumple los Términos y Condiciones;
                </li>
                <li>
                Transmitir publicidad no solicitada o no autorizada, materiales
promocionales, spam o materiales similares; o
                </li>
                <li>
                Suplantar a cualquier persona o entidad o tergiversar su
afiliación con una persona o entidad. 
                </li>
                <li>
                    Al confirmar, una billetera nueva es creada con un saldo de cero ADAs en la cuenta. 
                </li>
            </ul>
            </div>
            <div className={s.titleContainer}>
                <p>No violará ni intentará violar la seguridad del sitio web. No
pirateará el sitio web, los sistemas informáticos de Suan o los
sistemas informáticos de otros usuarios del sitio web. Hackear significa acceso no autorizado, daño malicioso y/o interferencia e
incluye, sin limitación, bombardeo de correo, propagación de
virus, gusanos u otros tipos de programas maliciosos, intentos
deliberados de sobrecargar un sistema informático, ataques de
difusión o cualquier otro método diseñado para dañar o interferir.
con el funcionamiento de un sistema informático o sitio web.
                </p>
                <p>
                Usted es el único responsable de la seguridad de todos los
nombres de usuario y contraseñas que utilice para acceder al sitio
web y realizar cualquier transacción disponible a través del sitio
web. Suan no será responsable de ningún acceso no autorizado
al sitio web o del mal uso de los nombres de usuario o
contraseñas. Debe notificar a Suan sobre cualquier cambio en el
nombre de usuario o contraseña, cualquier acceso no autorizado
sospechado o real a un nombre de usuario o contraseña y si una
persona ya no tiene derecho a usar un nombre de usuario o
contraseña.
Suan se reserva el derecho de cancelar el nombre de usuario o
la contraseña de una persona en cualquier momento.
                </p>
            </div>
            <div className={s.titleContainer}>
            <h2 id="disponibilidad">DISPONIBILIDAD DEL SITIO WEB</h2>
                <p>Se permite el acceso al Sitio Web de forma temporal. Suan puede
modificar, suspender, descontinuar o variar el sitio web en
cualquier momento a su absoluta discreción. Como tal, de vez en
cuando el sitio web, o algunas partes del sitio web, pueden no
estar disponibles para el acceso o uso. Suan trabajará dentro de
lo razonable para limitar la cantidad de tiempo que el sitio web no
está disponible. Suan no se hace responsable de las
consecuencias de la falta de disponibilidad del sitio web, o parte
del mismo. 
Suan puede modificar, suspender, descontinuar o variar el sitio
web en cualquier momento a su absoluta discreción.
                </p>
            </div>
            <div className={s.titleContainer}>
                <h2 id="materiales_uso">MATERIALES DEL SITIO WEB</h2>
                <p>El sitio web puede contener productos, servicios, información,
texto, gráficos, materiales, software (incluido el software de
terceros) y otro contenido ( materiales del sitio web ).
El sitio web y los materiales del sitio web se proporcionan; tal
cual y según disponibilidad, y Suan no hace representaciones
ni garantías de ningún tipo con respecto a la información y los
materiales contenidos en el sitio web y/o los materiales del sitio
web, incluidas, entre otras, las garantías de título. , no infracción,
comerciabilidad o idoneidad para un propósito particular.
                </p>
            </div>
            <div className={s.titleContainer}>
                <h2 id="prop_intelectual">PROPIEDAD INTELECTUAL</h2>
                <p>A menos que se indique lo contrario, todos los derechos de
propiedad intelectual en el sitio web y los materiales del sitio web
son propiedad de Suan o de otras partes que han otorgado la
licencia de su material a Suan o publicado su material en el sitio
web. Esos derechos de propiedad intelectual en el sitio web y los
materiales del sitio web están protegidos por leyes y tratados de
derechos de autor y propiedad intelectual en todo el mundo.
Se prohíbe la reproducción de parte o la totalidad del contenido
en cualquier forma del sitio web o de los materiales del sitio web,
excepto para uso individual, y no se puede volver a copiar ni
compartir con un tercero. El permiso para volver a copiar por parte
de un individuo no permite la incorporación del Material del sitio
web o cualquier parte del mismo en ningún trabajo o publicación,
ya sea en copia impresa, electrónica o de cualquier otra forma. No
debe modificar las copias en papel o digitales de ningún Material
del sitio web que haya impreso o descargado de ninguna manera,
y no debe usar ilustraciones, fotografías, secuencias de video o
audio o gráficos por separado del texto que lo acompaña. No
debe usar ninguna parte del sitio web o los materiales del sitio
web con fines comerciales sin obtener una licencia para hacerlo
de Suan o los licenciantes de Suan.
Si imprime, copia o descarga cualquier parte del sitio web o los
materiales del sitio web en incumplimiento de estos Términos y
condiciones, su derecho a usar el sitio web cesará de inmediato y
deberá, a discreción de Suan, devolver o destruir cualquier copia
del sitio web o del sitio web. Materiales que has hecho.
Todos los derechos no otorgados expresamente en estos
Términos y condiciones están reservados.
                </p>
            </div>
            
            <div className={s.titleContainer}>
                <h2 id="ningun_consejo">NINGÚN CONSEJO</h2>
                <p>El Material del sitio web está destinado a la orientación y el
                    conocimiento generales, y no debe interpretarse como
                    asesoramiento financiero, legal o de otro tipo, ni debe
                    considerarse como una oferta o una solicitud de una oferta para
                    comprar, vender o negociar de otra manera, cualquier
                    inversión. Usted no puede utilizar el Material del sitio web ni
                    generar en base al Material del sitio web ningún consejo,
                    recomendación, guía, publicación o alerta para clientes o
                    terceros. Suan renuncia expresamente a toda responsabilidad
                    que surja de la confianza depositada en los Materiales del sitio
                    web por usted o cualquier visitante del sitio web, o por cualquier
                    persona que pueda estar informada de cualquiera de sus
                    contenidos.
                </p>
            </div>
            <div className={s.titleContainer}>
                <h2 id="enlaces_terceros">ENLACES A SITIOS WEB DE TERCEROS</h2>
                <p>El Sitio Web contiene enlaces a sitios web de terceros (Sitios
Enlazados). Estos enlaces se le proporcionan para su
conveniencia únicamente para su información, y Suan no es
responsable del contenido de ningún Sitio enlazado. Suan no
tiene control sobre el contenido de esos sitios web o recursos, y
no acepta ninguna responsabilidad por ellos o por cualquier
pérdida o daño que pueda surgir de su uso de ellos. Además, un
enlace a cualquier sitio web que no sea de Suan no implica que
Suan respalde o acepte ninguna responsabilidad por el contenido
o el uso de dicho sitio web.

BORRADOR PARA REVISIÓN DEL ÁREA JURÍDICA DE LA SUAN GLOBAL

Usted accede a los Sitios vinculados bajo su propio riesgo y, en la
máxima medida permitida por la ley, Suan renuncia a todas las
garantías, expresas e implícitas, en cuanto a la precisión, el valor,
la legalidad o cualquier otro material o información contenida en
dichos Sitios vinculados.
                </p>
            </div>
            <div className={s.titleContainer}>
                <h2 id="enlaces_web">ENLACES A SITIO WEB</h2>
                <p>Puede vincular a la página de inicio del sitio web únicamente,
siempre que lo haga de manera justa y legal y no dañe la
reputación de Suan ni se aproveche de ella, pero no debe
establecer un enlace de tal manera que sugiera cualquier forma.
de asociación, aprobación o respaldo de nuestra parte donde no
exista. No debe establecer un enlace desde ningún sitio web que
no sea de su propiedad. Suan se reserva el derecho de retirar el
permiso de vinculación sin previo aviso. El sitio web no debe estar
enmarcado en ningún otro sitio.
                </p>
            </div>
            <div className={s.titleContainer}>
                <h2 id="acceso">ACCESO</h2>
                <p>Usted reconoce que los códigos de acceso y las contraseñas de
inicio de sesión que se le proporcionan son para su uso exclusivo
y no se pueden compartir. Deberá asegurarse de que su código
de acceso y contraseña de inicio de sesión se mantengan
confidenciales. Usted acepta aceptar la responsabilidad exclusiva
por el uso y la protección de los códigos de acceso de inicio de
sesión y las contraseñas que se le proporcionen, incluida la
protección de la confidencialidad de dichas contraseñas. Deberá
hacer todos los esfuerzos comercialmente razonables para
prohibir o detener cualquier acceso no autorizado al sitio web o al
material del sitio web.
                </p>
            </div>
            <div className={s.titleContainer}>
                <h2 id="info_personal">INFORMACIÓN PERSONAL</h2>
                <p>La seguridad de su información personal es importante para
Suan. Cuando ingresa información confidencial, Suan cifra esa

BORRADOR PARA REVISIÓN DEL ÁREA JURÍDICA DE LA SUAN GLOBAL

información utilizando tecnología de capa de conexión segura
(SSL). Suan sigue los estándares de la industria generalmente
aceptados para proteger la información personal que se le envía,
tanto durante la transmisión como una vez que Suan la
recibe. Suan procesa información sobre usted de acuerdo con
nuestra Política de privacidad. Al utilizar el sitio web, acepta dicho
procesamiento y garantiza que todos los datos proporcionados
por usted son precisos.
                </p>
            </div>
            <div className={s.titleContainer}>
                <h2 id="sin_garantia">SIN GARANTÍA</h2>
                <p>Sin limitar lo anterior, Suan no garantiza la precisión, puntualidad,
integridad, confiabilidad o disponibilidad del sitio web, los
materiales del sitio web o la información o los resultados
obtenidos del uso del sitio web, o que el sitio web esté libre de
virus o errores. Suan no tiene la obligación de auditar, validar o
verificar de otro modo la información contenida en el sitio web,
incluidos los materiales del sitio web.
                </p>
            </div>
            <div className={s.titleContainer}>
                <h2 id="responsabilidad">RESPONSABILIDAD</h2>
                <p>Suan no será responsable de ninguna pérdida o daño causado
por un ataque de denegación de servicio distribuido, virus u otro
material tecnológicamente dañino que pueda infectar su equipo
informático, programas informáticos, datos u otro material
patentado debido a su uso de este sitio web o a su descarga de
cualquier material publicado en él, o en cualquier sitio web
vinculado a él.
El sitio web y el material del sitio web se proporcionan sin ninguna
garantía, condición o garantía en cuanto a su precisión. En la
medida permitida por la ley, Suan excluye expresamente:
                </p>
                <ul>
                <li>
                Todas las condiciones, garantías y otros términos que de otro
modo podrían estar implícitos por ley, derecho consuetudinario
o ley de equidad; y
                </li>
                <li>
                Cualquier responsabilidad por cualquier pérdida o daño
directo, indirecto o consecuente incurrido por cualquier usuario
en relación con nuestro sitio o en relación con el uso, la
incapacidad de uso o los resultados del uso del sitio web,
cualquier sitio web vinculado a él y cualquier material
publicado en él, incluida la pérdida de ingresos o
ganancias; pérdida de negocio; lucro cesante o de
contratos; pérdida de ahorros anticipados; pérdida de
datos; pérdida de buena voluntad; tiempo de gestión o de
oficina desperdiciado; y ya sea causado por agravio
(incluyendo negligencia), incumplimiento de contrato o de otra
manera, incluso si es previsible.
                </li>
            </ul>
            <p>
            Esto no afecta la responsabilidad de Suan por muerte o lesiones
personales que surjan de la negligencia de Suan, ni la
responsabilidad de Suan por tergiversación fraudulenta, ni
ninguna otra responsabilidad que no pueda excluirse o limitarse
según la ley aplicable.
Usted indemniza y libera a Suan de cualquier reclamo en relación
con los servicios que brinda en virtud de estos Términos y
condiciones, excepto en la medida en que dichos reclamos surjan
por culpa o negligencia de Suan (incluido el incumplimiento por
parte de Suan de cualquier requisito legal).
Usted acepta indemnizar, liberar y compensar por completo a
Suan y licenciantes de responsabilidades, pérdidas, daños,
costos y gastos razonables (incluidos, entre otros, gastos legales
razonables sobre una base razonable) y sanciones incurridas o
sufridas. por cualquiera de ellos derivados de:
            </p>
            <ul>
                <li>
                Su incumplimiento material de los Términos y Condiciones;
                </li>
                <li>
                Cualquier mal uso o uso de los Materiales del sitio web; y
                </li>
                <li>
                Cualquier acto de fraude o mala conducta deliberada por parte
de usted o en su nombre.
                </li>
            </ul>
            <p>
            Usted reconoce y acepta que el uso no autorizado de los
Materiales del sitio web por su parte podría causar a Suan (o a
sus terceros proveedores o licenciantes) un daño irreparable y
que, en caso de uso no autorizado, Suan tiene derecho a solicitar
una orden judicial para evitar dicho uso, en además de cualquier
otro recurso disponible en derecho o en equidad.
            </p>
            </div>
            <div className={s.titleContainer}>
                <h2 id="general">GENERAL</h2>
                <p>No puede ceder sus derechos u obligaciones en virtud de estos
Términos y condiciones sin el consentimiento previo por escrito de
Suan. Suan podrá ceder sus derechos y obligaciones en cualquier
momento.
Nada en estos Términos y Condiciones crea una relación de
principal/agente, empleador/empleado, empresa conjunta o
sociedad. Es la intención expresa de Suan y de usted que se
nieguen expresamente dichas relaciones.
Estos Términos y condiciones y la Política de Privacidad registran
el acuerdo completo entre Suan y Usted con respecto a su objeto.
Las obligaciones de compensar las pérdidas sufridas por Suan y
sus funcionarios, empleados y agentes en los Términos y
Condiciones son:
                </p>
                <ul>
                    <li>Obligaciones continuas de las partes, separadas e
independientes de sus otras obligaciones y que sobrevivan a
la terminación de los Términos y Condiciones; y</li>
                    <li>Absoluta e incondicional e inalterable de cuanto pueda tener
por efecto perjudicar, liberar, descargar o afectar de cualquier
otro modo la responsabilidad del obligadoa indemnizar.</li>
                </ul>
                Si alguna parte de estos Términos y condiciones fuera declarada
o inaplicable por cualquier motivo, los términos y disposiciones de
estos Términos y condiciones permanecerán en pleno vigor y

BORRADOR PARA REVISIÓN DEL ÁREA JURÍDICA DE LA SUAN GLOBAL

efecto como si estos Términos y condiciones se hubieran
ejecutado sin que la disposición infractora apareciera en él.
            </div>
        <div className={s.titleContainer}>
            <h2 id="contacto">CONTÁCTENOS</h2>
                <p>
                    Si tiene alguna inquietud sobre estos Términos y condiciones, la
                    Política de privacidad, el sitio web o cualquier material del sitio
                    web, comuníquese con info@suan.global o escriba a Suan Global
                    a:
                    Suan Global
                    Dirección de Suan
                    Xxxxxxxxx Colombia
                </p>
            </div>
        </div>
    </div>
    </>
  )
}
