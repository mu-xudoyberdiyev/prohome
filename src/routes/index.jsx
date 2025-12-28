import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Admin from "../pages/Admin";
import Rop from "../pages/Rop";
import SalesManager from "../pages/SalesManager";
import MainLayout from "../MainLayout";
import Settings from "../pages/Settings";
import Company from "../pages/Company";

export default createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        index: true,
        element: <Home />,
      },
      {
        path: "/admin",
        element: <Admin />,
      },
      {
        path: "/rop",
        element: <Rop />,
      },
      {
        path: "/salesmanager",
        element: <SalesManager />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/company",
        element: <Company />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
