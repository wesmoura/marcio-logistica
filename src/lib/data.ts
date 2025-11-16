import type { Driver } from "@/components/Drivers/DriverForm";
import type { Vehicle } from "@/components/Vehicles/VehicleForm";

export const loadDrivers = (): Driver[] => {
  try {
    const raw = localStorage.getItem("drivers");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Driver[]) : [];
  } catch {
    return [];
  }
};

export const loadVehicles = (): Vehicle[] => {
  try {
    const raw = localStorage.getItem("vehicles");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Vehicle[]) : [];
  } catch {
    return [];
  }
};

export const saveDrivers = (drivers: Driver[]) => {
  localStorage.setItem("drivers", JSON.stringify(drivers));
};

export const saveVehicles = (vehicles: Vehicle[]) => {
  localStorage.setItem("vehicles", JSON.stringify(vehicles));
};

export const assignDriverToVehicle = (driverId: string | null, vehicleId: string) => {
  const drivers = loadDrivers();
  const vehicles = loadVehicles();

  const vehicleIndex = vehicles.findIndex(v => v.id === vehicleId);
  if (vehicleIndex === -1) return;

  // Remove this driver from any other vehicle if necessary and clear previous assignments
  for (const v of vehicles) {
    if (driverId && v.driverId === driverId && v.id !== vehicleId) {
      v.driverId = undefined;
      v.driver = undefined;
    }
  }

  // If some other driver had this vehicle, clear their link
  for (const d of drivers) {
    if (d.veiculo_atual_id === vehicleId && d.id !== driverId) {
      d.veiculo_atual_id = undefined;
      d.veiculo_atual = undefined;
    }
  }

  if (driverId) {
    const driver = drivers.find(d => d.id === driverId);
    if (!driver) return;
    vehicles[vehicleIndex].driverId = driver.id;
    vehicles[vehicleIndex].driver = driver.nome;
    driver.veiculo_atual_id = vehicleId;
    driver.veiculo_atual = vehicles[vehicleIndex].plate;
  } else {
    // Unassign
    const previousDriverId = vehicles[vehicleIndex].driverId;
    vehicles[vehicleIndex].driverId = undefined;
    vehicles[vehicleIndex].driver = undefined;
    if (previousDriverId) {
      const prevDriver = drivers.find(d => d.id === previousDriverId);
      if (prevDriver && prevDriver.veiculo_atual_id === vehicleId) {
        prevDriver.veiculo_atual_id = undefined;
        prevDriver.veiculo_atual = undefined;
      }
    }
  }

  saveVehicles(vehicles);
  saveDrivers(drivers);
};

export const assignVehicleToDriver = (vehicleId: string | null, driverId: string) => {
  const drivers = loadDrivers();
  const vehicles = loadVehicles();

  const driverIndex = drivers.findIndex(d => d.id === driverId);
  if (driverIndex === -1) return;

  // Remove this vehicle from any other driver and clear previous links
  for (const d of drivers) {
    if (vehicleId && d.veiculo_atual_id === vehicleId && d.id !== driverId) {
      d.veiculo_atual_id = undefined;
      d.veiculo_atual = undefined;
    }
  }

  // If this driver had another vehicle, clear that vehicle's driver
  if (drivers[driverIndex].veiculo_atual_id && drivers[driverIndex].veiculo_atual_id !== vehicleId) {
    const oldVehicle = vehicles.find(v => v.id === drivers[driverIndex].veiculo_atual_id);
    if (oldVehicle && oldVehicle.driverId === driverId) {
      oldVehicle.driverId = undefined;
      oldVehicle.driver = undefined;
    }
  }

  if (vehicleId) {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return;
    drivers[driverIndex].veiculo_atual_id = vehicle.id;
    drivers[driverIndex].veiculo_atual = vehicle.plate;
    vehicle.driverId = drivers[driverIndex].id;
    vehicle.driver = drivers[driverIndex].nome;
  } else {
    // Unassign
    const previousVehicleId = drivers[driverIndex].veiculo_atual_id;
    drivers[driverIndex].veiculo_atual_id = undefined;
    drivers[driverIndex].veiculo_atual = undefined;
    if (previousVehicleId) {
      const prevVehicle = vehicles.find(v => v.id === previousVehicleId);
      if (prevVehicle && prevVehicle.driverId === driverId) {
        prevVehicle.driverId = undefined;
        prevVehicle.driver = undefined;
      }
    }
  }

  saveVehicles(vehicles);
  saveDrivers(drivers);
};


