import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { Button, buttonVariants } from "../components/ui/button";
import { SparklesText } from "@/components/ui/sparkles-text";
import {
  BadgePercent,
  Bolt,
  Box,
  Calculator,
  Calendar1,
  CalendarDays,
  CircleDollarSign,
  CircleMinus,
  CirclePlus,
  Cuboid,
  HandCoins,
  RectangleHorizontal,
  RefreshCcw,
  Square,
  X,
  XIcon,
} from "lucide-react";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppStore } from "../lib/zustand";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
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
import { PhotoProvider, PhotoView } from "react-photo-view";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "../components/ui/input-group";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "../components/ui/native-select";
import { Switch } from "../components/ui/switch";
import {
  formatNumber,
  formatNumberWithPercent,
  getFormData,
} from "../lib/utils";
import { Spinner } from "../components/ui/spinner";
import HomeGallery from "../components/HomeGallery";

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

const states = {
  BOX: "Karobka",
  READY: "Ta'mirlangan",
};

const paymentPeriods = [12, 24, 36, 48, 60];

export default function TjmDetails() {
  const { id } = useParams();
  const { user } = useAppStore();
  const [home, setHome] = useState(null);
  const [calcResult, setCalcResult] = useState({
    monthlyPayment: 0,
    downPayment: 0,
    months: 60,
  });
  const [activeTab, setActiveTab] = useState("box");
  const [activeHome, setActiveHome] = useState(null);
  const [showDiscount, setShowDiscount] = useState(false);
  const [discountType, setDiscountType] = useState("discountPerM2");
  const [period, setPeriod] = useState(60);
  const [downPayment, setDownPayment] = useState(0);
  const [discount, setDiscount] = useState("");

  // Errors
  const [error, setError] = useState(null);

  // Loadings
  const [getLoading, setGetLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [calcLoading, setCalcLoading] = useState(false);

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

  async function calc(url) {
    let req;
    const token = JSON.parse(localStorage.getItem("user")).accessToken;
    setCalcLoading(true);
    try {
      req = await fetch(url, {
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
        console.log(data);

        setCalcResult(data);
      } else {
        setError("Xatolik yuz berdi qayta urunib ko'ring!");
      }
    }

    setCalcLoading(false);
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

  function handleClose() {
    setCalcResult({
      monthlyPayment: 0,
      downPayment: 0,
      months: 60,
    });

    setDownPayment(0);
    setPeriod(60);
    setDiscount("");
    setShowDiscount(false);
  }

  function handleChangeDiscount() {
    setShowDiscount(!showDiscount);
  }

  function handleChangeDiscountType(value) {
    setDiscountType(value);
  }

  function handleCalc(evt) {
    evt.preventDefault();
    const url = new URL(
      import.meta.env.VITE_BASE_URL + `/api/v1/room/${43}/calculate`
    );
    const formData = getFormData(evt.currentTarget);

    Object.entries(formData).forEach(([key, value]) => {
      url.searchParams.append(key, value.replaceAll(" ", ""));
    });

    setCalcResult({
      monthlyPayment: 0,
      downPayment: 0,
      months: 60,
    });

    console.log(url.href);

    calc(url.href);
  }

  function handlePeriod(p) {
    setPeriod(p);
  }

  function handleDownPayment(evt) {
    let input = evt.target.value;
    let rawValue = input.replace(/\D/g, "");
    let formattedValue = formatNumber(rawValue);
    setDownPayment(formattedValue);
  }

  function handleDiscount(evt) {
    const value = formatNumberWithPercent(evt.target.value);
    setDiscount(value);
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

              {/* Details  */}
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
                  <dl className="flex flex-col mb-10">
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

                {activeHome && (
                  <Drawer direction={"top"}>
                    <DrawerTrigger
                      className={`${buttonVariants({
                        variant: "secondary",
                      })} w-full mb-4`}
                    >
                      <Calculator />
                      To'lov kalkulyatori
                    </DrawerTrigger>
                    <DrawerContent className="h-full min-h-screen">
                      {/* Close  */}
                      <DrawerClose
                        onClick={handleClose}
                        className={`${buttonVariants({
                          variant: "destructive",
                          size: "icon-sm",
                        })} rounded-none absolute top-0 right-0`}
                      >
                        <X />
                      </DrawerClose>

                      <div className="py-15 px-10 h-full flex gap-10">
                        <div
                          className={`w-[65%] h-full overflow-y-auto no-scrollbar relative transition-opacity ${
                            calcLoading ? "opacity-50" : ""
                          }`}
                        >
                          {calcLoading && (
                            <div className="inset-0 absolute z-10 flex items-center justify-center">
                              <Spinner />
                            </div>
                          )}
                          {calcResult && (
                            <div className="animate-fade-in">
                              <div className="border px-3 py-6 rounded animate-fade-in w-full sticky top-2 bg-background mb-8">
                                <h3 className="absolute left-5 top-0 -translate-y-2/4 bg-background text-muted-foreground px-2 flex gap-2 rounded">
                                  Oyiga
                                </h3>
                                <SparklesText className={"text-5xl font-mono"}>
                                  {formatNumber(calcResult.monthlyPayment)} so'm
                                </SparklesText>
                              </div>

                              <div className="grid grid-cols-[6fr_2fr_3fr] gap-2 mb-2">
                                <div className="border p-2 w-full rounded bg-primary/2">
                                  <div className="flex items-center gap-1 mb-2">
                                    <CircleDollarSign />
                                    <span className="text-muted-foreground text-xs">
                                      Umumiy narx
                                    </span>
                                  </div>
                                  <h4 className="text-lg font-mono font-medium">
                                    {calcResult?.totalPrice
                                      ? formatNumber(calcResult.totalPrice)
                                      : "---"}{" "}
                                  </h4>
                                </div>
                                <div className="border p-2 w-full rounded bg-primary/2">
                                  <div className="flex items-center gap-1 mb-2">
                                    <CalendarDays />
                                    <span className="text-muted-foreground text-xs">
                                      Muddat
                                    </span>
                                  </div>
                                  <h4 className="text-lg font-mono font-medium">
                                    {calcResult.months} oy
                                  </h4>
                                </div>
                                {states[calcResult.state] && (
                                  <div className="border p-2 w-full rounded bg-primary/2">
                                    <div className="flex items-center gap-1 mb-2">
                                      <Bolt />
                                      <span className="text-muted-foreground text-xs">
                                        Holati
                                      </span>
                                    </div>
                                    <h4 className="text-lg font-mono font-medium">
                                      {states[calcResult.state]}
                                    </h4>
                                  </div>
                                )}
                              </div>

                              <div className="border p-2 w-full rounded bg-primary/2">
                                <div className="flex items-center gap-1 mb-2">
                                  <HandCoins />
                                  <span className="text-muted-foreground text-xs">
                                    Boshlang'ich to'lov
                                  </span>
                                </div>
                                <h4 className="text-lg font-mono font-medium">
                                  {formatNumber(calcResult.downPayment)}
                                </h4>
                              </div>
                            </div>
                          )}

                          <HomeGallery />
                        </div>

                        <form
                          onSubmit={handleCalc}
                          className="w-[35%] mx-auto flex flex-col gap-5"
                        >
                          <div className="flex items-center space-x-2 mb-3">
                            <Switch
                              onCheckedChange={handleChangeDiscount}
                              defaultChecked={showDiscount}
                              id="discount"
                            />
                            <Label htmlFor="discount">
                              Chegirma beramiz-mi?
                            </Label>
                          </div>

                          {showDiscount && (
                            <div className="border border-primary relative px-3 py-6 rounded animate-fade-in">
                              <h3 className="absolute left-5 top-0 -translate-y-2/4  font-bold px-2 text-white flex gap-2 bg-primary p-0.5 rounded">
                                <BadgePercent /> Chegirma
                              </h3>
                              <div className="flex w-full gap-5">
                                <Input
                                  placeholder="100 yoki 5%"
                                  onChange={handleDiscount}
                                  value={discount}
                                  autoFocus={true}
                                  autoComplete="off"
                                  name={discountType}
                                />
                                <NativeSelect
                                  className={"w-45"}
                                  onChange={(evt) => {
                                    handleChangeDiscountType(evt.target.value);
                                  }}
                                  value={discountType}
                                  defaultValue={discountType}
                                >
                                  <NativeSelectOption value={"discountPerM2"}>
                                    Kvadrat metrdan
                                  </NativeSelectOption>
                                  <NativeSelectOption value={"discountTotal"}>
                                    Umumiy summadan
                                  </NativeSelectOption>
                                </NativeSelect>
                              </div>
                            </div>
                          )}
                          <RadioGroup name={"state"} defaultValue="BOX">
                            <div className="flex gap-4">
                              <FieldLabel htmlFor="box">
                                <Field orientation="horizontal">
                                  <FieldContent>
                                    <FieldTitle>Karobka</FieldTitle>
                                    <FieldDescription className="text-xs">
                                      Uy hech qanday ta'mirsiz, karobka holatida
                                      topshiriladi
                                    </FieldDescription>
                                  </FieldContent>
                                  <RadioGroupItem value="BOX" id="box" />
                                </Field>
                              </FieldLabel>
                              <FieldLabel htmlFor="ready">
                                <Field orientation="horizontal">
                                  <FieldContent>
                                    <FieldTitle>Ta'mirlangan</FieldTitle>
                                    <FieldDescription className="text-xs">
                                      Uy jihozlashga tayyor bo'ladi
                                    </FieldDescription>
                                  </FieldContent>
                                  <RadioGroupItem value="READY" id="ready" />
                                </Field>
                              </FieldLabel>
                            </div>
                          </RadioGroup>
                          <div className="grid gap-2">
                            <Label htmlFor="downPayment">
                              Boshlang'ich to'lov
                            </Label>
                            <InputGroup>
                              <InputGroupInput
                                id="downPayment"
                                onChange={handleDownPayment}
                                value={downPayment}
                                name={"downPayment"}
                                placeholder="0"
                                autoComplete="off"
                                autoFocus={true}
                              />
                              <InputGroupAddon align="inline-end">
                                <InputGroupText>so'm</InputGroupText>
                              </InputGroupAddon>
                            </InputGroup>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="months">Necha oyga</Label>
                            <div className="flex gap-2">
                              <div className="flex gap-1">
                                {paymentPeriods.map((p) => {
                                  return (
                                    <span
                                      onClick={() => {
                                        handlePeriod(p);
                                      }}
                                      className={`inline-flex items-center justify-center w-9 rounded-full cursor-pointer ${
                                        period === p
                                          ? "bg-primary text-primary-foreground"
                                          : "border"
                                      }`}
                                    >
                                      {p}
                                    </span>
                                  );
                                })}
                              </div>
                              <InputGroup>
                                <InputGroupInput
                                  id="months"
                                  name={"months"}
                                  autoComplete="off"
                                  onChange={(evt) => {
                                    const value = Number(evt.target.value);
                                    handlePeriod(value);
                                  }}
                                  type="number"
                                  min={12}
                                  max={240}
                                  value={period}
                                  placeholder="0"
                                />
                                <InputGroupAddon align="inline-end">
                                  <InputGroupText>oy</InputGroupText>
                                </InputGroupAddon>
                              </InputGroup>
                            </div>
                          </div>
                          <Button variant="secondary" disabled={calcLoading}>
                            {calcLoading ? (
                              <>Hisoblanmoqda...</>
                            ) : (
                              <>
                                <Calculator /> Hisoblash
                              </>
                            )}
                          </Button>
                        </form>
                      </div>
                    </DrawerContent>
                  </Drawer>
                )}

                {activeHome && (
                  <Button
                    disabled={pdfLoading}
                    className={"mb-10 w-full"}
                    onClick={handleClick}
                  >
                    {pdfLoading ? (
                      <>
                        <RefreshCcw className="animate-spin" />
                        Rasmiylashtirilmoqda...
                      </>
                    ) : (
                      "Rasmiylashtirish"
                    )}
                  </Button>
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
