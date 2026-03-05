import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "../components/ui/field";
import {
  ArrowLeft,
  CircleCheck,
  CircleXIcon,
  Power,
  RefreshCcw,
  Search,
  ShieldAlert,
  Trash,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useLoadingBar } from "react-top-loading-bar";
import { toast } from "sonner";
import GeneralError from "../components/error/GeneralError";
import LogoLoader from "../components/loading/LogoLoader";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
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
import { Switch } from "../components/ui/switch";
import { Textarea } from "../components/ui/textarea";
import { useCompanyDetails } from "../hooks/use-company-details";
import { apiUrl } from "../lib/api";
import { getFormData } from "../lib/utils";

const TOAST_OPTS = { position: "top-right" };
const UZ_PHONE = /^\+998\d{9}$/;

function validateCompanyEditForm(form, data) {
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

export default function CompanyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [logo, setLogo] = useState({ file: null, src: null, removed: false });

  const {
    details,
    notFound,
    error,
    getLoading,
    editLoading,
    statusLoading,
    deleteLoading,
    get,
    edit,
    toggleStatus,
    remove,
  } = useCompanyDetails(id);

  const { start, complete } = useLoadingBar({ color: "#5ea500", height: 3 });

  useEffect(() => {
    if (getLoading) start();
    else complete();
  }, [getLoading, start, complete]);

  const handleEditMode = useCallback(() => setEditMode((v) => !v), []);

  const handleImage = useCallback((file) => {
    setLogo((prev) => ({
      ...prev,
      src: URL.createObjectURL(file),
      file,
      removed: false,
    }));
  }, []);

  const handleRemoveImage = useCallback(() => {
    setLogo({ file: null, src: null, removed: true });
  }, []);

  const handleSubmit = useCallback(
    (evt) => {
      evt.preventDefault();
      const form = evt.currentTarget;
      const data = {
        ...getFormData(form),
        permissions: new FormData(form).getAll("permissions"),
      };
      if (!validateCompanyEditForm(form, data)) return;
      data.logo = logo.file ?? null;
      data.phoneNumber = data.phoneNumber?.startsWith("+")
        ? data.phoneNumber
        : `+998${data.phoneNumber}`;
      edit(data).then((ok) => {
        if (ok) {
          setLogo((prev) => ({ ...prev, file: null, src: null, removed: false }));
          handleEditMode();
        }
      });
    },
    [edit, logo.file, handleEditMode]
  );

  const handleDelete = useCallback(async () => {
    const ok = await remove();
    if (ok) navigate("/company");
  }, [remove, navigate]);

  const avatarSrc =
    logo.src && logo.src.startsWith("blob:")
      ? logo.src
      : !logo.removed && details?.logo
        ? apiUrl(details.logo)
        : undefined;

  if (getLoading) return <LogoLoader />;
  if (error) return <GeneralError />;
  if (notFound)
    return (
      <div className="animate-fade-in flex h-full w-full items-center justify-center">
        <div className="tex-center flex w-full max-w-sm flex-col items-center">
          <h3 className="mb-3 text-2xl font-medium">404</h3>
          <p className="text-muted-foreground mb-5">
            Bunday kompaniya mavjud emas!
          </p>
          <Link
            className={buttonVariants({ variant: "secondary" })}
            to="/company"
          >
            <Search /> Mavjud kompaniyalar
          </Link>
        </div>
      </div>
    );

  if (!details) return null;

  return (
    <section className="animate-fade-in h-full p-5">
      <div className="mb-10 flex items-center justify-between">
        <Link className={buttonVariants({ variant: "outline" })} to="/company">
          <ArrowLeft />
          Orqaga
        </Link>
        <div className="flex items-center space-x-2">
          <Switch
            id="edit-mode"
            checked={editMode}
            onCheckedChange={handleEditMode}
          />
          <Label htmlFor="edit-mode">O&apos;zgartirish</Label>
        </div>
      </div>

      <div className="relative mb-4 rounded border px-3 py-6">
        <h3 className="bg-background text-muted-foreground absolute left-5 top-0 flex -translate-y-2/4 gap-2 px-2 font-bold">
          <ShieldAlert /> Muhim harakatlar
        </h3>
        <div className="flex items-center justify-between">
          {!statusLoading && (
            <Badge
              className={`animate-fade-in ${details.status === false ? "bg-background" : ""}`}
              variant={details.status ? "default" : "outline"}
            >
              {details.status ? (
                <>
                  <CircleCheck /> Faol
                </>
              ) : (
                <>
                  <CircleXIcon /> To&apos;xtagan
                </>
              )}
            </Badge>
          )}
          {statusLoading && (
            <p>
              {details.status ? "To'xtatilmoqda..." : "Faollashtirilmoqda..."}
            </p>
          )}
          <div className="flex gap-3">
            <Button
              onClick={toggleStatus}
              disabled={!editMode || statusLoading || editLoading}
              variant={details.status ? "secondary" : "default"}
            >
              <Power /> {details.status ? "To'xtatish" : "Faollashtirish"}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={deleteLoading || editLoading || statusLoading}
                  variant="destructive"
                >
                  {deleteLoading ? (
                    <>
                      <RefreshCcw className="animate-spin" />
                      O&apos;chirilmoqda...
                    </>
                  ) : (
                    <>
                      <Trash />
                      O&apos;chirish
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Rostan ham <span className="font-mono">{details.name}</span>{" "}
                    kompaniyasini o&apos;chirib yubormoqchimisiz?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Yaxshilab o&apos;ylab ko&apos;ring, bu jarayonni ortga qaytarish
                    imkonsiz!
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Yo&apos;q</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Ha
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-10">
        <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-lg">
          <Avatar className="h-full w-full rounded-lg">
            <AvatarImage src={avatarSrc} alt={details.name?.[0]} />
            <AvatarFallback className="rounded-lg uppercase select-none">
              <span className="text-5xl">{details.name?.[0]}</span>
            </AvatarFallback>
          </Avatar>
          {editMode && (
            <div
              className={`animate-fade-in absolute inset-0 z-10 flex bg-black/50 ${editLoading ? "pointer-events-none opacity-80" : ""}`}
            >
              {avatarSrc && (
                <div
                  onClick={handleRemoveImage}
                  className="group flex h-full w-full cursor-pointer items-center justify-center"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && handleRemoveImage()}
                >
                  <Trash className="group-hover:text-destructive h-10 w-10 text-white" />
                </div>
              )}
              <label
                className="group inline-flex h-full w-full cursor-pointer items-center justify-center"
                htmlFor="image"
              >
                <RefreshCcw className="h-10 w-10 text-white group-hover:opacity-80" />
                <input
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])}
                  id="image"
                  type="file"
                  accept="image/*"
                />
              </label>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="relative flex w-full flex-col">
          <div className="grid w-full grid-cols-2 gap-5">
            <div className="grid gap-2">
              <Label htmlFor="name">Kompaniya nomi*</Label>
              <Input
                className="w-full"
                id="name"
                name="name"
                type="text"
                placeholder="Kompaniya nomini kiriting"
                defaultValue={details.name}
                disabled={!editMode || editLoading || statusLoading}
              />
            </div>
            <div className="grid w-full gap-2">
              <Label htmlFor="managerName">Boshqaruvchi*</Label>
              <Input
                id="managerName"
                name="managerName"
                type="text"
                placeholder="Boshqaruvchi ismini kiriting"
                defaultValue={details.managerName}
                disabled={!editMode || editLoading || statusLoading}
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
                  defaultValue={details.phoneNumber?.replace("+998", "")}
                  disabled={!editMode || editLoading || statusLoading}
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
                defaultValue={details.description}
                disabled={!editMode || editLoading || statusLoading}
              />
            </div>
            <div className="col-span-2 grid w-full items-center gap-3">
              <Label>Ruxsatlar*</Label>
              <div className="flex gap-5">
                <FieldLabel>
                  <Field orientation="horizontal">
                    <Checkbox
                      id="permissions-prohome"
                      defaultChecked={details.permissions?.PROHOME}
                      name="permissions"
                      value="PROHOME"
                      disabled={!editMode || editLoading || statusLoading}
                    />
                    <FieldContent>
                      <FieldTitle>PROHOME</FieldTitle>
                    </FieldContent>
                  </Field>
                </FieldLabel>
                <FieldLabel>
                  <Field orientation="horizontal">
                    <Checkbox
                      id="permissions-crm"
                      defaultChecked={details.permissions?.CRM}
                      name="permissions"
                      value="CRM"
                      disabled={!editMode || editLoading || statusLoading}
                    />
                    <FieldContent>
                      <FieldTitle>CRM</FieldTitle>
                    </FieldContent>
                  </Field>
                </FieldLabel>
              </div>
            </div>
          </div>
          {editMode && (
            <div className="animate-fade-in absolute -bottom-5 right-0 flex translate-y-full gap-3">
              <Button
                onClick={handleEditMode}
                variant="outline"
                type="button"
                disabled={editLoading || statusLoading}
              >
                Bekor qilish
              </Button>
              <Button disabled={editLoading || statusLoading} type="submit">
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
  );
}
