import React from "react";

import ProjectSettingsCard from "./SettingCards/ProjectSettingsCard";
import TokenSettingsCard from "./SettingCards/TokenSettingsCard";
import CashFlowSettings from "./SettingCards/CashFlowSettings";
import GenericInputTable from "./SettingCards/GenericInputTable";

export default function ProjectSettings() {

  return (
    <div className="row row-cols-1 row-cols-xl-2 g-4">
      <div className="col">
        <ProjectSettingsCard />
      </div>
      <div className="col">
        <TokenSettingsCard />
      </div>
      <div className="col">
        <CashFlowSettings />
      </div>
      <div className="col">
        <GenericInputTable title={'Ingresos por producto'} fID={'GLOBAL_INGRESOS_POR_PRODUCTO'} financialInfoType={'revenuesByProduct'}/>
      </div>
      <div className="col">
        <GenericInputTable title={'Productos del ciclo del proyecto'} fID={'GLOBAL_PRODUCTOS_DEL_CICLO_DE_PROYECTO'} financialInfoType={'productsOfCycleProject'}/>
      </div>
    </div>
  );
}
