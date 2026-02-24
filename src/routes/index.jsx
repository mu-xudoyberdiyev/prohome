import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Admin from "../pages/Admin";
import Rop from "../pages/Rop";
import SalesManager from "../pages/SalesManager";
import MainLayout from "../MainLayout";
import Settings from "../pages/Settings";
import Company from "../pages/Company";
import CompanyDetails from "../pages/CompanyDetails";
import AddCompany from "../pages/AddCompany";
import Tjm from "../pages/Tjm";
import TjmDetails from "../pages/TjmDetails";
import Dashboard from "../pages/Dashboard";

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
      {
        path: "/add/company",
        element: <AddCompany />,
      },
      {
        path: "/company/:id",
        element: <CompanyDetails />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/tjm",
    element: <Tjm />,
  },
  {
    path: "/tjm/:id",
    element: <TjmDetails />,
  },
]);
