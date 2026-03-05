import { Badge } from "@/shared/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/widgets/optics/table";

const MOCK_CONTRACTS = [
  {
    id: 1,
    number: "SH-2026-001",
    client: "Abdullayev Jasur",
    project: "Yunusobod Residence",
    amount: 78000,
    manager: "Akbar Nazarov",
    date: "2026-02-11",
    status: "IMZOLANGAN",
  },
  {
    id: 2,
    number: "SH-2026-002",
    client: "Toshmatov Bobur",
    project: "Chilonzor Park",
    amount: 64500,
    manager: "Sherzod Qodirov",
    date: "2026-02-13",
    status: "JARAYONDA",
  },
  {
    id: 3,
    number: "SH-2026-003",
    client: "Karimova Nilufar",
    project: "Sergeli City",
    amount: 92000,
    manager: "Zulfiya Xolmatova",
    date: "2026-02-17",
    status: "TO'LOV KUTILMOQDA",
  },
  {
    id: 4,
    number: "SH-2026-004",
    client: "Rahimov Sanjar",
    project: "Mirzo Ulug'bek Plaza",
    amount: 56000,
    manager: "Akbar Nazarov",
    date: "2026-02-20",
    status: "BEKOR QILINGAN",
  },
  {
    id: 5,
    number: "SH-2026-005",
    client: "Yusupova Feruza",
    project: "Tashkent Hills",
    amount: 102000,
    manager: "Sherzod Qodirov",
    date: "2026-02-24",
    status: "IMZOLANGAN",
  },
  {
    id: 6,
    number: "SH-2026-006",
    client: "Ergasheva Malika",
    project: "Olmazor Premium",
    amount: 73500,
    manager: "Zulfiya Xolmatova",
    date: "2026-03-02",
    status: "JARAYONDA",
  },
];

const STATUS_CLASS = {
  "IMZOLANGAN": "bg-green-600 text-white",
  "JARAYONDA": "bg-blue-600 text-white",
  "TO'LOV KUTILMOQDA": "bg-amber-500 text-black",
  "BEKOR QILINGAN": "bg-red-600 text-white",
};

export default function Contracts() {
  return (
    <section className="animate-fade-in h-full p-5">
      <header className="bg-primary/2 mb-6 rounded border p-3">
        <h2 className="text-2xl font-bold">Shartnomalar</h2>
        <p className="text-muted-foreground mt-1 text-xs">
          Hozircha mock ma&apos;lumotlar ko&apos;rsatilmoqda.
        </p>
      </header>

      <div className="h-[calc(100%-96px)] overflow-y-auto pr-2">
        <Table className="w-full">
          <TableHeader className="bg-background sticky top-0 z-10">
            <TableRow>
              <TableHead>№</TableHead>
              <TableHead>Shartnoma raqami</TableHead>
              <TableHead>Mijoz</TableHead>
              <TableHead>Loyiha</TableHead>
              <TableHead>Menejer</TableHead>
              <TableHead>Sana</TableHead>
              <TableHead>Summa ($)</TableHead>
              <TableHead>Holati</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_CONTRACTS.map((contract, index) => (
              <TableRow key={contract.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-medium">{contract.number}</TableCell>
                <TableCell>{contract.client}</TableCell>
                <TableCell>{contract.project}</TableCell>
                <TableCell>{contract.manager}</TableCell>
                <TableCell>{contract.date}</TableCell>
                <TableCell>{contract.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge className={STATUS_CLASS[contract.status] ?? ""}>
                    {contract.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
