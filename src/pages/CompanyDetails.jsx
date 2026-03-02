import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  ArrowLeft,
  CircleCheck,
  CircleQuestionMark,
  CircleXIcon,
  Power,
  RefreshCcw,
  Search,
  SearchAlert,
  ShieldAlert,
  Trash,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useLoadingBar } from 'react-top-loading-bar'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Badge } from '../components/ui/badge'
import { Button, buttonVariants } from '../components/ui/button'
import { Input } from '../components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '../components/ui/input-group'
import { Label } from '../components/ui/label'
import { Switch } from '../components/ui/switch'
import { Textarea } from '../components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../components/ui/tooltip'
import { getFormData } from '../lib/utils'
import { useAppStore } from '../zustand'

export default function CompanyDetails() {
  const { user } = useAppStore()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const id = pathname.split('/').at(-1)

  const [details, setDetails] = useState(null)
  const [logo, setLogo] = useState({ file: null, src: null })
  const [notFound, setNotFound] = useState(null)
  const [editMode, setEditMode] = useState(false)

  // Errors
  const [error, setError] = useState(null)

  // Loadings
  const [getLoading, setGetLoading] = useState(false)
  const [statusLoading, setStatusLoading] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const { start, complete } = useLoadingBar({
    color: '#5ea500',
    height: 3,
  })

  // ===== CRUD =====
  async function get(id) {
    start()
    let req
    const token = JSON.parse(localStorage.getItem('user')).accessToken
    setGetLoading(true)
    try {
      req = await fetch(
        import.meta.env.VITE_BASE_URL + `/api/v1/company/one/${id}`,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
    } catch {
      setError('Tizimda nosozlik!')
    }

    if (req) {
      if (req.status === 200) {
        const { data } = await req.json()

        setDetails(data)
        setLogo((prev) => {
          return { ...prev, src: data.logo }
        })
      } else if (req.status === 404 || req.status === 400) {
        setNotFound(true)
      } else {
        setError("Xatolik yuz berdi qayta urunib ko'ring!")
      }
    }

    complete()
    setGetLoading(false)
  }

  async function edit(data) {
    const formData = new FormData()

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value)
    })

    let req
    const token = JSON.parse(localStorage.getItem('user')).accessToken
    setEditLoading(true)
    try {
      req = await fetch(
        import.meta.env.VITE_BASE_URL + `/api/v1/company/${id}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: 'Bearer ' + token,
          },
          body: formData,
        },
      )
    } catch (er) {
      setError('Tizimda nosozlik!')
    }

    if (req) {
      if (req.status === 200) {
        const data = await req.json()

        setLogo((prev) => {
          return { ...prev, src: data.logo }
        })

        toast.success(`${data.name} ma'lumotlari yangilandi!`)
        setDetails(data)
        handleEditMode()
      } else if (req.status === 404) {
        setNotFound(true)
      } else {
        setError("Xatolik yuz berdi qayta urunib ko'ring!")
      }
    }

    setEditLoading(false)
  }

  async function statusChanger() {
    let req
    const token = JSON.parse(localStorage.getItem('user')).accessToken
    setStatusLoading(true)
    try {
      req = await fetch(
        import.meta.env.VITE_BASE_URL + `/api/v1/company/status/${id}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
    } catch {
      setError('Tizimda nosozlik!')
    }

    if (req) {
      if (req.status === 200) {
        const data = await req.json()
        toast.success(
          `${data.name} ${data.status ? 'faollashtirildi' : "to'xtatildi"}!`,
        )
        setDetails(data)
        handleEditMode()
      } else if (req.status === 404 || req.status === 400) {
        setNotFound(true)
      } else {
        setError("Xatolik yuz berdi qayta urunib ko'ring!")
      }
    }

    setStatusLoading(false)
  }

  // Delete
  async function remove(id) {
    let req
    const token = JSON.parse(localStorage.getItem('user')).accessToken
    setDeleteLoading(true)
    try {
      req = await fetch(
        import.meta.env.VITE_BASE_URL + `/api/v1/company/delete/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
    } catch {
      toast.error('Tizimda nosozlik, adminga aloqaga chiqing!')
    }

    if (req) {
      if (req.status === 200) {
        navigate('/company')
        toast.success(`${details.name} kompaniyasi o'chirildi!`)
      } else {
        toast.error(
          "Kompaniyani o'chirishda xatolik yuz berdi qayta urunib ko'ring!",
        )
      }
    }

    setDeleteLoading(false)
  }

  // ===== Functions =====
  function handleError() {
    setError(null)
  }

  function handleEditMode() {
    setEditMode(!editMode)
  }

  function handleStatus() {
    statusChanger()
  }

  function handleImage(file) {
    const src = URL.createObjectURL(file)

    setLogo((prev) => {
      return { ...prev, src, file }
    })
  }

  function handleRemoveImage() {
    setLogo(() => {
      return { src: null, file: null }
    })
  }

  function handleSubmit(evt) {
    evt.preventDefault()
    const data = getFormData(evt.currentTarget)

    function isValidUzPhone(phone) {
      const regex = /^\+998\d{9}$/
      return regex.test(phone)
    }

    if (data.name.trim() === '') {
      toast.info('Kompaniya nomini kiriting!', { position: 'top-right' })
      evt.currentTarget.name.focus()
    } else if (data.phoneNumber.trim() === '') {
      toast.info('Telefon raqamni kiriting!', { position: 'top-right' })
      evt.currentTarget.phoneNumber.focus()
    } else if (isValidUzPhone(`+998${data.phoneNumber.trim()}`) === false) {
      toast.info("Telefon raqam +998xxxxxxxxx formatda bo'lishi kerak!", {
        position: 'top-right',
      })
      evt.currentTarget.phoneNumber.focus()
    } else if (data.managerName.trim() === '') {
      toast.info('Boshqaruvchi ismini kiriting!', {
        position: 'top-right',
      })
      evt.currentTarget.managerName.focus()
    } else if (data.description.trim() === '') {
      toast.info('Kompaniya uchun izoh yozing!', {
        position: 'top-right',
      })
      evt.currentTarget.description.focus()
    } else {
      if (logo.file) {
        data.logo = logo.file
      } else {
        data.logo = null
      }
      data.phoneNumber = '+998' + data.phoneNumber

      edit(data)
    }
  }

  function handleDelete() {
    remove(id)
  }

  useEffect(() => {
    get(id)
  }, [id, error])

  if (user) {
    if (getLoading) {
      return (
        <div className="bg-background absolute inset-0 z-50 flex h-full w-full items-center justify-center">
          <div className="flex animate-pulse items-center gap-4">
            <img
              className="h-20 w-20 rounded shadow"
              src="/logo.png"
              aria-hidden={true}
            />
            <p className="text-xl">prohome.uz</p>
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="animate-fade-in flex h-full w-full items-center justify-center">
          <div className="flex w-full max-w-sm flex-col">
            <h3 className="mb-3 text-2xl font-medium">{error}</h3>
            <p className="text-muted-foreground mb-5">
              Havotirlanmang, barchasi joyida. Ba'zida shunday xatoliklar ham
              bo'lib turadi. Agar bu davomli bo'lsa, admin bilan aloqaga chiqing
            </p>
            <Button onClick={handleError} variant="secondary">
              <SearchAlert /> Qayta urunib ko'rish
            </Button>
          </div>
        </div>
      )
    }

    if (notFound) {
      return (
        <div className="animate-fade-in flex h-full w-full items-center justify-center">
          <div className="tex-center flex w-full max-w-sm flex-col items-center">
            <h3 className="mb-3 text-2xl font-medium">404</h3>
            <p className="text-muted-foreground mb-5">
              Bunday kompaniya mavjud emas!
            </p>
            <Link
              className={buttonVariants({ variant: 'secondary' })}
              to={'/company'}
            >
              <Search /> Mavjud kompaniyalar
            </Link>
          </div>
        </div>
      )
    }

    return (
      details && (
        <section className="animate-fade-in h-full">
          <div className="mb-10 flex items-center justify-between">
            <Link
              className={`${buttonVariants({ variant: 'outline' })}`}
              to={'/company'}
            >
              <ArrowLeft />
              Orqaga
            </Link>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-mode"
                checked={editMode}
                defaultChecked={editMode}
                onCheckedChange={handleEditMode}
              />
              <Label htmlFor="edit-mode">O'zgartirish</Label>
            </div>
          </div>

          <div className="relative mb-4 rounded border px-3 py-6">
            <h3 className="bg-background text-muted-foreground absolute top-0 left-5 flex -translate-y-2/4 gap-2 px-2 font-bold">
              <ShieldAlert /> Muhim harakatlar
            </h3>
            <div className="flex items-center justify-between">
              {statusLoading === false && (
                <Badge
                  className={`animate-fade-in ${
                    details.status === false ? 'bg-background' : ''
                  }`}
                  variant={details.status ? 'default' : 'outline'}
                >
                  {details.status ? (
                    <>
                      <CircleCheck /> Faol
                    </>
                  ) : (
                    <>
                      <CircleXIcon /> To'xtagan
                    </>
                  )}
                </Badge>
              )}
              {statusLoading && (
                <p>
                  {details.status
                    ? "To'xtatilmoqda..."
                    : 'Faollashtirilmoqda...'}
                </p>
              )}
              <div className="flex gap-3">
                <Button
                  onClick={handleStatus}
                  disabled={editMode === false || statusLoading || editLoading}
                  variant={details.status ? 'secondary' : 'default'}
                >
                  <Power /> {details.status ? "To'xtatish" : 'Faollashtirish'}
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      disabled={deleteLoading || editLoading || statusLoading}
                      variant="destructive"
                    >
                      {deleteLoading ? (
                        <>
                          <RefreshCcw className="animate-spin" />
                          O'chirilmoqda...
                        </>
                      ) : (
                        <>
                          <Trash />
                          O'chirish
                        </>
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Rostan ham{' '}
                        <span className="font-mono">{details?.name}</span>{' '}
                        kompaniyasini o'chirib yubormoqchimisiz?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Yaxshilab o'ylab ko'ring, bu jarayonni ortga qaytarish
                        imkonsiz!
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Yo'q</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>
                        Ha
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button className={'mb-4'} variant="ghost" size="icon-sm">
                <CircleQuestionMark />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>
                O'zgartirishlar inobatga olinishi uchun "Saqlash" tugmasini
                bosing. <br /> Kompaniya holatini o'zgartirish uchun "Saqlash"
                tugmasini bosish talab etilmaydi.
              </p>
            </TooltipContent>
          </Tooltip>

          <div className="flex items-start gap-10">
            <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-lg">
              <Avatar className="h-full w-full rounded-lg">
                <AvatarImage
                  src={
                    logo.src?.startsWith('blob:')
                      ? logo.src
                      : `${import.meta.env.VITE_BASE_URL}/api/v1/${logo.src}`
                  }
                  alt={details.name[0]}
                />
                <AvatarFallback className={'rounded-lg uppercase select-none'}>
                  {<span className="text-5xl">{details.name[0]}</span>}
                </AvatarFallback>
              </Avatar>
              {editMode && (
                <div
                  className={`animate-fade-in absolute inset-0 z-10 flex bg-black/50 ${
                    editLoading ? 'pointer-events-none opacity-80' : ''
                  }`}
                >
                  {typeof logo.src === 'string' && (
                    <div
                      onClick={handleRemoveImage}
                      className="group flex h-full w-full cursor-pointer items-center justify-center"
                    >
                      <Trash className="group-hover:text-destructive h-10 w-10 text-white" />
                    </div>
                  )}
                  <label
                    className="group inline-flex h-full w-full cursor-pointer items-center justify-center"
                    htmlFor="image"
                  >
                    <RefreshCcw className="h-10 w-10 text-white group-hover:opacity-80" />
                    <input
                      className="hidden"
                      onChange={(evt) => {
                        if (evt.target.files.length > 0) {
                          handleImage(evt.target.files[0])
                        }
                      }}
                      id="image"
                      type="file"
                      accept="image/*"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Form  */}
            <form
              onSubmit={handleSubmit}
              className="relative flex w-full flex-col"
            >
              <div className="grid w-full grid-cols-2 gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="name">Kompaniya nomi*</Label>
                  <Input
                    className={'w-full'}
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Kompaniya nomini kiriting"
                    defaultValue={details.name}
                    disabled={
                      editMode === false || editLoading || statusLoading
                    }
                  />
                </div>
                <div className="grid w-full gap-2">
                  <Label htmlFor="managerName">Boshqaruvchi*</Label>
                  <Input
                    id="managerName"
                    name="managerName"
                    type="text"
                    placeholder="Boshqaruvchi ismini kiriting"
                    defaultValue={details.managerName}
                    disabled={
                      editMode === false || editLoading || statusLoading
                    }
                  />
                </div>
                <div className="col-start-1 col-end-3 grid w-full gap-2">
                  <Label htmlFor="phoneNumber">Telefon raqami*</Label>

                  <InputGroup>
                    <InputGroupInput
                      className="pl-1!"
                      id="phoneNumber"
                      name="phoneNumber"
                      type="text"
                      placeholder="xxxxxxx"
                      defaultValue={details.phoneNumber.replace('+998', '')}
                      disabled={
                        editMode === false || editLoading || statusLoading
                      }
                    />
                    <InputGroupAddon>
                      <InputGroupText>+998</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </div>

                <div className="col-start-1 col-end-3 grid w-full gap-3">
                  <Label htmlFor="description">Izoh*</Label>
                  <Textarea
                    className={'max-h-16'}
                    placeholder="Kompaniya haqida izoh yozing"
                    id="description"
                    name="description"
                    defaultValue={details.description}
                    disabled={
                      editMode === false || editLoading || statusLoading
                    }
                  />
                </div>
              </div>

              {editMode && (
                <div className="animate-fade-in absolute right-0 -bottom-5 flex translate-y-full gap-3">
                  <Button
                    onClick={handleEditMode}
                    variant="outline"
                    type="button"
                    disabled={editLoading || statusLoading}
                  >
                    Bekor qilish
                  </Button>
                  <Button disabled={editLoading || statusLoading} type="submit">
                    {editLoading ? (
                      <>
                        <RefreshCcw className="animate-spin" />
                        Saqlanmoqda...
                      </>
                    ) : (
                      <>Saqlash</>
                    )}
                  </Button>
                </div>
              )}
            </form>
          </div>
        </section>
      )
    )
  } else {
    return <Navigate to={'/login'} />
  }
}
