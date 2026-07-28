DOCUMENTACIÓN TÉCNICA - PLATAFORMA TERRASACHA

1. GLOSARIO

React
Librería de JavaScript para construir interfaces de usuario basadas en componentes reutilizables.

React Router
Librería de enrutamiento para aplicaciones React que permite navegación entre componentes mediante rutas.

AWS Amplify
Plataforma de AWS para desarrollar y desplegar aplicaciones full-stack con servicios backend integrados (autenticación, almacenamiento, API).

AWS Cognito
Servicio de autenticación y gestión de usuarios de AWS. Maneja registro, login, MFA, políticas de contraseña y tokens JWT.

AWS AppSync
Servicio GraphQL administrado de AWS que permite crear APIs escalables con capacidades de tiempo real mediante suscripciones.

GraphQL
Lenguaje de consultas para APIs que permite solicitar exactamente los datos necesarios mediante queries y mutations, reduciendo el over-fetching.

Amazon S3
Servicio de almacenamiento de objetos de AWS utilizado para guardar archivos, imágenes, PDFs y recursos multimedia.

Context API (React)
API nativa de React para compartir estado global entre componentes sin necesidad de prop drilling.

AuthContext
Contexto global en React que maneja el estado de autenticación del usuario, roles y sesiones.

ProjectDataContext
Contexto global que gestiona el estado de datos de proyectos, permitiendo compartir información entre componentes relacionados.

PropertyDataContext
Contexto global para manejar el estado de datos de propiedades (predios), incluyendo información catastral y documentación.

S3ClientContext
Contexto que proporciona acceso al cliente S3 configurado con credenciales del usuario autenticado para operaciones de almacenamiento.

RoleMiddleware
Componente de protección de rutas que verifica los permisos del usuario basándose en su rol antes de permitir el acceso a una ruta.

Roles
Sistema de permisos asociados a usuarios que determina qué funcionalidades pueden acceder:
- admon: Administrador del sistema
- constructor: Postulante/Propietario de predios
- investor: Inversor
- validator: Consultor/Validador
- legal: Revisor Legal
- analyst: Analista de proyectos

Product (Producto)
Entidad principal que representa un proyecto ambiental en la plataforma. Contiene información del predio, características, documentos y estado de verificación.

Property (Propiedad/Predio)
Representación de un predio físico asociado a un producto. Incluye información catastral, ubicación geográfica y documentación legal.

Campaign (Campaña)
Agrupación de productos/proyectos bajo un mismo objetivo o iniciativa. Permite organizar múltiples proyectos relacionados.

ProductFeature
Característica o atributo asociado a un producto (ej: área, ubicación, tipo de proyecto). Puede ser verificable y requerir documentación.

PropertyFeature
Característica específica de una propiedad/predio. Similar a ProductFeature pero aplicado al nivel de predio.

Verification (Verificación)
Proceso de validación de características de productos o propiedades realizado por usuarios con rol validator. Incluye comentarios y firmas.

Document
Archivo asociado a un ProductFeature o PropertyFeature. Puede ser PDF, imagen, KML/KMZ, etc. Almacenado en S3.

Wallet
Billetera blockchain asociada a un usuario. Permite gestionar tokens y transacciones relacionadas con proyectos tokenizados.

Order
Orden de compra de tokens asociada a un producto. Incluye información de pago, wallet del comprador y estado de la transacción.

Payment
Registro de pago (fiat o cripto) asociado a una orden. Incluye información de tasa de cambio, valores y estado.

Transaction
Transacción blockchain registrada en el sistema. Incluye información de direcciones, UTXOs, hash de transacción y estado de firma.

Mappers
Funciones que transforman datos del backend (GraphQL) en estructuras consumibles por el frontend. Convierten DTOs en modelos de UI.

Hooks Personalizados
Funciones reutilizables de React que encapsulan lógica de estado y efectos. Ejemplos: useUserProjects, useFetchProperties, useCategories.

