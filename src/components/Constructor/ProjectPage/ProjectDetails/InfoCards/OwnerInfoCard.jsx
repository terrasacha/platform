import React, { useEffect, useState } from "react";

import Card from "../../../../common/Card";
import FormGroup from "../../../../common/FormGroup";
import { useProjectData } from "../../../../../context/ProjectDataContext";
import { TrashIcon } from "components/common/icons/TrashIcon";
import { Button, Form, Table } from "react-bootstrap";
import { EditIcon } from "components/common/icons/EditIcon";
import { SaveDiskIcon } from "components/common/icons/SaveDiskIcon";
import { PlusIcon } from "components/common/icons/PlusIcon";
import { notify } from "../../../../../utilities/notify";
import { API, graphqlOperation } from "aws-amplify";
import { createProductFeature, updateProductFeature } from "graphql/mutations";

export default function OwnerInfoCard(props) {
  const { className, autorizedUser } = props;
  const { projectData } = useProjectData();

  const [tokenHistoricalData, setTokenHistoricalData] = useState([{}]);

  useEffect(() => {
    if (projectData && projectData.projectOwners) {
      console.log(projectData, "projectData");

      const ownersData =
        [...projectData.projectOwners.owners].map((ownerData) => {
          return {
            ...ownerData,
            editing: false,
          };
        }) || [];

      setTokenHistoricalData(ownersData);
    }
  }, [projectData]);

  const handleEditHistoricalData = async (indexToStartEditing) => {
    const isEditingSomeHistoryData = tokenHistoricalData.some(
      (ownerData) => ownerData.editing === true
    );
    if (!isEditingSomeHistoryData) {
      setTokenHistoricalData((prevState) =>
        prevState.map((item, index) =>
          index === indexToStartEditing ? { ...item, editing: true } : item
        )
      );
    } else {
      notify({
        msg: "Termina la edición antes de realizar una nueva",
        type: "error",
      });
    }
  };

  const handleChangeInputValue = async (e) => {
    const { name, value } = e.target;

    if (name.includes("owner_")) {
      console.log("entro");
      const [_, tokenHistoryFeature, tokenHistoryIndex] = name.split("_");

      setTokenHistoricalData((prevState) =>
        prevState.map((item, index) =>
          index === parseInt(tokenHistoryIndex)
            ? { ...item, [tokenHistoryFeature]: value }
            : item
        )
      );
    }
  };

  const handleAddNewPeriodToHistoricalData = async () => {
    const isEditingSomeHistoryData = tokenHistoricalData.some(
      (ownerData) => ownerData.editing === true
    );
    if (!isEditingSomeHistoryData) {
      setTokenHistoricalData((prevState) => {
        return [
          ...prevState,
          {
            name: "",
            docNumber: "",
            docType: "",
            editing: true,
          },
        ];
      });
    } else {
      notify({
        msg: "Guarda primero los datos antes de agregar una nueva fila",
        type: "error",
      });
    }
  };

  function getImportantValues(ownersDataFixed) {
    return ownersDataFixed.map((ownerData) => {
      return {
        name: ownerData.name.toUpperCase(),
        docType: ownerData.docType,
        docNumber: ownerData.docNumber,
      };
    });
  }

  const handleSaveHistoricalData = async (indexToSave) => {
    let error = false;
    const newDocNumber = tokenHistoricalData[indexToSave].docNumber;
    // const count = projectData.projectInfo.token.historicalData.reduce((acc, hd) => (hd.period === tokenHistoricalData[indexToSave].period ? acc + 1 : acc), 0);
    const isAlreadyExistingDocNumber =
      projectData.projectInfo.token.historicalData.some(
        (hd, index) => hd.docNumber === newDocNumber && index !== indexToSave
      );

    if (isAlreadyExistingDocNumber) {
      notify({
        msg: "El periodo que intentas guardar ya esta definido",
        type: "error",
      });
      return;
    }

    if (
      tokenHistoricalData[indexToSave].name &&
      tokenHistoricalData[indexToSave].docType &&
      tokenHistoricalData[indexToSave].docNumber
    ) {
      setTokenHistoricalData((prevState) =>
        prevState.map((item, index) =>
          index === indexToSave
            ? { ...item, editing: false, updatedAt: Date.now() }
            : item
        )
      );

      if (projectData.projectOwners.pfID) {
        let tempProductFeature = {
          id: projectData.projectOwners.pfID,
          value: JSON.stringify(getImportantValues(tokenHistoricalData)),
        };
        const response = await API.graphql(
          graphqlOperation(updateProductFeature, { input: tempProductFeature })
        );

        if (!response.data.updateProductFeature) error = true;
      } else {
        let tempProductFeature = {
          value: JSON.stringify(getImportantValues(tokenHistoricalData)),
          isToBlockChain: false,
          isOnMainCard: false,
          productID: projectData.projectInfo.id,
          featureID: "B_owners",
        };
        const response = await API.graphql(
          graphqlOperation(createProductFeature, { input: tempProductFeature })
        );

        if (!response.data.createProductFeature) error = true;
      }
    } else {
      notify({
        msg: "Completa todos los campos antes de guardar",
        type: "error",
      });
      return;
    }

    if (!error) {
      notify({
        msg: "Propietarios guardados exitosamente",
        type: "success",
      });
    }
  };

  const handleDeleteHistoricalData = async (indexToDelete) => {
    let error = false;

    const tempTokenHistoricalData = tokenHistoricalData.filter(
      (_, index) => index !== indexToDelete
    );
    setTokenHistoricalData(tempTokenHistoricalData);

    if (projectData.projectOwners.pfID) {
      let tempProductFeature = {
        id: projectData.projectOwners.pfID,
        value: JSON.stringify(getImportantValues(tempTokenHistoricalData)),
      };
      const response = await API.graphql(
        graphqlOperation(updateProductFeature, { input: tempProductFeature })
      );

      if (!response.data.updateProductFeature) error = true;
    } else {
      let tempProductFeature = {
        value: JSON.stringify(getImportantValues(tempTokenHistoricalData)),
        isToBlockChain: false,
        isOnMainCard: false,
        productID: projectData.projectInfo.id,
        featureID: "B_owners",
      };
      const response = await API.graphql(
        graphqlOperation(createProductFeature, { input: tempProductFeature })
      );

      if (!response.data.createProductFeature) error = true;
    }

    if (!error) {
      notify({
        msg: "Valores borrados exitosamente",
        type: "success",
      });
    }
  };

  return (
    <Card className={className}>
      <Card.Header title="Información de titulares" sep={true} />
      <Card.Body>
        {/* <div className="row">
          <div className="col-12 col-md-6">
            <FormGroup
              disabled
              label="Nombre del titular"
              inputValue={projectData.projectOwner?.name}
            />
          </div>
          <div className="col-12">
            <div className="row">
              <div className="col-6">
                <FormGroup
                  disabled
                  label="Tipo de documento"
                  inputType="radio"
                  optionList={[
                    { label: "CC", value: "CC" },
                    { label: "NIT", value: "NIT" },
                  ]}
                  optionCheckedList={projectData.projectOwner?.docType}
                />
              </div>
              <div className="col-6">
                <FormGroup
                  disabled
                  label="Número de identificación"
                  inputValue={projectData.projectOwner?.docNumber}
                />
              </div>
            </div>
          </div>
        </div> */}
        <div className="row">
          <Table responsive>
            <thead className="text-center">
              <tr>
                <th style={{ width: "300px" }}>Nombre</th>
                <th style={{ width: "120px" }}>Tipo Documento</th>
                <th style={{ width: "120px" }}>Numero Documento</th>
                <th style={{ width: "120px" }}></th>
              </tr>
            </thead>
            <tbody className="align-middle">
              {tokenHistoricalData.map((data, index) => {
                return (
                  <tr key={index} className="text-center">
                    {data.editing ? (
                      <>
                        <td>
                          <Form.Control
                            size="sm"
                            type="text"
                            value={data.name}
                            className="text-center"
                            name={`owner_name_${index}`}
                            onChange={(e) => handleChangeInputValue(e)}
                          />
                        </td>
                        <td>
                          <Form.Select
                            size="sm"
                            type="text"
                            value={data.docType}
                            className="text-center"
                            name={`owner_docType_${index}`}
                            onChange={(e) => handleChangeInputValue(e)}
                          >
                            <option disabled value=""></option>
                            <option value="cc">CC</option>
                            <option value="nit">NIT</option>
                          </Form.Select>
                        </td>
                        <td>
                          <Form.Control
                            size="sm"
                            type="number"
                            value={data.docNumber}
                            className="text-center"
                            name={`owner_docNumber_${index}`}
                            onChange={(e) => handleChangeInputValue(e)}
                          />
                        </td>
                        <td className="text-end">
                          <Button
                            size="sm"
                            variant="success"
                            className="m-1"
                            onClick={() => handleSaveHistoricalData(index)}
                          >
                            <SaveDiskIcon />
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            className="m-1"
                            onClick={() => handleDeleteHistoricalData(index)}
                          >
                            <TrashIcon />
                          </Button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{data.name?.toUpperCase()}</td>
                        <td>{data.docType?.toUpperCase()}</td>
                        <td>{data.docNumber}</td>
                        <td className="text-end">
                          <Button
                            size="sm"
                            variant="warning"
                            className="m-1"
                            disabled={!autorizedUser}
                            onClick={() => handleEditHistoricalData(index)}
                          >
                            <EditIcon />
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            className="m-1"
                            disabled={!autorizedUser}
                            onClick={() => handleDeleteHistoricalData(index)}
                          >
                            <TrashIcon />
                          </Button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
              <tr>
                <td colSpan={5}>
                  <div className="d-flex">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-100"
                      disabled={!autorizedUser}
                      onClick={() => handleAddNewPeriodToHistoricalData()}
                    >
                      <PlusIcon></PlusIcon>
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
}
