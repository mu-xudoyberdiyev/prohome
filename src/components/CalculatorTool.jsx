import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "./ui/input-group";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { NativeSelect, NativeSelectOption } from "./ui/native-select";
import {
  formatNumber,
  formatNumberWithPercent,
  getFormData,
  normalizePeriod,
} from "../lib/utils";
import { Spinner } from "./ui/spinner";
import { NoiseBackground } from "./ui/noise-background";
import { useEffect, useRef, useState } from "react";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Drawer, DrawerClose, DrawerContent } from "@/components/ui/drawer";
import { SparklesText } from "@/components/ui/sparkles-text";
import {
  BadgePercent,
  Bolt,
  Calculator,
  CalendarDays,
  CircleCheckBig,
  CircleDollarSign,
  CircleMinus,
  CirclePlus,
  Grid2X2,
  HandCoins,
  Ribbon,
  X,
} from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import useSound from "../hooks/use-sound";

const states = {
  BOX: "Karobka",
  READY: "Ta'mirlangan",
};

const uzbekTranslate = {
  refrigerator: "Muzlatgich",
  "gas-stove": "Gaz plita",
  "washing-machine": "Kir yuvish mashinasi",
  "electric-plate": "Elektr plita",
};

const actionButtons = [
  {
    code: "SOLD",
    title: "Sotish",
    bg: "bg-green-500",
  },
  {
    code: "RESERVED",
    title: "Bron qilish",
    bg: "bg-yellow-500",
  },
  {
    code: "NOT",
    title: "To'xtatish",
    bg: "bg-slate-400",
  },
  {
    code: "EMPTY",
    title: "Sotuvga chiqarish",
    bg: "bg-green-500",
  },
];

const paymentPeriods = [12, 24, 36, 48, 60];

