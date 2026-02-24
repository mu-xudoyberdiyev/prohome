import { Navigate } from "react-router-dom";
import { useAppStore } from "../lib/zustand";
import Cashflow from "../components/Cashflow";
import StatsPieChart from "../components/StatsPieChart";
import Sales from "../components/Sales";

export default function Dashboard() {
  const { user } = useAppStore();

  if (user) {
    return (
      <section className="animate-fade-in h-full">
        <div className="flex flex-col gap-10 w-full p-5">
          <Cashflow />
          <div className="flex gap-10">
            <StatsPieChart />
            <Sales />
          </div>
        </div>
      </section>
    );
  } else {
    return <Navigate to={"/login"} />;
  }
}
