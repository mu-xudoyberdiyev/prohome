import { ArrowRight, CircleCheck, CircleXIcon, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoadingBar } from "react-top-loading-bar";
import EmptyData from "../components/EmptyData";
import GeneralError from "../components/error/GeneralError";
import LogoLoader from "../components/loading/LogoLoader";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useAppStore } from "../zustand";

export default function Company() {
  const { user } = useAppStore();
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);

  // Errors
  const [error, setError] = useState(null);

  // Loadings
  const [getLoading, setGetLoading] = useState(false);
  const { start, complete } = useLoadingBar({
    color: "#5ea500",
    height: 3,
  });

  // ======= CRUD =======
  // Read
  async function get() {
    start();
    let req;
    const token = localStorage.getItem("token");
    setGetLoading(true);
    try {
      req = await fetch(import.meta.env.VITE_BASE_URL + `/api/v1/company/all`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
    } catch {
      setError("Tizimda nosozlik!");
    }

    if (req) {
      if (req.status === 200) {
        const { data } = await req.json();
        setCompanies(data);
      } else {
        setError("Xatolik yuz berdi qayta urunib ko'ring!");
      }
    }

    setGetLoading(false);
    complete();
  }

  // ===== Funtions =====
  function handleAdd() {
    navigate("/add/company");
  }

  function handleClick(id) {
    navigate(`/company/${id}`);
  }

  useEffect(() => {
    get();
  }, []);

  if (getLoading) {
    return <LogoLoader />;
  }

  if (error) {
    return <GeneralError />;
  }

  return (
    <section className="animate-fade-in h-full p-5">
      <header className="bg-primary/2 mb-10 flex items-center justify-between rounded border p-3">
        <h2 className="text-2xl font-bold">Kompaniyalar</h2>

        <Button
          onClick={handleAdd}
          variant="secondary"
          disabled={getLoading}
          size="sm"
        >
          <Plus />
          Qo'shish
        </Button>
      </header>

      {companies.length > 0 ? (
        <div className="grid h-[40vh] grid-cols-2 place-content-start items-start gap-5 overflow-y-auto p-5">
          {companies.map(({ id, name, logo, status }) => {
            return (
              <div
                className="group relative flex cursor-pointer items-center gap-5 rounded-sm p-4 text-center shadow"
                onClick={() => {
                  handleClick(id);
                }}
                key={id}
              >
                <Avatar className="shadow">
                  <AvatarImage
                    src={
                      logo && `${import.meta.env.VITE_BASE_URL}/api/v1/${logo}`
                    }
                    alt={name}
                  />
                  <AvatarFallback className="uppercase">
                    {name[0]}
                  </AvatarFallback>
                </Avatar>
                <h2>{name}</h2>
                <Badge
                  className={`absolute top-0 right-5 -translate-y-2/4 ${
                    status === false ? "bg-background" : ""
                  }`}
                  variant={status ? "default" : "outline"}
                >
                  {status ? (
                    <>
                      <CircleCheck /> Faol
                    </>
                  ) : (
                    <>
                      <CircleXIcon /> To'xtagan
                    </>
                  )}
                </Badge>
                <ArrowRight className="ml-auto opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyData text="Hozircha hech qanday kompaniya mavjud emas!" />
      )}
    </section>
  );
}
