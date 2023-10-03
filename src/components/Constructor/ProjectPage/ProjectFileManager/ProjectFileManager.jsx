import React from "react";


import { useProjectData } from "../../../../context/ProjectDataContext";
import { useAuth } from "../../../../context/AuthContext";
import FileManager from "./FileManager";

export default function ProjectFileManager() {

  const { user } = useAuth();
  const { projectData } = useProjectData();

  // projectData.projectInfo.id
  return (
    <div className="row row-cols-1 row-cols-xl-2 g-4">
      <div className="col-12 col-xl-12">
        <FileManager rootFolder={projectData.projectInfo.id}/>
      </div>
    </div>
  );
}
