import { Navigate, useNavigate } from "react-router-dom";
import { useAppStore } from "../lib/zustand";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  ArrowRight,
  CircleCheck,
  CircleXIcon,
  PlusCircleIcon,
  SearchAlert,
} from "lucide-react";
import { Badge } from "../components/ui/badge";

export default function Company() {
  const { user } = useAppStore();
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);

  // Errors
  const [error, setError] = useState(null);

  // Loadings
  const [getLoading, setGetLoading] = useState(false);

  // ======= CRUD =======
  // Read
  async function get() {
    let req;
    const token = JSON.parse(localStorage.getItem("user")).accessToken;
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
  }

  // ===== Funtions =====
  function handleError() {
    setError(null);
  }

  function handleAdd() {
    navigate("/add/company");
  }

  function handleClick(id) {
    navigate(`/company/${id}`);
  }

  useEffect(() => {
    get();
  }, [error]);

  if (user) {
    if (getLoading) {
      return (
        <div className="w-full h-full flex items-center justify-center">
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

    if (error) {
      return (
        <div className="w-full h-full flex items-center justify-center animate-fade-in">
          <div className="flex flex-col w-full max-w-sm">
            <h3 className="text-2xl mb-3 font-medium">{error}</h3>
            <p className="text-muted-foreground mb-5">
              Havotirlanmang, barchasi joyida. Ba'zida shunday xatoliklar ham
              bo'lib turadi. Agar bu davomli bo'lsa, admin bilan aloqaga chiqing
            </p>
            <Button onClick={handleError} variant="secondary">
              <SearchAlert /> Qayta urunib ko'rish
            </Button>
          </div>
        </div>
      );
    }

    return companies.length > 0 ? (
      <section className="h-full animate-fade-in">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-bold text-3xl">Kompaniyalar</h2>
          <Button onClick={handleAdd} variant="secondary">
            <PlusCircleIcon />
            Qo'shish
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-5 h-[60vh] items-start place-content-start">
          {companies.map(({ id, name, logo, status }) => {
            return (
              <div
                className="shadow relative rounded-sm p-4 flex gap-5 items-center text-center group cursor-pointer"
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
                <ArrowRight className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            );
          })}
        </div>
      </section>
    ) : (
      <div className="w-full h-full flex justify-center items-center animate-fade-in">
        <div className="flex flex-col items-center text-center w-full max-w-sm">
          <h3 className="text-2xl mb-3 font-medium">
            Hali kompaniya mavjud emas!
          </h3>
          <p className="text-muted-foreground mb-5">
            Kompaniya yaratishni istasangiz "Istayman" tugmasini bosing.
          </p>
          <Button onClick={handleAdd} variant="secondary">
            Istayman
          </Button>
        </div>
      </div>
    );
  } else {
    return <Navigate to={"/login"} />;
  }
}
