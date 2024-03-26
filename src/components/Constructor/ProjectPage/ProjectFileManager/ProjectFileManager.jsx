import React from "react";

import { useProjectData } from "../../../../context/ProjectDataContext";
import FileManager from "./FileManager";

export default function ProjectFileManager({ visible }) {
  const { projectData } = useProjectData();

  // projectData.projectInfo.id
  return (
    <>
      {visible && (
        <div className="row row-cols-1 rowflex flex-wrap ">
          <div className="col-12 col relative flex-grow max-w-full flex-1 px-4">
            <FileManager rootFolder={projectData.projectInfo.id} />
          </div>
        </div>
      )}
    </>
  );
}
