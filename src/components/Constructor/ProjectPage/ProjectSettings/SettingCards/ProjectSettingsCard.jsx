import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";

import Card from "../../../../common/Card";
import FormGroup from "../../../../common/FormGroup";

import { useProjectData } from "../../../../../context/ProjectDataContext";
import { updateProduct } from "../../../../../graphql/mutations";
import { notify } from "../../../../../utilities/notify";

import { fetchProjectDataByProjectID } from "../../api";

export default function ProjectSettingsCard(props) {
  const { className } = props;

  const { projectData, handleUpdateContextProjectInfo } = useProjectData();
  const [projectIsActive, setProjectIsActive] = useState(false);
  const [projectStatus, setProjectStatus] = useState("");
  const [projectShowOn, setProjectShowOn] = useState("");

  useEffect(() => {
    if (projectData) {
      setProjectIsActive(projectData.projectInfo.isActive);
      setProjectStatus(projectData.projectInfo.status);
      setProjectShowOn(projectData.projectInfo.showOn);
    }
  }, [projectData]);

  const handleChangeProjectIsActiveStatus = async () => {
    setProjectIsActive(!projectIsActive);
    let updatedProduct = {
      id: projectData.projectInfo.id,
      isActive: !projectIsActive,
    };
    await API.graphql(
      graphqlOperation(updateProduct, { input: updatedProduct })
    );

    if (!projectIsActive === true) {
      notify({
        msg: "Ahora el proyecto sera visible en Marketplace",
        type: "success",
      });
    } else {
      notify({
        msg: "El proyecto ha sido ocultado en Marketplace",
        type: "success",
      });
    }
  };

  const handleChangeProjectStatus = (event) => {
    const { name, type, value, checked } = event.target;
    setProjectStatus(value);
  };
  const handleChangeProjectShowOn = (event) => {
    const { name, type, value, checked } = event.target;
    setProjectShowOn(value);
  };

  const handleSaveProjectStatus = async () => {
    let updatedProduct = {
      id: projectData.projectInfo.id,
      status: projectStatus,
    };
    await API.graphql(
      graphqlOperation(updateProduct, { input: updatedProduct })
    );
    notify({
      msg: "El estado del proyecto ha sido actualizado",
      type: "success",
    });
  };
  const handleSaveProjectShowOn = async () => {
    let updatedProduct = {
      id: projectData.projectInfo.id,
      showOn: projectShowOn,
    };
    await API.graphql(
      graphqlOperation(updateProduct, { input: updatedProduct })
    );
    handleUpdateContextProjectInfo({ showOn: projectShowOn });
    notify({
      msg: `El ahora se muestra en el marketplace de ${projectShowOn}`,
      type: "success",
    });
  };

  return (
    <div className={className}>
    <div className="border-b border-gray-300">
      <h2 className="text-2xl font-semibold mb-4">Configuración del Proyecto</h2>
    </div>
    <div className="p-6">
      <div className="mb-4">
        <label htmlFor="projectStatus" className="block text-sm font-medium text-gray-700">
          Estado del proyecto
        </label>
        <select
          id="projectStatus"
          name="projectStatus"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={projectStatus}
          onChange={(e) => handleChangeProjectStatus(e)}
        >
          <option value="Prefactibilidad">Prefactibilidad</option>
          <option value="Factibilidad">Factibilidad</option>
          <option value="Documento de diseño del proyecto">Documento de diseño del proyecto</option>
          <option value="Validación externa">Validación externa</option>
          <option value="Registro del proyecto">Registro del proyecto</option>
        </select>
        <button
          className="mt-2 btninline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline"
          disabled={projectData.projectInfo?.status === projectStatus}
          onClick={() => handleSaveProjectStatus()}
        >
          Guardar
        </button>
      </div>
  
      <div className="mb-4">
        <label htmlFor="projectShowOn" className="block text-sm font-medium text-gray-700">
          El proyecto debe mostrarse en:
        </label>
        <select
          id="projectShowOn"
          name="projectShowOn"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={projectShowOn}
          onChange={(e) => handleChangeProjectShowOn(e)}
        >
          <option value="Suan">Suan</option>
          <option value="Terrasacha">Terrasacha</option>
        </select>
        <button
          className="mt-2 btninline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline"
          disabled={projectData.projectInfo?.showOn === projectShowOn}
          onClick={() => handleSaveProjectShowOn()}
        >
          Guardar
        </button>
      </div>
  
      <div className="mb-4">
        <label htmlFor="projectIsActive" className="flex items-center justify-between">
          <span className="block text-sm font-medium text-gray-700">
            Proyecto visible en Marketplace
          </span>
          <input
            id="projectIsActive"
            name="projectIsActive"
            type="checkbox"
            className="ml-2 form-checkbox h-5 w-5 text-blue-600"
            checked={projectIsActive}
            onChange={() => handleChangeProjectIsActiveStatus()}
          />
        </label>
      </div>
    </div>
  </div>
  
  );
}
