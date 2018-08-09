import {Vehicle} from './vehicle';

export class UtilsVehicles {

    process(vehicles: Vehicle[]) {
        vehicles.forEach(vehicle => {
            vehicle.iconUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.3/images/marker-icon.png';
        });
        return vehicles;
    }
}