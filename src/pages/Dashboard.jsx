import { Slider } from '@/components/ui/slider'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Rocket } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Spinner } from '../components/ui/spinner'
import { formatNumber } from '../lib/utils'
import { useAppStore } from '../zustand'

const uzbekTranslate = {
  last30: 'Oy',
  last7: 'Hafta',
  yesterday: 'Kecha',
  today: 'Bugun',
}

const periods = {
  1: 'today',
  2: 'yesterday',
  3: 'last7',
  4: 'last30',
}

export default function Dashboard() {
  const { user } = useAppStore()
  const [p, setP] = useState(4)
  const [sales, setSales] = useState(null)

  // Loadings
  const [salesLoading, setSalesLoading] = useState(false)

  // Read
  async function getSales() {
    let req
    const token = JSON.parse(localStorage.getItem('user')).accessToken
    setSalesLoading(true)
    try {
      req = await fetch(
        import.meta.env.VITE_BASE_URL +
          `/api/v1/dashboard/stats?projectId=1&&filter=${periods[p]}`,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
    } catch {
      toast.error('Tizimda nosozlik!')
    }

    if (req) {
      if (req.status === 200) {
        const data = await req.json()
        console.log(data)

        setSales(data)
      } else {
        toast.error("Xatolik yuz berdi qayta urunib ko'ring!")
      }
    }

    setSalesLoading(false)
  }

  useEffect(() => {
    getSales()
  }, [p])

  function handleChange(v) {
    setP(v)
  }

  if (user) {
    return (
      <section className="animate-fade-in h-full p-2">
        <div className="relative w-full gap-5 rounded border px-3 py-6 select-none">
          <h3 className="bg-background absolute top-0 left-5 z-50 flex -translate-y-2/4 gap-2 px-2 font-bold">
            <Rocket /> Holat
          </h3>

          <div className="mb-6 w-full">
            <Slider
              value={[p]}
              onValueChange={([v]) => {
                if (v === 0) handleChange(1)
                else handleChange(v)
              }}
              max={4}
              step={1}
              className="mb-4 w-full"
            />
            <ToggleGroup
              className="w-full"
              size={'sm'}
              type="single"
              variant="outline"
              onValueChange={(v) => {
                handleChange(+v)
              }}
              value={p.toString()}
            >
              {Object.entries(periods).map(([k, v]) => {
                return (
                  <ToggleGroupItem value={k} className={'w-[25%]'} key={v}>
                    {uzbekTranslate[v]}
                  </ToggleGroupItem>
                )
              })}
            </ToggleGroup>
          </div>
          {/* Sales  */}
          <div className="relative">
            {salesLoading && (
              <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/5">
                <Spinner />
              </div>
            )}

            {sales && (
              <>
                <div className="mb-10 flex w-full overflow-hidden rounded">
                  <div className="w-2/4 bg-green-500 p-2">
                    <div className="mb-2 flex items-center gap-1">
                      <span className="text-primary-foreground text-xs">
                        Sotilgan uylar
                      </span>
                    </div>
                    <h4 className="text-primary-foreground font-mono text-lg font-medium">
                      {formatNumber(sales.totalSalesAmount)} UZS
                    </h4>
                  </div>
                  <div className="w-2/4 bg-red-800/50 p-2">
                    <div className="mb-2 flex items-center gap-1">
                      <span className="text-primary-foreground text-xs">
                        Qolgan uylar
                      </span>
                    </div>
                    <h4 className="text-primary-foreground font-mono text-lg font-medium">
                      {formatNumber(sales.totalEmptyAmount)} UZS
                    </h4>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="bg-primary/2 w-full rounded border p-2">
                    <div className="mb-2 flex items-center gap-1">
                      <span className="text-muted-foreground text-xs">
                        Mijozlar
                      </span>
                    </div>
                    <h4 className="font-mono text-lg font-medium">
                      {sales ? sales.totalCustomers : '----'}
                    </h4>
                  </div>
                  <div className="flex gap-2">
                    <div className="bg-primary/2 w-full rounded border p-2">
                      <div className="mb-2 flex items-center gap-1">
                        <span className="text-muted-foreground text-xs">
                          Sotuvlar
                        </span>
                      </div>
                      <h4 className="font-mono text-lg font-medium">
                        {sales ? sales.totalSales : '----'}
                      </h4>
                    </div>
                    <div className="bg-primary/2 w-full rounded border p-2">
                      <div className="mb-2 flex items-center gap-1">
                        <span className="text-muted-foreground text-xs">
                          Bronlar
                        </span>
                      </div>
                      <h4 className="font-mono text-lg font-medium">
                        {sales ? sales.totalBookings : '----'}
                      </h4>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    )
  } else {
    return <Navigate to={'/login'} />
  }
}
