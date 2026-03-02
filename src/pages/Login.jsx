import { Label } from "@radix-ui/react-label"
import { Eye, EyeClosed } from "lucide-react"
import { useState } from "react"
import { Navigate } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Spinner } from "../components/ui/spinner"
import { useBoolean } from "../hooks/use-boolean"
import { getFormData } from "../lib/utils"
import { useAppStore } from "../zustand"

export default function Login() {
  const { user, setUser } = useAppStore()
  const [loading, setLoading] = useState(false)

  const [passwordShow, { toggle }] = useBoolean()

  async function login(userData) {
    let req
    setLoading(true)

    try {
      req = await fetch(import.meta.env.VITE_BASE_URL + "/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
    } catch (e) {
      console.log(e)

      toast.error("Tizimda nosozlik, adminga aloqaga chiqing!")
    }

    if (req) {
      if (req.status === 201) {
        const res = await req.json()
        setUser(res)
        toast.success("Tizimga xush kelibsiz!")
      } else if (req.status === 404 || req.status === 400) {
        toast.error("Kiritilgan email yoki parol nato'g'ri")
      } else {
        toast.error("Xatolik yuz berdi, qayta urunib ko'ring!")
      }
    }

    setLoading(false)
  }

  function handleSubmit(evt) {
    evt.preventDefault()
    const userData = getFormData(evt.currentTarget)

    if (userData.email.trim() === "") {
      toast.info("Email kiriting!")
      evt.currentTarget.email.focus()
    } else if (userData.password.trim() === "") {
      toast.info("Parol kiriting!")
      evt.currentTarget.password.focus()
    } else {
      login(userData)
    }
  }

  if (user === null) {
    return (
      <section className="grid h-full min-h-screen grid-cols-1 md:grid-cols-2">
        <div className="bg-accent relative hidden h-full md:flex md:items-center md:justify-center">
          <img className="size-96" src="/login.svg" alt="Login" />
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex h-full items-center justify-center p-5"
        >
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Prohome Admin Panel</CardTitle>
              <CardDescription>
                Prohome loyihasining admin paneliga xush kelibsiz!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    autoComplete={"username"}
                    type="email"
                    placeholder="m@prohome.uz"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Parol</Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      autoComplete={"current-password"}
                      placeholder="********"
                      type={passwordShow ? "text" : "password"}
                    />
                    <Button
                      onClick={toggle}
                      className={"absolute right-0"}
                      size="icon"
                      type="button"
                      variant="ghost"
                    >
                      {passwordShow ? <Eye /> : <EyeClosed />}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button disabled={loading} type="submit" className="w-full">
                <>
                  {loading ? (
                    <>
                      <Spinner />
                      Kirilmoqda...
                    </>
                  ) : (
                    "Kirish"
                  )}
                </>
              </Button>
            </CardFooter>
          </Card>
        </form>
      </section>
    )
  } else {
    return <Navigate to={"/"} />
  }
}
