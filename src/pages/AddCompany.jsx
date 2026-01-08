import { Navigate } from "react-router-dom";
import { useAppStore } from "../lib/zustand";

export default function AddCompany() {
  const { user } = useAppStore();

  if (user) {
    return <h1>Add company</h1>;
  } else {
    return <Navigate to={"/login"} />;
  }
}
