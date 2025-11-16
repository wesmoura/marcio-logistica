import { useState } from "react";
import { Plus, Wrench, Calendar, AlertCircle, CheckCircle2, Clock, Filter, Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const MaintenanceSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const { toast } = useToast();

  const maintenanceRecords: any[] = [];

  const getStatusInfo = (status: string) => {
    const statusMap = {
      completed: { label: "Concluída", variant: "secondary" as const, icon: CheckCircle2, color: "text-success" },
      scheduled: { label: "Agendada", variant: "default" as const, icon: Calendar, color: "text-primary" },
      overdue: { label: "Atrasada", variant: "destructive" as const, icon: AlertCircle, color: "text-destructive" },
      in_progress: { label: "Em Andamento", variant: "outline" as const, icon: Clock, color: "text-warning" }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.scheduled;
  };

  const getPriorityInfo = (priority: string) => {
    const priorityMap = {
      high: { label: "Alta", variant: "destructive" as const },
      medium: { label: "Média", variant: "outline" as const },
      low: { label: "Baixa", variant: "secondary" as const }
    };
    return priorityMap[priority as keyof typeof priorityMap] || priorityMap.medium;
  };

  const handleScheduleMaintenance = () => {
    toast({
      title: "Manutenção agendada!",
      description: "A manutenção foi agendada com sucesso.",
    });
  };

  const filteredRecords = maintenanceRecords.filter(record => {
    const matchesSearch = record.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || record.status === filterStatus;
    const matchesType = filterType === "all" || record.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesStatus && matchesType;
  });

  const ScheduleMaintenanceForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="vehicle">Veículo</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o veículo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cav001">CAV-001</SelectItem>
            <SelectItem value="cav002">CAV-002</SelectItem>
            <SelectItem value="cav003">CAV-003</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="type">Tipo de Manutenção</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="preventiva">Preventiva</SelectItem>
            <SelectItem value="corretiva">Corretiva</SelectItem>
            <SelectItem value="emergencial">Emergencial</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="service">Serviço</Label>
        <Input id="service" placeholder="Descrição do serviço..." />
      </div>
      
      <div>
        <Label htmlFor="scheduledDate">Data Agendada</Label>
        <Input id="scheduledDate" type="date" />
      </div>
      
      <div>
        <Label htmlFor="priority">Prioridade</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">Alta</SelectItem>
            <SelectItem value="medium">Média</SelectItem>
            <SelectItem value="low">Baixa</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="cost">Custo Estimado (R$)</Label>
        <Input id="cost" type="number" placeholder="0,00" />
      </div>
      
      <div>
        <Label htmlFor="technician">Técnico Responsável</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o técnico" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="jose">José Santos</SelectItem>
            <SelectItem value="carlos">Carlos Silva</SelectItem>
            <SelectItem value="ana">Ana Costa</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="notes">Observações</Label>
        <Textarea id="notes" placeholder="Observações adicionais..." />
      </div>
      
      <Button onClick={handleScheduleMaintenance} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Agendar Manutenção
      </Button>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Gestão de Manutenção</h2>
          <p className="text-muted-foreground">Controle preventivo e corretivo da sua frota</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Agendar Manutenção
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Agendar Manutenção</DialogTitle>
              <DialogDescription>
                Configure um novo agendamento de manutenção
              </DialogDescription>
            </DialogHeader>
            <ScheduleMaintenanceForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-sm text-muted-foreground">Concluídas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-sm text-muted-foreground">Agendadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <div>
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-sm text-muted-foreground">Atrasadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-sm text-muted-foreground">Em Andamento</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="scheduled">Agendadas</TabsTrigger>
          <TabsTrigger value="overdue">Atrasadas</TabsTrigger>
          <TabsTrigger value="completed">Concluídas</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar manutenções..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="scheduled">Agendadas</SelectItem>
              <SelectItem value="overdue">Atrasadas</SelectItem>
              <SelectItem value="completed">Concluídas</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="preventiva">Preventiva</SelectItem>
              <SelectItem value="corretiva">Corretiva</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {filteredRecords.map((record) => {
              const statusInfo = getStatusInfo(record.status);
              const priorityInfo = getPriorityInfo(record.priority);
              const StatusIcon = statusInfo.icon;
              
              return (
                <Card key={record.id} className="hover:shadow-medium transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Wrench className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{record.vehicle} - {record.service}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{record.type}</span>
                            <span>•</span>
                            <span>Técnico: {record.technician}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge variant={priorityInfo.variant}>{priorityInfo.label}</Badge>
                        <Badge variant={statusInfo.variant}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Data Agendada:</span>
                        <p className="font-medium text-foreground">
                          {new Date(record.scheduledDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-muted-foreground">Custo:</span>
                        <p className="font-medium text-foreground">
                          R$ {record.cost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-muted-foreground">Odômetro:</span>
                        <p className="font-medium text-foreground">
                          {record.odometer.toLocaleString('pt-BR')} km
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-muted-foreground">Próximo Serviço:</span>
                        <p className="font-medium text-foreground">
                          {record.nextService ? `${record.nextService.toLocaleString('pt-BR')} km` : "N/A"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios de Manutenção</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Relatórios Detalhados</h3>
                <p className="text-muted-foreground mb-4">
                  Gere relatórios completos de custos, eficiência e histórico de manutenções
                </p>
                <Button className="bg-gradient-primary">
                  <FileText className="h-4 w-4 mr-2" />
                  Gerar Relatório
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tab contents with filtered data */}
        <TabsContent value="scheduled">
          <div className="grid gap-4">
            {filteredRecords.filter(r => r.status === 'scheduled').map((record) => {
              const statusInfo = getStatusInfo(record.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <Card key={record.id} className="hover:shadow-medium transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <StatusIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{record.vehicle} - {record.service}</h3>
                          <p className="text-sm text-muted-foreground">
                            Agendada para {new Date(record.scheduledDate).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="overdue">
          <div className="grid gap-4">
            {filteredRecords.filter(r => r.status === 'overdue').map((record) => {
              const statusInfo = getStatusInfo(record.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <Card key={record.id} className="hover:shadow-medium transition-shadow border-destructive/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-destructive/10">
                          <StatusIcon className="h-6 w-6 text-destructive" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{record.vehicle} - {record.service}</h3>
                          <p className="text-sm text-destructive">
                            Atrasada desde {new Date(record.scheduledDate).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="grid gap-4">
            {filteredRecords.filter(r => r.status === 'completed').map((record) => {
              const statusInfo = getStatusInfo(record.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <Card key={record.id} className="hover:shadow-medium transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-success/10">
                          <StatusIcon className="h-6 w-6 text-success" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{record.vehicle} - {record.service}</h3>
                          <p className="text-sm text-muted-foreground">
                            Concluída em {record.completedDate ? new Date(record.completedDate).toLocaleDateString('pt-BR') : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MaintenanceSection;
