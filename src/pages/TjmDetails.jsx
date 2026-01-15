import { Link, Navigate, useNavigate } from "react-router-dom";
import { buttonVariants } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAppStore } from "../lib/zustand";

export default function TjmDetails() {
  const { user } = useAppStore();
  if (user) {
    return (
      <section className="animate-fade-in max-h-screen h-full flex flex-col pt-3">
        <Link
          className={`${buttonVariants({
            size: "icon",
            variant: "outline",
          })} rounded-full! shadow bg-background fixed top-5 left-5 z-50`}
          to={"/tjm"}
        >
          <ArrowLeft />
        </Link>
      </section>
    );
  } else {
    return <Navigate to={"/login"} />;
  }
}
