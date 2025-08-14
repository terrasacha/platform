import React, { useEffect, useState } from "react";
import PostulantInfoCard from "./InfoCards/PostulantInfoCard";
import ProjectInfoCard from "./InfoCards/ProjectInfoCard";
import OwnerInfoCard from "./InfoCards/OwnerInfoCard";
import ActualUseAndPotentialInfoCard from "./InfoCards/ActualUseAndPotentialInfoCard";
import EcosystemInfoCard from "./InfoCards/EcosystemInfoCard";
import PropertyInfoCard from "./InfoCards/PropertyInfoCard";
import RelationsInfoCard from "./InfoCards/RelationsInfoCard";
import GeodataInfoCard from "./InfoCards/GeodataInfoCard";
import { useProjectData } from "../../../../context/ProjectDataContext";
import UseRestrictionsInfoCard from "./InfoCards/UseRestrictionsInfoCard";
import { useAuth } from "context/AuthContext";
import { getProjectProgress } from "services/getProjectProgress";
import { CheckIcon } from "components/common/icons/CheckIcon";
import { HourGlassIcon } from "components/common/icons/HourGlassIcon";
import CadastralRecordsInfoCard from "./InfoCards/CadastralRecordsInfoCard";
import PropertiesTable from "./InfoCards/PropertiesTable";
import { FiFileText, FiMapPin, FiDatabase, FiCheckCircle, FiClock } from "react-icons/fi";

