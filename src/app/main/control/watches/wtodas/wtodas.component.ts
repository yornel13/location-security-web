import { Component, OnInit } from '@angular/core';
import { WatchesService } from '../../../../../model/watch/watch.service';
import { GuardService } from '../../../../../model/guard/guard.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExcelService } from '../../../../../model/excel/excel.services';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import * as geolib from 'geolib';

@Component({
  selector: 'app-wtodas',
  templateUrl: './wtodas.component.html',
  styleUrls: ['./wtodas.component.css']
})
export class WtodasComponent {
  lista:boolean;
  detalle:boolean;
  watches:any = undefined;
  data:any = undefined;
  filter:string;
  //filtro guardia
  guardias:any = [];
  guard:any = [];
  guardiaSelect:number = 0;
  //filtro fecha
  dateSelect:string = '';
  valueDate:any = [];
  guardia:any = [];
  numElement:number = 10;
  //exportaciones
  contpdf:any = [];
  info: any = [];

  key: string = 'id'; //set default
  reverse: boolean = true;

  //map
  map: any;
  mapchart: any;
  lat:number= -2.0000;
  lng:number = -79.0000;
  viewmap:boolean = false;

  zoom: 12;
  center = L.latLng(([ this.lat, this.lng ]));
  marker = L.marker([this.lat, this.lng], {draggable: false});

