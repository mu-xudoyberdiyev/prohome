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
      <section className="animate-fade-in max-h-screen h-full flex flex-col">
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
          <div className="w-full h-[85%] overflow-auto no-scrollbar">
            <Tabs
              className={"min-w-max"}
              value={activeTab}
              defaultValue={activeTab}
            >
              <TabsContent className={"animate-fade-in"} value="box">
                <div className="flex mx-10 w-full mb-10 sticky top-1 z-20 gap-20">
                  {Object.keys(readyData.blocks).map((b) => {
                    return (
                      <div className="sticky left-10 w-65 bg-accent text-xs text-muted-foreground p-1 text-center rounded border">
                        <h3 className="font-bold">{b}</h3>
                      </div>
                    );
                  })}
                </div>
                <div className="w-full flex flex-col pb-2 gap-1">
                  {Array.from(
                    { length: readyData.maxFloor },
                    (_, index) => index + 1
                  )
                    .reverse()
                    .map((_, index, arr) => {
                      return (
                        <div className="flex min-h-10 hover:bg-accent transition-colors cursor-pointer relative group">
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
                                            className={`leading-none flex items-center justify-center w-10 h-full text-white font-bold text-sm rounded ${
                                              arr.length === index + 1
                                                ? "bg-slate-400"
                                                : statuses[h.status]
                                            }`}
                                          >
                                            {h.room}
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
              <TabsContent className={"animate-fade-in"} value="card">
                <div className="flex mx-10 w-full mb-10 sticky top-1 z-20 gap-20">
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
                                            className={`leading-none flex items-center justify-center w-50 h-full text-white font-bold text-sm rounded ${
                                              arr.length === index + 1
                                                ? "bg-slate-400"
                                                : statuses[h.status]
                                            }`}
                                          >
                                            {h.room} xona
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
