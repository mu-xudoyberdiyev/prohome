import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { GlobeLockIcon, KeyRound, Palette, RefreshCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { getFormData } from '../lib/utils'
import { useAppStore } from '../zustand'

export default function Settings() {
  const [dark, setDark] = useState(localStorage.getItem('theme') === 'dark')
  const { user } = useAppStore()
  const [updateModal, setUpdateModal] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)

  // Update password
  async function updatePasssword(data) {
    const token = JSON.parse(localStorage.getItem('user')).accessToken
    setUpdateLoading(true)
    const req = await fetch(
      import.meta.env.VITE_BASE_URL + '/api/v1/auth/reset-password',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({ ...data, email: user.email }),
      },
    )

    if (req.status === 201) {
      handleUpdateModal()
      toast.success("Parolingiz o'zgartirildi!")
    } else if (req.status === 400) {
      toast.error("Parol eng kamida 6 belgidan iborat bo'lishi kerak!", {
        position: 'top-center',
      })
    } else if (req.status === 404) {
      toast.error("Amaldagi parol nato'g'ri yozilgan!", {
        position: 'top-center',
      })
    } else {
      toast.error("Xatolik yuz berdi, qayta urunib ko'ring!")
    }

    setUpdateLoading(false)
  }

  function handleChange() {
    setDark(!dark)
  }

  function handleSubmit(evt) {
    evt.preventDefault()
    const result = getFormData(evt.currentTarget)

    if (result.oldPassword.trim() === '') {
      toast.info('Amaldagi parolni kiriting!', {
        position: 'top-center',
      })
      evt.currentTarget.oldPassword.focus()
    } else if (result.newPassword.trim() === '') {
      toast.info('Yangi parolni kiriting!', {
        position: 'top-center',
      })
      evt.currentTarget.newPassword.focus()
    } else {
      updatePasssword(result)
    }
  }

  function handleUpdateModal() {
    setUpdateModal(!updateModal)
  }

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  if (user) {
    return (
      <>
        <section className="animate-fade-in h-full">
          <h2 className="mb-10 text-3xl font-bold">Sozlamalar</h2>

          <div className="h-full max-h-96 overflow-y-auto py-3 pr-2">
            {/* Theme  */}
            <div className="relative mb-8 rounded border px-3 py-6">
              <h3 className="bg-background text-muted-foreground absolute top-0 left-5 flex -translate-y-2/4 gap-2 px-2 font-bold">
                <Palette /> Mavzu
              </h3>
              Tez kunda..
            </div>

            {/* Privacy */}
            <div className="relative rounded border px-3 py-6">
              <h3 className="bg-background text-muted-foreground absolute top-0 left-5 flex -translate-y-2/4 gap-2 px-2 font-bold">
                <GlobeLockIcon /> Xavfsizlik
              </h3>

              <Button onClick={handleUpdateModal} variant="secondary">
                <KeyRound /> Parolni yangilash
              </Button>
            </div>
          </div>
        </section>

        {/* Update password modal */}
        <Dialog open={updateModal} onOpenChange={handleUpdateModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Parolni yangilash</DialogTitle>
              <DialogDescription>
                Amaldagi va yangilamoqchi bo'lgan parollaringizni kiriting.
                Yangilash tugmasi bosilganda parol yangilanadi. Keyin siz ushbu
                parol bilan tizimga kirasiz.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid gap-2">
                <Label htmlFor="oldPassword">Amaldagi parol*</Label>
                <Input
                  id="oldPassword"
                  name="oldPassword"
                  type="password"
                  placeholder="********"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newPassword">Yangi parol*</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  placeholder="********"
                />
              </div>
              <Button disabled={updateLoading}>
                {updateLoading ? (
                  <>
                    <RefreshCcw className="animate-spin" /> Yangilanmoqda...
                  </>
                ) : (
                  <>
                    <RefreshCcw /> Yangilash
                  </>
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </>
    )
  } else {
    return <Navigate to={'/login'} />
  }
}
