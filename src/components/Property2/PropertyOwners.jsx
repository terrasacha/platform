import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "context/AuthContext";
import { usePropertyData } from "context/PropertyDataContext";
import { API, graphqlOperation } from "aws-amplify";
import { createDocument, deleteDocument, createPropertyFeature, updateDocument, createVerification } from "graphql/mutations";
import { listPropertyFeatures, listVerifications } from "graphql/queries";
import { toast } from "react-toastify";
import { useS3Client } from "context/s3ClientContext";
import Swal from "sweetalert2";
import {
  FaUser,
  FaUsers,
  FaPlus,
  FaEdit,
  FaTrash,
  FaUpload,
  FaIdCard,
  FaCamera,
} from "react-icons/fa";

// --- Mapeo de roles ---
const roleMapping = {
  constructor: "Constructor",
  legal: "Revisor Legal",
  validator: "Validador",
  admon: "Administrador",
  analyst: "Analista",
};

export default function PropertyOwners({
  visible,
  setHasUnsavedChanges,
  handleFieldChange,
  setIsFormComplete,
  currentStep,
}) {
  const { user } = useAuth();
  const { propertyData, refresh: refreshPropertyData } = usePropertyData();
  const { s3Client, bucketName } = useS3Client();

  // Cache para evitar crear múltiples veces el GLOBAL_PROPERTY_FILES
  const globalFilesFeatureRef = useRef(null);
  const isCreatingGlobalFeatureRef = useRef(false);

  // Estados principales
  const [isThirdParty, setIsThirdParty] = useState(null); // null = no seleccionado, true = tercero, false = propio
  const [owners, setOwners] = useState([]);
  const [loggedUserData, setLoggedUserData] = useState({
    name: "",
    email: "",
    phone: "",
    idFront: null,
    idBack: null,
    selfie: null,
  });

  // Estados para formularios
  const [currentOwner, setCurrentOwner] = useState({
    name: "",
    email: "",
    phone: "",
    idFront: null,
    idBack: null,
    selfie: null,
  });

  const [isAddingOwner, setIsAddingOwner] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'postulante' o 'propietario'
  const [modalTitle, setModalTitle] = useState("");
  const [postulanteData, setPostulanteData] = useState(null); // Datos del postulante guardados
  const [propietariosData, setPropietariosData] = useState([]); // Array de propietarios guardados
  const [showAddPropietario, setShowAddPropietario] = useState(false); // Mostrar card para agregar más propietarios

  // Carga inicial desde DB (OWNER_INFO, OWNER_RELATION, y archivos por ownerId)
  useEffect(() => {
    const loadOwnersFromDB = () => {
      try {
        const pfs = propertyData?.propertyFeatures || [];
        const docs = pfs.flatMap((pf) => (pf?.documents?.items ? pf.documents.items : []));
        if (!docs || docs.length === 0) return;

        const ownerIdToInfo = {};
        const ownerIdToFiles = {};
        let relation = null;

    docs.forEach((d) => {
          let data = {};
          try { data = JSON.parse(d.data || '{}'); } catch { data = {}; }
          const type = data.type;
      if (type === 'OWNER_BUNDLE') {
        const ownerId = data.ownerId || d.id;
        const info = {
          id: ownerId,
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          role: data.role || 'PROPIETARIO',
        };
        ownerIdToInfo[ownerId] = info;
        const files = data.files || [];
        ownerIdToFiles[ownerId] = ownerIdToFiles[ownerId] || {};
        files.forEach((f) => {
          if (f.type === 'USER_ID_FRONT') {
            ownerIdToFiles[ownerId].idFront = f.url;
            ownerIdToFiles[ownerId].idFrontS3Key = f.s3Key;
          }
          if (f.type === 'USER_ID_BACK') {
            ownerIdToFiles[ownerId].idBack = f.url;
            ownerIdToFiles[ownerId].idBackS3Key = f.s3Key;
          }
          if (f.type === 'USER_SELFIE') {
            ownerIdToFiles[ownerId].selfie = f.url;
            ownerIdToFiles[ownerId].selfieS3Key = f.s3Key;
          }
        });
        // Guardar id del bundle para futuras actualizaciones
        ownerIdToFiles[ownerId].ownerBundleDocumentId = d.id;
      } else if (type === 'OWNER_INFO') {
            const ownerId = data.ownerId || d.id; // fallback
            ownerIdToInfo[ownerId] = {
              id: ownerId,
              name: data.name || '',
              email: data.email || '',
              phone: data.phone || '',
              role: data.role || 'PROPIETARIO',
            };
          } else if (type === 'OWNER_RELATION') {
            // Legacy: ya no se usa, pero si existe lo respetamos como fallback
            relation = data.relation === 'THIRD_PARTY' ? true : false;
          } else if (type === 'USER_ID_FRONT' || type === 'USER_ID_BACK' || type === 'USER_SELFIE') {
            const ownerId = data.ownerId;
            if (!ownerId) return;
            if (!ownerIdToFiles[ownerId]) ownerIdToFiles[ownerId] = {};
            if (type === 'USER_ID_FRONT') ownerIdToFiles[ownerId].idFront = data.url || d.url;
            if (type === 'USER_ID_BACK') ownerIdToFiles[ownerId].idBack = data.url || d.url;
            if (type === 'USER_SELFIE') ownerIdToFiles[ownerId].selfie = data.url || d.url;
          }
        });

        // Construir postulante y propietarios con orden de creación
        const propietarios = [];
        let postulante = null;
        const ownersWithCreationDate = [];
        
        Object.keys(ownerIdToInfo).forEach((oid) => {
          const info = ownerIdToInfo[oid];
          const files = ownerIdToFiles[oid] || {};
          
          // Buscar el documento para obtener createdAt
          const ownerDoc = docs.find((d) => {
            try {
              const data = JSON.parse(d.data || '{}');
              return (data.type === 'OWNER_BUNDLE' && (data.ownerId === oid || d.id === files.ownerBundleDocumentId)) ||
                     (data.type === 'OWNER_INFO' && (data.ownerId === oid || d.id === oid));
            } catch {
              return false;
            }
          });
          
          const ownerObj = {
            id: oid,
            name: info.name,
            email: info.email,
            phone: info.phone,
            idFront: files.idFront || null,
            idBack: files.idBack || null,
            selfie: files.selfie || null,
            ownerBundleDocumentId: files.ownerBundleDocumentId || null,
            idFrontS3Key: files.idFrontS3Key || null,
            idBackS3Key: files.idBackS3Key || null,
            selfieS3Key: files.selfieS3Key || null,
            createdAt: ownerDoc?.createdAt || new Date().toISOString(), // Usar createdAt del documento o fecha actual como fallback
          };
          
          if (info.role === 'POSTULANTE') {
            postulante = ownerObj;
          } else {
            ownersWithCreationDate.push(ownerObj);
          }
        });
        
        // Ordenar propietarios por fecha de creación (más antiguos primero)
        ownersWithCreationDate.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateA - dateB; // Orden ascendente (más antiguos primero)
        });
        
        // Copiar los propietarios ordenados al array final
        propietarios.push(...ownersWithCreationDate);

        // Determinar relación preferentemente desde cualquier OWNER_BUNDLE
        if (relation === null) {
          const anyBundle = Object.keys(ownerIdToInfo)[0];
          if (anyBundle) {
            const ownerFiles = ownerIdToFiles[anyBundle] || {};
            const inferred = (docs.find((d)=>{
              try { const data=JSON.parse(d.data||'{}'); return data.type==='OWNER_BUNDLE' && (data.propertyRelation==='THIRD_PARTY'||data.propertyRelation==='SELF'); } catch { return false; }
            }));
            if (inferred) {
              try { const data = JSON.parse(inferred.data||'{}'); relation = data.propertyRelation === 'THIRD_PARTY'; } catch {}
            }
          }
        }
        if (relation !== null) setIsThirdParty(relation);
        else if (postulante) setIsThirdParty(true);
        else if (propietarios.length > 0) setIsThirdParty(false);

        if (postulante) setPostulanteData(postulante);
        if (propietarios.length > 0) {
          setPropietariosData(propietarios);
          setShowAddPropietario(true);
        }
      } catch (e) {
        console.warn('Error cargando propietarios desde DB', e);
      }
    };
    if (propertyData) loadOwnersFromDB();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyData]);

  useEffect(() => {
    if (user) {
      setLoggedUserData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        idFront: null,
        idBack: null,
        selfie: null,
      });
    }
  }, [user]);

  const handleFileUpload = (file, type, ownerIndex = null) => {
    if (!file) return null;

    // Actualizar currentOwner con el archivo seleccionado
    setCurrentOwner((prev) => ({
      ...prev,
      [type]: file,
    }));

    setHasUnsavedChanges(true);
    toast.success("Archivo seleccionado correctamente");
    return file;
  };

  const uploadFileToS3 = async (file, type) => {
    if (!file) return null;

    try {
      const fileKey = `public/property/${
        propertyData?.propertyInfo?.id
      }/owners/${type}/${Date.now()}_${file.name}`;

      const uploadParams = {
        Bucket: bucketName,
        Key: fileKey,
        Body: file,
        ContentType: file.type,
      };

      await s3Client.send(
        new (
          await import("@aws-sdk/client-s3")
        ).PutObjectCommand(uploadParams)
      );

      const rawUrl = `https://${bucketName}.s3.amazonaws.com/${fileKey}`;
      const fileUrl = encodeURI(rawUrl);
      return { url: fileUrl, key: fileKey };
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const getGlobalFilesPropertyFeature = () => {
    try {
      const fromContext = propertyData?.propertyFeatures?.find(
        (feature) => feature.featureID === "GLOBAL_PROPERTY_FILES"
      );
      return fromContext || globalFilesFeatureRef.current || null;
    } catch {
      return null;
    }
  };

  const ensureGlobalFilesPropertyFeature = async () => {
    // Si ya lo tenemos en cache, usarlo
    if (globalFilesFeatureRef.current?.id) return globalFilesFeatureRef.current;

    // Si viene en propertyData, cachearlo
    const fromContext = propertyData?.propertyFeatures?.find(
      (feature) => feature.featureID === "GLOBAL_PROPERTY_FILES"
    );
    if (fromContext?.id) {
      globalFilesFeatureRef.current = fromContext;
      
      // Verificar si existe un verification asociado
      try {
        const verificationResp = await API.graphql(
          graphqlOperation(listVerifications, {
            filter: {
              propertyFeatureID: { eq: fromContext.id },
            },
          })
        );
        
        const existingVerification = verificationResp?.data?.listVerifications?.items?.[0];
        
        if (!existingVerification) {
          // Crear verification si no existe
          const userId = propertyData?.projectPostulant?.id || propertyData?.propertyInfo?.userID;
          if (userId) {
            const verificationInput = {
              propertyFeatureID: fromContext.id,
              userVerifiedID: userId,
            };
            
            await API.graphql(
              graphqlOperation(createVerification, { input: verificationInput })
            );
            console.log("✅ Verification creado para GLOBAL_PROPERTY_FILES desde contexto");
          }
        }
      } catch (verificationErr) {
        console.error("Error verificando/creando verification:", verificationErr);
        // No fallar si hay error con verification
      }
      
      return fromContext;
    }

    // Evitar condiciones de carrera
    if (isCreatingGlobalFeatureRef.current) {
      // Espera activa simple (rápida) hasta 1s
      for (let i = 0; i < 10; i++) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 100));
        if (globalFilesFeatureRef.current?.id) return globalFilesFeatureRef.current;
      }
    }

    if (!propertyData?.propertyInfo?.id) return null;

    // Consultar si existe en backend (por si otro flujo ya lo creó)
    try {
      const resp = await API.graphql(
        graphqlOperation(listPropertyFeatures, {
          filter: {
            propertyID: { eq: propertyData.propertyInfo.id },
            featureID: { eq: "GLOBAL_PROPERTY_FILES" },
          },
        })
      );
      const found = resp?.data?.listPropertyFeatures?.items?.[0] || null;
      if (found?.id) {
        globalFilesFeatureRef.current = found;
        
        // Verificar si existe un verification asociado
        try {
          const verificationResp = await API.graphql(
            graphqlOperation(listVerifications, {
              filter: {
                propertyFeatureID: { eq: found.id },
              },
            })
          );
          
          const existingVerification = verificationResp?.data?.listVerifications?.items?.[0];
          
          if (!existingVerification) {
            // Crear verification si no existe
            const userId = propertyData?.projectPostulant?.id || propertyData?.propertyInfo?.userID;
            if (userId) {
              const verificationInput = {
                propertyFeatureID: found.id,
                userVerifiedID: userId,
              };
              
              await API.graphql(
                graphqlOperation(createVerification, { input: verificationInput })
              );
              console.log("✅ Verification creado para GLOBAL_PROPERTY_FILES existente");
            }
          }
        } catch (verificationErr) {
          console.error("Error verificando/creando verification:", verificationErr);
          // No fallar si hay error con verification
        }
        
        return found;
      }
    } catch (err) {
      console.warn("Fallo consultando listPropertyFeatures:", err);
    }

    // Crear uno nuevo (único)
    try {
      isCreatingGlobalFeatureRef.current = true;
      const input = {
        propertyID: propertyData.propertyInfo.id,
        featureID: "GLOBAL_PROPERTY_FILES",
        value: "{}",
        isToBlockChain: false,
        isOnMainCard: false,
        isResult: false,
        order: 0,
      };
      const resp = await API.graphql(
        graphqlOperation(createPropertyFeature, { input })
      );
      const created = resp?.data?.createPropertyFeature || null;
      if (created?.id) {
        globalFilesFeatureRef.current = created;
        
        // Crear Verification asociado al Property Feature
        try {
          const userId = propertyData?.projectPostulant?.id || propertyData?.propertyInfo?.userID;
          if (userId) {
            // Verificar si ya existe un verification para este feature
            const verificationResp = await API.graphql(
              graphqlOperation(listVerifications, {
                filter: {
                  propertyFeatureID: { eq: created.id },
                },
              })
            );
            
            const existingVerification = verificationResp?.data?.listVerifications?.items?.[0];
            
            if (!existingVerification) {
              // Crear verification solo si no existe
              const verificationInput = {
                propertyFeatureID: created.id,
                userVerifiedID: userId,
              };
              
              await API.graphql(
                graphqlOperation(createVerification, { input: verificationInput })
              );
              console.log("✅ Verification creado para GLOBAL_PROPERTY_FILES");
            } else {
              console.log("ℹ️ Verification ya existe para este feature");
            }
          } else {
            console.warn("⚠️ No se pudo crear verification: userId no disponible");
          }
        } catch (verificationErr) {
          console.error("Error creando verification:", verificationErr);
          // No fallar si la creación del verification falla
        }
      }
      return created;
    } catch (err) {
      console.error("Error creando GLOBAL_PROPERTY_FILES:", err);
      return null;
    } finally {
      isCreatingGlobalFeatureRef.current = false;
    }
  };

  const saveDocumentToDB = async ({ url, name, typeCode, s3Key, extraData }) => {
    const globalFeature = await ensureGlobalFilesPropertyFeature();
    if (!globalFeature?.id) return null;

    const userId = propertyData?.projectPostulant?.id || propertyData?.propertyInfo?.userID;
    const input = {
      data: JSON.stringify({ name, type: typeCode, url, s3Key, ...(extraData || {}) }),
      url,
      status: "pending_review",
      visible: true,
      propertyFeatureID: globalFeature.id,
      userID: userId,
    };
    try {
      const resp = await API.graphql(graphqlOperation(createDocument, { input }));
      return resp?.data?.createDocument || null;
    } catch (err) {
      console.error("Error creando Document en DB:", err);
      return null;
    }
  };

  const deleteFileAndRecord = async ({ s3Key, documentId }) => {
    try {
      Swal.fire({
        title: "Eliminando documento...",
        text: "Por favor espera mientras se elimina el archivo",
        icon: "info",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
      });

      if (s3Key) {
        const { DeleteObjectCommand } = await import("@aws-sdk/client-s3");
        await s3Client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: s3Key }));
      }
      if (documentId) {
        await API.graphql(graphqlOperation(deleteDocument, { input: { id: documentId } }));
      }

      Swal.close();
      toast.success("Documento eliminado");
      
      // Refrescar los datos del predio para que se vean en otros tabs
      if (refreshPropertyData) {
        await refreshPropertyData();
      }
    } catch (err) {
      console.error("Error eliminando documento:", err);
      Swal.fire({
        title: "Error al eliminar",
        text: "No fue posible eliminar el documento. Intenta nuevamente.",
        icon: "error",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#8B4513",
      });
      throw err;
    }
  };

  const extractKeyFromUrl = (url) => {
    try {
      const u = new URL(url);
      return decodeURIComponent(u.pathname.startsWith('/') ? u.pathname.slice(1) : u.pathname);
    } catch {
      return null;
    }
  };

  // Relación se integrará dentro del OWNER_BUNDLE (no se crea Document separado)

  const saveOwnerBundleToDB = async ({ ownerId, role, name, email, phone, files, bundleDocumentId, propertyRelation }) => {
    const globalFeature = await ensureGlobalFilesPropertyFeature();
    if (!globalFeature?.id) return null;
    const userId = propertyData?.projectPostulant?.id || propertyData?.propertyInfo?.userID;
    const bundle = {
      type: "OWNER_BUNDLE",
      ownerId,
      role,
      name,
      email,
      phone,
      files,
      uploadedAt: new Date().toISOString(),
      propertyRelation,
    };
    try {
      if (bundleDocumentId) {
        // Cuando se actualiza un documento rechazado, resetear el estado a pending_review
        const resp = await API.graphql(
          graphqlOperation(updateDocument, {
            input: {
              id: bundleDocumentId,
              data: JSON.stringify(bundle),
              status: "pending_review", // Resetear estado a pending_review
              isApproved: false, // Resetear aprobación
            },
          })
        );
        return resp?.data?.updateDocument || null;
      }
      const resp = await API.graphql(
        graphqlOperation(createDocument, {
          input: {
            data: JSON.stringify(bundle),
            status: "pending_review",
            visible: true,
            propertyFeatureID: globalFeature.id,
            userID: userId,
          },
        })
      );
      return resp?.data?.createDocument || null;
    } catch (err) {
      console.error("Error guardando OWNER_BUNDLE en DB:", err);
      return null;
    }
  };

  const openModal = (type) => {
    setModalType(type);
    if (type === "postulante") {
      setModalTitle("Información del Postulante");
    } else {
      setModalTitle("Información del Propietario");
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setModalTitle("");
    setCurrentOwner({
      name: "",
      email: "",
      phone: "",
      idFront: null,
      idBack: null,
      selfie: null,
    });
    setEditingIndex(-1);
  };

  const addOwner = async () => {
    // Validar campos requeridos
    if (!currentOwner.name || !currentOwner.email || !currentOwner.phone) {
      Swal.fire({
        title: "Campos Requeridos",
        text: "Por favor completa todos los campos obligatorios (Nombre, Email, Teléfono)",
        icon: "warning",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#8B4513",
      });
      return;
    }

    // Si estamos editando, permitir que los archivos existentes se mantengan
    const isEditing = editingIndex !== -1;
    const hasValidFiles = currentOwner.idFront instanceof File && 
                         currentOwner.idBack instanceof File && 
                         currentOwner.selfie instanceof File;
    
    if (!isEditing && !hasValidFiles) {
      Swal.fire({
        title: "Documentos Requeridos",
        text: "Por favor sube todos los documentos obligatorios (Cédula frente, Cédula reverso, Selfie)",
        icon: "warning",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#8B4513",
      });
      return;
    }

    try {
      // Mostrar loading
      Swal.fire({
        title: "Subiendo archivos...",
        text: "Por favor espera mientras se suben los documentos",
        icon: "info",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Si estamos editando, usar el ID existente, sino generar uno nuevo
      const ownerUid = (editingIndex === -2 && postulanteData?.id) || 
                      (editingIndex >= 0 && propietariosData[editingIndex]?.id) || 
                      Date.now().toString();

      // Subir archivos al S3 (solo si son nuevos archivos File)
      let idFrontUploaded = currentOwner.idFrontS3Key ? { url: currentOwner.idFront, key: currentOwner.idFrontS3Key } : null;
      let idBackUploaded = currentOwner.idBackS3Key ? { url: currentOwner.idBack, key: currentOwner.idBackS3Key } : null;
      let selfieUploaded = currentOwner.selfieS3Key ? { url: currentOwner.selfie, key: currentOwner.selfieS3Key } : null;

      if (currentOwner.idFront instanceof File) {
        idFrontUploaded = await uploadFileToS3(currentOwner.idFront, "idFront");
      }
      if (currentOwner.idBack instanceof File) {
        idBackUploaded = await uploadFileToS3(currentOwner.idBack, "idBack");
      }
      if (currentOwner.selfie instanceof File) {
        selfieUploaded = await uploadFileToS3(currentOwner.selfie, "selfie");
      }

      // Si no hay archivos válidos, no continuar
      if (!idFrontUploaded || !idBackUploaded || !selfieUploaded) {
        Swal.fire({
          title: "Documentos Requeridos",
          text: "Por favor sube todos los documentos obligatorios (Cédula frente, Cédula reverso, Selfie)",
          icon: "warning",
          confirmButtonText: "Entendido",
          confirmButtonColor: "#8B4513",
        });
        return;
      }

      // Guardar en DB un único OWNER_BUNDLE con toda la info del propietario
      const files = [
        { type: "USER_ID_FRONT", url: idFrontUploaded.url, s3Key: idFrontUploaded.key, name: currentOwner.idFront?.name || "idFront" },
        { type: "USER_ID_BACK", url: idBackUploaded.url, s3Key: idBackUploaded.key, name: currentOwner.idBack?.name || "idBack" },
        { type: "USER_SELFIE", url: selfieUploaded.url, s3Key: selfieUploaded.key, name: currentOwner.selfie?.name || "selfie" },
      ];
      
      const bundleDoc = await saveOwnerBundleToDB({
        ownerId: ownerUid,
        role: modalType === "postulante" ? "POSTULANTE" : "PROPIETARIO",
        name: currentOwner.name,
        email: currentOwner.email,
        phone: currentOwner.phone,
        files,
        bundleDocumentId: currentOwner.ownerBundleDocumentId,
        propertyRelation: isThirdParty ? 'THIRD_PARTY' : 'SELF',
      });

      // Crear objeto con URLs y metadatos
      const ownerData = {
        id: ownerUid,
        name: currentOwner.name,
        email: currentOwner.email,
        phone: currentOwner.phone,
        idFront: idFrontUploaded.url,
        idBack: idBackUploaded.url,
        selfie: selfieUploaded.url,
        ownerBundleDocumentId: bundleDoc?.id || currentOwner.ownerBundleDocumentId || null,
        idFrontS3Key: idFrontUploaded.key,
        idBackS3Key: idBackUploaded.key,
        selfieS3Key: selfieUploaded.key,
      };

      if (modalType === "postulante") {
        setPostulanteData(ownerData);
        // OWNER_BUNDLE ya guarda toda la información
        Swal.fire({
          title: editingIndex === -2 ? "¡Información Actualizada!" : "¡Información Guardada!",
          text: editingIndex === -2 ? "La información del postulante ha sido actualizada exitosamente" : "La información del postulante ha sido guardada exitosamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        if (editingIndex >= 0) {
          // Actualizar propietario existente
          const updated = [...propietariosData];
          updated[editingIndex] = ownerData;
          setPropietariosData(updated);
          Swal.fire({
            title: "¡Propietario Actualizado!",
            text: "La información del propietario ha sido actualizada exitosamente",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          // Agregar propietario al array
          setPropietariosData(prev => [...prev, ownerData]);
          // OWNER_BUNDLE ya guarda toda la información
          setShowAddPropietario(true); // Mostrar card para agregar más
          Swal.fire({
            title: "¡Propietario Agregado!",
            text: "La información del propietario ha sido guardada exitosamente",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      }
      
      // Refrescar los datos del predio PRIMERO para que la interfaz se actualice
      if (refreshPropertyData) {
        await refreshPropertyData();
      }
      
      // Esperar un momento para que el estado se actualice
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setCurrentOwner({
        name: "",
        email: "",
        phone: "",
        idFront: null,
        idBack: null,
        selfie: null,
      });
      setIsAddingOwner(false);
      setHasUnsavedChanges(true);
      closeModal();
    } catch (error) {
      console.error("Error uploading files:", error);
      Swal.fire({
        title: "Error al Subir Archivos",
        text: "Hubo un problema al subir los documentos. Por favor intenta nuevamente.",
        icon: "error",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#8B4513",
      });
    }
  };

  const editOwner = (index) => {
    setCurrentOwner({ ...owners[index] });
    setEditingIndex(index);
    setIsAddingOwner(true);
  };

  const editPostulante = () => {
    if (!postulanteData) return;
    setCurrentOwner({
      name: postulanteData.name || "",
      email: postulanteData.email || "",
      phone: postulanteData.phone || "",
      idFront: null, // Permitir que el usuario suba un nuevo archivo
      idBack: null,
      selfie: null,
      id: postulanteData.id,
      ownerBundleDocumentId: postulanteData.ownerBundleDocumentId,
      idFrontS3Key: postulanteData.idFrontS3Key,
      idBackS3Key: postulanteData.idBackS3Key,
      selfieS3Key: postulanteData.selfieS3Key,
      // Mantener URLs originales para referencia
      idFrontUrl: postulanteData.idFront,
      idBackUrl: postulanteData.idBack,
      selfieUrl: postulanteData.selfie,
    });
    setModalType("postulante");
    setModalTitle("Editar Información del Postulante");
    setEditingIndex(-2); // -2 para identificar que es postulante
    setShowModal(true);
  };

  const editPropietario = (index) => {
    if (index < 0 || index >= propietariosData.length) return;
    const propietario = propietariosData[index];
    setCurrentOwner({
      name: propietario.name || "",
      email: propietario.email || "",
      phone: propietario.phone || "",
      idFront: null, // Permitir que el usuario suba un nuevo archivo
      idBack: null,
      selfie: null,
      id: propietario.id,
      ownerBundleDocumentId: propietario.ownerBundleDocumentId,
      idFrontS3Key: propietario.idFrontS3Key,
      idBackS3Key: propietario.idBackS3Key,
      selfieS3Key: propietario.selfieS3Key,
      // Mantener URLs originales para referencia
      idFrontUrl: propietario.idFront,
      idBackUrl: propietario.idBack,
      selfieUrl: propietario.selfie,
    });
    setModalType("propietario");
    setModalTitle("Editar Información del Propietario");
    setEditingIndex(index); // índice en propietariosData
    setShowModal(true);
  };

  const updateOwner = async () => {
    // Validar campos requeridos
    if (!currentOwner.name || !currentOwner.email || !currentOwner.phone) {
      Swal.fire({
        title: "Campos Requeridos",
        text: "Por favor completa todos los campos obligatorios (Nombre, Email, Teléfono)",
        icon: "warning",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#8B4513",
      });
      return;
    }

    // Validar documentos requeridos
    const hasValidFiles = currentOwner.idFront instanceof File && 
                         currentOwner.idBack instanceof File && 
                         currentOwner.selfie instanceof File;
    
    if (!hasValidFiles) {
      Swal.fire({
        title: "Documentos Requeridos",
        text: "Por favor sube todos los documentos obligatorios (Cédula frente, Cédula reverso, Selfie)",
        icon: "warning",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#8B4513",
      });
      return;
    }

    if (editingIndex >= 0) {
      try {
        // Mostrar loading
        Swal.fire({
          title: "Subiendo archivos...",
          text: "Por favor espera mientras se suben los documentos",
          icon: "info",
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // Subir archivos al S3
        const ownerUid = currentOwner.id || Date.now().toString();
        const [idFrontUploaded, idBackUploaded, selfieUploaded] = await Promise.all([
          uploadFileToS3(currentOwner.idFront, "idFront"),
          uploadFileToS3(currentOwner.idBack, "idBack"),
          uploadFileToS3(currentOwner.selfie, "selfie")
        ]);
        const files = [
          { type: "USER_ID_FRONT", url: idFrontUploaded.url, s3Key: idFrontUploaded.key, name: currentOwner.idFront.name },
          { type: "USER_ID_BACK", url: idBackUploaded.url, s3Key: idBackUploaded.key, name: currentOwner.idBack.name },
          { type: "USER_SELFIE", url: selfieUploaded.url, s3Key: selfieUploaded.key, name: currentOwner.selfie.name },
        ];
        const bundleDoc = await saveOwnerBundleToDB({
          ownerId: ownerUid,
          role: "PROPIETARIO",
          name: currentOwner.name,
          email: currentOwner.email,
          phone: currentOwner.phone,
          files,
          bundleDocumentId: owners[editingIndex]?.ownerBundleDocumentId,
          propertyRelation: isThirdParty ? 'THIRD_PARTY' : 'SELF',
        });

        // Crear objeto con URLs y metadatos
        const updatedOwnerData = {
          ...currentOwner,
          idFront: idFrontUploaded.url,
          idBack: idBackUploaded.url,
          selfie: selfieUploaded.url,
          ownerBundleDocumentId: bundleDoc?.id || owners[editingIndex]?.ownerBundleDocumentId || null,
          idFrontS3Key: idFrontUploaded.key,
          idBackS3Key: idBackUploaded.key,
          selfieS3Key: selfieUploaded.key,
        };

        const updatedOwners = [...owners];
        updatedOwners[editingIndex] = updatedOwnerData;
        setOwners(updatedOwners);
        // OWNER_BUNDLE ya guarda toda la información
        setEditingIndex(-1);
        setIsAddingOwner(false);
        setCurrentOwner({
          name: "",
          email: "",
          phone: "",
          idFront: null,
          idBack: null,
          selfie: null,
        });
        setHasUnsavedChanges(true);
        
        Swal.fire({
          title: "¡Propietario Actualizado!",
          text: "La información del propietario ha sido actualizada exitosamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        
        closeModal();
        
        // Refrescar los datos del predio para que se vean en otros tabs
        if (refreshPropertyData) {
          await refreshPropertyData();
        }
      } catch (error) {
        console.error("Error uploading files:", error);
        Swal.fire({
          title: "Error al Subir Archivos",
          text: "Hubo un problema al subir los documentos. Por favor intenta nuevamente.",
          icon: "error",
          confirmButtonText: "Entendido",
          confirmButtonColor: "#8B4513",
        });
      }
    }
  };

  const removeOwner = (index) => {
    const updatedOwners = owners.filter((_, i) => i !== index);
    setOwners(updatedOwners);
    setHasUnsavedChanges(true);
    toast.success("Propietario eliminado");
  };

  const handleDeleteOwnerDoc = async (index, which) => {
    const owner = owners[index];
    if (!owner) return;
    const map = {
      idFront: { url: owner.idFront, docId: owner.idFrontDocumentId, key: owner.idFrontS3Key },
      idBack: { url: owner.idBack, docId: owner.idBackDocumentId, key: owner.idBackS3Key },
      selfie: { url: owner.selfie, docId: owner.selfieDocumentId, key: owner.selfieS3Key },
    };
    const target = map[which];
    if (!target) return;
    await deleteFileAndRecord({ s3Key: target.key || extractKeyFromUrl(target.url), documentId: target.docId });
    // Si existe bundle, actualizarlo removiendo el archivo
    if (owner.ownerBundleDocumentId) {
      try {
        const remaining = ['idFront','idBack','selfie']
          .filter((k) => k !== which)
          .map((k) => ({
            type: k === 'idFront' ? 'USER_ID_FRONT' : k === 'idBack' ? 'USER_ID_BACK' : 'USER_SELFIE',
            url: owner[k],
            s3Key: owner[`${k}S3Key`],
            name: undefined,
          }))
          .filter((f) => !!f.url);
        await saveOwnerBundleToDB({
          ownerId: owner.id,
          role: 'PROPIETARIO',
          name: owner.name,
          email: owner.email,
          phone: owner.phone,
          files: remaining,
          bundleDocumentId: owner.ownerBundleDocumentId,
        });
      } catch (e) {
        console.warn('No se pudo actualizar OWNER_BUNDLE tras eliminar archivo', e);
      }
    }
    const updated = [...owners];
    updated[index] = {
      ...owner,
      [which]: null,
      [`${which}DocumentId`]: null,
      [`${which}S3Key`]: null,
    };
    setOwners(updated);
    setHasUnsavedChanges(true);
  };

  const removePropietario = async (id) => {
    try {
      // Encontrar el propietario a eliminar
      const propietarioToDelete = propietariosData.find(prop => prop.id === id);
      if (!propietarioToDelete) {
        toast.error("No se encontró el propietario a eliminar");
        return;
      }

      // Confirmar eliminación
      const result = await Swal.fire({
        title: "¿Eliminar propietario?",
        text: `¿Estás seguro de que deseas eliminar a ${propietarioToDelete.name}? Esta acción no se puede deshacer.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#dc3545",
        cancelButtonColor: "#6c757d",
      });

      if (!result.isConfirmed) {
        return;
      }

      // Mostrar loading
      Swal.fire({
        title: "Eliminando propietario...",
        text: "Por favor espera mientras se elimina la información",
        icon: "info",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
      });

      // Eliminar archivos de S3 si existen
      const filesToDelete = [];
      if (propietarioToDelete.idFrontS3Key) {
        filesToDelete.push({ s3Key: propietarioToDelete.idFrontS3Key });
      }
      if (propietarioToDelete.idBackS3Key) {
        filesToDelete.push({ s3Key: propietarioToDelete.idBackS3Key });
      }
      if (propietarioToDelete.selfieS3Key) {
        filesToDelete.push({ s3Key: propietarioToDelete.selfieS3Key });
      }

      // Eliminar archivos de S3
      if (filesToDelete.length > 0) {
        const { DeleteObjectCommand } = await import("@aws-sdk/client-s3");
        await Promise.all(
          filesToDelete.map(({ s3Key }) =>
            s3Client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: s3Key }))
          )
        );
      }

      // Eliminar el documento OWNER_BUNDLE de la base de datos
      if (propietarioToDelete.ownerBundleDocumentId) {
        await API.graphql(
          graphqlOperation(deleteDocument, {
            input: { id: propietarioToDelete.ownerBundleDocumentId },
          })
        );
      }

      // Eliminar del estado local
      const updatedPropietarios = propietariosData.filter(prop => prop.id !== id);
      setPropietariosData(updatedPropietarios);
      
      // Si no quedan más propietarios, ocultar el card de agregar
      if (updatedPropietarios.length === 0) {
        setShowAddPropietario(false);
      }

      setHasUnsavedChanges(true);
      
      Swal.close();
      toast.success("Propietario eliminado exitosamente");
      
      // Refrescar los datos del predio para que se vean en otros tabs
      if (refreshPropertyData) {
        await refreshPropertyData();
      }
    } catch (error) {
      console.error("Error eliminando propietario:", error);
      Swal.fire({
        title: "Error al eliminar",
        text: "No fue posible eliminar el propietario. Intenta nuevamente.",
        icon: "error",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#8B4513",
      });
    }
  };

  const hasDataEntered = () => {
    return postulanteData !== null || propietariosData.length > 0;
  };

  const cancelEdit = () => {
    setCurrentOwner({
      name: "",
      email: "",
      phone: "",
      idFront: null,
      idBack: null,
      selfie: null,
    });
    setIsAddingOwner(false);
    setEditingIndex(-1);
  };

  const validateOwnerData = (ownerData, isLoggedUser = false) => {
    const errors = [];

    // Validar campos obligatorios
    if (!ownerData.name || ownerData.name.trim() === "") {
      errors.push(
        `${isLoggedUser ? "Tu" : "El propietario"} nombre es obligatorio`
      );
    }

    if (!ownerData.email || ownerData.email.trim() === "") {
      errors.push(
        `${
          isLoggedUser ? "Tu" : "El propietario"
        } correo electrónico es obligatorio`
      );
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerData.email)) {
      errors.push(
        `${
          isLoggedUser ? "Tu" : "El propietario"
        } correo electrónico no tiene un formato válido`
      );
    }

    if (!ownerData.phone || ownerData.phone.trim() === "") {
      errors.push(
        `${isLoggedUser ? "Tu" : "El propietario"} teléfono es obligatorio`
      );
    }

    // Validar documentos obligatorios
    if (!ownerData.idFront) {
      errors.push(
        `${
          isLoggedUser ? "Tu" : "El propietario"
        } cédula (frente) es obligatoria`
      );
    }

    if (!ownerData.idBack) {
      errors.push(
        `${
          isLoggedUser ? "Tu" : "El propietario"
        } cédula (reverso) es obligatoria`
      );
    }

    if (!ownerData.selfie) {
      errors.push(
        `${isLoggedUser ? "Tu" : "El propietario"} selfie es obligatoria`
      );
    }

    return errors;
  };


  if (!visible || !propertyData) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Pregunta inicial - Siempre visible */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-terrasacha-light/20 shadow-terrasacha">
        <h2 className="text-lg sm:text-xl font-bold text-terrasacha-primary mb-4 font-typographica">
          ¿Cuál es tu relación con esta propiedad?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={async () => {
              if (hasDataEntered()) return;
              setIsThirdParty(false);
              // Relación se integrará en OWNER_BUNDLE al crear el primer propietario
            }}
            disabled={hasDataEntered()}
            className={`p-4 sm:p-6 border-2 rounded-xl transition-colors text-left ${
              isThirdParty === false
                ? "border-terrasacha-primary bg-terrasacha-primary/5"
                : hasDataEntered()
                ? "border-[#849b50]/30 bg-[#b1c181]/10 cursor-not-allowed opacity-60"
                : "border-terrasacha-light hover:border-terrasacha-primary"
            }`}
          >
            <div className="text-3xl sm:text-4xl mb-3">👤</div>
            <h3 className="text-base sm:text-lg font-semibold text-terrasacha-primary mb-2 font-typographica">
              Soy propietario
            </h3>
            <p className="text-sm sm:text-base text-terrasacha-secondary1 font-typographica">
              La propiedad está a mi nombre (puede tener otros propietarios)
            </p>
            {isThirdParty === false && (
              <div className="mt-3 text-sm text-terrasacha-primary font-semibold font-typographica">
                ✓ Seleccionado
              </div>
            )}
            {hasDataEntered() && isThirdParty !== false && (
              <div className="mt-3 text-sm text-[#6e6c35] font-semibold font-typographica">
                🔒 Bloqueado
              </div>
            )}
          </button>
          <button
            onClick={async () => {
              if (hasDataEntered()) return;
              setIsThirdParty(true);
              // Relación se integrará en OWNER_BUNDLE al crear el primer propietario
            }}
            disabled={hasDataEntered()}
            className={`p-4 sm:p-6 border-2 rounded-xl transition-colors text-left ${
              isThirdParty === true
                ? "border-terrasacha-primary bg-terrasacha-primary/5"
                : hasDataEntered()
                ? "border-[#849b50]/30 bg-[#b1c181]/10 cursor-not-allowed opacity-60"
                : "border-terrasacha-light hover:border-terrasacha-primary"
            }`}
          >
            <div className="text-3xl sm:text-4xl mb-3">👥</div>
            <h3 className="text-base sm:text-lg font-semibold text-terrasacha-primary mb-2 font-typographica">
              Es de un tercero
            </h3>
            <p className="text-sm sm:text-base text-terrasacha-secondary1 font-typographica">
              La propiedad está a nombre de otra(s) persona(s)
            </p>
            {isThirdParty === true && (
              <div className="mt-3 text-sm text-terrasacha-primary font-semibold font-typographica">
                ✓ Seleccionado
              </div>
            )}
            {hasDataEntered() && isThirdParty !== true && (
              <div className="mt-3 text-sm text-[#6e6c35] font-semibold font-typographica">
                🔒 Bloqueado
              </div>
            )}
          </button>
        </div>
        {hasDataEntered() && isThirdParty === null && (
          <div className="mt-4 p-3 sm:p-4 bg-[#e8d79a]/20 border border-[#e8d79a] rounded-lg">
            <p className="text-xs sm:text-sm text-[#6e6c35] font-typographica mb-0">
              ℹ️ Una vez que has ingresado información, no puedes cambiar tu relación con la propiedad.
            </p>
          </div>
        )}
      </div>

      {/* Formulario de propietarios */}
      {isThirdParty !== null && (
        <>
          {/* Sección de Propietarios con Cards */}
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-terrasacha-light/20 shadow-terrasacha">
            <div className="mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-bold text-terrasacha-primary font-typographica mb-2">
                Identificación de postulante y/o propietario(s)
              </h3>
              <p className="text-xs sm:text-sm text-terrasacha-secondary1 font-typographica">
                Agrega la información de todos los propietarios de la propiedad
              </p>
            </div>

            {/* Mensaje informativo */}
            <div className="bg-terrasacha-light/10 border border-terrasacha-light/30 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-terrasacha-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-terrasacha-primary text-xs sm:text-sm font-bold">
                      ℹ
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-terrasacha-primary font-typographica mb-1">
                    Información Importante
                  </h4>
                  <p className="text-xs sm:text-sm text-terrasacha-secondary1 font-typographica mb-0">
                    Todos los propietarios de la propiedad deben ser
                    diligenciados en el sistema. Asegúrate de agregar la
                    información completa de cada propietario, incluyendo sus
                    datos personales y documentos de identificación.
                  </p>
                </div>
              </div>
            </div>

            {/* Cards de Propietarios */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
              {/* Card Postulante (solo si es tercero) */}
              {isThirdParty && (
                <div
                  onClick={() => !postulanteData && openModal("postulante")}
                  className={`group p-4 sm:p-6 border-2 rounded-xl transition-all duration-300 flex flex-col h-full ${
                    postulanteData
                      ? "border-terrasacha-primary bg-terrasacha-primary/5 cursor-default"
                      : "border-dashed border-terrasacha-light hover:border-terrasacha-primary hover:bg-terrasacha-primary/5 cursor-pointer"
                  }`}
                >
                  {postulanteData ? (
                    <div className="text-center w-full flex flex-col h-full">
                      <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#b1c181]/20 rounded-full flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#849b50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h4 className="text-sm sm:text-lg font-semibold text-terrasacha-primary font-typographica mb-2">
                          {postulanteData.name}
                        </h4>
                        <p className="text-xs sm:text-sm text-terrasacha-secondary1 font-typographica mb-2 sm:mb-3">
                          Postulante (Yo)
                        </p>
                      </div>
                      {/* Estado de validación al final */}
                      <div className="mt-auto">
                      {(() => {
                        // Obtener el estado del postulante desde propertyData
                        const postulanteDoc = propertyData?.propertyFeatures
                          ?.flatMap(pf => pf?.documents?.items || [])
                          .find(d => {
                            try {
                              const data = JSON.parse(d.data || '{}');
                              return data.type === 'OWNER_BUNDLE' && data.role === 'POSTULANTE' && 
                                     (data.ownerId === postulanteData.id || d.id === postulanteData.ownerBundleDocumentId);
                            } catch {
                              return false;
                            }
                          });
                        
                        const status = postulanteDoc?.status || 'pending_review';
                        const isApproved = postulanteDoc?.isApproved || false;
                        
                        if (isApproved || status === 'approved') {
                          return (
                            <div className="bg-[#b1c181]/20 border border-[#849b50] rounded-lg p-2">
                              <p className="text-xs text-[#849b50] font-semibold font-typographica mb-0">
                                ✓ Aprobado
                              </p>
                            </div>
                          );
                        }
                        if (status === 'rejected' || status === 'rechazado') {
                          return (
                            <div 
                              onClick={() => editPostulante()}
                              className="bg-[#44482c]/10 border border-[#44482c] rounded-lg p-2 cursor-pointer hover:bg-[#44482c]/20 transition-colors"
                            >
                              <div className="flex items-center justify-center gap-1.5 mb-1.5">
                                <span className="text-[#44482c] text-sm">✗</span>
                                <p className="text-xs text-[#44482c] font-semibold font-typographica mb-0">
                                  Rechazado
                                </p>
                              </div>
                              <p className="text-xs text-[#44482c] font-typographica mb-2 text-center">
                                Haz clic para subir una versión corregida
                              </p>
                              <button className="w-full bg-[#44482c] hover:bg-[#6e6c35] text-white font-semibold py-1.5 px-3 rounded transition-colors font-typographica text-xs flex items-center justify-center gap-1.5">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                Volver a Subir
                              </button>
                            </div>
                          );
                        }
                        return (
                          <div className="bg-[#e8d79a]/20 border border-[#e8d79a] rounded-lg p-2">
                            <p className="text-xs text-[#6e6c35] font-semibold font-typographica mb-0">
                              ⏳ En espera de validación
                            </p>
                          </div>
                        );
                      })()}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#b1c181]/20 rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-[#b1c181]/30 transition-colors">
                        <FaPlus className="text-[#849b50] text-lg sm:text-2xl" />
                      </div>
                      <h4 className="text-sm sm:text-lg font-semibold text-terrasacha-primary font-typographica mb-2">
                        Postulante (Yo) <span className="text-[#849b50]">*</span>
                      </h4>
                      <p className="text-xs sm:text-sm text-terrasacha-secondary1 font-typographica">
                        Agregar mi información
                      </p>
                      <div className="bg-[#849b50]/20 border border-[#849b50] rounded-lg p-2 mt-2">
                        <p className="text-xs text-[#849b50] font-semibold font-typographica mb-0">
                          ⚠️ Requerido
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Card Propietario Principal */}
              <div
                onClick={() => propietariosData.length === 0 && openModal("propietario")}
                className={`group p-6 border-2 rounded-xl transition-all duration-300 flex flex-col h-full ${
                  propietariosData.length > 0
                    ? "border-terrasacha-primary bg-terrasacha-primary/5 cursor-default"
                    : "border-dashed border-terrasacha-light hover:border-terrasacha-primary hover:bg-terrasacha-primary/5 cursor-pointer"
                }`}
              >
                {propietariosData.length > 0 ? (
                  <div className="text-center w-full flex flex-col h-full">
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-[#b1c181]/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <svg className="w-8 h-8 text-[#849b50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-terrasacha-primary font-typographica mb-2">
                        {propietariosData[0].name}
                      </h4>
                      <p className="text-sm text-terrasacha-secondary1 font-typographica mb-3">
                        {isThirdParty ? "Propietario" : "Propietario (Yo)"}
                      </p>
                    </div>
                    {/* Estado de validación al final */}
                    <div className="mt-auto">
                    {(() => {
                        // Obtener el estado del propietario desde propertyData
                        const propietarioDoc = propertyData?.propertyFeatures
                          ?.flatMap(pf => pf?.documents?.items || [])
                          .find(d => {
                            try {
                              const data = JSON.parse(d.data || '{}');
                              return data.type === 'OWNER_BUNDLE' && 
                                     (data.ownerId === propietariosData[0].id || d.id === propietariosData[0].ownerBundleDocumentId);
                            } catch {
                              return false;
                            }
                          });
                        
                        const status = propietarioDoc?.status || 'pending_review';
                        const isApproved = propietarioDoc?.isApproved || false;
                        
                        if (isApproved || status === 'approved') {
                          return (
                            <div className="bg-[#b1c181]/20 border border-[#849b50] rounded-lg p-2">
                              <p className="text-xs text-[#849b50] font-semibold font-typographica mb-0">
                                ✓ Aprobado
                              </p>
                            </div>
                          );
                        }
                        if (status === 'rejected' || status === 'rechazado') {
                          return (
                            <div 
                              onClick={() => editPropietario(0)}
                              className="bg-[#44482c]/10 border border-[#44482c] rounded-lg p-2 cursor-pointer hover:bg-[#44482c]/20 transition-colors"
                            >
                              <div className="flex items-center justify-center gap-1.5 mb-1.5">
                                <span className="text-[#44482c] text-sm">✗</span>
                                <p className="text-xs text-[#44482c] font-semibold font-typographica mb-0">
                                  Rechazado
                                </p>
                              </div>
                              <p className="text-xs text-[#44482c] font-typographica mb-2 text-center">
                                Haz clic para subir una versión corregida
                              </p>
                              <button className="w-full bg-[#44482c] hover:bg-[#6e6c35] text-white font-semibold py-1.5 px-3 rounded transition-colors font-typographica text-xs flex items-center justify-center gap-1.5">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                Volver a Subir
                              </button>
                            </div>
                          );
                        }
                        return (
                          <div className="bg-[#e8d79a]/20 border border-[#e8d79a] rounded-lg p-2">
                            <p className="text-xs text-[#6e6c35] font-semibold font-typographica mb-0">
                              ⏳ En espera de validación
                            </p>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-[#b1c181]/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#b1c181]/30 transition-colors">
                      <FaPlus className="text-[#849b50] text-2xl" />
                    </div>
                    <h4 className="text-lg font-semibold text-terrasacha-primary font-typographica mb-2">
                      {isThirdParty ? "Propietario" : "Propietario (Yo)"} <span className="text-[#849b50]">*</span>
                    </h4>
                    <p className="text-sm text-terrasacha-secondary1 font-typographica">
                      {isThirdParty
                        ? "Agregar propietario"
                        : "Agregar mi información"}
                    </p>
                    <div className="bg-[#849b50]/20 border border-[#849b50] rounded-lg p-2 mt-2">
                      <p className="text-xs text-[#849b50] font-semibold font-typographica mb-0">
                        ⚠️ Requerido
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Cards de Propietarios Adicionales */}
              {propietariosData.slice(1).map((propietario, index) => (
                <div
                  key={propietario.id}
                  className="group p-4 sm:p-6 border-2 border-terrasacha-primary bg-terrasacha-primary/5 rounded-xl transition-all duration-300 flex flex-col h-full"
                >
                    <div className="text-center w-full flex flex-col h-full">
                      {(() => {
                        // Obtener el estado del propietario adicional desde propertyData
                        const propietarioDoc = propertyData?.propertyFeatures
                          ?.flatMap(pf => pf?.documents?.items || [])
                          .find(d => {
                            try {
                              const data = JSON.parse(d.data || '{}');
                              return data.type === 'OWNER_BUNDLE' && 
                                     (data.ownerId === propietario.id || d.id === propietario.ownerBundleDocumentId);
                            } catch {
                              return false;
                            }
                          });
                        
                        const status = propietarioDoc?.status || 'pending_review';
                        const isApproved = propietarioDoc?.isApproved || false;
                        
                        return (
                          <>
                            <div className="flex-1 flex flex-col items-center justify-center">
                              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#b1c181]/20 rounded-full flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#849b50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <h4 className="text-sm sm:text-lg font-semibold text-terrasacha-primary font-typographica mb-2 sm:mb-3">
                                {propietario.name}
                              </h4>
                              {/* Solo mostrar Eliminar si no está aprobado */}
                              {!(isApproved || status === 'approved') && (
                                <button
                                  onClick={() => removePropietario(propietario.id)}
                                  className="text-xs text-[#44482c] hover:text-[#6e6c35] font-typographica"
                                >
                                  Eliminar
                                </button>
                              )}
                            </div>
                            {/* Estado de validación al final */}
                            <div className="mt-auto">
                            {isApproved || status === 'approved' ? (
                              <div className="bg-[#b1c181]/20 border border-[#849b50] rounded-lg p-2">
                                <p className="text-xs text-[#849b50] font-semibold font-typographica mb-0">
                                  ✓ Aprobado
                                </p>
                              </div>
                            ) : status === 'rejected' || status === 'rechazado' ? (
                              <div 
                                onClick={() => editPropietario(index + 1)}
                                className="bg-[#44482c]/10 border border-[#44482c] rounded-lg p-2 cursor-pointer hover:bg-[#44482c]/20 transition-colors"
                              >
                                <div className="flex items-center justify-center gap-1.5 mb-1.5">
                                  <span className="text-[#44482c] text-sm">✗</span>
                                  <p className="text-xs text-[#44482c] font-semibold font-typographica mb-0">
                                    Rechazado
                                  </p>
                                </div>
                                <p className="text-xs text-[#44482c] font-typographica mb-2 text-center">
                                  Haz clic para subir una versión corregida
                                </p>
                                <button className="w-full bg-[#44482c] hover:bg-[#6e6c35] text-white font-semibold py-1.5 px-3 rounded transition-colors font-typographica text-xs flex items-center justify-center gap-1.5">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                  </svg>
                                  Volver a Subir
                                </button>
                              </div>
                            ) : (
                              <div className="bg-[#e8d79a]/20 border border-[#e8d79a] rounded-lg p-2">
                                <p className="text-xs text-[#6e6c35] font-semibold font-typographica mb-0">
                                  ⏳ En espera de validación
                                </p>
                              </div>
                            )}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                </div>
              ))}

              {/* Card para Agregar Más Propietarios */}
              {showAddPropietario && (
                <div
                  onClick={() => openModal("propietario")}
                  className="group cursor-pointer p-4 sm:p-6 border-2 border-dashed border-terrasacha-light rounded-xl hover:border-terrasacha-primary hover:bg-terrasacha-primary/5 transition-all duration-300"
                >
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-terrasacha-primary/10 rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-terrasacha-primary/20 transition-colors">
                      <FaPlus className="text-terrasacha-primary text-lg sm:text-2xl" />
                    </div>
                    <h4 className="text-sm sm:text-lg font-semibold text-terrasacha-primary font-typographica mb-2">
                      Agregar Propietario
                    </h4>
                    <p className="text-xs sm:text-sm text-terrasacha-secondary1 font-typographica">
                      Agregar otro propietario
                    </p>
                    <div className="bg-[#e8d79a]/20 border border-[#e8d79a] rounded-lg p-2 mt-2">
                      <p className="text-xs text-[#6e6c35] font-semibold font-typographica mb-0">
                        ℹ️ Opcional
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Lista de propietarios existentes */}
            {owners.length > 0 && (
              <div className="space-y-3 mb-4 sm:mb-6">
                <h4 className="text-sm sm:text-md font-semibold text-terrasacha-primary font-typographica mb-3">
                  Propietarios Agregados
                </h4>
                {owners.map((owner, index) => (
                  <div
                    key={index}
                    className="p-3 sm:p-4 border border-terrasacha-light rounded-lg bg-terrasacha-light/5"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start space-y-2 sm:space-y-0">
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm sm:text-base font-semibold text-terrasacha-primary font-typographica">
                          {owner.name}
                        </h5>
                        <p className="text-xs sm:text-sm text-terrasacha-secondary1 font-typographica">
                          {owner.email}
                        </p>
                        {owner.phone && (
                          <p className="text-xs sm:text-sm text-terrasacha-secondary1 font-typographica">
                            {owner.phone}
                          </p>
                        )}

                        {/* Documentos del propietario */}
                        <div className="mt-3 space-y-1">
                          {owner.idFront && (
                            <div className="flex items-center space-x-2 text-xs">
                              <a
                                href={owner.idFront}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 text-terrasacha-primary hover:bg-terrasacha-primary/10 rounded font-typographica"
                              >
                                Ver cédula (frente)
                              </a>
                              <button
                                onClick={() => handleDeleteOwnerDoc(index, 'idFront')}
                                className="px-2 py-1 text-[#44482c] hover:bg-[#44482c]/10 rounded font-typographica"
                              >
                                Eliminar
                              </button>
                            </div>
                          )}
                          {owner.idBack && (
                            <div className="flex items-center space-x-2 text-xs">
                              <a
                                href={owner.idBack}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 text-terrasacha-primary hover:bg-terrasacha-primary/10 rounded font-typographica"
                              >
                                Ver cédula (reverso)
                              </a>
                              <button
                                onClick={() => handleDeleteOwnerDoc(index, 'idBack')}
                                className="px-2 py-1 text-[#44482c] hover:bg-[#44482c]/10 rounded font-typographica"
                              >
                                Eliminar
                              </button>
                            </div>
                          )}
                          {owner.selfie && (
                            <div className="flex items-center space-x-2 text-xs">
                              <a
                                href={owner.selfie}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 text-terrasacha-primary hover:bg-terrasacha-primary/10 rounded font-typographica"
                              >
                                Ver selfie
                              </a>
                              <button
                                onClick={() => handleDeleteOwnerDoc(index, 'selfie')}
                                className="px-2 py-1 text-[#44482c] hover:bg-[#44482c]/10 rounded font-typographica"
                              >
                                Eliminar
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2 self-end sm:self-auto">
                        <button
                          onClick={() => editOwner(index)}
                          className="px-2 sm:px-3 py-1 text-terrasacha-primary hover:bg-terrasacha-primary/10 rounded font-typographica text-xs sm:text-sm"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => removeOwner(index)}
                          className="px-2 sm:px-3 py-1 text-[#44482c] hover:bg-[#44482c]/10 rounded font-typographica text-xs sm:text-sm"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Modal para agregar/editar propietario */}
          {showModal && (
            <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto p-2 sm:p-4" style={{ margin: 0 }}>
              <div className="bg-white rounded-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto my-auto">
                <div className="p-4 sm:p-6">
                  <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl font-bold text-terrasacha-primary font-typographica">
                      {modalTitle}
                    </h3>
                    <button
                      onClick={closeModal}
                      className="text-terrasacha-secondary1 hover:text-terrasacha-primary transition-colors"
                    >
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 sm:mb-6">
                    <div>
                      <label className="block text-sm font-medium text-terrasacha-secondary1 mb-2 font-typographica">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        value={currentOwner.name}
                        onChange={(e) =>
                          setCurrentOwner({
                            ...currentOwner,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-terrasacha-light rounded-lg focus:ring-2 focus:ring-terrasacha-primary focus:border-transparent font-typographica"
                        placeholder="Nombre completo"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-terrasacha-secondary1 mb-2 font-typographica">
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        value={currentOwner.email}
                        onChange={(e) =>
                          setCurrentOwner({
                            ...currentOwner,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-terrasacha-light rounded-lg focus:ring-2 focus:ring-terrasacha-primary focus:border-transparent font-typographica"
                        placeholder="email@ejemplo.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-terrasacha-secondary1 mb-2 font-typographica">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        value={currentOwner.phone}
                        onChange={(e) =>
                          setCurrentOwner({
                            ...currentOwner,
                            phone: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-terrasacha-light rounded-lg focus:ring-2 focus:ring-terrasacha-primary focus:border-transparent font-typographica"
                        placeholder="+57 300 123 4567"
                      />
                    </div>
                  </div>

                  {/* Archivos */}
                  <div className="grid grid-cols-1 gap-4 mb-4 sm:mb-6">
                    <div>
                      <label className="block text-sm font-medium text-terrasacha-secondary1 mb-2 font-typographica">
                        Cédula (Frente) *
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileUpload(
                            e.target.files[0],
                            "idFront",
                            editingIndex
                          )
                        }
                        className="w-full px-3 py-2 border border-terrasacha-light rounded-lg focus:ring-2 focus:ring-terrasacha-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-terrasacha-secondary1 mb-2 font-typographica">
                        Cédula (Reverso) *
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileUpload(
                            e.target.files[0],
                            "idBack",
                            editingIndex
                          )
                        }
                        className="w-full px-3 py-2 border border-terrasacha-light rounded-lg focus:ring-2 focus:ring-terrasacha-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-terrasacha-secondary1 mb-2 font-typographica">
                        Selfie *
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileUpload(
                            e.target.files[0],
                            "selfie",
                            editingIndex
                          )
                        }
                        className="w-full px-3 py-2 border border-terrasacha-light rounded-lg focus:ring-2 focus:ring-terrasacha-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                    <button
                      onClick={closeModal}
                      className="px-4 sm:px-6 py-2 text-terrasacha-secondary1 hover:bg-terrasacha-light/20 rounded-lg font-typographica text-sm sm:text-base"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={(editingIndex >= 0 && owners.length > editingIndex) ? updateOwner : addOwner}
                      className="px-4 sm:px-6 py-2 bg-terrasacha-primary text-white rounded-lg hover:bg-terrasacha-primary/90 transition-colors font-typographica text-sm sm:text-base"
                    >
                      {(editingIndex === -2 || (editingIndex >= 0 && propietariosData.length > editingIndex)) ? "Actualizar" : (editingIndex >= 0 && owners.length > editingIndex) ? "Actualizar" : "Agregar"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
