import { useEffect, useState } from "react";
import { Plus, Search, Filter, ShieldAlert, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { loadVehicles } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

type RiskLevel = "Baixo" | "Médio" | "Alto";

interface Freight {
  id: string;
  order: string;
  vehicleId: string;
  vehiclePlate: string;
  origin: string;
  destination: string;
  date: string;
  value: number;
  risk: RiskLevel;
  notes?: string;
}

const FreightsSection = () => {
  const { toast } = useToast();
  const [freights, setFreights] = useState<Freight[]>([]);
  const [vehicles, setVehicles] = useState(loadVehicles());
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    order: "",
    vehicleId: "",
    origin: "",
    destination: "",
    date: new Date().toISOString().slice(0, 10),
    value: "",
    risk: "Médio" as RiskLevel,
    notes: "",
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("freights");
      const parsed = raw ? JSON.parse(raw) : [];
      setFreights(Array.isArray(parsed) ? parsed : []);
    } catch { setFreights([]); }
    setVehicles(loadVehicles());
  }, []);

  const persist = (next: Freight[]) => {
    setFreights(next);
    localStorage.setItem("freights", JSON.stringify(next));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = vehicles.find(x => x.id === form.vehicleId);
    if (!v) { toast({ title: "Selecione um veículo", variant: "destructive" }); return; }
    const item: Freight = {
      id: String(Date.now()),
      order: form.order.trim(),
      vehicleId: v.id,
      vehiclePlate: v.plate,
      origin: form.origin.trim(),
      destination: form.destination.trim(),
      date: form.date,
      value: parseFloat(form.value || "0"),
      risk: form.risk,
      notes: form.notes || undefined,
    };
    const next = [item, ...freights];
    persist(next);
    toast({ title: "Frete cadastrado" });
    setShowForm(false);
    setForm({ order: "", vehicleId: "", origin: "", destination: "", date: new Date().toISOString().slice(0, 10), value: "", risk: "Médio", notes: "" });
  };

  const filtered = freights.filter(f =>
    f.order.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const riskBadge = (risk: RiskLevel) => (
    <span className={risk === "Alto" ? "text-destructive font-medium" : risk === "Médio" ? "text-warning font-medium" : "text-success font-medium"}>{risk}</span>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Fretes e Gestão de Risco</h2>
          <p className="text-muted-foreground">Controle de viagens com nível de risco</p>
        </div>
        <Button className="bg-gradient-primary" onClick={() => setShowForm(s => !s)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Frete
        </Button>
      </div>

      {showForm && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Cadastrar Frete</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm mb-1 block">Pedido/OS *</label>
                <Input value={form.order} onChange={(e) => setForm(f => ({ ...f, order: e.target.value }))} required />
              </div>
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
                <label className="text-sm mb-1 block">Origem *</label>
                <Input value={form.origin} onChange={(e) => setForm(f => ({ ...f, origin: e.target.value }))} required />
              </div>
              <div>
                <label className="text-sm mb-1 block">Destino *</label>
                <Input value={form.destination} onChange={(e) => setForm(f => ({ ...f, destination: e.target.value }))} required />
              </div>
              <div>
                <label className="text-sm mb-1 block">Valor (R$)</label>
                <Input type="number" step="0.01" value={form.value} onChange={(e) => setForm(f => ({ ...f, value: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm mb-1 block">Risco *</label>
                <Select value={form.risk} onValueChange={(v) => setForm(f => ({ ...f, risk: v as RiskLevel }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o risco" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Baixo">Baixo</SelectItem>
                    <SelectItem value="Médio">Médio</SelectItem>
                    <SelectItem value="Alto">Alto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-4">
                <label className="text-sm mb-1 block">Observações</label>
                <Input value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
              <div className="md:col-span-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
                <Button type="submit"><ShieldAlert className="h-4 w-4 mr-2"/>Salvar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por pedido ou placa..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fretes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Placa</TableHead>
                <TableHead>Origem → Destino</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Risco</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(f => (
                <TableRow key={f.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{f.order}</TableCell>
                  <TableCell>{f.date}</TableCell>
                  <TableCell>{f.vehiclePlate}</TableCell>
                  <TableCell>{f.origin} → {f.destination}</TableCell>
                  <TableCell>R$ {f.value.toFixed(2)}</TableCell>
                  <TableCell>{riskBadge(f.risk)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
                      const next = freights.filter(x => x.id !== f.id);
                      persist(next);
                      toast({ title: "Frete removido" });
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

      <div className="text-xs text-muted-foreground flex items-center gap-2">
        <FileText className="h-3 w-3" />
        Dica: riscos altos podem exigir seguro adicional, escolta ou aprovação manual.
      </div>
    </div>
  );
};

export default FreightsSection;


