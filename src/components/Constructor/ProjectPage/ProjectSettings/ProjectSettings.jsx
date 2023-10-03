import React from "react";

import ProjectSettingsCard from "./SettingCards/ProjectSettingsCard";
import TokenSettingsCard from "./SettingCards/TokenSettingsCard";
import CashFlowSettings from "./SettingCards/CashFlowSettings";

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
    </div>
  );
}
