import './App.css';
import { Provider } from 'react-redux';
import store from './store/auth.ts';
import { RouterProvider, createBrowserRouter, Outlet } from 'react-router-dom';
import { Login, DashBoard, RoleList, Action, Module, PermissionList, RolePermission, Users, Register, UserPermission, RoutePermission, Permission, Customer, CustomerList, MachineType, MachineModel, Make, PowerRating, SalesPerson } from './components/index.ts';
import Loading from './Common/Loading.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    children: [
      { path: "/", element: <Login /> },
      { path: "/loading", element: <Loading />},
      {
        path: "/dashboard",
        element: <DashBoard />,
        children: [
          {
            path: "sales-order", element: "",
            children: [
              { path: "sales-person", element: <SalesPerson /> },
            ]
          },
          {
            path: "auth", element: "",
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
            ]
          },
          {
            path: "production", element: "",
            children: [
              { path: "machine-types", element: <MachineType /> },
              { path: "machine-models", element: <MachineModel /> },
              { path: "make", element: <Make /> },
              { path: "power-rating", element: <PowerRating /> }
            ]
          },
          { path: "create-customer", element: <Customer /> },
          { path: "customers", element: <CustomerList /> },
          { path: "edit-customer/:id", element: <Customer /> },
        ]
      },

    ]
  }
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;

