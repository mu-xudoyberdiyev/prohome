import { Navigate } from "react-router-dom";
import { useAppStore } from "../lib/zustand";

export default function Home() {
  const { user } = useAppStore();
  if (user) {
    return (
      <div className="absolute inset-0 flex justify-center items-center">
        Tez orada..
      </div>
    );
  } else {
    return <Navigate to={"/login"} />;
  }
}
