import { Link, Navigate, useParams } from "react-router-dom";
import { buttonVariants } from "../components/ui/button";
import { Cuboid, RectangleHorizontal, Square, XIcon } from "lucide-react";
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

const statuses = {
  SOLD: "bg-red-500",
  RESERVED: "bg-yellow-500",
  EMPTY: "bg-green-500",
  NOT: "bg-slate-400",
};

const uzebekTranslate = {
  SOLD: "Sotilgan",
  RESERVED: "Band qilingan",
  EMPTY: "Bo'sh",
  NOT: "Sotilmaydi",
};

export default function TjmDetails() {
  const { id } = useParams();
  const { user } = useAppStore();
  const [home, setHome] = useState(null);

  const [activeTab, setActiveTab] = useState("box");
  const [activeHome, setActiveHome] = useState(null);

  // Errors
  const [error, setError] = useState(null);

  // Loadings
  const [getLoading, setGetLoading] = useState(false);

  // API
  async function get() {
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
      } else {
        setError("Xatolik yuz berdi qayta urunib ko'ring!");
      }
    }

    setGetLoading(false);
  }

  useEffect(() => {
    get();
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.has("details") === false) {
      setActiveHome(null);
    }
  }, [window.location.search]);

  function handleTab(tab) {
    setActiveTab(tab);
  }

  function handleActiveHome(home) {
    const url = new URL(window.location.href);
    url.searchParams.set("details", home.id);
    window.history.pushState(null, "", url.href);
    setActiveHome(home);
  }

  if (user) {
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

                <Tabs
                  onValueChange={handleTab}
                  defaultValue={activeTab}
                  value={activeTab}
                >
                  <TabsList>
                    <TabsTrigger value="box">
                      <Square />
                    </TabsTrigger>
                    <TabsTrigger value="card">
                      <RectangleHorizontal />
                    </TabsTrigger>
                    <TabsTrigger disabled value="visual">
                      <Cuboid />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <div className="w-full flex overflow-hidden h-[calc(100%-120px)]">
              <div className="h-full w-full overflow-auto no-scrollbar">
                <Tabs
                  defaultValue={activeTab}
                  value={activeTab}
                  onValueChange={handleTab}
                >
                  {/* Box */}
                  <TabsContent className={"animate-fade-in"} value="box">
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
                        { length: home?.maxFloor },
                        (_, index) => index + 1
                      )
                        .reverse()
                        .map((_, index, arr) => {
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
                                    arr.length - index <=
                                      home?.blocks[b].floor && (
                                      <div className="flex gap-2">
                                        {home?.blocks[b].appartment[
                                          arr.length - index - 1
                                        ]
                                          ?.reverse()
                                          .map((h) => {
                                            return (
                                              <Tooltip>
                                                <TooltipTrigger
                                                  className="focus-within:outline-none"
                                                  tabIndex="-1"
                                                >
                                                  <div
                                                    onClick={() => {
                                                      handleActiveHome(h);
                                                    }}
                                                    className={`leading-none flex items-center justify-center min-w-8 shrink-0 min-h-8 text-white font-bold text-sm border-5 border-transparent rounded transition-colors duration-400 ${
                                                      statuses[h.status]
                                                    } ${
                                                      h.id === activeHome?.id
                                                        ? "border-destructive! shadow"
                                                        : ""
                                                    }`}
                                                  >
                                                    {h.room}
                                                  </div>
                                                </TooltipTrigger>
                                                <TooltipContent
                                                  className={
                                                    "pointer-events-none"
                                                  }
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
                                                      {h.price} mln so'm
                                                    </div>
                                                  </div>
                                                </TooltipContent>
                                              </Tooltip>
                                            );
                                          })}
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
                  </TabsContent>

                  {/* Card  */}
                  <TabsContent className={"animate-fade-in"} value="card">
                    <div className="flex min-w-max mb-10 mx-10 sticky bg-background top-0 z-20 gap-20">
                      {Object.keys(home?.blocks).map((b) => {
                        return (
                          <div className="sticky left-10 w-310 bg-background text-xs text-muted-foreground p-1">
                            <h3>{b}</h3>
                          </div>
                        );
                      })}
                    </div>
                    <div className="min-w-max flex flex-col pb-2 gap-2">
                      {Array.from(
                        { length: home?.maxFloor },
                        (_, index) => index + 1
                      )
                        .reverse()
                        .map((_, index, arr) => {
                          return (
                            <div className="flex min-h-25 hover:bg-accent transition-colors cursor-pointer relative group">
                              {/* CHAP STICKY */}
                              <div className="text-xs text-center text-muted-foreground w-10 flex items-center justify-center sticky left-0 bg-background z-20 group-hover:bg-primary">
                                <span className="group-hover:font-bold group-hover:scale-150 transition-transform group-hover:text-primary-foreground">
                                  {arr.length - index}
                                </span>
                              </div>

                              {/* CONTENT */}
                              <div className="flex gap-20">
                                {Object.keys(home?.blocks).map((b) => {
                                  return (
                                    arr.length - index <=
                                      home?.blocks[b].floor && (
                                      <div className="flex gap-2 relative">
                                        {home?.blocks[b].appartment[
                                          arr.length - index - 1
                                        ]
                                          ?.reverse()
                                          .map((h) => {
                                            return (
                                              <div
                                                onClick={() => {
                                                  handleActiveHome(h);
                                                }}
                                                className={`flex flex-col justify-between p-2 w-50 h-full text-white text-sm border-8 border-transparent rounded ${
                                                  statuses[h.status]
                                                } ${
                                                  h.id === activeHome?.id
                                                    ? "border-destructive! shadow"
                                                    : ""
                                                }`}
                                              >
                                                <div className="flex justify-between">
                                                  <span>{h.room} xona</span>
                                                  <span className="font-mono">
                                                    #{h.houseNumber}
                                                  </span>
                                                </div>
                                                <p className="font-medium">
                                                  {h.price} mln so'm
                                                </p>
                                                <div className="flex justify-between">
                                                  <p className="text-xs">
                                                    {h.size}m <sup>2</sup>
                                                  </p>
                                                  -
                                                  <p className="text-xs">
                                                    7 mln / m<sup>2</sup>
                                                  </p>
                                                </div>
                                              </div>
                                            );
                                          })}
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
                  </TabsContent>
                </Tabs>
              </div>
              <HomeDetails
                activeHome={activeHome}
                setActiveHome={setActiveHome}
              />
            </div>
          </section>

          <CalculatorTool />
        </section>
      )
    );
  } else {
    return <Navigate to={"/login"} />;
  }
}
