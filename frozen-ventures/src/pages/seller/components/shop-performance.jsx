import React from "react";
import { LineChart } from "../../../components/line-chart";
import { BarChart } from "../../../components/bar-chart";
import { HorizontalBarChart } from "../../../components/horizontal-bar-chart";

export const ShopPerformance = () => {
  return (
    <div className="shop-performance">
      <h1>Shop Performance</h1>

      <div className="metrics-container">
        <div className="metric">
          <div className="metric-value">4500</div>
          <div className="metric-label">Total Revenue</div>
        </div>

        <div className="metric">
          <div className="metric-value">180</div>
          <div className="metric-label">Sold Products</div>
        </div>

        <div className="metric">
          <div className="metric-value">4</div>
          <div className="metric-label">Cancelled Order</div>
        </div>

        <div className="metric">
          <div className="metric-value">0</div>
          <div className="metric-label">Request Refund</div>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart grid1">
          <LineChart />
        </div>

        <div className="chart grid2">
          <BarChart />
        </div>

        <div className="chart grid3">
          <HorizontalBarChart />
        </div>
      </div>
    </div>
  );
};
