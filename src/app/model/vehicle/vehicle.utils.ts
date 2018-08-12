import {Vehicle} from './vehicle';

export class UtilsVehicles {

    processVehicles(vehicles: Vehicle[]) {
        vehicles.forEach(vehicle => {
            switch (vehicle.model_name) {
                case 'Queclink GV300W_Ins': {
                    if (vehicle.alias.search('MOVIL')) {
                        vehicle.iconUrl = './assets/maps/water.png';
                    } else {
                        vehicle.iconUrl = './assets/maps/truck.png';
                    }
                }
                    break;
                case 'Queclink GMT100N': {
                    vehicle.iconUrl = './assets/maps/motorcycle.png';
                }
                    break;
                case 'GL300N': {
                    vehicle.iconUrl = './assets/maps/cellphone.png';
                }
                    break;
                case 'GMT100': {
                    vehicle.iconUrl = './assets/maps/motor-del.png';
                }
                    break;
                }


        });
        return vehicles;
    }
}
