import { Component, OnInit } from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import { Router } from '@angular/router';
import { VisitasService } from '../../../../../model/visitas/visitas.service';
import { GuardService } from '../../../../../model/guard/guard.service';
import { VisitaVehiculoService } from '../../../../../model/visitavehiculo/visitavehiculo.service';
import { VisitanteService } from '../../../../../model/vistavisitantes/visitantes.service';
import { FuncionarioService } from '../../../../../model/funcionarios/funcionario.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExcelService } from '../../../../../model/excel/excel.services';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import * as geolib from 'geolib';

@Component({
  selector: 'app-visitas',
  templateUrl: './visitas.component.html',
  styleUrls: ['./visitas.component.css']
})
export class VisitasComponent {
  //general
  visitas:any = undefined;
  data:any = undefined;
  visi:any = [];
  modalimg:any = [];
  dateSelect:any = '';
  nomat:boolean;
  //vistas vehiculos
  lista:boolean;
  detalle:boolean;
  //filtro
  filtroSelect:number = 0;
  filtro:number = 1;
  //guardias
  guardias:any = [];
  guard:any = [];
  guardiaSelect:number = 0;
  //vehiculos
  vehiculos:any = [];
  vehi:any = [];
  vehiculoSelect:number=0;
  //visitanta
  visitantes:any = [];
  visit:any = [];
  visitanteSelect:number=0;
  //funcionario
  funcionarios:any = [];
  funcio:any = [];
  funcionarioSelect:number=0;
  valueDate:any = [];
  filter:string;
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


