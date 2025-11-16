import { useState } from "react";
import { Plus, FileText, Upload, Calendar, User, Truck, Search, Filter } from "lucide-react";
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

const DocumentsSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const { toast } = useToast();

  const mockDocuments: any[] = [];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string }> = {
      'valid': { variant: 'secondary', label: 'Válido' },
      'expiring': { variant: 'outline', label: 'Vencendo' },
      'expired': { variant: 'destructive', label: 'Vencido' }
    };
    return variants[status] || { variant: 'default', label: 'Desconhecido' };
  };

  const handleAddDocument = () => {
    toast({
      title: "Documento adicionado!",
      description: "O documento foi cadastrado com sucesso.",
    });
  };

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.entityName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || doc.type.toLowerCase() === filterType.toLowerCase();
    const matchesStatus = filterStatus === "all" || doc.status === filterStatus;
    const matchesCategory = filterType === "all" || filterType === "motorista" || filterType === "veiculo" 
      ? true : doc.category === filterType;
    
    return matchesSearch && matchesType && matchesStatus && matchesCategory;
  });

  const AddDocumentForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="docType">Tipo de Documento</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cnh">CNH</SelectItem>
            <SelectItem value="crlv">CRLV</SelectItem>
            <SelectItem value="seguro">Seguro</SelectItem>
            <SelectItem value="licenca">Licença</SelectItem>
            <SelectItem value="certificado">Certificado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="category">Categoria</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="motorista">Motorista</SelectItem>
            <SelectItem value="veiculo">Veículo</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="entity">Motorista/Veículo</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="joao">João Silva</SelectItem>
            <SelectItem value="maria">Maria Santos</SelectItem>
            <SelectItem value="cav001">CAV-001</SelectItem>
            <SelectItem value="cav002">CAV-002</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="expiryDate">Data de Validade</Label>
        <Input id="expiryDate" type="date" />
      </div>
      
      <div>
        <Label htmlFor="file">Arquivo</Label>
        <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-2">Clique para fazer upload ou arraste o arquivo aqui</p>
          <Input id="file" type="file" accept=".pdf,.jpg,.jpeg,.png" className="w-full" />
        </div>
      </div>
      
      <div>
        <Label htmlFor="notes">Observações</Label>
        <Textarea id="notes" placeholder="Observações adicionais..." />
      </div>
      
      <Button onClick={handleAddDocument} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Adicionar Documento
      </Button>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Gestão de Documentos</h2>
          <p className="text-muted-foreground">Controle total dos documentos de motoristas e veículos</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Novo Documento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Documento</DialogTitle>
              <DialogDescription>
                Cadastre um novo documento para motorista ou veículo
              </DialogDescription>
            </DialogHeader>
            <AddDocumentForm />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="motorista">Motoristas</TabsTrigger>
          <TabsTrigger value="veiculo">Veículos</TabsTrigger>
          <TabsTrigger value="expiring">Vencendo</TabsTrigger>
        </TabsList>

        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="cnh">CNH</SelectItem>
              <SelectItem value="crlv">CRLV</SelectItem>
              <SelectItem value="seguro">Seguro</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="valid">Válidos</SelectItem>
              <SelectItem value="expiring">Vencendo</SelectItem>
              <SelectItem value="expired">Vencidos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {filteredDocuments.map((doc) => {
              const statusInfo = getStatusBadge(doc.status);
              return (
                <Card key={doc.id} className="hover:shadow-medium transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{doc.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {doc.category === 'motorista' ? (
                              <User className="h-3 w-3" />
                            ) : (
                              <Truck className="h-3 w-3" />
                            )}
                            <span>{doc.entityName}</span>
                            <span>•</span>
                            <Calendar className="h-3 w-3" />
                            <span>Vence: {new Date(doc.expiryDate).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge variant={statusInfo.variant}>
                          {statusInfo.label}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="motorista">
          <div className="grid gap-4">
            {filteredDocuments.filter(doc => doc.category === 'motorista').map((doc) => {
              const statusInfo = getStatusBadge(doc.status);
              return (
                <Card key={doc.id} className="hover:shadow-medium transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-secondary/10">
                          <User className="h-6 w-6 text-secondary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{doc.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Vence: {new Date(doc.expiryDate).toLocaleDateString('pt-BR')}
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

        <TabsContent value="veiculo">
          <div className="grid gap-4">
            {filteredDocuments.filter(doc => doc.category === 'veiculo').map((doc) => {
              const statusInfo = getStatusBadge(doc.status);
              return (
                <Card key={doc.id} className="hover:shadow-medium transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-accent/10">
                          <Truck className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{doc.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Vence: {new Date(doc.expiryDate).toLocaleDateString('pt-BR')}
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

        <TabsContent value="expiring">
          <div className="grid gap-4">
            {filteredDocuments.filter(doc => doc.status === 'expiring' || doc.status === 'expired').map((doc) => {
              const statusInfo = getStatusBadge(doc.status);
              return (
                <Card key={doc.id} className="hover:shadow-medium transition-shadow border-warning/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-warning/10">
                          <FileText className="h-6 w-6 text-warning" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{doc.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {doc.category === 'motorista' ? (
                              <User className="h-3 w-3" />
                            ) : (
                              <Truck className="h-3 w-3" />
                            )}
                            <span>{doc.entityName}</span>
                          </div>
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

export default DocumentsSection;