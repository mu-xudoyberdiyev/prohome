import { Navigate } from "react-router-dom";
import { useAppStore } from "../lib/zustand";

export default function Rop() {
  const { user } = useAppStore();

  if (user) {
    return (
      <section>
        <h2 className="mb-5 font-bold text-3xl">Boshqaruvchilar</h2>
      </section>
    );
  } else {
    return <Navigate to={"/login"} />;
  }
}
