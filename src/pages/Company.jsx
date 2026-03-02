import {
  ArrowRight,
  CircleCheck,
  CircleXIcon,
  Plus,
  PlusCircleIcon,
  SearchAlert,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useLoadingBar } from 'react-top-loading-bar'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { useAppStore } from '../zustand'

export default function Company() {
  const { user } = useAppStore()
  const navigate = useNavigate()

  const [companies, setCompanies] = useState([])

  // Errors
  const [error, setError] = useState(null)

  // Loadings
  const [getLoading, setGetLoading] = useState(false)
  const { start, complete } = useLoadingBar({
    color: '#5ea500',
    height: 3,
  })

  // ======= CRUD =======
  // Read
  async function get() {
    start()
    let req
    const token = JSON.parse(localStorage.getItem('user')).accessToken
    setGetLoading(true)
    try {
      req = await fetch(import.meta.env.VITE_BASE_URL + `/api/v1/company/all`, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
    } catch {
      setError('Tizimda nosozlik!')
    }

    if (req) {
      if (req.status === 200) {
        const { data } = await req.json()

        setCompanies(data)
      } else {
        setError("Xatolik yuz berdi qayta urunib ko'ring!")
      }
    }

    setGetLoading(false)
    complete()
  }

  // ===== Funtions =====
  function handleError() {
    setError(null)
  }

  function handleAdd() {
    navigate('/add/company')
  }

  function handleClick(id) {
    navigate(`/company/${id}`)
  }

  useEffect(() => {
    get()
  }, [error])

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

    return companies.length > 0 ? (
      <section className="animate-fade-in h-full">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Kompaniyalar</h2>
          <Button onClick={handleAdd} variant="secondary">
            <PlusCircleIcon />
            Qo'shish
          </Button>
        </div>
        <div className="grid h-[60vh] grid-cols-2 place-content-start items-start gap-5">
          {companies.map(({ id, name, logo, status }) => {
            return (
              <div
                className="group relative flex cursor-pointer items-center gap-5 rounded-sm p-4 text-center shadow"
                onClick={() => {
                  handleClick(id)
                }}
                key={id}
              >
                <Avatar className="shadow">
                  <AvatarImage
                    src={
                      logo && `${import.meta.env.VITE_BASE_URL}/api/v1/${logo}`
                    }
                    alt={name}
                  />
                  <AvatarFallback className="uppercase">
                    {name[0]}
                  </AvatarFallback>
                </Avatar>
                <h2>{name}</h2>
                <Badge
                  className={`absolute top-0 right-5 -translate-y-2/4 ${
                    status === false ? 'bg-background' : ''
                  }`}
                  variant={status ? 'default' : 'outline'}
                >
                  {status ? (
                    <>
                      <CircleCheck /> Faol
                    </>
                  ) : (
                    <>
                      <CircleXIcon /> To'xtagan
                    </>
                  )}
                </Badge>
                <ArrowRight className="ml-auto opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            )
          })}
        </div>
      </section>
    ) : (
      <div className="animate-fade-in flex h-full w-full items-center justify-center">
        <div className="flex w-full max-w-sm flex-col items-center text-center">
          <img
            className="mb-5 w-50 object-center select-none"
            src="/no-data.svg"
            alt=""
          />
          <p className="mb-5">Hozircha ma'lumot yo'q</p>
          <Button onClick={handleAdd} variant="secondary">
            <Plus /> Qo'shish
          </Button>
        </div>
      </div>
    )
  } else {
    return <Navigate to={'/login'} />
  }
}
