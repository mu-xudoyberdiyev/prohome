import { Navigate } from "react-router-dom";
import { useAppStore } from "../lib/zustand";

export default function Crm() {
  const { user } = useAppStore();

  if (user) {
    return <section className="animate-fade-in h-full">Tez kunda..</section>;
  } else {
    return <Navigate to={"/login"} />;
  }
}
