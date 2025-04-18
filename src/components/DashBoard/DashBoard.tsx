import { AppSidebar } from "@/components/Sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PlusCircle, UserPlus } from "lucide-react";
import { Outlet } from "react-router-dom";
import { NotificationDrawer } from "../Notifications/notificationDrawer";
import { BreakCrumbComponent } from "../Notifications/Breadcrumbs";
import NotificationListener from "../Notifications/NotificationComponent";
import { DashboardMetrics } from "./DashboardMetrics";
import { DashboardCharts } from "./DashboardCharts";
// import { DashboardActivity } from "./DashboardActivity";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const QuickActions = () => (
  <div className="flex gap-4 mb-6">
    <Link to="/dashboard/sales-order/create">
      <Button variant="default">
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Sales Order
      </Button>
    </Link>
    <Link to="/dashboard/create-customer">
      <Button variant="outline">
        <UserPlus className="mr-2 h-4 w-4" />
        Add Customer
      </Button>
    </Link>
    {/* <Link to="/report/create"><Button variant="outline">
      <FileText className="mr-2 h-4 w-4" />
      Generate Report
    </Button></Link>
    <Button variant="outline">
      <BarChart className="mr-2 h-4 w-4" />
      View Analytics
    </Button> */}
  </div>
);

export default function Page() {
  const location = useLocation();
  const isDashboardRoot = location.pathname === "/dashboard";

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <SidebarInset className="flex-1 bg-white">
          <header className="flex h-10 justify-between border-b px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mx-2 h-4" />
              <BreakCrumbComponent />
            </div>
            <div className="flex items-center gap-4">
              <NotificationDrawer />
            </div>
          </header>

          {isDashboardRoot && (
            <main className="p-6">
              <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
              <QuickActions />
              <DashboardMetrics />
              <DashboardCharts />
              {/* <DashboardActivity /> */}
            </main>
          )}

          <Outlet />
        </SidebarInset>
      </div>
      <NotificationListener />
    </SidebarProvider>
  );
}
