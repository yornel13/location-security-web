import { Component, OnInit } from '@angular/core';
import { TabhistoryService } from '../../../../../model/historial/tabhistory.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExcelService } from '../../../../../model/excel/excel.services';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import * as geolib from 'geolib';

@Component({
  selector: 'app-tabhistorial',
  templateUrl: './tabhistorial.component.html',
  styleUrls: ['./tabhistorial.component.css']
})
export class TabhistorialComponent {
  
  lista:boolean = true;
  historial:boolean = false;
  filter:string;
  tablets:any = [];
  data:any = [];
  p: number = 1;
  numElement:number = 10;
  contpdf:any;
  contpdf2:any;
  info:any;
  info2:any;
  objtab:any;
  loadh:boolean = true;
  day2:any;
  month2:any;
  imei:any;
  date:string;
  history:any = [];
  htab:any = [];
  //map
  map: any;
  mapchart: any;
  lat:number= -2.0000;
  lng:number = -79.0000;
  viewmap:boolean = false;
  //fechas
  rangeday:boolean = true;
  hasta:string = "";
  hayhistory:boolean = true;

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


  constructor(
    private tabhistoryService: TabhistoryService,
    private excelService: ExcelService) {
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
  
  getAll(){
  	this.tabhistoryService.getAll().then(
        success => {
            this.tablets = success;
            this.data = this.tablets.data;
            var body = [];
            var excel = [];
            for(var i=0; i<this.data.length; i++) {
                excel.push({'#' : this.data[i].id, 'IMEI': this.data[i].imei, 'Puesto':this.data[i].stand_name, 'Dirección':this.data[i].stand_address});
                body.push([this.data[i].id, this.data[i].imei, this.data[i].stand_name, this.data[i].stand_address]);
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

  onMapReadyH(map: L.Map) {
  	/*
    	console.log("vamos a ver si entra");
    	this.mapchart = map;
    	this.zoom = 12;
    	this.layersControlOptions = { position: 'bottomright' };
     	var southWest = new L.LatLng(-2.100599,-79.560921);
        var northEast = new L.LatLng(-2.030906,-79.568947);            
        var bounds = new L.LatLngBounds(southWest, northEast);
    	if(this.history.length){
    		var coord = [];
    		for(var i=0; i<this.data.length; i++){
    			var lat = Number(this.history[i].latitude);
    			var lng = Number(this.history[i].longitude);
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
     */
    }

  regresar(){
  	this.lista = true;
  	this.historial = false;
  }

  verhistorial(tab){
  	//this.zoom = 12;
  	this.objtab = tab;
  	this.loadh = false;
  	this.lista = false;
    this.historial = true;
    this.date = "";
    this.hasta = "";

  	var d = new Date();
  	var day = d.getDate();
  	var month = d.getMonth()+1;
  	var year = d.getFullYear();

  	if(day < 10){
  		this.day2 = "0"+day;
  	}else{
  		this.day2 = day;
  	}

  	if(month < 10){
  		this.month2 = "0"+month;
  	}else{
  		this.month2 = month;
  	}

  	this.imei = tab.imei;
  	this.date = year+"-"+this.month2+"-"+this.day2;

  	this.tabhistoryService.getHistoryImeiDate(tab.imei, year, month, day, year, month, day).then(
        success => {
            this.htab = success;
            this.history = this.htab.data;
            console.log(this.history);
            if(this.history.length == 0){
              this.hayhistory = false;
            }else{
              this.hayhistory = true;
            }
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

  getHistory(){
  	this.zoom = 12;
  	if(this.date == ""){
  		this.verhistorial(this.objtab);
  	}else{
  		var fecha1 = String(this.date);
  		var valuesdate1 = fecha1.split('-');
  		var year1 = valuesdate1[0];
  		var month1 = valuesdate1[1];
  		var day1 = valuesdate1[2];

  		var fecha2 = String(this.hasta);
  		var valuesdate2 = fecha2.split('-');
  		var year2 = valuesdate2[0];
  		var month2 = valuesdate2[1];
  		var day2 = valuesdate2[2];
  		if(this.rangeday){
  			this.tabhistoryService.getHistoryImeiDate(this.imei, year1, month1, day1, year1, month1, day1).then(
		        success => {
		            this.htab = success;
		            this.history = this.htab.data;
		            console.log(this.history);
                if(this.history.length == 0){
                  this.hayhistory = false;
                }else{
                  this.hayhistory = true;
                }
		            this.loadh = true;           
		        }, error => {
		            if (error.status === 422) {
		                // on some data incorrect
		            } else {
		                // on general error
		            }
		        }
		    );
  		}else{
  			this.tabhistoryService.getHistoryImeiDate(this.imei, year1, month1, day1, year2, month2, day2).then(
		        success => {
		            this.htab = success;
		            this.history = this.htab.data;
		            console.log(this.history);
                if(this.history.length == 0){
                  this.hayhistory = false;
                }else{
                  this.hayhistory = true;
                }
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
  	}
  	
  }

  selectRange(id){
	  if(id == 1){
	    this.rangeday = true;
	    this.date = "";
	    this.hasta = "";
	    this.getHistory();
	  }else{
	    this.rangeday = false;
	    this.date = "";
	    this.hasta = "";
	    this.getHistory();
	  }
	}

  pdfDownload(){
  	var doc = new jsPDF();
    doc.setFontSize(20)
    doc.text('ICSSE Seguridad', 15, 20)
    doc.setFontSize(12)
    doc.setTextColor(100)
    var d = new Date();
    var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
    doc.text('Historial de tablets', 15, 27)
    doc.text('Hora de impresión: '+ fecha, 15, 34)
    doc.autoTable({
        head: [['#', 'IMEI', 'Puesto', 'Dirección']],
        body: this.contpdf,
        startY: 41,
        columnStyles: {
          0: {cellWidth: 10},
          1: {cellWidth: 40},
          2: {cellWidth: 'auto'},
          3: {cellWidth: 'auto'},
          4: {cellWidth: 'auto'},
          5: {cellWidth: 'auto'}
        }
    });   
    doc.save('tabhistorial.pdf');
  }

  print(){
  	var doc = new jsPDF();
    doc.setFontSize(20)
    doc.text('ICSSE Seguridad', 15, 20)
    doc.setFontSize(12)
    doc.setTextColor(100)
    var d = new Date();
    var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
    doc.text('Historial de tablets', 15, 27)
    doc.text('Hora de impresión: '+ fecha, 15, 34)
    doc.autoTable({
        head: [['#', 'IMEI', 'Puesto', 'Dirección']],
        body: this.contpdf,
        startY: 41,
        columnStyles: {
          0: {cellWidth: 10},
          1: {cellWidth: 40},
          2: {cellWidth: 'auto'},
          3: {cellWidth: 'auto'},
          4: {cellWidth: 'auto'},
          5: {cellWidth: 'auto'}
        }
    });   
    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
  }

  excelDownload() {
        this.excelService.exportAsExcelFile(this.info, 'tabhistorial');
    }

  pdfHistorial(){
  	var doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('ICSSE Seguridad', 15, 20);
    doc.setFontSize(12);
    doc.setTextColor(100);
    var d = new Date();
    var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
    doc.text('Historial de tablets #'+ this.objtab.id, 15, 27);
    doc.text('Hora de impresión: '+ fecha, 15, 34);
    var body = [];
    if(this.history.length){
    	for(var i=0; i<this.history.length; i++){
    		body.push([this.history[i].id, this.history[i].imei, this.history[i].generated_time, this.history[i].message, this.history[i].message_time, this.history[i].guard_name+" "+this.history[i].guard_lastname]);
    	}
    	this.contpdf2 = body;
    }
    doc.autoTable({
        head: [['#', 'IMEI', 'Fecha', 'Mensaje', 'Fecha del mensaje', 'Guardia']],
        body: this.contpdf2,
        startY: 41,
        columnStyles: {
          0: {cellWidth: 10},
          1: {cellWidth: 40},
          2: {cellWidth: 'auto'},
          3: {cellWidth: 'auto'},
          4: {cellWidth: 'auto'},
          5: {cellWidth: 'auto'}
        }
    });   
    doc.save('tabhistorial.pdf');
  }

  printHistorial(){
  	var doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('ICSSE Seguridad', 15, 20);
    doc.setFontSize(12);
    doc.setTextColor(100);
    var d = new Date();
    var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
    doc.text('Historial de tablets #'+ this.objtab.id, 15, 27);
    doc.text('Hora de impresión: '+ fecha, 15, 34);
    var body = [];
    if(this.history.length){
    	for(var i=0; i<this.history.length; i++){
    		body.push([this.history[i].id, this.history[i].imei, this.history[i].generated_time, this.history[i].message, this.history[i].message_time, this.history[i].guard_name+" "+this.history[i].guard_lastname]);
    	}
    	this.contpdf2 = body;
    }
    doc.autoTable({
        head: [['#', 'IMEI', 'Fecha', 'Mensaje', 'Fecha del mensaje', 'Guardia']],
        body: this.contpdf2,
        startY: 41,
        columnStyles: {
          0: {cellWidth: 10},
          1: {cellWidth: 40},
          2: {cellWidth: 'auto'},
          3: {cellWidth: 'auto'},
          4: {cellWidth: 'auto'},
          5: {cellWidth: 'auto'}
        }
    });   
    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
  }

    excelHistorial() {
    	var body = [];
	    if(this.history.length){
	    	for(var i=0; i<this.history.length; i++){
	    		body.push({'#': this.history[i].id, 'IMEI' : this.history[i].imei, 'Fecha':this.history[i].generated_time, 'Mensaje':this.history[i].message, 'Fecha de mensaje':this.history[i].message_time, 'Guardia':this.history[i].guard_name+" "+this.history[i].guard_lastname});
	    	}
	    	this.info2 = body;
	    }
        this.excelService.exportAsExcelFile(this.info2, 'tabhistorial');
    }

}
