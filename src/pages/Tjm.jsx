import { ArrowLeft, ArrowRight, Folder, FolderOpen } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useLoadingBar } from 'react-top-loading-bar'
import { buttonVariants } from '../components/ui/button'
import { useAppStore } from '../zustand'

export default function Tjm() {
  const { user } = useAppStore()
  const navigate = useNavigate()

  const [projects, setProjects] = useState([])
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
      req = await fetch(import.meta.env.VITE_BASE_URL + `/api/v1/projects`, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
    } catch {
      setError('Tizimda nosozlik!')
    }

    if (req) {
      if (req.status === 200) {
        const data = await req.json()
        console.log(data)

        setProjects(data)
      } else {
        setError("Xatolik yuz berdi qayta urunib ko'ring!")
      }
    }

    setGetLoading(false)
    complete()
  }

  function handleClick(slug) {
    navigate(slug)
  }

  useEffect(() => {
    get()
  }, [])

  if (user) {
    if (getLoading) {
      return (
        <div className="bg-background flex h-full w-full items-center justify-center">
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

    return (
      <section className="animate-fade-in h-full">
        <Link
          className={`${buttonVariants({
            size: 'icon',
            variant: 'outline',
          })} bg-background fixed top-5 left-5 rounded-full! shadow`}
          to={'/'}
        >
          <ArrowLeft />
        </Link>

        {projects.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {projects.map(({ name, id }, index) => {
              return (
                <div
                  onClick={() => {
                    handleClick(`/tjm/${id}`)
                  }}
                  className="hover:border-primary group flex cursor-pointer gap-3 rounded border-2 p-3 transition"
                  key={index}
                >
                  <Folder className="animate-fade-in group-hover:hidden" />
                  <FolderOpen className="animate-fade-in hidden group-hover:inline-block" />
                  <p>{name}</p>
                  <ArrowRight className="animate-fade-in ml-auto hidden group-hover:inline-block" />
                </div>
              )
            })}
          </div>
        ) : (
          <div className="animate-fade-in flex h-full w-full items-center justify-center">
            <div className="flex w-full max-w-sm flex-col items-center text-center">
              <img
                className="mb-5 w-50 object-center select-none"
                src="/no-data.svg"
                alt=""
              />
              <p className="mb-5">Hozircha ma'lumot yo'q</p>
            </div>
          </div>
        )}
      </section>
    )
  } else {
    return <Navigate to={'/login'} />
  }
}
