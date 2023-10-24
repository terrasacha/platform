import React, { useState } from "react";

import { API, graphqlOperation, Storage } from "aws-amplify";
import Card from "../../../../common/Card";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { DownloadIcon } from "../../../../common/icons/DownloadIcon";
import { MessagesIcon } from "../../../../common/icons/MessagesIcon";
import { CheckIcon } from "../../../../common/icons/CheckIcon";
import { XIcon } from "../../../../common/icons/XIcon";
import {
	createVerification,
	updateDocument,
} from "../../../../../graphql/mutations";
import { useProjectData } from "../../../../../context/ProjectDataContext";
import { useAuth } from "../../../../../context/AuthContext";
import { notify } from "../../../../../utilities/notify";
import { validateProjectFeatures } from './validateProjectFeatures';  // Asegúrate de proporcionar la ruta correcta


export default function FinanceCard(props) {
	const {
		className,
		projectFiles,
		projectFeatures,
	} = props;

	const { projectData,
	} = useProjectData();
	const dataToken = projectData.projectFinancialInfo.tokenAmountDistribution.tokenAmountDistribution;
	const dataCash = projectData.projectFinancialInfo.cashFlowResume;
	const dataRevenues = projectData.projectFinancialInfo.revenuesByProduct;
	const dataIndicador = projectData.projectFinancialInfo.financialIndicators;

	const isValid = validateProjectFeatures(projectData.projectFeatures);
	console.log(isValid);

	return isValid ? (
		<div className="container">
			<DistributionToken infoTable={dataToken} />
			<CashProducts infoTable={dataCash.cashFlowResume.flujos_de_caja} />
			<IndicatorsProducts infoTable={dataIndicador.financialIndicators} />
			<RevenuesProducts infoTable={dataRevenues.revenuesByProduct} />
		</div>
	) :
		<>
			<div className="container">
				<div className="row">
					<div className="row p-3 m-2 confirmacion_finan">
						<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z" /></svg>

						Por favor, verifica cuidadosamente los siguientes indicadores financieros. Estas serán las tendencias y la evolución que tendrá el proyecto, según nuestros expertos. Debes estar de acuerdo con esto para que tu proyecto sea publicado en nuestro Marketplace<br></br>
						<label htmlFor="acuerdo_finanzas" className="m-2">
							<input type="checkbox" name="acuerdo_finanzas" id="check_finazes" className="mx-2" />
							Confirmo que leí y estoy deacuerdo con los indicadores presentados por SUAN
						</label>
					</div>
					<DistributionToken infoTable={dataToken} />
					<CashProducts infoTable={dataCash.cashFlowResume.flujos_de_caja} />
					<IndicatorsProducts infoTable={dataIndicador.financialIndicators} />
					<RevenuesProducts infoTable={dataRevenues.revenuesByProduct} />
				</div>
			</div>
		</>

}

function DistributionToken({ infoTable, typeInfo }) {
	if (!infoTable || infoTable.length === 0) {
		return <p>No hay datos disponibles.</p>;
	}

	return (
		<div className="col">
			<div className="row align-items-start">
				<div className="col p-3 m-2">
					<h5>Distribución de Tokens del proyecto</h5>
					<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
						<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
							<tr>
								{Object.keys(infoTable).map((key) => (
									<th scope="col" className="px-3 py-2" key={key}>
										{key}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
								{Object.values(infoTable).map((value, index) => (
									<td className="px-3 py-2" key={index}>
										{value}
									</td>
								))}
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

function CashProducts({ infoTable, typeInfo }) {

	if (!infoTable || infoTable.length === 0) {
		return <p>No hay datos disponibles.</p>;
	}

	const columns = ["Año", "Resultado Anual", "Resultado Acumulado", "Unidad"];

	return (
		<div className="col">
			<div className="row align-items-start">
				<div className="col p-3 m-2 ">
					<h5>Productos del ciclo del proyecto</h5>
					<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
						<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
							<tr>
								{columns.map((column) => (
									<th scope="col" className="px-3 py-2" key={column}>
										{column}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{infoTable.map((row, index) => (
								<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={index}>
									<td className="px-3 py-2">{row.año}</td>
									<td className="px-3 py-2">{row.resultado_anual}</td>
									<td className="px-3 py-2">{row.resultado_acumulado}</td>
									<td className="px-3 py-2">COP</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
function IndicatorsProducts({ infoTable, typeInfo }) {

	if (!infoTable || infoTable.length === 0) {
		return <p>No hay datos disponibles.</p>;
	}

	const columns = ["Concepto", "Cantidad", "Unidad"];

	return (
		<div className="col p-3 m-2">
			<h5>Indicadores Financieros</h5>
			<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
				<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
					<tr>
						{columns.map((column) => (
							<th scope="col" className="px-3 py-2" key={column}>
								{column}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{infoTable.map((row, index) => (
						<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={index}>
							<td className="px-3 py-2">{row.CONCEPTO}</td>
							<td className="px-3 py-2">{row.VALOR}</td>
							<td className="px-3 py-2">COP</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
function RevenuesProducts({ infoTable, typeInfo }) {

	if (!infoTable || infoTable.length === 0) {
		return <p>No hay datos disponibles.</p>;
	}

	const columns = ["Concepto", "Cantidad", "Unidad"];

	return (
		<div>
			<div>Ingresos por productos</div>
			<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
				<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
					<tr>
						{columns.map((column) => (
							<th scope="col" className="px-3 py-2" key={column}>
								{column}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{infoTable.map((row, index) => (
						<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={index}>
							<td className="px-3 py-2">{row.CONCEPTO}</td>
							<td className="px-3 py-2">{row.VALOR}</td>
							<td className="px-3 py-2">COP</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
