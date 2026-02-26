import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { buttonVariants } from "../components/ui/button";
import {
  Cuboid,
  RectangleHorizontal,
  Search,
  Square,
  XIcon,
} from "lucide-react";
import { useAppStore } from "../lib/zustand";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { useEffect, useState } from "react";
import { Badge } from "../components/ui/badge";

import CalculatorTool from "../components/CalculatorTool";
import HomeDetails from "../components/HomeDetails";
import { useLoadingBar } from "react-top-loading-bar";
import { formatNumber } from "../lib/utils";

const statuses = {
  SOLD: "bg-red-500",
  RESERVED: "bg-yellow-500",
  EMPTY: "bg-green-500",
  NOT: "bg-slate-400",
};

const uzebekTranslate = {
  SOLD: "Sotilgan",
  RESERVED: "Bron qilingan",
  EMPTY: "Bo'sh",
  NOT: "Sotilmaydi",
};

export default function TjmDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAppStore();
  const [home, setHome] = useState(null);

  // Errors

  const [notFound, setNotFound] = useState(null);
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
      req = await fetch(
        import.meta.env.VITE_BASE_URL + `/api/v1/projects/${id}/structure`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
    } catch {
      setError("Tizimda nosozlik!");
    }

    if (req) {
      if (req.status === 200) {
        const data = await req.json();

        setHome(data);
      } else if (req.status === 404 || req.status === 400) {
        setNotFound(true);
      } else {
        setError("Xatolik yuz berdi qayta urunib ko'ring!");
      }
    }

    complete();
    setGetLoading(false);
  }

  useEffect(() => {
    get();
  }, []);

  function handleActiveHome(id) {
    navigate(`?details=${id}`);
  }

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

    if (error) {
      return (
        <div className="w-full h-full flex items-center justify-center animate-fade-in">
          <div className="flex flex-col w-full max-w-sm">
            <h3 className="text-2xl mb-3 font-medium">{error}</h3>
            <p className="text-muted-foreground mb-5">
              Havotirlanmang, barchasi joyida. Ba'zida shunday xatoliklar ham
              bo'lib turadi. Agar bu davomli bo'lsa, admin bilan aloqaga chiqing
            </p>
          </div>
        </div>
      );
    }

    if (notFound) {
      return (
        <div className="w-full h-full flex items-center justify-center animate-fade-in">
          <div className="flex flex-col items-center tex-center w-full max-w-sm">
            <h3 className="text-2xl mb-3 font-medium">404</h3>
            <p className="text-muted-foreground mb-5">
              Bunday turar joy majmuosi mavjud emas!
            </p>
            <Link
              className={buttonVariants({ variant: "secondary" })}
              to={"/tjm"}
            >
              <Search /> Mavjud turar joylar
            </Link>
          </div>
        </div>
      );
    }

    return (
      home && (
        <section className="animate-fade-in max-h-screen h-full w-full flex flex-col">
          {/* Back  */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                className={`${buttonVariants({
                  size: "icon",
                  variant: "destructive",
                })} rounded-none fixed top-0 right-0 z-50`}
                to={"/tjm"}
              >
                <XIcon />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Oynani yopish</p>
            </TooltipContent>
          </Tooltip>

          {/* Parts */}
          <section className="h-full w-full">
            <div className="w-full h-30 flex flex-col">
              <div className="mt-auto p-3 flex justify-between items-center">
                <div className="flex gap-3">
                  {Object.entries(statuses).map(([key, value]) => {
                    return (
                      <Badge className={`text-primary-foreground ${value}`}>
                        {uzebekTranslate[key]}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="w-full flex overflow-hidden h-[calc(100%-120px)]">
              <div className="h-full w-full overflow-auto no-scrollbar">
                <div className="flex mx-10 min-w-max mb-10 sticky top-0 z-10 gap-20 bg-background">
                  {Object.keys(home?.blocks).map((b) => {
                    return (
                      <div className="sticky left-10 w-58 text-xs text-muted-foreground p-1 bg-background">
                        <h3>{b}</h3>
                      </div>
                    );
                  })}
                </div>
                <div className="min-w-max flex flex-col">
                  {Array.from(
                    { length: home.maxFloor },
                    (_, index) => index + 1
                  ).map((_, index, arr) => {
                    return (
                      <div className="flex w-full min-h-10 hover:bg-accent transition-colors cursor-pointer relative group">
                        {/* CHAP STICKY */}
                        <div className="text-xs text-center text-muted-foreground w-10 flex items-center justify-center sticky left-0 bg-background group-hover:bg-primary z-20">
                          <span className="group-hover:font-bold group-hover:scale-150 transition-transform group-hover:text-primary-foreground">
                            {arr.length - index}
                          </span>
                        </div>

                        {/* CONTENT */}
                        <div className="flex gap-20">
                          {Object.keys(home?.blocks).map((b) => {
                            return (
                              arr.length - index <= home?.blocks[b].floor && (
                                <div className="flex gap-2">
                                  {home?.blocks[b].appartment[index].map(
                                    (h) => {
                                      return (
                                        <Tooltip>
                                          <TooltipTrigger
                                            className="focus-within:outline-none"
                                            tabIndex="-1"
                                          >
                                            <div
                                              onClick={() => {
                                                handleActiveHome(h.id);
                                              }}
                                              className={`leading-none flex items-center justify-center min-w-8 shrink-0 min-h-8 text-white font-bold text-sm border-5 border-transparent rounded transition-colors duration-400 ${
                                                statuses[h.status]
                                              } ${
                                                h.id ==
                                                new URL(
                                                  location.href
                                                ).searchParams.get("details")
                                                  ? "border-destructive! shadow"
                                                  : ""
                                              }`}
                                            >
                                              {h.room}
                                            </div>
                                          </TooltipTrigger>
                                          <TooltipContent
                                            className={"pointer-events-none"}
                                          >
                                            <div className="flex flex-col">
                                              <div className="flex gap-1">
                                                <h4 className="font-bold">
                                                  Uy raqami:
                                                </h4>
                                                <span className="font-mono">
                                                  #{h.houseNumber}
                                                </span>
                                              </div>
                                              <div className="flex gap-1">
                                                <h4 className="font-bold">
                                                  Narxi:
                                                </h4>
                                                <span className="font-mono">
                                                  {formatNumber(
                                                    h.price * h.size
                                                  )}
                                                </span>
                                              </div>
                                              <div className="flex gap-1">
                                                <h4 className="font-bold">
                                                  m<sup>2</sup>:
                                                </h4>
                                                <span className="font-mono">
                                                  {formatNumber(h.price)}
                                                </span>
                                              </div>
                                            </div>
                                          </TooltipContent>
                                        </Tooltip>
                                      );
                                    }
                                  )}
                                </div>
                              )
                            );
                          })}
                        </div>

                        {/* O'NG STICKY */}
                        <div className="ml-auto text-xs text-center text-muted-foreground w-10 flex items-center justify-center sticky right-0 bg-background z-20 group-hover:bg-primary">
                          <span className="group-hover:font-bold group-hover:scale-150 transition-transform group-hover:text-primary-foreground">
                            {arr.length - index}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <HomeDetails />
            </div>
          </section>
        </section>
      )
    );
  } else {
    return <Navigate to={"/login"} />;
  }
}
