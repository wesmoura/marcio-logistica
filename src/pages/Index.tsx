import { useState } from "react";
import Header from "@/components/Layout/Header";
import Sidebar from "@/components/Layout/Sidebar";
import DashboardSection from "@/components/Dashboard/DashboardSection";
import VehiclesSection from "@/components/Vehicles/VehiclesSection";
import DriversSection from "@/components/Drivers/DriversSection";
import TrackingSection from "@/components/Tracking/TrackingSection";
import MaintenanceSection from "@/components/Maintenance/MaintenanceSection";
import ReportsSection from "@/components/Reports/ReportsSection";
import AlertsSection from "@/components/Alerts/AlertsSection";
import DocumentsSection from "@/components/Documents/DocumentsSection";
import SettingsSection from "@/components/Settings/SettingsSection";
import TiresSection from "@/components/Tires/TiresSection";
import FuelSection from "@/components/Fuel/FuelSection";
import FreightsSection from "@/components/Freights/FreightsSection";

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardSection />;
      case 'vehicles':
        return <VehiclesSection />;
      case 'drivers':
        return <DriversSection />;
      case 'tracking':
        return <TrackingSection />;
      case 'maintenance':
        return <MaintenanceSection />;
      case 'reports':
        return <ReportsSection />;
      case 'alerts':
        return <AlertsSection />;
      case 'documents':
        return <DocumentsSection />;
      case 'tires':
        return <TiresSection />;
      case 'fuel':
        return <FuelSection />;
      case 'freights':
        return <FreightsSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <DashboardSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <Header />
      <div className="flex">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className="flex-1 p-6 overflow-y-auto">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default Index;