Servicios
Módulos que encapsulan lógica de negocio y comunicación con APIs externas. Ejemplos: getPredialDataByCadastralNumber, getPolygonByCadastralNumber.

Tailwind CSS
Framework de utilidades CSS para construir interfaces rápidamente mediante clases predefinidas. Configurado con paleta de colores Terrasacha.

Bootstrap
Framework CSS utilizado junto con Tailwind para componentes como modales, tablas y formularios.

React Hook Form
Librería para manejo de formularios en React con validación y rendimiento optimizado.

Zod
Librería de validación de esquemas TypeScript-first para validación de datos.

Google Maps (google-map-react)
Integración de mapas interactivos para mostrar ubicaciones de proyectos y predios, visualización de polígonos catastrales.

Recharts
Librería de gráficos basada en React para visualización de métricas y dashboards.

Chart.js / react-chartjs-2
Librería de gráficos para representar datos en el frontend, utilizada en dashboards y análisis.

React PDF / pdfjs-dist
Librerías para visualización y renderizado de documentos PDF en el navegador.

XLSX
Librería para lectura y escritura de archivos Excel, utilizada para importar formularios de postulación.

SweetAlert2
Librería para mostrar modales de confirmación y alertas con mejor UX que los alert nativos.

React Toastify
Sistema de notificaciones toast para mostrar mensajes de éxito, error o información al usuario.

Turf.js (@turf/turf)
Librería de análisis geoespacial para manipulación de coordenadas, polígonos y cálculos geográficos.

API Catastral
Servicio externo que proporciona información de predios mediante consultas por número catastral. Retorna datos de área, ubicación y polígonos.

Oráculo Terrasacha
API externa para análisis comparativo de áreas de proyectos mediante imágenes satelitales antes/después.

Marketplace
Entidad que agrupa usuarios, productos y configuraciones. Permite multi-tenancy en la plataforma.

UserProduct
Relación entre usuario y producto. Permite marcar favoritos, asignar validadores y gestionar permisos.

Script
Contrato inteligente o script blockchain asociado a un producto. Define lógica de tokenización y gobernanza.

Token
Representación de activo digital asociado a un producto. Incluye policy ID, nombre, supply y precio del oráculo.

Analysis
Análisis de imágenes satelitales comparativas para proyectos. Incluye parámetros de consulta y resultados procesados.

ApiQuery
Registro de consultas realizadas al Oráculo Terrasacha. Almacena parámetros, resultados y estado de verificación.

2. REPOSITORIO PLATAFORMA TERRASACHA

Este repositorio contiene la aplicación frontend principal de la plataforma Terrasacha, construida con React y desplegada mediante AWS Amplify. La plataforma permite gestionar proyectos ambientales, propiedades, validaciones, inversiones y tokenización de activos.

El objetivo principal de la plataforma es:
- Gestionar el ciclo de vida completo de proyectos ambientales (postulación, validación, aprobación)
- Administrar propiedades y su documentación legal
- Facilitar la validación de proyectos por consultores
- Permitir inversiones en proyectos tokenizados
- Integrar con servicios blockchain para tokenización
- Proporcionar dashboards y análisis para diferentes roles de usuario

2.1 Objetivos del Proyecto

- Soportar múltiples roles de usuario con permisos diferenciados (administrador, constructor, inversor, validador, legal, analista)
- Gestionar proyectos ambientales desde la postulación hasta la tokenización
- Integrar información catastral mediante APIs externas
- Almacenar y gestionar documentación legal de propiedades
- Facilitar el proceso de validación de proyectos por consultores
- Proporcionar dashboards y métricas para toma de decisiones
- Integrar con servicios blockchain para tokenización de proyectos
- Soportar campañas que agrupen múltiples proyectos
- Permitir análisis comparativo de áreas mediante imágenes satelitales

2.2 Tecnologías Principales

2.2.1 Frontend y Framework

