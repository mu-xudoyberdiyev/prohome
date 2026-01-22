import { Link, Navigate } from "react-router-dom";
import { Button, buttonVariants } from "../components/ui/button";
import {
  Box,
  CircleMinus,
  CirclePlus,
  Cuboid,
  Plus,
  RectangleHorizontal,
  Square,
  X,
  XIcon,
  ZoomIn,
  ZoomOut,
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
import { PhotoProvider, PhotoSlider, PhotoView } from "react-photo-view";

const statuses = {
  sold: "bg-red-500",
  reserved: "bg-yellow-500",
  empty: "bg-green-500",
  not: "bg-slate-400",
};

const uzebekTranslate = {
  sold: "Sotilgan",
  reserved: "Band qilingan",
  empty: "Bo'sh",
  not: "Sotilmaydi",
};

export default function TjmDetails() {
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
      req = await fetch(`http://localhost:3000/data`, {
        // headers: {
        //   Authorization: "Bearer " + token,
        // },
      });
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

  function handleTab(tab) {
    setActiveTab(tab);
  }

  function handleActiveHome(home) {
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

              {/* Detals  */}
              <div
                className={`bg-background relative transition-all duration-400 h-full overflow-y-scroll no-scrollbar ${
                  activeHome ? "translate-x-0 w-112.5" : "translate-x-112.5 w-0"
                }`}
              >
                <div className="bg-background sticky top-0 border-b">
                  {activeHome && (
                    <div className="flex justify-end mb-5">
                      <Button
                        onClick={() => {
                          handleActiveHome(null);
                        }}
                        className={"rounded-none"}
                        variant="destructive"
                        size="icon-sm"
                      >
                        <X />
                      </Button>
                    </div>
                  )}

                  {activeHome && (
                    <div className="p-2">
                      <div className="flex items-center justify-between">
                        <i className="font-mono">№ {activeHome.houseNumber}</i>

                        <Badge className={statuses[activeHome.status]}>
                          {uzebekTranslate[activeHome.status]}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>

                {/* Images */}
                {activeHome && (
                  <div className="p-3 mb-10">
                    <Tabs defaultValue="2d">
                      <PhotoProvider
                        toolbarRender={({ onScale, scale }) => {
                          return (
                            <div className="flex mr-5">
                              <div className="w-11 h-11 p-2.5 group">
                                <CircleMinus
                                  className="opacity-70 group-hover:opacity-100 cursor-pointer transition-opacity"
                                  onClick={() => {
                                    onScale(scale - 1);
                                  }}
                                />
                              </div>
                              <div className="w-11 h-11 p-2.5 group">
                                <CirclePlus
                                  className="opacity-70 group-hover:opacity-100 cursor-pointer transition-opacity"
                                  onClick={() => {
                                    onScale(scale + 1);
                                  }}
                                />
                              </div>
                            </div>
                          );
                        }}
                      >
                        <PhotoView src="/public/2d.jpg">
                          <TabsContent value="2d">
                            <img
                              className="object-cover h-52.5 w-full"
                              src="/public/2d.jpg"
                              alt="2d"
                            />
                          </TabsContent>
                        </PhotoView>
                        <PhotoView src="/public/3d.jpg">
                          <TabsContent value="3d">
                            <img
                              className="object-cover h-52.5 w-full"
                              src="/public/3d.jpg"
                              alt="3d"
                            />
                          </TabsContent>
                        </PhotoView>
                      </PhotoProvider>

                      <TabsList className={"w-full"}>
                        <TabsTrigger className={"w-2/4"} value="2d">
                          <Square />
                          2D
                        </TabsTrigger>
                        <TabsTrigger className={"w-2/4"} value="3d">
                          <Box />
                          3D
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                )}

                {activeHome && (
                  <div className="flex items-start justify-between text-lg mb-10">
                    <span className="text-muted-foreground">Narx</span>
                    <div className="">
                      <span className="bg-primary text-primary-foreground px-2 py-1 leading-none">
                        {activeHome.price} mln
                      </span>
                    </div>
                  </div>
                )}

                {activeHome && (
                  <dl className="flex flex-col">
                    <div className="flex justify-between items-center px-2 bg-accent">
                      <dt>Joylashuv</dt>
                      <dd>B</dd>
                    </div>
                    <div className="flex justify-between items-center px-2">
                      <dt>Qavat</dt>
                      <dd>7</dd>
                    </div>
                    <div className="flex justify-between items-center px-2 bg-accent">
                      <dt>Maydon</dt>
                      <dd>
                        54 m <sup>2</sup>
                      </dd>
                    </div>
                    <div className="flex justify-between items-center px-2">
                      <dt>Xona</dt>
                      <dd>{activeHome.room}</dd>
                    </div>
                  </dl>
                )}
              </div>
            </div>
          </section>
        </section>
      )
    );
  } else {
    return <Navigate to={"/login"} />;
  }
}
