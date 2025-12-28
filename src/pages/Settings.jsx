import { Navigate } from "react-router-dom";
import { useAppStore } from "../lib/zustand";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { useEffect, useState } from "react";

export default function Settings() {
  const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");
  const { user } = useAppStore();

  function handleChange() {
    setDark(!dark);
  }

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  if (user) {
    return (
      <section className="h-full animate-fade-in">
        <h2 className="mb-5 font-bold text-3xl">Sozlamalar</h2>
        <div>
          <div className="flex items-center space-x-2">
            <Switch
              onCheckedChange={handleChange}
              defaultChecked={dark}
              id="dark-mode"
            />
            <Label htmlFor="dark-mode">Qorong'u rejim</Label>
          </div>
        </div>
      </section>
    );
  } else {
    return <Navigate to={"/login"} />;
  }
}
