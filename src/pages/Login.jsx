import { Navigate } from "react-router-dom";
import { useAppStore } from "../lib/zustand";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { getFormData } from "../lib/utils";
import { toast } from "sonner";
import { useState } from "react";
import { RefreshCw, Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function Login() {
  const { user, setUser } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function login(userData) {
    let req;
    setLoading(true);

    try {
      req = await fetch(import.meta.env.VITE_BASE_URL + "/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
    } catch (e) {
      console.log(e);
      toast.error("Tizimda nosozlik, adminga aloqaga chiqing!");
    }

    if (req) {
      if (req.status === 201) {
        const res = await req.json();
        setUser(res);
        toast.success("Tizimga xush kelibsiz!");
      } else if (req.status === 404 || req.status === 400) {
        toast.error("Kiritilgan email yoki parol nato'g'ri");
      } else {
        toast.error("Xatolik yuz berdi, qayta urunib ko'ring!");
      }
    }

    setLoading(false);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    const userData = getFormData(evt.currentTarget);

    if (userData.email.trim() === "") {
      toast.info("Email kiriting!");
      evt.currentTarget.email.focus();
    } else if (userData.password.trim() === "") {
      toast.info("Parol kiriting!");
      evt.currentTarget.password.focus();
    } else {
      login(userData);
    }
  }

  if (user === null) {
    return (
      <section className="h-full grid grid-cols-1 md:grid-cols-2 min-h-screen">
        <div className="h-full relative hidden md:block bg-gray-100">
          <video
            className="w-full h-full aspect-square object-cover object-center"
            src="/construction-process.mp4"
            muted
            loop
            autoPlay
          ></video>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-5 h-full flex items-center justify-center bg-white"
        >
          <Card className="w-full max-w-sm shadow-xl border">
            <CardHeader className="space-y-3 pb-5 text-center">
              <div className="flex justify-center">
                <img
                  src="/logo.png"
                  alt="Prohome Logo"
                  className="w-24 h-24 object-contain"
                />
              </div>
              <CardTitle className="text-2xl font-extrabold text-gray-900">
                Prohome Admin Panel
              </CardTitle>
              <CardDescription className="text-gray-600 text-sm">
                Prohome loyihasining admin paneliga xush kelibsiz!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-5">
                <div className="grid gap-2">
                  <Label
                    htmlFor="email"
                    className="text-gray-700 text-sm font-semibold"
                  >
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="m@prohome.uz"
                      defaultValue="superAdmin@gmail.com"
                      className="pl-10 h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label
                    htmlFor="password"
                    className="text-gray-700 text-sm font-semibold"
                  >
                    Parol
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      id="password"
                      name="password"
                      placeholder="********"
                      type={showPassword ? "text" : "password"}
                      defaultValue="superAdmin123"
                      className="pl-10 pr-10 h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2 pt-4">
              <Button
                disabled={loading}
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white h-11 font-semibold text-base shadow-md hover:shadow-lg transition-all"
              >
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Kirilmoqda...
                  </>
                ) : (
                  "Kirish"
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </section>
    );
  } else {
    return <Navigate to={"/"} />;
  }
}
