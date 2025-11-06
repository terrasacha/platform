import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { useS3Client } from "context/s3ClientContext";
import { createDocument, createPropertyFeature } from "graphql/mutations";
import { listPropertyFeatures } from "graphql/queries";
import Swal from "sweetalert2";
import { FaCamera, FaImage, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { getOwnerValidationSessionByToken } from "graphql/customMutations";
import { updateOwnerValidationSession } from "graphql/customMutations";

const MobileOwnerValidation = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { s3Client, bucketName } = useS3Client();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1); // 1: welcome, 2: form, 3: documents, 4: success
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ idFront: false, idBack: false, selfie: false });

  // Autenticación (Opción 2A)
  const [isAuth, setIsAuth] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [documents, setDocuments] = useState({
    idFront: null,
    idBack: null,
    selfie: null,
  });

  const [previews, setPreviews] = useState({
    idFront: null,
    idBack: null,
    selfie: null,
  });

  // Verificar token y cargar sesión
  useEffect(() => {
    const verifyToken = async () => {
      try {
        setLoading(true);
        const response = await API.graphql(
          graphqlOperation(getOwnerValidationSessionByToken, {
            filter: { token: { eq: token } }
          })
        );

        if (response?.data?.listOwnerValidationSessions?.items?.length > 0) {
          const sessionData = response.data.listOwnerValidationSessions.items[0];
          const now = Math.floor(Date.now() / 1000);
          
          if (sessionData.expiresAt < now) {
            setSession({ ...sessionData, expired: true });
            Swal.fire({
              title: "Token Expirado",
              text: "Este enlace ha expirado. Por favor, solicita uno nuevo.",
              icon: "error",
              confirmButtonText: "Entendido",
            });
            return;
          }

          if (sessionData.status === "completed") {
            Swal.fire({
              title: "Ya Completado",
              text: "Esta validación ya fue completada.",
              icon: "info",
              confirmButtonText: "Entendido",
            });
            return;
          }

          setSession(sessionData);
        } else {
          Swal.fire({
            title: "Token Inválido",
            text: "El enlace no es válido. Por favor, solicita uno nuevo.",
            icon: "error",
            confirmButtonText: "Entendido",
          });
        }
      } catch (error) {
        console.error("Error verificando token:", error);
        console.error("Detalles del error:", {
          message: error.message,
          errors: error.errors,
          data: error.data,
        });

        let errorMessage = "No se pudo verificar el token. Intenta nuevamente.";
        
        if (error.errors && error.errors.length > 0) {
          const firstError = error.errors[0];
          if (firstError.message?.includes("OwnerValidationSession") || 
              firstError.message?.includes("not found") ||
              firstError.message?.includes("does not exist")) {
            errorMessage = "El modelo OwnerValidationSession no existe. Por favor ejecuta 'amplify push' primero.";
          } else if (firstError.message?.includes("Unauthorized") || 
                     firstError.message?.includes("Not Authorized")) {
            errorMessage = "No tienes permisos para acceder. El token puede haber expirado o ser inválido.";
          } else {
            errorMessage = firstError.message || errorMessage;
          }
        } else if (error.message) {
          if (error.message.includes("not found") || error.message.includes("does not exist")) {
            errorMessage = "El modelo OwnerValidationSession no existe. Por favor ejecuta 'amplify push' primero.";
          } else {
            errorMessage = error.message;
          }
        }

        Swal.fire({
          title: "Error",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "Entendido",
        });
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token]);

  // Comprobar si el usuario está autenticado (para usar credenciales "authenticated")
  useEffect(() => {
    let mounted = true;
    const checkAuth = async () => {
      try {
        setAuthLoading(true);
        await Auth.currentAuthenticatedUser();
        if (mounted) setIsAuth(true);
      } catch {
        if (mounted) setIsAuth(false);
      } finally {
        if (mounted) setAuthLoading(false);
      }
    };
    checkAuth();
    return () => {
      mounted = false;
    };
  }, []);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      if (!loginForm.username.trim() || !loginForm.password.trim()) {
        Swal.fire({ title: "Campos requeridos", text: "Ingresa usuario y contraseña", icon: "warning", confirmButtonText: "Entendido" });
        return;
      }
      setAuthLoading(true);
      await Auth.signIn(loginForm.username.trim(), loginForm.password);
      setIsAuth(true);
      Swal.fire({ title: "Sesión iniciada", icon: "success", timer: 1200, showConfirmButton: false });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error de inicio de sesión:", error);
      Swal.fire({ title: "No se pudo iniciar sesión", text: error?.message || "Intenta nuevamente", icon: "error", confirmButtonText: "Entendido" });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (type, file) => {
    if (!file) return;

    setDocuments((prev) => ({ ...prev, [type]: file }));

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviews((prev) => ({ ...prev, [type]: e.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleCameraClick = (type) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = type === "selfie" ? "user" : "environment";
    input.onchange = (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFileSelect(type, e.target.files[0]);
      }
    };
    input.click();
  };

  const handleGalleryClick = (type) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFileSelect(type, e.target.files[0]);
      }
    };
    input.click();
  };

  const uploadFileToS3 = async (file, type) => {
    if (!file) return null;

    try {
      // Validaciones adicionales para móvil (útil para debugging)
      if (!bucketName) {
        throw new Error("S3 bucket no configurado (bucketName vacío)");
      }
      if (!session?.propertyID) {
        throw new Error("No se encontró información de la propiedad en la sesión");
      }

      // SIEMPRE crear un S3Client nuevo con credenciales actuales (no confiar en el del contexto)
      // Esto asegura que use credenciales "authenticated" después del login
      const { S3Client } = await import("@aws-sdk/client-s3");
      const credentials = await Auth.currentCredentials();
      
      // Log de diagnóstico
      console.log("🔐 Credenciales S3:", {
        authenticated: credentials.authenticated,
        identityId: credentials.identityId?.substring(0, 20) + "...",
        hasAccessKey: !!credentials.accessKeyId,
      });

      if (!credentials.authenticated) {
        throw new Error("No estás autenticado. Por favor inicia sesión nuevamente.");
      }

      const effectiveS3Client = new S3Client({
        region: "us-east-1",
        credentials: {
          accessKeyId: credentials.accessKeyId,
          secretAccessKey: credentials.secretAccessKey,
          sessionToken: credentials.sessionToken,
        },
      });

      // Misma estructura exacta que PropertyOwners.jsx
      const fileKey = `public/property/${session.propertyID}/owners/${type}/${Date.now()}_${file.name}`;

      const uploadParams = {
        Bucket: bucketName,
        Key: fileKey,
        Body: file,
        ContentType: file.type,
      };

      console.log(`📤 Subiendo ${type} a S3:`, { key: fileKey, size: file.size });
      const result = await effectiveS3Client.send(
        new (await import("@aws-sdk/client-s3")).PutObjectCommand(uploadParams)
      );
      console.log(`✅ ${type} subido exitosamente:`, { etag: result?.ETag });

      const rawUrl = `https://${bucketName}.s3.amazonaws.com/${fileKey}`;
      const fileUrl = encodeURI(rawUrl);
      return { url: fileUrl, key: fileKey };
    } catch (error) {
      console.error(`❌ Error subiendo ${type}:`, error);
      console.error("Detalles:", {
        message: error.message,
        code: error.code,
        name: error.name,
        stack: error.stack?.substring(0, 200),
      });
      // Re-mapear errores comunes para mostrar mensaje útil (específico para móvil)
      const msg = String(error?.message || "");
      if (msg.includes("CORS") || msg.includes("Access-Control") || msg.includes("fetch")) {
        throw new Error("CORS de S3 bloquea la subida. Agrega http://192.168.1.8:3000 a AllowedOrigins del bucket y permite PUT/GET/HEAD.");
      }
      if (msg.includes("credentials") || msg.includes("Unauthenticated") || msg.includes("Missing credentials") || msg.includes("No estás autenticado")) {
        throw new Error("Credenciales AWS no disponibles. Por favor inicia sesión nuevamente.");
      }
      if (msg.includes("AccessDenied") || msg.includes("Forbidden")) {
        throw new Error("Permisos S3 insuficientes para subir. Revisa políticas de bucket para acceso guest/auth.");
      }
      throw error;
    }
  };

  const getGlobalFilesPropertyFeature = async () => {
    if (!session?.propertyID) return null;

    try {
      // Primero intentar buscar si ya existe
      const response = await API.graphql(
        graphqlOperation(listPropertyFeatures, {
          filter: {
            propertyID: { eq: session.propertyID },
            featureID: { eq: "GLOBAL_PROPERTY_FILES" },
          },
        })
      );

      const existing = response?.data?.listPropertyFeatures?.items?.[0];
      if (existing?.id) return existing;

      // Si no existe, crearlo (igual que en PropertyOwners.jsx)
      const createResponse = await API.graphql(
        graphqlOperation(createPropertyFeature, {
          input: {
            propertyID: session.propertyID,
            featureID: "GLOBAL_PROPERTY_FILES",
            value: "{}",
            isToBlockChain: false,
            isOnMainCard: false,
            isResult: false,
            order: 0,
          },
        })
      );
      return createResponse?.data?.createPropertyFeature || null;
    } catch (error) {
      console.error("Error obteniendo/creando GLOBAL_PROPERTY_FILES:", error);
      return null;
    }
  };

  // Función para determinar el role y propertyRelation basándose en documentos existentes
  const determineOwnerRoleAndRelation = async () => {
    try {
      const globalFeature = await getGlobalFilesPropertyFeature();
      if (!globalFeature?.id) {
        // Si no hay feature, es el primer propietario, asumimos PROPIETARIO con SELF
        return { role: "PROPIETARIO", propertyRelation: "SELF" };
      }

      // Consultar todos los documentos del feature
      const { listDocuments } = await import("graphql/queries");
      const docsResponse = await API.graphql(
        graphqlOperation(listDocuments, {
          filter: {
            propertyFeatureID: { eq: globalFeature.id },
          },
        })
      );

      const allDocs = docsResponse?.data?.listDocuments?.items || [];
      
      let hasPostulante = false;
      let hasPropietario = false;
      let existingPropertyRelation = null;

      // Analizar documentos existentes
      for (const doc of allDocs) {
        try {
          const data = JSON.parse(doc.data || "{}");
          if (data.type === "OWNER_BUNDLE") {
            if (data.role === "POSTULANTE") {
              hasPostulante = true;
            } else if (data.role === "PROPIETARIO") {
              hasPropietario = true;
            }
            
            // Obtener propertyRelation si existe
            if (data.propertyRelation && !existingPropertyRelation) {
              existingPropertyRelation = data.propertyRelation;
            }
          }
        } catch (e) {
          // Ignorar errores de parsing
        }
      }

      // Determinar role
      let role = "PROPIETARIO";
      if (!hasPostulante && !hasPropietario) {
        // Si no hay nada, podría ser POSTULANTE si es tercero, o PROPIETARIO si es propio
        // Por defecto asumimos PROPIETARIO, pero si hay propertyRelation THIRD_PARTY, sería POSTULANTE
        if (existingPropertyRelation === "THIRD_PARTY") {
          role = "POSTULANTE";
        }
      } else if (hasPostulante) {
        // Si ya hay un POSTULANTE, este nuevo es PROPIETARIO
        role = "PROPIETARIO";
      } else {
        // Si solo hay PROPIETARIOS, este nuevo también es PROPIETARIO
        role = "PROPIETARIO";
      }

      // Determinar propertyRelation
      let propertyRelation = "SELF";
      if (existingPropertyRelation) {
        // Si ya existe un propertyRelation, usar el mismo
        propertyRelation = existingPropertyRelation;
      } else {
        // Si no existe, inferir basándose en el role
        if (role === "POSTULANTE") {
          propertyRelation = "THIRD_PARTY";
        } else {
          propertyRelation = "SELF";
        }
      }

      console.log("🔍 Determinado role y propertyRelation:", {
        role,
        propertyRelation,
        hasPostulante,
        hasPropietario,
        existingPropertyRelation,
      });

      return { role, propertyRelation };
    } catch (error) {
      console.error("Error determinando role y propertyRelation:", error);
      // Fallback: PROPIETARIO con SELF
      return { role: "PROPIETARIO", propertyRelation: "SELF" };
    }
  };

  const saveOwnerBundleToDB = async (ownerData) => {
    const globalFeature = await getGlobalFilesPropertyFeature();
    if (!globalFeature?.id) {
      throw new Error("No se encontró GLOBAL_PROPERTY_FILES");
    }

    // Obtener el userID correcto: buscar el User por email del usuario autenticado
    // En desktop se usa propertyData?.propertyInfo?.userID, pero en móvil no tenemos ese contexto
    // Buscamos el User por email del usuario autenticado
    let userId = null;
    try {
      const current = await Auth.currentAuthenticatedUser();
      const userEmail = current?.attributes?.email || ownerData.email;
      
      // Buscar el User en DynamoDB por email usando GraphQL
      const { listUsers } = await import("graphql/queries");
      const userResponse = await API.graphql(
        graphqlOperation(listUsers, {
          filter: { email: { eq: userEmail } },
          limit: 1,
        })
      );
      
      const foundUser = userResponse?.data?.listUsers?.items?.[0];
      if (foundUser?.id) {
        userId = foundUser.id;
        console.log("✅ User encontrado por email:", { email: userEmail, userId });
      } else {
        // Fallback: usar el sub de Cognito (puede fallar si no coincide con el id del User)
        userId = current?.attributes?.sub || null;
        console.warn("⚠️ User no encontrado por email, usando sub como fallback:", userId);
      }
    } catch (error) {
      console.error("❌ Error obteniendo userId:", error);
      // Fallback final: usar el email como string (puede fallar si el schema requiere ID válido)
      userId = ownerData.email;
      console.warn("⚠️ Usando email como userId fallback:", userId);
    }
    
    if (!userId) {
      throw new Error("No se pudo resolver el usuario autenticado para guardar el documento");
    }

    const files = ownerData.files || [];

    const bundleData = {
      type: "OWNER_BUNDLE",
      ownerId: ownerData.ownerId,
      role: ownerData.role,
      name: ownerData.name,
      email: ownerData.email,
      phone: ownerData.phone,
      files: files,
      propertyRelation: ownerData.propertyRelation || "SELF",
      uploadedAt: new Date().toISOString(), // Igual que desktop
    };

    const input = {
      data: JSON.stringify(bundleData),
      url: files[0]?.url || "",
      status: "pending_review",
      visible: true,
      propertyFeatureID: globalFeature.id,
      userID: userId,
    };

    console.log("💾 Guardando OWNER_BUNDLE:", { userId, propertyFeatureID: globalFeature.id, filesCount: files.length });
    try {
      const resp = await API.graphql(graphqlOperation(createDocument, { input }));
      console.log("✅ OWNER_BUNDLE guardado:", resp?.data?.createDocument?.id);
      return resp?.data?.createDocument || null;
    } catch (error) {
      console.error("❌ Error guardando OWNER_BUNDLE:", error);
      console.error("Detalles:", {
        message: error.message,
        errors: error.errors,
        input: { ...input, data: "[JSON string]" }, // No loguear el JSON completo
      });
      throw error;
    }
  };

  const handleSubmit = async () => {
    // Validaciones
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      Swal.fire({
        title: "Campos Requeridos",
        text: "Por favor completa todos los campos.",
        icon: "warning",
        confirmButtonText: "Entendido",
      });
      return;
    }

    if (!documents.idFront || !documents.idBack || !documents.selfie) {
      Swal.fire({
        title: "Documentos Requeridos",
        text: "Por favor sube todos los documentos (cédula frontal, reverso y selfie).",
        icon: "warning",
        confirmButtonText: "Entendido",
      });
      return;
    }

    try {
      setUploading(true);
      Swal.fire({
        title: "Subiendo documentos...",
        text: "Por favor espera",
        icon: "info",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
      });

      const ownerUid = session.ownerId || Date.now().toString();

      // Subir archivos
      setUploadProgress({ idFront: true, idBack: false, selfie: false });
      const idFrontUploaded = await uploadFileToS3(documents.idFront, "idFront");
      
      setUploadProgress({ idFront: true, idBack: true, selfie: false });
      const idBackUploaded = await uploadFileToS3(documents.idBack, "idBack");
      
      setUploadProgress({ idFront: true, idBack: true, selfie: true });
      const selfieUploaded = await uploadFileToS3(documents.selfie, "selfie");

      const files = [
        { type: "USER_ID_FRONT", url: idFrontUploaded.url, s3Key: idFrontUploaded.key, name: documents.idFront.name },
        { type: "USER_ID_BACK", url: idBackUploaded.url, s3Key: idBackUploaded.key, name: documents.idBack.name },
        { type: "USER_SELFIE", url: selfieUploaded.url, s3Key: selfieUploaded.key, name: documents.selfie.name },
      ];

      // Determinar role y propertyRelation basándose en documentos existentes
      const { role, propertyRelation } = await determineOwnerRoleAndRelation();

      // Guardar en DB
      await saveOwnerBundleToDB({
        ownerId: ownerUid,
        role,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        files,
        propertyRelation,
      });

      // Actualizar sesión como completada
      console.log("🔄 Actualizando sesión a 'completed'...");
      const now = Math.floor(Date.now() / 1000); // Timestamp Unix en segundos (igual que PropertyOwners.jsx)
      await API.graphql(
        graphqlOperation(updateOwnerValidationSession, {
          input: {
            id: session.id,
            status: "completed",
            ownerId: ownerUid,
            updatedAt: now, // Timestamp Unix (requerido por AWSTimestamp!)
          },
        })
      );
      console.log("✅ Sesión actualizada exitosamente");

      Swal.close();
      setStep(4);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("❌ Error en submit completo:", error);
      console.error("Detalles del error:", {
        message: error.message,
        name: error.name,
        code: error.code,
        errors: error.errors,
        stack: error.stack?.substring(0, 500),
      });
      
      // Mensaje más específico según el tipo de error
      let msg = error?.message || "Hubo un problema al subir los documentos. Intenta nuevamente.";
      
      if (error.errors && error.errors.length > 0) {
        const firstError = error.errors[0];
        if (firstError.message?.includes("userID") || firstError.message?.includes("User")) {
          msg = "Error de usuario: El usuario no se encontró en el sistema. Verifica que estés usando la cuenta correcta.";
        } else if (firstError.message?.includes("propertyFeatureID") || firstError.message?.includes("PropertyFeature")) {
          msg = "Error de propiedad: No se encontró la propiedad. El token puede ser inválido.";
        } else {
          msg = firstError.message || msg;
        }
      }
      
      Swal.fire({
        title: "Error",
        text: msg,
        icon: "error",
        confirmButtonText: "Entendido",
      });
    } finally {
      setUploading(false);
    }
  };

  const getTimeRemaining = () => {
    if (!session?.expiresAt) return "0";
    const now = Math.floor(Date.now() / 1000);
    const remaining = session.expiresAt - now;
    if (remaining <= 0) return "0";
    const minutes = Math.floor(remaining / 60);
    return minutes.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-terrasacha-primary mx-auto mb-4" />
          <p className="text-gray-600">Verificando token...</p>
        </div>
      </div>
    );
  }

  if (!session || session.expired) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Token Inválido o Expirado</h2>
          <p className="text-gray-600">Por favor, solicita un nuevo enlace desde el computador.</p>
        </div>
      </div>
    );
  }

  // Gate de autenticación (Opción 2A). Si no está autenticado, pedir login antes de continuar
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-terrasacha-primary mx-auto mb-4" />
          <p className="text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
          <h1 className="text-2xl font-bold text-terrasacha-primary mb-4 text-center">Inicia sesión para continuar</h1>
          <p className="text-sm text-gray-600 mb-4 text-center">Usa tu cuenta para completar la validación desde tu teléfono.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usuario (email)</label>
              <input
                type="text"
                name="username"
                value={loginForm.username}
                onChange={handleLoginChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terrasacha-primary focus:border-transparent"
                placeholder="correo@ejemplo.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                name="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terrasacha-primary focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={authLoading}
              className="w-full bg-terrasacha-primary text-white py-3 rounded-lg font-semibold hover:bg-terrasacha-secondary1 transition disabled:opacity-50"
            >
              {authLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" /> Iniciando sesión...
                </span>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Paso 1: Bienvenida
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-terrasacha-primary to-terrasacha-secondary1 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full text-center">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-terrasacha-primary mb-2">Validación de Propietario</h1>
            <p className="text-gray-600 text-sm">Token válido por: <strong>{getTimeRemaining()} minutos</strong></p>
          </div>
          <button
            onClick={() => setStep(2)}
            className="w-full bg-terrasacha-primary text-white py-3 rounded-lg font-semibold hover:bg-terrasacha-secondary1 transition"
          >
            Continuar
          </button>
        </div>
      </div>
    );
  }

  // Paso 2: Formulario
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Información Personal</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terrasacha-primary focus:border-transparent"
                placeholder="Ingresa tu nombre completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terrasacha-primary focus:border-transparent"
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terrasacha-primary focus:border-transparent"
                placeholder="300 123 4567"
              />
            </div>
          </div>

          <button
            onClick={() => setStep(3)}
            className="w-full mt-6 bg-terrasacha-primary text-white py-3 rounded-lg font-semibold hover:bg-terrasacha-secondary1 transition"
          >
            Siguiente
          </button>
        </div>
      </div>
    );
  }

  // Paso 3: Documentos
  if (step === 3) {
    const documentSteps = [
      { key: "idFront", label: "Cédula (Frente)", icon: "📄" },
      { key: "idBack", label: "Cédula (Reverso)", icon: "📄" },
      { key: "selfie", label: "Selfie", icon: "📸" },
    ];

    const currentDocIndex = documentSteps.findIndex((doc) => !documents[doc.key]);
    const currentDoc = currentDocIndex >= 0 ? documentSteps[currentDocIndex] : documentSteps[2];

    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {currentDoc.icon} {currentDoc.label}
            </h2>
            <p className="text-sm text-gray-600">
              Paso {currentDocIndex + 1} de {documentSteps.length}
            </p>
          </div>

          {!previews[currentDoc.key] ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="space-y-4">
                <button
                  onClick={() => handleCameraClick(currentDoc.key)}
                  className="w-full flex items-center justify-center gap-2 bg-terrasacha-primary text-white py-3 rounded-lg font-semibold hover:bg-terrasacha-secondary1 transition"
                >
                  <FaCamera /> Tomar Foto
                </button>
                <button
                  onClick={() => handleGalleryClick(currentDoc.key)}
                  className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  <FaImage /> Seleccionar de Galería
                </button>
              </div>
              {currentDoc.key === "selfie" && (
                <p className="text-xs text-gray-500 mt-4">
                  • Buena iluminación<br />
                  • Rostro visible<br />
                  • Sin gafas de sol
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={previews[currentDoc.key]}
                  alt={currentDoc.label}
                  className="w-full rounded-lg border-2 border-gray-200"
                />
                <button
                  onClick={() => {
                    setDocuments((prev) => ({ ...prev, [currentDoc.key]: null }));
                    setPreviews((prev) => ({ ...prev, [currentDoc.key]: null }));
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                  Eliminar
                </button>
              </div>
              <button
                onClick={() => {
                  if (currentDocIndex < documentSteps.length - 1) {
                    handleCameraClick(documentSteps[currentDocIndex + 1].key);
                  }
                }}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg text-sm"
              >
                Cambiar Foto
              </button>
            </div>
          )}

          <div className="mt-6 flex gap-2">
            {documentSteps.map((doc, idx) => (
              <div
                key={doc.key}
                className={`flex-1 h-2 rounded ${
                  documents[doc.key] ? "bg-green-500" : idx === currentDocIndex ? "bg-terrasacha-primary" : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          {documents.idFront && documents.idBack && documents.selfie && (
            <button
              onClick={handleSubmit}
              disabled={uploading}
              className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" /> Subiendo...
                </span>
              ) : (
                "Enviar"
              )}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Paso 4: Éxito
  if (step === 4) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full text-center">
          <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Validación Completada!</h2>
          <p className="text-gray-600 mb-6">
            Tus documentos han sido subidos exitosamente. El administrador revisará tu información.
          </p>
          <button
            onClick={() => window.close()}
            className="w-full bg-terrasacha-primary text-white py-3 rounded-lg font-semibold hover:bg-terrasacha-secondary1 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default MobileOwnerValidation;

