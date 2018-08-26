import { Component, OnInit } from '@angular/core';
import { WatchesService } from '../../../model/watch/watch.service';
import { BitacoraService } from '../../../model/bitacora/bitacora.service';
import { VisitasService } from '../../../model/visitas/visitas.service';
import { VehiclesService } from '../../../model/vehicle/vehicle.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent  {

  constructor(private watchesService:WatchesService, private bitacoraService:BitacoraService, 
    private vistasService:VisitasService, private vehicleService:VehiclesService) { 
    this.getWatchActive();
    this.getReportToday();
    this.getReportes();
    this.getVisitasActivas();
    this.getVehicles();

     this.dataSource = {
            chart: {
                "theme": "fusion",
                "showBorder": "0",
                "bgColor": "#FFFFFF",
                "bgAlpha": "50",
            },
            // Chart Data
            "data": [{
                "label": "Abiertos",
                "color": "#dc3545",
                "value": this.valores[0]
            }, {
                "label": "Reabiertos",
                "color": "#ffc107",
                "value": this.valores[1]
            }, {
                "label": "Cerrados",
                "color": "#28a745",
                "value": this.valores[2]
            }]
        };
  }

  //new chart
  dataSource:any = {};

  //visitas activas
  watches:any = undefined;
  watch:any = undefined;
  watchactive:number;
  //reportes hoy
  reportes:any = undefined;
  reportoday:number;
  //reportes totales
  reportesOpen:any = undefined;
  reportOpen:number;
  reportesReopen:any = undefined;
  reportReopen:number;
  reportesClose:any = undefined;
  reportClose:number;
  //visitasactivas
  visitas:any = undefined;
  visit:any = undefined;
  //vehicles
  vehicles:any = undefined;
  vehicle:any = undefined;
  numconnect:any = undefined;
  numdesconnect:any = undefined;
  valores:number[] = [1,1,1];


  getWatchActive() {
    this.watchesService.getAll().then(
        success => {
            this.watches = success;
            this.watch = this.watches.data;
            this.watchactive = this.verifyActive(this.watch);
        }, error => {
            if (error.status === 422) {
                // on some data incorrect
            } else {
                // on general error
            }
        }
    );
  }

  getVehicles() {
    this.vehicleService.getVehicles().subscribe(success => {
      this.vehicles = success;
      this.vehicle = this.vehicles.data;
      this.numconnect = this.getConnect(this.vehicle);
      var total = this.vehicles.total;
      this.numdesconnect = total - this.numconnect;
    })
  }

  getConnect(data) {
    var count = 0;
    if(data.length == 0){
      return 0;
    }else{
      for (var i=0; i < data.length; i++){
        if(data[i].device_status == 'ONLINE'){
          count ++;
        }
      }
      return count;
    }
  } 

  getReportToday() {
    this.bitacoraService.getAllToday().then(
        success => {
            this.reportes = success;
            this.reportoday = this.reportes.total;
        }, error => {
            if (error.status === 422) {
                // on some data incorrect
            } else {
                // on general error
            }
        }
    );
  }

  getVisitasActivas() {
    this.vistasService.getAllActive().then(
        success => {
            this.visitas = success;
            this.visit = this.visitas.data;
        }, error => {
            if (error.status === 422) {
                // on some data incorrect
            } else {
                // on general error
            }
        }
    );
  }

  getReportes() {
    //Abiertos
    this.bitacoraService.getOpen().then(
        success => {
            this.reportesOpen = success;
            var uno = this.reportesOpen.total;
            //Reabiertos
            this.bitacoraService.getReopen().then(
                success => {
                    this.reportesReopen = success;
                    var dos = this.reportesReopen.total;
                    //Close
                    this.bitacoraService.getCloseAll().then(
                        success => {
                            this.reportesClose = success;
                            var tres = this.reportesClose.total;
                             this.valores = [uno, dos, tres];
                             this.dataSource.data[0].value = this.valores[0];
                             this.dataSource.data[1].value = this.valores[1];
                             this.dataSource.data[2].value = this.valores[2];
                        }, error => {
                            if (error.status === 422) {
                                // on some data incorrect
                            } else {
                                // on general error
                            }
                        }
                    );
                }, error => {
                    if (error.status === 422) {
                        // on some data incorrect
                    } else {
                        // on general error
                    }
                }
            );  
        }, error => {
            if (error.status === 422) {
                // on some data incorrect
            } else {
                // on general error
            }
        }
    );  
  }

  verifyActive(data) {
    var valid = 0;
    if(data.length == 0){
      return 0;
    }else{
      for(var i = 0; i < data.length; i++){
        if(data[i].status == 1) {
          valid ++;
        }
      }
      return valid;
    }
  }

}
