import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../components/ui/drawer";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "../components/ui/field";
import { Check, Plus, Trash, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useLoadingBar } from "react-top-loading-bar";
import { toast } from "sonner";
import EmptyData from "../components/EmptyData";
import GeneralError from "../components/error/GeneralError";
import LogoLoader from "../components/loading/LogoLoader";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Spinner } from "../components/ui/spinner";
import { getFormData } from "../lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/optics/table";
import { Badge } from "../components/ui/badge";
import { useUserCrud } from "../hooks/use-user-crud";

const TOAST_OPTS = { position: "top-center" };

export default function Admin() {
  const [addModal, setAddModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(null);

  const {
    list: admins,
    error,
    getLoading,
    addLoading,
    removeLoading,
    add,
    remove,
  } = useUserCrud("admin");

  const { start, complete } = useLoadingBar({ color: "#5ea500", height: 3 });

  useEffect(() => {
    if (getLoading) start();
    else complete();
  }, [getLoading, start, complete]);

  const handleAddModal = useCallback(() => setAddModal((v) => !v), []);

  const handleAddSubmit = useCallback(
    async (evt) => {
      evt.preventDefault();
      const form = evt.currentTarget;
      const result = {
        ...getFormData(form),
        permissions: new FormData(form).getAll("permissions"),
      };
      const fullName = (result.fullName ?? "").trim();
      const email = (result.email ?? "").trim();
      const password = (result.password ?? "").trim();

      if (!fullName) {
        form.fullName?.focus();
        toast.info("FISHni kiriting!", TOAST_OPTS);
        return;
      }
      if (!email) {
        form.email?.focus();
        toast.info("Email kiriting!", TOAST_OPTS);
        return;
      }
      if (!password) {
        form.password?.focus();
        toast.info("Parol kiriting!", TOAST_OPTS);
        return;
      }
      if (password.length <= 6) {
        form.password?.focus();
        toast.info("Parol eng kamida 6 ta belgi bo'lishi kerak!", TOAST_OPTS);
        return;
      }
      if (!result.permissions?.length) {
        toast.info("Ruxsatlarni belgilang!", TOAST_OPTS);
        return;
      }

      result.companyId = 1;
      const ok = await add(result);
      if (ok) setAddModal(false);
    },
    [add]
  );

  const handleDelete = useCallback(
    (id, fullName) => {
      remove(id, fullName).then(() => setShowConfirmation(null));
    },
    [remove]
  );

  const toggleConfirm = useCallback((id) => {
    setShowConfirmation((prev) => (prev === id ? null : id));
  }, []);

  if (getLoading) return <LogoLoader />;
  if (error) return <GeneralError />;

  return (
    <>
      <section className="animate-fade-in relative h-full p-5">
        <header className="bg-primary/2 mb-10 flex items-center justify-between rounded border p-3">
          <h2 className="text-2xl font-bold">Adminlar</h2>
          <Button
            onClick={handleAddModal}
            disabled={getLoading || addLoading}
            variant="secondary"
            size="sm"
          >
            <Plus />
            Qo&apos;shish
          </Button>
        </header>

        <div className="flex h-full max-h-75 w-full flex-col gap-4 overflow-y-auto pr-2">
          {admins.length > 0 ? (
            <Table className="w-full">
              <TableHeader className="bg-background sticky top-0">
                <TableRow>
                  <TableHead>№</TableHead>
                  <TableHead>Ism</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Ruxsatlar</TableHead>
                  <TableHead className="text-end">Harakatlar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((adm, index) => (
                  <TableRow key={adm.id} className="group">
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{adm.fullName}</TableCell>
                    <TableCell>{adm.email}</TableCell>
                    <TableCell>
                      <div className="flex gap-0.5">
                        {adm.permission?.PROHOME && (
                          <Badge variant="outline">Prohome</Badge>
                        )}
                        {adm.permission?.CRM && (
                          <Badge variant="outline">CRM</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex w-full min-w-37.5 items-center justify-end gap-1">
                        {showConfirmation === adm.id && (
                          <Badge
                            onClick={() => handleDelete(adm.id, adm.fullName)}
                            className={`animate-fade-in cursor-pointer hover:opacity-80 ${removeLoading ? "pointer-events-none opacity-60" : ""}`}
                          >
                            {removeLoading ? (
                              <>
                                <Spinner /> O&apos;chirilmoqda...
                              </>
                            ) : (
                              <>
                                <Check /> Tasdiqlang
                              </>
                            )}
                          </Badge>
                        )}
                        <Button
                          onClick={() => toggleConfirm(adm.id)}
                          variant="ghost"
                          size="icon-sm"
                        >
                          {showConfirmation === adm.id ? <X /> : <Trash />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyData text="Hozircha adminlar yo'q" />
          )}
        </div>
      </section>

      <Drawer open={addModal} onOpenChange={handleAddModal}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Yangi admin qo&apos;shish.</DrawerTitle>
            <DrawerDescription>
              Admin qo&apos;shish uchun barcha ma&apos;lumotlarni to&apos;ldiring
            </DrawerDescription>
          </DrawerHeader>
          <form
            onSubmit={handleAddSubmit}
            className="mx-auto flex w-full max-w-sm flex-col gap-5 p-5"
          >
            <div className="grid w-full items-center gap-3">
              <Label htmlFor="fullName">FISH*</Label>
              <Input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="To'liq ismingizni yozing"
              />
            </div>
            <div className="grid w-full items-center gap-3">
              <Label htmlFor="email">Email*</Label>
              <Input
                type="email"
                id="email"
                name="email"
                autoComplete="username"
                placeholder="Email"
              />
            </div>
            <div className="grid w-full items-center gap-3">
              <Label htmlFor="password">Parol*</Label>
              <Input
                type="password"
                id="password"
                name="password"
                autoComplete="current-password"
                placeholder="********"
              />
            </div>
            <div className="grid w-full items-center gap-3">
              <Label>Ruxsatlar*</Label>
              <div className="flex gap-5">
                <FieldLabel>
                  <Field orientation="horizontal">
                    <Checkbox
                      id="permissions-prohome"
                      name="permissions"
                      value="PROHOME"
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
                      name="permissions"
                      value="CRM"
                    />
                    <FieldContent>
                      <FieldTitle>CRM</FieldTitle>
                    </FieldContent>
                  </Field>
                </FieldLabel>
              </div>
            </div>
            <Button disabled={addLoading} type="submit">
              {addLoading ? (
                <>
                  <Spinner /> Qo&apos;shilmoqda...
                </>
              ) : (
                <>
                  <Plus /> Qo&apos;shish
                </>
              )}
            </Button>
          </form>
        </DrawerContent>
      </Drawer>
    </>
  );
}
