import React, { useContext, useState } from "react";

const ProjectDataContext = React.createContext();

export function useProjectData() {
  return useContext(ProjectDataContext);
}

export function ProjectDataProvider({ children }) {
  const [projectData, setProjectData] = useState({});

  const handleProjectData = async (data) => {
    setProjectData(data);
  };

  const handleUpdateContextDocumentStatus = async (fileIndex, status) => {
    let updateProjectData = projectData;
    updateProjectData.projectFiles[fileIndex].isApproved = status;
    updateProjectData.projectFiles[fileIndex].status = status
      ? "accepted"
      : "denied";

    setProjectData(updateProjectData);
  };

  const handleUpdateContextProjectTokenData = async (data) => {
    setProjectData((prevData) => ({
      ...prevData,
      projectInfo: {
        ...prevData.projectInfo,
        token: { ...prevData.projectInfo.token, ...data },
      },
    }));
  };

  const contextProps = {
    projectData,
    handleProjectData,
    handleUpdateContextDocumentStatus,
    handleUpdateContextProjectTokenData,
  };

  return (
    <ProjectDataContext.Provider value={contextProps}>
      {children}
    </ProjectDataContext.Provider>
  );
}
