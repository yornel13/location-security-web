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
import html2canvas from 'html2canvas'; 

@Component({
  selector: 'app-visitasactivas',
  templateUrl: './visitasactivas.component.html',
  styleUrls: ['./visitasactivas.component.css']
})
export class VisitasactivasComponent {
  /*general*/
    visitas:any = undefined;
  data:any = undefined;
  visi:any = [];
  searchString: string;
  filter:string;
  //vistas vehiculos
  lista:boolean;
  detalle:boolean;
  nomat:boolean;
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
  dateSelect:any = '';
  nohay:boolean = false;
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

  //dropdow
  dropdownList1 = [];
  selectedVehiculos = [];
  dropdownSettings1 = {};

  dropdownList2 = [];
  selectedGuardias = [];
  dropdownSettings2 = {};

  dropdownList3 = [];
  selectedVisitantes = [];
  dropdownSettings3 = {};

  dropdownList4 = [];
  selectedFuncionarios = [];
  dropdownSettings4 = {};

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
  	this.getActives();
    this.getGuard();
    this.getVehiculos();
    this.getVisitantes();
    this.getFuncionarios();
    this.setupDropdown1();
    this.setupDropdown2();
    this.setupDropdown3();
    this.setupDropdown4();
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

  getActives() {
  	this.visitasService.getActive().then(
      success => {
        this.visitas = success;
        this.data = this.visitas.data;
        var body = [];
        var excel = [];
        for(var i=0; i<this.data.length; i++){
            this.data[i].id = Number(this.data[i].id);
            this.data[i].visitor_dni = Number(this.data[i].visitor_dni);
            excel.push({'#' : this.data[i].id, 'Placa del Vehículo': this.data[i].plate, 'Visitante':this.data[i].visitor_name+' '+this.data[i].visitor_lastname, 'Cédula del visitante':this.data[i].visitor_dni, 'Entrada':this.data[i].create_date})
            body.push([this.data[i].id, this.data[i].plate, this.data[i].visitor_name+' '+this.data[i].visitor_lastname, this.data[i].visitor_dni, this.data[i].create_date])
        }
        this.contpdf = body;
        this.info = excel;
        if(this.data.length == 0){
          this.nohay = true;
        }
          }, error => {
              if (error.status === 422) {
                  // on some data incorrect
              } else {
                  // on general error
              }
          }
      );
  }

