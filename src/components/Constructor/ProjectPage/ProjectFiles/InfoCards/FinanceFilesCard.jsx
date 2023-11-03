import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { API, graphqlOperation, Storage } from "aws-amplify";
import Button from "react-bootstrap/Button";
import { updateProductFeature } from "graphql/mutations";
import { useProjectData } from "../../../../../context/ProjectDataContext";
import { validateProjectFeatures } from './validateProjectFeatures';  // Asegúrate de proporcionar la ruta correcta

export default function FinanceCard(props) {
	const {
		className,
		projectFiles,
		projectFeatures,
	} = props;

	const { projectData } = useProjectData();
	const [validadorShow, setValidadorShow] = useState(true);
	const dataToken = projectData.projectFinancialInfo.tokenAmountDistribution.tokenAmountDistribution;
	const dataCash = projectData.projectFinancialInfo.cashFlowResume;
	const dataRevenues = projectData.projectFinancialInfo.revenuesByProduct;
	const dataIndicador = projectData.projectFinancialInfo.financialIndicators;
	const isValid = validateProjectFeatures(projectData.projectFeatures);
	//const isValid = validateProjectFeatures(projectFeature);
console.log(projectData);
	const handleBotoncheckpostulant = async () => {
		const newProductFeature = projectData.projectFeatures.find(
			(item) => item.featureID === "GLOBAL_OWNER_ACCEPTS_CONDITIONS"
		);
	
		if (newProductFeature) {
			newProductFeature.value = "true";
			await API.graphql(
				graphqlOperation(updateProductFeature, { input: newProductFeature })
			);
		}
		setValidadorShow(false);
	};

	return isValid && validadorShow ? (
		<>
		<div className="row p-3 m-2 confirmacion_finan">
				<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z" /></svg>
				Por favor, verifica cuidadosamente los siguientes indicadores financieros. Estas serán las tendencias y la evolución que tendrá el proyecto, según nuestros expertos. Debes estar de acuerdo con esto para que tu proyecto sea publicado en nuestro Marketplace.<br></br>
				<br></br><span className="text-center">Confirmo que leí y estoy deacuerdo con los indicadores presentados por SUAN. </span><br></br>
				<Button
					className="m-auto d-block w-25 mt-3"
					onClick={() => {
						handleBotoncheckpostulant();
					}}
				>
					Aceptar información financiera
				</Button>
			</div>
			<div className="container">
				<div className="row">
					<DistributionToken infoTable={dataToken} />
					<CashProducts infoTable={dataCash.cashFlowResume.flujos_de_caja} />
					<IndicatorsProducts infoTable={dataIndicador.financialIndicators} />
					<RevenuesProducts infoTable={dataRevenues.revenuesByProduct} />
				</div>
			</div>
		</>
	) :
		<>
			<div className="container">
				<div className="row">
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
			<div className="row align-items-start ">
				<div className="col p-3 m-2 box-postulant">
					<h5>Distribución de Tokens del proyecto</h5>
					<p className="text-tok-post">Los tokens asociados al propietario, se enviarán despues de aprobada la información financiera*</p>
					<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
						<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
							<tr className="distribution">
								{Object.keys(infoTable).map((key) => (
									<th scope="col" className="px-3 py-2" key={key}>
										{key}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 distribution">
								{Object.values(infoTable).map((value, index) => (
									<td className="px-3 py-2" key={index}>
										{value}%
									</td>
								))}
							</tr>
						</tbody>
					</table>
					<PieChartComponent infoTable={infoTable} />
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
			<div className="row align-items-start ">
				<div className="col p-3 m-2 box-postulant">
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
		<div className="col p-3 m-2 box-postulant">
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
		<div className=" col p-3 m-2 box-postulant">
			<h5>Ingresos por productos</h5>
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

const PieChartComponent = ({ infoTable }) => {
	const [chartData, setChartData] = useState([]);

	useEffect(() => {
		if (infoTable) {
			const newChartData = Object.keys(infoTable).map((key) => ({
				name: key,
				value: Number(infoTable[key]),
			}));
			setChartData(newChartData);
		}
	}, [infoTable]);


	const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1942', '#00FF99', '#FF6600', '#8A2BE2'];

	return (
		<div className="w-full flex items-center justify-center">
			<ResponsiveContainer width="100%" height={300}>
				<PieChart width={300} height={300}>
					<Pie
						dataKey="value"
						data={chartData}
						cx="50%"
						cy="50%"
						outerRadius={100}
						innerRadius={50}
						fill="#8884d8"
						labelLine={false}
					>
						{chartData.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
						))}
					</Pie>
					<Tooltip />
					<Legend layout="vertical" align="left" verticalAlign="middle" />
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
};
