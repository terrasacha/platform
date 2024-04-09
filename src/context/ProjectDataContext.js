import { fetchProjectDataByProjectID } from "components/Constructor/ProjectPage/api";
import React, { useContext, useEffect, useState } from "react";

const ProjectDataContext = React.createContext();

export function useProjectData() {
  return useContext(ProjectDataContext);
}

export function ProjectDataProvider({ children }) {
  const [projectData, setProjectData] = useState(null);
  const [projectID, setProjectID] = useState(null);

  const handleProjectData = async ({ pID }) => {
    if (!pID) {
      console.error("Page parameter is missing.");
      return;
    }
    console.log("pID", pID);
    setProjectID(pID);
    await fetchProjectData(pID);
  };

  const fetchProjectData = async (pID = null) => {
    const project_id = projectID || pID;
    if (project_id) {
      const data = await fetchProjectDataByProjectID(project_id);
      console.log("Mapped Project Data: ", data);
      setProjectData(data);

      return data;
    }
    setProjectData(null);
    return null;
  };

  const handleUpdateContextProjectData = async (data) => {
    console.log('Entro en: 1')
    fetchProjectData();
    return;
  };

  const handleUpdateContextProjectInfo = async (data) => {
    console.log('Entro en: 2')
    fetchProjectData();
    return;
  };

  const handleUpdateContextProjectOwners = async (data) => {
    console.log('Entro en: 3')
    fetchProjectData();
    return;
  };

  const handleUpdateContextProjectCadastralRecordsData = async (data) => {
    
    console.log('Entro en: 4')
    fetchProjectData();
    return;

  };

  const handleUpdateContextProjectRestrictions = async (data) => {
    
    console.log('Entro en: 5')
    fetchProjectData();
    return;

  };

  const handleUpdateContextProjectRelations = async (data) => {
    
    console.log('Entro en: 6')
    fetchProjectData();
    return;

  };

  const handleUpdateContextProjectEcosystem = async (data, obj = null) => {
    
    console.log('Entro en: 7')
    fetchProjectData();
    return;

  };

  const handleUpdateContextProjectInfoLocation = async (data) => {
    
    console.log('Entro en: 8')
    fetchProjectData();
    return;

  };

  const handleUpdateContextVerifiers = async (data) => {
    
    console.log('Entro en: 9')
    fetchProjectData();
    return;

  };

  const handleUpdateContextDocumentStatus = async (fileIndex, data) => {
    
    console.log('Entro en: 10')
    fetchProjectData();
    return;

  };

  const handleUpdateContextProjectFile = async (docID, data) => {
    console.log('Entro en: 11')
    fetchProjectData();
    return;

  };

  const handleSetContextProjectFile = async (updatedProjectFiles) => {
    console.log('Entro en: 12')
    fetchProjectData();
    return;
  };

  const handleUpdateContextProjectTokenData = async (data) => {
    console.log('Entro en: 13')
    fetchProjectData();
    return;
  };

  const handleUpdateContextFileVerification = async (fileIndex, data) => {
    console.log('Entro en: 14')
    fetchProjectData();
    return;
  };

  const handleUpdateContextProjectFileValidators = async (data) => {
    console.log('Entro en: 15')
    fetchProjectData();
    return;
  };

  const refresh = async () => {
    console.log('Entro en: 16')
    fetchProjectData();
    return;
  };

  const contextProps = {
    projectData,
    handleProjectData,
    fetchProjectData,
    handleUpdateContextProjectOwners,
    handleUpdateContextProjectCadastralRecordsData,
    handleUpdateContextProjectData,
    handleUpdateContextDocumentStatus,
    handleUpdateContextProjectFile,
    handleSetContextProjectFile,
    handleUpdateContextProjectTokenData,
    handleUpdateContextFileVerification,
    handleUpdateContextProjectInfo,
    handleUpdateContextProjectInfoLocation,
    handleUpdateContextProjectRestrictions,
    handleUpdateContextProjectRelations,
    handleUpdateContextProjectEcosystem,
    handleUpdateContextVerifiers,
    handleUpdateContextProjectFileValidators,
    refresh,
  };

  return (
    <ProjectDataContext.Provider value={contextProps}>
      {children}
    </ProjectDataContext.Provider>
  );
}
