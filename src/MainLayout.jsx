import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./components/app-sidebar";
import SidebarHeader from "./components/sidebar-header";

export default function MainLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SidebarHeader />
        <main className="h-full w-full overflow-x-auto">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
