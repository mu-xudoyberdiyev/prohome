import {
  Edit,
  Edit2,
  PlusCircle,
  PlusCircleIcon,
  RefreshCcw,
  Trash,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useAppStore } from "../lib/zustand";
import { Navigate } from "react-router-dom";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { getFormData } from "../lib/utils";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Skeleton } from "../components/ui/skeleton";

export default function Admin() {
  const { user } = useAppStore();
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [admins, setAdmins] = useState([]);

  const [getLoading, setGetLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);

  const [deletingAdmin, setDeletingAdmin] = useState(null);
  const [editingAdmin, setEditingAdmin] = useState(null);

  // CRUD
  async function add(data) {
    const token = JSON.parse(localStorage.getItem("user")).accessToken;

    setAddLoading(true);
    const req = await fetch(
      import.meta.env.VITE_BASE_URL + "/api/v1/user/admin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(data),
      }
    );

    if (req.status === 201) {
      const { safeAdmin } = await req.json();

      setAdmins((prev) => {
        return [safeAdmin, ...prev];
      });

      handleAddModal();

      toast.success(`${safeAdmin.email} qo'shildi!`, {
        position: "top-center",
      });
    } else if (req.status === 409) {
      toast.error("Bu email bilan admin ro'yhatdan o'tgan!", {
        position: "top-center",
      });
    } else {
      toast.error("Xatolik yuz berdi, qayta urunib ko'ring!", {
        position: "top-center",
      });
    }

    setAddLoading(false);
  }

  async function edit(data) {
    const token = JSON.parse(localStorage.getItem("user")).accessToken;

    setEditLoading(true);
    const req = await fetch(
      import.meta.env.VITE_BASE_URL +
        `/api/v1/user/update-admin/${editingAdmin.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(data),
      }
    );

    if (req.status === 200) {
      const { safeAdmin } = await req.json();

      const result = admins.map((adm) => {
        if (adm.id === editingAdmin.id) {
          return safeAdmin;
        } else {
          return adm;
        }
      });

      setAdmins(result);

      handleEditModal();

      toast.success(
        `${editingAdmin.email} dan ${safeAdmin.email} ga yangilandi!`,
        {
          position: "top-center",
        }
      );
    } else {
      toast.error("Xatolik yuz berdi, qayta urunib ko'ring!", {
        position: "top-center",
      });
    }

    setEditLoading(false);
  }

  async function get() {
    const token = JSON.parse(localStorage.getItem("user")).accessToken;
    setGetLoading(true);
    const req = await fetch(
      import.meta.env.VITE_BASE_URL + `/api/v1/user/all/admin`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    if (req.status === 200) {
      const { safeUsers } = await req.json();

      setAdmins(safeUsers);
    }

    setGetLoading(false);
  }

  async function remove(id) {
    const token = JSON.parse(localStorage.getItem("user")).accessToken;
    setRemoveLoading(true);
    const req = await fetch(
      import.meta.env.VITE_BASE_URL + `/api/v1/user/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    if (req.status === 200) {
      const result = admins.filter((adm) => adm.id !== id);
      setAdmins(result);
      toast.success(`${deletingAdmin.email} o'chirildi!`);
    } else {
      toast.error(
        "Adminni o'chirishda xatolik yuz berdi qayta urunib ko'ring!"
      );
    }

    setRemoveLoading(false);
    setDeletingAdmin(null);
  }

  function handleAddSubmit(evt) {
    evt.preventDefault();
    const result = getFormData(evt.currentTarget);
    result.companyId = Number(result.companyId);

    if (result.email.trim() === "") {
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
    } else {
      add(result);
    }
  }

  function handleEditSubmit(evt) {
    evt.preventDefault();
    const result = getFormData(evt.currentTarget);
    result.companyId = Number(result.companyId);

    if (result.email.trim() === "") {
      evt.currentTarget.email.focus();
      toast.info("Email kiriting!", { position: "top-center" });
    } else {
      edit(result);
    }
  }

  function handleAddModal() {
    setAddModal(!addModal);
  }

  function handleEditModal() {
    setEditModal(!editModal);
  }

  function handleDelete(id) {
    const foundAdmin = admins.find((adm) => adm.id === id);
    setDeletingAdmin(foundAdmin);
    const check = confirm(
      `Rostan ham <${foundAdmin.email}> ni o'chirib yubormoqchimisiz? Keyin bu operatsiyani orqaga qaytarib bo'lmaydi!`
    );

    if (check) {
      remove(id);
    }
  }

  function handleEdit(id) {
    const foundAdmin = admins.find((adm) => adm.id === id);
    setEditingAdmin(foundAdmin);

    handleEditModal();
  }

  useEffect(() => {
    get();
  }, []);

  // Render
  if (user) {
    if (getLoading) {
      return (
        <div className="flex flex-col w-full gap-4">
          {Array.from({ length: 8 })
            .fill(0)
            .map((_, index) => {
              return <Skeleton className={"h-12.5 rounded"} key={index} />;
            })}
        </div>
      );
    }

    return (
      <>
        {admins.length > 0 ? (
          <section>
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-bold text-3xl">Adminlar</h2>

              <Button onClick={handleAddModal} variant="secondary">
                <PlusCircleIcon />
                Qo'shish
              </Button>
            </div>

            <div className="flex flex-col w-full gap-4">
              {admins.map(({ id, email }, index) => {
                return (
                  <div
                    className="p-2 border rounded grid grid-cols-[100px_3fr_1fr] place-content-center"
                    key={id}
                  >
                    <div className="font-medium text-muted-foreground">
                      #{index + 1}
                    </div>
                    <p className="underline">{email}</p>
                    <div className="flex gap-2 justify-end pr-2">
                      <Button
                        onClick={() => {
                          handleEdit(id);
                        }}
                        variant="secondary"
                        size="icon-sm"
                      >
                        <Edit />
                      </Button>
                      <Button
                        onClick={() => {
                          handleDelete(id);
                        }}
                        disabled={deletingAdmin?.id === id && removeLoading}
                        variant="destructive"
                        size="icon-sm"
                      >
                        {deletingAdmin?.id === id && removeLoading ? (
                          <RefreshCcw className="animate-spin" />
                        ) : (
                          <Trash />
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <div className="flex flex-col items-center text-center w-full max-w-sm">
              <h3 className="text-2xl mb-3 font-medium">
                Hali admin mavjud emas!
              </h3>
              <p className="text-muted-foreground mb-5">
                Admin yaratishni istasangiz "Istayman" tugmasini bosing.
              </p>
              <Button onClick={handleAddModal} variant="secondary">
                Istayman
              </Button>
            </div>
          </div>
        )}

        {/* Add modal  */}
        <Drawer open={addModal} onOpenChange={handleAddModal}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Yangi admin qo'shish.</DrawerTitle>
              <DrawerDescription>
                Admin qo'shish uchun barcha ma'lumotlarni to'ldiring
              </DrawerDescription>
            </DrawerHeader>

            <form
              onSubmit={handleAddSubmit}
              className="max-w-sm w-full mx-auto flex flex-col gap-5 p-5"
            >
              <div className="grid w-full items-center gap-3">
                <Label htmlFor="email">Email*</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                />
              </div>
              <div className="grid w-full items-center gap-3">
                <Label htmlFor="password">Parol*</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="********"
                />
              </div>
              <div className="grid w-full items-center gap-3">
                <Label htmlFor="companyId">Kompaniya ID*</Label>
                <Input
                  type="number"
                  min="0"
                  id="companyId"
                  value="1"
                  name="companyId"
                  readOnly
                  placeholder="ID yozing"
                />
              </div>

              <Button disabled={addLoading} type="submit">
                {addLoading ? (
                  <>
                    <RefreshCcw className="animate-spin" /> Qo'shilmoqda...
                  </>
                ) : (
                  <>
                    <PlusCircle /> Qo'shish
                  </>
                )}
              </Button>
            </form>
          </DrawerContent>
        </Drawer>

        {/* Edit modal  */}
        <Drawer open={editModal} onOpenChange={handleEditModal}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>
                <b>{editingAdmin?.email}</b>ni yangilash.
              </DrawerTitle>
              <DrawerDescription>
                Adminni yangilashda ham barcha ma'lumotlarni to'liq
                to'ldirishingiz kerak!
              </DrawerDescription>
            </DrawerHeader>

            <form
              onSubmit={handleEditSubmit}
              className="max-w-sm w-full mx-auto flex flex-col gap-5 p-5"
            >
              <div className="grid w-full items-center gap-3">
                <Label htmlFor="email">Email*</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  defaultValue={editingAdmin?.email}
                  placeholder="Email"
                />
              </div>
              <div className="grid w-full items-center gap-3">
                <Label htmlFor="companyId">Kompaniya ID*</Label>
                <Input
                  type="number"
                  min="0"
                  id="companyId"
                  value="1"
                  name="companyId"
                  readOnly
                  placeholder="ID yozing"
                />
              </div>

              <Button disabled={editLoading} type="submit">
                {editLoading ? (
                  <>
                    <RefreshCcw className="animate-spin" /> Tahrirlanmoqda...
                  </>
                ) : (
                  <>
                    <Edit2 /> Tahrirlash
                  </>
                )}
              </Button>
            </form>
          </DrawerContent>
        </Drawer>
      </>
    );
  } else {
    return <Navigate to={"/login"} />;
  }
}