export default function CalculatorTool({ home }) {
  const timerRef = useRef();
  const { sound } = useSound("/win.mp3");
  const [open, setOpen] = useState(
    window.location.search.includes("details=") &&
      window.location.hash === "#calculator"
  );
  const [calcResult, setCalcResult] = useState({
    monthlyPayment: 0,
    downPayment: 0,
    months: 60,
    bonus: [],
  });
  const [showDiscount, setShowDiscount] = useState(false);
  const [discountType, setDiscountType] = useState("discountPerM2");
  const [period, setPeriod] = useState(60);
  const [downPayment, setDownPayment] = useState(0);
  const [discount, setDiscount] = useState("");

  const [galleryShow, setGalleryShow] = useState(false);

  // Loadings
  const [calcLoading, setCalcLoading] = useState(false);

  //   API
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
      toast.error("Tizimda nosozlik!", { position: "bottom-left" });
    }

    if (req) {
      if (req.status === 200) {
        const data = await req.json();
        console.log(data);

        setCalcResult(data);

        if (data.bonus.length > 0) win();
      } else if (req.status === 400) {
        toast.error(
          "Boshlang'ich to'lov uyning umumiy summasidan katta bo'lishi mumkin emas!",
          { position: "bottom-left" }
        );
      } else {
        toast.error("Xatolik yuz berdi qayta urunib ko'ring!", {
          position: "bottom-left",
        });
      }
    }

    setCalcLoading(false);
  }

  function handleOpen() {
    setOpen(!open);
  }

  function handleClose() {
    setCalcResult({
      monthlyPayment: 0,
      downPayment: 0,
      months: 60,
      bonus: [],
    });

    setDownPayment(0);
    setPeriod(60);
    setDiscount("");
    setShowDiscount(false);
    setCalcLoading(false);

    const url = new URL(window.location.href);
    url.hash = "";

    history.replaceState(null, "", url);
  }

  function handleChangeDiscountType(value) {
    setDiscountType(value);
  }

  function handleCalc(evt) {
    evt.preventDefault();
    const url = new URL(
      import.meta.env.VITE_BASE_URL + `/api/v1/room/${home.id}/calculate`
    );
    const formData = getFormData(evt.currentTarget);

    Object.entries(formData).forEach(([key, value]) => {
      console.log(key, value.replaceAll(" ", ""));

      url.searchParams.append(key, value.replaceAll(/\s+/g, ""));
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

  function win() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    sound();
  }

  useEffect(() => {
    window.addEventListener("hashchange", (evt) => {
      const url = new URL(evt.newURL);
      if (url.searchParams.has("details") && url.hash === "#calculator") {
        setOpen(true);
      } else {
        setOpen(false);
      }
    });
  }, []);

  // Discount
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.keyCode === 68 && !timerRef.current) {
        timerRef.current = setTimeout(() => {
          setShowDiscount((prev) => !prev);
          timerRef.current = null;
        }, 2500);
      }
    }

    function handleKeyUp(e) {
      if (e.keyCode === 68) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <Drawer
      open={open}
      onOpenChange={(v) => {
        if (v === false && galleryShow === false) {
          handleOpen();
          handleClose();
        }
      }}
      direction={"top"}
    >
      <DrawerContent className="h-full min-h-screen">
        {/* Close  */}
        <DrawerClose
          onClick={handleClose}
          className={`${buttonVariants({
            variant: "secondary",
            size: "icon-sm",
          })} absolute top-3 right-3 border shadow`}
        >
          <X />
        </DrawerClose>

        <div className="py-15 px-10 h-full flex gap-10">
          <div
            className={`w-[65%] h-full overflow-y-auto no-scrollbar relative transition-opacity ${
              calcLoading ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            {calcLoading && (
              <div className="inset-0 absolute z-10 flex items-center justify-center">
                <Spinner />
              </div>
            )}

            <div className="animate-fade-in mb-5">
              <div className="border px-3 py-6 rounded animate-fade-in w-full sticky top-2 bg-background mb-8 z-10">
                <h3 className="absolute left-5 top-0 -translate-y-2/4 bg-background text-muted-foreground px-2 flex gap-2 rounded">
                  Oyiga
                </h3>
                <h2 className={"text-4xl font-mono font-bold"}>
                  {formatNumber(calcResult.monthlyPayment)}
                </h2>
              </div>

              {calcResult.bonus.length > 0 && (
                <div className="w-full rounded overflow-hidden text-primary-foreground mb-5 flex border-3 border-green-500 animate-fade-in">
                  <div className="bg-green-500 p-2 flex items-center justify-center font-bold text-7xl">
                    Bonus:
                  </div>

                  <div className="w-2/4 px-10 py-2 flex gap-5">
                    <PhotoProvider
                      onVisibleChange={(visible) => {
                        setGalleryShow(visible);
                      }}
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
                      {calcResult.bonus.map((b) => {
                        return (
                          <PhotoView src={`/bonus/png/${b}.png`}>
                            <div className="flex flex-col items-center gap-1">
                              <picture>
                                <source
                                  srcset={`/bonus/avif/${b}.avif`}
                                  type="image/avif"
                                />
                                <img
                                  className="w-25 object-cover"
                                  src={`/bonus/png/${b}.png`}
                                  alt={b}
                                />
                              </picture>
                              <span className="text-foreground text-xs">
                                {uzbekTranslate[b]}
                              </span>
                            </div>
                          </PhotoView>
                        );
                      })}
                    </PhotoProvider>
                  </div>
                </div>
              )}

              {calcResult.totalDiscount ? (
                <NoiseBackground
                  containerClassName="w-full p-4 rounded mb-10"
                  speed={0.4}
                >
                  <div className="p-2 bg-background inline-flex items-end w-full gap-5 rounded">
                    <CircleCheckBig
                      className="text-green-600"
                      width={40}
                      height={40}
                    />
                    <SparklesText className="text-5xl" sparklesCount={5}>
                      {formatNumber(calcResult.totalDiscount)}
                    </SparklesText>
                    <p>so'm foydadasiz hurmatli mijoz!</p>
                  </div>
                </NoiseBackground>
              ) : null}

              <div className="grid grid-cols-[6fr_2fr_3fr] gap-2 mb-2">
                <div className="border p-2 w-full rounded bg-primary/2">
                  <div className="flex items-center gap-1 mb-2">
                    <CircleDollarSign />
                    <span className="text-muted-foreground text-xs">
                      Umumiy narx
                    </span>
                  </div>
                  <h4 className="text-lg font-mono font-medium">
                    {calcResult.price
                      ? formatNumber(calcResult.price * calcResult.size)
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
                      <Grid2X2 />
                      <span className="text-muted-foreground text-xs">
                        O'lchami
                      </span>
                    </div>
                    <h4 className="text-lg font-mono font-medium">
                      {calcResult.size} m<sup>2</sup>
                    </h4>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-[1fr_3fr] gap-2 mb-2">
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
            </div>

            <PhotoProvider
              onVisibleChange={(visible) => {
                setGalleryShow(visible);
              }}
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
                    className="w-full shadow"
                    src={`/gallery/jpg/${home.image}.jpg`}
                    alt={home.image}
                  />
                </picture>
              </PhotoView>
            </PhotoProvider>
          </div>

          <div className="w-[35%] h-full overflow-y-auto flex flex-col justify-between no-scrollbar px-1">
            <form
              onSubmit={handleCalc}
              className="w-full mx-auto flex flex-col gap-5"
            >
              {showDiscount && (
                <div className="py-5">
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
                        className={"w-30"}
                        onChange={(evt) => {
                          handleChangeDiscountType(evt.target.value);
                        }}
                        value={discountType}
                        defaultValue={discountType}
                      >
                        <NativeSelectOption value={"discountPerM2"}>
                          m2
                        </NativeSelectOption>
                        <NativeSelectOption value={"discountTotal"}>
                          Summa
                        </NativeSelectOption>
                      </NativeSelect>
                    </div>
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
                <Label htmlFor="downPayment">Boshlang'ich to'lov</Label>
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
                        const value = normalizePeriod(evt.target.value);
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

            <div className="py-10 flex flex-col gap-2">
              {home &&
                actionButtons.map(({ bg, title, code }, index) => {
                  return (
                    code !== home.status && (
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
        </div>
      </DrawerContent>
    </Drawer>
  );
}
