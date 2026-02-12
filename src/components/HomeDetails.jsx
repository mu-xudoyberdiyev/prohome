import {
  Box,
  Calculator,
  CircleAlert,
  CircleMinus,
  CirclePause,
  CirclePlus,
  DollarSignIcon,
  Handshake,
  Lock,
  RefreshCcw,
  Square,
  X,
} from "lucide-react";
import { Button, buttonVariants } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Badge } from "./ui/badge";
import { formatNumber } from "../lib/utils";
import { NoiseBackground } from "./ui/noise-background";

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

const actionButtons = [
  {
    code: "SOLD",
    title: "Sotish",
    bg: "bg-red-500",
  },
  {
    code: "RESERVED",
    title: "Band qilish",
    bg: "bg-yellow-500",
  },
  {
    code: "NOT",
    title: "To'xtatish",
    bg: "bg-slate-400",
  },
  {
    code: "EMPTY",
    title: "Chiqarish",
    bg: "bg-green-500",
  },
];

function b(id) {
  const data = [
    {
      room: 2,
      houseNumber: 61,
      size: 50.4,
      price: 352.8,
      status: "EMPTY",
      view: { "2d": "", "3d": "" },
    },
    {
      room: 2,
      houseNumber: 4,
      size: 50.4,
      price: 352.8,
      status: "EMPTY",
      view: { "2d": "", "3d": "" },
    },
    {
      room: 3,
      houseNumber: 71,
      size: 60.4,
      price: 422.8,
      status: "EMPTY",
      view: { "2d": "", "3d": "" },
    },
    {
      room: 3,
      houseNumber: 3,
      size: 60.4,
      price: 422.8,
      status: "EMPTY",
      view: { "2d": "", "3d": "" },
    },
    {
      room: 4,
      houseNumber: 85,
      size: 76,
      price: 532,
      status: "EMPTY",
      view: { "2d": "", "3d": "" },
    },
    {
      room: 1,
      houseNumber: 60,
      size: 35,
      price: 245,
      status: "EMPTY",
      view: { "2d": "", "3d": "" },
    },
  ];
  const randomIndex = Math.trunc(Math.random() * data.length);
  return data[randomIndex];
}

export default function HomeDetails({ activeHome, setActiveHome }) {
  const location = useLocation();
  const [pdfLoading, setPdfLoading] = useState(false);

  function handleClick() {
    setPdfLoading(true);
    fetch("http://localhost:3030/save-as-pdf")
      .then((res) => {
        return res.blob();
      })
      .then((res) => {
        const tab = window.open("", "_blank");
        const file = new Blob([res], { type: "application/pdf" });
        const url = URL.createObjectURL(file);
        tab.location.href = url;
        URL.revokeObjectURL(url);
      })
      .finally(() => {
        setPdfLoading(false);
      });
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.has("details")) {
      const id = params.get("details");
      const result = b(id);
      setActiveHome(result);
    }
  }, [location.search]);

  return (
    <div
      className={`bg-background relative transition-all duration-400 h-full overflow-y-scroll no-scrollbar ${
        activeHome ? "translate-x-0 w-112.5" : "translate-x-112.5 w-0"
      }`}
    >
      {activeHome && (
        <div className="pb-10">
          <div className="bg-background sticky top-0 border-b z-10">
            <div className="flex justify-between items-center pb-5 px-2">
              <Badge className={statuses[activeHome.status]}>
                {uzebekTranslate[activeHome.status]}
              </Badge>
              <Button
                className={"border shadow"}
                onClick={() => {
                  const url = new URL(window.location.href);
                  url.searchParams.delete("details");
                  window.history.pushState(null, "", url.href);
                  setActiveHome(null);
                }}
                variant="secondary"
                size="icon-sm"
              >
                <X />
              </Button>
            </div>

            <div className="p-2">
              <div className="flex items-center justify-between">
                <i className="font-mono">№ {activeHome.houseNumber}</i>

                <span className="bg-primary text-primary-foreground px-2 py-1 leading-none text-xs">
                  {formatNumber(activeHome.price)} UZS
                </span>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="p-2">
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
                <PhotoView src="/2d.jpg">
                  <TabsContent value="2d">
                    <img
                      className="object-cover h-52.5 w-full"
                      src="/2d.jpg"
                      alt="2d"
                    />
                  </TabsContent>
                </PhotoView>
                <PhotoView src="/3d.jpg">
                  <TabsContent value="3d">
                    <img
                      className="object-cover h-52.5 w-full"
                      src="/3d.jpg"
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

          <div className="px-2 mb-5">
            <NoiseBackground
              className={"rounded p-2"}
              gradientColors={["bg-accent"]}
              animating={false}
              noiseIntensity={0.3}
            >
              <dl className="flex flex-col gap-2 font-mono">
                <div className="flex justify-between flex-row-reverse items-center py-1 px-3 bg-background rounded shadow">
                  <dt className="text-xs">BLOK</dt>
                  <dd className="font-medium">B</dd>
                </div>
                <div className="flex justify-between flex-row-reverse items-center py-1 px-3 bg-background rounded shadow">
                  <dt className="text-xs">QAVAT</dt>
                  <dd className="font-medium">7</dd>
                </div>
                <div className="flex justify-between flex-row-reverse items-center py-1 px-3 bg-background rounded shadow">
                  <dt className="text-xs">MAYDON</dt>
                  <dd className="font-medium">
                    54 m <sup>2</sup>
                  </dd>
                </div>
                <div className="flex justify-between flex-row-reverse items-center py-1 px-3 bg-background rounded shadow">
                  <dt className="text-xs">XONA</dt>
                  <dd className="font-medium">{activeHome.room}</dd>
                </div>
              </dl>
            </NoiseBackground>
          </div>

          <div className="px-2 mb-15">
            <a
              className={`${buttonVariants({
                variant: "secondary",
              })} w-full`}
              href="#calculator"
            >
              <Calculator />
              Hisoblash
            </a>
          </div>

          {/* Actions  */}
          <div className="px-2 flex flex-col gap-2">
            {actionButtons.map(({ bg, title, code }, index) => {
              console.log(activeHome.status, code);

              return (
                code !== activeHome.status && (
                  <Button
                    className={`${bg} hover:${bg} hover:opacity-90  text-primary-foreground hover:text-primary-foreground`}
                    size="sm"
                    key={index}
                  >
                    {title}
                  </Button>
                )
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