El proyecto se basa en React 18 con Create React App como herramienta de construcción. La aplicación utiliza React Router para navegación y Context API para gestión de estado global. La interfaz se construye con Tailwind CSS (configurado con paleta de colores Terrasacha) y Bootstrap para componentes adicionales. Se utiliza React Hook Form para manejo de formularios y Zod para validación.

2.2.2 Backend y Servicios en la Nube (AWS)

El backend se apoya completamente en servicios de AWS:
- AWS Amplify: Plataforma de despliegue y CI/CD
- AWS Cognito: Autenticación y gestión de usuarios (registro, login, MFA, políticas de contraseña)
- AWS AppSync: API GraphQL administrada para consultas y mutations de datos
- Amazon S3: Almacenamiento de archivos, imágenes, PDFs y recursos multimedia

2.2.3 Visualización y Mapas

- Google Maps (google-map-react): Visualización de mapas interactivos y polígonos catastrales
- Recharts: Gráficos y visualización de métricas en dashboards
- Chart.js / react-chartjs-2: Gráficos adicionales para análisis de datos

2.2.4 Utilidades y Librerías

- React PDF / pdfjs-dist: Visualización de documentos PDF
- XLSX: Importación de formularios desde archivos Excel
- Turf.js: Análisis geoespacial y manipulación de coordenadas
- SweetAlert2: Modales de confirmación y alertas
- React Toastify: Sistema de notificaciones toast

2.2.5 Integraciones Externas

- API Catastral: Consulta de información de predios por número catastral
- Oráculo Terrasacha: Análisis comparativo de áreas mediante imágenes satelitales

| Categoría | Tecnología |
|-----------|-----------|
| Framework | React 18 |
| Routing | React Router v6 |
| Estilos | Tailwind CSS, Bootstrap |
| Autenticación | AWS Cognito (via Amplify) |
| Backend | AWS AppSync (GraphQL) |
| Almacenamiento | Amazon S3 |
| Mapas | Google Maps |
| Gráficos | Recharts, Chart.js |
| Formularios | React Hook Form, Zod |
| PDF | React PDF, pdfjs-dist |
| Notificaciones | React Toastify, SweetAlert2 |
| Geoespacial | Turf.js |
| Infraestructura | AWS Amplify |

2.3 Arquitectura

2.3.1 Estructura de Carpetas

| Ruta | Tipo | Descripción |
|------|------|-------------|
| `/src` | Root | Código fuente principal de la aplicación |
| `/src/components` | Contenedor | Componentes React organizados por funcionalidad |
| `/src/components/Admon` | Módulo | Componentes de administración (usuarios, productos, categorías, validadores) |
| `/src/components/Constructor` | Módulo | Componentes para constructores/postulantes (proyectos, propiedades, campañas) |
| `/src/components/Investor` | Módulo | Componentes para inversores (portafolio, productos comprados) |
| `/src/components/Validator` | Módulo | Componentes para validadores/consultores |
| `/src/components/Legal` | Módulo | Componentes para revisores legales |
| `/src/components/Property` | Módulo | Componentes de gestión de propiedades (versión legacy) |
| `/src/components/Property2` | Módulo | Componentes de gestión de propiedades (versión actual) |
| `/src/components/common` | Módulo | Componentes reutilizables (Sidebar, Navbar, Cards, Tablas) |
| `/src/components/views` | Módulo | Vistas principales (Landing, Login, Products, Settings) |
| `/src/context` | Contenedor | Contextos globales de React (Auth, Project, Property, S3) |
| `/src/graphql` | Contenedor | Queries, mutations y schema GraphQL |
| `/src/services` | Contenedor | Servicios de negocio y APIs externas |
| `/src/hooks` | Contenedor | Hooks personalizados de React |
| `/src/utilities` | Contenedor | Utilidades y helpers comunes |
| `/src/mappers` | Contenedor | Funciones de transformación de datos |
| `/amplify` | Config | Configuración de AWS Amplify (backend, auth, storage) |
| `/public` | Assets | Archivos estáticos (imágenes, favicon, manifest) |

