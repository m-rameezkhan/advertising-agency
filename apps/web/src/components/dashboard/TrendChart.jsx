import React from "react";

import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

export function TrendChart({ trend }) {
  const data = {
    labels: trend.map((item) => item.day),
    datasets: [
      {
        label: "Spend",
        data: trend.map((item) => item.spend),
        borderColor: "#ff6b57",
        backgroundColor: "rgba(255, 107, 87, 0.15)",
        fill: true,
        tension: 0.35
      },
      {
        label: "Conversions",
        data: trend.map((item) => item.conversions),
        borderColor: "#56a7ff",
        backgroundColor: "rgba(86, 167, 255, 0.12)",
        fill: true,
        tension: 0.35
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/70 p-6 shadow-panel backdrop-blur dark:bg-ink-900/80">
      <p className="text-sm text-ink-500 dark:text-ink-300">30-day performance trend</p>
      <h2 className="mt-2 text-xl font-semibold text-ink-950 dark:text-white">Daily spend vs conversions</h2>
      <div className="mt-6 h-80">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
