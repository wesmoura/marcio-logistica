import { useEffect, useState } from "react";
import { Plus, Search, Filter, Fuel, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { loadVehicles } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

interface Fueling {
  id: string;
  vehicleId: string;
  vehiclePlate: string;
  date: string;
  liters: number;
  pricePerLiter: number;
  total: number;
  odometer?: number;
  station?: string;
  driver?: string;
}

const FuelSection = () => {
  const { toast } = useToast();
  const [fuelings, setFuelings] = useState<Fueling[]>([]);
  const [vehicles, setVehicles] = useState(loadVehicles());
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    vehicleId: "",
    date: new Date().toISOString().slice(0, 10),
    liters: "",
    pricePerLiter: "",
    odometer: "",
    station: "",
    driver: "",
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("fuelings");
      const parsed = raw ? JSON.parse(raw) : [];
      setFuelings(Array.isArray(parsed) ? parsed : []);
    } catch { setFuelings([]); }
    setVehicles(loadVehicles());
  }, []);

  const persist = (next: Fueling[]) => {
    setFuelings(next);
    localStorage.setItem("fuelings", JSON.stringify(next));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = vehicles.find(x => x.id === form.vehicleId);
    if (!v) { toast({ title: "Selecione um veículo", variant: "destructive" }); return; }
    const liters = parseFloat(form.liters || "0");
    const price = parseFloat(form.pricePerLiter || "0");
    const total = +(liters * price).toFixed(2);
    const item: Fueling = {
      id: String(Date.now()),
      vehicleId: v.id,
      vehiclePlate: v.plate,
      date: form.date,
      liters,
      pricePerLiter: price,
      total,
      odometer: form.odometer ? parseInt(form.odometer) : undefined,
      station: form.station || undefined,
      driver: form.driver || undefined,
    };
    const next = [item, ...fuelings];
    persist(next);
    toast({ title: "Abastecimento salvo" });
    setShowForm(false);
    setForm({ vehicleId: "", date: new Date().toISOString().slice(0, 10), liters: "", pricePerLiter: "", odometer: "", station: "", driver: "" });
  };

  const filtered = fuelings.filter(f =>
    f.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.date.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Abastecimentos</h2>
          <p className="text-muted-foreground">Registro e controle de consumo</p>
        </div>
        <Button className="bg-gradient-primary" onClick={() => setShowForm(s => !s)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Abastecimento
        </Button>
      </div>

      {showForm && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Registrar Abastecimento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm mb-1 block">Veículo *</label>
                <Select value={form.vehicleId || "none"} onValueChange={(v) => setForm(f => ({ ...f, vehicleId: v === "none" ? "" : v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o veículo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Selecione...</SelectItem>
                    {vehicles.map(v => (
                      <SelectItem key={v.id} value={v.id}>{v.plate} — {v.model}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm mb-1 block">Data *</label>
                <Input type="date" value={form.date} onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))} required />
              </div>
              <div>
                <label className="text-sm mb-1 block">Litros *</label>
                <Input type="number" step="0.01" value={form.liters} onChange={(e) => setForm(f => ({ ...f, liters: e.target.value }))} required />
              </div>
              <div>
                <label className="text-sm mb-1 block">Preço/L *</label>
                <Input type="number" step="0.01" value={form.pricePerLiter} onChange={(e) => setForm(f => ({ ...f, pricePerLiter: e.target.value }))} required />
              </div>
              <div>
                <label className="text-sm mb-1 block">Hodômetro</label>
                <Input type="number" value={form.odometer} onChange={(e) => setForm(f => ({ ...f, odometer: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm mb-1 block">Posto</label>
                <Input value={form.station} onChange={(e) => setForm(f => ({ ...f, station: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm mb-1 block">Motorista</label>
                <Input value={form.driver} onChange={(e) => setForm(f => ({ ...f, driver: e.target.value }))} />
              </div>
              <div className="md:col-span-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
                <Button type="submit"><Fuel className="h-4 w-4 mr-2"/>Salvar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por placa ou data..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registros</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Placa</TableHead>
                <TableHead>Litros</TableHead>
                <TableHead>Preço/L</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Hodômetro</TableHead>
                <TableHead>Posto</TableHead>
                <TableHead>Motorista</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(f => (
                <TableRow key={f.id} className="hover:bg-muted/50">
                  <TableCell>{f.date}</TableCell>
                  <TableCell>{f.vehiclePlate}</TableCell>
                  <TableCell>{f.liters.toFixed(2)}</TableCell>
                  <TableCell>R$ {f.pricePerLiter.toFixed(2)}</TableCell>
                  <TableCell>R$ {f.total.toFixed(2)}</TableCell>
                  <TableCell>{f.odometer ?? "-"}</TableCell>
                  <TableCell>{f.station ?? "-"}</TableCell>
                  <TableCell>{f.driver ?? "-"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
                      const next = fuelings.filter(x => x.id !== f.id);
                      persist(next);
                      toast({ title: "Registro removido" });
                    }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default FuelSection;


