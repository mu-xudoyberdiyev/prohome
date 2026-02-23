import { Navigate } from "react-router-dom";
import { useAppStore } from "../lib/zustand";
import Cashflow from "../components/Cashflow";
import StatsPieChart from "../components/StatsPieChart";

export default function Home() {
  const { user } = useAppStore();

  if (user) {
    return (
      <section className="animate-fade-in h-full">
        <div className="flex flex-col gap-10 w-full p-5">
          <Cashflow />
          <StatsPieChart />
        </div>
      </section>
    );
  } else {
    return <Navigate to={"/login"} />;
  }
}
