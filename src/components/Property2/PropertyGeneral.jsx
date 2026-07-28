import React, { useState, useEffect } from "react";
import { usePropertyData } from "context/PropertyDataContext";
import { useAuth } from "context/AuthContext";
import {
  FaUsers,
  FaFileAlt,
  FaFileContract,
  FaMap,
  FaHandshake,
  FaClipboardCheck,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaChevronDown,
  FaChevronUp,
  FaArrowRight,
} from "react-icons/fa";

export default function PropertyGeneral({
  onNavigateToDocumentation,
  onNavigateToOwners,
  onNavigateToPredial,
}) {
  const { propertyData } = usePropertyData();
  const { user } = useAuth();
  
  // Verificar si el usuario es consultor
  const isConsultant = user?.role === "validator";

  // Configuración de documentos requeridos
  const documentRequirements = [
    {
      key: 'certificado',
      label: 'Certificado',
      type: 'CERTIFICADO_TRADICION',
      icon: FaFileAlt,
      isRequired: true,
      defaultName: 'Certificado de Libertad y Tradición',
    },
    {
      key: 'escrituras',
      label: 'Escrituras',
      type: 'ESCRITURA_PUBLICA',
      icon: FaFileContract,
      isRequired: true,
      defaultName: 'Escrituras Públicas',
    },
    {
      key: 'planos',
      label: 'Planos',
      type: 'PLANO_CATASTRAL',
      icon: FaMap,
      isRequired: true,
      defaultName: 'Planos Catastrales',
    },
    {
      key: 'memorando',
      label: 'Memorando',
      type: 'MEMORANDO_ENTENDIMIENTO',
      icon: FaHandshake,
      isRequired: true,
      defaultName: 'Memorando de Entendimiento',
    },
  ];

  // Estados para controlar la expansión de secciones
  const [expandedSections, setExpandedSections] = useState({
    requirements: true,
    owners: true,
    documentation: true,
    study: false,
  });

  // Estados para almacenar la información procesada
  const [ownersInfo, setOwnersInfo] = useState([]);
  const [documentsInfo, setDocumentsInfo] = useState({});

  // Requisitos de información predial: detección por featureID y valor no vacío
  const featureIdMap = {
    usoActualPotencial: ['D_USO_ACTUAL_POTENCIAL', 'ACTUAL_USE_POTENTIAL', 'D_actual_use'],
    limitacionesUsoSuelo: ['D_LIMITACIONES_USO_SUELO', 'USE_RESTRICTIONS', 'E_restriccion_desc', 'E_resctriccion_other'],
    aspectosEcosistema: ['D_ASPECTOS_ECOSISTEMA', 'ECOSYSTEM', 'D_aspects_ecosystem', 'F_nacimiento_agua'],
    aspectosPredio: ['D_ASPECTOS_PREDIO', 'GENERAL_ASPECTS', 'D_aspects_property', 'G_habita_predio'],
    relacionesEntidades: ['D_RELACIONES_ENTIDADES', 'RELATIONS', 'D_relations_entities', 'H_aliados_estrategicos_desc', 'H_grupo_comunitario_desc', 'H_asistance_desc'],
  };

  const isNonEmptyValue = (value) => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') {
      const v = value.trim();
      if (v.length === 0) return false;
      try {
        const parsed = JSON.parse(v);
        if (parsed && typeof parsed === 'object') {
          if (Array.isArray(parsed)) return parsed.length > 0;
          return Object.keys(parsed).length > 0;
        }
      } catch (_) {
        // not JSON, consider non-empty string as valid
      }
      return true;
    }
    if (typeof value === 'object') {
      if (Array.isArray(value)) return value.length > 0;
      return Object.keys(value).length > 0;
    }
    return true;
  };

  const featureCompleted = (ids) => {
    const pfs = propertyData?.propertyFeatures || [];
    for (const pf of pfs) {
      if (ids.includes(pf?.featureID) && isNonEmptyValue(pf?.value)) {
        return true;
      }
    }
    return false;
  };

  const buildRequirements = () => {
    return [
      { key: 'usoActualPotencial', label: 'Uso actual y potencial', completed: featureCompleted(featureIdMap.usoActualPotencial) },
      { key: 'limitacionesUsoSuelo', label: 'Limitaciones de uso de suelo', completed: featureCompleted(featureIdMap.limitacionesUsoSuelo) },
      { key: 'aspectosEcosistema', label: 'Aspectos generales del ecosistema', completed: featureCompleted(featureIdMap.aspectosEcosistema) },
      { key: 'aspectosPredio', label: 'Aspectos generales del predio', completed: featureCompleted(featureIdMap.aspectosPredio) },
      { key: 'relacionesEntidades', label: 'Relaciones con entidades y aliados estratégicos', completed: featureCompleted(featureIdMap.relacionesEntidades) },
    ];
  };

  const requirements = buildRequirements();

  const calculateRequirementsProgress = () => {
    const total = requirements.length || 1;
    const done = requirements.filter(r => r.completed).length;
    return Math.round((done / total) * 100);
  };

  // Calcular porcentajes de completitud
  const calculateOwnersProgress = () => {
    if (ownersInfo.length === 0) return 0;
    const validated = ownersInfo.filter(owner => owner.isApproved || owner.status === 'approved').length;
    return Math.round((validated / ownersInfo.length) * 100);
  };

  const calculateDocumentationProgress = () => {
    const requiredDocs = documentRequirements.filter((req) => req.isRequired);
    const uploaded = requiredDocs.filter((req) => documentsInfo[req.key]?.uploaded).length;
    return Math.round((uploaded / requiredDocs.length) * 100);
  };

  // Procesar información de propietarios
  useEffect(() => {
    if (!propertyData?.propertyFeatures) return;

    const pfs = propertyData.propertyFeatures;
    const docs = pfs.flatMap((pf) => (pf?.documents?.items ? pf.documents.items : []));

    if (!docs || docs.length === 0) return;

    const owners = [];
    const docMap = {};

    // Inicializar el mapa de documentos
    documentRequirements.forEach((req) => {
      docMap[req.key] = null;
    });

    docs.forEach((d) => {
      let data = {};
      try {
        data = JSON.parse(d.data || '{}');
      } catch {
        data = {};
      }

      const type = data.type;

      // Procesar propietarios
      if (type === 'OWNER_BUNDLE') {
        const ownerInfo = {
          id: data.ownerId || d.id,
          name: data.name || 'Sin nombre',
          email: data.email || '',
          phone: data.phone || '',
          role: data.role || 'PROPIETARIO',
          documentId: d.id,
          status: d.status || 'pending_review',
          isApproved: d.isApproved || false,
        };
        owners.push(ownerInfo);
      }

      // Procesar documentos prediales usando el mapeo
      const docType = data.type || '';
      const requirement = documentRequirements.find((req) => req.type === docType);
      
      if (requirement) {
        docMap[requirement.key] = {
          id: d.id,
          name: data.name || requirement.defaultName,
          url: data.url || d.url,
          status: d.status || 'pending_review',
          isApproved: d.isApproved || false,
          uploaded: true,
        };
      }
    });

    setOwnersInfo(owners);
    setDocumentsInfo(docMap);
  }, [propertyData]);

  const getStatusIcon = (status, isApproved) => {
    if (isApproved || status === 'approved') {
      return <FaCheckCircle className="text-green-500" />;
    }
    if (status === 'rejected' || status === 'rechazado') {
      return <FaTimesCircle className="text-red-500" />;
    }
    return <FaClock className="text-yellow-500" />;
  };

  const getStatusText = (status, isApproved) => {
    if (isApproved || status === 'approved') {
      return 'Validado';
    }
    if (status === 'rejected' || status === 'rechazado') {
      return 'Rechazado';
    }
    return 'Pendiente';
  };

  const getStatusColor = (status, isApproved) => {
    if (isApproved || status === 'approved') {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    if (status === 'rejected' || status === 'rechazado') {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const requirementsProgress = calculateRequirementsProgress();
  const ownersProgress = calculateOwnersProgress();
  const documentationProgress = calculateDocumentationProgress();

  const getNextStepId = () => {
    if (requirementsProgress < 100) return "requirements";
    if (ownersInfo.length === 0 || ownersProgress < 100) return "owners";
    if (documentationProgress < 100) return "documentation";
    return null;
  };

  const nextStepId = getNextStepId();
  const overallProgress = Math.round(
    (requirementsProgress + ownersProgress + documentationProgress) / 3
  );

  const requiredDocsCount = documentRequirements.filter((req) => req.isRequired).length;
  const uploadedRequiredDocs = documentRequirements.filter(
    (req) => req.isRequired && documentsInfo[req.key]?.uploaded
  ).length;
  const validatedOwnersCount = ownersInfo.filter(
    (owner) => owner.isApproved || owner.status === "approved"
  ).length;
  const completedRequirementsCount = requirements.filter((req) => req.completed).length;

  const workflowSteps = [
    {
      id: "requirements",
      step: 1,
      title: "Información Predial",
      progress: requirementsProgress,
      done: completedRequirementsCount,
      total: requirements.length,
      isComplete: requirementsProgress === 100,
      helperWhenEmpty: isConsultant
        ? "El postulante debe completar 5 secciones en Información Predial."
        : "Completa los 5 formularios en Información Predial para iniciar.",
      actionLabel: "Ir a Información Predial",
      onNavigate: onNavigateToPredial,
    },
    {
      id: "owners",
      step: 2,
      title: "Propietarios",
      progress: ownersProgress,
      done: validatedOwnersCount,
      total: ownersInfo.length || 1,
      isComplete: ownersInfo.length > 0 && ownersProgress === 100,
      helperWhenEmpty: isConsultant
        ? "Registra al menos un propietario y valida su identidad."
        : "Agrega propietarios y completa su validación de identidad.",
      actionLabel: "Ir a Propietarios",
      onNavigate: onNavigateToOwners,
    },
    {
      id: "documentation",
      step: 3,
      title: "Documentación",
      progress: documentationProgress,
      done: uploadedRequiredDocs,
      total: requiredDocsCount,
      isComplete: documentationProgress === 100,
      helperWhenEmpty: isConsultant
        ? "Carga certificado, escrituras y planos en Documentación."
        : "Sube los documentos obligatorios en la pestaña Documentación.",
      actionLabel: "Ir a Documentación",
      onNavigate: onNavigateToDocumentation,
    },
  ];

  const getStepMeta = (stepId) =>
    workflowSteps.find((step) => step.id === stepId);

  const getStepCardClassName = (stepId) => {
    const isNext = nextStepId === stepId;
    const stepMeta = getStepMeta(stepId);
    const base =
      "bg-[#b1c181] p-3 sm:p-4 rounded-xl border shadow-md h-full flex flex-col transition-all duration-300";

    if (isNext) {
      return `${base} border-terrasacha-primary ring-2 ring-terrasacha-primary/30 shadow-terrasacha-lg`;
    }

    if (stepMeta?.isComplete) {
      return `${base} border-[#849b50]`;
    }

    return `${base} border-[#849b50]/70`;
  };

  const renderProgressSummary = (stepMeta) => {
    if (stepMeta.isComplete) {
      return (
        <p className="text-xs font-semibold text-terrasacha-secondary1 font-typographica mb-0">
          Completado · {stepMeta.done} de {stepMeta.total}
        </p>
      );
    }

    if (stepMeta.progress === 0) {
      return (
        <p className="text-xs text-terrasacha-secondary1 font-typographica mb-0 leading-snug">
          0 de {stepMeta.total} · {stepMeta.helperWhenEmpty}
        </p>
      );
    }

    return (
      <p className="text-xs text-terrasacha-secondary1 font-typographica mb-0">
        {stepMeta.done} de {stepMeta.total} · {stepMeta.progress}% completado
      </p>
    );
  };

  const renderStepNavigateButton = (stepId) => {
    const stepMeta = getStepMeta(stepId);
    if (!stepMeta?.onNavigate || stepMeta.isComplete || nextStepId !== stepId) {
      return null;
    }

    return (
      <button
        type="button"
        onClick={stepMeta.onNavigate}
        className="mt-3 w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold font-typographica bg-terrasacha-primary text-white rounded-lg hover:bg-terrasacha-secondary1 transition-colors shadow-sm"
        aria-label={stepMeta.actionLabel}
      >
        {stepMeta.actionLabel}
        <FaArrowRight size={10} aria-hidden="true" />
      </button>
    );
  };

  const requirementsMeta = getStepMeta("requirements");
  const ownersMeta = getStepMeta("owners");
  const documentationMeta = getStepMeta("documentation");

  return (
    <div className="space-y-4">
      <section
        className="bg-white rounded-xl border border-terrasacha-light/30 p-4 md:p-5 shadow-sm"
        aria-label="Guía de diligenciamiento del predio"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-terrasacha-secondary1 font-typographica mb-1">
              Progreso del predio
            </h2>
            <p className="text-sm text-terrasacha-secondary1 opacity-80 font-typographica mb-0">
              {nextStepId
                ? "Sigue el orden sugerido. Cada paso habilita el avance del siguiente."
                : "Los pasos principales del predio están completos."}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-28 md:w-36 bg-gray-200 rounded-full h-2">
              <div
                className="bg-terrasacha-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <span className="text-sm font-bold text-terrasacha-primary font-typographica">
              {overallProgress}%
            </span>
          </div>
        </div>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {workflowSteps.map((step) => {
            const isNext = nextStepId === step.id;

            return (
              <li
                key={step.id}
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  isNext
                    ? "border-terrasacha-primary bg-terrasacha-primary/5"
                    : step.isComplete
                    ? "border-terrasacha-secondary2/50 bg-terrasacha-secondary2/10"
                    : "border-terrasacha-light/40 bg-terrasacha-earth/20"
                }`}
              >
                <span
                  className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-typographica ${
                    step.isComplete
                      ? "bg-terrasacha-secondary2 text-white"
                      : isNext
                      ? "bg-terrasacha-primary text-white"
                      : "bg-gray-300 text-terrasacha-secondary1"
                  }`}
                >
                  {step.isComplete ? (
                    <FaCheckCircle className="text-sm" aria-hidden="true" />
                  ) : (
                    step.step
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-terrasacha-secondary1 font-typographica mb-0.5">
                    Paso {step.step}: {step.title}
                    {isNext && (
                      <span className="ml-1.5 text-[10px] uppercase tracking-wide text-terrasacha-primary">
                        · Siguiente
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-terrasacha-secondary1 opacity-80 font-typographica mb-0 leading-snug">
                    {step.progress === 0
                      ? step.helperWhenEmpty
                      : `${step.done} de ${step.total} · ${step.progress}%`}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-stretch">
      {/* Requisitos de Información Predial */}
      <div className={getStepCardClassName("requirements")}>
        {/* Header con progreso */}
        <div className={`${expandedSections.requirements ? "mb-3" : "mb-0"}`}>
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#6e6c35] rounded-lg flex items-center justify-center shadow-md flex-shrink-0 relative">
                <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-terrasacha-primary text-white text-[10px] font-bold flex items-center justify-center font-typographica">
                  1
                </span>
                <FaInfoCircle className="text-white text-base" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-sm sm:text-base font-bold text-terrasacha-primary font-typographica mb-0">
                    Información Predial
                  </h3>
                  {nextStepId === "requirements" && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-terrasacha-primary text-white font-typographica">
                      Siguiente
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2 mb-0.5">
                  <div className="w-20 bg-gray-200 rounded-full h-1.5 flex-1">
                    <div
                      className="bg-[#6e6c35] h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${requirementsProgress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-semibold text-terrasacha-secondary1 font-typographica whitespace-nowrap">
                    {requirementsProgress}%
                  </span>
                </div>
                {renderProgressSummary(requirementsMeta)}
              </div>
            </div>
            <button
              type="button"
              onClick={() => toggleSection('requirements')}
              className="text-[#6e6c35] hover:bg-[#6e6c35]/10 p-2 rounded-lg transition-colors flex-shrink-0"
              aria-label="Expandir o colapsar información predial"
            >
              {expandedSections.requirements ? (
                <FaChevronUp className="w-4 h-4" />
              ) : (
                <FaChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {expandedSections.requirements && (
          <div className="space-y-2">
            {requirements.map((req) => (
              <div key={req.key} className="flex items-center justify-between p-2 bg-white rounded border border-[#b1c181] hover:shadow-sm transition-shadow">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <div className={`w-6 h-6 ${req.completed ? 'bg-[#849b50]' : 'bg-yellow-200'} rounded flex items-center justify-center flex-shrink-0`}>
                    {req.completed ? (
                      <FaCheckCircle className="text-white text-xs" />
                    ) : (
                      <FaExclamationTriangle className="text-yellow-700 text-xs" />
                    )}
                  </div>
                  <p className="text-xs font-semibold text-terrasacha-primary font-typographica mb-0 truncate">
                    {req.label}
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold font-typographica border ml-2 flex-shrink-0 ${req.completed ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}`}
                >
                  {req.completed ? 'Completo' : 'Pendiente'}
                </span>
              </div>
            ))}
            {renderStepNavigateButton("requirements")}
          </div>
        )}
      </div>

      {/* Validación de Propietarios */}
      <div className={getStepCardClassName("owners")}>
        {/* Header con progreso */}
        <div className={`${expandedSections.owners ? "mb-3" : "mb-0"}`}>
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#6e6c35] rounded-lg flex items-center justify-center shadow-md flex-shrink-0 relative">
                <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-terrasacha-primary text-white text-[10px] font-bold flex items-center justify-center font-typographica">
                  2
                </span>
                <FaUsers className="text-white text-base" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-sm sm:text-base font-bold text-terrasacha-primary font-typographica mb-0">
                    Propietarios
                  </h3>
                  {nextStepId === "owners" && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-terrasacha-primary text-white font-typographica">
                      Siguiente
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2 mb-0.5">
                  <div className="w-20 bg-gray-200 rounded-full h-1.5 flex-1">
                    <div
                      className="bg-[#6e6c35] h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${ownersProgress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-semibold text-terrasacha-secondary1 font-typographica whitespace-nowrap">
                    {ownersProgress}%
                  </span>
                </div>
                {renderProgressSummary(ownersMeta)}
              </div>
            </div>
            <button
              type="button"
              onClick={() => toggleSection('owners')}
              className="text-[#6e6c35] hover:bg-[#6e6c35]/10 p-2 rounded-lg transition-colors flex-shrink-0"
              aria-label="Expandir o colapsar propietarios"
            >
              {expandedSections.owners ? (
                <FaChevronUp className="w-4 h-4" />
              ) : (
                <FaChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Requisitos */}
        {expandedSections.owners && (
          <div className="space-y-2">
          <div className="bg-white p-2 rounded-lg border border-[#849b50]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-[#849b50] rounded flex items-center justify-center flex-shrink-0">
                  <FaCheckCircle className="text-white text-xs" />
                </div>
                <p className="text-xs font-semibold text-terrasacha-primary font-typographica mb-0">
                  Validación de identidad
                </p>
              </div>
              <p className="text-xs text-terrasacha-secondary1 font-typographica mb-0">
                {ownersInfo.length > 0 
                  ? `${ownersInfo.filter(o => o.isApproved || o.status === 'approved').length} de ${ownersInfo.length}`
                  : '0 propietarios'}
              </p>
            </div>
            {ownersInfo.length > 0 ? (
              <div className="space-y-1.5">
                {ownersInfo.map((owner) => (
                  <div
                    key={owner.id}
                    className="flex items-center justify-between p-2 bg-white rounded border border-[#b1c181] hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        {getStatusIcon(owner.status, owner.isApproved)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-terrasacha-primary font-typographica truncate mb-0">
                          {owner.name}
                        </p>
                        <p className="text-xs text-terrasacha-secondary1 font-typographica mb-0">
                          {owner.role === 'POSTULANTE' ? 'Postulante' : 'Propietario'}
                        </p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold font-typographica border ${getStatusColor(
                          owner.status,
                          owner.isApproved
                        )}`}
                      >
                        {getStatusText(owner.status, owner.isApproved).split(' ')[0]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-between space-x-1.5 p-2 bg-yellow-50 border border-yellow-200 rounded">
                <div className="flex items-center space-x-1.5">
                  <FaExclamationTriangle className="text-yellow-600 text-xs" />
                  <p className="text-xs text-yellow-800 font-typographica mb-0">
                    Sin propietarios
                  </p>
                </div>
                {onNavigateToOwners && (
                  <button
                    onClick={onNavigateToOwners}
                    className="px-2 py-1 text-xs font-semibold font-typographica bg-[#849b50] text-white rounded hover:bg-[#6e6c35] transition-colors flex-shrink-0"
                    aria-label="Ir a Propietarios"
                  >
                    Agregar
                  </button>
                )}
              </div>
            )}
          </div>
          {renderStepNavigateButton("owners")}
          </div>
        )}
      </div>

      {/* Validación de Documentación Predial */}
      <div className={getStepCardClassName("documentation")}>
        {/* Header con progreso */}
        <div className={`${expandedSections.documentation ? "mb-3" : "mb-0"}`}>
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#6e6c35] rounded-lg flex items-center justify-center shadow-md flex-shrink-0 relative">
                <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-terrasacha-primary text-white text-[10px] font-bold flex items-center justify-center font-typographica">
                  3
                </span>
                <FaFileAlt className="text-white text-base" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-sm sm:text-base font-bold text-terrasacha-primary font-typographica mb-0">
                    Documentación
                  </h3>
                  {nextStepId === "documentation" && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-terrasacha-primary text-white font-typographica">
                      Siguiente
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2 mb-0.5">
                  <div className="w-20 bg-gray-200 rounded-full h-1.5 flex-1">
                    <div
                      className="bg-[#6e6c35] h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${documentationProgress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-semibold text-terrasacha-secondary1 font-typographica whitespace-nowrap">
                    {documentationProgress}%
                  </span>
                </div>
                {renderProgressSummary(documentationMeta)}
              </div>
            </div>
            <button
              type="button"
              onClick={() => toggleSection('documentation')}
              className="text-[#6e6c35] hover:bg-[#6e6c35]/10 p-2 rounded-lg transition-colors flex-shrink-0"
              aria-label="Expandir o colapsar documentación"
            >
              {expandedSections.documentation ? (
                <FaChevronUp className="w-4 h-4" />
              ) : (
                <FaChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Requisitos */}
        {expandedSections.documentation && (
          <div className="space-y-2">
            {documentRequirements.map((req) => {
              const docInfo = documentsInfo[req.key];
              const IconComponent = req.icon;
              
              // Para el memorando, usar el mismo estilo que los requeridos
              const isMemorando = req.key === 'memorando';
              const iconBgColor = isMemorando ? 'bg-[#849b50]' : (req.isRequired ? 'bg-[#849b50]' : 'bg-[#e8d79a]');
              const iconColor = isMemorando ? 'text-white' : (req.isRequired ? 'text-white' : 'text-[#6e6c35]');
              
              // Determinar el mensaje cuando no hay documento
              const getEmptyMessage = () => {
                if (isMemorando) {
                  return isConsultant ? 'Pendiente por cargar' : 'No cargado';
                }
                return req.isRequired ? 'Pendiente por cargar' : 'No cargado';
              };
              
              // Determinar el estilo cuando no hay documento
              const getEmptyStyle = () => {
                if (isMemorando) {
                  return isConsultant 
                    ? 'bg-yellow-50 border border-yellow-200' 
                    : 'bg-gray-50 border border-gray-200';
                }
                return req.isRequired 
                  ? 'bg-yellow-50 border border-yellow-200' 
                  : 'bg-gray-50 border border-gray-200';
              };
              
              // Determinar el icono cuando no hay documento
              const getEmptyIcon = () => {
                if (isMemorando) {
                  return isConsultant ? (
                    <FaExclamationTriangle className="text-yellow-600 text-xs" />
                  ) : (
                    <FaInfoCircle className="text-gray-500 text-xs" />
                  );
                }
                return req.isRequired ? (
                  <FaExclamationTriangle className="text-yellow-600 text-xs" />
                ) : (
                  <FaInfoCircle className="text-gray-500 text-xs" />
                );
              };
              
              // Determinar el color del texto cuando no hay documento
              const getEmptyTextColor = () => {
                if (isMemorando) {
                  return isConsultant ? 'text-yellow-800' : 'text-gray-600';
                }
                return req.isRequired ? 'text-yellow-800' : 'text-gray-600';
              };

              return (
                <div key={req.key} className="bg-white p-2 rounded border border-[#849b50]">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`w-6 h-6 ${iconBgColor} rounded flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className={`${iconColor} text-xs`} />
                    </div>
                    <p className="text-xs font-semibold text-terrasacha-primary font-typographica mb-0">
                      {req.label}
                    </p>
                  </div>
                  {docInfo ? (
                    <div className="flex items-center justify-between p-1.5 bg-white rounded border border-[#b1c181]">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                          {getStatusIcon(docInfo.status, docInfo.isApproved)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-terrasacha-primary font-typographica truncate mb-0">
                            {docInfo.name}
                          </p>
                        </div>
                      </div>
                      {req.isRequired && (
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-xs font-semibold font-typographica border ml-2 flex-shrink-0 ${getStatusColor(
                            docInfo.status,
                            docInfo.isApproved
                          )}`}
                        >
                          {getStatusText(docInfo.status, docInfo.isApproved).split(' ')[0]}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className={`flex items-center justify-between p-1.5 ${getEmptyStyle()} rounded`}>
                      <div className="flex items-center space-x-1.5 flex-1">
                        {getEmptyIcon()}
                        <p className={`text-xs font-typographica mb-0 ${getEmptyTextColor()}`}>
                          {getEmptyMessage()}
                        </p>
                      </div>
                      {getEmptyMessage() === 'Pendiente por cargar' && onNavigateToDocumentation && (
                        <button
                          onClick={onNavigateToDocumentation}
                          className="ml-2 px-2 py-1 text-xs font-semibold font-typographica bg-[#849b50] text-white rounded hover:bg-[#6e6c35] transition-colors flex-shrink-0"
                          aria-label="Ir a Documentación"
                        >
                          Cargar
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            {renderStepNavigateButton("documentation")}
          </div>
        )}
      </div>

      {/* Estudio del Predio */}
      <div className="bg-[#b1c181] p-3 sm:p-4 rounded-xl border border-[#849b50] shadow-md h-full flex flex-col">
        <div className={`${expandedSections.study ? "mb-3" : "mb-0"}`}>
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#6e6c35] rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                <FaClipboardCheck className="text-white text-base" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-terrasacha-primary font-typographica mb-0.5">
                  Estudio del Predio
                </h3>
                <p className="text-xs text-terrasacha-secondary1 font-typographica mb-0">
                  Análisis técnico · Próximamente
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => toggleSection("study")}
              className="text-[#6e6c35] hover:bg-[#6e6c35]/10 p-2 rounded-lg transition-colors flex-shrink-0"
              aria-label="Expandir o colapsar estudio del predio"
            >
              {expandedSections.study ? (
                <FaChevronUp className="w-4 h-4" />
              ) : (
                <FaChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {expandedSections.study && (
          <div className="bg-white p-2 rounded border border-[#849b50]">
            <div className="flex items-start space-x-2">
              <FaInfoCircle className="text-[#6e6c35] flex-shrink-0 text-xs mt-0.5" />
              <p className="text-xs text-terrasacha-secondary1 font-typographica leading-tight mb-0">
                Los requisitos para este proceso se definirán próximamente.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}

