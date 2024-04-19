import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const colors = ["#666de9", "#cc674e"];
export default function BarGraphComponent(props) {
  const { infoBarGraph } = props;

  // Función para generar datos aleatorios
  const generateRandomData = () => {
    return labels.map(() => Math.floor(Math.random() * 1000));
  };
  const prepareDataSets = () => {
    let datasets = [];
    infoBarGraph.data.map((item, index) => {
      datasets.push({
        label: item.name,
        data: item.y,
        backgroundColor: colors[index],
      });
    });
    return datasets;
  };
  const datasets = prepareDataSets();

  const labels = infoBarGraph.data[0].x.map((item) => item);
  const data = {
    labels,
    datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };
  return <Bar options={options} data={data} width={1200} height={500} />;
}
