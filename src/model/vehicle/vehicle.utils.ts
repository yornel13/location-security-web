import {Vehicle} from './vehicle';

export class UtilsVehicles {

    processVehicles(vehicles: Vehicle[]): Vehicle[] {
        vehicles.forEach(vehicle => {
            this.processVehicle(vehicle);
        });
        return vehicles;
    }

    processVehicle(vehicle: Vehicle): Vehicle {
        switch (vehicle.model_name) {
            case 'Queclink GV300W_Ins':
                if (vehicle.alias.search('MOVIL')) {
                    vehicle.iconUrl = './assets/maps/water.png';
                } else {
                    vehicle.iconUrl = './assets/maps/truck.png';
                }
                break;
            case 'Queclink GMT100N':
                vehicle.iconUrl = './assets/maps/motorcycle.png';
                break;
            case 'GL300N':
                vehicle.iconUrl = './assets/maps/cellphone.png';
                break;
            case 'GMT100':
                vehicle.iconUrl = './assets/maps/motor-del.png';
                break;
        }
        return vehicle;
    }

  getHistoryIcon(history: any): string {
    if (!history.is_exception) {
      return null;
    }
    if (history.alert_message.includes('encendido')) {
      return './assets/alerts/on.png';
    } else if (history.alert_message.includes('apagado')) {
      return './assets/alerts/off.png';
    } else if (history.alert_message.includes('salió')) {
      return './assets/alerts/outside.png';
    } else if (history.alert_message.includes('llegó')) {
      return './assets/alerts/inside.png';
    } else if (history.alert_message.includes('velocidad')) {
      return './assets/alerts/speed.png';
    } else if (history.alert_message.includes('SOS')) {
        return './assets/alerts/sos.png';
    } else if (history.alert_message.includes('detuvo')) {
        return './assets/alerts/stop.png';
    } else if (history.alert_message.includes('carga')) {
        return './assets/alerts/charge.png';
    } else {
      return null;
    }
  }

  getHistoryIconTablet(history: any): string {
    if (history.message.includes('FINISHED_WATCH')) {
      return './assets/alerts/watch_end.png';
    } else if (history.message.includes('INIT_WATCH')) {
      return './assets/alerts/watch_start.png';
    } else if (history.message.includes('RESUMED_WATCH')) {
      return './assets/alerts/watch_start.png';
    } else {
      return null;
    }
  }
}
