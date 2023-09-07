import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";

import Card from "../../../../common/Card";
import FormGroup from "../../../../common/FormGroup";
import { useProjectData } from "../../../../../context/ProjectDataContext";
import {
  createProductFeature,
  updateProductFeature,
} from "../../../../../graphql/mutations";

export default function TokenSettingsCard(props) {
  const { className } = props;

  const { projectData, handleUpdateContextProjectTokenData } = useProjectData();

  const [tokenName, setTokenName] = useState("");
  const [isDisabledTokenName, setIsDisabledTokenName] = useState(false);
  const [tokenPrice, setTokenPrice] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");

  useEffect(() => {
    if (projectData) {
      if (projectData.projectInfo.token.pfIDs.pfTokenNameID) {
        setIsDisabledTokenName(true);
      }
      setTokenName(projectData.projectInfo.token.name);
      setTokenPrice(projectData.projectInfo.token.price);
      setTokenAmount(projectData.projectInfo.token.amount);
    }
  }, [projectData]);

  const handleSaveBtn = async (toSave) => {
    if (toSave === "tokenName") {
      await handleUpdateContextProjectTokenData({ name: tokenName });

      if (projectData.projectInfo.token.pfIDs.pfTokenNameID) {
        let tempProductFeature = {
          id: projectData.projectInfo.token.pfIDs.pfTokenNameID,
          value: tokenName,
        };
        await API.graphql(
          graphqlOperation(updateProductFeature, { input: tempProductFeature })
        );
      } else {
        let tempProductFeature = {
          value: tokenName,
          isToBlockChain: false,
          isOnMainCard: false,
          productID: projectData.projectInfo.id,
          featureID: "GLOBAL_TOKEN_NAME",
        };
        await API.graphql(
          graphqlOperation(createProductFeature, { input: tempProductFeature })
        );
      }
    }
    if (toSave === "tokenPrice") {
      await handleUpdateContextProjectTokenData({ price: tokenPrice });

      if (projectData.projectInfo.token.pfIDs.pfTokenPriceID) {
        let tempProductFeature = {
          id: projectData.projectInfo.token.pfIDs.pfTokenPriceID,
          value: tokenPrice,
        };
        API.graphql(
          graphqlOperation(updateProductFeature, { input: tempProductFeature })
        );
      } else {
        let tempProductFeature = {
          value: tokenPrice,
          isToBlockChain: false,
          isOnMainCard: false,
          productID: projectData.projectInfo.id,
          featureID: "GLOBAL_TOKEN_PRICE",
        };
        API.graphql(
          graphqlOperation(createProductFeature, { input: tempProductFeature })
        );
      }
    }
    if (toSave === "tokenAmount") {
      await handleUpdateContextProjectTokenData({ amount: tokenAmount });

      if (projectData.projectInfo.token.pfIDs.pfTokenAmountID) {
        let tempProductFeature = {
          id: projectData.projectInfo.token.pfIDs.pfTokenAmountID,
          value: tokenAmount,
        };
        API.graphql(
          graphqlOperation(updateProductFeature, { input: tempProductFeature })
        );
      } else {
        let tempProductFeature = {
          value: tokenAmount,
          isToBlockChain: false,
          isOnMainCard: false,
          productID: projectData.projectInfo.id,
          featureID: "GLOBAL_AMOUNT_OF_TOKENS",
        };
        API.graphql(
          graphqlOperation(createProductFeature, { input: tempProductFeature })
        );
      }
    }
  };

  const handleChangeInputValue = async (e) => {
    if (e.target.name === "tokenName") {
      setTokenName(e.target.value);
    }
    if (e.target.name === "tokenPrice") {
      setTokenPrice(e.target.value);
    }
    if (e.target.name === "tokenAmount") {
      setTokenAmount(e.target.value);
    }
  };

  return (
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
          type="flex"
          inputType="text"
          inputSize="md"
          label="Cantidad de tokens"
          inputName="tokenAmount"
          inputValue={tokenAmount}
          saveBtnDisabled={
            projectData.projectInfo?.token.amount === tokenAmount ? true : false
          }
          onChangeInputValue={(e) => handleChangeInputValue(e)}
          onClickSaveBtn={() => handleSaveBtn("tokenAmount")}
        />
        <FormGroup
          type="flex"
          inputType="text"
          inputSize="md"
          label="Precio del token"
          inputName="tokenPrice"
          inputValue={tokenPrice}
          saveBtnDisabled={
            projectData.projectInfo?.token.price === tokenPrice ? true : false
          }
          onChangeInputValue={(e) => handleChangeInputValue(e)}
          onClickSaveBtn={() => handleSaveBtn("tokenPrice")}
        />
      </Card.Body>
    </Card>
  );
}