2.3.2 Componentes Principales

Contextos Globales

- AuthContext: Gestiona autenticación, usuario actual y roles
- ProjectDataContext: Estado global de datos de proyectos
- PropertyDataContext: Estado global de datos de propiedades
- S3ClientContext: Cliente S3 configurado con credenciales del usuario

Componentes por Rol

- Admon: Administración de usuarios, productos, categorías, validadores, fórmulas, resultados
- Constructor: Gestión de proyectos, propiedades, campañas, documentos
- Investor: Visualización de portafolio, productos comprados, perfil
- Validator: Validación de proyectos y propiedades, comentarios, firmas
- Legal: Revisión legal de documentos, aprobaciones
- Analyst: Análisis de proyectos, métricas, dashboards

Componentes Comunes

- Sidebar: Navegación lateral con menús por rol
- NewHeaderNavbar: Barra de navegación superior
- TerrasachaTable: Tabla reutilizable con estilos Terrasacha
- Card: Tarjeta reutilizable para contenido
- NotificationsModal: Modal de notificaciones del usuario

2.3.3 Flujo de Datos

```
Frontend (React)
   ↓
Context API (Estado Global)
   ↓
GraphQL Queries/Mutations (AWS AppSync)
   ↓
AWS Services:
   - AWS Cognito (Autenticación)
   - AWS AppSync (Datos)
   - Amazon S3 (Archivos)
   ↓
APIs Externas:
   - API Catastral (Información de predios)
   - Oráculo Terrasacha (Análisis satelital)
```

El frontend consume datos mediante GraphQL queries a AppSync.
Los contextos proporcionan estado global compartido entre componentes.
S3 almacena documentos, imágenes y recursos multimedia.
Las APIs externas se consumen directamente desde servicios.

2.3.4 Autenticación y Autorización

Autenticación:
- AWS Cognito vía Amplify
- Manejo de sesiones, tokens JWT y roles
- Login, registro, recuperación de contraseña, MFA
- Roles almacenados en atributos personalizados de Cognito

Autorización:
- RoleMiddleware: Componente que protege rutas basándose en roles
- Verificación de permisos antes de renderizar componentes
- Redirección automática si el usuario no tiene permisos
- Roles definidos: admon, constructor, investor, validator, legal, analyst

Roles y Permisos:

| Rol | Descripción | Accesos Principales |
|-----|-------------|---------------------|
| `admon` | Administrador | Gestión completa de usuarios, productos, categorías, validadores, configuración |
| `constructor` | Postulante/Propietario | Crear proyectos, gestionar propiedades, subir documentos, ver estado de validación |
| `investor` | Inversor | Ver productos disponibles, realizar inversiones, ver portafolio, productos comprados |
| `validator` | Consultor/Validador | Validar proyectos y propiedades, agregar comentarios, firmar verificaciones |
| `legal` | Revisor Legal | Revisar documentos legales, aprobar/rechazar propiedades, gestionar aspectos legales |
| `analyst` | Analista | Ver proyectos, métricas, dashboards, análisis comparativos |

2.4 Gestión de Proyectos y Propiedades

2.4.1 Proyectos (Products)

Un Product representa un proyecto ambiental completo. Incluye:
- Información básica (nombre, descripción, categoría)
- Características (ProductFeatures): área, ubicación, tipo de proyecto, etc.
- Documentos asociados a cada característica
- Estado de verificación y aprobación
- Propiedades asociadas (predios)
- Tokens y transacciones blockchain
- Análisis satelitales
- Campaña asociada (opcional)

Flujo de un Proyecto:

1. Postulación: Constructor crea proyecto mediante formulario XLSX o formulario dinámico
2. Asignación de Validadores: Administrador asigna validadores al proyecto
3. Validación: Validadores revisan características y documentos, agregan comentarios
4. Aprobación/Rechazo: Administrador o validador aprueba o rechaza el proyecto
5. Tokenización: Si se aprueba, se puede proceder con la tokenización en blockchain
6. Inversión: Inversores pueden comprar tokens del proyecto

