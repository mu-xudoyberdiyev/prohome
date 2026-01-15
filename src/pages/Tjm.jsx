import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button, buttonVariants } from "../components/ui/button";
import { ArrowLeft, ArrowRight, Folder, FolderOpen } from "lucide-react";
import { useAppStore } from "../lib/zustand";

const mockData = [{ title: "Nurli Maskan TJM" }];

export default function Tjm() {
  const { user } = useAppStore();
  const navigate = useNavigate();

  function handleClick(slug) {
    navigate(slug);
  }

  if (user) {
    return (
      <section className="animate-fade-in h-full p-15">
        <Link
          className={`${buttonVariants({
            size: "icon",
            variant: "outline",
          })} rounded-full! shadow bg-background fixed top-5 left-5`}
          to={"/"}
        >
          <ArrowLeft />
        </Link>

        <div className="grid grid-cols-3 gap-3">
          {mockData.map(({ title }, index) => {
            return (
              <div
                onClick={() => {
                  handleClick(
                    `/tjm/${title.replaceAll(" ", "-").toLowerCase()}`
                  );
                }}
                className="border-2 flex gap-3 transition rounded p-3 hover:border-primary cursor-pointer group"
                key={index}
              >
                <Folder className="group-hover:hidden animate-fade-in" />
                <FolderOpen className="hidden group-hover:inline-block animate-fade-in" />
                <p>{title}</p>
                <ArrowRight className="ml-auto hidden group-hover:inline-block animate-fade-in" />
              </div>
            );
          })}
        </div>
      </section>
    );
  } else {
    return <Navigate to={"/login"} />;
  }
}
