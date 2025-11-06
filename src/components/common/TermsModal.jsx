import React, { useState, useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const termsContent = `
El equipo de Terrasacha como responsable del tratamiento de datos personales te da la bienvenida a su sitio web (en adelante, La Plataforma) para que puedas hacer uso de nuestros productos y servicios.

## DERECHOS DEL TITULAR

Todos los Titulares de la información que han entregado a Terrasacha tendrán los siguientes derechos:

- Ser informado sobre el tratamiento y finalidad por la que va a ser usada la información, la cual se encuentra en este documento.

- Conocer, actualizar y rectificar sus datos personales frente a Terrasacha. Este derecho se puede ejercer, entre otros, frente a datos parciales, incompletos o inexactos, que induzcan al error, o aquellos cuyo tratamiento esté expresamente prohibido por la ley 1581 de 2012 referidos en la presente Política de Datos.

- Solicitar prueba de la autorización otorgada para el tratamiento de sus datos personales, salvo cuando expresamente se exceptúa como requisito para el Tratamiento, de conformidad con lo previsto en el artículo 10 de la ley 1281 de 2012.

- Solicitar información a Terrasacha sobre el tratamiento y uso de sus datos, la cual se encuentra impresa en esta Política de Datos.

- Presentar cualquier petición, queja, reclamo o sugerencia respecto al tratamiento de sus datos personales, la cual será atendida por los canales dispuestos en estas Política de Datos.

- Presentar ante la Superintendencia de Industria y Comercio quejas por infracciones a lo dispuesto en la ley 1581 de 2012 y sus respectivas normas complementarias.

- Revocar la autorización del uso de los datos, en cualquier momento o cuando en el tratamiento no se respeten los principios, derechos y garantías constitucionales y legales. La revocatoria procederá cuando la Superintendencia de Industria y Comercio haya determinado que el incumplimiento de la ley 1581 de 2012.

- Acceder en forma gratuita a sus datos personales que hayan sido objeto de tratamiento por parte de Terrasacha.

- Abstenerse de responder las preguntas sobre datos sensibles o sobre datos de las niñas, niños y adolescentes.

- Acceder gratuitamente a la información visual tratada mediante sistemas de video vigilancia.

- Solicitar la supresión de la información, excepto en los casos que dicha información recolectada constituya prueba de la presunta comisión de un delito.

## TRATAMIENTO Y FINALIDAD

El tratamiento que realizará Terrasacha con la información y datos personales será la siguiente: La recolección, almacenamiento, actualización, transmisión, transferencia, utilización y cualquier otro tipo de tratamiento para:

- Desarrollar relaciones comerciales con Terrasacha.

- Efectuar las gestiones pertinentes para el desarrollo del objeto social de la compañía en lo que tiene que ver con el cumplimiento del objeto de la presentación de servicios con el Titular de la información.

- Contactar al Titular a través de medios telefónicos, correo electrónico o cualquier medio de comunicación para la confirmación de datos personales necesarios para la ejecución de una relación contractual y/o relación comercial.

- Contactar al Titular a través de correo electrónico para el envío de estados de cuenta o facturas en relación con las obligaciones derivadas de la relación comercial y/o el contrato celebrado entre las partes.

- Contactar al Titular a través de medio telefónicos, cualquier tipo de mensajería, por medios físicos o electrónicos y correo electrónico, para enviar y recibir la información pertinente para la correcta ejecución de los contratos celebrados con el Titular.

- Suministrar la información a terceros con los cuales Terrasacha tenga relación contractual y que sea necesario entregársela para el cumplimiento del objeto contratado con el Titular.

- Realizar invitaciones a eventos y ofrecer nuevos productos y servicios.

- Gestionar trámites (solicitudes, quejas, reclamos). De acuerdo a la ley 1581 de 2012.

- Efectuar encuestas de satisfacción respecto de los bienes y servicios ofrecidos por Terrasacha.

- Ofrecer y dar mayor seguridad y seguimiento de las actividades realizadas dentro del establecimiento de comercio, en el caso de los datos recolectados por las cámaras de video vigilancia.

- Prestar un mejor y atento servicio basado en los datos sensibles suministrados, para evitar cualquier circunstancia que pueda afectar al Titular como cliente del servicio prestado.

- Los datos de menores son recolectados para dar seguimiento a los productos adquiridos para ellos mismos o terceros. En todo caso no serán almacenados y solo serán usados para este fin.

- Consultar en las centrales de riesgo los datos e información relevante para hacer los estudios de riesgo respectivos a la relación jurídica que se esté celebrando o pueda celebrar en un futuro.

- Reportar en las centrales de riesgo los cumplimientos e incumplimientos de las obligaciones que los Titulares de la información tengan con la empresa.

- Suministrar a las centrales de riesgo información pertinente a las relaciones comerciales.

---

TERRASACHA`;

export const privacyContent = `
## COLECCIÓN DE INFORMACIÓN

Terrasacha recopila principalmente la siguiente información personal:

- Datos personales necesarios para abrir una cuenta en Terrasacha Registry. Esto incluye nombre, número de teléfono, correo electrónico, cargo del representante autorizado, administrador de cuenta y contacto de facturación identificado por un titular de cuenta para su cuenta.

- Detalles de contacto para comunicaciones con partes interesadas, socios estratégicos y otras partes relevantes para las actividades de Terrasacha. Esto incluye nombre, número de teléfono, correo electrónico, cargo de los representantes de estas partes que se comunicarán con Terrasacha.

- Si el titular de la cuenta, parte interesada, socio estratégico u otra parte es un individuo, se pueden recopilar detalles adicionales sobre esa persona, como la cuenta bancaria y la dirección física y, si corresponde, los detalles necesarios para realizar comprobaciones de verificación, como la fecha de nacimiento o emitido por el gobierno. identificador

- Detalles sobre la actividad en el Registro, como detalles de transacciones que podrían identificar a una persona.

- Información personal contenida en las comunicaciones con Terrasacha, incluso a través del sitio web, durante reuniones cara a cara, correspondencia por correo electrónico o conversaciones telefónicas. Esto también puede incluir información personal contenida en informes, encuestas, cuestionarios y formularios proporcionados a Terrasacha para participar en el Registro de Terrasacha o aplicar para hacer cosas como usar nuestros logotipos.

- Información recopilada automáticamente de una visita al sitio web, como la dirección IP.

En algunos casos, Terrasacha puede recopilar información personal de alguien que no sea el individuo en cuestión (por ejemplo, de la persona que abre la cuenta del titular de la cuenta). Si proporciona a Terrasacha información personal sobre otra persona, Terrasacha confía en que haya cumplido con todos los consentimientos, notificaciones y otros requisitos pertinentes para permitir que Terrasacha procese la información personal para el propósito de recopilación de Terrasacha. Si no se proporciona a Terrasacha toda la información personal solicitada, es posible que Terrasacha no pueda registrar un titular de cuenta, proporcionar los servicios y recursos del Programa Terrasacha solicitados o responder completamente a una solicitud.

## NUESTRO USO DE COOKIES

Las cookies son piezas de información que un sitio web transfiere al disco duro de su computadora. La mayoría de los navegadores de Internet están configurados para aceptar cookies. Terrasacha utiliza cookies para que su uso del sitio web, los recursos y los servicios sea más conveniente. Las cookies se utilizan, por ejemplo, para estimar el número total de usuarios del sitio web y determinar los patrones de tráfico a través del sitio web. Si no desea recibir cookies, puede configurar su navegador para que rechace las cookies, pero esto puede afectar su capacidad para aprovechar al máximo los servicios y recursos del sitio web.

## USO DE SU INFORMACIÓN PERSONAL

Terrasacha utiliza la información personal para los siguientes propósitos:

- Operar el Registro Terrasacha, proporcionar los servicios y recursos del Programa Terrasacha e iniciativas y actividades relacionadas.

- Emitir, realizar, recopilar, gestionar y analizar informes, cuestionarios y encuestas y elaborar informes y/o calificaciones en función de las respuestas.

- Responder a las consultas o solicitudes de información de los interesados.

- Administrar y mantener el Sitio Web.

- Mejorar los servicios y recursos de Terrasacha.

- Para otros fines con su consentimiento o cuando lo permita o exija la ley.

## DIVULGACIÓN DE INFORMACIÓN PERSONAL

Terrasacha divulga información personal de la siguiente manera:

- Con el fin de brindar servicios y brindar acceso a los recursos (incluso a través del sitio web), y para mejorar esos servicios y el acceso, a veces podemos divulgar información personal a terceros, como afiliados, socios, proveedores de servicios, contratistas independientes, consultores, almacenamiento de seguridad del sitio o proveedores de TI, servidores de sitios web y otros socios de Terrasacha.

- También podemos compartir y divulgar información anónima y agregada con fines de investigación y actividades promocionales. Por ejemplo, podemos divulgar datos agregados de informes de visitantes del sitio web, registros de eventos, informes completos, cuestionarios y encuestas, y poner dichos datos a disposición en el sitio web o a través de otros medios.

- Terrasacha puede divulgar información personal en relación con una venta o transacción que involucre la totalidad o una parte del negocio a los representantes de un posible comprador, y cuando así lo exija la ley aplicable.

- Terrasacha también puede divulgar información personal con su consentimiento o cuando lo permita o exija la ley.

## ALMACENAMIENTO Y SEGURIDAD DE SU INFORMACIÓN PERSONAL

Terrasacha se esforzará por tomar todas las medidas razonables para mantener segura la información del usuario y mantener esta información precisa y actualizada. Exigimos a nuestros empleados y procesadores de datos que respeten la confidencialidad de cualquier información personal en poder de Terrasacha.

## ACCESO Y CORRECCIÓN

Por favor, asegúrese de que los detalles que nos proporciona se mantengan actualizados. Cuando proporcionemos instalaciones para actualizar los cambios en los detalles, utilice esas instalaciones. Además, para solicitar el acceso o la corrección de la información personal que tenemos, comuníquese con nosotros utilizando los detalles en la sección Contáctenos a continuación. En algunos casos, podemos responder que una solicitud no será procesada cuando lo permita o exija la ley. Incluya suficientes detalles para que podamos entender la naturaleza de su solicitud. Es posible que necesitemos solicitar información personal para verificar su identidad.

## RETIRO DEL CONSENTIMIENTO

Para retirar cualquier consentimiento proporcionado para que procesemos información personal, comuníquese con nosotros utilizando los detalles en la sección Contáctenos a continuación. Si se retira el consentimiento, puede tener consecuencias, como que ya no podamos proporcionar ciertos servicios o comunicaciones. Incluso si se retira el consentimiento, aún podemos procesar información personal donde lo permita o lo exija la ley. Incluya suficientes detalles para que podamos entender la naturaleza de su solicitud. Es posible que necesitemos solicitar información personal para verificar su identidad.

## ENLACES A OTROS SITIOS WEB

Terrasacha proporciona, a través del sitio web, acceso a sitios web de terceros cuyo contenido no está controlado por Terrasacha. Estos sitios web vinculados no están bajo el control de Terrasacha, y no somos responsables del contenido o la conducta de las organizaciones a las que se accede a través de enlaces a dichos sitios web de terceros a través del sitio web. Antes de divulgar su información personal en cualquier sitio web, le sugerimos que examine los términos y condiciones y la política de privacidad de ese sitio web.

## CAMBIOS FUTUROS

Terrasacha puede, de vez en cuando, modificar esta Política de privacidad de Terrasacha. Dichas modificaciones se publicarán en el sitio web y entrarán en vigencia al menos catorce (14) días después de dicha publicación. Por lo tanto, siga revisando esta Política de privacidad de Terrasacha para asegurarse de conocer los términos de la versión actual.

## ENLACES A SITIO WEB

Si tiene alguna inquietud o queja sobre nuestro procesamiento de su información personal, incluido nuestro cumplimiento de las leyes de protección de datos aplicables, comuníquese con nosotros utilizando los detalles en la sección Contáctenos a continuación. Consideraremos y responderemos con prontitud a los problemas planteados. Incluya suficientes detalles para que podamos entender la naturaleza de su inquietud. Es posible que necesitemos solicitar información personal para verificar su identidad.

## CONTÁCTENOS

Se nos puede contactar en relación con asuntos de privacidad, incluido lo contemplado en esta Política de privacidad de Terrasacha, de la siguiente manera:

- Dirección: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
- Correo electrónico: privacidad@terrasacha.com

---

TERRASACHA - Pioneros del Mañana`;

const TermsModal = ({ isOpen, onClose, type, onAccept }) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setHasScrolledToBottom(false);
    }
  }, [isOpen]);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px de tolerancia
      setHasScrolledToBottom(isAtBottom);
    }
  };

  const handleAccept = () => {
    if (hasScrolledToBottom) {
      onAccept(true);
      onClose();
    }
  };

  const getContent = () => {
    if (type === 'terms') {
      return {
        title: 'Términos de Uso',
        content: termsContent
      };
    } else if (type === 'privacy') {
      return {
        title: 'Política de Privacidad',
        content: privacyContent
      };
    }
    return { title: '', content: '' };
  };

  const { title, content } = getContent();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-terrasacha-2xl max-w-4xl w-full max-h-[90vh] flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-terrasacha-light bg-gradient-terrasacha-subtle rounded-t-2xl">
          <h2 className="text-2xl font-bold text-terrasacha-primary font-typographica">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
            aria-label="Cerrar modal"
          >
            <FaTimes size={24} className="text-terrasacha-primary" />
          </button>
        </div>

        {/* Content */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-6"
        >
          <div className="prose prose-sm max-w-none prose-terrasacha">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-center border-2 border-terrasacha-primary bg-gradient-terrasacha-subtle rounded-lg p-6 text-xl font-bold text-terrasacha-primary font-champagne mb-6">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-lg font-bold text-terrasacha-secondary1 font-champagne mb-4 mt-6">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-base font-bold text-terrasacha-primary font-champagne mb-3 mt-4">
                    {children}
                  </h3>
                ),
                ul: ({ children }) => (
                  <ul className="space-y-3 list-none">
                    {children}
                  </ul>
                ),
                li: ({ children }) => (
                  <li className="flex items-start">
                    <span className="text-terrasacha-primary font-bold mr-3 mt-1">•</span>
                    <span className="text-sm text-gray-700 font-typographica leading-relaxed">
                      {children}
                    </span>
                  </li>
                ),
                p: ({ children }) => (
                  <p className="text-sm text-gray-700 font-typographica leading-relaxed mb-2">
                    {children}
                  </p>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-terrasacha-primary">
                    {children}
                  </strong>
                ),
                hr: () => (
                  <hr className="border-t border-terrasacha-light my-6" />
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-terrasacha-secondary2 bg-terrasacha-light bg-opacity-10 p-4 rounded-r-lg my-4">
                    {children}
                  </blockquote>
                )
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-terrasacha-light bg-gray-50 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {!hasScrolledToBottom && (
                <div className="flex items-center text-sm text-terrasacha-secondary1">
                  <div className="w-4 h-4 mr-2">
                    <svg className="animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </div>
                  Desplácese hasta el final para continuar
                </div>
              )}
              {hasScrolledToBottom && (
                <div className="flex items-center text-sm text-terrasacha-success">
                  <div className="w-4 h-4 mr-2">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  Lectura completa - Puede continuar
                </div>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  onClose();
                  onAccept(false);
                }}
                className="px-6 py-2 border border-terrasacha-primary text-terrasacha-primary rounded-lg hover:bg-terrasacha-primary hover:text-white transition-all duration-200 font-medium"
              >
                No acepto
              </button>
              <button
                onClick={handleAccept}
                disabled={!hasScrolledToBottom}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  hasScrolledToBottom
                    ? 'bg-terrasacha-primary text-white hover:bg-terrasacha-secondary1 shadow-terrasacha'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