  constructor(public router:Router, private visitasService:VisitasService, private guardiaService:GuardService, private excelService:ExcelService,
  	private vehiculoService:VisitaVehiculoService, private visitanteService:VisitanteService, private funcionarioService:FuncionarioService) { 
  	this.lista = true;
    this.detalle = false;
  	this.getAll();
  	this.getGuard();
  	this.getVehiculos();
  	this.getVisitantes();
  	this.getFuncionarios();
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

  getAll(){
  	this.visitasService.getAll().then(
      success => {
        this.visitas = success;
        this.data = this.visitas.data;
        var body = [];
        var excel = [];
        for(var i=0; i<this.data.length; i++){
        	this.data[i].id = Number(this.data[i].id);
            this.data[i].visitor_dni = Number(this.data[i].visitor_dni);
            excel.push({'#' : this.data[i].id, 'Placa del Vehículo': this.data[i].plate, 'Visitante':this.data[i].visitor_name+' '+this.data[i].visitor_lastname, 'Cédula del visitante':this.data[i].visitor_dni, 'Entrada':this.data[i].create_date, 'Salida':this.data[i].finish_date})
            body.push([this.data[i].id, this.data[i].plate, this.data[i].visitor_name+' '+this.data[i].visitor_lastname, this.data[i].visitor_dni, this.data[i].create_date, this.data[i].finish_date])
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

  getByVehiculo(id){
  	var fecha = String(this.dateSelect);
	this.valueDate = fecha.split('-');
	var year = this.valueDate[0];
	var month = this.valueDate[1];
	var day = this.valueDate[2];

  	if(this.dateSelect == ''){
  		if(id == 0){
  			this.getAll();
  		}else{
  			this.visitasService.getByVehiculo(id, 'all').then(
		      success => {
		        this.visitas = success;
		        this.data = this.visitas.data;
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
  		if(id ==0){
  			this.visitasService.getByDate(year, month, day, 'all').then(
		      success => {
		        this.visitas = success;
		        this.data = this.visitas.data;
		          }, error => {
		              if (error.status === 422) {
		                  // on some data incorrect
		              } else {
		                  // on general error
		              }
		          }
		    );
  		}else{
  			this.visitasService.getByVehiculoDate(id, year, month, day, 'all').then(
		      success => {
		        this.visitas = success;
		        this.data = this.visitas.data;
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

  getByGuardia(id){
  	var fecha = String(this.dateSelect);
	this.valueDate = fecha.split('-');
	var year = this.valueDate[0];
	var month = this.valueDate[1];
	var day = this.valueDate[2];

  	if(this.dateSelect == ''){
  		if(id == 0){
  			this.getAll();
  		}else{
  			this.visitasService.getByGuard(id, 'all').then(
		      success => {
		        this.visitas = success;
		        this.data = this.visitas.data;
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
  		if(id ==0){
  			this.visitasService.getByDate(year, month, day, 'all').then(
		      success => {
		        this.visitas = success;
		        this.data = this.visitas.data;
		          }, error => {
		              if (error.status === 422) {
		                  // on some data incorrect
		              } else {
		                  // on general error
		              }
		          }
		    );
  		}else{
  			this.visitasService.getByGuardDate(id, year, month, day, 'all').then(
		      success => {
		        this.visitas = success;
		        this.data = this.visitas.data;
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

  getByVisitante(id){
  	var fecha = String(this.dateSelect);
	this.valueDate = fecha.split('-');
	var year = this.valueDate[0];
	var month = this.valueDate[1];
	var day = this.valueDate[2];

  	if(this.dateSelect == ''){
  		if(id == 0){
  			this.getAll();
  		}else{
  			this.visitasService.getByVisitante(id, 'all').then(
		      success => {
		        this.visitas = success;
		        this.data = this.visitas.data;
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
  		if(id ==0){
  			this.visitasService.getByDate(year, month, day, 'all').then(
		      success => {
		        this.visitas = success;
		        this.data = this.visitas.data;
		          }, error => {
		              if (error.status === 422) {
		                  // on some data incorrect
		              } else {
		                  // on general error
		              }
		          }
		    );
  		}else{
  			this.visitasService.getByVisitanteDate(id, year, month, day, 'all').then(
		      success => {
		        this.visitas = success;
		        this.data = this.visitas.data;
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

  getByFuncionario(id){
  	var fecha = String(this.dateSelect);
	this.valueDate = fecha.split('-');
	var year = this.valueDate[0];
	var month = this.valueDate[1];
	var day = this.valueDate[2];

  	if(this.dateSelect == ''){
  		if(id == 0){
  			this.getAll();
  		}else{
  			this.visitasService.getByFuncionario(id, 'all').then(
		      success => {
		        this.visitas = success;
		        this.data = this.visitas.data;
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
  		if(id ==0){
  			this.visitasService.getByDate(year, month, day, 'all').then(
		      success => {
		        this.visitas = success;
		        this.data = this.visitas.data;
		          }, error => {
		              if (error.status === 422) {
		                  // on some data incorrect
		              } else {
		                  // on general error
		              }
		          }
		    );
  		}else{
  			this.visitasService.getByFuncionarioDate(id, year, month, day, 'all').then(
		      success => {
		        this.visitas = success;
		        this.data = this.visitas.data;
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

  getByDate(date){
  	var fecha = String(date);
	this.valueDate = fecha.split('-');
	var year = this.valueDate[0];
	var month = this.valueDate[1];
	var day = this.valueDate[2];
	//Vehiculo
  	if(this.filtroSelect == 0){
  		if(date == ''){
  			if(this.vehiculoSelect ==0 ){
  				this.getAll();
  			}else{
  				this.visitasService.getByVehiculo(this.vehiculoSelect, 'all').then(
			      success => {
			        this.visitas = success;
			        this.data = this.visitas.data;
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
  			if(this.vehiculoSelect == 0){
  				this.visitasService.getByDate(year, month, day, 'all').then(
			      success => {
			        this.visitas = success;
			        this.data = this.visitas.data;
			          }, error => {
			              if (error.status === 422) {
			                  // on some data incorrect
			              } else {
			                  // on general error
			              }
			          }
			    );
  			}else{
  				this.visitasService.getByVehiculoDate(this.vehiculoSelect, year, month, day, 'all').then(
			      success => {
			        this.visitas = success;
			        this.data = this.visitas.data;
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
  	//Guardia
  	if(this.filtroSelect == 1){
  		if(date == ''){
  			if(this.guardiaSelect ==0 ){
  				this.getAll();
  			}else{
  				this.visitasService.getByGuard(this.guardiaSelect, 'all').then(
			      success => {
			        this.visitas = success;
			        this.data = this.visitas.data;
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
  			if(this.guardiaSelect == 0){
  				this.visitasService.getByDate(year, month, day, 'all').then(
			      success => {
			        this.visitas = success;
			        this.data = this.visitas.data;
			          }, error => {
			              if (error.status === 422) {
			                  // on some data incorrect
			              } else {
			                  // on general error
			              }
			          }
			    );
  			}else{
  				this.visitasService.getByGuardDate(this.guardiaSelect, year, month, day, 'all').then(
			      success => {
			        this.visitas = success;
			        this.data = this.visitas.data;
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
  	//Visitantes
  	if(this.filtroSelect == 2){
  		if(date == ''){
  			if(this.visitanteSelect ==0 ){
  				this.getAll();
  			}else{
  				this.visitasService.getByVisitante(this.visitanteSelect, 'all').then(
			      success => {
			        this.visitas = success;
			        this.data = this.visitas.data;
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
  			if(this.visitanteSelect == 0){
  				this.visitasService.getByDate(year, month, day, 'all').then(
			      success => {
			        this.visitas = success;
			        this.data = this.visitas.data;
			          }, error => {
			              if (error.status === 422) {
			                  // on some data incorrect
			              } else {
			                  // on general error
			              }
			          }
			    );
  			}else{
  				this.visitasService.getByVisitanteDate(this.visitanteSelect, year, month, day, 'all').then(
			      success => {
			        this.visitas = success;
			        this.data = this.visitas.data;
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
  	//Funcionario
  	if(this.filtroSelect == 3){
  		if(date == ''){
  			if(this.funcionarioSelect ==0 ){
  				this.getAll();
  			}else{
  				this.visitasService.getByFuncionario(this.funcionarioSelect, 'all').then(
			      success => {
			        this.visitas = success;
			        this.data = this.visitas.data;
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
  			if(this.funcionarioSelect == 0){
  				this.visitasService.getByDate(year, month, day, 'all').then(
			      success => {
			        this.visitas = success;
			        this.data = this.visitas.data;
			          }, error => {
			              if (error.status === 422) {
			                  // on some data incorrect
			              } else {
			                  // on general error
			              }
			          }
			    );
  			}else{
  				this.visitasService.getByFuncionarioDate(this.funcionarioSelect, year, month, day, 'all').then(
			      success => {
			        this.visitas = success;
			        this.data = this.visitas.data;
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
  }

  viewDetail(id) {
    this.visitasService.getId(id).then(
      success => {
        this.visi = success;
        console.log(this.visi);
        this.modalimg = [];
        this.modalimg.push(this.visi.image_1);
        this.modalimg.push(this.visi.image_2);
        this.modalimg.push(this.visi.image_3);
        this.modalimg.push(this.visi.image_4);
        this.modalimg.push(this.visi.image_5);
        this.visi.observation = JSON.parse(this.visi.observation);
        this.visi.latitude = this.lat = Number(this.visi.latitude);
        this.visi.longitude = this.lng = Number(this.visi.longitude);
        this.zoom = 12;
        if(this.visi.observation){
          if(this.visi.observation.length == 0){
            this.nomat = true
          }else{
            this.nomat = false;
          }
        }
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

  regresar() {
    this.lista = true;
    this.detalle = false;
    this.viewmap = false;
  }

  selectFilert(id){
  	if(id == 0){
  		this.filtro = 1;
  		this.guardiaSelect = 0;
  		this.visitanteSelect = 0;
  		this.funcionarioSelect = 0;
  		this.getByVehiculo(this.vehiculoSelect);
  	}else if(id == 1){
  		this.filtro = 2;
  		this.vehiculoSelect = 0;
  		this.visitanteSelect = 0;
  		this.funcionarioSelect = 0;
  		this.getByGuardia(this.guardiaSelect);
  	}else if(id == 2){
  		this.filtro = 3;
  		this.vehiculoSelect = 0;
  		this.guardiaSelect = 0;
  		this.funcionarioSelect = 0;
  		this.getByVisitante(this.visitanteSelect);
  	}else if(id == 3){
  		this.filtro = 4;
  		this.vehiculoSelect = 0;
  		this.guardiaSelect = 0;
  		this.funcionarioSelect = 0;
  		this.getByFuncionario(this.funcionarioSelect);
  	}
  }

  getGuard(){
  	this.guardiaService.getAll().then(
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

  getVehiculos(){
  	this.vehiculoService.getAll().then(
    success => {
      this.vehiculos = success;
      this.vehi = this.vehiculos.data;
        }, error => {
            if (error.status === 422) {
                // on some data incorrect
            } else {
                // on general error
            }
        }
    );
  }

  getVisitantes(){
  	this.visitanteService.getAll().then(
    success => {
      this.visitantes = success;
      this.visit = this.visitantes.data;
        }, error => {
            if (error.status === 422) {
                // on some data incorrect
            } else {
                // on general error
            }
        }
    );
  }

  getFuncionarios(){
  	this.funcionarioService.getAll().then(
    success => {
      this.funcionarios = success;
      this.funcio = this.funcionarios.data;
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
        doc.text('Todas las visitas', 15, 27)
        doc.text('Fecha: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['#', 'Placa del Vehículo', 'Visitante', 'Cédula del visitante', 'Entrada', 'Salida']],
            body: this.contpdf,
            startY: 41,
            columnStyles: {
            	0: {columnWidth: 10},
			    1: {columnWidth: 'auto'},
			    2: {columnWidth: 'auto'},
			    3: {columnWidth: 'auto'},
			    4: {columnWidth: 'auto'},
			    5: {columnWidth: 'auto'},
            }
        });   
        doc.save('visitas.pdf');
    }

    excelDownload() {
        this.excelService.exportAsExcelFile(this.info, 'visitas');
    }

    print() {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Todas las visitas', 15, 27)
        doc.text('Fecha: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['#', 'Placa del Vehículo', 'Visitante', 'Cédula del visitante', 'Entrada', 'Salida']],
            body: this.contpdf,
            startY: 41,
            columnStyles: {
            	0: {columnWidth: 10},
			    1: {columnWidth: 'auto'},
			    2: {columnWidth: 'auto'},
			    3: {columnWidth: 'auto'},
			    4: {columnWidth: 'auto'},
			    5: {columnWidth: 'auto'},
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
