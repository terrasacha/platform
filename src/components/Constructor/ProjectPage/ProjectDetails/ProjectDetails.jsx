import React from "react";
import PostulantInfoCard from "./InfoCards/PostulantInfoCard";
import ProjectInfoCard from "./InfoCards/ProjectInfoCard";
import OwnerInfoCard from "./InfoCards/OwnerInfoCard";
import ActualUseAndPotentialInfoCard from "./InfoCards/ActualUseAndPotentialInfoCard";
import EcosystemInfoCard from "./InfoCards/EcosystemInfoCard";
import PropertyInfoCard from "./InfoCards/PropertyInfoCard";
import RelationsInfoCard from "./InfoCards/RelationsInfoCard";
import MapCard from "../../../common/MapCard";
import { useProjectData } from "../../../../context/ProjectDataContext";
import UseRestrictionsInfoCard from "./InfoCards/UseRestrictionsInfoCard";
export default function ProjectDetails() {
  const { projectData } = useProjectData();

  console.log(projectData);
  const coords = {
    lat: projectData?.projectInfo?.location.coords.lat,
    lng: projectData?.projectInfo?.location.coords.lng,
  };

  return (
    <div className="row row-cols-1 row-cols-lg-2 g-4">
      <div className="col">
        <ProjectInfoCard />
      </div>
      <div className="col">
        <MapCard coords={coords} zoom={15} />
      </div>
      <div className="col">
        <OwnerInfoCard />
      </div>
      <div className="col">
        <PostulantInfoCard />
      </div>
      <div className={(projectData.projectUses?.replaceUse.types.length > 0 || projectData.projectUses?.actualUse.types.length > 0) ? "col-12 col-lg-12" : "col-12"}>
        <ActualUseAndPotentialInfoCard />
      </div>
      <div className={(projectData.projectUses?.replaceUse.types.length > 0 || projectData.projectUses?.actualUse.types.length > 0) ? "col-12 col-lg-12" : "col-12"}>
        <UseRestrictionsInfoCard />
      </div>
      <div className="col-12 col-lg-12">
        <EcosystemInfoCard />
      </div>
      <div className="col">
        <PropertyInfoCard />
      </div>
      <div className="col">
        <RelationsInfoCard />
      </div>
    </div>
  );
}
