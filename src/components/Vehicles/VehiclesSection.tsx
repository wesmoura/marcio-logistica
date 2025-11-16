import { useEffect, useState } from "react";
import { Plus, Search, Filter, Eye, Edit, Trash2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import VehicleForm, { type Vehicle } from "./VehicleForm";
import { useToast } from "@/hooks/use-toast";
import { assignDriverToVehicle, loadDrivers } from "@/lib/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Driver } from "@/components/Drivers/DriverForm";

const VehiclesSection = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("vehicles");
      const parsed = saved ? JSON.parse(saved) : [];
      setVehicles(Array.isArray(parsed) ? parsed : []);
    } catch {
      setVehicles([]);
    }
    setDrivers(loadDrivers());
  }, []);

  const persistVehicles = (next: Vehicle[]) => {
    setVehicles(next);
    localStorage.setItem("vehicles", JSON.stringify(next));
  };

  const handleVehicleSaved = (vehicle: Vehicle) => {
    const next = [vehicle, ...vehicles];
    persistVehicles(next);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Em viagem': { variant: 'default' as const, color: 'text-primary' },
      'Disponível': { variant: 'secondary' as const, color: 'text-success' },
      'Manutenção': { variant: 'destructive' as const, color: 'text-destructive' }
    };
    return statusConfig[status] || { variant: 'default' as const, color: 'text-muted-foreground' };
  };

  const filteredVehicles = vehicles.filter(vehicle =>
    (vehicle.plate || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (vehicle.model || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (vehicle.driver ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Gestão de Veículos</h2>
          <p className="text-muted-foreground">Controle completo da sua frota</p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90 transition-opacity" onClick={() => setShowForm(s => !s)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Veículo
        </Button>
      </div>

      {showForm && (
        <VehicleForm
          onClose={() => setShowForm(false)}
          onSaved={(v) => {
            handleVehicleSaved(v);
            toast({ title: "Salvo", description: "Veículo incluído com sucesso." });
          }}
        />
      )}

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por placa, modelo ou motorista..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Veículos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Placa</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Motorista</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Quilometragem</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Próxima Manutenção</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => {
                const statusConfig = getStatusBadge(vehicle.status);
                return (
                  <TableRow key={vehicle.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{vehicle.plate}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{vehicle.model}</div>
                        <div className="text-sm text-muted-foreground">{vehicle.year}</div>
                      </div>
                    </TableCell>
                    <TableCell>{vehicle.driver ?? "-"}</TableCell>
                    
                    <TableCell className="hidden" />
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Circle className={`h-2 w-2 fill-current ${statusConfig.color}`} />
                        <Badge variant={statusConfig.variant}>{vehicle.status}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>{vehicle.mileage ?? "-"}</TableCell>
                    <TableCell>
                      <div className="text-sm">{vehicle.location ?? "-"}</div>
                    </TableCell>
                    <TableCell>{vehicle.nextMaintenance ?? "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-[240px] mr-2">
                          <Select
                            value={vehicle.driverId ?? "none"}
                            onValueChange={(driverId) => {
                              const id = driverId === "none" ? null : driverId;
                              assignDriverToVehicle(id, vehicle.id);
                              const updatedVehicles = JSON.parse(localStorage.getItem("vehicles") || "[]");
                              const updatedDrivers = loadDrivers();
                              setVehicles(updatedVehicles);
                              setDrivers(updatedDrivers);
                              toast({ title: "Vínculo atualizado", description: id ? "Motorista atribuído." : "Vínculo removido." });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={vehicle.driver ? vehicle.driver : "Selecionar motorista"} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Sem motorista</SelectItem>
                              {drivers.map(d => (
                                <SelectItem key={d.id} value={d.id}>{d.nome}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            const next = vehicles.filter(v => v.id !== vehicle.id);
                            persistVehicles(next);
                            toast({ title: "Removido", description: "Veículo excluído." });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehiclesSection;