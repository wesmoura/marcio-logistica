import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  year: string;
  driverId?: string;
  driver?: string;
  status: "Disponível" | "Em viagem" | "Manutenção";
  mileage?: string;
  location?: string;
  nextMaintenance?: string;
}

interface VehicleFormProps {
  onClose: () => void;
  onSaved: (vehicle: Vehicle) => void;
}

const VehicleForm = ({ onClose, onSaved }: VehicleFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    plate: "",
    model: "",
    year: "",
    driverId: "",
    status: "Disponível" as Vehicle["status"],
    mileage: "",
    location: "",
    nextMaintenance: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const driversRaw = localStorage.getItem("drivers");
      const drivers = driversRaw ? JSON.parse(driversRaw) : [];
      const selectedDriver = drivers.find((d: any) => d.id === formData.driverId);

      const vehicle: Vehicle = {
        id: String(Date.now()),
        plate: formData.plate.trim(),
        model: formData.model.trim(),
        year: formData.year,
        driverId: formData.driverId || undefined,
        driver: selectedDriver?.nome,
        status: formData.status,
        mileage: formData.mileage || undefined,
        location: formData.location || undefined,
        nextMaintenance: formData.nextMaintenance || undefined,
      };

      onSaved(vehicle);

      toast({
        title: "Veículo cadastrado!",
        description: "O veículo foi cadastrado com sucesso.",
      });
      onClose();
    } catch (error) {
      console.error("Erro ao cadastrar veículo:", error);
      toast({
        title: "Erro ao cadastrar",
        description: "Ocorreu um erro ao cadastrar o veículo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Cadastrar Novo Veículo</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plate">Placa *</Label>
              <Input id="plate" value={formData.plate} onChange={(e) => handleInputChange("plate", e.target.value.toUpperCase())} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Modelo *</Label>
              <Input id="model" value={formData.model} onChange={(e) => handleInputChange("model", e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Ano *</Label>
              <Input id="year" type="number" value={formData.year} onChange={(e) => handleInputChange("year", e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="driver">Motorista</Label>
              <Select value={formData.driverId || "none"} onValueChange={(v) => handleInputChange("driverId", v === "none" ? "" : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um motorista" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem motorista</SelectItem>
                  {(JSON.parse(localStorage.getItem("drivers") || "[]") as any[]).map(d => (
                    <SelectItem key={d.id} value={d.id}>{d.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(v) => handleInputChange("status", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Disponível">Disponível</SelectItem>
                  <SelectItem value="Em viagem">Em viagem</SelectItem>
                  <SelectItem value="Manutenção">Manutenção</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage">Quilometragem</Label>
              <Input id="mileage" type="number" value={formData.mileage} onChange={(e) => handleInputChange("mileage", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Localização</Label>
              <Input id="location" value={formData.location} onChange={(e) => handleInputChange("location", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nextMaintenance">Próxima Manutenção</Label>
              <Input id="nextMaintenance" type="date" value={formData.nextMaintenance} onChange={(e) => handleInputChange("nextMaintenance", e.target.value)} />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Cadastrando..." : "Cadastrar Veículo"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default VehicleForm;


