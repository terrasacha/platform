import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";

import Card from "../../../../common/Card";
import FormGroup from "../../../../common/FormGroup";

import { useProjectData } from "../../../../../context/ProjectDataContext";
import { updateProduct } from "../../../../../graphql/mutations";
import { notify } from "../../../../../utilities/notify";

import { fetchProjectDataByProjectID } from "../../api";

const listMarketplacess = /* GraphQL */ `
  query ListMarketplaces(
    $filter: ModelMarketplaceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMarketplaces(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
      }
    }
  }
`;

export default function ProjectSettingsCard(props) {
  const { className } = props;

  const { projectData, fetchProjectData } = useProjectData();
  const [projectIsActive, setProjectIsActive] = useState(false);
  const [projectStatus, setProjectStatus] = useState("");
  const [projectShowOn, setProjectShowOn] = useState("");
  const [projectReadyToPublish, setProjectReadyToPublish] = useState(false);
  const [listMarketplaces, setListMarketplaces] = useState([]);

  useEffect(() => {
    const loadMarketplaces = async () => {
      API.graphql(graphqlOperation(listMarketplacess)).then((data) => {
        const marketplaces = data.data.listMarketplaces.items;
        setListMarketplaces(marketplaces);
        console.log(marketplaces);
      });
    };

    loadMarketplaces();
  }, []);
  useEffect(() => {
    if (projectData) {
      let projectReadyToPublishData =
        projectData.projectFeatures.find(
          (item) => item.featureID === "GLOBAL_OWNER_ACCEPTS_CONDITIONS"
        )?.value || "false";
      if(projectReadyToPublishData){
        setProjectReadyToPublish(JSON.parse(projectReadyToPublishData));
        setProjectIsActive(projectData.projectInfo.isActive);
        setProjectStatus(projectData.projectInfo.status);
        setProjectShowOn(projectData.projectInfo.showOn);
      }
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

    await fetchProjectData();

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

    await fetchProjectData();

    notify({
      msg: "El estado del proyecto ha sido actualizado",
      type: "success",
    });
  };
  const handleSaveProjectShowOn = async () => {
    let updatedProduct = {
      id: projectData.projectInfo.id,
      marketplaceID: projectShowOn,
    };
    await API.graphql(
      graphqlOperation(updateProduct, { input: updatedProduct })
    );
    await fetchProjectData();
    notify({
      msg: `Se ha asignado el proyecto a un nuevo marketplace`,
      type: "success",
    });
  };

  return (
    <Card className={className}>
      <Card.Header title="Configuración del Proyecto" sep={true} />
      <Card.Body>
        <FormGroup
          type="flex"
          label="Estado del proyecto"
          inputType="select"
          inputSize="md"
          optionList={[
            { value: "Prefactibilidad", label: "Prefactibilidad" },
            { value: "Factibilidad", label: "Factibilidad" },
            {
              value: "Documento de diseño del proyecto",
              label: "Documento de diseño del proyecto",
            },
            { value: "Validación externa", label: "Validación externa" },
            { value: "Registro del proyecto", label: "Registro del proyecto" },
          ]}
          inputValue={projectStatus}
          saveBtnDisabled={
            projectData.projectInfo?.status === projectStatus ? true : false
          }
          onChangeInputValue={(e) => handleChangeProjectStatus(e)}
          onClickSaveBtn={() => handleSaveProjectStatus()}
        />
        <FormGroup
          type="flex"
          label="El proyecto debe mostrarse en: "
          inputType="select"
          inputSize="md"
          optionList={listMarketplaces.map((marketplace) => {
            return {
              value: marketplace.id,
              label: marketplace.name
            }
          })}
          inputValue={projectShowOn}
          saveBtnDisabled={
            projectData.projectInfo?.showOn === projectShowOn ? true : false
          }
          onChangeInputValue={(e) => handleChangeProjectShowOn(e)}
          onClickSaveBtn={() => handleSaveProjectShowOn()}
        />
        <FormGroup
          disabled={!projectReadyToPublish}
          label="Proyecto visible en Marketplace"
          inputType="switch"
          checked={projectIsActive}
          onChangeInputValue={() => handleChangeProjectIsActiveStatus()}
        />
      </Card.Body>
    </Card>
  );
}
