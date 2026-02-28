import {
  Box,
  Calculator,
  Check,
  CircleAlert,
  CircleMinus,
  CirclePause,
  CirclePlus,
  Copy,
  DollarSignIcon,
  Handshake,
  Info,
  Lock,
  MessageSquareWarning,
  RefreshCcw,
  Square,
  User,
  X,
} from "lucide-react";
import { Button, buttonVariants } from "../components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Badge } from "./ui/badge";
import { formatNumber } from "../lib/utils";
import { NoiseBackground } from "./ui/noise-background";
import { useLoadingBar } from "react-top-loading-bar";
import { Spinner } from "./ui/spinner";
import CalculatorTool from "./CalculatorTool";
import { useClipboard } from "../hooks/use-clipboard";

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

export default function HomeDetails() {
  const l = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { copied, copy } = useClipboard({
    copiedDuring: 1000,
  });

  const [home, setHome] = useState(null);

  // Errors
  const [error, setError] = useState(false);

  // Loadings
  const [pdfLoading, setPdfLoading] = useState(false);
  const [getLoading, setGetLoading] = useState(false);
  const { start, complete } = useLoadingBar({
    color: "#5ea500",
    height: 3,
  });

  console.log(home);

  async function get(id) {
    start();
    let req;
    const token = JSON.parse(localStorage.getItem("user")).accessToken;
    setGetLoading(true);
    try {
      req = await fetch(
        import.meta.env.VITE_BASE_URL + `/api/v1/room/by/${id}`,
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
        console.log(data);

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
    const url = new URLSearchParams(l.search);

    if (url.has("details")) {
      const id = url.get("details");
      get(id);
    } else {
      setHome(null);
    }
  }, [l.search]);

  function handleCopyPhoneNumber(phone) {
    copy(phone);
  }

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

  return (
    <>
      <div
        className={`bg-background relative transition-all duration-400 h-full overflow-y-scroll no-scrollbar ${
          home ? "translate-x-0 w-112.5" : "translate-x-112.5 w-0"
        } ${getLoading ? "opacity-50 pointer-events-none" : ""}`}
      >
        {getLoading && (
          <div className="inset-0 absolute z-10 flex items-center justify-center">
            <Spinner />
          </div>
        )}
        {home && (
          <div className="pb-10">
            <div className="bg-background sticky top-0 border-b z-10">
              <div className="flex justify-between items-center pb-5 px-2">
                <Badge className={statuses[home.status]}>
                  {uzebekTranslate[home.status]}
                </Badge>

                <Button
                  className={"border shadow"}
                  onClick={() => {
                    navigate(`/tjm/${id}`);
                    setHome(null);
                  }}
                  variant="secondary"
                  size="icon-sm"
                >
                  <X />
                </Button>
              </div>

              <div className="p-2">
                {home.customer && (
                  <div className="mb-5 animate-fade-in">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          className={"w-full"}
                          variant="secondary"
                          size="sm"
                        >
                          <Info />
                          Info
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="start">
                        <NoiseBackground
                          className={"rounded p-2"}
                          gradientColors={["bg-accent"]}
                          animating={false}
                          noiseIntensity={0.3}
                        >
                          <dl className="flex flex-col gap-2 font-mono text-xs">
                            <div className="flex justify-between flex-row-reverse items-center py-1 px-3 bg-background rounded shadow">
                              <dt>ISM</dt>
                              <dd className="font-medium">
                                {home.customer.firstName}
                              </dd>
                            </div>
                            <div className="flex justify-between flex-row-reverse items-center py-1 px-3 bg-background rounded shadow">
                              <dt>FAMILIYA</dt>
                              <dd className="font-medium">
                                {home.customer.lastName}
                              </dd>
                            </div>
                            <div className="flex justify-between flex-row-reverse items-center py-1 px-3 bg-background rounded shadow">
                              <dt>TEL</dt>
                              <dd className="font-medium relative flex items-center gap-1 select-none">
                                {home.customer.phone}
                                <Button
                                  onClick={() => {
                                    handleCopyPhoneNumber(home.customer.phone);
                                  }}
                                  size="sm"
                                  variant="ghost"
                                >
                                  {copied ? (
                                    <Check className="size-3" />
                                  ) : (
                                    <Copy className="size-3" />
                                  )}
                                </Button>
                              </dd>
                            </div>
                          </dl>
                        </NoiseBackground>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <i className="font-mono">№ {home.houseNumber}</i>

                  <span className="bg-primary text-primary-foreground px-2 py-1 leading-none text-xs">
                    {formatNumber(home.price * home.size)} UZS
                  </span>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="p-2 mb-5">
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
                <PhotoView src={`/gallery/jpg/${home.image}.jpg`}>
                  <picture>
                    <source
                      srcset={`/gallery/avif/${home.image}.avif`}
                      type="image/avif"
                    />
                    <img
                      className="w-full h-45 shadow"
                      src={`/gallery/jpg/${home.image}.jpg`}
                      alt={home.size}
                    />
                  </picture>
                </PhotoView>
              </PhotoProvider>
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
                    <dd className="font-medium">{home.block}</dd>
                  </div>
                  <div className="flex justify-between flex-row-reverse items-center py-1 px-3 bg-background rounded shadow">
                    <dt className="text-xs">QAVAT</dt>
                    <dd className="font-medium">{home.floorNumber}</dd>
                  </div>
                  <div className="flex justify-between flex-row-reverse items-center py-1 px-3 bg-background rounded shadow">
                    <dt className="text-xs">MAYDON</dt>
                    <dd className="font-medium">
                      {home.size} m <sup>2</sup>
                    </dd>
                  </div>
                  <div className="flex justify-between flex-row-reverse items-center py-1 px-3 bg-background rounded shadow">
                    <dt className="text-xs">XONA</dt>
                    <dd className="font-medium">{home.room}</dd>
                  </div>
                  <div className="flex justify-between flex-row-reverse items-center py-1 px-3 bg-background rounded shadow">
                    <dt className="text-xs">
                      M<sup>2</sup>
                    </dt>
                    <dd className="font-medium">{formatNumber(home.price)}</dd>
                  </div>
                </dl>
              </NoiseBackground>
            </div>

            <div className="px-2 mb-5">
              {home.status === "NOT" && (
                <Alert className="border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-900 mb-10 relative">
                  <MessageSquareWarning className="text-slate-600 dark:text-slate-400" />
                  <AlertTitle className="text-slate-900 dark:text-slate-100">
                    Ushbu uy sotilmaydi
                  </AlertTitle>
                  <AlertDescription className="text-slate-700 dark:text-slate-300 mb-3 text-xs">
                    {home.description
                      ? home.description
                      : "Ushbu uy NTJ yoki boshqa sababga ko'ra sotilmaydi"}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="px-2">
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
          </div>
        )}
      </div>
      {home && <CalculatorTool home={home} />}
    </>
  );
}
