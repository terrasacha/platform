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

  if (!infoBarGraph) return null;

  const prepareDataSets = () => {
    return infoBarGraph.data.map((item, index) => ({
      label: item.name,
      data: item.y,
      backgroundColor: colors[index % colors.length],
    }));
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
