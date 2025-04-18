import {
  Login,
  DashBoard,
  RoleList,
  Action,
  Module,
  PermissionList,
  FieldPermission,
  FieldPermissionList,
} from "./components/index";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import "./index.css";
import CreateSalesOrder from "./components/Salesorder/CreateSalesOrder";
import TopicsList from "./components/NotificationModule/Topics";
import SalesOrderDatatableList from "./components/Salesorder/SalesOrderList";
import SalesOrderDetails from "./components/Salesorder/SalesOrderDetails";
import ErrorPage from "./ErrorPage";
import NotFoundPage from "./NotFoundPage";
import ProtectedRoute from "./checkLogin";
import { Toaster } from "react-hot-toast";
import ProductionDatatableList from "./components/Production/ProductionDetailsList";
import { useEffect, useState } from "react";
import { checkUserLoggedIn } from "./services/UserService";
import useAuthStore from "./stores/useAuthStore";
import Register from "./components/DashBoard/Register";
import Users from "./components/DashBoard/UserList";
import Permission from "./components/DashBoard/Permission";
import RolePermission from "./components/DashBoard/RolePermission";
import UserPermission from "./components/DashBoard/UserPermission";
import RoutePermission from "./components/DashBoard/RoutePermission";
import SalesPerson from "./components/DashBoard/SalesOrder/SalesPerson";
import MachineType from "./components/DashBoard/Production/MachineType";
import MachineModel from "./components/DashBoard/Production/MachineModel";
import Make from "./components/DashBoard/Production/Make";
import PowerRating from "./components/DashBoard/Production/PowerRating";
import Customer from "./components/DashBoard/Customer/Customer";
import CustomerList from "./components/DashBoard/Customer/CustomerList";
import Loading from "./components/common/Loading";
import LoggingPage from "./components/Logging/LoggingPage";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { setUser } = useAuthStore();

  useEffect(() => {
    const checkUser = async () => {
      const response = await checkUserLoggedIn();
      if (response.success) {
        setIsLoading(false);
        setUser(response.data);
      } else {
        setIsLoading(false);
      }
    };
    checkUser();
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <DashBoard />
        </ProtectedRoute>
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          path: "auth",
          element: "",
          children: [
            { path: "register/", element: <Register /> },
            { path: "edit-user/:id", element: <Register /> },
            { path: "users", element: <Users /> },
            { path: "roles", element: <RoleList /> },
            { path: "actions", element: <Action /> },
            { path: "modules", element: <Module /> },
            { path: "permissions", element: <PermissionList /> },
            { path: "add-permission", element: <Permission /> },
            { path: "edit-permission/:id", element: <Permission /> },
            { path: "role-permission", element: <RolePermission /> },
            { path: "user-permission", element: <UserPermission /> },
            { path: "route-permission", element: <RoutePermission /> },
            { path: "create-field-permission", element: <FieldPermission />},
            { path: "field-permissions", element: <FieldPermissionList />}
          ],
        },
        {
          path: "sales-order",
          children: [
            {
              path: "create",
              element: <CreateSalesOrder />,
            },
            {
              path: "",
              element: <SalesOrderDatatableList />,
            },
            {
              path: "details/:soId",
              element: <SalesOrderDetails />,
            },
            {
              path: "sales-person",
              element: <SalesPerson />,
            },
          ],
        },
        {
          path: "production",
          element: "",
          children: [
            {
              path: "production-list",
              element: <ProductionDatatableList />,
            },
            { path: "machine-types", element: <MachineType /> },
            { path: "machine-models", element: <MachineModel /> },
            { path: "make", element: <Make /> },
            { path: "power-rating", element: <PowerRating /> },
          ],
        },
        {
          path: "notifications",
          children: [
            {
              path: "",
              element: <TopicsList />,
            },
          ],
        },
        {
          path: "logging",
          element: <LoggingPage />,
        },
        { path: "create-customer", element: <Customer /> },
        { path: "customers", element: <CustomerList /> },
        { path: "edit-customer/:id", element: <Customer /> },
      ],
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="app">
        <RouterProvider router={router} />
      </div>
      <Toaster
        reverseOrder={false}
        toastOptions={{
          className: "",
          duration: 5000,
          removeDelay: 0,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
    </>
  );
}

export default App;