2.4.2 Propiedades (Properties)

Una Property representa un predio físico asociado a un proyecto. Incluye:
- Información catastral (número, área, ubicación)
- Características (PropertyFeatures): uso actual, restricciones, ecosistema, etc.
- Documentos legales (certificado de tradición, escrituras, planos)
- Propietarios asociados
- Estado: PENDING, DOC_UPLOADED, SELECTABLE, NOT_SELECTABLE, APPROVED, REJECTED
- Validación por consultores legales

Flujo de una Propiedad:

1. Creación: Constructor crea propiedad asociada a un proyecto
2. Carga de Documentos: Se suben documentos requeridos (certificado, escrituras, planos)
3. Validación Legal: Revisor legal valida documentos
4. Validación Técnica: Validadores revisan características y documentación
5. Aprobación: Administrador aprueba la propiedad
6. Asociación a Proyecto: Propiedad queda disponible para el proyecto

2.5 Integraciones Externas

2.5.1 API Catastral

Servicio que proporciona información de predios mediante consultas por número catastral.

Servicios:
- getPredialDataByCadastralNumber: Obtiene información predial (área, dirección, destino económico)
- getPredialData2ByCadastralNumber: Obtiene información adicional de predios
- getPolygonByCadastralNumber: Obtiene polígonos geoespaciales en formato GeoJSON

Uso:
Se consulta automáticamente al ingresar números catastrales en propiedades. Los datos se mapean y almacenan en PropertyFeatures.

2.5.2 Oráculo Terrasacha

API externa para análisis comparativo de áreas mediante imágenes satelitales.

Funcionalidad:
- Comparación de imágenes antes/después de proyectos
- Parámetros configurables: satélite, año, meses, nubosidad máxima
- Resultados de análisis de cambios en área

Uso:
Los analistas pueden solicitar análisis comparativos desde la interfaz de proyectos. Los resultados se almacenan en la entidad Analysis y ApiQuery.

2.6 Mappers y Transformación de Datos

Los mappers son funciones que transforman datos del formato GraphQL (backend) al formato consumido por el frontend.

Mappers Principales:
- mapProjectData: Transforma datos de Product a formato de proyecto
- mapPropertyData: Transforma datos de Property a formato de propiedad
- mapGeoData: Filtra y procesa archivos geoespaciales (KML/KMZ)
- formatArea: Formatea áreas con separadores de miles
- marketplaceURLMapper: Mapea URLs de marketplaces por entorno

Ubicación: /src/components/Constructor/ProjectPage/mappers.js

2.7 Servicios y Hooks Personalizados

2.7.1 Servicios (/src/services)

Encapsulan lógica de negocio y comunicación con APIs:

- getProject.js: Obtiene datos de proyecto con mapeo
- getProjectProgress.js: Calcula progreso de completitud de proyecto
- getUserProjects.js: Lista proyectos de un usuario
- getUserProperties.js: Lista propiedades de un usuario
- getUserCampaigns.js: Lista campañas de un usuario
- getPredialDataByCadastralNumber.js: Consulta API catastral
- getPolygonByCadastralNumber.js: Obtiene polígonos catastrales
- getCategories.js: Obtiene categorías de productos
- getXLSXForm.js: Obtiene formulario XLSX para importación

2.7.2 Hooks Personalizados (/src/hooks)

Funciones reutilizables de React:

- useUserProjects.js: Hook para obtener proyectos del usuario
- useUserProperties.js: Hook para obtener propiedades del usuario
- useUserCampaigns.js: Hook para obtener campañas del usuario
- useFetchProperties.js: Hook para obtener propiedades con filtros
- useFetchPropertiesProject.js: Hook para propiedades de un proyecto
- useFetchPropertiesCampaign.js: Hook para propiedades de una campaña
- useProjectItems.js: Hook para items de un proyecto
- useCategories.js: Hook para categorías
- useXLSXForm.js: Hook para procesar formularios XLSX

