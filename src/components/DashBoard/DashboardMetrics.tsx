import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  IndianRupee,
  Package,
  ShoppingCart,
  UserCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  getOpenOrders,
  getTotalCustomerCount,
  getTotalRevenue as getTotalRevenueService,
  TotalRevenueType,
  getPendingProductionCount as getPendingProductionCountService,
} from "@/services/DashboardService";
import ErrorMessage from "../common/ErrorMessage";
import Loading from "../common/Loading";

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}

const MetricCard = ({ title, value, icon, description }: MetricCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export function DashboardMetrics() {
  const [totalRevenue, setTotalRevenue] = useState<TotalRevenueType>({
    currentTotal: 0,
    previousTotal: 0,
    percentageChange: 0,
  });
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [production, setProduction] = useState<number>(0);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTotalRevenue();
    getTotalOpenOrders();
    getTotalCustomers();
    getPendingProductionCount();
  }, []);

  const getTotalRevenue = async () => {
    try {
      setLoading(true);
      const response = await getTotalRevenueService();
      if (response.success && response.data) {
        setTotalRevenue(response.data);
        return;
      }
      setError(response.message || "Failed to fetch total revenue");
    } catch (error: any) {
      console.error("Error fetching total revenue:", error);
      setError("Failed to fetch total revenue" + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getTotalOpenOrders = async () => {
    try {
      setLoading(true);
      const response = await getOpenOrders();
      if (response.success && response.data) {
        setTotalOrders(response.data);
        return;
      }
      setError(response.message || "Failed to fetch total open orders");
    } catch (error: any) {
      console.error("Error fetching total open orders:", error);
      setError("Failed to fetch total open orders" + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getTotalCustomers = async () => {
    try {
      setLoading(true);
      const response = await getTotalCustomerCount();
      if (response.success && response.data) {
        setTotalCustomers(response.data);
        return;
      }
      setError(response.message || "Failed to fetch total customers");
    } catch (error: any) {
      console.error("Error fetching total customers:", error);
      setError("Failed to fetch total customers" + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getPendingProductionCount = async () => {
    try {
      setLoading(true);
      const response = await getPendingProductionCountService();
      if (response.success && response.data) {
        setProduction(response.data);
        return;
      }
      setError(response.message || "Failed to fetch pending production count");
    } catch (error: any) {
      console.error("Error fetching pending production count:", error);
      setError("Failed to fetch pending production count" + error.message);
    } finally {
      setLoading(false);
    }
  };

  const percentage = totalRevenue.percentageChange
    ? Math.round(totalRevenue.percentageChange) // Convert to whole number
    : 0;

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {error && <ErrorMessage message={error} />}

      {!loading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Revenue"
            value= {totalRevenue.currentTotal.toString()}
            icon={<IndianRupee className="h-4 w-4 text-muted-foreground" />}
            description={`${
              totalRevenue.currentTotal >= totalRevenue.previousTotal
                ? `Sales increased by ${percentage}% from last month`
                : `Sales decreased by ${percentage}% from last month`
            }`}
          />
          <MetricCard
            title="Active Orders"
            value={totalOrders.toString()}
            icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
            description="Orders are still OPEN"
          />
          <MetricCard
            title="Pending Production"
            value={production.toString()}
            icon={<Package className="h-4 w-4 text-muted-foreground" />}
            description="Production Order's are still pending"
          />
          <MetricCard
            title="Active Customers"
            value={totalCustomers.toString()}
            icon={<UserCheck className="h-4 w-4 text-muted-foreground" />}
            description="Customers are still active"
          />
        </div>
      )}
    </>
  );
}
