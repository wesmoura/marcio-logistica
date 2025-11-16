import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, Clock, Activity, Zap, Route, Filter, Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import L from "leaflet";

const TrackingSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const [track, setTrack] = useState<L.LatLngExpression[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null);

  const liveVehicles: any[] = [];

  const getStatusInfo = (status: string) => {
    const statusMap = {
      moving: { label: "Em Movimento", variant: "default" as const, color: "text-success" },
      stopped: { label: "Parado", variant: "secondary" as const, color: "text-warning" },
      idle: { label: "Inativo", variant: "outline" as const, color: "text-muted-foreground" }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.idle;
  };

  const filteredVehicles = liveVehicles.filter(vehicle => {
    const matchesSearch = vehicle.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || vehicle.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;
    const map = L.map(mapRef.current).setView([-23.55052, -46.633308], 12);
    leafletMapRef.current = map;
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    const icon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    markerRef.current = L.marker([-23.55052, -46.633308], { icon }).addTo(map);
    polylineRef.current = L.polyline([], { color: "#16a34a", weight: 4 }).addTo(map);
  }, []);

  useEffect(() => {
    if (!leafletMapRef.current || !markerRef.current || !polylineRef.current || !pos) return;
    markerRef.current.setLatLng(pos);
    polylineRef.current.addLatLng(pos as L.LatLngExpression);
    leafletMapRef.current.panTo(pos);
  }, [pos]);

  useEffect(() => {
    let id: number | null = null;
    if (isSimulating) {
      let angle = 0;
      id = window.setInterval(() => {
        setPos((prev) => {
          const center = prev ?? { lat: -23.55052, lng: -46.633308 };
          angle += 0.05;
          const radius = 0.02; // ~2km
          const next = {
            lat: center.lat + Math.sin(angle) * radius,
            lng: center.lng + Math.cos(angle) * radius,
          };
          setTrack((t) => [...t, [next.lat, next.lng]]);
          return next;
        });
      }, 1000);
    }
    return () => {
      if (id) window.clearInterval(id);
    };
  }, [isSimulating]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Rastreamento em Tempo Real</h2>
          <p className="text-muted-foreground">Monitoramento completo da sua frota</p>
        </div>
        
        <Button className="bg-gradient-primary">
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      <Tabs defaultValue="live" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="live">Tempo Real</TabsTrigger>
          <TabsTrigger value="routes">Rotas</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="geofence">Geocercas</TabsTrigger>
        </TabsList>

        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar veículo ou motorista..."
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
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="moving">Em Movimento</SelectItem>
              <SelectItem value="stopped">Parados</SelectItem>
              <SelectItem value="idle">Inativos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="live" className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Status da Frota
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success">0</div>
                      <div className="text-sm text-muted-foreground">Em Movimento</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-warning">0</div>
                      <div className="text-sm text-muted-foreground">Parados</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-muted-foreground">0</div>
                      <div className="text-sm text-muted-foreground">Inativos</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                {filteredVehicles.map((vehicle) => {
                  const statusInfo = getStatusInfo(vehicle.status);
                  return (
                    <Card key={vehicle.id} className="hover:shadow-medium transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <MapPin className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">{vehicle.id}</h3>
                              <p className="text-sm text-muted-foreground">{vehicle.driver}</p>
                            </div>
                          </div>
                          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Navigation className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">Local:</span>
                            <span className="text-foreground">{vehicle.location}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Route className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">Rota:</span>
                            <span className="text-foreground">{vehicle.route}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <div className="flex items-center gap-2">
                              <Zap className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">Velocidade:</span>
                              <span className="text-foreground">{vehicle.speed} km/h</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">ETA:</span>
                              <span className="text-foreground">{vehicle.eta}</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center pt-2">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-success"></div>
                              <span className="text-xs text-muted-foreground">Combustível: {vehicle.fuelLevel}%</span>
                            </div>
                            <span className="text-xs text-muted-foreground">Atualizado {vehicle.lastUpdate}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Mapa em Tempo Real
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96 rounded-lg overflow-hidden relative">
                    <div ref={mapRef} className="absolute inset-0" />
                    <div className="absolute top-2 left-2 z-[400] flex gap-2">
                      <Button size="sm" onClick={() => setIsSimulating((v) => !v)}>
                        {isSimulating ? "Parar simulação" : "Iniciar simulação"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => {
                        setTrack([]);
                        setPos(null);
                        if (polylineRef.current) polylineRef.current.setLatLngs([]);
                      }}>
                        Limpar trilha
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="routes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Planejamento de Rotas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <Route className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Planejamento de Rotas</h3>
                <p className="text-muted-foreground mb-4">
                  Otimize rotas, calcule combustível e tempo estimado
                </p>
                <Button className="bg-gradient-primary">
                  <Route className="h-4 w-4 mr-2" />
                  Criar Nova Rota
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Viagens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Histórico Completo</h3>
                <p className="text-muted-foreground mb-4">
                  Acesse relatórios detalhados de todas as viagens realizadas
                </p>
                <Button variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Ver Histórico
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geofence" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Geocercas e Zonas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <Navigation className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Zonas de Segurança</h3>
                <p className="text-muted-foreground mb-4">
                  Configure áreas permitidas e receba alertas de desvio
                </p>
                <Button className="bg-gradient-primary">
                  <Navigation className="h-4 w-4 mr-2" />
                  Configurar Geocercas
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrackingSection;