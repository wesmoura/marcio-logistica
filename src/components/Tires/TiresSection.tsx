import { useEffect, useState } from "react";
import { Plus, Search, Filter, Trash2, Wrench, History, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { loadVehicles } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type TireStatus = "Estoque" | "Em uso" | "Descartado";

type TireMovement = {
  date: string; // ISO
  fromPosition?: string;
  toPosition: string;
};

type TireCycle = {
  id: string; // use date of install as identifier
  installDate: string; // ISO
  installOdometer: number;
  vehicleId: string;
  vehiclePlate: string;
  position: string;
  removeDate?: string; // ISO
  removeOdometer?: number;
  kmRun?: number;
  movements?: TireMovement[];
};

interface Tire {
  id: string;
  serial: string;
  brand: string;
  position?: string;
  treadDepth?: string;
  status: TireStatus;
  vehicleId?: string;
  vehiclePlate?: string;
  lifeEstimateKm?: number; // e.g. 100000
  totalKm?: number;
  recaps?: number;
  cycles?: TireCycle[];
}

const TiresSection = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [tires, setTires] = useState<Tire[]>([]);
  const [vehicles, setVehicles] = useState(loadVehicles());
  const [selected, setSelected] = useState<Tire | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [form, setForm] = useState({
    serial: "",
    brand: "",
    position: "",
    treadDepth: "",
    status: "Estoque" as TireStatus,
    vehicleId: "none",
  });

  const [installForm, setInstallForm] = useState({
    vehicleId: "",
    position: "",
    odometer: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const [removeForm, setRemoveForm] = useState({
    odometer: "",
    date: new Date().toISOString().slice(0, 10),
    recap: false,
  });

  const [moveForm, setMoveForm] = useState({
    toPosition: "",
    date: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("tires");
      const parsed = raw ? JSON.parse(raw) : [];
      setTires(Array.isArray(parsed) ? parsed : []);
    } catch { setTires([]); }
    setVehicles(loadVehicles());
  }, []);

  const persist = (next: Tire[]) => {
    setTires(next);
    localStorage.setItem("tires", JSON.stringify(next));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const vehicle = form.vehicleId !== "none" ? vehicles.find(v => v.id === form.vehicleId) : undefined;
    const item: Tire = {
      id: String(Date.now()),
      serial: form.serial.trim(),
      brand: form.brand.trim(),
      position: form.position || undefined,
      treadDepth: form.treadDepth || undefined,
      status: form.status,
      vehicleId: vehicle?.id,
      vehiclePlate: vehicle?.plate,
      lifeEstimateKm: 100000,
      totalKm: 0,
      recaps: 0,
      cycles: [],
    };
    const next = [item, ...tires];
    persist(next);
    toast({ title: "Pneu cadastrado", description: "Cadastro realizado com sucesso." });
    setShowForm(false);
    setForm({ serial: "", brand: "", position: "", treadDepth: "", status: "Estoque", vehicleId: "none" });
  };

  const updateTire = (updated: Tire) => {
    const next = tires.map(t => t.id === updated.id ? updated : t);
    persist(next);
    setSelected(updated);
  };

  const handleInstall = () => {
    if (!selected) return;
    const v = vehicles.find(x => x.id === installForm.vehicleId);
    if (!v) { toast({ title: "Selecione um veículo", variant: "destructive" }); return; }
    const od = parseInt(installForm.odometer || "0");
    const cycle: TireCycle = {
      id: installForm.date,
      installDate: installForm.date,
      installOdometer: od,
      vehicleId: v.id,
      vehiclePlate: v.plate,
      position: installForm.position || "",
      movements: [],
    };
    const updated: Tire = {
      ...selected,
      status: "Em uso",
      vehicleId: v.id,
      vehiclePlate: v.plate,
      position: installForm.position || selected.position,
      cycles: [cycle, ...(selected.cycles || [])],
    };
    updateTire(updated);
    toast({ title: "Instalação registrada" });
    setInstallForm({ vehicleId: "", position: "", odometer: "", date: new Date().toISOString().slice(0, 10) });
  };

  const handleRemove = () => {
    if (!selected || !(selected.cycles && selected.cycles.length > 0)) return;
    const [current, ...rest] = selected.cycles;
    if (current.removeOdometer) { toast({ title: "Ciclo já finalizado", variant: "destructive" }); return; }
    const od = parseInt(removeForm.odometer || "0");
    const km = Math.max(0, od - (current.installOdometer || 0));
    const finished: TireCycle = { ...current, removeDate: removeForm.date, removeOdometer: od, kmRun: km };
    const totalKm = (selected.totalKm || 0) + km;
    const recaps = removeForm.recap ? (selected.recaps || 0) + 1 : (selected.recaps || 0);
    let status: TireStatus = "Estoque";
    if ((selected.lifeEstimateKm || 100000) <= totalKm) status = "Descartado";
    const updated: Tire = {
      ...selected,
      status,
      vehicleId: status === "Estoque" ? undefined : selected.vehicleId,
      vehiclePlate: status === "Estoque" ? undefined : selected.vehiclePlate,
      totalKm,
      recaps,
      cycles: [finished, ...rest],
    };
    updateTire(updated);
    toast({ title: "Remoção registrada", description: `Ciclo: ${km.toLocaleString()} km` });
    setRemoveForm({ odometer: "", date: new Date().toISOString().slice(0, 10), recap: false });
  };

  const handleMove = () => {
    if (!selected || !(selected.cycles && selected.cycles.length > 0)) return;
    const [current, ...rest] = selected.cycles;
    const move: TireMovement = { date: moveForm.date, fromPosition: selected.position, toPosition: moveForm.toPosition };
    const updatedCurrent: TireCycle = { ...current, movements: [...(current.movements || []), move] };
    const updated: Tire = { ...selected, position: moveForm.toPosition, cycles: [updatedCurrent, ...rest] };
    updateTire(updated);
    toast({ title: "Movimentação registrada" });
    setMoveForm({ toPosition: "", date: new Date().toISOString().slice(0, 10) });
  };

  const filtered = tires.filter(t =>
    t.serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.vehiclePlate || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Controle de Pneus</h2>
          <p className="text-muted-foreground">Gestão de estoque e montagem por veículo</p>
        </div>
        <Button className="bg-gradient-primary" onClick={() => setShowForm(s => !s)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Pneu
        </Button>
      </div>

      {showForm && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Cadastro de Pneu</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm mb-1 block">Número de Série *</label>
                <Input value={form.serial} onChange={(e) => setForm(f => ({ ...f, serial: e.target.value }))} required />
              </div>
              <div>
                <label className="text-sm mb-1 block">Marca *</label>
                <Input value={form.brand} onChange={(e) => setForm(f => ({ ...f, brand: e.target.value }))} required />
              </div>
              <div>
                <label className="text-sm mb-1 block">Posição</label>
                <Input placeholder="Ex.: Dianteiro Esq." value={form.position} onChange={(e) => setForm(f => ({ ...f, position: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm mb-1 block">Sulco (mm)</label>
                <Input type="number" step="0.1" value={form.treadDepth} onChange={(e) => setForm(f => ({ ...f, treadDepth: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm mb-1 block">Status *</label>
                <Select value={form.status} onValueChange={(v) => setForm(f => ({ ...f, status: v as TireStatus }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Estoque">Estoque</SelectItem>
                    <SelectItem value="Em uso">Em uso</SelectItem>
                    <SelectItem value="Descartado">Descartado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm mb-1 block">Vincular Veículo</label>
                <Select value={form.vehicleId} onValueChange={(v) => setForm(f => ({ ...f, vehicleId: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o veículo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sem vínculo</SelectItem>
                    {vehicles.map(v => (
                      <SelectItem key={v.id} value={v.id}>{v.plate} — {v.model}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-3 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
                <Button type="submit"><Wrench className="h-4 w-4 mr-2"/>Salvar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por série, marca ou placa..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Estoque e Montagens</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Série</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Posição</TableHead>
                <TableHead>Sulco (mm)</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Total km</TableHead>
                <TableHead>Recapagens</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(t => (
                <TableRow key={t.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{t.serial}</TableCell>
                  <TableCell>{t.brand}</TableCell>
                  <TableCell>
                    <Badge variant={t.status === "Em uso" ? "default" : t.status === "Estoque" ? "secondary" : "destructive"}>{t.status}</Badge>
                  </TableCell>
                  <TableCell>{t.position || "-"}</TableCell>
                  <TableCell>{t.treadDepth || "-"}</TableCell>
                  <TableCell>{t.vehiclePlate || "-"}</TableCell>
                  <TableCell>{(t.totalKm || 0).toLocaleString()}</TableCell>
                  <TableCell>{t.recaps || 0}</TableCell>
                  <TableCell className="text-right">
                    <Dialog open={showDetails && selected?.id === t.id} onOpenChange={(o) => { if (!o) { setShowDetails(false); setSelected(null); } }}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => { setSelected(t); setShowDetails(true); }} className="mr-2">
                          <History className="h-4 w-4 mr-2" /> Detalhes
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Pneu {t.serial} — {t.brand}</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-2">Ações</h4>
                            {selected?.status !== "Em uso" ? (
                              <div className="space-y-2 p-3 border rounded-md">
                                <div className="font-medium">Instalar</div>
                                <div>
                                  <label className="text-xs mb-1 block">Veículo *</label>
                                  <Select value={installForm.vehicleId || "none"} onValueChange={(v) => setInstallForm(f => ({ ...f, vehicleId: v === "none" ? "" : v }))}>
                                    <SelectTrigger><SelectValue placeholder="Selecione"/></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="none">Selecione...</SelectItem>
                                      {vehicles.map(v => (<SelectItem key={v.id} value={v.id}>{v.plate} — {v.model}</SelectItem>))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <label className="text-xs mb-1 block">Posição *</label>
                                  <Input value={installForm.position} onChange={(e) => setInstallForm(f => ({ ...f, position: e.target.value }))} placeholder="Ex.: Dianteiro Esq." />
                                </div>
                                <div>
                                  <label className="text-xs mb-1 block">Quilometragem (instalação) *</label>
                                  <Input type="number" value={installForm.odometer} onChange={(e) => setInstallForm(f => ({ ...f, odometer: e.target.value }))} />
                                </div>
                                <div>
                                  <label className="text-xs mb-1 block">Data *</label>
                                  <Input type="date" value={installForm.date} onChange={(e) => setInstallForm(f => ({ ...f, date: e.target.value }))} />
                                </div>
                                <div className="text-right">
                                  <Button size="sm" onClick={handleInstall}><Wrench className="h-4 w-4 mr-2"/>Registrar instalação</Button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2 p-3 border rounded-md">
                                <div className="font-medium">Finalizar ciclo (Remoção)</div>
                                <div>
                                  <label className="text-xs mb-1 block">Quilometragem (remoção) *</label>
                                  <Input type="number" value={removeForm.odometer} onChange={(e) => setRemoveForm(f => ({ ...f, odometer: e.target.value }))} />
                                </div>
                                <div>
                                  <label className="text-xs mb-1 block">Data *</label>
                                  <Input type="date" value={removeForm.date} onChange={(e) => setRemoveForm(f => ({ ...f, date: e.target.value }))} />
                                </div>
                                <div className="flex items-center gap-2">
                                  <input id="recap" type="checkbox" checked={removeForm.recap} onChange={(e) => setRemoveForm(f => ({ ...f, recap: e.target.checked }))} />
                                  <label htmlFor="recap" className="text-xs">Marcar como recapado</label>
                                </div>
                                <div className="text-right">
                                  <Button size="sm" onClick={handleRemove}>Registrar remoção</Button>
                                </div>
                                <div className="space-y-2 p-3 border rounded-md mt-4">
                                  <div className="font-medium">Movimentar posição</div>
                                  <div>
                                    <label className="text-xs mb-1 block">Nova posição *</label>
                                    <Input value={moveForm.toPosition} onChange={(e) => setMoveForm(f => ({ ...f, toPosition: e.target.value }))} placeholder="Ex.: Traseiro Dir." />
                                  </div>
                                  <div>
                                    <label className="text-xs mb-1 block">Data *</label>
                                    <Input type="date" value={moveForm.date} onChange={(e) => setMoveForm(f => ({ ...f, date: e.target.value }))} />
                                  </div>
                                  <div className="text-right">
                                    <Button size="sm" variant="outline" onClick={handleMove}><MoveRight className="h-4 w-4 mr-2"/>Registrar movimentação</Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Histórico de ciclos</h4>
                            <div className="text-sm text-muted-foreground mb-2">Vida útil estimada: {(selected?.lifeEstimateKm || 100000).toLocaleString()} km • Total rodado: {(selected?.totalKm || 0).toLocaleString()} km • Recapagens: {selected?.recaps || 0}</div>
                            <div className="border rounded-md overflow-hidden">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Instalação</TableHead>
                                    <TableHead>Remoção</TableHead>
                                    <TableHead>Km ciclo</TableHead>
                                    <TableHead>Veículo</TableHead>
                                    <TableHead>Posição</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {(selected?.cycles || []).map(c => (
                                    <TableRow key={c.id}>
                                      <TableCell>{c.installDate} — {c.installOdometer?.toLocaleString()} km</TableCell>
                                      <TableCell>{c.removeDate ? `${c.removeDate} — ${c.removeOdometer?.toLocaleString()} km` : '-'}</TableCell>
                                      <TableCell>{c.kmRun?.toLocaleString() || '-'}</TableCell>
                                      <TableCell>{c.vehiclePlate}</TableCell>
                                      <TableCell>{c.position}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
                      const next = tires.filter(x => x.id !== t.id);
                      persist(next);
                      toast({ title: "Pneu removido" });
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

export default TiresSection;


