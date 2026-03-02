import { Search, XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Badge } from '../components/ui/badge'
import { buttonVariants } from '../components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../components/ui/tooltip'
import { useAppStore } from '../zustand'

import { useLoadingBar } from 'react-top-loading-bar'
import HomeDetails from '../components/HomeDetails'
import { formatNumber } from '../lib/utils'

const statuses = {
  SOLD: 'bg-red-500',
  RESERVED: 'bg-yellow-500',
  EMPTY: 'bg-green-500',
  NOT: 'bg-slate-400',
}

const uzebekTranslate = {
  SOLD: 'Sotilgan',
  RESERVED: 'Bron qilingan',
  EMPTY: "Bo'sh",
  NOT: 'Sotilmaydi',
}

export default function TjmDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAppStore()
  const [home, setHome] = useState(null)

  // Errors

  const [notFound, setNotFound] = useState(null)
  const [error, setError] = useState(null)

  // Loadings
  const [getLoading, setGetLoading] = useState(false)
  const { start, complete } = useLoadingBar({
    color: '#5ea500',
    height: 3,
  })

  // API
  async function get() {
    start()
    let req
    const token = JSON.parse(localStorage.getItem('user')).accessToken
    setGetLoading(true)
    try {
      req = await fetch(
        import.meta.env.VITE_BASE_URL + `/api/v1/projects/${id}/structure`,
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
        const data = await req.json()

        setHome(data)
      } else if (req.status === 404 || req.status === 400) {
        setNotFound(true)
      } else {
        setError("Xatolik yuz berdi qayta urunib ko'ring!")
      }
    }

    complete()
    setGetLoading(false)
  }

  useEffect(() => {
    get()
  }, [])

  function handleActiveHome(id) {
    navigate(`?details=${id}`)
  }

  if (user) {
    if (getLoading) {
      return (
        <div className="bg-background fixed z-50 flex h-full w-full items-center justify-center">
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
              Bunday turar joy majmuosi mavjud emas!
            </p>
            <Link
              className={buttonVariants({ variant: 'secondary' })}
              to={'/tjm'}
            >
              <Search /> Mavjud turar joylar
            </Link>
          </div>
        </div>
      )
    }

    return (
      home && (
        <section className="animate-fade-in flex h-full max-h-screen w-full flex-col">
          {/* Back  */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                className={`${buttonVariants({
                  size: 'icon',
                  variant: 'destructive',
                })} fixed top-0 right-0 z-50 rounded-none`}
                to={'/tjm'}
              >
                <XIcon />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Oynani yopish</p>
            </TooltipContent>
          </Tooltip>

          {/* Parts */}
          <section className="h-full w-full">
            <div className="flex h-30 w-full flex-col">
              <div className="mt-auto flex items-center justify-between p-3">
                <div className="flex gap-3">
                  {Object.entries(statuses).map(([key, value]) => {
                    return (
                      <Badge className={`text-primary-foreground ${value}`}>
                        {uzebekTranslate[key]}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="flex h-[calc(100%-120px)] w-full overflow-hidden">
              <div className="no-scrollbar h-full w-full overflow-auto">
                <div className="bg-background sticky top-0 z-10 mx-10 mb-10 flex min-w-max gap-20">
                  {Object.keys(home?.blocks).map((b) => {
                    return (
                      <div className="text-muted-foreground bg-background sticky left-10 w-58 p-1 text-xs">
                        <h3>{b}</h3>
                      </div>
                    )
                  })}
                </div>
                <div className="flex min-w-max flex-col">
                  {Array.from(
                    { length: home.maxFloor },
                    (_, index) => index + 1,
                  ).map((_, index, arr) => {
                    return (
                      <div className="hover:bg-accent group relative flex min-h-10 w-full cursor-pointer transition-colors">
                        {/* CHAP STICKY */}
                        <div className="text-muted-foreground bg-background group-hover:bg-primary sticky left-0 z-20 flex w-10 items-center justify-center text-center text-xs">
                          <span className="group-hover:text-primary-foreground transition-transform group-hover:scale-150 group-hover:font-bold">
                            {arr.length - index}
                          </span>
                        </div>

                        {/* CONTENT */}
                        <div className="flex gap-20">
                          {Object.keys(home?.blocks).map((b) => {
                            return (
                              arr.length - index <= home?.blocks[b].floor && (
                                <div className="flex gap-2">
                                  {home?.blocks[b].appartment[index].map(
                                    (h) => {
                                      return (
                                        <Tooltip>
                                          <TooltipTrigger
                                            className="focus-within:outline-none"
                                            tabIndex="-1"
                                          >
                                            <div
                                              onClick={() => {
                                                handleActiveHome(h.id)
                                              }}
                                              className={`flex min-h-8 min-w-8 shrink-0 items-center justify-center rounded border-5 border-transparent text-sm leading-none font-bold text-white transition-colors duration-400 ${
                                                statuses[h.status]
                                              } ${
                                                h.id ==
                                                new URL(
                                                  location.href,
                                                ).searchParams.get('details')
                                                  ? 'border-destructive! shadow'
                                                  : ''
                                              }`}
                                            >
                                              {h.room}
                                            </div>
                                          </TooltipTrigger>
                                          <TooltipContent
                                            className={'pointer-events-none'}
                                          >
                                            <div className="flex flex-col">
                                              <div className="flex gap-1">
                                                <h4 className="font-bold">
                                                  Uy raqami:
                                                </h4>
                                                <span className="font-mono">
                                                  #{h.houseNumber}
                                                </span>
                                              </div>
                                              <div className="flex gap-1">
                                                <h4 className="font-bold">
                                                  Narxi:
                                                </h4>
                                                <span className="font-mono">
                                                  {formatNumber(
                                                    h.price * h.size,
                                                  )}
                                                </span>
                                              </div>
                                              <div className="flex gap-1">
                                                <h4 className="font-bold">
                                                  m<sup>2</sup>:
                                                </h4>
                                                <span className="font-mono">
                                                  {formatNumber(h.price)}
                                                </span>
                                              </div>
                                            </div>
                                          </TooltipContent>
                                        </Tooltip>
                                      )
                                    },
                                  )}
                                </div>
                              )
                            )
                          })}
                        </div>

                        {/* O'NG STICKY */}
                        <div className="text-muted-foreground bg-background group-hover:bg-primary sticky right-0 z-20 ml-auto flex w-10 items-center justify-center text-center text-xs">
                          <span className="group-hover:text-primary-foreground transition-transform group-hover:scale-150 group-hover:font-bold">
                            {arr.length - index}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <HomeDetails />
            </div>
          </section>
        </section>
      )
    )
  } else {
    return <Navigate to={'/login'} />
  }
}
