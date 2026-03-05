import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "../components/ui/field";
import { ArrowLeft, Plus, PlusCircle, RefreshCcw, Trash } from "lucide-react";
import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button, buttonVariants } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { Input } from "../components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "../components/ui/input-group";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { apiRequest } from "../lib/api";
import { getFormData } from "../lib/utils";

const TOAST_OPTS = { position: "top-right" };
const UZ_PHONE = /^\+998\d{9}$/;

function validateCompanyForm(form, data) {
  const name = (data.name ?? "").trim();
  const phone = (data.phoneNumber ?? "").trim();
  const fullPhone = phone.startsWith("+") ? phone : `+998${phone}`;
  const managerName = (data.managerName ?? "").trim();
  const description = (data.description ?? "").trim();

  if (!name) {
    form.name?.focus();
    toast.info("Kompaniya nomini kiriting!", TOAST_OPTS);
    return false;
  }
  if (!phone) {
    form.phoneNumber?.focus();
    toast.info("Telefon raqamni kiriting!", TOAST_OPTS);
    return false;
  }
  if (!UZ_PHONE.test(fullPhone)) {
    form.phoneNumber?.focus();
    toast.info("Telefon raqam +998xxxxxxxxx formatda bo'lishi kerak!", TOAST_OPTS);
    return false;
  }
  if (!managerName) {
    form.managerName?.focus();
    toast.info("Boshqaruvchi ismini kiriting!", TOAST_OPTS);
    return false;
  }
  if (!description) {
    form.description?.focus();
    toast.info("Kompaniya uchun izoh yozing!", TOAST_OPTS);
    return false;
  }
  if (!data.permissions?.length) {
    toast.info("Kompaniya uchun ruxsatlarni belgilang!", TOAST_OPTS);
    return false;
  }
  return true;
}

export default function AddCompany() {
  const navigate = useNavigate();
  const [logo, setLogo] = useState({ file: null, src: null });
  const [addLoading, setAddLoading] = useState(false);

  const handleImage = useCallback((file) => {
    setLogo((prev) => ({ ...prev, src: URL.createObjectURL(file), file }));
  }, []);

  const handleDeleteLogo = useCallback(() => {
    setLogo((prev) => ({ ...prev, file: null, src: null }));
  }, []);

  const handleSubmit = useCallback(
    async (evt) => {
      evt.preventDefault();
      const form = evt.currentTarget;
      const data = {
        ...getFormData(form),
        permissions: new FormData(form).getAll("permissions"),
      };
      if (!validateCompanyForm(form, data)) return;

      if (logo.file) data.logo = logo.file;
      else data.logo = null;
      data.phoneNumber = data.phoneNumber?.startsWith("+")
        ? data.phoneNumber
        : `+998${data.phoneNumber}`;

      setAddLoading(true);
      try {
        const formData = new FormData();
        Object.entries(data).forEach(([k, v]) => formData.append(k, v));

        const res = await apiRequest("/api/v1/company", {
          method: "POST",
          body: formData,
        });
        if (res.status === 201) {
          const result = await res.json();
          toast.success(`${result.name} kompaniyasi qo'shildi!`);
          navigate("/company");
          return;
        }
        if (res.status === 409) {
          toast.error("Ushbu kompaniya ro'yhatdan o'tgan!");
        } else {
          toast.error("Xatolik yuz berdi, qayta urunib ko'ring!", {
            position: "top-center",
          });
        }
      } catch {
        toast.error("Tizimda nosozlik, adminga aloqaga chiqing!", {
          position: "top-center",
        });
      } finally {
        setAddLoading(false);
      }
    },
    [logo.file, navigate]
  );

  return (
    <section className="animate-fade-in h-full p-5">
      <Link className={`${buttonVariants({ variant: "outline" })} mb-10`} to="/company">
        <ArrowLeft />
        Orqaga
      </Link>
      <div className="mb-5">
        <h2 className="mb-5 text-3xl font-bold">Yangi kompaniya qo&apos;shish</h2>
        <p className="text-muted-foreground">
          Yangi kompaniya qo&apos;shish uchun barcha ma&apos;lumotlarni kiritishingiz
          kerak!
        </p>
      </div>
      <div className="flex items-start gap-10">
        <div className="relative h-40 w-40 shrink-0">
          {!logo.file ? (
            <label
              className="hover:border-primary group inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg border-4 border-dashed transition-colors"
              htmlFor="logo"
            >
              <input
                onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])}
                className="hidden"
                accept="image/*"
                id="logo"
                type="file"
              />
              <Plus className="group-hover:text-primary transition-colors" />
            </label>
          ) : (
            <div className="relative h-full w-full">
              <img
                className="inline-block h-full w-full rounded-lg object-cover object-center"
                src={logo.src}
                alt="Company logo"
              />
              <div className="absolute inset-0 flex rounded-lg bg-black/50">
                <div
                  onClick={handleDeleteLogo}
                  className="group flex h-full w-full cursor-pointer items-center justify-center"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && handleDeleteLogo()}
                >
                  <Trash className="group-hover:text-destructive text-white" />
                </div>
                <label className="group inline-flex h-full w-full cursor-pointer items-center justify-center">
                  <input
                    onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])}
                    accept="image/*"
                    className="hidden"
                    id="logo"
                    type="file"
                  />
                  <RefreshCcw className="text-white transition-opacity group-hover:opacity-80" />
                </label>
              </div>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="relative flex w-full flex-col">
          <div className="mb-5 grid w-full grid-cols-2 gap-5">
            <div className="grid gap-2">
              <Label htmlFor="name">Kompaniya nomi*</Label>
              <Input
                className="w-full"
                id="name"
                name="name"
                type="text"
                placeholder="Kompaniya nomini kiriting"
                disabled={addLoading}
              />
            </div>
            <div className="grid w-full gap-2">
              <Label htmlFor="managerName">Boshqaruvchi*</Label>
              <Input
                id="managerName"
                name="managerName"
                type="text"
                placeholder="Boshqaruvchi ismini kiriting"
                disabled={addLoading}
              />
            </div>
            <div className="col-span-2 grid w-full gap-2">
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
            <div className="col-span-2 grid w-full gap-3">
              <Label htmlFor="description">Izoh*</Label>
              <Textarea
                className="max-h-16"
                placeholder="Kompaniya haqida izoh yozing"
                id="description"
                name="description"
                disabled={addLoading}
              />
            </div>
            <div className="col-span-2 grid w-full items-center gap-3">
              <Label>Ruxsatlar*</Label>
              <div className="flex gap-5">
                <FieldLabel>
                  <Field orientation="horizontal">
                    <Checkbox id="permissions-prohome" name="permissions" value="PROHOME" />
                    <FieldContent>
                      <FieldTitle>PROHOME</FieldTitle>
                    </FieldContent>
                  </Field>
                </FieldLabel>
                <FieldLabel>
                  <Field orientation="horizontal">
                    <Checkbox id="permissions-crm" name="permissions" value="CRM" />
                    <FieldContent>
                      <FieldTitle>CRM</FieldTitle>
                    </FieldContent>
                  </Field>
                </FieldLabel>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Link className={buttonVariants({ variant: "outline" })} to="/company">
              Bekor qilish
            </Link>
            <Button disabled={addLoading} type="submit">
              {addLoading ? (
                <>
                  <RefreshCcw className="animate-spin" />
                  Qo&apos;shilmoqda...
                </>
              ) : (
                <>
                  <PlusCircle />
                  Qo&apos;shish
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
