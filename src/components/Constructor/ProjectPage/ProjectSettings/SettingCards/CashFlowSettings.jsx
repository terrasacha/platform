import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import TableEdit from "components/common/TableEdit";
import Card from "../../../../common/Card";
import FormGroup from "../../../../common/FormGroup";
import { useProjectData } from "../../../../../context/ProjectDataContext";
import {
  createProductFeature,
  updateProductFeature,
} from "../../../../../graphql/mutations";
import { notify } from "../../../../../utilities/notify";

export default function CashFlowSettings(props) {
  const { className } = props;

  const { projectData, handleUpdateContextProjectTokenData } = useProjectData();
  const [cashFlowResume, setCashFlowResume] = useState([])
  const [TIR, setTIR] = useState(null)
  const [VAN, setVAN] = useState(null)
  const [pfID, setPfID] = useState(null)
  useEffect(() => {
    if (projectData) {
      if(projectData.projectFinancialInfo.cashFlowResume.cashFlowResumeID || null){
        setPfID(projectData.projectFinancialInfo.cashFlowResume.cashFlowResumeID || [])
        setCashFlowResume(projectData.projectFinancialInfo.cashFlowResume.cashFlowResume.flujos_de_caja || [])
        setTIR(projectData.projectFinancialInfo.cashFlowResume.cashFlowResume.TIR || "")
        setVAN(projectData.projectFinancialInfo.cashFlowResume.cashFlowResume.VAN || "")
      }
    }
  }, [projectData]);


  const handleSaveBtn = async (toSave) => {
    let error = false;
    if (pfID) {
        let tempProductFeature = {
          id: pfID,
          value: JSON.stringify({TIR,VAN,flujos_de_caja: cashFlowResume}),
        };
        console.log(tempProductFeature, 'ya existe')
        const response = await API.graphql(
          graphqlOperation(updateProductFeature, { input: tempProductFeature })
        );

        if (!response.data.updateProductFeature) error = true;
      } else {
        let tempProductFeature = {
          value: JSON.stringify({TIR,VAN,flujos_de_caja: cashFlowResume}),
          isToBlockChain: false,
          isOnMainCard: false,
          productID: projectData.projectInfo.id,
          featureID: "GLOBAL_RESUMEN_FLUJO_DE_CAJA",
        };
        console.log(tempProductFeature, 'no existe')

        API.graphql(
          graphqlOperation(createProductFeature, { input: tempProductFeature })
        )
        .then(response => setPfID(response.data.createProductFeature.id))
        .catch(err => error = true)


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
    if (name === "TIR") {
      setTIR(value);
      return;
    }
    if (name === "VAN") {
      setVAN(value);
      return;
    }

    if (name.includes("input-")) {
        const [_, column, indexRow] = name.split("-");
        console.log(column, indexRow)
      setCashFlowResume((prevState) =>
        prevState.map((item, index) =>
          index === parseInt(indexRow)
            ? { ...item, [column]: parseInt(value) }
            : item
        )
      );
    }
  };

  const handleEditValue = async (indexToStartEditing) => {
    const isEditingSomeHistoryData = cashFlowResume.some(
      (obj) => obj.editing === true
    );
    if (!isEditingSomeHistoryData) {
      setCashFlowResume((prevState) =>
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
    let isAlreadyExistingPeriod = false
    const newPeriod = cashFlowResume[indexToSave].año;
    // const count = projectData.projectInfo.token.historicalData.reduce((acc, hd) => (hd.period === tokenHistoricalData[indexToSave].period ? acc + 1 : acc), 0);
    if(projectData.projectFinancialInfo.cashFlowResume.cashFlowResume.length > 0){
        isAlreadyExistingPeriod = projectData.projectFinancialInfo.cashFlowResume.cashFlowResume.flujos_de_caja.some((hd, index) => hd.año === newPeriod && index !== indexToSave)
    }
    
    if(isAlreadyExistingPeriod) {
      notify({
        msg: "El periodo que intentas guardar ya esta definido",
        type: "error",
      });
      return;
    }
    let cashFlowResumeToUpload = cashFlowResume.map(cfr =>{return{año: cfr.año, resultado_acumulado: cfr.resultado_acumulado,resultado_anual: cfr.resultado_anual}})
    if (
      cashFlowResume[indexToSave].año &&
      cashFlowResume[indexToSave].resultado_anual &&
      cashFlowResume[indexToSave].resultado_acumulado
    ) {
      setCashFlowResume((prevState) =>
        prevState
          .map((item, index) =>
            index === indexToSave ? { ...item, editing: false } : item
          )
          .sort((a, b) => a.period - b.period)
      );
      if (pfID) {
        let tempProductFeature = {
          id: pfID,
          value: JSON.stringify({TIR,VAN,flujos_de_caja: cashFlowResumeToUpload}),
        };
        console.log(tempProductFeature, 'ya existe')
        const response = await API.graphql(
          graphqlOperation(updateProductFeature, { input: tempProductFeature })
        );

        if (!response.data.updateProductFeature) error = true;
      } else {
        let tempProductFeature = {
          value: JSON.stringify({TIR,VAN,flujos_de_caja: cashFlowResumeToUpload}),
          isToBlockChain: false,
          isOnMainCard: false,
          productID: projectData.projectInfo.id,
          featureID: "GLOBAL_RESUMEN_FLUJO_DE_CAJA",
        };
        console.log(tempProductFeature, 'no existe')

        API.graphql(
          graphqlOperation(createProductFeature, { input: tempProductFeature })
        )
        .then(response => setPfID(response.data.createProductFeature.id))
        .catch(err => error = true)


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

    const tempCashFlowResume = cashFlowResume.filter(
      (_, index) => index !== indexToDelete
    );
    setCashFlowResume(tempCashFlowResume);

    if (pfID) {
      let tempProductFeature = {
        id:pfID,
        value: JSON.stringify({TIR, VAN, flujos_de_caja: tempCashFlowResume}),
      };
      const response = await API.graphql(
        graphqlOperation(updateProductFeature, { input: tempProductFeature })
      );

      if (!response.data.updateProductFeature) error = true;
    }{

    }
    if (!error) {
      notify({
        msg: "Valores borrados exitosamente",
        type: "success",
      });
    }
  };

  const handleAddCashFlow = async () => {
    let isEditingSomeHistoryData = false
    if(cashFlowResume.length > 0){
        isEditingSomeHistoryData = cashFlowResume.some(
            (tokenHD) => tokenHD.editing === true
          );
    }
    if (!isEditingSomeHistoryData) {
      setCashFlowResume((prevState) => {
        return [
          ...prevState,
          {
            año: "0",
            resultado_acumulado: "0",
            resultado_anual: "0",
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
        <Card.Header title="Flujo de caja del proyecto" sep={true} />
        <Card.Body>
            <FormGroup
                type="flex"
                inputType="text"
                inputSize="md"
                label="TIR"
                inputName="TIR"
                inputValue={TIR}
                saveBtnDisabled={
                false
                }
                onChangeInputValue={(e) => handleChangeInputValue(e)}
                onClickSaveBtn={() => handleSaveBtn("TIR")}
            />
            <FormGroup
                type="flex"
                inputType="text"
                inputSize="md"
                label="VAN"
                inputName="VAN"
                inputValue={VAN}
                saveBtnDisabled={
                false
                }
                onChangeInputValue={(e) => handleChangeInputValue(e)}
                onClickSaveBtn={() => handleSaveBtn("VAN")}
            />
          <p className="mb-3">Flujo de caja del proyecto</p>
          <div>
            <TableEdit columns={['año', 'resultado_anual', 'resultado_acumulado']} infoTable={cashFlowResume} handleEditValue={handleEditValue} handleChangeInputValue={handleChangeInputValue} handleAddCashFlow={handleAddCashFlow} handleSaveHistoricalData={handleSaveHistoricalData} handleDeleteHistoricalData={handleDeleteHistoricalData}/>
          </div>
        </Card.Body>
      </Card>
    </>
  );
}
