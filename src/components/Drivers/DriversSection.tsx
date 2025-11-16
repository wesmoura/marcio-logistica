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
import DriverForm, { type Driver } from "./DriverForm";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { loadVehicles, assignVehicleToDriver } from "@/lib/data";

const DriversSection = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState(loadVehicles());

  useEffect(() => {
    try {
      const saved = localStorage.getItem("drivers");
      const parsed = saved ? JSON.parse(saved) : [];
      setDrivers(Array.isArray(parsed) ? parsed : []);
    } catch {
      setDrivers([]);
    }
    setVehicles(loadVehicles());
  }, []);

  const persistDrivers = (next: Driver[]) => {
    setDrivers(next);
    localStorage.setItem("drivers", JSON.stringify(next));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Ativo': { variant: 'secondary' as const, color: 'text-success' },
      'Em viagem': { variant: 'default' as const, color: 'text-primary' },
      'Disponível': { variant: 'outline' as const, color: 'text-muted-foreground' },
      'Inativo': { variant: 'destructive' as const, color: 'text-destructive' }
    };
    return statusConfig[status] || { variant: 'default' as const, color: 'text-muted-foreground' };
  };

  const filteredDrivers = drivers.filter(driver =>
    (driver.nome || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (driver.cpf || "").includes(searchTerm) ||
    (driver.telefone || "").includes(searchTerm) ||
    ((driver.email || "").toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const isExpiringSoon = (vencimento: string) => {
    const today = new Date();
    const expireDate = new Date(vencimento.split('/').reverse().join('-'));
    const diffTime = expireDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Gestão de Motoristas</h2>
          <p className="text-muted-foreground">Cadastro e controle de motoristas</p>
        </div>
        <Button 
          className="bg-gradient-primary hover:opacity-90 transition-opacity"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Motorista
        </Button>
      </div>

      {showForm && (
        <DriverForm
          onClose={() => setShowForm(false)}
          onSaved={(d) => {
            const next = [d, ...drivers];
            persistDrivers(next);
            toast({ title: "Salvo", description: "Motorista incluído com sucesso." });
          }}
        />
      )}

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, CPF, telefone ou email..."
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
          <CardTitle>Lista de Motoristas</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="todos">
            <TabsList className="mb-4">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="disponivel">Disponíveis</TabsTrigger>
              <TabsTrigger value="em_viagem">Em viagem</TabsTrigger>
              <TabsTrigger value="inativo">Inativos</TabsTrigger>
            </TabsList>

            {[
              { key: "todos", filter: (d: Driver) => true },
              { key: "disponivel", filter: (d: Driver) => d.status === "Disponível" },
              { key: "em_viagem", filter: (d: Driver) => d.status === "Em viagem" },
              { key: "inativo", filter: (d: Driver) => d.status === "Inativo" },
            ].map(({ key, filter }) => (
              <TabsContent key={key} value={key} className="mt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>CNH</TableHead>
                      <TableHead>Vencimento CNH</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Veículo Atual</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDrivers.filter(filter).map((driver) => {
                      const statusConfig = getStatusBadge(driver.status);
                      const cnhExpiringSoon = isExpiringSoon(driver.vencimento_cnh);

                      return (
                        <TableRow key={driver.id} className="hover:bg-muted/50 transition-colors">
                          <TableCell className="font-medium">{driver.nome}</TableCell>
                          <TableCell>{driver.cpf}</TableCell>
                          <TableCell>{driver.telefone}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{driver.cnh}</div>
                              <div className="text-sm text-muted-foreground">Categoria {driver.categoria_cnh}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className={cnhExpiringSoon ? "text-destructive font-medium" : ""}>
                              {driver.vencimento_cnh}
                              {cnhExpiringSoon && (
                                <div className="text-xs text-destructive">Vence em breve!</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Circle className={`h-2 w-2 fill-current ${statusConfig.color}`} />
                              <Badge variant={statusConfig.variant}>{driver.status}</Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="min-w-[220px]">
                              <Select
                                value={driver.veiculo_atual_id ?? "none"}
                                onValueChange={(vehicleId) => {
                                  const id = vehicleId === "none" ? null : vehicleId;
                                  assignVehicleToDriver(id, driver.id);
                                  // Refresh local state from storage to keep both lists consistent
                                  try {
                                    const raw = localStorage.getItem("drivers");
                                    const parsed = raw ? JSON.parse(raw) : [];
                                    setDrivers(Array.isArray(parsed) ? parsed : []);
                                  } catch {
                                    setDrivers([]);
                                  }
                                  setVehicles(loadVehicles());
                                  toast({ title: "Vínculo atualizado", description: id ? "Veículo atribuído." : "Vínculo removido." });
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder={driver.veiculo_atual ? driver.veiculo_atual : "Selecionar veículo"} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">Sem veículo</SelectItem>
                                  {vehicles.map(v => (
                                    <SelectItem key={v.id} value={v.id}>{v.plate} — {v.model}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const next = drivers.map(d => d.id === driver.id ? { ...d, status: d.status === "Em viagem" ? "Disponível" : "Em viagem" } : d);
                                  persistDrivers(next);
                                  toast({ title: "Status atualizado", description: `Agora: ${driver.status === "Em viagem" ? "Disponível" : "Em viagem"}` });
                                }}
                              >
                                Alternar viagem
                              </Button>
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
                                  const next = drivers.filter(d => d.id !== driver.id);
                                  persistDrivers(next);
                                  toast({ title: "Removido", description: "Motorista excluído." });
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
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriversSection;