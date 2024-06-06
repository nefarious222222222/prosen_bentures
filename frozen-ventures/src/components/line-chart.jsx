import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChartData = {
  labels: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ],
  datasets: [
    {
      label: "Sales",
      data: [15, 30, 80, 50, 20, 40, 100],
      borderColor: "rgb( 126 , 166, 189)",
    },
    {
      label: "Orders",
      data: [10, 40, 30, 50, 60, 20, 90],
      borderColor: "rgb(83, 61, 112)",
    },
  ],
};

export const LineChart = () => {
  const options = {
    responsive: true,
  };

  return <Line options={options} data={LineChartData}></Line>;
};
