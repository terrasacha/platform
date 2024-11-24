import React, { useEffect, useState } from "react";
import { useAuth } from "context/AuthContext";
import { getProjectProgress } from "services/getProjectProgress";
import { CheckIcon } from "components/common/icons/CheckIcon";
import { HourGlassIcon } from "components/common/icons/HourGlassIcon";
import { usePropertyData } from "context/PropertyDataContext";

import ActualUseAndPotential from "components/Constructor/Property/ActualUseAndPotential";
import UseRestrictions from "./UseRestrictions";
import Ecosystem from "./Ecosystem";
import GeneralAspects from "./GeneralAspects";
import Relations from "./Relations";
import CadastralRecords from "./CadastralRecords";
import AdditionalFiles from "./AdditionalFiles";

export default function PropertyDetails({ visible }) {
  const { propertyData } = usePropertyData();
  const [autorizedUser, setAutorizedUser] = useState(false);
  const [isPostulant, setIsPostulant] = useState(false);
  const [isVerifier, setIsVerifier] = useState(false);
  const { user } = useAuth();

  const [totalArea, setTotalArea] = useState(0);
  const [latLngCentroid, setLatLngCentroid] = useState(null);

  useEffect(() => {
    if (user && propertyData) {
      const verifiers = [];
      const postulant = propertyData?.projectPostulant?.id;
      const authorizedUsers = [...verifiers, postulant];
      setAutorizedUser(
        (authorizedUsers.includes(user.id) && (propertyData.propertyInfo.status === null || propertyData.propertyInfo.status === 'PENDING')) || user.role === "admon"
      );
      setIsPostulant(postulant === user.id);
      setIsVerifier(verifiers.includes(user.id));
    }
  }, [user, propertyData]);

  return (
    <>
      {visible && propertyData && (
        <div className="row row-cols-1 row-cols-xl-2 g-4">
          <div className="col-12 col-xl-12">
            <CadastralRecords
              autorizedUser={autorizedUser}
              totalArea={totalArea}
              latLngCentroid={latLngCentroid}
              setTotalArea={setTotalArea}
            />
          </div>
          <div
            className={
              propertyData.propertyUses?.replaceUse.types.length > 0 ||
              propertyData.propertyUses?.actualUse.types.length > 0
                ? "col-12 col-lg-12"
                : "col-12"
            }
          >
            <ActualUseAndPotential autorizedUser={autorizedUser} />
          </div>
          <div
            className={
              propertyData.projectUses?.replaceUse.types.length > 0 ||
              propertyData.projectUses?.actualUse.types.length > 0
                ? "col-12 col-lg-12"
                : "col-12"
            }
          >
            <UseRestrictions autorizedUser={autorizedUser} />
          </div>
          <div className="col-12 col-lg-12">
            <Ecosystem autorizedUser={autorizedUser} />
          </div>
          <div className="col">
            <GeneralAspects autorizedUser={autorizedUser} />
          </div>
          <div className="col">
            <Relations autorizedUser={autorizedUser} />
          </div>
          <div className="col-12 col-xl-12">
            <AdditionalFiles autorizedUser={autorizedUser} />
          </div>
        </div>
      )}
    </>
  );
}
