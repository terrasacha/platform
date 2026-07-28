import React, { Component } from "react";
// import '@aws-amplify/ui-react/styles.css'
// Bootstrap components reemplazados con Tailwind CSS
// Auth css custom
// Componentes Terrasacha
import TerrasachaTable, { TerrasachaTableCell, TerrasachaBadge } from "../../common/TerrasachaTable";
// GraphQL
import { API, graphqlOperation } from "aws-amplify";
import {
  createUnitOfMeasure,
  updateUnitOfMeasure,
} from "../../../graphql/mutations";
import { listUnitOfMeasures } from "../../../graphql/queries";
import {
  onCreateUnitOfMeasure,
  onUpdateUnitOfMeasure,
} from "../../../graphql/subscriptions";

class UOM extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unitOfMeasures: [],
      CRUDButtonName: "CREAR",
      isCRUDButtonDisable: true,
      newUnitOfMeasure: {
        id: "",
        engineeringUnit: "",
        description: "",
        isFloat: false,
      },
    };
    this.handleOnChangeInputForm = this.handleOnChangeInputForm.bind(this);
    this.handleCRUDUnitOfMeasure = this.handleCRUDUnitOfMeasure.bind(this);
    this.handleLoadEditUnitOfMeasure =
      this.handleLoadEditUnitOfMeasure.bind(this);
  }

  componentDidMount = async () => {
    await this.loadUnitOfMeasures();

    // Subscriptions
    // OnCreate OUM
    let tempUnitOfMeasures = this.state.unitOfMeasures;
    this.createUnitOfMeasureListener = API.graphql(
      graphqlOperation(onCreateUnitOfMeasure)
    ).subscribe({
      next: (createdUnitOfMeasureData) => {
        let tempOnCreateUnitOfMeasure =
          createdUnitOfMeasureData.value.data.onCreateUnitOfMeasure;
        tempUnitOfMeasures.push(tempOnCreateUnitOfMeasure);
        // Ordering categorys by name
        tempUnitOfMeasures.sort((a, b) => (a.name > b.name ? 1 : -1));
        // this.updateStateCategorys(tempCategorys)
        this.setState((state) => ({ unitOfMeasures: tempUnitOfMeasures }));
      },
    });

    // OnUpdate OUM
    this.updateCategoryListener = API.graphql(
      graphqlOperation(onUpdateUnitOfMeasure)
    ).subscribe({
      next: (updatedUnitOfMeasureData) => {
        let tempUnitOfMeasures = this.state.unitOfMeasures.map(
          (mapUnitOfMeasure) => {
            if (
              updatedUnitOfMeasureData.value.data.onUpdateUnitOfMeasure.id ===
              mapUnitOfMeasure.id
            ) {
              return updatedUnitOfMeasureData.value.data.onUpdateUnitOfMeasure;
            } else {
              return mapUnitOfMeasure;
            }
          }
        );
        // Ordering categorys by name
        tempUnitOfMeasures.sort((a, b) => (a.name > b.name ? 1 : -1));
        this.setState((state) => ({ unitOfMeasures: tempUnitOfMeasures }));
      },
    });
  };
  componentWillUnmount() {
    // TODO: Why is not working the unsubscribe
    // this.createUnitOfMeasureListener.unsubscribe();
    // this.updateCategoryListener.unsubscribe();
  }

  async loadUnitOfMeasures() {
    const listUnitOfMeasuresResult = await API.graphql(
      graphqlOperation(listUnitOfMeasures)
    );
    listUnitOfMeasuresResult.data.listUnitOfMeasures.items.sort((a, b) =>
      a.name > b.name ? 1 : -1
    );
    this.setState({
      unitOfMeasures: listUnitOfMeasuresResult.data.listUnitOfMeasures.items,
    });
  }

  handleOnChangeInputForm = async (event, pProperty) => {
    let tempNewUnitOfMeasure = this.state.newUnitOfMeasure;
    if (event.target.name === "newUnitOfMeasure.engineeringUnit") {
      tempNewUnitOfMeasure.engineeringUnit = event.target.value;
      tempNewUnitOfMeasure.id = event.target.value.replaceAll(" ", "_");
    }
    if (event.target.name === "newUnitOfMeasure.description") {
      tempNewUnitOfMeasure.description = event.target.value;
    }
    if (pProperty === "isFloat") {
      tempNewUnitOfMeasure.isFloat = !tempNewUnitOfMeasure.isFloat;
    }
    this.setState({ newUnitOfMeasure: tempNewUnitOfMeasure });
    this.validateCRUDUnitOfMeasure();
  };

  async validateCRUDUnitOfMeasure() {
    if (this.state.newUnitOfMeasure.name !== "") {
      this.setState({ isCRUDButtonDisable: false });
    }
  }

  async handleCRUDUnitOfMeasure() {
    let tempNewUnitOfMeasure = this.state.newUnitOfMeasure;

    if (this.state.CRUDButtonName === "CREAR") {
      await API.graphql(
        graphqlOperation(createUnitOfMeasure, { input: tempNewUnitOfMeasure })
      );
      await this.cleanUnitOfMeasureOnCreate();
    }

    if (this.state.CRUDButtonName === "UPDATE") {
      delete tempNewUnitOfMeasure.createdAt;
      delete tempNewUnitOfMeasure.updatedAt;
      delete tempNewUnitOfMeasure.formulas;
      delete tempNewUnitOfMeasure.features;
      await API.graphql(
        graphqlOperation(updateUnitOfMeasure, { input: tempNewUnitOfMeasure })
      );
      await this.cleanUnitOfMeasureOnCreate();
    }
  }

  handleLoadEditUnitOfMeasure = async (unitOfMeasures, event) => {
    this.setState({
      newUnitOfMeasure: unitOfMeasures,
      CRUDButtonName: "UPDATE",
      isCRUDButtonDisable: false,
    });
    this.validateCRUDUnitOfMeasure();
  };

  async cleanUnitOfMeasureOnCreate() {
    this.setState({
      CRUDButtonName: "CREAR",
      isCRUDButtonDisable: true,
      newUnitOfMeasure: {
        id: "",
        engineeringUnit: "",
        description: "",
        isFloat: false,
      },
    });
  }

  // RENDER
  render() {
    // State Varibles
    let { unitOfMeasures, newUnitOfMeasure, CRUDButtonName } = this.state;

    const renderUnitOfMeasures = () => {
      if (unitOfMeasures.length > 0) {
        return (
          <TerrasachaTable
            title="Unidades de Medida Configuradas"
            subtitle="Lista de todas las unidades de medida disponibles en el sistema"
            headers={['Unidad de Ingeniería', 'Descripción', 'Permite decimales', 'Acción']}
            data={unitOfMeasures}
            renderRow={(unitOfMeasure) => (
              <>
                <TerrasachaTableCell variant="primary">
                  {unitOfMeasure.engineeringUnit}
                </TerrasachaTableCell>
                <TerrasachaTableCell variant="secondary">
                  {unitOfMeasure.description}
                </TerrasachaTableCell>
                <TerrasachaTableCell>
                  <TerrasachaBadge variant={unitOfMeasure.isFloat ? 'success' : 'warning'}>
                    {unitOfMeasure.isFloat ? "Sí" : "No"}
                  </TerrasachaBadge>
                </TerrasachaTableCell>
                <TerrasachaTableCell>
                  <button
                    className="btn-terrasacha-secondary text-sm"
                    onClick={(e) =>
                      this.handleLoadEditUnitOfMeasure(unitOfMeasure, e)
                    }
                  >
                    Editar
                  </button>
                </TerrasachaTableCell>
              </>
            )}
          />
        );
      }
    };

    return (
      <div className="container mx-auto mt-20 px-4">
        <div className="bg-white rounded-xl shadow-terrasacha-lg border border-terrasacha-light/20 p-8 mb-8">
          <h2 className="text-2xl font-bold text-terrasacha-primary font-champagne mb-6">
            {CRUDButtonName} Unidad de Medida
          </h2>
          <form className="space-y-6">
            <div>
              <label
                htmlFor="formGridEngineeringUnit"
                className="block text-sm font-bold text-terrasacha-secondary1 font-typographica mb-2"
              >
                Unidad de Ingeniería
              </label>
              <input
                type="text"
                placeholder="Ingrese la unidad de ingeniería"
                id="formGridEngineeringUnit"
                name="newUnitOfMeasure.engineeringUnit"
                value={newUnitOfMeasure.engineeringUnit}
                onChange={(e) => this.handleOnChangeInputForm(e)}
                className="w-full px-4 py-3 border border-terrasacha-light rounded-lg focus:outline-none focus:ring-2 focus:ring-terrasacha-primary focus:border-transparent font-typographica transition-all duration-200 shadow-sm hover:shadow-terrasacha"
              />
            </div>
            <div>
              <label
                htmlFor="formGridDescription"
                className="block text-sm font-bold text-terrasacha-secondary1 font-typographica mb-2"
              >
                Descripción
              </label>
              <input
                type="text"
                placeholder="Ingrese la descripción"
                id="formGridDescription"
                name="newUnitOfMeasure.description"
                value={newUnitOfMeasure.description}
                onChange={(e) => this.handleOnChangeInputForm(e)}
                className="w-full px-4 py-3 border border-terrasacha-light rounded-lg focus:outline-none focus:ring-2 focus:ring-terrasacha-primary focus:border-transparent font-typographica transition-all duration-200 shadow-sm hover:shadow-terrasacha"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-terrasacha-secondary1 font-typographica mb-3">
                ¿Permite decimales?
              </label>
              <button
                type="button"
                onClick={(e) => this.handleOnChangeInputForm(e, "isFloat")}
                className={`font-typographica font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-terrasacha hover:shadow-terrasacha-lg transform hover:-translate-y-0.5 ${
                  newUnitOfMeasure.isFloat 
                    ? "bg-terrasacha-secondary2 hover:bg-terrasacha-secondary2/90 text-white" 
                    : "bg-terrasacha-light hover:bg-terrasacha-light/90 text-terrasacha-secondary1"
                }`}
              >
                {newUnitOfMeasure.isFloat ? "SÍ" : "NO"}
              </button>
            </div>
            <div className="pt-4 border-t border-terrasacha-light/20">
              <button
                type="button"
                onClick={this.handleCRUDUnitOfMeasure}
                disabled={this.state.isCRUDButtonDisable}
                className="btn-terrasacha-primary w-full text-lg py-3"
              >
                {CRUDButtonName}
              </button>
            </div>
          </form>
        </div>
        {renderUnitOfMeasures()}
      </div>
    );
  }
}

export default UOM;
