import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAppStore } from "../lib/zustand";
import { Button, buttonVariants } from "../components/ui/button";
import { useState } from "react";
import { getFormData } from "../lib/utils";
import { toast } from "sonner";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "../components/ui/input-group";
import { Textarea } from "../components/ui/textarea";
import {
  ArrowLeft,
  Plus,
  PlusCircle,
  RefreshCcw,
  Trash,
  X,
} from "lucide-react";

export default function AddCompany() {
  const { user } = useAppStore();
  const navigate = useNavigate();

  // States
  const [logo, setLogo] = useState({ file: null, src: null });

  // Loadings
  const [addLoading, setAddLoading] = useState(false);

  // Add
  async function add(data) {
    let req;
    const token = JSON.parse(localStorage.getItem("user")).accessToken;

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    setAddLoading(true);
    try {
      req = await fetch(import.meta.env.VITE_BASE_URL + "/api/v1/company", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formData,
      });
    } catch {
      toast.error("Tizimda nosozlik, adminga aloqaga chiqing!", {
        position: "top-center",
      });
    }

    if (req) {
      if (req.status === 201) {
        const data = await req.json();
        toast.success(`${data.name} kompaniyasi qo'shildi!`);
        navigate("/company");
      } else if (req.status === 409) {
        toast.error("Ushbu kompaniya ro'yhatdan o'tgan!");
      } else {
        toast.error("Xatolik yuz berdi, qayta urunib ko'ring!", {
          position: "top-center",
        });
      }
    }

    setAddLoading(false);
  }

  // Functions
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
    } else if (isValidUzPhone(`+998${data.phoneNumber.trim()}`) === false) {
      toast.info("Telefon raqam +998xxxxxxxxx formatda bo'lishi kerak!", {
        position: "top-right",
      });
      evt.currentTarget.phoneNumber.focus();
    } else if (data.phoneNumber.trim() === "") {
      toast.info("Telefon raqamni kiriting!", { position: "top-right" });
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

      add(data);
    }
  }

  function handleImage(file) {
    const src = URL.createObjectURL(file);
    setLogo((prev) => {
      return { ...prev, src, file };
    });
  }

  function handleDeleteLogo() {
    setLogo((prev) => {
      return {
        ...prev,
        file: null,
        src: null,
      };
    });
  }

  if (user) {
    return (
      <section className="h-full animate-fade-in">
        <Link
          className={`${buttonVariants({ variant: "outline" })} mb-10`}
          to={"/company"}
        >
          <ArrowLeft />
          Orqaga
        </Link>
        <div className="mb-5">
          <h2 className="font-bold text-3xl mb-5">Yangi kompaniya qo'shish</h2>
          <p className="text-muted-foreground">
            Yangi kompaniya qo'shish uchun barcha ma'lumotlarni kiritishingiz
            kerak!
          </p>
        </div>
        <div className="flex gap-10 items-start">
          <div className="relative shrink-0 w-40 h-40">
            {logo.file === null ? (
              <label
                className="w-full h-full inline-flex items-center justify-center border-4 border-dashed hover:border-primary transition-colors group cursor-pointer rounded-lg"
                htmlFor="logo"
              >
                <input
                  onChange={(evt) => {
                    if (evt.target.files.length > 0) {
                      handleImage(evt.target.files[0]);
                    }
                  }}
                  className="hidden"
                  accept="image/*"
                  id="logo"
                  type="file"
                />
                <Plus className="group-hover:text-primary transition-colors" />
              </label>
            ) : (
              <div className="relative w-full h-full">
                <img
                  className="object-cover object-center w-full h-full inline-block rounded-lg"
                  src={logo.src}
                  alt="Company logo"
                />
                <div className="absolute bg-black/50 inset-0 rounded-lg flex">
                  <div
                    onClick={handleDeleteLogo}
                    className="flex w-full h-full items-center justify-center group cursor-pointer"
                  >
                    <Trash className="text-white group-hover:text-destructive" />
                  </div>
                  <label
                    className="inline-flex w-full h-full items-center justify-center group cursor-pointer"
                    htmlFor="logo"
                  >
                    <input
                      onChange={(evt) => {
                        if (evt.target.files.length > 0) {
                          handleImage(evt.target.files[0]);
                        }
                      }}
                      accept="image/*"
                      className="hidden"
                      id="logo"
                      type="file"
                    />
                    <RefreshCcw className="text-white group-hover:opacity-80 transition-opacity" />
                  </label>
                </div>
              </div>
            )}
          </div>
          {/* Form  */}
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col relative"
          >
            <div className="grid grid-cols-2 gap-5 w-full mb-5">
              <div className="grid gap-2">
                <Label htmlFor="name">Kompaniya nomi*</Label>
                <Input
                  className={"w-full"}
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Kompaniya nomini kiriting"
                  disabled={addLoading}
                />
              </div>
              <div className="grid gap-2 w-full">
                <Label htmlFor="managerName">Boshqaruvchi*</Label>
                <Input
                  id="managerName"
                  name="managerName"
                  type="text"
                  placeholder="Boshqaruvchi ismini kiriting"
                  disabled={addLoading}
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
                    disabled={addLoading}
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
                  disabled={addLoading}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Link className={buttonVariants({ variant: "outline" })}>
                Bekor qilish
              </Link>
              <Button disabled={addLoading} type="submit">
                {addLoading ? (
                  <>
                    <RefreshCcw className="animate-spin" />
                    Qo'shilmoqda...
                  </>
                ) : (
                  <>
                    <PlusCircle />
                    Qo'shish
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </section>
    );
  } else {
    return <Navigate to={"/login"} />;
  }
}
