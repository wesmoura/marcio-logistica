import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  MapPin, 
  Calendar, 
  FileText, 
  Settings,
  AlertTriangle,
  BarChart3,
  Fuel as FuelIcon,
  ShieldAlert,
  CircleDot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'vehicles', icon: Truck, label: 'Veículos' },
    { id: 'drivers', icon: Users, label: 'Motoristas' },
    { id: 'tracking', icon: MapPin, label: 'Rastreamento' },
    { id: 'maintenance', icon: Calendar, label: 'Manutenção' },
    { id: 'tires', icon: CircleDot, label: 'Pneus' },
    { id: 'fuel', icon: FuelIcon, label: 'Abastecimentos' },
    { id: 'freights', icon: ShieldAlert, label: 'Fretes (Risco)' },
    { id: 'reports', icon: BarChart3, label: 'Relatórios' },
    { id: 'alerts', icon: AlertTriangle, label: 'Alertas' },
    { id: 'documents', icon: FileText, label: 'Documentos' },
    { id: 'settings', icon: Settings, label: 'Configurações' },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border h-screen overflow-y-auto">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 transition-all duration-200",
                isActive 
                  ? "bg-gradient-primary text-primary-foreground shadow-medium" 
                  : "hover:bg-muted/50"
              )}
              onClick={() => onSectionChange(item.id)}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;