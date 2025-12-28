import { Navigate } from "react-router-dom";
import { useAppStore } from "../lib/zustand";

export default function SalesManager() {
  const { user } = useAppStore();
  if (user) {
    return (
      <section>
        <h2 className="mb-5 font-bold text-3xl">Sotuv operatorlari</h2>
        <p>Tez orada...</p>
      </section>
    );
  } else {
    return <Navigate to={"/login"} />;
  }
}
