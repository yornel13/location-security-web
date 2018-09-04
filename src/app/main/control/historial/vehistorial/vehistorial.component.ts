import { Component, OnInit } from '@angular/core';
import { VehistorialService } from '../../../../../model/historial/vehistorial.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExcelService } from '../../../../../model/excel/excel.services';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import * as geolib from 'geolib';

@Component({
  selector: 'app-vehistorial',
  templateUrl: './vehistorial.component.html',
  styleUrls: ['./vehistorial.component.css']
})
export class VehistorialComponent {

  lista:boolean=true;
  detalle:boolean = false;
  historial:boolean = false;
  vehicles:any = [];
  data:any = [];
  filter:string;
  p: number = 1;
  numElement:number = 10;
  vehiculo:any = {};
  fecha:string;
  contpdf:any = [];
  info: any = [];
  contpdf2:any = [];
  info2: any = [];
  history:any = [];
  imei:any;
  loadh:boolean = true;

  date:string = "";
  day2:any;
  month2:any;
  objvehi:any;

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



  constructor(private vehistorialService:VehistorialService, private excelService:ExcelService) { 
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

    onMapReadyH(map: L.Map){
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

  getAll(){
  	this.vehistorialService.getAll().then(
        success => {
            this.vehicles = success;
            this.data = this.vehicles.data;
            var body = [];
            var excel = [];
            for(var i=0; i<this.data.length; i++){
                //this.data[i].id = Number(this.data[i].id);
                //this.data[i].dni = Number(this.data[i].dni);
                excel.push({'#' : this.data[i].id, 'IMEI': this.data[i].imei, 'Alias':this.data[i].alias, 'Placa':this.data[i].automotor_plate, 'Grupo':this.data[i].group_name, 'Fecha':this.data[i].generated_time})
                body.push([this.data[i].id, this.data[i].imei, this.data[i].alias, this.data[i].automotor_plate, this.data[i].group_name, this.data[i].generated_time])
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

  regresar(){
  	this.detalle = false;
  	this.historial = false;
  	this.lista = true;
  }

  verDetalle(vehi){
  	this.vehistorialService.getImei(vehi.imei).then(
        success => {
            this.vehiculo = success;
            console.log(this.vehiculo);
            this.vehiculo.latitude = this.lat = Number(this.vehiculo.latitude);
        	this.vehiculo.longitude = this.lng = Number(this.vehiculo.longitude);
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

  verhistorial(vehi){
  	this.zoom = 12;
  	this.objvehi = vehi;
  	this.loadh = false;
  	this.lista = false;
    this.detalle = false;
    this.historial = true;

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

  	this.imei = vehi.imei;
  	this.date = year+"-"+this.month2+"-"+this.day2;

  	this.vehistorialService.getHistoryImeiDate(vehi.imei, year, month, day).then(
        success => {
            this.history = success;
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

  getHistory(date){
  	this.zoom = 12;
  	if(date == ""){
  		this.verhistorial(this.objvehi);
  	}else{
  		var fecha1 = String(date);
		var valuesdate1 = fecha1.split('-');
		var year1 = valuesdate1[0];
		var month1 = valuesdate1[1];
		var day1 = valuesdate1[2];

		this.loadh = false;
		this.vehistorialService.getHistoryImeiDate(this.imei, year1, month1, day1).then(
	        success => {
	            this.history = success;
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

  pdfDownload(){
  	var doc = new jsPDF();
    doc.setFontSize(20)
    doc.text('ICSSE Seguridad', 15, 20)
    doc.setFontSize(12)
    doc.setTextColor(100)
    var d = new Date();
    var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
    doc.text('Historial de vehiculos', 15, 27)
    doc.text('Hora de impresión: '+ fecha, 15, 34)
    doc.autoTable({
        head: [['#', 'IMEI', 'Alias', 'Placa', 'Grupo', 'Fecha']],
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
    doc.save('vehistorial.pdf');
  }

  print(){
  	var doc = new jsPDF();
    doc.setFontSize(20)
    doc.text('ICSSE Seguridad', 15, 20)
    doc.setFontSize(12)
    doc.setTextColor(100)
    var d = new Date();
    var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
    doc.text('Historial de vehiculos', 15, 27)
    doc.text('Hora de impresión: '+ fecha, 15, 34)
    doc.autoTable({
        head: [['#', 'IMEI', 'Alias', 'Placa', 'Grupo', 'Fecha']],
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
        this.excelService.exportAsExcelFile(this.info, 'vehistorial');
    }

    pdfDetalle() {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Vehiculo', 15, 27)
        doc.text('Hora de impresión: '+ fecha, 15, 34);
        //inserting data
        doc.setTextColor(0);
        doc.setFontType("bold");
        doc.text('IMEI: ', 15, 45);
        doc.setFontType("normal");
        doc.text(this.vehiculo.imei, 36, 45);
        doc.setFontType("bold");
        doc.text('Alias: ', 100, 45);
        doc.setFontType("normal");
        doc.text(this.vehiculo.alias, 117, 45);

        doc.setFontType("bold");
        doc.text('Placa: ', 15, 52);
        doc.setFontType("normal");
        doc.text(this.vehiculo.automotor_plate, 34, 52);
        doc.setFontType("bold");
        doc.text('Grupo: ', 100, 52);
        doc.setFontType("normal");
        doc.text(this.vehiculo.group_name, 117, 52);

        doc.setFontType("bold");
        doc.text('Latitud: ', 15, 59);
        doc.setFontType("normal");
        doc.text(this.vehiculo.latitude.toString(), 36, 59);
        doc.setFontType("bold");
        doc.text('Longitud: ', 100, 59);
        doc.setFontType("normal");
        doc.text(this.vehiculo.longitude.toString(), 123, 59);

        doc.setFontType("bold");
        doc.text('Encendido: ', 15, 66);
        var ence = "";
        if(this.vehiculo.ignition_state == 0){
        	ence = "ON"
        }else if(this.vehiculo.ignition_state == 1){
        	ence = "OFF"
        }else{
        	ence = "--"
        }
        doc.setFontType("normal");
        doc.text(ence, 40, 66);
        doc.setFontType("bold");
        doc.text('Movimiento: ', 100, 66);
        doc.setFontType("normal");
        var mov = "";
        if(this.vehiculo.movement_state == 1){
        	mov = "SI"
        }else if(this.vehiculo.movement_state == 0){
        	mov = "NO"
        }
        doc.text(mov, 127, 66);

        doc.setFontType("bold");
        doc.text('Velocidad: ', 15, 71);
        doc.setFontType("normal");
        doc.text(this.vehiculo.speed + "Km/h", 40, 71);
        doc.setFontType("bold");
        doc.text('Estatus: ', 100, 71);
        doc.setFontType("normal");
        doc.text(this.vehiculo.device_status, 123, 71);

        doc.setFontType("bold");
        doc.text('Fecha: ', 15, 78);
        doc.setFontType("normal");
        doc.text(this.vehiculo.generated_time, 32, 78);
        doc.setFontType("bold");
        doc.text('Fecha del mensaje: ', 100, 78);
        doc.setFontType("normal");
        doc.text(this.vehiculo.message_time, 139, 78);

        doc.setFontType("bold");
        doc.text('Modelo: ', 15, 85);
        doc.setFontType("normal");
        doc.text(this.vehiculo.model_name, 34, 85);
        doc.setFontType("bold");
        doc.text('Tipo: ', 100, 85);
        doc.setFontType("normal");
        doc.text(this.vehiculo.device_type_name, 115, 85);

        doc.setFontType("bold");
        doc.text('Nivel de batería: ', 15, 92);
        doc.setFontType("normal");
        doc.text(this.vehiculo.battery_level + "%", 54, 92);
        doc.setFontType("bold");
        doc.text('Odometer Kilometraje: ', 100, 92);
        doc.setFontType("normal");
        doc.text(this.vehiculo.odometer.toString(), 149, 92);

        doc.save('vehistorialDetail.pdf');        
    }

    printDetalle() {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Vehiculo', 15, 27)
        doc.text('Hora de impresión: '+ fecha, 15, 34);
        //inserting data
        doc.setTextColor(0);
        doc.setFontType("bold");
        doc.text('IMEI: ', 15, 45);
        doc.setFontType("normal");
        doc.text(this.vehiculo.imei, 36, 45);
        doc.setFontType("bold");
        doc.text('Alias: ', 100, 45);
        doc.setFontType("normal");
        doc.text(this.vehiculo.alias, 117, 45);

        doc.setFontType("bold");
        doc.text('Placa: ', 15, 52);
        doc.setFontType("normal");
        doc.text(this.vehiculo.automotor_plate, 34, 52);
        doc.setFontType("bold");
        doc.text('Grupo: ', 100, 52);
        doc.setFontType("normal");
        doc.text(this.vehiculo.group_name, 117, 52);

        doc.setFontType("bold");
        doc.text('Latitud: ', 15, 59);
        doc.setFontType("normal");
        doc.text(this.vehiculo.latitude.toString(), 36, 59);
        doc.setFontType("bold");
        doc.text('Longitud: ', 100, 59);
        doc.setFontType("normal");
        doc.text(this.vehiculo.longitude.toString(), 123, 59);

        doc.setFontType("bold");
        doc.text('Encendido: ', 15, 66);
        var ence = "";
        if(this.vehiculo.ignition_state == 0){
        	ence = "ON"
        }else if(this.vehiculo.ignition_state == 1){
        	ence = "OFF"
        }else{
        	ence = "--"
        }
        doc.setFontType("normal");
        doc.text(ence, 40, 66);
        doc.setFontType("bold");
        doc.text('Movimiento: ', 100, 66);
        doc.setFontType("normal");
        var mov = "";
        if(this.vehiculo.movement_state == 1){
        	mov = "SI"
        }else if(this.vehiculo.movement_state == 0){
        	mov = "NO"
        }
        doc.text(mov, 127, 66);

        doc.setFontType("bold");
        doc.text('Velocidad: ', 15, 71);
        doc.setFontType("normal");
        doc.text(this.vehiculo.speed + "Km/h", 40, 71);
        doc.setFontType("bold");
        doc.text('Estatus: ', 100, 71);
        doc.setFontType("normal");
        doc.text(this.vehiculo.device_status, 123, 71);

        doc.setFontType("bold");
        doc.text('Fecha: ', 15, 78);
        doc.setFontType("normal");
        doc.text(this.vehiculo.generated_time, 32, 78);
        doc.setFontType("bold");
        doc.text('Fecha del mensaje: ', 100, 78);
        doc.setFontType("normal");
        doc.text(this.vehiculo.message_time, 139, 78);

        doc.setFontType("bold");
        doc.text('Modelo: ', 15, 85);
        doc.setFontType("normal");
        doc.text(this.vehiculo.model_name, 34, 85);
        doc.setFontType("bold");
        doc.text('Tipo: ', 100, 85);
        doc.setFontType("normal");
        doc.text(this.vehiculo.device_type_name, 115, 85);

        doc.setFontType("bold");
        doc.text('Nivel de batería: ', 15, 92);
        doc.setFontType("normal");
        doc.text(this.vehiculo.battery_level + "%", 54, 92);
        doc.setFontType("bold");
        doc.text('Odometer Kilometraje: ', 100, 92);
        doc.setFontType("normal");
        doc.text(this.vehiculo.odometer.toString(), 149, 92);

        doc.autoPrint();
    	window.open(doc.output('bloburl'), '_blank');      
    }

    excelDetalle() {
        var excel = [];
        excel = [{'Parametro' : '', 'Valor': ''}];
        excel.push({'Parametro' : 'IMEI', 'Valor': this.vehiculo.imei});
        excel.push({'Parametro' : 'Alias', 'Valor': this.vehiculo.alias});
        excel.push({'Parametro' : 'Placa', 'Valor': this.vehiculo.automotor_plate});
        excel.push({'Parametro' : 'Grupo', 'Valor': this.vehiculo.group_name});
        excel.push({'Parametro' : 'Latitud', 'Valor': this.vehiculo.latitude});
        excel.push({'Parametro' : 'Longitud', 'Valor': this.vehiculo.longitude});
        var ence = "";
        if(this.vehiculo.ignition_state == 0){
        	ence = "ON"
        }else if(this.vehiculo.ignition_state == 1){
        	ence = "OFF"
        }else{
        	ence = "--"
        }
        excel.push({'Parametro' : 'Encendido', 'Valor': ence});
        var mov = "";
        if(this.vehiculo.movement_state == 1){
        	mov = "SI"
        }else if(this.vehiculo.movement_state == 0){
        	mov = "NO"
        }
        excel.push({'Parametro' : 'Movimiento', 'Valor': mov});
        excel.push({'Parametro' : 'Velocidad', 'Valor': this.vehiculo.speed});
        excel.push({'Parametro' : 'Estatus', 'Valor': this.vehiculo.device_status});
        excel.push({'Parametro' : 'Fecha', 'Valor': this.vehiculo.generated_time});
        excel.push({'Parametro' : 'Fecha del mensaje', 'Valor': this.vehiculo.message_time});
        excel.push({'Parametro' : 'Modelo', 'Valor': this.vehiculo.model_name});
        excel.push({'Parametro' : 'Tipo', 'Valor': this.vehiculo.device_type_name});
        excel.push({'Parametro' : 'Nivel de batería', 'Valor': this.vehiculo.battery_level});
        excel.push({'Parametro' : 'Odometer Kilometraje', 'Valor': this.vehiculo.odometer});
        this.excelService.exportAsExcelFile(excel, 'vehidetail');
    }

    pdfHistorial(){
      var doc = new jsPDF();
      doc.setFontSize(20);
      doc.text('ICSSE Seguridad', 15, 20);
      doc.setFontSize(12);
      doc.setTextColor(100);
      var d = new Date();
      var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
      doc.text('Historial de vehiculo #'+ this.objvehi.id, 15, 27);
      doc.text('Hora de impresión: '+ fecha, 15, 34);
      var body = [];
      if(this.history.length){
        for(var i=0; i<this.history.length; i++){
          body.push([i, this.history[i].address, this.history[i].date, this.history[i].time, this.history[i].alert_message, this.history[i].internal_battery_level]);
        }
        this.contpdf2 = body;
      }
      doc.autoTable({
          head: [['#', 'Dirección', 'Fecha', 'Hora', 'Mensaje', 'Nivel de batería']],
          body: this.contpdf2,
          startY: 41,
          columnStyles: {
            0: {cellWidth: 10},
            1: {cellWidth: 40},
            2: {cellWidth: 'auto'},
            3: {cellWidth: 'auto'},
            4: {cellWidth: 40},
            5: {cellWidth: 'auto'}
          }
      });  
      doc.save('vehistorial.pdf');
    }

  printHistorial(){
    var doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('ICSSE Seguridad', 15, 20);
    doc.setFontSize(12);
    doc.setTextColor(100);
    var d = new Date();
    var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
    doc.text('Historial de vehiculo #'+ this.objvehi.id, 15, 27);
    doc.text('Hora de impresión: '+ fecha, 15, 34);
    var body = [];
    if(this.history.length){
      for(var i=0; i<this.history.length; i++){
        body.push([i, this.history[i].address, this.history[i].date, this.history[i].time, this.history[i].alert_message, this.history[i].internal_battery_level]);
      }
      this.contpdf2 = body;
    }
    doc.autoTable({
        head: [['#', 'Dirección', 'Fecha', 'Hora', 'Mensaje', 'Nivel de batería']],
        body: this.contpdf2,
        startY: 41,
        columnStyles: {
          0: {cellWidth: 10},
          1: {cellWidth: 40},
          2: {cellWidth: 'auto'},
          3: {cellWidth: 'auto'},
          4: {cellWidth: 40},
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
          body.push({'#': i, 'Dirección' : this.history[i].address, 'Fecha':this.history[i].date, 'Hora':this.history[i].time, 'Nivel de batería':this.history[i].internal_battery_level, 'Mensaje':this.history[i].alert_message});
        }
        this.info2 = body;
      }
        this.excelService.exportAsExcelFile(this.info2, 'vehistorial');
    }

}