import { useState } from "react";
import { AlertTriangle, Bell, CheckCircle2, Clock, Filter, Search, Settings, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const AlertsSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const { toast } = useToast();

  const alerts: any[] = [];

  const alertStats = [
    { title: "Alertas Ativos", value: 0, color: "text-destructive", icon: AlertTriangle },
    { title: "Reconhecidos", value: 0, color: "text-warning", icon: Eye },
    { title: "Resolvidos Hoje", value: 0, color: "text-success", icon: CheckCircle2 },
    { title: "Pendentes", value: 0, color: "text-primary", icon: Clock }
  ];

  const getPriorityInfo = (priority: string) => {
    const priorityMap = {
      high: { label: "Alta", variant: "destructive" as const, color: "text-destructive" },
      medium: { label: "Média", variant: "outline" as const, color: "text-warning" },
      low: { label: "Baixa", variant: "secondary" as const, color: "text-success" }
    };
    return priorityMap[priority as keyof typeof priorityMap] || priorityMap.medium;
  };

  const getStatusInfo = (status: string) => {
    const statusMap = {
      active: { label: "Ativo", variant: "destructive" as const, icon: AlertTriangle },
      acknowledged: { label: "Reconhecido", variant: "outline" as const, icon: Eye },
      resolved: { label: "Resolvido", variant: "secondary" as const, icon: CheckCircle2 }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.active;
  };

  const getCategoryInfo = (category: string) => {
    const categoryMap = {
      maintenance: { label: "Manutenção", color: "bg-destructive/10 text-destructive" },
      speed: { label: "Velocidade", color: "bg-warning/10 text-warning" },
      document: { label: "Documento", color: "bg-primary/10 text-primary" },
      route: { label: "Rota", color: "bg-accent/10 text-accent" },
      fuel: { label: "Combustível", color: "bg-secondary/10 text-secondary" }
    };
    return categoryMap[category as keyof typeof categoryMap] || categoryMap.maintenance;
  };

  const handleAcknowledgeAlert = (alertId: number) => {
    toast({
      title: "Alerta reconhecido!",
      description: "O alerta foi marcado como reconhecido.",
    });
  };

  const handleResolveAlert = (alertId: number) => {
    toast({
      title: "Alerta resolvido!",
      description: "O alerta foi marcado como resolvido.",
    });
  };

  const handleDismissAlert = (alertId: number) => {
    toast({
      title: "Alerta descartado!",
      description: "O alerta foi removido da lista.",
    });
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.driver.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || alert.status === filterStatus;
    const matchesPriority = filterPriority === "all" || alert.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const AlertSettingsForm = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Configurações de Alerta</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="speed-alerts">Alertas de Velocidade</Label>
              <p className="text-sm text-muted-foreground">Notificar quando exceder limite</p>
            </div>
            <Switch id="speed-alerts" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="maintenance-alerts">Alertas de Manutenção</Label>
              <p className="text-sm text-muted-foreground">Notificar sobre manutenções vencidas</p>
            </div>
            <Switch id="maintenance-alerts" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="route-alerts">Alertas de Rota</Label>
              <p className="text-sm text-muted-foreground">Notificar sobre desvios de rota</p>
            </div>
            <Switch id="route-alerts" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="document-alerts">Alertas de Documentos</Label>
              <p className="text-sm text-muted-foreground">Notificar sobre documentos vencendo</p>
            </div>
            <Switch id="document-alerts" defaultChecked />
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="font-medium mb-3">Configurações de Notificação</h4>
        <div className="space-y-3">
          <div>
            <Label htmlFor="email-notifications">Notificações por Email</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Imediata</SelectItem>
                <SelectItem value="daily">Resumo Diário</SelectItem>
                <SelectItem value="weekly">Resumo Semanal</SelectItem>
                <SelectItem value="disabled">Desabilitada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="sms-notifications">Notificações por SMS</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">Apenas Prioridade Alta</SelectItem>
                <SelectItem value="medium">Média e Alta</SelectItem>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="disabled">Desabilitada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <Button className="w-full">
        <Settings className="h-4 w-4 mr-2" />
        Salvar Configurações
      </Button>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Central de Alertas</h2>
          <p className="text-muted-foreground">Monitore e gerencie todos os alertas da sua frota</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Configurações de Alerta</DialogTitle>
              <DialogDescription>
                Configure como e quando receber notificações
              </DialogDescription>
            </DialogHeader>
            <AlertSettingsForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {alertStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="active">Ativos</TabsTrigger>
          <TabsTrigger value="acknowledged">Reconhecidos</TabsTrigger>
          <TabsTrigger value="resolved">Resolvidos</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="rules">Regras</TabsTrigger>
        </TabsList>

        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar alertas..."
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
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="acknowledged">Reconhecidos</SelectItem>
              <SelectItem value="resolved">Resolvidos</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {filteredAlerts.filter(alert => alert.status === 'active').map((alert) => {
              const priorityInfo = getPriorityInfo(alert.priority);
              const statusInfo = getStatusInfo(alert.status);
              const categoryInfo = getCategoryInfo(alert.category);
              const StatusIcon = statusInfo.icon;
              
              return (
                <Card key={alert.id} className="hover:shadow-medium transition-shadow border-destructive/50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-destructive/10">
                          <StatusIcon className="h-6 w-6 text-destructive" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-foreground">{alert.title}</h3>
                            <Badge variant={priorityInfo.variant}>{priorityInfo.label}</Badge>
                            <span className={`px-2 py-1 rounded-full text-xs ${categoryInfo.color}`}>
                              {categoryInfo.label}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                          <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                            <div>
                              <span className="font-medium">Veículo:</span> {alert.vehicle}
                            </div>
                            <div>
                              <span className="font-medium">Motorista:</span> {alert.driver}
                            </div>
                            <div>
                              <span className="font-medium">Local:</span> {alert.location}
                            </div>
                            <div>
                              <span className="font-medium">Horário:</span> {alert.timestamp}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAcknowledgeAlert(alert.id)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Reconhecer
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResolveAlert(alert.id)}
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Resolver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDismissAlert(alert.id)}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Descartar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="acknowledged" className="space-y-4">
          <div className="grid gap-4">
            {filteredAlerts.filter(alert => alert.status === 'acknowledged').map((alert) => {
              const priorityInfo = getPriorityInfo(alert.priority);
              const categoryInfo = getCategoryInfo(alert.category);
              
              return (
                <Card key={alert.id} className="hover:shadow-medium transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-warning/10">
                          <Eye className="h-6 w-6 text-warning" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">{alert.title}</h3>
                            <Badge variant={priorityInfo.variant}>{priorityInfo.label}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{alert.description}</p>
                          <p className="text-xs text-muted-foreground">{alert.vehicle} - {alert.driver}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResolveAlert(alert.id)}
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Resolver
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          <div className="grid gap-4">
            {filteredAlerts.filter(alert => alert.status === 'resolved').map((alert) => {
              const categoryInfo = getCategoryInfo(alert.category);
              
              return (
                <Card key={alert.id} className="hover:shadow-medium transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-success/10">
                        <CheckCircle2 className="h-6 w-6 text-success" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{alert.title}</h3>
                          <Badge variant="secondary">Resolvido</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {alert.vehicle} - {alert.driver} - Resolvido em {alert.timestamp}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Alertas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Histórico Completo</h3>
                <p className="text-muted-foreground mb-4">
                  Consulte o histórico completo de todos os alertas gerados
                </p>
                <Button variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Ver Histórico Completo
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Regras de Alerta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Configuração de Regras</h3>
                <p className="text-muted-foreground mb-4">
                  Configure regras personalizadas para geração automática de alertas
                </p>
                <Button className="bg-gradient-primary">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar Regras
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AlertsSection;