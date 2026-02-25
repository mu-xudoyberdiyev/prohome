import { Link, Outlet } from "react-router-dom";
import { AppSidebar } from "./components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { buttonVariants } from "./components/ui/button";
import { SettingsIcon } from "lucide-react";

export default function MainLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 top-0 sticky bg-background z-50">
          <SidebarTrigger className="-ml-1" />
          <Link
            className={buttonVariants({ size: "icon-lg", variant: "outline" })}
            to={"/settings"}
          >
            <SettingsIcon />
          </Link>
        </header>
        <main className="p-5 h-full">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
