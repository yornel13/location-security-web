import { Component, OnInit } from '@angular/core';
import { SalidascercoService } from '../../../../../model/historial/salidacerco.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExcelService } from '../../../../../model/excel/excel.services';
import * as L from 'leaflet';
import * as geolib from 'geolib';

@Component({
  selector: 'app-vehicercohistorial',
  templateUrl: './vehicercohistorial.component.html',
  styleUrls: ['./vehicercohistorial.component.css']
})
export class VehicercohistorialComponent {
  
  lista:boolean = true;
  detalle:boolean = false;
  filter:string;
  salidas:any = [];
  data:any = [];
  p: number = 1;
  numElement:number = 10;
  hayin:any = [];
  //fechas
  desde:string = "";
  hasta:string = "";
  rangeday:boolean = true;
  desde2:string = "";
  hasta2:string = "";
  rangeday2:boolean = true;
  //pdfs
  contpdf:any;
  info:any;
  contpdf2:any;
  info2:any;
  //detall
  exitcercos:any = [];
  exitc:any = [];
  loadh:boolean = true;
  objsalida:any;
  imei:any;

  //map
  map: any;
  mapchart: any;
  lat:number= -2.0000;
  lng:number = -79.0000;

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

  constructor(private salidaService:SalidascercoService, private excelService: ExcelService) { 
  	this.getAll();
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

  onMapReadyH(map: L.Map){
    	console.log("vamos a ver si entra");
    	this.mapchart = map;
    	this.zoom = 12;
    	this.layersControlOptions = { position: 'bottomright' };
     	var southWest = new L.LatLng(-2.100599,-79.560921);
        var northEast = new L.LatLng(-2.030906,-79.568947);            
        var bounds = new L.LatLngBounds(southWest, northEast);

    	var coord = [];

		var lat = this.lat;
		var lng = this.lng;
		var maker = L.marker([lat, lng]).addTo(this.mapchart);
		coord.push({latitude: lat, longitude: lng});
		bounds.extend(maker.getLatLng());

		if(!(Object.keys(this.objsalida.in).length === 0)){
			var lat = Number(this.objsalida.in.latitude);
			var lng = Number(this.objsalida.in.longitude);
			var maker = L.marker([lat, lng]).addTo(this.mapchart);
			coord.push({latitude: lat, longitude: lng});
			bounds.extend(maker.getLatLng());
		}

        this.mapchart.fitBounds(bounds);
    	var centro = geolib.getCenter(coord);

    	console.log(centro);
    	this.center = L.latLng([centro.latitude, centro.longitude]);
    	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 20,
            detectRetina: true,
            attribution: 'Open Street Map'
        }).addTo(this.mapchart);
    }

  getAll(){
  	this.salidaService.getAll().then(
        success => {
            this.salidas = success;
            this.data = this.salidas.data;
            var body = [];
            var excel = [];
            for(var i=0; i<this.data.length; i++){
                if(this.data[i].in){
                	this.hayin[i] = true;
                }else{
                	this.hayin[i] = false;
                	this.data[i].in = {};
                }
                excel.push({'#' : i, 'IMEI': this.data[i].imei, 'Alias':this.data[i].alias, 'Fecha de salida':this.data[i].create_date, 'Lat Salida':this.data[i].latitude, 'Lng Salida':this.data[i].longitude, 'Fecha Vuelta':this.data[i].in.create_date, 'Lat Vuelta':this.data[i].in.latitude, 'Lng Vuelta':this.data[i].in.longitude, 'Duración':this.data[i].diff_text})
                body.push([i, this.data[i].imei, this.data[i].alias, this.data[i].create_date, this.data[i].latitude, this.data[i].longitude, this.data[i].in.create_date, this.data[i].in.latitude, this.data[i].in.longitude, this.data[i].diff_text])
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

  getSearch(){
  	var fecha1 = String(this.desde);
    var valuesdate1 = fecha1.split('-');
    var year1 = valuesdate1[0];
    var month1 = valuesdate1[1];
    var day1 = valuesdate1[2];

    var fecha2 = String(this.hasta);
    var valuesdate2 = fecha2.split('-');
    var year2 = valuesdate2[0];
    var month2 = valuesdate2[1];
    var day2 = valuesdate2[2];

    if(this.desde == ""){
    	this.getAll();
    }else{
    	if(this.rangeday){
    		this.salidaService.getSalidasDate(year1,month1, day1, year1, month1, day1).then(
		        success => {
		            this.salidas = success;
		            this.data = this.salidas.data;
		            var body = [];
		            var excel = [];
		            for(var i=0; i<this.data.length; i++){
		                if(this.data[i].in){
		                	this.hayin[i] = true;
		                }else{
		                	this.hayin[i] = false;
		                	this.data[i].in = {};
		                }
		                excel.push({'#' : i, 'IMEI': this.data[i].imei, 'Alias':this.data[i].alias, 'Fecha de salida':this.data[i].create_date, 'Lat Salida':this.data[i].latitude, 'Lng Salida':this.data[i].longitude, 'Fecha Vuelta':this.data[i].in.create_date, 'Lat Vuelta':this.data[i].in.latitude, 'Lng Vuelta':this.data[i].in.longitude, 'Duración':this.data[i].diff_text})
		                body.push([i, this.data[i].imei, this.data[i].alias, this.data[i].create_date, this.data[i].latitude, this.data[i].longitude, this.data[i].in.create_date, this.data[i].in.latitude, this.data[i].in.longitude, this.data[i].diff_text])
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
    	}else{
    		this.salidaService.getSalidasDate(year1,month1, day1, year2, month2, day2).then(
		        success => {
		            this.salidas = success;
		            this.data = this.salidas.data;
		            var body = [];
		            var excel = [];
		            for(var i=0; i<this.data.length; i++){
		                if(this.data[i].in){
		                	this.hayin[i] = true;
		                }else{
		                	this.hayin[i] = false;
		                	this.data[i].in = {};
		                }
		                excel.push({'#' : i, 'IMEI': this.data[i].imei, 'Alias':this.data[i].alias, 'Fecha de salida':this.data[i].create_date, 'Lat Salida':this.data[i].latitude, 'Lng Salida':this.data[i].longitude, 'Fecha Vuelta':this.data[i].in.create_date, 'Lat Vuelta':this.data[i].in.latitude, 'Lng Vuelta':this.data[i].in.longitude, 'Duración':this.data[i].diff_text})
		                body.push([i, this.data[i].imei, this.data[i].alias, this.data[i].create_date, this.data[i].latitude, this.data[i].longitude, this.data[i].in.create_date, this.data[i].in.latitude, this.data[i].in.longitude, this.data[i].diff_text])
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
    }
  }

  verDetalle(salida){
  	this.zoom = 12;
  	this.lista = false;
    this.detalle = true;
    this.loadh = false;
    this.objsalida = salida;
    this.imei = salida.imei;
    this.desde2 = "";
    this.hasta2 = "";
  	this.salidaService.getImei(salida.imei).then(
        success => {
            this.exitc = success;
            this.exitcercos = this.exitc.data;
            console.log(salida.latitude);
            console.log(salida.longitude);
            this.lat = Number(salida.latitude);
        	this.lng = Number(salida.longitude);
            var body = [];
            var excel = [];
            for(var i=0; i<this.exitcercos.length; i++){
                if(this.exitcercos[i].in){
                }else{
                	this.exitcercos[i].in = {};
                }
                excel.push({'#' : i, 'IMEI': this.exitcercos[i].imei, 'Alias':this.exitcercos[i].alias, 'Fecha de salida':this.exitcercos[i].create_date, 'Lat Salida':this.exitcercos[i].latitude, 'Lng Salida':this.exitcercos[i].longitude, 'Fecha Vuelta':this.exitcercos[i].in.create_date, 'Lat Vuelta':this.exitcercos[i].in.latitude, 'Lng Vuelta':this.exitcercos[i].in.longitude, 'Duración':this.exitcercos[i].diff_text})
                body.push([i, this.exitcercos[i].imei, this.exitcercos[i].alias, this.exitcercos[i].create_date, this.exitcercos[i].latitude, this.exitcercos[i].longitude, this.exitcercos[i].in.create_date, this.exitcercos[i].in.latitude, this.exitcercos[i].in.longitude, this.exitcercos[i].diff_text])
            }
            this.contpdf2 = body;
            this.info2 = excel;
            this.loadh = true;
			}, error => {
            if (error.status === 422) {
                // on some data incorrect
            } else {
                // on general error
            }
        }
    );
  }

  regresar(){
  	this.lista = true;
  	this.detalle = false;
  }

  selectRange(id){
    if(id == 1){
      this.rangeday = true;
      this.desde = "";
      this.hasta = "";
      this.getSearch();
    }else{
      this.rangeday = false;
      this.desde = "";
      this.hasta = "";
      this.getSearch();
    }
  }

  selectRange2(id){
    if(id == 1){
      this.rangeday2 = true;
      this.desde2 = "";
      this.hasta2 = "";
      this.verDetalle(this.objsalida);
    }else{
      this.rangeday2 = false;
      this.desde2 = "";
      this.hasta2 = "";
      this.verDetalle(this.objsalida);
    }
  }

  getHistory(){
  	console.log("entra al metodo");
  	console.log(this.desde2);
  	var fecha1 = String(this.desde2);
    var valuesdate1 = fecha1.split('-');
    var year1 = valuesdate1[0];
    var month1 = valuesdate1[1];
    var day1 = valuesdate1[2];

    var fecha2 = String(this.hasta2);
    var valuesdate2 = fecha2.split('-');
    var year2 = valuesdate2[0];
    var month2 = valuesdate2[1];
    var day2 = valuesdate2[2];

    if(this.desde2 == ""){
    	this.verDetalle(this.objsalida);
    }else{
    	if(this.rangeday2){
    		this.salidaService.getSalidasImeiDate(this.imei, year1,month1, day1, year1, month1, day1).then(
		        success => {
		            this.exitc = success;
		            this.exitcercos = this.exitc.data;
		            console.log(this.exitcercos);
		            var body = [];
		            var excel = [];
		            for(var i=0; i<this.exitcercos.length; i++){
		                if(this.exitcercos[i].in){
		                }else{
		                	this.exitcercos[i].in = {};
		                }
		                excel.push({'#' : i, 'IMEI': this.exitcercos[i].imei, 'Alias':this.exitcercos[i].alias, 'Fecha de salida':this.exitcercos[i].create_date, 'Lat Salida':this.exitcercos[i].latitude, 'Lng Salida':this.exitcercos[i].longitude, 'Fecha Vuelta':this.exitcercos[i].in.create_date, 'Lat Vuelta':this.exitcercos[i].in.latitude, 'Lng Vuelta':this.exitcercos[i].in.longitude, 'Duración':this.exitcercos[i].diff_text})
		                body.push([i, this.exitcercos[i].imei, this.exitcercos[i].alias, this.exitcercos[i].create_date, this.exitcercos[i].latitude, this.exitcercos[i].longitude, this.exitcercos[i].in.create_date, this.exitcercos[i].in.latitude, this.exitcercos[i].in.longitude, this.exitcercos[i].diff_text])
		            }
		            this.contpdf2 = body;
		            this.info2 = excel;
		        }, error => {
		            if (error.status === 422) {
		                // on some data incorrect
		            } else {
		                // on general error
		            }
		        }
		    );
    	}else{
    		this.salidaService.getSalidasImeiDate(this.imei, year1,month1, day1, year2, month2, day2).then(
			        success => {
		            this.exitc = success;
		            this.exitcercos = this.exitc.data;
		            var body = [];
		            var excel = [];
		            for(var i=0; i<this.exitcercos.length; i++){
		                if(this.exitcercos[i].in){
		                }else{
		                	this.exitcercos[i].in = {};
		                }
		                excel.push({'#' : i, 'IMEI': this.exitcercos[i].imei, 'Alias':this.exitcercos[i].alias, 'Fecha de salida':this.exitcercos[i].create_date, 'Lat Salida':this.exitcercos[i].latitude, 'Lng Salida':this.exitcercos[i].longitude, 'Fecha Vuelta':this.exitcercos[i].in.create_date, 'Lat Vuelta':this.exitcercos[i].in.latitude, 'Lng Vuelta':this.exitcercos[i].in.longitude, 'Duración':this.exitcercos[i].diff_text})
		                body.push([i, this.exitcercos[i].imei, this.exitcercos[i].alias, this.exitcercos[i].create_date, this.exitcercos[i].latitude, this.exitcercos[i].longitude, this.exitcercos[i].in.create_date, this.exitcercos[i].in.latitude, this.exitcercos[i].in.longitude, this.exitcercos[i].diff_text])
		            }
		            this.contpdf2 = body;
		            this.info2 = excel;
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

  pdfDownload() {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Salidas del cerco', 15, 27)
        doc.text('Hora de impresión: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['#', 'IMEI', 'Alias', 'Fecha Salida', 'Lat Salida', 'Lng Salida', 'Fecha Vuelta', 'Lat Vuelta', 'Lng Vuelta', 'Duración']],
            body: this.contpdf,
            startY: 41,
            columnStyles: {
            	0: {cellWidth: 10},
			    1: {cellWidth: 20},
			    2: {cellWidth: 'auto'},
			    3: {cellWidth: 'auto'},
			    4: {cellWidth: 'auto'},
			    5: {cellWidth: 'auto'},
			    6: {cellWidth: 'auto'},
			    7: {cellWidth: 'auto'},
			    8: {cellWidth: 'auto'},
			    9: {cellWidth: 'auto'}
            }
        });
        doc.save('salidacerco.pdf');
    }

    excelDownload() {
        this.excelService.exportAsExcelFile(this.info, 'salidacerco');
    }

    print() {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Salidas del cerco', 15, 27)
        doc.text('Hora de impresión: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['#', 'IMEI', 'Alias', 'Fecha Salida', 'Lat Salida', 'Lng Salida', 'Fecha Vuelta', 'Lat Vuelta', 'Lng Vuelta', 'Duración']],
            body: this.contpdf,
            startY: 41,
            columnStyles: {
            	0: {cellWidth: 10},
			    1: {cellWidth: 20},
			    2: {cellWidth: 'auto'},
			    3: {cellWidth: 'auto'},
			    4: {cellWidth: 'auto'},
			    5: {cellWidth: 'auto'},
			    6: {cellWidth: 'auto'},
			    7: {cellWidth: 'auto'},
			    8: {cellWidth: 'auto'},
			    9: {cellWidth: 'auto'}
            }
        });
        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');
    }

    pdfHistorial() {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Salidas del cerco', 15, 27)
        doc.text('Hora de impresión: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['#', 'IMEI', 'Alias', 'Fecha Salida', 'Lat Salida', 'Lng Salida', 'Fecha Vuelta', 'Lat Vuelta', 'Lng Vuelta', 'Duración']],
            body: this.contpdf2,
            startY: 41,
            columnStyles: {
              0: {cellWidth: 10},
          1: {cellWidth: 20},
          2: {cellWidth: 'auto'},
          3: {cellWidth: 'auto'},
          4: {cellWidth: 'auto'},
          5: {cellWidth: 'auto'},
          6: {cellWidth: 'auto'},
          7: {cellWidth: 'auto'},
          8: {cellWidth: 'auto'},
          9: {cellWidth: 'auto'}
            }
        });
        doc.save('salidacerco.pdf');
    }

    excelHistorial() {
        this.excelService.exportAsExcelFile(this.info2, 'salidacerco');
    }

    printHistorial() {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Salidas del cerco', 15, 27)
        doc.text('Hora de impresión: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['#', 'IMEI', 'Alias', 'Fecha Salida', 'Lat Salida', 'Lng Salida', 'Fecha Vuelta', 'Lat Vuelta', 'Lng Vuelta', 'Duración']],
            body: this.contpdf2,
            startY: 41,
            columnStyles: {
              0: {cellWidth: 10},
          1: {cellWidth: 20},
          2: {cellWidth: 'auto'},
          3: {cellWidth: 'auto'},
          4: {cellWidth: 'auto'},
          5: {cellWidth: 'auto'},
          6: {cellWidth: 'auto'},
          7: {cellWidth: 'auto'},
          8: {cellWidth: 'auto'},
          9: {cellWidth: 'auto'}
            }
        });
        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');
    }

}
