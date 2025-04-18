import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useMemo, useState } from "react";
import { getLast6MonthsData, getStatusWiseOrderCount, getTopMachineModels } from "@/services/DashboardService";

// Register ChartJS components once at the module level
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export function DashboardCharts() {
  const [orderStatusCount, setOrderStatusCount] = useState<{
    [key: string]: number;
  }>({
    OPEN: 0,
    CLOSED: 0,
    CANCELLED: 0,
  });
  const [salesChart, setSalesChart] = useState<{
    labels: string[];
    data: number[];
  }>({
    labels: [],
    data: [],
  });
  const [topProducts, setTopProducts] = useState<{
    labels: string[];
    data: number[];
  }>({
    labels: [],
    data: [],
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getStatusWiseChartOrderCount();
    getSalesData();
    getTopMachineModel();
  }, []);

  const getStatusWiseChartOrderCount = async () => {
    setLoading(true);
    try {
      const response = await getStatusWiseOrderCount();
      if (response.success && response.data) {
        const formattedData: { [key: string]: number } = {
          OPEN: 0,
          CLOSED: 0,
          CANCELLED: 0,
        };

        response.data.forEach(
          (item: { orderStatus: string; _count: { orderStatus: number } }) => {
            formattedData[item.orderStatus] = item._count.orderStatus;
          }
        );

        setOrderStatusCount(formattedData);
        return;
      }
    } catch (error: any) {
      console.error("Error fetching status-wise order count:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSalesData = async () => {
    setLoading(true);
    try {
      const response = await getLast6MonthsData();
      if (response.success && response.data) {
        setSalesChart({
          labels: response.data.labels,
          data: response.data.data,
        });
        return;
      }
    } catch (error: any) {
      console.error("Error fetching sales data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTopMachineModel = async () => {
    setLoading(true);
    try {
      const response = await getTopMachineModels();
      if (response.success && response.data) {
        setTopProducts({
          labels: response.data.labels,
          data: response.data.data,
        });
        return;
      }
    } catch (error: any) {
      console.error("Error fetching top machine models:", error);
    } finally {
      setLoading(false);
    }
  };

  const salesData = useMemo(
    () => ({
      labels: salesChart.labels,
      datasets: [
        {
          label: "Sales Trend",
          data: salesChart.data,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    }),
    [salesChart]
  );

  const orderStatusData = useMemo(
    () => ({
      labels: ["OPEN", "CLOSED", "CANCELLED"],
      datasets: [
        {
          data: [
            orderStatusCount.OPEN,
            orderStatusCount.CLOSED,
            orderStatusCount.CANCELLED,
          ],
          backgroundColor: [
            "rgb(75, 192, 192)",
            "rgb(255, 205, 86)",
            "rgb(255, 99, 132)",
          ],
        },
      ],
    }),
    [orderStatusCount]
  );

  const topProductsData = useMemo(
    () => ({
      labels: topProducts.labels,
      datasets: [
        {
          label: "Orders Created",
          data: topProducts.data,
          backgroundColor: "rgba(75, 192, 192, 0.5)",
        },
      ],
    }),
    [topProducts]
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
      {loading && <div>Loading...</div>}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Sales Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <Line
            data={salesData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "bottom" as const,
                },
              },
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Pie
            data={orderStatusData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "bottom" as const,
                },
              },
            }}
          />
        </CardContent>
      </Card>

       <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Top Machine Models</CardTitle>
        </CardHeader>
        <CardContent>
          <Bar
            data={topProductsData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "bottom" as const,
                },
              },
            }}
          />
        </CardContent>
      </Card> 
    </div>
  );
}
