import { fetchProjectDataByProjectID } from "components/Constructor/ProjectPage/api";
import React, { useContext, useEffect, useState } from "react";

const ProjectDataContext = React.createContext();

export function useProjectData() {
  return useContext(ProjectDataContext);
}

export function ProjectDataProvider({ children }) {
  const [projectData, setProjectData] = useState(null);
  const [projectID, setProjectID] = useState(null);

  useEffect(() => {
    if (!projectID) {
      console.error('Page parameter is missing.');
      return;
    }
    const fetchDataToContext = async () => {
      const data = await fetchProjectDataByProjectID(projectID);

      handleProjectData(data);
    };

    fetchDataToContext();
  }, [projectID]);

  const handleProjectData = (data) => {
    setProjectData(data);
  };

  const setNewProjectID = (data) => {
    setProjectID(data);
  };

  const handleUpdateContextProjectData = async (data) => {
    setProjectData((prevData) => ({
      ...prevData,
      ...data,
    }));
  };

  const handleUpdateContextProjectInfo = async (data) => {
    setProjectData((prevData) => ({
      ...prevData,
      projectInfo: { ...prevData.projectInfo, ...data },
    }));
  };

  const handleUpdateContextProjectOwners = async (data) => {
    setProjectData((prevData) => ({
      ...prevData,
      projectOwners: data,
    }));
  };

  const handleUpdateContextProjectCadastralRecordsData = async (data) => {
    setProjectData((prevData) => ({
      ...prevData,
      projectCadastralRecords: data,
    }));
  };

  const handleUpdateContextProjectRestrictions = async (data) => {
    setProjectData((prevData) => ({
      ...prevData,
      projectRestrictions: { ...prevData.projectRestrictions, ...data },
    }));
  };

  const handleUpdateContextProjectRelations = async (data) => {
    setProjectData((prevData) => ({
      ...prevData,
      projectRelations: { ...prevData.projectRelations, ...data },
    }));
  };

  const handleUpdateContextProjectEcosystem = async (data, obj = null) => {
    if (obj === "waterSprings") {
      setProjectData((prevData) => ({
        ...prevData,
        projectEcosystem: {
          ...prevData.projectEcosystem,
          waterSprings: { ...prevData.projectEcosystem.waterSprings, ...data },
        },
      }));
    }
    if (obj === "concessions") {
      setProjectData((prevData) => ({
        ...prevData,
        projectEcosystem: {
          ...prevData.projectEcosystem,
          concessions: { ...prevData.projectEcosystem.concessions, ...data },
        },
      }));
    }
    if (obj === "diversity") {
      setProjectData((prevData) => ({
        ...prevData,
        projectEcosystem: {
          ...prevData.projectEcosystem,
          diversity: { ...prevData.projectEcosystem.diversity, ...data },
        },
      }));
    }
    if (obj === null) {
      setProjectData((prevData) => ({
        ...prevData,
        projectEcosystem: { ...prevData.projectEcosystem, ...data },
      }));
    }
  };

  const handleUpdateContextProjectInfoLocation = async (data) => {
    setProjectData((prevData) => ({
      ...prevData,
      projectInfo: {
        ...prevData.projectInfo,
        location: { ...prevData.projectInfo.location, ...data },
      },
    }));
  };

  const handleUpdateContextVerifiers = async (data) => {
    setProjectData((prevData) => ({
      ...prevData,
      projectVerifiers: [...data],
    }));
  };

  const handleUpdateContextDocumentStatus = async (fileIndex, data) => {
    setProjectData((prevData) => ({
      ...prevData,
      projectFiles: prevData.projectFiles.map((file, index) => {
        if (index === fileIndex) {
          return {
            ...file,
            ...data,
          };
        } else {
          return file;
        }
      }),
    }));
  };

  const handleUpdateContextProjectFile = async (docID, data) => {
    if (docID && projectData.projectFiles.find((item) => item.id === docID)) {
      setProjectData((prevData) => ({
        ...prevData,
        projectFiles: prevData.projectFiles.map((file) => {
          if (file.id === docID) {
            return {
              ...file,
              ...data,
            };
          } else {
            return file;
          }
        }),
      }));
    } else {
      setProjectData((prevData) => ({
        ...prevData,
        projectFiles: [...prevData.projectFiles, data],
      }));
    }
  };
  

  const handleSetContextProjectFile = async (updatedProjectFiles) => {
    setProjectData((prevData) => ({
      ...prevData,
      projectFiles: updatedProjectFiles,
    }));
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

  const handleUpdateContextFileVerification = async (fileIndex, data) => {
    setProjectData((prevData) => ({
      ...prevData,
      projectFiles: prevData.projectFiles.map((file, index) => {
        if (index === fileIndex) {
          return {
            ...file,
            verification: { ...data },
          };
        } else {
          return file;
        }
      }),
    }));
  };

  const handleUpdateContextProjectFileValidators = async (data) => {
    setProjectData((prevData) => ({
      ...prevData,
      projectFilesValidators: {
        ...prevData.projectFilesValidators,
        ...data,
      },
    }));
  };

  const refresh = async () => {
    setProjectData((prevData) => ({
      ...prevData,
    }));
  };

  const contextProps = {
    projectData,
    handleProjectData,
    setNewProjectID,
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
