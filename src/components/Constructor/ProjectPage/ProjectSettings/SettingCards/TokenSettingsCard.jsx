import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";

import Card from "../../../../common/Card";
import FormGroup from "../../../../common/FormGroup";
import { useProjectData } from "../../../../../context/ProjectDataContext";
import {
  createProductFeature,
  updateProductFeature,
} from "../../../../../graphql/mutations";
import { notify } from "../../../../../utilities/notify";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import { TrashIcon } from "components/common/icons/TrashIcon";
import { PlusIcon } from "components/common/icons/PlusIcon";
import { EditIcon } from "components/common/icons/EditIcon";
import { SaveDiskIcon } from "components/common/icons/SaveDiskIcon";
import { formatCurrency } from "utilities/formatCurrency";

export default function TokenSettingsCard(props) {
  const { className, canEdit } = props;
  console.log(canEdit);
  const { projectData, handleUpdateContextProjectTokenData } = useProjectData();

  const [tokenName, setTokenName] = useState("");
  const [tokenCurrency, setTokenCurrency] = useState("COP");
  const [totalTokenAmount, setTotalTokenAmount] = useState(0);
  const [totalTokenAmountPfID, setTotalTokenAmountPfID] = useState(null);

  const [isDisabledTokenName, setIsDisabledTokenName] = useState(false);
  const [isDisabledTokenCurrency, setIsDisabledTokenCurrency] = useState(false);
  const [tokenHistoricalData, setTokenHistoricalData] = useState([{}]);
  const [tokenHistoricalDataPfID, setTokenHistoricalDataPfID] = useState(null);

  const [tokenDistributionForm, setTokenDistributionForm] = useState({});
  const [tokenDistributionPfID, setTokenDistributionPfID] = useState(null);

  useEffect(() => {
    if (projectData) {
      if (projectData.projectInfo.token.transactionsNumber !== 0) {
        setIsDisabledTokenName(true);
      }
      setTokenName(projectData.projectInfo.token.name);
      setTotalTokenAmount(projectData.projectInfo.token.totalTokenAmount);
      setTotalTokenAmountPfID(
        projectData.projectInfo.token.pfIDs.pfTotalTokenAmountID
      );

      const sortedHistoricalData = [
        ...projectData.projectInfo.token.historicalData,
      ]
        .sort((a, b) => a.period - b.period)
        .map((tokenHD) => {
          return {
            ...tokenHD,
            editing: false,
          };
        });
      setTokenHistoricalData(sortedHistoricalData);
      setTokenHistoricalDataPfID(
        projectData.projectInfo?.token.pfIDs.pfTokenHistoricalDataID
      );

      setTokenDistributionForm((prevState) => ({
        ...prevState,
        investor: projectData.projectInfo?.token.amountDistribution.investor,
        owner: projectData.projectInfo?.token.amountDistribution.owner,
        suan: projectData.projectInfo?.token.amountDistribution.suan,
        comunity: projectData.projectInfo?.token.amountDistribution.comunity,
        buffer: projectData.projectInfo?.token.amountDistribution.buffer,
      }));
      setTokenDistributionPfID(
        projectData.projectInfo?.token.pfIDs.pfTokenAmountDistributionID
      );
    }
  }, []);

  function getImportantValues(tokenHistoricalDataFixed) {
    return tokenHistoricalDataFixed.map((tokenData) => {
      return {
        period: tokenData.period,
        date: tokenData.date,
        price: parseFloat(tokenData.price),
        amount: parseInt(tokenData.amount),
      };
    });
  }

  const handleSaveBtn = async (toSave) => {
    let error = false;
    if (toSave === "tokenName") {
      await handleUpdateContextProjectTokenData({ name: tokenName });

      if (projectData.projectInfo.token.pfIDs.pfTokenNameID) {
        let tempProductFeature = {
          id: projectData.projectInfo.token.pfIDs.pfTokenNameID,
          value: tokenName,
        };
        const response = await API.graphql(
          graphqlOperation(updateProductFeature, { input: tempProductFeature })
        );

        if (!response.data.updateProductFeature) error = true;
      } else {
        let tempProductFeature = {
          value: tokenName,
          isToBlockChain: false,
          isOnMainCard: false,
          productID: projectData.projectInfo.id,
          featureID: "GLOBAL_TOKEN_NAME",
        };

        const response = await API.graphql(
          graphqlOperation(createProductFeature, { input: tempProductFeature })
        );

        if (!response.data.createProductFeature) error = true;
      }

      if (!error) {
        notify({
          msg: "El nombre del token ha sido modificado exitosamente",
          type: "success",
        });
      }
    }
    if (toSave === "tokenCurrency") {
      await handleUpdateContextProjectTokenData({ currency: tokenCurrency });

      if (projectData.projectInfo.token.pfIDs.pfTokenCurrencyID) {
        let tempProductFeature = {
          id: projectData.projectInfo.token.pfIDs.pfTokenCurrencyID,
          value: tokenCurrency,
        };
        const response = await API.graphql(
          graphqlOperation(updateProductFeature, { input: tempProductFeature })
        );

        if (!response.data.updateProductFeature) error = true;
      } else {
        let tempProductFeature = {
          value: tokenCurrency,
          isToBlockChain: false,
          isOnMainCard: false,
          productID: projectData.projectInfo.id,
          featureID: "GLOBAL_TOKEN_CURRENCY",
        };

        const response = await API.graphql(
          graphqlOperation(createProductFeature, { input: tempProductFeature })
        );

        if (!response.data.createProductFeature) error = true;
      }

      if (!error) {
        notify({
          msg: "El nombre del token ha sido modificado exitosamente",
          type: "success",
        });
      }
    }
    if (toSave === "totalTokenAmount") {
      await handleUpdateContextProjectTokenData({
        totalTokenAmount: totalTokenAmount,
      });

      if (totalTokenAmountPfID) {
        let tempProductFeature = {
          id: totalTokenAmountPfID,
          value: totalTokenAmount,
        };
        const response = await API.graphql(
          graphqlOperation(updateProductFeature, { input: tempProductFeature })
        );

        if (!response.data.updateProductFeature) error = true;
      } else {
        let tempProductFeature = {
          value: totalTokenAmount,
          isToBlockChain: false,
          isOnMainCard: false,
          productID: projectData.projectInfo.id,
          featureID: "GLOBAL_TOKEN_TOTAL_AMOUNT",
        };

        const response = await API.graphql(
          graphqlOperation(createProductFeature, { input: tempProductFeature })
        );

        setTotalTokenAmountPfID(response.data.createProductFeature.id);

        if (!response.data.createProductFeature) error = true;
      }

      if (!error) {
        notify({
          msg: "El total de tokens ha sido modificado exitosamente",
          type: "success",
        });
      }
    }

    if (toSave === "tokenDistributionForm") {
      const totalTokenDistribution =
        parseInt(tokenDistributionForm.owner) +
        parseInt(tokenDistributionForm.investor) +
        parseInt(tokenDistributionForm.suan) +
        parseInt(tokenDistributionForm.comunity) +
        parseInt(tokenDistributionForm.buffer);
      if (totalTokenDistribution) {
        if (totalTokenDistribution === parseInt(totalTokenAmount)) {
          if (tokenDistributionPfID) {
            let tempProductFeature = {
              id: projectData.projectInfo.token.pfIDs
                .pfTokenAmountDistributionID,
              value: JSON.stringify(tokenDistributionForm),
            };
            const response = await API.graphql(
              graphqlOperation(updateProductFeature, {
                input: tempProductFeature,
              })
            );

            if (!response.data.updateProductFeature) error = true;
          } else {
            let tempProductFeature = {
              value: JSON.stringify(tokenDistributionForm),
              isToBlockChain: false,
              isOnMainCard: false,
              productID: projectData.projectInfo.id,
              featureID: "GLOBAL_TOKEN_AMOUNT_DISTRIBUTION",
            };

            const response = await API.graphql(
              graphqlOperation(createProductFeature, {
                input: tempProductFeature,
              })
            );

            setTokenDistributionPfID(response.data.createProductFeature.id);

            if (!response.data.createProductFeature) error = true;
          }
          notify({
            msg: "La distribución de tokens ha sido modificada exitosamente",
            type: "success",
          });
        } else {
          notify({
            msg: "Los tokens distribuidos no corresponden con la cantidad total de tokens",
            type: "error",
          });
        }
      } else {
        notify({
          msg: "Todos los campos deben ser correctamente llenados",
          type: "error",
        });
      }
      console.log(totalTokenDistribution, "totalTokenDistribution");
    }

    if (error) {
      notify({
        msg: "Ups!, parece que algo ha fallado",
        type: "error",
      });
    }
  };

  const handleChangeInputValue = async (e) => {
    const { name, value } = e.target;
    if (name === "tokenName") {
      setTokenName(value);
      return;
    }
    if (name === "tokenCurrency") {
      setTokenCurrency(value);
      return;
    }
    if (name === "totalTokenAmount") {
      setTotalTokenAmount(value);
      return;
    }

    if (name.includes("token_")) {
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

  const handleChangeInputValueForm = async (e) => {
    const { name, type, value, checked } = e.target;

    setTokenDistributionForm((prevFormData) => {
      const updatedFormData = { ...prevFormData };

      if (type === "checkbox") {
        if (!Array.isArray(updatedFormData[name])) {
          updatedFormData[name] = [];
        }

        if (checked && !updatedFormData[name].includes(value)) {
          updatedFormData[name].push(value);
        } else if (!checked) {
          updatedFormData[name] = updatedFormData[name].filter(
            (val) => val !== value
          );
        }
      } else if (type === "radio" && checked) {
        updatedFormData[name] = value;
      } else {
        updatedFormData[name] = value;
      }

      return updatedFormData;
    });
  };

  const handleEditHistoricalData = async (indexToStartEditing) => {
    const isEditingSomeHistoryData = tokenHistoricalData.some(
      (tokenHD) => tokenHD.editing === true
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

  const handleSaveHistoricalData = async (indexToSave) => {
    let error = false;
    const newPeriod = tokenHistoricalData[indexToSave].period;
    // const count = projectData.projectInfo.token.historicalData.reduce((acc, hd) => (hd.period === tokenHistoricalData[indexToSave].period ? acc + 1 : acc), 0);
    const isAlreadyExistingPeriod =
      projectData.projectInfo.token.historicalData.some(
        (hd, index) => hd.period === newPeriod && index !== indexToSave
      );

    if (isAlreadyExistingPeriod) {
      notify({
        msg: "El periodo que intentas guardar ya esta definido",
        type: "error",
      });
      return;
    }

    if (
      tokenHistoricalData[indexToSave].period &&
      tokenHistoricalData[indexToSave].date &&
      tokenHistoricalData[indexToSave].amount &&
      tokenHistoricalData[indexToSave].price
    ) {
      setTokenHistoricalData((prevState) =>
        prevState
          .map((item, index) =>
            index === indexToSave ? { ...item, editing: false } : item
          )
          .sort((a, b) => a.period - b.period)
      );

      if (tokenHistoricalDataPfID) {
        let tempProductFeature = {
          id: tokenHistoricalDataPfID,
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
          featureID: "GLOBAL_TOKEN_HISTORICAL_DATA",
        };
        const response = await API.graphql(
          graphqlOperation(createProductFeature, { input: tempProductFeature })
        );

        setTokenHistoricalDataPfID(response.data.createProductFeature.id);

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
        msg: "Datos historicos guardados exitosamente",
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

    if (tokenHistoricalDataPfID) {
      let tempProductFeature = {
        id: tokenHistoricalDataPfID,
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
        featureID: "GLOBAL_TOKEN_HISTORICAL_DATA",
      };
      const response = await API.graphql(
        graphqlOperation(createProductFeature, { input: tempProductFeature })
      );

      setTokenHistoricalDataPfID(response.data.createProductFeature.id);

      if (!response.data.createProductFeature) error = true;
    }

    if (!error) {
      notify({
        msg: "Valores borrados exitosamente",
        type: "success",
      });
    }
  };

  const handleAddNewPeriodToHistoricalData = async () => {
    const isEditingSomeHistoryData = tokenHistoricalData.some(
      (tokenHD) => tokenHD.editing === true
    );
    if (!isEditingSomeHistoryData) {
      setTokenHistoricalData((prevState) => {
        return [
          ...prevState,
          {
            period: "",
            date: "",
            price: "",
            amount: "",
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

  return (
    <>
      <Card className={className}>
        <Card.Header title="Configuración del Token" sep={true} />
        <Card.Body>
          <FormGroup
            disabled={isDisabledTokenName}
            type="flex"
            inputType="text"
            inputSize="md"
            label="Nombre del token"
            inputName="tokenName"
            inputValue={tokenName}
            saveBtnDisabled={
              projectData.projectInfo?.token.name === tokenName ? true : false
            }
            onChangeInputValue={(e) => handleChangeInputValue(e)}
            onClickSaveBtn={() => handleSaveBtn("tokenName")}
          />
          <FormGroup
            disabled={isDisabledTokenCurrency}
            type="flex"
            inputType="select"
            optionList={[{label: 'USD', value: 'USD'}, {label: 'COP', value: 'COP'}]}
            inputSize="md"
            label="Divisa de comercialización"
            inputName="tokenCurrency"
            inputValue={tokenCurrency}
            saveBtnDisabled={
              projectData.projectInfo?.token.currency === tokenCurrency ? true : false
            }
            onChangeInputValue={(e) => handleChangeInputValue(e)}
            onClickSaveBtn={() => handleSaveBtn("tokenCurrency")}
          />
          <p className="mb-3">Historico del token</p>
          <div>
            <Table responsive>
              <thead className="text-center">
                <tr>
                  <th style={{ width: "80px" }}>Periodo</th>
                  <th style={{ width: "100px" }}>Fecha</th>
                  <th style={{ width: "100px" }}>Volumen (tCO2eq)</th>
                  <th style={{ width: "100px" }}>Precio ({tokenCurrency})</th>
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
                              type="number"
                              value={tokenHistoricalData[index].period}
                              className="text-center"
                              name={`token_period_${index}`}
                              onChange={(e) => handleChangeInputValue(e)}
                            />
                          </td>
                          <td>
                            <Form.Control
                              size="sm"
                              type="date"
                              value={data.date}
                              className="text-center"
                              name={`token_date_${index}`}
                              onChange={(e) => handleChangeInputValue(e)}
                            />
                          </td>
                          <td>
                            <Form.Control
                              size="sm"
                              type="number"
                              value={data.amount}
                              className="text-center"
                              name={`token_amount_${index}`}
                              onChange={(e) => handleChangeInputValue(e)}
                            />
                          </td>
                          <td>
                            <Form.Control
                              size="sm"
                              type="number"
                              value={data.price}
                              className="text-center"
                              name={`token_price_${index}`}
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
                          <td>{data.period}</td>
                          <td>{data.date}</td>
                          <td>{data.amount}</td>
                          <td>{data.price}</td>
                          <td className="text-end">
                            <Button
                              size="sm"
                              variant="warning"
                              className="m-1"
                              disabled={
                                canEdit || projectData.isFinancialFreeze
                              }
                              onClick={() => handleEditHistoricalData(index)}
                            >
                              <EditIcon />
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              className="m-1"
                              disabled={
                                canEdit || projectData.isFinancialFreeze
                              }
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
                        disabled={canEdit}
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
          <FormGroup
            type="flex"
            disabled={
              canEdit || projectData.isFinancialFreeze
            }
            inputType="number"
            inputSize="md"
            label="Cantidad total de tokens"
            inputName="totalTokenAmount"
            inputValue={totalTokenAmount}
            saveBtnDisabled={
              projectData.projectInfo?.token.totalTokenAmount ===
              totalTokenAmount
                ? true
                : false
            }
            onChangeInputValue={(e) => handleChangeInputValue(e)}
            onClickSaveBtn={() => handleSaveBtn("totalTokenAmount")}
          />
          <div className="border p-3">
            <p className="mb-3 text-center">Distribución volumen de tokens</p>
            <p>Al tratarse de unidades de tokens, procure que los valores de la distribución sean enteros y no decimales. Adicionalmente, la suma de estos valores debe ser exactamente igual a la cantidad total de tokens del proyecto.</p>
            <FormGroup
              disabled={canEdit}
              type="flex"
              inputType="number"
              inputSize="md"
              label={`Inversionista (Tokens)`}
              inputName="investor"
              inputValue={tokenDistributionForm.investor}
              saveBtnVisible={false}
              onChangeInputValue={(e) => handleChangeInputValueForm(e)}
            />
            <FormGroup
              disabled={canEdit}
              type="flex"
              inputType="number"
              inputSize="md"
              label={`Propietario (Tokens)`}
              inputName="owner"
              inputValue={tokenDistributionForm.owner}
              saveBtnVisible={false}
              onChangeInputValue={(e) => handleChangeInputValueForm(e)}
            />
            <FormGroup
              disabled={canEdit}
              type="flex"
              inputType="number"
              inputSize="md"
              label={`SUAN (Tokens)`}
              inputName="suan"
              inputValue={tokenDistributionForm.suan}
              saveBtnVisible={false}
              onChangeInputValue={(e) => handleChangeInputValueForm(e)}
            />
            <FormGroup
              disabled={canEdit}
              type="flex"
              inputType="number"
              inputSize="md"
              label={`Comunidad (Tokens)`}
              inputName="comunity"
              inputValue={tokenDistributionForm.comunity}
              saveBtnVisible={false}
              onChangeInputValue={(e) => handleChangeInputValueForm(e)}
            />
            <FormGroup
              disabled={canEdit}
              type="flex"
              inputType="number"
              inputSize="md"
              label={`Buffer (Tokens)`}
              inputName="buffer"
              inputValue={tokenDistributionForm.buffer}
              saveBtnVisible={false}
              onChangeInputValue={(e) => handleChangeInputValueForm(e)}
            />
            {/* <div className="border p-3 mx-auto my-3" style={{width: "300px"}}>
                <div className="d-flex justify-content-center mb-3">Resumen</div>
                <div>
                  <ul>
                    <li>Inversionista: {(totalTokenAmount * tokenDistributionForm.investor) / 100 || 0} Tokens</li>
                    <li>Propietario: {(totalTokenAmount * tokenDistributionForm.owner) / 100  || 0} Tokens</li>
                    <li>SUAN: {(totalTokenAmount * tokenDistributionForm.suan) / 100  || 0} Tokens</li>
                    <li>Comunidad: {(totalTokenAmount * tokenDistributionForm.comunity) / 100  || 0} Tokens</li>
                    <li>Buffer: {(totalTokenAmount * tokenDistributionForm.buffer) / 100  || 0} Tokens</li>
                  </ul>
                </div>
            </div> */}
            <div className="d-flex justify-content-center">
              <Button
                disabled={canEdit}
                onClick={() => handleSaveBtn("tokenDistributionForm")}
                variant="success"
              >
                Guardar
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  );
}
