import { ArrowRight, Folder, FolderOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoadingBar } from "react-top-loading-bar";
import EmptyData from "../components/EmptyData";
import LogoLoader from "../components/loading/LogoLoader";

export default function Tjm() {
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
    const token = localStorage.getItem("token");
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

  if (getLoading) {
    return <LogoLoader />;
  }

  return (
    <section className="animate-fade-in h-full p-5">
      {projects.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {projects.map(({ name, id }, index) => {
            return (
              <div
                onClick={() => {
                  handleClick(`/tjm/${id}`);
                }}
                className="hover:border-primary group flex cursor-pointer gap-3 rounded border-2 p-3 transition"
                key={index}
              >
                <Folder className="animate-fade-in group-hover:hidden" />
                <FolderOpen className="animate-fade-in hidden group-hover:inline-block" />
                <p>{name}</p>
                <ArrowRight className="animate-fade-in ml-auto hidden group-hover:inline-block" />
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyData text="Hozircha TJM mavjud emas!" />
      )}
    </section>
  );
}
