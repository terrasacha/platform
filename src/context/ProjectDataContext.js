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

  const contextProps = {
    projectData,
    handleProjectData,
  };

  return (
    <ProjectDataContext.Provider value={contextProps}>
      {children}
    </ProjectDataContext.Provider>
  );
}
