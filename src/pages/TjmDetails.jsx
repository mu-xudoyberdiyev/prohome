import { Link, Navigate, useNavigate } from "react-router-dom";
import { buttonVariants } from "../components/ui/button";
import {
  ArrowLeft,
  Box,
  BoxIcon,
  CreditCard,
  CreditCardIcon,
  RectangleHorizontal,
  Square,
  XIcon,
} from "lucide-react";
import { useAppStore } from "../lib/zustand";
import readyData from "../../db";
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
import { useState } from "react";

export default function TjmDetails() {
  const { user } = useAppStore();
  const [activeTab, setActiveTab] = useState("box");

  const statuses = {
    sold: "bg-red-500",
    reserved: "bg-lime-400",
    empty: "bg-green-500",
    not: "bg-slate-400",
  };

  const uzebekTranslate = {
    sold: "Sotilgan",
    reserved: "Band qilingan",
    empty: "Bo'sh",
    not: "Sotilmaydi",
  };

  function handleTab(tab) {
    setActiveTab(tab);
  }

  if (user) {
    return (
      <section className="animate-fade-in max-h-screen h-full w-full flex flex-col">
        {/* Back  */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              className={`${buttonVariants({
                size: "icon",
                variant: "outline",
              })} bg-background rounded-none fixed top-1 right-1 z-50`}
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
          <div className="w-full h-[15%] flex flex-col">
            <div className="mt-auto p-2 flex justify-between items-center">
              <Tabs
                onValueChange={handleTab}
                defaultValue={activeTab}
                value={activeTab}
              >
                <TabsList>
                  <TabsTrigger value="box">
                    <Square /> Katak
                  </TabsTrigger>
                  <TabsTrigger value="card">
                    <RectangleHorizontal /> Kartochka
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex gap-3">
                {Object.keys(statuses).map((el) => {
                  return (
                    <div className="flex items-center text-xs gap-1">
                      <span
                        className={`inline-block w-3 h-3 shadow ${statuses[el]}`}
                      ></span>
                      {uzebekTranslate[el]}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="w-full overflow-auto h-[85%] no-scrollbar">
            <Tabs
              defaultValue={activeTab}
              value={activeTab}
              onValueChange={handleTab}
            >
              {/* Box */}
              <TabsContent className={"animate-fade-in"} value="box">
                <div className="flex mx-10 min-w-max mb-10 sticky top-1 z-20 gap-20">
                  {Object.keys(readyData.blocks).map((b) => {
                    return (
                      <div className="sticky left-10 w-65 bg-accent text-xs text-muted-foreground p-1 text-center rounded border">
                        <h3 className="font-bold">{b}</h3>
                      </div>
                    );
                  })}
                </div>
                <div className="min-w-max flex flex-col pb-2 gap-1">
                  {Array.from(
                    { length: readyData.maxFloor },
                    (_, index) => index + 1
                  )
                    .reverse()
                    .map((_, index, arr) => {
                      return (
                        <div className="flex w-full min-h-10 hover:bg-accent transition-colors cursor-pointer relative group">
                          {/* CHAP STICKY */}
                          <div className="text-xs text-center text-muted-foreground w-10 flex items-center justify-center sticky left-0 bg-background z-10">
                            <span className="group-hover:font-bold group-hover:scale-150 transition-transform">
                              {arr.length - index}
                            </span>
                          </div>

                          {/* CONTENT */}
                          <div className="flex gap-20">
                            {Object.keys(readyData.blocks).map((b) => {
                              return (
                                arr.length - index <=
                                  readyData.blocks[b].floor && (
                                  <div className="flex gap-1 relative">
                                    {readyData.blocks[b].appartment[
                                      arr.length - index - 1
                                    ]
                                      ?.reverse()
                                      .map((h) => {
                                        return (
                                          <Tooltip>
                                            <TooltipTrigger>
                                              <div
                                                className={`leading-none flex items-center justify-center w-10 h-full text-white font-bold text-sm rounded ${
                                                  arr.length === index + 1
                                                    ? "bg-slate-400"
                                                    : statuses[h.status]
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
                          <div className="ml-auto text-xs text-center text-muted-foreground w-10 flex items-center justify-center sticky right-0 bg-background z-10">
                            <span className="group-hover:font-bold group-hover:scale-150 transition-transform">
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
                <div className="flex mx-10 min-w-max mb-10 sticky top-1 z-20 gap-20">
                  {Object.keys(readyData.blocks).map((b) => {
                    return (
                      <div className="sticky left-10 w-305 bg-accent text-xs text-muted-foreground px-2 py-1 rounded border">
                        <h3 className="font-bold">{b}</h3>
                      </div>
                    );
                  })}
                </div>
                <div className="min-w-max flex flex-col pb-2 gap-1">
                  {Array.from(
                    { length: readyData.maxFloor },
                    (_, index) => index + 1
                  )
                    .reverse()
                    .map((_, index, arr) => {
                      return (
                        <div className="flex min-h-25 hover:bg-accent transition-colors cursor-pointer relative group">
                          {/* CHAP STICKY */}
                          <div className="text-xs text-center text-muted-foreground w-10 flex items-center justify-center sticky left-0 bg-background z-10">
                            <span className="group-hover:font-bold group-hover:scale-150 transition-transform">
                              {arr.length - index}
                            </span>
                          </div>

                          {/* CONTENT */}
                          <div className="flex gap-20">
                            {Object.keys(readyData.blocks).map((b) => {
                              return (
                                arr.length - index <=
                                  readyData.blocks[b].floor && (
                                  <div className="flex gap-1 relative">
                                    {readyData.blocks[b].appartment[
                                      arr.length - index - 1
                                    ]
                                      ?.reverse()
                                      .map((h) => {
                                        return (
                                          <div
                                            className={`flex flex-col justify-between p-2 w-50 h-full text-white text-sm rounded ${
                                              arr.length === index + 1
                                                ? "bg-slate-400"
                                                : statuses[h.status]
                                            }`}
                                          >
                                            <div className="flex justify-between">
                                              <span>{h.room} xonalik</span>
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
                          <div className="ml-auto text-xs text-center text-muted-foreground w-10 flex items-center justify-center sticky right-0 bg-background z-10">
                            <span className="group-hover:font-bold group-hover:scale-150 transition-transform">
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
        </section>
      </section>
    );
  } else {
    return <Navigate to={"/login"} />;
  }
}