2.8 Configuración y Variables de Entorno

Variables de Entorno Requeridas:
- REACT_APP_URL_BUCKET: URL del bucket S3 para archivos públicos
- REACT_APP_CADASTRAL_QUERY_URL: URL base de la API catastral
- Configuración de AWS Amplify (automática mediante aws-exports.js)

Archivos de Configuración:
- src/amplifyconfiguration.json: Configuración de Amplify
- src/aws-exports.js: Exportación automática de configuración Amplify
- src/components/common/_conf/WebAppConfig.js: Configuración de la aplicación

2.9 Estilos y Diseño

2.9.1 Tailwind CSS

Configurado con paleta de colores Terrasacha (Pantone 5757C):
- Primary: Verde Selva (#6e6c35)
- Secondary1: Verde Bosques Nublados (#44482c)
- Secondary2: Verde Pradera (#849b50)
- Light: Verde Claro (#b1c181)
- Earth: Amarillo Tierra (#e8d79a)

Clases Personalizadas:
- .btn-terrasacha-primary, .btn-terrasacha-secondary, etc.
- .form-terrasacha-input, .form-terrasacha-label
- .table-terrasacha-container, .table-terrasacha-header-section
- .bg-gradient-terrasacha, .shadow-terrasacha

Ubicación: tailwind.config.js

2.10 Flujos de Trabajo Principales

2.10.1 Flujo: Creación de Proyecto

1. Constructor accede a /new_project
2. Se carga formulario XLSX o formulario dinámico
3. Constructor completa información del proyecto
4. Se crean ProductFeatures automáticamente
5. Se asocian documentos a características
6. Proyecto queda en estado inicial (PENDING)
7. Administrador asigna validadores
8. Validadores comienzan proceso de validación

2.10.2 Flujo: Validación de Proyecto

1. Validador accede a proyecto (/project/:id)
2. Revisa características y documentos
3. Agrega comentarios en verificaciones
4. Aprueba o rechaza características individuales
5. Administrador revisa verificaciones
6. Proyecto se aprueba o rechaza globalmente
7. Si se aprueba, se habilita tokenización

2.10.3 Flujo: Gestión de Propiedad

1. Constructor crea propiedad asociada a proyecto
2. Ingresa número catastral (se consulta API catastral automáticamente)
3. Sube documentos requeridos (certificado, escrituras, planos)
4. Completa características de la propiedad
5. Revisor legal valida documentos
6. Validadores técnicos revisan información
7. Propiedad se aprueba o rechaza
8. Propiedad queda disponible para el proyecto

2.10.4 Flujo: Inversión en Proyecto

1. Inversor navega a /products y ve proyectos disponibles
2. Selecciona proyecto de interés (/products/:id)
3. Revisa información, documentos y estado
4. Realiza orden de compra de tokens
5. Completa pago (fiat o cripto)
6. Recibe tokens en su wallet
7. Puede ver portafolio en /investor_admon

2.11 Consideraciones de Seguridad

- Autenticación mediante AWS Cognito con tokens JWT
- Roles verificados en cada ruta mediante RoleMiddleware
- Credenciales S3 obtenidas dinámicamente del usuario autenticado
- Documentos sensibles almacenados en S3 con permisos restringidos
- Validación de permisos en operaciones sensibles (eliminación, aprobación)
- Tokens JWT manejados automáticamente por Amplify
- Sesiones con expiración configurada en Cognito

2.12 Despliegue

La aplicación se despliega mediante AWS Amplify:
- CI/CD automático desde repositorio Git
- Builds automáticos en cada push
- Despliegue en múltiples entornos (INTERNAL, TEST, PROD)
- Configuración de dominios y SSL automática
- Variables de entorno configuradas en consola Amplify

URLs por Entorno:
- INTERNAL: https://internal-marketplace.terrasacha.com/
- TEST: https://test-platform.terrasacha.com/
- PROD: https://platform.terrasacha.com/
