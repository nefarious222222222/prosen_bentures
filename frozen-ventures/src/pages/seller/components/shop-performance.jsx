import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../../../context/user-context";
import { LineChart } from "../../../components/line-chart";
import { BarChart } from "../../../components/bar-chart";
import { HorizontalBarChart } from "../../../components/horizontal-bar-chart";

export const ShopPerformance = () => {
  const { user } = useContext(UserContext);
  const [shopPerformance, setShopPerformance] = useState({
    totalRevenue: 0,
    soldProducts: 0,
    cancelledOrders: 0,
    requestRefund: 0,
  });

  useEffect(() => {
    const fetchShopPerformance = async () => {
      try {
        const response = await axios.get(
          `http://localhost/prosen_bentures/api/manageShopPerformance.php?shopId=${user.shopId}`
        );
        const data = response.data;

        setShopPerformance({
          totalRevenue: data.totalRevenue ?? 0,
          soldProducts: data.soldProducts ?? 0,
          cancelledOrders: data.cancelledOrders ?? 0,
          requestRefund: data.requestRefund ?? 0,
        });
      } catch (error) {
        console.error("Error fetching shop performance:", error);
      }
    };

    fetchShopPerformance();
  }, [user.shopId]);

  return (
    <div className="shop-performance">
      <h1>Shop Performance</h1>

      <div className="metrics-container">
        <div className="metric">
          <div className="metric-value">{shopPerformance.totalRevenue}</div>
          <div className="metric-label">Total Revenue</div>
        </div>

        <div className="metric">
          <div className="metric-value">{shopPerformance.soldProducts}</div>
          <div className="metric-label">Sold Products</div>
        </div>

        <div className="metric">
          <div className="metric-value">{shopPerformance.cancelledOrders}</div>
          <div className="metric-label">Cancelled Order</div>
        </div>

        <div className="metric">
          <div className="metric-value">{shopPerformance.requestRefund}</div>
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
