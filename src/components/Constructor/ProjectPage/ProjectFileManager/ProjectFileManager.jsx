import React, { useContext } from "react";
import { useProjectData } from "../../../../context/ProjectDataContext";
import FileManager from "./FileManager";
const dic = {
  analyst: {
    rootFolder: '/Analista',
    accessTo: ['Analista']
  },
  validator: {
    rootFolder: '/',
    accessTo: ['*']
  },
  admon:{
    rootFolder: '/',
    accessTo: ['*']
  }
}
export default function ProjectFileManager({ visible, isAnalyst }) {
  const { projectData } = useProjectData();
  if(!projectData) return null
  return (
    <>
      {visible && (
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="lg:w-full">
            <FileManager rootFolder={projectData.projectInfo.id} isAnalyst={false} dic={dic}/>
          </div>
        </div>
      )}
    </>
  );
}
