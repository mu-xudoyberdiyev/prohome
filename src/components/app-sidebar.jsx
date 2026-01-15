import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { useAppStore } from "../lib/zustand";
import { Button, buttonVariants } from "./ui/button";
import { BrickWall, Building2, HomeIcon, LogOut, User } from "lucide-react";
import { toast } from "sonner";

const routes = {
  SUPERADMIN: [
    { url: "/", text: "Bosh sahifa", icon: <HomeIcon /> },
    { url: "/company", text: "Kompaniyalar", icon: <Building2 /> },
    { url: "/admin", text: "Adminlar", icon: <User /> },
    { url: "/rop", text: "Boshqaruvchilar", icon: <User /> },
    { url: "/salesmanager", text: "Sotuv menejerlari", icon: <User /> },
    { url: "/tjm", text: "TJM", icon: <BrickWall /> },
  ],
  ADMIN: [
    { url: "/", text: "Bosh sahifa", icon: <HomeIcon /> },
    { url: "/company", text: "Kompaniyalar", icon: <Building2 /> },
    { url: "/rop", text: "Boshqaruvchilar", icon: <User /> },
    { url: "/salesmanager", text: "Sotuv menejerlari", icon: <User /> },
    { url: "/tjm", text: "TJM", icon: <BrickWall /> },
  ],
  ROP: [
    { url: "/", text: "Bosh sahifa", icon: <HomeIcon /> },
    { url: "/salesmanager", text: "Sotuv menejerlari", icon: <User /> },
    { url: "/tjm", text: "TJM", icon: <BrickWall /> },
  ],
  SALESMANAGER: [
    { url: "/", text: "Bosh sahifa", icon: <HomeIcon /> },
    { url: "/tjm", text: "TJM", icon: <BrickWall /> },
  ],
};

export function AppSidebar({ ...props }) {
  const { user, setUser } = useAppStore();
  const currentPath = useLocation().pathname;

  function handleLogout() {
    const check = confirm("Tizimni tark etishni istaysiz-mi?");
    if (check) {
      setUser(null);
      toast.info("Tizimdan chiqdingiz!");
    }
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link className="inline-flex items-center gap-3" to={"/"}>
          <img
            className="w-10 h-10 object-center object-cover inline-flex rounded shadow"
            src="/logo.png"
            alt="Logo"
          />
          <strong className="font-medium">{user?.role}</strong>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <div className="h-full p-2 flex flex-col">
          {user &&
            routes[user.role].map(({ url, text, icon }, index) => {
              return (
                <Link
                  className={`${buttonVariants({
                    variant: "ghost",
                  })} justify-start ${
                    url === currentPath
                      ? "bg-accent text-accent-foreground dark:bg-accent/50"
                      : ""
                  }`}
                  key={index}
                  to={url}
                >
                  {icon}
                  {text}
                </Link>
              );
            })}
          <Button
            onClick={handleLogout}
            className="w-full mt-auto"
            variant="outline"
          >
            <LogOut /> Chiqish
          </Button>
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