export default function ProjectDetails({ visible }) {
  const { projectData } = useProjectData();
  const [autorizedUser, setAutorizedUser] = useState(false);
  const [isPostulant, setIsPostulant] = useState(false);
  const [isVerifier, setIsVerifier] = useState(false);
  const { user } = useAuth();

  const [totalArea, setTotalArea] = useState(0);
  const [latLngCentroid, setLatLngCentroid] = useState(null);
  const [progressChange, setProgressChange] = useState(false);
  const [progressObj, setProgressObj] = useState(null);

  useEffect(() => {
    if (user && projectData) {
      const verifiers = projectData?.projectVerifiers;
      const postulant = projectData?.projectPostulant?.id;
      const authorizedUsers =
        projectData?.projectInfo.projectAge < 20
          ? [...verifiers, postulant]
          : [...verifiers];
      setAutorizedUser(
        authorizedUsers.includes(user.id) || user.role === "admon"
      );
      setIsPostulant(postulant === user.id);
      setIsVerifier(verifiers.includes(user.id));
      setTotalArea(projectData.projectInfo.area)
    }
  }, [user, projectData]);

  useEffect(() => {
    if (user && projectData.projectInfo) {
      const progress = async () => {
        try {
          const obj = await getProjectProgress(
            projectData?.projectInfo.id,
            user.subrole
          );
          setProgressObj(obj);
        } catch (error) {
          console.error("Error al obtener datos:", error);
        }
      };
      progress();
    }
  }, [projectData, progressChange]);

  if (!visible) return null;

  return (
    <div className="mt-4">
      {/* Header de la sección */}
      <div className="d-flex align-items-center gap-2 mb-4 p-3 rounded" style={{ backgroundColor: '#f0f4e6', border: '1px solid #e8d79a' }}>
        <FiFileText style={{ color: '#6e6c35' }} size={24} />
        <div>
          <h4 className="mb-0" style={{ color: '#6e6c35' }}>Detalles del Proyecto</h4>
          <p className="mb-0 small" style={{ color: '#44482c' }}>Información general y datos del proyecto</p>
        </div>
      </div>

      {/* Contenido principal */}
      <div 
        className="row row-cols-1 row-cols-xl-2 g-3" 
        style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '12px', 
          border: '2px solid #b1c181',
          boxShadow: '0 4px 6px rgba(110, 108, 53, 0.1)'
        }}
      >
        {/* Tarjeta de información del proyecto */}
        <div className="col">
          <div className="h-100 p-3 rounded" style={{ backgroundColor: 'white', border: '1px solid #b1c181' }}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <FiFileText style={{ color: '#849b50' }} />
              <h6 className="mb-0" style={{ color: '#44482c' }}>Información del Proyecto</h6>
              {(autorizedUser || isPostulant) &&
                (progressObj?.sectionsStatus.projectInfo ? (
                  <div className="ms-auto">
                    <CheckIcon className="text-success" style={{ color: '#849b50' }} />
                  </div>
                ) : (
                  <div className="ms-auto">
                    <HourGlassIcon className="text-danger" style={{ color: '#dc3545' }} />
                  </div>
                ))
              }
            </div>
            <ProjectInfoCard
              autorizedUser={autorizedUser}
              setProgressChange={setProgressChange}
              totalArea={totalArea}
              tooltip={
                (autorizedUser || isPostulant) &&
                (progressObj?.sectionsStatus.projectInfo ? (
                  <CheckIcon className="text-success" style={{ color: '#849b50' }} />
                ) : (
                  <HourGlassIcon className="text-danger" style={{ color: '#dc3545' }} />
                ))
              }
            />
          </div>
        </div>

        {/* Tarjeta de información geográfica */}
        <div className="col">
          <div className="h-100 p-3 rounded" style={{ backgroundColor: 'white', border: '1px solid #b1c181' }}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <FiMapPin style={{ color: '#849b50' }} />
              <h6 className="mb-0" style={{ color: '#44482c' }}>Información Geográfica</h6>
              {(autorizedUser || isPostulant) &&
                (progressObj?.sectionsStatus.geodataInfo ? (
                  <div className="ms-auto">
                    <CheckIcon className="text-success" style={{ color: '#849b50' }} />
                  </div>
                ) : (
                  <div className="ms-auto">
                    <HourGlassIcon className="text-danger" style={{ color: '#dc3545' }} />
                  </div>
                ))
              }
            </div>
            <GeodataInfoCard
              autorizedUser={autorizedUser}
              setProgressChange={setProgressChange}
              setLatLngCentroid={setLatLngCentroid}
              tooltip={
                (autorizedUser || isPostulant) &&
                (progressObj?.sectionsStatus.geodataInfo ? (
                  <CheckIcon className="text-success" style={{ color: '#849b50' }} />
                ) : (
                  <HourGlassIcon className="text-danger" style={{ color: '#dc3545' }} />
                ))
              }
            />
          </div>
        </div>

        {/* Tarjeta de propiedades (ancho completo) */}
        <div className="col-12">
          <div className="p-3 rounded" style={{ backgroundColor: 'white', border: '1px solid #b1c181' }}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <FiDatabase style={{ color: '#849b50' }} />
              <h6 className="mb-0" style={{ color: '#44482c' }}>Propiedades del Proyecto</h6>
            </div>
            <PropertiesTable />
          </div>
        </div>

        {/* Tarjetas comentadas para futuras implementaciones */}
        {/* 
        <div className="col-12 col-xl-12">
          <div className="p-3 rounded" style={{ backgroundColor: 'white', border: '1px solid #b1c181' }}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <FiFileText style={{ color: '#849b50' }} />
              <h6 className="mb-0" style={{ color: '#44482c' }}>Registros Catastrales</h6>
              {(autorizedUser || isPostulant) &&
                (progressObj?.sectionsStatus.predialInfo ? (
                  <div className="ms-auto">
                    <CheckIcon className="text-success" style={{ color: '#849b50' }} />
                  </div>
                ) : (
                  <div className="ms-auto">
                    <HourGlassIcon className="text-danger" style={{ color: '#dc3545' }} />
                  </div>
                ))
              }
            </div>
            <CadastralRecordsInfoCard
              autorizedUser={autorizedUser}
              setProgressChange={setProgressChange}
              totalArea={totalArea}
              latLngCentroid={latLngCentroid}
              setTotalArea={setTotalArea}
              tooltip={
                (autorizedUser || isPostulant) &&
                (progressObj?.sectionsStatus.predialInfo ? (
                  <CheckIcon className="text-success" style={{ color: '#849b50' }} />
                ) : (
                  <HourGlassIcon className="text-danger" style={{ color: '#dc3545' }} />
                ))
              }
            />
          </div>
        </div>
        
        <div className="col">
          <div className="h-100 p-3 rounded" style={{ backgroundColor: 'white', border: '1px solid #b1c181' }}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <FiUsers style={{ color: '#849b50' }} />
              <h6 className="mb-0" style={{ color: '#44482c' }}>Información del Propietario</h6>
              {(autorizedUser || isPostulant) &&
                (progressObj?.sectionsStatus.ownersInfo ? (
                  <div className="ms-auto">
                    <CheckIcon className="text-success" style={{ color: '#849b50' }} />
                  </div>
                ) : (
                  <div className="ms-auto">
                    <HourGlassIcon className="text-danger" style={{ color: '#dc3545' }} />
                  </div>
                ))
              }
            </div>
            <OwnerInfoCard
              autorizedUser={autorizedUser}
              setProgressChange={setProgressChange}
              tooltip={
                (autorizedUser || isPostulant) &&
                (progressObj?.sectionsStatus.ownersInfo ? (
                  <CheckIcon className="text-success" style={{ color: '#849b50' }} />
                ) : (
                  <HourGlassIcon className="text-danger" style={{ color: '#dc3545' }} />
                ))
              }
            />
          </div>
        </div>
        
        <div className="col">
          <div className="h-100 p-3 rounded" style={{ backgroundColor: 'white', border: '1px solid #b1c181' }}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <FiUsers style={{ color: '#849b50' }} />
              <h6 className="mb-0" style={{ color: '#44482c' }}>Información del Postulante</h6>
            </div>
            <PostulantInfoCard autorizedUser={autorizedUser} />
          </div>
        </div>
        
        <div className="col-12 col-lg-12">
          <div className="p-3 rounded" style={{ backgroundColor: 'white', border: '1px solid #b1c181' }}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <FiMapPin style={{ color: '#849b50' }} />
              <h6 className="mb-0" style={{ color: '#44482c' }}>Uso Actual y Potencial</h6>
            </div>
            <ActualUseAndPotentialInfoCard autorizedUser={autorizedUser} />
          </div>
        </div>
        
        <div className="col-12 col-lg-12">
          <div className="p-3 rounded" style={{ backgroundColor: 'white', border: '1px solid #b1c181' }}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <FiFileText style={{ color: '#849b50' }} />
              <h6 className="mb-0" style={{ color: '#44482c' }}>Restricciones de Uso</h6>
            </div>
            <UseRestrictionsInfoCard autorizedUser={autorizedUser} />
          </div>
        </div>
        
        <div className="col-12 col-lg-12">
          <div className="p-3 rounded" style={{ backgroundColor: 'white', border: '1px solid #b1c181' }}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <FiMapPin style={{ color: '#849b50' }} />
              <h6 className="mb-0" style={{ color: '#44482c' }}>Información del Ecosistema</h6>
            </div>
            <EcosystemInfoCard autorizedUser={autorizedUser} />
          </div>
        </div>
        
        <div className="col">
          <div className="h-100 p-3 rounded" style={{ backgroundColor: 'white', border: '1px solid #b1c181' }}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <FiFileText style={{ color: '#849b50' }} />
              <h6 className="mb-0" style={{ color: '#44482c' }}>Información de la Propiedad</h6>
            </div>
            <PropertyInfoCard autorizedUser={autorizedUser} />
          </div>
        </div>
        
        <div className="col">
          <div className="h-100 p-3 rounded" style={{ backgroundColor: 'white', border: '1px solid #b1c181' }}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <FiUsers style={{ color: '#849b50' }} />
              <h6 className="mb-0" style={{ color: '#44482c' }}>Relaciones del Proyecto</h6>
            </div>
            <RelationsInfoCard autorizedUser={autorizedUser} />
          </div>
        </div>
        */}
      </div>

      {/* Footer informativo */}
      <div className="mt-4 p-3 rounded text-center" style={{ backgroundColor: '#f0f4e6', border: '1px solid #e8d79a' }}>
        <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
          <FiClock style={{ color: '#6e6c35' }} />
          <small style={{ color: '#44482c' }}>Última actualización: {new Date().toLocaleDateString('es-ES')}</small>
        </div>
        <div className="d-flex align-items-center justify-content-center gap-2">
          <FiCheckCircle style={{ color: '#849b50' }} />
          <small style={{ color: '#44482c' }}>
            {progressObj?.sectionsStatus ? 
              `Progreso: ${Object.values(progressObj.sectionsStatus).filter(Boolean).length}/${Object.keys(progressObj.sectionsStatus).length} secciones completadas` :
              'Cargando progreso...'
            }
          </small>
        </div>
      </div>
    </div>
  );
}