  LAYER_OSM = {
        id: 'openstreetmap',
        name: 'Open Street Map',
        enabled: false,
        layer: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 20,
            detectRetina: true,
            attribution: 'Open Street Map'
        })
    };
    LAYER_GOOGLE_STREET = {
        id: 'googlestreets',
        name: 'Google Street Map',
        enabled: false,
        layer: L.tileLayer('http://{s}.google.com/vt/lyrs=marker&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            attribution: 'Google Street Map'
        })
    };
    LAYER_GOOGLE_SATELLITE = {
        id: 'googlesatellite',
        name: 'Google Satellite Map',
        enabled: false,
        layer: L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            attribution: 'Google Satellite Map'
        })
    };
    LAYER_GOOGLE_TERRAIN = {
        id: 'googletarrain',
        name: 'Google Terrain Map',
        enabled: false,
        layer: L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            attribution: 'Google Terrain Map'
        })
    };

  constructor(private watchesService:WatchesService, private guardiasService:GuardService, private excelService:ExcelService) {
  	this.getAll();
  	this.getGuard();
  	this.lista = true;
  	this.detalle = false;
  }

  // Values to bind to Leaflet Directive
    layersControlOptions = { position: 'bottomright' };
    baseLayers = {
        'Open Street Map': this.LAYER_OSM.layer,
        'Google Street Map': this.LAYER_GOOGLE_STREET.layer,
        'Google Satellite Map': this.LAYER_GOOGLE_SATELLITE.layer,
        'Google Terrain Map': this.LAYER_GOOGLE_TERRAIN.layer
    };
    options = {
        zoom: 12,
        center: L.latLng(([this.lat, this.lng ]))
    };

    onMapReady(map: L.Map) {
      console.log("entra aqui");
      this.map =  map;
        this.zoom = 12;
        this.center = L.latLng(([ this.lat, this.lng ]));
      this.marker = L.marker([this.lat, this.lng], {draggable: false});
      this.layersControlOptions = { position: 'bottomright' };
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 20,
            detectRetina: true,
            attribution: 'Open Street Map'
        }).addTo(this.map);
        this.marker.addTo(this.map);
    }

    onMapReadyChart(map:L.Map){
      console.log("vamos a ver si entra");
      this.mapchart = map;
      this.zoom = 12;
      this.layersControlOptions = { position: 'bottomright' };
      var southWest = new L.LatLng(-2.100599,-79.560921);
      var northEast = new L.LatLng(-2.030906,-79.568947);            
      var bounds = new L.LatLngBounds(southWest, northEast);
      if(this.data.length){
        var coord = [];
        for(var i=0; i<this.data.length; i++){
          var lat = Number(this.data[i].latitude);
          var lng = Number(this.data[i].longitude);
          var maker = L.marker([lat, lng]).addTo(this.mapchart);
          coord.push({latitude: lat, longitude: lng});
          bounds.extend(maker.getLatLng());
        }
        this.mapchart.fitBounds(bounds);
        var centro = geolib.getCenter(coord);
      }
      console.log(centro);
      this.center = L.latLng([centro.latitude, centro.longitude]);
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 20,
            detectRetina: true,
            attribution: 'Open Street Map'
        }).addTo(this.mapchart);
    }

  sort(key){
    this.key = key;
    this.reverse = !this.reverse;
  }

  getAll() {
  	this.watchesService.getAll().then(
        success => {
            this.watches = success;
            this.data = this.watches.data;
            var body = [];
            var excel = [];
            var status = "";
            for(var i=0; i<this.data.length; i++){
                if(this.data[i].status == 0){
                  status = "Finalizada";
                }else if(this.data[i].status == 1){
                  status = "Activa";
                  this.data[i].update_date = "--";
                }
                excel.push({'#' : this.data[i].id, 'Nombre del Guardia': this.data[i].guard_name+' '+this.data[i].guard_lastname, 'Cédula del Guardia':this.data[i].guard_dni, 'Hora de inicio':this.data[i].create_date, 'Hora de finalización':this.data[i].update_date, 'Status':status})
                body.push([this.data[i].id, this.data[i].guard_name+' '+this.data[i].guard_lastname, this.data[i].guard_dni, this.data[i].create_date, this.data[i].update_date, status]);
                this.data[i].id = Number(this.data[i].id);
                this.data[i].guard_dni = Number(this.data[i].guard_dni);
            }
            this.contpdf = body;
            this.info = excel;
        }, error => {
            if (error.status === 422) {
                // on some data incorrect
            } else {
                // on general error
            }
        }
    );
  }

  regresar() {
  	this.lista = true;
  	this.detalle = false;
    this.viewmap = false;
  }

  getGuard() {
  	this.guardiasService.getAll().then(
        success => {
            this.guardias = success;
            this.guard = this.guardias.data;
        }, error => {
            if (error.status === 422) {
                // on some data incorrect
            } else {
                // on general error
            }
        }
    );
  }

  guardFilert(id) {
  	var fecha = String(this.dateSelect);
	this.valueDate = fecha.split('-');
	var year = this.valueDate[0];
	var month = this.valueDate[1];
	var day = this.valueDate[2];
  	if (id == 0){
  		if (this.dateSelect == ''){
  			this.getAll();
  		}else{
  			this.watchesService.getByDate(year, month, day).then(
		        success => {
		            this.watches = success;
		            this.data = this.watches.data;
		        }, error => {
		            if (error.status === 422) {
		                // on some data incorrect
		            } else {
		                // on general error
		            }
		        }
		    );
  		}
  	}else{
  		if(this.dateSelect == ''){
  			this.watchesService.getByGuard(id).then(
		        success => {
		            this.watches = success;
		            this.data = this.watches.data;
		        }, error => {
		            if (error.status === 422) {
		                // on some data incorrect
		            } else {
		                // on general error
		            }
		        }
		    );
  		}else{
  			this.watchesService.getByGuardDate(id, year, month, day).then(
		        success => {
		            this.watches = success;
		            this.data = this.watches.data;
		        }, error => {
		            if (error.status === 422) {
		                // on some data incorrect
		            } else {
		                // on general error
		            }
		        }
		    );
  		}
  	}
  }

  getByDate(date) {
  	var fecha = String(date);
	this.valueDate = fecha.split('-');
	var year = this.valueDate[0];
	var month = this.valueDate[1];
	var day = this.valueDate[2];
	if (this.guardiaSelect == 0){
  		if (this.dateSelect == ''){
  			this.getAll();
  		}else{
  			this.watchesService.getByDate(year, month, day).then(
		        success => {
		            this.watches = success;
		            this.data = this.watches.data;
		        }, error => {
		            if (error.status === 422) {
		                // on some data incorrect
		            } else {
		                // on general error
		            }
		        }
		    );
  		}
  	}else{
  		if(this.dateSelect == ''){
  			this.watchesService.getByGuard(this.guardiaSelect).then(
		        success => {
		            this.watches = success;
		            this.data = this.watches.data;
		        }, error => {
		            if (error.status === 422) {
		                // on some data incorrect
		            } else {
		                // on general error
		            }
		        }
		    );
  		}else{
  			this.watchesService.getByGuardDate(this.guardiaSelect, year, month, day).then(
		        success => {
		            this.watches = success;
		            this.data = this.watches.data;
		        }, error => {
		            if (error.status === 422) {
		                // on some data incorrect
		            } else {
		                // on general error
		            }
		        }
		    );
  		}
  	}
  }

  viewDetail(id){
  	this.watchesService.getById(id).then(
        success => {
          this.guardia = success;
          this.guardia.latitude = this.lat = Number(this.guardia.latitude);
          this.guardia.longitude = this.lng = Number(this.guardia.longitude);
          this.zoom = 12;
          this.lista = false;
          this.detalle = true;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
  }

  pdfDownload() {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Todas las Guardias', 15, 27)
        doc.text('Fecha: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['#', 'Nombre del Guardia', 'Cédula del Guardia', 'Hora de inicio', 'Hora de finalización', 'Status']],
            body: this.contpdf,
            startY: 41,
            columnStyles: {
              0: {columnWidth: 10},
              1: {columnWidth: 'auto'},
              2: {columnWidth: 'auto'},
              3: {columnWidth: 'auto'},
              4: {columnWidth: 'auto'},
              5: {columnWidth: 20}
            }
        });   
        doc.save('guardias.pdf');
    }

    excelDownload() {
        this.excelService.exportAsExcelFile(this.info, 'guardias');
    }

    print() {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Todas las Guardias', 15, 27)
        doc.text('Fecha: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['#', 'Nombre del Guardia', 'Cédula del Guardia', 'Hora de inicio', 'Hora de finalización', 'Status']],
            body: this.contpdf,
            startY: 41,
            columnStyles: {
              0: {columnWidth: 10},
              1: {columnWidth: 'auto'},
              2: {columnWidth: 'auto'},
              3: {columnWidth: 'auto'},
              4: {columnWidth: 'auto'},
              5: {columnWidth: 20}
            }
        });   
        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');
    }

    getMapAlertas(){
      this.zoom = 12;
      this.lista = false;
      this.viewmap = true;
    }

}
