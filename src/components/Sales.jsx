import { Rocket } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEffect, useState } from "react";
import { Spinner } from "./ui/spinner";

const uzbekTranslate = {
  last30: "Oy",
  last7: "Hafta",
  yesterday: "Kecha",
  today: "Bugun",
};

const periods = {
  1: "today",
  2: "yesterday",
  3: "last7",
  4: "last30",
};

export default function Sales() {
  const [p, setP] = useState(4);
  const [sales, setSales] = useState(null);

  // Loadings
  const [salesLoading, setSalesLoading] = useState(false);

  // Read
  async function getSales() {
    let req;
    const token = JSON.parse(localStorage.getItem("user")).accessToken;
    setSalesLoading(true);
    try {
      req = await fetch(
        import.meta.env.VITE_BASE_URL +
          `/api/v1/dashboard/stats?projectId=1&&filter=${periods[p]}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
    } catch {
      toast.error("Tizimda nosozlik!");
    }

    if (req) {
      if (req.status === 200) {
        const data = await req.json();

        setSales(data);
      } else {
        toast.error("Xatolik yuz berdi qayta urunib ko'ring!");
      }
    }

    setSalesLoading(false);
  }

  useEffect(() => {
    getSales();
  }, [p]);

  function handleChange(v) {
    setP(v);
  }

  return (
    <div className="border relative px-3 py-6 rounded gap-5 select-none w-full">
      <h3 className="absolute left-5 top-0 -translate-y-2/4 bg-background font-bold px-2 flex gap-2 z-50">
        <Rocket /> Holat
      </h3>
      <div className="mb-6 w-full">
        <Slider
          value={[p]}
          onValueChange={([v]) => {
            if (v === 0) handleChange(1);
            else handleChange(v);
          }}
          max={4}
          step={1}
          className="w-full mb-4"
        />
        <ToggleGroup
          className="w-full"
          size={"sm"}
          type="single"
          variant="outline"
          onValueChange={(v) => {
            handleChange(+v);
          }}
          value={p.toString()}
        >
          {Object.entries(periods).map(([k, v]) => {
            return (
              <ToggleGroupItem value={k} className={"w-[25%]"}>
                {uzbekTranslate[v]}
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      </div>
      <div className="flex flex-col gap-2 relative">
        {salesLoading && (
          <div className="absolute inset-0 bg-slate-900/5 z-40 flex items-center justify-center">
            <Spinner />
          </div>
        )}
        <div className="border p-2 w-full rounded bg-primary/2">
          <div className="flex items-center gap-1 mb-2">
            <span className="text-muted-foreground text-xs">Mijozlar</span>
          </div>
          <h4 className="text-lg font-mono font-medium">
            {sales ? sales.totalCustomers : "----"}
          </h4>
        </div>
        <div className="flex gap-2">
          <div className="border p-2 w-full rounded bg-primary/2">
            <div className="flex items-center gap-1 mb-2">
              <span className="text-muted-foreground text-xs">Sotuvlar</span>
            </div>
            <h4 className="text-lg font-mono font-medium">
              {sales ? sales.totalSales : "----"}
            </h4>
          </div>
          <div className="border p-2 w-full rounded bg-primary/2">
            <div className="flex items-center gap-1 mb-2">
              <span className="text-muted-foreground text-xs">Bronlar</span>
            </div>
            <h4 className="text-lg font-mono font-medium">
              {sales ? sales.totalBookings : "----"}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}
