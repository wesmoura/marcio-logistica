import { useState } from "react";
import { FileText, Download, Calendar, TrendingUp, BarChart3, PieChart, Filter, Search, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const ReportsSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("month");
  const [filterType, setFilterType] = useState("all");
  const { toast } = useToast();

  const reportTemplates = [
    {
      id: "operational",
      title: "Relatório Operacional",
      description: "Desempenho geral da frota, viagens e motoristas",
      icon: Activity,
      frequency: "Diário, Semanal, Mensal",
      lastGenerated: "2024-08-07",
      category: "operational"
    },
    {
      id: "financial",
      title: "Relatório Financeiro",
      description: "Custos operacionais, combustível e manutenção",
      icon: TrendingUp,
      frequency: "Mensal, Trimestral",
      lastGenerated: "2024-08-01",
      category: "financial"
    },
    {
      id: "maintenance",
      title: "Relatório de Manutenção",
      description: "Histórico de manutenções e custos por veículo",
      icon: BarChart3,
      frequency: "Mensal",
      lastGenerated: "2024-07-30",
      category: "maintenance"
    },
    {
      id: "performance",
      title: "Relatório de Performance",
      description: "Eficiência de combustível e produtividade",
      icon: PieChart,
      frequency: "Semanal, Mensal",
      lastGenerated: "2024-08-05",
      category: "performance"
    }
  ];

  const recentReports: any[] = [];

  const metrics: any[] = [];

  const handleGenerateReport = (reportId: string) => {
    toast({
      title: "Relatório em geração!",
      description: "O relatório será gerado e estará disponível em breve.",
    });
  };

  const handleDownloadReport = (reportId: number) => {
    toast({
      title: "Download iniciado!",
      description: "O relatório está sendo baixado.",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string }> = {
      'completed': { variant: 'secondary', label: 'Concluído' },
      'generating': { variant: 'outline', label: 'Gerando...' },
      'failed': { variant: 'destructive', label: 'Erro' }
    };
    return variants[status] || { variant: 'default', label: 'Desconhecido' };
  };

  const CustomReportForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="reportName">Nome do Relatório</Label>
        <Input id="reportName" placeholder="Ex: Análise Mensal de Custos" />
      </div>
      
      <div>
        <Label htmlFor="reportType">Tipo de Relatório</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="operational">Operacional</SelectItem>
            <SelectItem value="financial">Financeiro</SelectItem>
            <SelectItem value="maintenance">Manutenção</SelectItem>
            <SelectItem value="performance">Performance</SelectItem>
            <SelectItem value="custom">Personalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Data Inicial</Label>
          <Input id="startDate" type="date" />
        </div>
        <div>
          <Label htmlFor="endDate">Data Final</Label>
          <Input id="endDate" type="date" />
        </div>
      </div>
      
      <div>
        <Label htmlFor="vehicles">Veículos</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecionar veículos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os veículos</SelectItem>
            <SelectItem value="cav001">CAV-001</SelectItem>
            <SelectItem value="cav002">CAV-002</SelectItem>
            <SelectItem value="cav003">CAV-003</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="format">Formato</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o formato" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="excel">Excel</SelectItem>
            <SelectItem value="csv">CSV</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button onClick={() => handleGenerateReport('custom')} className="w-full">
        <FileText className="h-4 w-4 mr-2" />
        Gerar Relatório
      </Button>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Central de Relatórios</h2>
          <p className="text-muted-foreground">Análises detalhadas e insights da sua frota</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <FileText className="h-4 w-4 mr-2" />
              Relatório Personalizado
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Relatório Personalizado</DialogTitle>
              <DialogDescription>
                Configure um relatório com os dados específicos que você precisa
              </DialogDescription>
            </DialogHeader>
            <CustomReportForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                    <p className="text-sm text-muted-foreground">{metric.title}</p>
                    <p className="text-xs text-success">{metric.change}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="templates">Modelos</TabsTrigger>
          <TabsTrigger value="recent">Recentes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="schedule">Agendados</TabsTrigger>
        </TabsList>

        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar relatórios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={filterPeriod} onValueChange={setFilterPeriod}>
            <SelectTrigger className="w-48">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mês</SelectItem>
              <SelectItem value="quarter">Este trimestre</SelectItem>
              <SelectItem value="year">Este ano</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="operational">Operacional</SelectItem>
              <SelectItem value="financial">Financeiro</SelectItem>
              <SelectItem value="maintenance">Manutenção</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {reportTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <Card key={template.id} className="hover:shadow-medium transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{template.title}</h3>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Frequência:</span>
                        <span className="text-foreground">{template.frequency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Último gerado:</span>
                        <span className="text-foreground">
                          {new Date(template.lastGenerated).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => handleGenerateReport(template.id)}
                      className="w-full"
                      variant="outline"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Gerar Relatório
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <div className="grid gap-4">
            {recentReports.map((report) => {
              const statusInfo = getStatusBadge(report.status);
              return (
                <Card key={report.id} className="hover:shadow-medium transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{report.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{report.type}</span>
                            <span>•</span>
                            <span>{report.period}</span>
                            <span>•</span>
                            <span>Gerado em {new Date(report.generatedDate).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                          <p className="text-xs text-muted-foreground mt-1">{report.size}</p>
                        </div>
                        {report.status === 'completed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadReport(report.id)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Avançado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Análise Inteligente</h3>
                <p className="text-muted-foreground mb-4">
                  Insights automáticos com machine learning para otimização da frota
                </p>
                <Button className="bg-gradient-primary">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Ver Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Agendados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Automação de Relatórios</h3>
                <p className="text-muted-foreground mb-4">
                  Configure relatórios para serem gerados automaticamente
                </p>
                <Button className="bg-gradient-primary">
                  <Calendar className="h-4 w-4 mr-2" />
                  Configurar Agendamento
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsSection;