import { Truck, Users, MapPin, AlertTriangle, Fuel, Clock } from "lucide-react";
import MetricCard from "./MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DashboardSection = () => {
  const metrics: any[] = [];

  const recentTrips: any[] = [];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      'Em andamento': 'default',
      'Concluída': 'secondary',
      'Aguardando': 'destructive'
    };
    return variants[status] || 'default';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
        <p className="text-muted-foreground">Visão geral da sua frota em tempo real</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Viagens Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTrips.map((trip) => (
                <div key={trip.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                  <div className="space-y-1">
                    <div className="font-medium text-foreground">{trip.vehicle} - {trip.driver}</div>
                    <div className="text-sm text-muted-foreground">{trip.route}</div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusBadge(trip.status)}>{trip.status}</Badge>
                      <span className="text-xs text-muted-foreground">{trip.progress}% concluído</span>
                    </div>
                  </div>
                  <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-primary transition-all duration-300"
                      style={{ width: `${trip.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Alertas Prioritários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground p-4 border rounded-lg bg-muted/20">
              Nenhum alerta prioritário no momento.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardSection;