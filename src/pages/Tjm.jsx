import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button, buttonVariants } from "../components/ui/button";
import { ArrowLeft, ArrowRight, Folder, FolderOpen, Plus } from "lucide-react";
import { useAppStore } from "../lib/zustand";
import { useEffect, useState } from "react";
import { useLoadingBar } from "react-top-loading-bar";

export default function Tjm() {
  const { user } = useAppStore();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  // Loadings
  const [getLoading, setGetLoading] = useState(false);
  const { start, complete } = useLoadingBar({
    color: "#5ea500",
    height: 3,
  });

  // API
  async function get() {
    start();
    let req;
    const token = JSON.parse(localStorage.getItem("user")).accessToken;
    setGetLoading(true);
    try {
      req = await fetch(import.meta.env.VITE_BASE_URL + `/api/v1/projects`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
    } catch {
      setError("Tizimda nosozlik!");
    }

    if (req) {
      if (req.status === 200) {
        const data = await req.json();
        console.log(data);

        setProjects(data);
      } else {
        setError("Xatolik yuz berdi qayta urunib ko'ring!");
      }
    }

    setGetLoading(false);
    complete();
  }

  function handleClick(slug) {
    navigate(slug);
  }

  useEffect(() => {
    get();
  }, []);

  if (user) {
    if (getLoading) {
      return (
        <div className="w-full h-full flex items-center justify-center fixed bg-background z-50">
          <div className="flex gap-4 items-center animate-pulse">
            <img
              className="w-20 h-20 rounded shadow"
              src="/logo.png"
              aria-hidden={true}
            />
            <p className="text-xl">prohome.uz</p>
          </div>
        </div>
      );
    }

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

        {projects.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {projects.map(({ name, id }, index) => {
              return (
                <div
                  onClick={() => {
                    handleClick(`/tjm/${id}`);
                  }}
                  className="border-2 flex gap-3 transition rounded p-3 hover:border-primary cursor-pointer group"
                  key={index}
                >
                  <Folder className="group-hover:hidden animate-fade-in" />
                  <FolderOpen className="hidden group-hover:inline-block animate-fade-in" />
                  <p>{name}</p>
                  <ArrowRight className="ml-auto hidden group-hover:inline-block animate-fade-in" />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="w-full h-full flex justify-center items-center animate-fade-in">
            <div className="flex flex-col items-center text-center w-full max-w-sm">
              <img
                className="w-50 object-center select-none mb-5"
                src="/no-data.svg"
                alt=""
              />
              <p className="mb-5">Hozircha ma'lumot yo'q</p>
            </div>
          </div>
        )}
      </section>
    );
  } else {
    return <Navigate to={"/login"} />;
  }
}
