import { useState } from "react";
import { Settings, User, Bell, Shield, Database, Key, Globe, Palette, Truck, Users as UsersIcon, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const SettingsSection = () => {
  const { toast } = useToast();

  const handleSaveSettings = (section: string) => {
    toast({
      title: "Configurações salvas!",
      description: `As configurações de ${section} foram atualizadas com sucesso.`,
    });
  };

  const CompanyProfileForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="companyName">Nome da Empresa</Label>
          <Input id="companyName" defaultValue="FleetPro Transportes" />
        </div>
        <div>
          <Label htmlFor="cnpj">CNPJ</Label>
          <Input id="cnpj" defaultValue="12.345.678/0001-90" />
        </div>
        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input id="phone" defaultValue="(11) 99999-9999" />
        </div>
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" defaultValue="contato@fleetpro.com" type="email" />
        </div>
      </div>
      
      <div>
        <Label htmlFor="address">Endereço</Label>
        <Textarea id="address" defaultValue="Rua das Flores, 123 - Centro - São Paulo - SP - 01234-567" />
      </div>
      
      <div>
        <Label htmlFor="description">Descrição da Empresa</Label>
        <Textarea id="description" placeholder="Descrição das atividades da empresa..." />
      </div>
      
      <Button onClick={() => handleSaveSettings('perfil da empresa')} className="w-full">
        Salvar Alterações
      </Button>
    </div>
  );

  const NotificationSettingsForm = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Preferências de Notificação</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-alerts">Alertas por E-mail</Label>
              <p className="text-sm text-muted-foreground">Receber alertas importantes por e-mail</p>
            </div>
            <Switch id="email-alerts" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sms-alerts">Alertas por SMS</Label>
              <p className="text-sm text-muted-foreground">Receber alertas críticos por SMS</p>
            </div>
            <Switch id="sms-alerts" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notifications">Notificações Push</Label>
              <p className="text-sm text-muted-foreground">Notificações no navegador</p>
            </div>
            <Switch id="push-notifications" defaultChecked />
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h4 className="font-medium mb-3">Frequência de Relatórios</h4>
        <div className="space-y-3">
          <div>
            <Label htmlFor="daily-reports">Relatórios Diários</Label>
            <Select defaultValue="enabled">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enabled">Habilitado</SelectItem>
                <SelectItem value="disabled">Desabilitado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="weekly-reports">Relatórios Semanais</Label>
            <Select defaultValue="enabled">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enabled">Habilitado</SelectItem>
                <SelectItem value="disabled">Desabilitado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <Button onClick={() => handleSaveSettings('notificações')} className="w-full">
        Salvar Configurações
      </Button>
    </div>
  );

  const SecuritySettingsForm = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Configurações de Segurança</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="current-password">Senha Atual</Label>
            <Input id="current-password" type="password" />
          </div>
          
          <div>
            <Label htmlFor="new-password">Nova Senha</Label>
            <Input id="new-password" type="password" />
          </div>
          
          <div>
            <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
            <Input id="confirm-password" type="password" />
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h4 className="font-medium mb-3">Autenticação de Dois Fatores</h4>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="two-factor">Habilitar 2FA</Label>
            <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança</p>
          </div>
          <Switch id="two-factor" />
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h4 className="font-medium mb-3">Sessões Ativas</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 border rounded-lg">
            <div>
              <p className="font-medium">Desktop - Chrome</p>
              <p className="text-sm text-muted-foreground">São Paulo, SP - Agora</p>
            </div>
            <Badge variant="secondary">Atual</Badge>
          </div>
          <div className="flex justify-between items-center p-3 border rounded-lg">
            <div>
              <p className="font-medium">Mobile - Safari</p>
              <p className="text-sm text-muted-foreground">São Paulo, SP - 2h atrás</p>
            </div>
            <Button variant="outline" size="sm">Revogar</Button>
          </div>
        </div>
      </div>
      
      <Button onClick={() => handleSaveSettings('segurança')} className="w-full">
        Salvar Configurações
      </Button>
    </div>
  );

  const FleetSettingsForm = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Configurações da Frota</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="fuel-type">Tipo de Combustível Padrão</Label>
            <Select defaultValue="diesel">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="gasoline">Gasolina</SelectItem>
                <SelectItem value="ethanol">Etanol</SelectItem>
                <SelectItem value="cng">GNV</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="maintenance-interval">Intervalo de Manutenção (km)</Label>
            <Input id="maintenance-interval" type="number" defaultValue="10000" />
          </div>
          
          <div>
            <Label htmlFor="speed-limit">Limite de Velocidade (km/h)</Label>
            <Input id="speed-limit" type="number" defaultValue="80" />
          </div>
          
          <div>
            <Label htmlFor="idle-time">Tempo Máximo Parado (min)</Label>
            <Input id="idle-time" type="number" defaultValue="30" />
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h4 className="font-medium mb-3">Configurações de Rastreamento</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="real-time-tracking">Rastreamento em Tempo Real</Label>
              <p className="text-sm text-muted-foreground">Atualizar posição a cada 30 segundos</p>
            </div>
            <Switch id="real-time-tracking" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="geo-fencing">Geocercas</Label>
              <p className="text-sm text-muted-foreground">Alertas para saída de áreas definidas</p>
            </div>
            <Switch id="geo-fencing" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="route-optimization">Otimização de Rotas</Label>
              <p className="text-sm text-muted-foreground">Sugerir rotas mais eficientes</p>
            </div>
            <Switch id="route-optimization" defaultChecked />
          </div>
        </div>
      </div>
      
      <Button onClick={() => handleSaveSettings('frota')} className="w-full">
        Salvar Configurações
      </Button>
    </div>
  );

  const SystemSettingsForm = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Configurações do Sistema</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="timezone">Fuso Horário</Label>
            <Select defaultValue="america-sao_paulo">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="america-sao_paulo">América/São_Paulo</SelectItem>
                <SelectItem value="america-new_york">América/New_York</SelectItem>
                <SelectItem value="europe-london">Europa/Londres</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="language">Idioma</Label>
            <Select defaultValue="pt-br">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt-br">Português (Brasil)</SelectItem>
                <SelectItem value="en-us">English (US)</SelectItem>
                <SelectItem value="es-es">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="currency">Moeda</Label>
            <Select defaultValue="brl">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="brl">Real (BRL)</SelectItem>
                <SelectItem value="usd">Dólar (USD)</SelectItem>
                <SelectItem value="eur">Euro (EUR)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="date-format">Formato de Data</Label>
            <Select defaultValue="dd-mm-yyyy">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dd-mm-yyyy">DD/MM/AAAA</SelectItem>
                <SelectItem value="mm-dd-yyyy">MM/DD/AAAA</SelectItem>
                <SelectItem value="yyyy-mm-dd">AAAA-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h4 className="font-medium mb-3">Backup e Sincronização</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-backup">Backup Automático</Label>
              <p className="text-sm text-muted-foreground">Backup diário dos dados</p>
            </div>
            <Switch id="auto-backup" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="cloud-sync">Sincronização na Nuvem</Label>
              <p className="text-sm text-muted-foreground">Sincronizar dados em tempo real</p>
            </div>
            <Switch id="cloud-sync" defaultChecked />
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h4 className="font-medium mb-3">Manutenção do Sistema</h4>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Database className="h-4 w-4 mr-2" />
            Limpar Cache do Sistema
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Key className="h-4 w-4 mr-2" />
            Regenerar Chaves de API
          </Button>
        </div>
      </div>
      
      <Button onClick={() => handleSaveSettings('sistema')} className="w-full">
        Salvar Configurações
      </Button>
    </div>
  );

  const IntegrationsForm = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Integrações Disponíveis</h3>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Google Maps API</h4>
                    <p className="text-sm text-muted-foreground">Rastreamento e rotas</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <Mail className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-medium">SendGrid</h4>
                    <p className="text-sm text-muted-foreground">Envio de e-mails</p>
                  </div>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Phone className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-medium">Twilio</h4>
                    <p className="text-sm text-muted-foreground">SMS e chamadas</p>
                  </div>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h4 className="font-medium mb-3">Configurações de API</h4>
        <div className="space-y-3">
          <div>
            <Label htmlFor="api-key">Chave da API</Label>
            <Input id="api-key" value="sk_test_..." readOnly />
          </div>
          <Button variant="outline" className="w-full">
            <Key className="h-4 w-4 mr-2" />
            Gerar Nova Chave
          </Button>
        </div>
      </div>
      
      <Button onClick={() => handleSaveSettings('integrações')} className="w-full">
        Salvar Configurações
      </Button>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Configurações</h2>
        <p className="text-muted-foreground">Gerencie todas as configurações da sua aplicação</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="fleet" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Frota
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Sistema
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Integrações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Perfil da Empresa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CompanyProfileForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Configurações de Notificação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <NotificationSettingsForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Segurança e Privacidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SecuritySettingsForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fleet">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Configurações da Frota
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FleetSettingsForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SystemSettingsForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Integrações e APIs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <IntegrationsForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsSection;