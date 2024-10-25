import React, { useContext } from "react";
import { useProjectData } from "../../../../context/ProjectDataContext";
import FileManager from "./FileManager";
import { S3ClientProvider } from "context/s3ClientContext";
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
    <S3ClientProvider>
      {visible && (
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="lg:w-full">
            <FileManager rootFolder={projectData.projectInfo.id} isAnalyst={false} dic={dic}/>
          </div>
        </div>
      )}
    </S3ClientProvider>
  );
}
