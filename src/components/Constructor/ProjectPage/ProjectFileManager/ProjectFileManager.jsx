import React from "react";
import { useProjectData } from "../../../../context/ProjectDataContext";
import FileManager from "./FileManager";

export default function ProjectFileManager({ visible }) {
  const { projectData } = useProjectData();

  return (
    <>
      {visible && (
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="lg:w-full">
            <FileManager rootFolder={projectData.projectInfo.id} />
          </div>
        </div>
      )}
    </>
  );
}
