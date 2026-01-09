import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAppStore } from "../lib/zustand";
import { Button, buttonVariants } from "../components/ui/button";
import {
  ArrowLeft,
  CircleCheck,
  CircleQuestionMark,
  CircleXIcon,
  Power,
  RefreshCcw,
  Search,
  SearchAlert,
  ShieldAlert,
  Trash,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Switch } from "../components/ui/switch";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "../components/ui/input-group";
import { toast } from "sonner";
import { getFormData } from "../lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../components/ui/tooltip";

export default function CompanyDetails() {
  const { user } = useAppStore();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const id = pathname.split("/").at(-1);

  const [details, setDetails] = useState(null);
  const [logo, setLogo] = useState({ file: null, src: null });
  const [notFound, setNotFound] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Errors
  const [error, setError] = useState(null);

  // Loadings
  const [getLoading, setGetLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ===== CRUD =====
  async function get(id) {
    let req;
    const token = JSON.parse(localStorage.getItem("user")).accessToken;
    setGetLoading(true);
    try {
      req = await fetch(
        import.meta.env.VITE_BASE_URL + `/api/v1/company/one/${id}`,
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
        const { data } = await req.json();

        setDetails(data);
        setLogo((prev) => {
          return { ...prev, src: data.logo };
        });
      } else if (req.status === 404) {
        setNotFound(true);
      } else {
        setError("Xatolik yuz berdi qayta urunib ko'ring!");
      }
    }

    setGetLoading(false);
  }

  async function edit(data) {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    let req;
    const token = JSON.parse(localStorage.getItem("user")).accessToken;
    setEditLoading(true);
    try {
      req = await fetch(
        import.meta.env.VITE_BASE_URL + `/api/v1/company/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + token,
          },
          body: formData,
        }
      );
    } catch (er) {
      setError("Tizimda nosozlik!");
    }

    if (req) {
      if (req.status === 200) {
        const data = await req.json();

        setLogo((prev) => {
          return { ...prev, src: data.logo };
        });

        toast.success(`${data.name} ma'lumotlari yangilandi!`);
        setDetails(data);
        handleEditMode();
      } else if (req.status === 404) {
        setNotFound(true);
      } else {
        setError("Xatolik yuz berdi qayta urunib ko'ring!");
      }
    }

    setEditLoading(false);
  }

  async function statusChanger() {
    let req;
    const token = JSON.parse(localStorage.getItem("user")).accessToken;
    setStatusLoading(true);
    try {
      req = await fetch(
        import.meta.env.VITE_BASE_URL + `/api/v1/company/status/${id}`,
        {
          method: "PATCH",
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
        toast.success(
          `${data.name} ${data.status ? "faollashtirildi" : "to'xtatildi"}!`
        );
        setDetails(data);
        handleEditMode();
      } else if (req.status === 404) {
        setNotFound(true);
      } else {
        setError("Xatolik yuz berdi qayta urunib ko'ring!");
      }
    }

    setStatusLoading(false);
  }

  // Delete
  async function remove(id) {
    let req;
    const token = JSON.parse(localStorage.getItem("user")).accessToken;
    setDeleteLoading(true);
    try {
      req = await fetch(
        import.meta.env.VITE_BASE_URL + `/api/v1/company/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
    } catch {
      toast.error("Tizimda nosozlik, adminga aloqaga chiqing!");
    }

    if (req) {
      if (req.status === 200) {
        navigate("/company");
        toast.success(`${details.name} kompaniyasi o'chirildi!`);
      } else {
        toast.error(
          "Kompaniyani o'chirishda xatolik yuz berdi qayta urunib ko'ring!"
        );
      }
    }

    setDeleteLoading(false);
  }

  // ===== Functions =====
  function handleError() {
    setError(null);
  }

  function handleEditMode() {
    setEditMode(!editMode);
  }

  function handleStatus() {
    statusChanger();
  }

  function handleImage(file) {
    const src = URL.createObjectURL(file);

    setLogo((prev) => {
      return { ...prev, src, file };
    });
  }

  function handleRemoveImage() {
    setLogo(() => {
      return { src: null, file: null };
    });
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    const data = getFormData(evt.currentTarget);

    function isValidUzPhone(phone) {
      const regex = /^\+998\d{9}$/;
      return regex.test(phone);
    }

    if (data.name.trim() === "") {
      toast.info("Kompaniya nomini kiriting!", { position: "top-right" });
      evt.currentTarget.name.focus();
    } else if (data.phoneNumber.trim() === "") {
      toast.info("Telefon raqamni kiriting!", { position: "top-right" });
      evt.currentTarget.phoneNumber.focus();
    } else if (isValidUzPhone(`+998${data.phoneNumber.trim()}`) === false) {
      toast.info("Telefon raqam +998xxxxxxxxx formatda bo'lishi kerak!", {
        position: "top-right",
      });
      evt.currentTarget.phoneNumber.focus();
    } else if (data.managerName.trim() === "") {
      toast.info("Boshqaruvchi ismini kiriting!", {
        position: "top-right",
      });
      evt.currentTarget.managerName.focus();
    } else if (data.description.trim() === "") {
      toast.info("Kompaniya uchun izoh yozing!", {
        position: "top-right",
      });
      evt.currentTarget.description.focus();
    } else {
      if (logo.file) {
        data.logo = logo.file;
      } else {
        data.logo = null;
      }
      data.phoneNumber = "+998" + data.phoneNumber;

      edit(data);
    }
  }

  function handleDelete() {
    const check = confirm(
      `Rostan ham ${details?.name} kompaniyasini o'chirib yubormoqchimisiz? Yaxshilab o'ylab ko'ring, bu jarayonni ortga qaytarish imkonsiz!`
    );

    if (check) {
      remove(id);
    }
  }

  useEffect(() => {
    get(id);
  }, [id, error]);

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

    if (notFound) {
      return (
        <div className="w-full h-full flex items-center justify-center animate-fade-in">
          <div className="flex flex-col items-center tex-center w-full max-w-sm">
            <h3 className="text-2xl mb-3 font-medium">404</h3>
            <p className="text-muted-foreground mb-5">
              Bunday kompaniya mavjud emas!
            </p>
            <Link
              className={buttonVariants({ variant: "secondary" })}
              to={"/company"}
            >
              <Search /> Mavjud kompaniyalar
            </Link>
          </div>
        </div>
      );
    }

    return (
      details && (
        <section className="h-full animate-fade-in">
          <div className="flex items-center justify-between mb-10">
            <Link
              className={`${buttonVariants({ variant: "outline" })}`}
              to={"/company"}
            >
              <ArrowLeft />
              Orqaga
            </Link>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-mode"
                checked={editMode}
                defaultChecked={editMode}
                onCheckedChange={handleEditMode}
              />
              <Label htmlFor="edit-mode">O'zgartirish</Label>
            </div>
          </div>

          <div className="border relative px-3 py-6 mb-4 rounded">
            <h3 className="absolute left-5 top-0 -translate-y-2/4 bg-background font-bold px-2 text-muted-foreground flex gap-2">
              <ShieldAlert /> Muhim harakatlar
            </h3>
            <div className="flex items-center justify-between">
              {statusLoading === false && (
                <Badge
                  className={`animate-fade-in ${
                    details.status === false ? "bg-background" : ""
                  }`}
                  variant={details.status ? "default" : "outline"}
                >
                  {details.status ? (
                    <>
                      <CircleCheck /> Faol
                    </>
                  ) : (
                    <>
                      <CircleXIcon /> To'xtagan
                    </>
                  )}
                </Badge>
              )}
              {statusLoading && (
                <p>
                  {details.status
                    ? "To'xtatilmoqda..."
                    : "Faollashtirilmoqda..."}
                </p>
              )}
              <div className="flex gap-3">
                <Button
                  onClick={handleStatus}
                  disabled={editMode === false || statusLoading}
                  variant={details.status ? "secondary" : "default"}
                >
                  <Power /> {details.status ? "To'xtatish" : "Faollashtirish"}
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  variant="destructive"
                >
                  {deleteLoading ? (
                    <>
                      <RefreshCcw className="animate-spin" />
                      O'chirilmoqda...
                    </>
                  ) : (
                    <>
                      <Trash />
                      O'chirish
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button className={"mb-4"} variant="ghost" size="icon-sm">
                <CircleQuestionMark />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>
                O'zgartirishlar inobatga olinishi uchun "Saqlash" tugmasini
                bosing. <br /> Kompaniya holatini o'zgartirish uchun "Saqlash"
                tugmasini bosish talab etilmaydi.
              </p>
            </TooltipContent>
          </Tooltip>

          <div className="flex gap-10 items-start">
            <div className="relative shrink-0 w-40 h-40 rounded-lg overflow-hidden">
              <Avatar className="w-full h-full rounded-lg">
                <AvatarImage
                  src={
                    logo.src?.startsWith("blob:")
                      ? logo.src
                      : `${import.meta.env.VITE_BASE_URL}/api/v1/${logo.src}`
                  }
                  alt={details.name[0]}
                />
                <AvatarFallback className={"rounded-lg select-none uppercase"}>
                  {<span className="text-5xl">{details.name[0]}</span>}
                </AvatarFallback>
              </Avatar>
              {editMode && (
                <div
                  className={`absolute flex z-10 inset-0 bg-black/50 animate-fade-in`}
                >
                  {typeof logo.src === "string" && (
                    <div
                      onClick={handleRemoveImage}
                      className="w-full h-full flex items-center justify-center cursor-pointer group"
                    >
                      <Trash className="text-white w-10 h-10 group-hover:text-destructive" />
                    </div>
                  )}
                  <label
                    className="w-full h-full inline-flex items-center justify-center cursor-pointer group"
                    htmlFor="image"
                  >
                    <RefreshCcw className="text-white w-10 h-10 group-hover:opacity-80" />
                    <input
                      className="hidden"
                      onChange={(evt) => {
                        if (evt.target.files.length > 0) {
                          handleImage(evt.target.files[0]);
                        }
                      }}
                      id="image"
                      type="file"
                      accept="image/*"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Form  */}
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col relative"
            >
              <div className="grid grid-cols-2 gap-5 w-full">
                <div className="grid gap-2">
                  <Label htmlFor="name">Kompaniya nomi*</Label>
                  <Input
                    className={"w-full"}
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Kompaniya nomini kiriting"
                    defaultValue={details.name}
                    disabled={editMode === false}
                  />
                </div>
                <div className="grid gap-2 w-full">
                  <Label htmlFor="managerName">Boshqaruvchi*</Label>
                  <Input
                    id="managerName"
                    name="managerName"
                    type="text"
                    placeholder="Boshqaruvchi ismini kiriting"
                    defaultValue={details.managerName}
                    disabled={editMode === false}
                  />
                </div>
                <div className="grid gap-2 w-full col-start-1 col-end-3">
                  <Label htmlFor="phoneNumber">Telefon raqami*</Label>

                  <InputGroup>
                    <InputGroupInput
                      className="pl-1!"
                      id="phoneNumber"
                      name="phoneNumber"
                      type="text"
                      placeholder="xxxxxxx"
                      defaultValue={details.phoneNumber.replace("+998", "")}
                      disabled={editMode === false}
                    />
                    <InputGroupAddon>
                      <InputGroupText>+998</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </div>

                <div className="grid w-full gap-3 col-start-1 col-end-3">
                  <Label htmlFor="description">Izoh*</Label>
                  <Textarea
                    className={"max-h-16"}
                    placeholder="Kompaniya haqida izoh yozing"
                    id="description"
                    name="description"
                    defaultValue={details.description}
                    disabled={editMode === false}
                  />
                </div>
              </div>

              {editMode && (
                <div className="flex absolute gap-3 animate-fade-in -bottom-5 translate-y-full right-0">
                  <Button
                    onClick={handleEditMode}
                    variant="outline"
                    type="button"
                  >
                    Bekor qilish
                  </Button>
                  <Button disabled={editLoading} type="submit">
                    {editLoading ? (
                      <>
                        <RefreshCcw className="animate-spin" />
                        Saqlanmoqda...
                      </>
                    ) : (
                      <>Saqlash</>
                    )}
                  </Button>
                </div>
              )}
            </form>
          </div>
        </section>
      )
    );
  } else {
    return <Navigate to={"/login"} />;
  }
}
