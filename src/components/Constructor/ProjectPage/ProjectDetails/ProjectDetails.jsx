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
import { Alert } from "react-bootstrap";

export default function ProjectDetails() {
  const { projectData } = useProjectData();
  const [autorizedUser, setAutorizedUser] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user && projectData) {
      const verifiers = projectData?.projectVerifiers;
      const postulant = projectData?.projectPostulant?.id;
      const authorizedUsers =
        projectData?.projectInfo.projectAge < 20
          ? [...verifiers, postulant]
          : [...verifiers];
      setAutorizedUser(authorizedUsers.includes(user.id));
      console.log(projectData, "projectData");
    }
  }, [projectData]);

  return (
    <div className="row row-cols-1 row-cols-xl-2 g-4">
      {autorizedUser && !(user?.role === "validator") && (
        <div className="col-12 col-xl-12">
          <Alert variant="success">
            <Alert.Heading>Hola, {user?.name}</Alert.Heading>
            <p>
              Podras realizar ajustes a la información del proyecto durante los
              primeros 20 dias despues de su postulación. Posterior a esto se
              congelan los cambios a menos que exista solicitud formal y se abra
              manualmente en casos excepcionales.
            </p>
            <hr />
            <p className="mb-0">
              {20 - parseInt(projectData?.projectInfo.projectAge)} Dias
              restantes
            </p>
          </Alert>
        </div>
      )}
      <div className="col">
        <ProjectInfoCard autorizedUser={autorizedUser} />
      </div>
      <div className="col">
        <GeodataInfoCard autorizedUser={autorizedUser} />
      </div>
      <div className="col">
        <OwnerInfoCard autorizedUser={autorizedUser} />
      </div>
      <div className="col">
        <PostulantInfoCard autorizedUser={autorizedUser} />
      </div>
      <div
        className={
          projectData.projectUses?.replaceUse.types.length > 0 ||
          projectData.projectUses?.actualUse.types.length > 0
            ? "col-12 col-lg-12"
            : "col-12"
        }
      >
        <ActualUseAndPotentialInfoCard autorizedUser={autorizedUser} />
      </div>
      <div
        className={
          projectData.projectUses?.replaceUse.types.length > 0 ||
          projectData.projectUses?.actualUse.types.length > 0
            ? "col-12 col-lg-12"
            : "col-12"
        }
      >
        <UseRestrictionsInfoCard autorizedUser={autorizedUser} />
      </div>
      <div className="col-12 col-lg-12">
        <EcosystemInfoCard autorizedUser={autorizedUser} />
      </div>
      <div className="col">
        <PropertyInfoCard autorizedUser={autorizedUser} />
      </div>
      <div className="col">
        <RelationsInfoCard autorizedUser={autorizedUser} />
      </div>
    </div>
  );
}
