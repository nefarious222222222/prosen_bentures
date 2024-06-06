import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChartData = {
  labels: ["Matcha", "Vanilla", "Chocolate"],
  datasets: [
    {
      label: "Sales",
      data: [15, 30, 80, 50, 20, 40, 100],
      backgroundColor: "rgba( 126 , 166, 189, 0.5)",
      borderColor: "rgb( 126 , 166, 189)",
      borderWidth: 1,
    },
    {
      label: "Orders",
      data: [10, 40, 30, 50, 60, 20, 90],
      backgroundColor: "rgba(83, 61, 112, 0.5)",
      borderColor: "rgb(83, 61, 112)",
      borderWidth: 1,
    },
  ],
};

export const HorizontalBarChart = () => {
  const options = {
    indexAxis: "y",
    maintainAspectRatio: false,
    responsive: true,
    aspectRatio: 2,
  };

  return <Bar options={options} data={BarChartData}></Bar>;
};