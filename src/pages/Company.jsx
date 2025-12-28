import { Navigate } from "react-router-dom";
import { useAppStore } from "../lib/zustand";

export default function Company() {
  const { user } = useAppStore();

  if (user) {
    return (
      <section className="h-full animate-fade-in">
        <h2 className="mb-5 font-bold text-3xl">Kompaniyalar</h2>
      </section>
    );
  } else {
    return <Navigate to={"/login"} />;
  }
}
