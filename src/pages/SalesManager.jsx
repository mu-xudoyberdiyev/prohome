import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Check, Plus, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";
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

export default function SalesManager() {
  // Modals
  const [addModal, setAddModal] = useState(false);
  const [salesmanagers, setSalesmanagers] = useState([]);

  // Errors
  const [error, setError] = useState(null);

  // Loadings
  const { start, complete } = useLoadingBar({
    color: "#5ea500",
    height: 3,
  });
  const [getLoading, setGetLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);

  // Permanently states
  const [showConfirmation, setShowConfirmation] = useState(null);

  // ======= CRUD =======

  // Create
  async function add(data) {
    let req;
    const token = localStorage.getItem("token");

    setAddLoading(true);
    try {
      req = await fetch(
        import.meta.env.VITE_BASE_URL + `/api/v1/user/sales-manager`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify(data),
        },
      );
    } catch {
      toast.error("Tizimda nosozlik, adminga aloqaga chiqing!", {
        position: "top-center",
      });
    }

    if (req) {
      if (req.status === 201) {
        const newSalesManager = await req.json();

        setSalesmanagers((prev) => {
          return [newSalesManager, ...prev];
        });

        handleAddModal();

        toast.success(`${newSalesManager.fullName} qo'shildi!`);
      } else if (req.status === 409) {
        toast.error("Bu email bilan sotuv menejeri ro'yhatdan o'tgan!", {
          position: "top-center",
        });
      } else {
        toast.error("Xatolik yuz berdi, qayta urunib ko'ring!", {
          position: "top-center",
        });
      }
    }

    setAddLoading(false);
  }

  // Read
  async function get() {
    start();
    let req;
    const token = localStorage.getItem("token");

    setGetLoading(true);
    try {
      req = await fetch(
        import.meta.env.VITE_BASE_URL + `/api/v1/user/all/sales-manager`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        },
      );
    } catch {
      setError("Tizimda nosozlik!");
    }

    if (req) {
      if (req.status === 200) {
        const { safeUsers } = await req.json();

        setSalesmanagers(safeUsers);
      } else {
        setError("Xatolik yuz berdi qayta urunib ko'ring!");
      }
    }

    setGetLoading(false);
    complete();
  }

  // Delete
  async function remove(id) {
    let req;
    const token = localStorage.getItem("token");
    setRemoveLoading(true);
    try {
      req = await fetch(
        import.meta.env.VITE_BASE_URL +
          `/api/v1/user/remove-sales-maneger/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token,
          },
        },
      );
    } catch {
      toast.error("Tizimda nosozlik, adminga aloqaga chiqing!");
    }

    if (req) {
      if (req.status === 200) {
        const result = salesmanagers.filter((rp) => rp.id !== id);
        setSalesmanagers(result);

        toast.success(`Sotuvchi o'chirildi!`);
      } else {
        toast.error(
          "Sotuvchini o'chirishda xatolik yuz berdi qayta urunib ko'ring!",
        );
      }
    }

    setShowConfirmation(null);
    setRemoveLoading(false);
  }

  // ===== Funtions =====
  function handleAddSubmit(evt) {
    evt.preventDefault();
    const result = {
      ...getFormData(evt.currentTarget),
      permissions: new FormData(evt.currentTarget).getAll("permissions"),
    };

    if (result.fullName.trim() === "") {
      evt.currentTarget.fullName.focus();
      toast.info("FISHni kiriting!", { position: "top-center" });
    } else if (result.email.trim() === "") {
      evt.currentTarget.email.focus();
      toast.info("Email kiriting!", { position: "top-center" });
    } else if (result.password.trim() === "") {
      evt.currentTarget.password.focus();
      toast.info("Parol kiriting!", { position: "top-center" });
    } else if (result.password.trim().length <= 6) {
      evt.currentTarget.password.focus();
      toast.info("Parol eng kamida 6 ta belgi bo'lishi kerak!", {
        position: "top-center",
      });
    } else if (result.permissions.length === 0) {
      toast.info("Ruxsatlarni belgilang!", {
        position: "top-center",
      });
    } else {
      result.companyId = 1;

      add(result);
    }
  }

  function handleAddModal() {
    setAddModal(!addModal);
  }

  function handleDelete(id) {
    remove(id);
  }

  useEffect(() => {
    get();
  }, []);

  // ====== Render ======
  if (getLoading) {
    return <LogoLoader />;
  }

  if (error) {
    return <GeneralError />;
  }

  return (
    <>
      <section className="animate-fade-in relative h-full">
        {/* Header  */}
        <header className="bg-primary/2 mb-10 flex items-center justify-between rounded border p-3">
          <h2 className="text-2xl font-bold">Sotuv menejerlari</h2>

          <Button
            onClick={handleAddModal}
            disabled={getLoading || addLoading}
            variant="secondary"
            size="sm"
          >
            <Plus />
            Qo'shish
          </Button>
        </header>

        <div className="flex h-full max-h-75 w-full flex-col gap-4 overflow-y-auto pr-2">
          {salesmanagers.length > 0 ? (
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
                {salesmanagers.map((rp, index) => {
                  return (
                    <TableRow className="group">
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {rp.fullName}
                      </TableCell>
                      <TableCell>{rp.email}</TableCell>

                      <TableCell>
                        <div className="flex gap-0.5">
                          {rp.permission.PROHOME && (
                            <Badge variant={"outline"}>Prohome</Badge>
                          )}
                          {rp.permission.CRM && (
                            <Badge variant={"outline"}>CRM</Badge>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex w-full min-w-37.5 items-center justify-end gap-1">
                          {showConfirmation === rp.id && (
                            <Badge
                              onClick={() => {
                                handleDelete(rp.id);
                              }}
                              className={`animate-fade-in cursor-pointer hover:opacity-80 ${removeLoading ? "pointer-events-none opacity-60" : ""}`}
                            >
                              {removeLoading ? (
                                <>
                                  <Spinner /> O'chirilmoqda...
                                </>
                              ) : (
                                <>
                                  <Check /> Tasdiqlang
                                </>
                              )}
                            </Badge>
                          )}
                          <Button
                            onClick={() => {
                              if (showConfirmation === rp.id) {
                                setShowConfirmation(null);
                              } else {
                                setShowConfirmation(rp.id);
                              }
                            }}
                            variant="ghost"
                            size="icon-sm"
                          >
                            {showConfirmation === rp.id ? <X /> : <Trash />}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <EmptyData text="Hozircha sotuv menejerlari yo'q" />
          )}
        </div>
      </section>

      {/* Add modal  */}
      <Drawer open={addModal} onOpenChange={handleAddModal}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Yangi rop qo'shish.</DrawerTitle>
            <DrawerDescription>
              Rop qo'shish uchun barcha ma'lumotlarni to'ldiring
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
              <Label htmlFor="password">Ruxsatlar*</Label>
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
                  <Spinner /> Qo'shilmoqda...
                </>
              ) : (
                <>
                  <Plus /> Qo'shish
                </>
              )}
            </Button>
          </form>
        </DrawerContent>
      </Drawer>
    </>
  );
}