  viewDetail(id) {
    this.visitasService.getId(id).then(
      success => {
        this.visi = success;
        this.visi.observation = JSON.parse(this.visi.observation);
        if(this.visi.observation.length == 0){
          this.nomat = true;
        }else{
          this.nomat = false;
        }
        this.visi.latitude = this.lat = Number(this.visi.latitude);
        this.visi.longitude = this.lng = Number(this.visi.longitude);
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

  regresar() {
    this.lista = true;
    this.detalle = false;
    this.viewmap = false;
  }

  getByVehiculo(){
    var vehiculo = this.selectedVehiculos;
    if(this.dateSelect == ''){
      if( vehiculo.length == 0){
        this.getActives();
      }else{
        var result = [];
        for(var i=0;i<vehiculo.length;i++){
          this.visitasService.getByVehiculo(vehiculo[i].item_id, '1').then(
            success => {
              this.visitas = success;
              result = result.concat(this.visitas.data);
              this.data = result;
              for(var i=0; i<this.data.length; i++){
                  this.data[i].id = Number(this.data[i].id);
                }
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

  getByGuardia(){
    var guardia = this.selectedGuardias;
    if(this.dateSelect == ''){
      if(guardia.length == 0){
        this.getActives();
      }else{
        var result = [];
        for(var i=0;i<guardia.length;i++){
          this.visitasService.getByGuard(guardia[i].item_id, '1').then(
            success => {
              this.visitas = success;
              result = result.concat(this.visitas.data);
              this.data = result;
              for(var i=0; i<this.data.length; i++){
                  this.data[i].id = Number(this.data[i].id);
                }
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

  getByVisitante(){
    var visitante = this.selectedVisitantes;
    if(this.dateSelect == ''){
      if(visitante.length == 0){
        this.getActives();
      }else{
        var result = []
        for(var i=0;i<visitante.length;i++){
          this.visitasService.getByVisitante(visitante[i].item_id, '1').then(
            success => {
              this.visitas = success;
              result = result.concat(this.visitas.data);
              this.data = result;
              for(var i=0; i<this.data.length; i++){
                  this.data[i].id = Number(this.data[i].id);
                }
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

  getByFuncionario(){
    var funcionario = this.selectedFuncionarios;
    if(this.dateSelect == ''){
      if(funcionario.length == 0){
        this.getActives();
      }else{
        var result = [];
        for(var i=0;i<funcionario.length;i++){
          this.visitasService.getByFuncionario(funcionario[i].item_id, '1').then(
            success => {
              this.visitas = success;
              result = result.concat(this.visitas.data);
              this.data = result;
              for(var i=0; i<this.data.length; i++){
                  this.data[i].id = Number(this.data[i].id);
                }
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


  selectFilert(id){
    if(id == 0){
      this.filtro = 1;
      this.guardiaSelect = 0;
      this.visitanteSelect = 0;
      this.funcionarioSelect = 0;
      this.getByVehiculo();
    }else if(id == 1){
      this.filtro = 2;
      this.vehiculoSelect = 0;
      this.visitanteSelect = 0;
      this.funcionarioSelect = 0;
      this.getByGuardia();
    }else if(id == 2){
      this.filtro = 3;
      this.vehiculoSelect = 0;
      this.guardiaSelect = 0;
      this.funcionarioSelect = 0;
      this.getByVisitante();
    }else if(id == 3){
      this.filtro = 4;
      this.vehiculoSelect = 0;
      this.guardiaSelect = 0;
      this.funcionarioSelect = 0;
      this.getByFuncionario();
    }
  }

  getGuard(){
    this.guardiaService.getAll().then(
    success => {
      this.guardias = success;
      this.guard = this.guardias.data;
      const datag = [];
        this.guard.forEach(guard => {
          datag.push({ item_id: guard.id, item_text: guard.name+' '+guard.lastname });
        });
        this.dropdownList2 = datag;
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
      const datag = [];
        this.vehi.forEach(vehi => {
          datag.push({ item_id: vehi.id, item_text: vehi.plate});
        });
        this.dropdownList1 = datag;
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
      const datag = [];
        this.visit.forEach(visit => {
          datag.push({ item_id: visit.id, item_text: visit.name+' '+visit.lastname });
        });
        this.dropdownList3 = datag;
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
      const datag = [];
        this.funcio.forEach(funcio => {
          datag.push({ item_id: funcio.id, item_text: funcio.name+' '+funcio.lastname });
        });
        this.dropdownList4 = datag;
        }, error => {
            if (error.status === 422) {
                // on some data incorrect
            } else {
                // on general error
            }
        }
    );
  }

  //configuración de los selects
  onItemSelect1 (item:any) {
    this.getByVehiculo();
  }

  onItemDeSelect1(item:any){
    this.getByVehiculo();
  }

  setupDropdown1() {
      this.dropdownList1 = [];
      this.selectedVehiculos = [];
      this.dropdownSettings1 = {
        singleSelection: false,
        idField: 'item_id',
        textField: 'item_text',
        selectAllText: 'Seleccionar todo',
        unSelectAllText: 'Deseleccionar todo',
        searchPlaceholderText: 'Buscar Vehículo',
        itemsShowLimit: 3,
        allowSearchFilter: true,
        enableCheckAll: false,
      };
    }
    //configuración de los selects
    onItemSelect2 (item:any) {
      this.getByGuardia();
    }

    onItemDeSelect2 (item:any){
      this.getByGuardia();
    }

    setupDropdown2() {
        this.dropdownList2 = [];
        this.selectedGuardias = [];
        this.dropdownSettings2 = {
          singleSelection: false,
          idField: 'item_id',
          textField: 'item_text',
          selectAllText: 'Seleccionar todo',
          unSelectAllText: 'Deseleccionar todo',
          searchPlaceholderText: 'Buscar Guardia',
          itemsShowLimit: 1,
          allowSearchFilter: true,
          enableCheckAll: false,
        };
      }
    //configuración de los selects
    onItemSelect3 (item:any) {
      this.getByVisitante();
    }

    onItemDeSelect3 (item:any){
      this.getByVisitante();
    }

    setupDropdown3() {
        this.dropdownList3 = [];
        this.selectedVisitantes = [];
        this.dropdownSettings3 = {
          singleSelection: false,
          idField: 'item_id',
          textField: 'item_text',
          selectAllText: 'Seleccionar todo',
          unSelectAllText: 'Deseleccionar todo',
          searchPlaceholderText: 'Buscar Visitante',
          itemsShowLimit: 1,
          allowSearchFilter: true,
          enableCheckAll: false,
        };
      }
    //configuración de los selects
    onItemSelect4 (item:any) {
      this.getByFuncionario();
    }

    onItemDeSelect4 (item:any){
      this.getByFuncionario();
    }

    setupDropdown4() {
        this.dropdownList4 = [];
        this.selectedFuncionarios = [];
        this.dropdownSettings4 = {
          singleSelection: false,
          idField: 'item_id',
          textField: 'item_text',
          selectAllText: 'Seleccionar todo',
          unSelectAllText: 'Deseleccionar todo',
          searchPlaceholderText: 'Buscar Funcionario',
          itemsShowLimit: 1,
          allowSearchFilter: true,
          enableCheckAll: false,
        };
      }

  pdfDownload() {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Visitas activas', 15, 27)
        doc.text('Hora de impresión: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['#', 'Placa del Vehículo', 'Visitante', 'Cédula del visitante', 'Entrada']],
            body: this.contpdf,
            startY: 41,
            columnStyles: {
              0: {columnWidth: 10},
              1: {columnWidth: 'auto'},
              2: {columnWidth: 'auto'},
              3: {columnWidth: 'auto'},
              4: {columnWidth: 'auto'}
            }
        });   
        doc.save('visitasactivas.pdf');
    }

    excelDownload() {
        this.excelService.exportAsExcelFile(this.info, 'visitasActivas');
    }

    print() {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Visitas activas', 15, 27)
        doc.text('Hora de impresión: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['#', 'Placa del Vehículo', 'Visitante', 'Cédula del visitante', 'Entrada']],
            body: this.contpdf,
            startY: 41,
            columnStyles: {
              0: {columnWidth: 10},
              1: {columnWidth: 'auto'},
              2: {columnWidth: 'auto'},
              3: {columnWidth: 'auto'},
              4: {columnWidth: 'auto'}
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

    pdfDetalle() {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Visita: #' + this.visi.id, 15, 27)
        doc.text('Hora de impresión: '+ fecha, 15, 34);

        //validar imagenes
        var padding = 0;
        if(this.visi.image_1 ){
          padding = 0;
        }else{
          padding = 40;
        }

        //inserting visita
        doc.setTextColor(0);
        doc.setFontType("bold");
        doc.text('Entrada: ', 15, 50);
        doc.setFontType("normal");
        doc.text(this.visi.create_date, 34, 50);

        doc.setFontType("bold");
        doc.text('Latitud: ', 15, 57);
        doc.setFontType("normal");
        doc.text(this.visi.latitude.toString(), 36, 57);
        doc.setFontType("bold");
        doc.text('Longitud: ', 100, 57);
        doc.setFontType("normal");
        doc.text(this.visi.longitude.toString(), 123, 57);

        doc.setFontType("bold");
        doc.text('Materiales: ', 15, 64);
        doc.setFontType("normal");
        var matel = "";
        if(this.visi.observation.length != 0){
          for (var i=0; i<this.visi.observation.length; i++){
            var matel = matel + " "+this.visi.observation[i]+",";
          }
          var splitTitle = doc.splitTextToSize(matel, 120);
          doc.text(splitTitle, 42, 64);
        }else{
          doc.text('Sin materiales', 42, 64);
        }

        doc.setFontType("bold");
        doc.text('Imagenes: ', 15, 76);
        /* vehiculo */
        if (this.visi.vehicle != null) {
            doc.line(10, 125-padding, 200, 125-padding);

            doc.text('Vehículo ', 15, 133-padding);

            doc.setFontType("bold");
            doc.text('Nombre: ', 15, 140-padding);
            doc.setFontType("normal");
            doc.text(this.visi.vehicle.vehicle, 34, 140-padding);
            doc.setFontType("bold");
            doc.text('Placa: ', 100, 140-padding);
            doc.setFontType("normal");
            doc.text(this.visi.vehicle.plate, 117, 140-padding);

            doc.setFontType("bold");
            doc.text('Modelo: ', 15, 147-padding);
            doc.setFontType("normal");
            doc.text(this.visi.vehicle.model, 34, 147-padding);
            doc.setFontType("bold");
            doc.text('Color: ', 100, 147-padding);
            doc.setFontType("normal");
            doc.text(this.visi.vehicle.type, 115, 147-padding);
        }
        //funionario
        doc.line(10, 200-padding, 200, 200-padding);

        doc.setFontType("bold");
        doc.text('Funcionario', 15, 208-padding);
  
        doc.text('Nombre: ', 15, 215-padding);
        doc.setFontType("normal");
        doc.text(this.visi.visited.name, 34, 215-padding);
        doc.setFontType("bold");
        doc.text('Apellido: ', 100, 215-padding);
        doc.setFontType("normal");
        doc.text(this.visi.visited.lastname, 123, 215-padding);  

        doc.setFontType("bold");
        doc.text('Dirección: ', 15, 222-padding);
        doc.setFontType("normal");
        doc.text(this.visi.visited.address, 40, 222-padding);
        doc.setFontType("bold");
        doc.text('Cédula: ', 100, 222-padding);
        doc.setFontType("normal");
        doc.text(this.visi.visited.dni, 119, 222-padding);  

        //visitante
        doc.line(10, 230-padding, 200, 230-padding);

        doc.setFontType("bold");
        doc.text('Visitante', 15, 238-padding);
 
        doc.text('Nombre: ', 15, 245-padding);
        doc.setFontType("normal");
        doc.text(this.visi.visitor.name, 34, 245-padding);
        doc.setFontType("bold");
        doc.text('Apellido: ', 100, 245-padding);
        doc.setFontType("normal");
        doc.text(this.visi.visitor.lastname, 123, 245-padding);  

        doc.setFontType("bold");
        doc.text('Compañia: ', 15, 252-padding);
        doc.setFontType("normal");
        doc.text(this.visi.visitor.company, 38, 252-padding);
        doc.setFontType("bold");
        doc.text('Cédula: ', 100, 252-padding);
        doc.setFontType("normal");
        doc.text(this.visi.visitor.dni, 119, 252-padding);

        //registrado por
        doc.line(10, 260-padding, 200, 260-padding);

        doc.setFontType("bold");
        doc.text('Registrado por', 15, 268-padding);
 
        doc.text('Nombre: ', 15, 275-padding);
        doc.setFontType("normal");
        doc.text(this.visi.guard.name, 34, 275-padding);
        doc.setFontType("bold");
        doc.text('Apellido: ', 100, 275-padding);
        doc.setFontType("normal");
        doc.text(this.visi.guard.lastname, 123, 275-padding); 

        doc.setFontType("bold");
        doc.text('Correo: ', 15, 282-padding);
        doc.setFontType("normal");
        doc.text(this.visi.guard.email, 36, 282-padding);
        doc.setFontType("bold");
        doc.text('Cédula: ', 100, 282-padding);
        doc.setFontType("normal");
        doc.text(this.visi.guard.dni, 119, 282-padding);  

        if(this.visi.image_1){
          this.toDataURL(this.visi.image_1).then(dataUrl => {
            var imgData = dataUrl;
            doc.addImage(imgData, 'JPEG', 15, 80, 40, 40);
            if(this.visi.image_2){
              this.toDataURL(this.visi.image_2).then(dataUrl => {
                var imgData = dataUrl;
                doc.addImage(imgData, 'JPEG', 65, 80, 40, 40);
                if(this.visi.image_3){
                  this.toDataURL(this.visi.image_3).then(dataUrl => {
                    var imgData = dataUrl;
                    doc.addImage(imgData, 'JPEG', 115, 80, 40, 40);
                     if(this.visi.image_4){
                      this.toDataURL(this.visi.image_4).then(dataUrl => {
                        var imgData = dataUrl;
                        doc.addImage(imgData, 'JPEG', 165, 80, 40, 40);
                        if(this.visi.image_5){
                          this.toDataURL(this.visi.image_5).then(dataUrl => {
                            var imgData = dataUrl;
                            doc.addImage(imgData, 'JPEG', 215, 80, 40, 40);
                            if(this.visi.vehicle && this.visi.vehicle.photo){
                              this.toDataURL(this.visi.vehicle.photo).then(dataUrl => {
                                var imgData = dataUrl;
                                doc.addImage(imgData, 'JPEG', 15, 152-padding, 40, 40);
                                doc.save('visitaactivadetalle.pdf');
                              });
                            }else{
                              doc.save('visitaactivadetalle.pdf');
                            }
                          });
                        }else{
                          if(this.visi.vehicle && this.visi.vehicle.photo){
                              this.toDataURL(this.visi.vehicle.photo).then(dataUrl => {
                                var imgData = dataUrl;
                                doc.addImage(imgData, 'JPEG', 15, 152-padding, 40, 40);
                                doc.save('visitaactivadetalle.pdf');
                              });
                            }else{
                              doc.save('visitaactivadetalle.pdf');
                            }
                        }
                      });
                    }else{
                      if(this.visi.vehicle && this.visi.vehicle.photo){
                          this.toDataURL(this.visi.vehicle.photo).then(dataUrl => {
                            var imgData = dataUrl;
                            doc.addImage(imgData, 'JPEG', 15, 152-padding, 40, 40);
                            doc.save('visitaactivadetalle.pdf');
                          });
                        }else{
                          doc.save('visitaactivadetalle.pdf');
                        }
                    }
                  });
                }else{
                  if(this.visi.vehicle && this.visi.vehicle.photo){
                    this.toDataURL(this.visi.vehicle.photo).then(dataUrl => {
                      var imgData = dataUrl;
                      doc.addImage(imgData, 'JPEG', 15, 152-padding, 40, 40);
                      doc.save('visitaactivadetalle.pdf');
                    });
                  }else{
                    doc.save('visitaactivadetalle.pdf');
                  }
                }
              });
            }else{
              if(this.visi.vehicle && this.visi.vehicle.photo){
                this.toDataURL(this.visi.vehicle.photo).then(dataUrl => {
                  var imgData = dataUrl;
                  doc.addImage(imgData, 'JPEG', 15, 152-padding, 40, 40);
                  doc.save('visitaactivadetalle.pdf');
                });
              }else{
                doc.save('visitaactivadetalle.pdf');
              }
            }
          });
        }else{
          if(this.visi.vehicle && this.visi.vehicle.photo){
            this.toDataURL(this.visi.vehicle.photo).then(dataUrl => {
              var imgData = dataUrl;
              doc.addImage(imgData, 'JPEG', 15, 152-padding, 40, 40);
              doc.save('visitaactivadetalle.pdf');
            });
          }else{
            doc.save('visitaactivadetalle.pdf');
          }
      }        
    }

    printDetalle() {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Visita: #' + this.visi.id, 15, 27)
        doc.text('Hora de impresión: '+ fecha, 15, 34);
        //inserting visita
        doc.setTextColor(0);
        doc.setFontType("bold");
        doc.text('Entrada: ', 15, 50);
        doc.setFontType("normal");
        doc.text(this.visi.create_date, 34, 50);

        doc.setFontType("bold");
        doc.text('Latitud: ', 15, 57);
        doc.setFontType("normal");
        doc.text(this.visi.latitude.toString(), 36, 57);
        doc.setFontType("bold");
        doc.text('Longitud: ', 100, 57);
        doc.setFontType("normal");
        doc.text(this.visi.longitude.toString(), 123, 57);

        doc.setFontType("bold");
        doc.text('Materiales: ', 15, 64);
        doc.setFontType("normal");
        var matel = "";
        if(this.visi.observation.length != 0){
          for (var i=0; i<this.visi.observation.length; i++){
            var matel = matel + " "+this.visi.observation[i]+",";
          }
          doc.text(matel, 42, 64);
        }else{
          doc.text('Sin materiales', 42, 64);
        }

        doc.setFontType("bold");
        doc.text('Imagenes: ', 15, 71);
        /* vehiculo */
        if (this.visi.vehicle != null) {
            doc.line(10, 125, 200, 125);

            doc.text('Vehículo ', 15, 133);

            doc.setFontType("bold");
            doc.text('Nombre: ', 15, 140);
            doc.setFontType("normal");
            doc.text(this.visi.vehicle.vehicle, 34, 140);
            doc.setFontType("bold");
            doc.text('Placa: ', 100, 140);
            doc.setFontType("normal");
            doc.text(this.visi.vehicle.plate, 117, 140);

            doc.setFontType("bold");
            doc.text('Modelo: ', 15, 147);
            doc.setFontType("normal");
            doc.text(this.visi.vehicle.model, 34, 147);
            doc.setFontType("bold");
            doc.text('Color: ', 100, 147);
            doc.setFontType("normal");
            doc.text(this.visi.vehicle.type, 115, 147);
        }
        //funionario
        doc.line(10, 200, 200, 200);

        doc.setFontType("bold");
        doc.text('Funcionario', 15, 208);
  
        doc.text('Nombre: ', 15, 215);
        doc.setFontType("normal");
        doc.text(this.visi.visited.name, 34, 215);
        doc.setFontType("bold");
        doc.text('Apellido: ', 100, 215);
        doc.setFontType("normal");
        doc.text(this.visi.visited.lastname, 123, 215);  

        doc.setFontType("bold");
        doc.text('Dirección: ', 15, 222);
        doc.setFontType("normal");
        doc.text(this.visi.visited.address, 40, 222);
        doc.setFontType("bold");
        doc.text('Cédula: ', 100, 222);
        doc.setFontType("normal");
        doc.text(this.visi.visited.dni, 119, 222);  

        //visitante
        doc.line(10, 230, 200, 230);

        doc.setFontType("bold");
        doc.text('Visitante', 15, 238);
 
        doc.text('Nombre: ', 15, 245);
        doc.setFontType("normal");
        doc.text(this.visi.visitor.name, 34, 245);
        doc.setFontType("bold");
        doc.text('Apellido: ', 100, 245);
        doc.setFontType("normal");
        doc.text(this.visi.visitor.lastname, 123, 245);  

        doc.setFontType("bold");
        doc.text('Compañia: ', 15, 252);
        doc.setFontType("normal");
        doc.text(this.visi.visitor.company, 38, 252);
        doc.setFontType("bold");
        doc.text('Cédula: ', 100, 252);
        doc.setFontType("normal");
        doc.text(this.visi.visitor.dni, 119, 252);

        //registrado por
        doc.line(10, 260, 200, 260);

        doc.setFontType("bold");
        doc.text('Registrado por', 15, 268);
 
        doc.text('Nombre: ', 15, 275);
        doc.setFontType("normal");
        doc.text(this.visi.guard.name, 34, 275);
        doc.setFontType("bold");
        doc.text('Apellido: ', 100, 275);
        doc.setFontType("normal");
        doc.text(this.visi.guard.lastname, 123, 275); 

        doc.setFontType("bold");
        doc.text('Correo: ', 15, 282);
        doc.setFontType("normal");
        doc.text(this.visi.guard.email, 36, 282);
        doc.setFontType("bold");
        doc.text('Cédula: ', 100, 282);
        doc.setFontType("normal");
        doc.text(this.visi.guard.dni, 119, 282);  

        if(this.visi.image_1){
          this.toDataURL(this.visi.image_1).then(dataUrl => {
            var imgData = dataUrl;
            doc.addImage(imgData, 'JPEG', 15, 78, 40, 40);
            if(this.visi.image_2){
              this.toDataURL(this.visi.image_2).then(dataUrl => {
                var imgData = dataUrl;
                doc.addImage(imgData, 'JPEG', 65, 78, 40, 40);
                if(this.visi.image_3){
                  this.toDataURL(this.visi.image_3).then(dataUrl => {
                    var imgData = dataUrl;
                    doc.addImage(imgData, 'JPEG', 115, 78, 40, 40);
                     if(this.visi.image_4){
                      this.toDataURL(this.visi.image_4).then(dataUrl => {
                        var imgData = dataUrl;
                        doc.addImage(imgData, 'JPEG', 165, 78, 40, 40);
                        if(this.visi.image_5){
                          this.toDataURL(this.visi.image_5).then(dataUrl => {
                            var imgData = dataUrl;
                            doc.addImage(imgData, 'JPEG', 215, 78, 40, 40);
                            if(this.visi.vehicle && this.visi.vehicle.photo){
                              this.toDataURL(this.visi.vehicle.photo).then(dataUrl => {
                                var imgData = dataUrl;
                                doc.addImage(imgData, 'JPEG', 15, 152, 40, 40);
                                doc.autoPrint();
                                window.open(doc.output('bloburl'), '_blank');
                              });
                            }else{
                              doc.autoPrint();
                              window.open(doc.output('bloburl'), '_blank');
                            }
                          });
                        }else{
                          if(this.visi.vehicle && this.visi.vehicle.photo){
                              this.toDataURL(this.visi.vehicle.photo).then(dataUrl => {
                                var imgData = dataUrl;
                                doc.addImage(imgData, 'JPEG', 15, 152, 40, 40);
                                doc.autoPrint();
                                window.open(doc.output('bloburl'), '_blank');
                              });
                            }else{
                              doc.autoPrint();
                              window.open(doc.output('bloburl'), '_blank');
                            }
                        }
                      });
                    }else{
                      if(this.visi.vehicle && this.visi.vehicle.photo){
                          this.toDataURL(this.visi.vehicle.photo).then(dataUrl => {
                            var imgData = dataUrl;
                            doc.addImage(imgData, 'JPEG', 15, 152, 40, 40);
                            doc.autoPrint();
                            window.open(doc.output('bloburl'), '_blank');
                          });
                        }else{
                          doc.autoPrint();
                          window.open(doc.output('bloburl'), '_blank');
                        }
                    }
                  });
                }else{
                  if(this.visi.vehicle && this.visi.vehicle.photo){
                    this.toDataURL(this.visi.vehicle.photo).then(dataUrl => {
                      var imgData = dataUrl;
                      doc.addImage(imgData, 'JPEG', 15, 152, 40, 40);
                      doc.autoPrint();
                      window.open(doc.output('bloburl'), '_blank');
                    });
                  }else{
                    doc.autoPrint();
                    window.open(doc.output('bloburl'), '_blank');
                  }
                }
              });
            }else{
              if(this.visi.vehicle && this.visi.vehicle.photo){
                this.toDataURL(this.visi.vehicle.photo).then(dataUrl => {
                  var imgData = dataUrl;
                  doc.addImage(imgData, 'JPEG', 15, 152, 40, 40);
                  doc.autoPrint();
                  window.open(doc.output('bloburl'), '_blank');
                });
              }else{
                doc.autoPrint();
                window.open(doc.output('bloburl'), '_blank');
              }
            }
          });
        }else{
          if(this.visi.vehicle && this.visi.vehicle.photo){
            this.toDataURL(this.visi.vehicle.photo).then(dataUrl => {
              var imgData = dataUrl;
              doc.addImage(imgData, 'JPEG', 15, 152, 40, 40);
              doc.autoPrint();
              window.open(doc.output('bloburl'), '_blank');
            });
          }else{
            doc.autoPrint();
            window.open(doc.output('bloburl'), '_blank');
          }
      }        
    }

    toDataURL = url => fetch(url)
      .then(response => response.blob())
      .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      }));

    excelDetalle() {
        var excel = [];
        excel = [
            {'Entrada': this.visi.create_date, 'Latitud': this.visi.latitude, 'Longitude': this.visi.longitude, '': ''},
            {'Entrada': 'Materiales'},
            {'Entrada': this.visi.observation[0]}
        ];
        if (this.visi.vehicle) {
            excel.push({'Entrada':'Vehiculo'});
            excel.push({'Entrada':'Tipo', 'Latitud':'Placa', 'Longitude':'Modelo', '':'Color'});
            excel.push({'Entrada':this.visi.vehicle.vehicle, 'Latitud':this.visi.vehicle.plate, 'Longitude':this.visi.vehicle.model, '':this.visi.vehicle.type});
        }
        excel.push({'Entrada':'Funcionario'});
        excel.push({'Entrada':'Nombre', 'Latitud':'Apellido', 'Longitude':'Dirección', '':'Cédula'});
        excel.push({'Entrada':this.visi.visited.name, 'Latitud':this.visi.visited.lastname, 'Longitude':this.visi.visited.address, '':this.visi.visited.dni});
        excel.push({'Entrada':'Visitante'});
        excel.push({'Entrada':'Nombre', 'Latitud':'Apellido', 'Longitude':'Correo', '':'Cédula'});
        excel.push({'Entrada':this.visi.visitor.name, 'Latitud':this.visi.visitor.lastname, 'Longitude':this.visi.visitor.email, '':this.visi.visitor.dni});
        excel.push({'Entrada':'Registrado por'});
        excel.push({'Entrada':'Nombre', 'Latitud':'Apellido', 'Longitude':'Correo', '':'Cédula'});
        excel.push({'Entrada':this.visi.guard.name, 'Latitud':this.visi.guard.lastname, 'Longitude':this.visi.guard.email, '':this.visi.guard.dni});
        this.excelService.exportAsExcelFile(excel, 'admindetail');
    }

}
