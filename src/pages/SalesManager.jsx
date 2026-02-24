import {
  Edit,
  Edit2,
  PlusCircle,
  PlusCircleIcon,
  RefreshCcw,
  SearchAlert,
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
import {
  NativeSelect,
  NativeSelectOption,
} from "../components/ui/native-select";
import { getFormData } from "../lib/utils";
import { toast } from "sonner";
import { useEffect, useReducer, useState } from "react";
import { Skeleton } from "../components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../components/ui/tooltip";

const initialState = {
  addModal: false,
  editModal: false,
  salesManagers: [],
  companies: [],
  error: null,
  getLoading: false,
  addLoading: false,
  editLoading: false,
  removeLoading: false,
  companiesLoading: false,
  deletingSalesManager: null,
  editingSalesManager: null,
};

// function
function reducerFunction(state, { action, payload }) {
  if (action === "COMPANIES_LOADING") {
    return { ...state, companiesLoading: payload };
  }
  if (action === "COMPANIES") {
    return { ...state, companies: payload };
  }
  if (action === "ERROR") {
    return { ...state, error: payload };
  }
  if (action === "ADD_LOADING") {
    return { ...state, addLoading: payload };
  }
  if (action === "GET_LOADING") {
    return { ...state, getLoading: payload };
  }
  if (action === "SALES_MANAGER") {
    return { ...state, salesManagers: payload };
  }
  if (action === "EDIT_LOADING") {
    return { ...state, editLoading: payload };
  }
  if (action === "REMOVE_LOADING") {
    return { ...state, removeLoading: payload };
  }
  if (action === "DELETING_SALES_MANAGER") {
    return { ...state, deletingSalesManager: payload };
  }
  if (action === "EDITING_SALES_MANAGER") {
    return { ...state, editingSalesManager: payload };
  }
  if (action === "ADD_MODAL") {
    return { ...state, addModal: payload };
  }
  if (action === "EDIT_MODAL") {
    return { ...state, editModal: payload };
  }

  return state;
}

export default function SalesManager() {
  const { user } = useAppStore();

  const [state, dispach] = useReducer(reducerFunction, initialState);

  // Distructuring
  const {
    addModal,
    editModal,
    salesManagers,
    companies,
    error,
    getLoading,
    addLoading,
    editLoading,
    removeLoading,
    companiesLoading,
    deletingSalesManager,
    editingSalesManager,
  } = state;
  // ======= CRUD =======

  async function getCompanies() {
    let req;
    const token = JSON.parse(localStorage.getItem("user")).accessToken;
    dispach({ action: "COMPANIES_LOADING", payload: true });
    try {
      req = await fetch(import.meta.env.VITE_BASE_URL + `/api/v1/company/all`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
    } catch {
      dispach({ action: "ERROR", payload: "Tizimda nosozlik!" });
    }

    if (req) {
      if (req.status === 200) {
        const { data } = await req.json();

        dispach({ action: "COMPANIES", payload: data });
      } else {
        dispach({
          action: "ERROR",
          payload: "Xatolik yuz berdi qayta urunib ko'ring!",
        });
      }
    }

    dispach({ action: "COMPANIES_LOADING", payload: false });
  }
  // Create
  async function add(data) {
    let req;
    const token = JSON.parse(localStorage.getItem("user")).accessToken;

    dispach({ action: "ADD_LOADING", payload: true });
    try {
      req = await fetch(
        import.meta.env.VITE_BASE_URL + "/api/v1/user/sales-manager",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify(data),
        }
      );
    } catch {
      toast.error("Tizimda nosozlik, adminga aloqaga chiqing!", {
        position: "top-center",
      });
    }

    if (req) {
      if (req.status === 201) {
        const { safeSalesManager } = await req.json();
        dispach({
          action: "SALES_MANAGER",
          payload: [safeSalesManager, ...state.salesManagers],
        });

        handleAddModal();

        toast.success(`${safeSalesManager.email} qo'shildi!`, {
          position: "top-center",
        });
      } else if (req.status === 409) {
        toast.error("Bu email bilan sotuv operatori ro'yhatdan o'tgan!", {
          position: "top-center",
        });
      } else {
        toast.error("Xatolik yuz berdi, qayta urunib ko'ring!", {
          position: "top-center",
        });
      }
    }

    dispach({ action: "ADD_LOADING", payload: false });
  }

  // Read
  async function get() {
    let req;
    const token = JSON.parse(localStorage.getItem("user")).accessToken;

    dispach({ action: "GET_LOADING", payload: true });
    try {
      req = await fetch(
        import.meta.env.VITE_BASE_URL + `/api/v1/user/all/sales-manager`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
    } catch {
      dispach({ action: "ERROR", payload: "Tizimda nosozlik!" });
    }

    if (req) {
      if (req.status === 200) {
        const { safeUsers } = await req.json();

        dispach({ action: "SALES_MANAGER", payload: safeUsers });
      } else {
        dispach({
          action: "ERROR",
          payload: "Xatolik yuz berdi, qayta urunib ko'ring!",
        });
      }
    }

    dispach({ action: "GET_LOADING", payload: false });
  }

  // Update
  async function edit(data) {
    let req;
    const token = JSON.parse(localStorage.getItem("user")).accessToken;

    dispach({ action: "EDIT_LOADING", payload: true });
    try {
      req = await fetch(
        import.meta.env.VITE_BASE_URL +
          `/api/v1/user/update-sales-manegar/${editingSalesManager.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify(data),
        }
      );
    } catch {
      toast.error("Tizimda nosozlik, adminga aloqaga chiqing!", {
        position: "top-center",
      });
    }

    if (req) {
      if (req.status === 200) {
        const { safeSalesManager } = await req.json();

        const result = salesManagers.map((rop) => {
          if (rop.id === editingSalesManager.id) {
            return safeSalesManager;
          } else {
            return rop;
          }
        });

        dispach({ action: "SALES_MANAGER", payload: result });

        handleEditModal();

        toast.success(`${safeSalesManager.email} yangilandi!`, {
          position: "top-center",
        });
      } else if (req.status === 409) {
        toast.error("Bu email bilan sotuv operatori ro'yhatdan o'tgan!", {
          position: "top-center",
        });
      } else {
        toast.error("Xatolik yuz berdi, qayta urunib ko'ring!", {
          position: "top-center",
        });
      }
    }

    dispach({ action: "EDIT_LOADING", payload: false });
  }

  // Delete
  async function remove(id) {
    let req;
    const token = JSON.parse(localStorage.getItem("user")).accessToken;

    dispach({ action: "REMOVE_LOADING", payload: true });
    try {
      req = await fetch(
        import.meta.env.VITE_BASE_URL +
          `/api/v1/user/remove-sales-maneger/${id}`,
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
        const result = salesManagers.filter((sm) => sm.id !== id);

        dispach({ action: "SALES_MANAGER", payload: result });
        toast.success(`${deletingSalesManager.email} o'chirildi!`);
      } else {
        toast.error(
          "Boshqaruvchini o'chirishda xatolik yuz berdi qayta urunib ko'ring!"
        );
      }
    }

    dispach({ action: "REMOVE_LOADING", payload: false });

    dispach({ action: "DELETING_SALES_MANAGER", payload: null });
  }

  // ===== Funtions =====
  function handleAddSubmit(evt) {
    evt.preventDefault();
    const result = getFormData(evt.currentTarget);

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
    } else if ("companyId" in result === false) {
      evt.currentTarget.companyId.focus();
      toast.info("Kompaniyani tanlang!", {
        position: "top-center",
      });
    } else {
      result.companyId = Number(result.companyId);
      add(result);
    }
  }

  function handleEditSubmit(evt) {
    evt.preventDefault();
    const result = getFormData(evt.currentTarget);

    if (result.email.trim() === "") {
      evt.currentTarget.email.focus();
      toast.info("Email kiriting!", { position: "top-center" });
    } else {
      edit(result);
    }
  }

  function handleAddModal() {
    dispach({ action: "ADD_MODAL", payload: !addModal });
  }

  function handleEditModal() {
    dispach({ action: "EDIT_MODAL", payload: !editModal });
  }

  function handleDelete(id) {
    const foundSalesManager = salesManagers.find((sm) => sm.id === id);

    dispach({ action: "DELETING_SALES_MANAGER", payload: null });
    const check = confirm(
      `Rostan ham <${foundSalesManager.email}> ni o'chirib yubormoqchimisiz? Keyin bu operatsiyani orqaga qaytarib bo'lmaydi!`
    );

    if (check) {
      remove(id);
    }
  }

  function handleEdit(id) {
    const foundSalesManager = salesManagers.find((sm) => sm.id === id);

    dispach({ action: "EDITING_SALES_MANAGER", payload: foundSalesManager });

    handleEditModal();
  }

  function handleError() {
    dispach({ action: "ERROR", payload: null });
  }

  useEffect(() => {
    get();
    getCompanies();
  }, []);

  // ====== Render ======
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

    return (
      <>
        {salesManagers.length > 0 ? (
          <section className="h-full animate-fade-in">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-bold text-3xl">Sotuv operatorlari</h2>

              <Button onClick={handleAddModal} variant="secondary">
                <PlusCircleIcon />
                Qo'shish
              </Button>
            </div>

            <div className="flex flex-col w-full gap-4 h-full max-h-75 overflow-y-auto pr-2">
              {salesManagers.map(({ id, email }, index) => {
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
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => {
                              handleEdit(id);
                            }}
                            variant="secondary"
                            size="icon-sm"
                          >
                            <Edit />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Tahrirlash</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => {
                              handleDelete(id);
                            }}
                            disabled={
                              deletingSalesManager?.id === id && removeLoading
                            }
                            variant="destructive"
                            size="icon-sm"
                          >
                            {deletingSalesManager?.id === id &&
                            removeLoading ? (
                              <RefreshCcw className="animate-spin" />
                            ) : (
                              <Trash />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>O'chirish</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : (
          <div className="w-full h-full flex justify-center items-center animate-fade-in">
            <div className="flex flex-col items-center text-center w-full max-w-sm">
              <h3 className="text-2xl mb-3 font-medium">
                Hali sotuv operatori mavjud emas!
              </h3>
              <p className="text-muted-foreground mb-5">
                Sotuv operatori yaratishni istasangiz "Istayman" tugmasini
                bosing.
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
              <DrawerTitle>Yangi sotuv operatori qo'shish.</DrawerTitle>
              <DrawerDescription>
                Sotuv operatori qo'shish uchun barcha ma'lumotlarni to'ldiring
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
                <Label htmlFor="companyId">Kompaniya*</Label>
                {companiesLoading ? (
                  <Skeleton className={"w-86 h-9"} />
                ) : (
                  <NativeSelect
                    className={"w-86"}
                    id="companyId"
                    name="companyId"
                    defaultValue=""
                  >
                    <NativeSelectOption disabled value="">
                      Kompaniya nomini tanlang
                    </NativeSelectOption>
                    {companies.map(({ name, id }) => {
                      return (
                        <NativeSelectOption value={id} key={id}>
                          {name}
                        </NativeSelectOption>
                      );
                    })}
                  </NativeSelect>
                )}
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
        {editingSalesManager && (
          <Drawer open={editModal} onOpenChange={handleEditModal}>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>
                  <b>{editingSalesManager.email}</b>ni yangilash.
                </DrawerTitle>
                <DrawerDescription>
                  Sotv operatorini yangilashda ham barcha ma'lumotlarni to'liq
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
                    defaultValue={editingSalesManager.email}
                    placeholder="Email"
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
        )}
      </>
    );
  } else {
    return <Navigate to={"/login"} />;
  }
}
