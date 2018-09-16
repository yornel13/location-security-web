import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BitacoraService } from '../../../../../model/bitacora/bitacora.service';
import { Bitacora } from '../../../../../model/bitacora/bitacora';
import { GuardService } from '../../../../../model/guard/guard.service';
import { AgmMap } from '@agm/core';
import { IncidenciasService } from '../../../../../model/incidencias/incidencia.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExcelService } from '../../../../../model/excel/excel.services';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import * as geolib from 'geolib';
import {Admin} from '../../../../../model/admin/admin';
import {AuthenticationService} from '../../../../_services';

@Component({
  selector: 'app-reportets',
  templateUrl: './reportets.component.html',
  styleUrls: ['./reportets.component.css']
})
export class ReportetsComponent {
  //general
  reportes:any = [];
  data:any = [];
  open:any = [];
  reopen:any = [];
  report:any = [];
  comentarios:any = [];
  coment:any = [];
  resolved:number = 0;
  change:any = [];
  haycomentarios:boolean = false;
  incidencias:any = [];
  inciden:any = [];
  incidenSelect:number = 0;
  //vistas
  lista:boolean;
  detalle:boolean;
  //comentario
  newcoment:string = '';
  addcomment:boolean = false;
  lat: number = 0;
  lng: number = 0;
  valueDate:any = [];
  dateSelect:any = '';
  filtro:boolean = true;
  guardiaSelect:number = 0;
  filtroSelect:number = 0;
  guardias:any = [];
  guard:any = [];
  //status
  status:number = 0;
  hay: boolean;
  numElement:number = 10;
  //exportaciones
  contpdf:any = [];
  info: any = [];

  key: string = 'id'; //set default
  reverse: boolean = true;

  //map
  map: any;
  mapchart: any;
  lat2:number= -2.0000;
  lng2:number = -79.0000;
  viewmap:boolean = false;

  //fechas
  desde:any = "";
  hasta:any = "";
  rangeday:boolean=true;

  //dropdow
  dropdownList1 = [];
  selectedIncidencias = [];
  dropdownSettings1 = {};

  dropdownList2 = [];
  selectedGuardias = [];
  dropdownSettings2 = {};

  zoom: 12;
  center = L.latLng(([ this.lat2, this.lng2 ]));
  marker = L.marker([this.lat2, this.lng2], {draggable: false});

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
        public router: Router,
        private bitacoraService: BitacoraService,
        private guardiaService: GuardService,
        private incidenciaService: IncidenciasService,
        private excelService: ExcelService,
        private authService: AuthenticationService) {
      this.getOpenAll();
      this.getIncidencias();
      this.getGuardias();
      this.lista = true;
      this.detalle = false;
      this.setupDropdown1();
      this.setupDropdown2();
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
        center: L.latLng(([this.lat2, this.lng2 ]))
    };

    onMapReady(map: L.Map) {
      console.log("entra aqui");
      this.map =  map;
        this.zoom = 12;
        this.center = L.latLng(([ this.lat2, this.lng2 ]));
      this.marker = L.marker([this.lat2, this.lng2], {draggable: false});
      this.layersControlOptions = { position: 'bottomright' };
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 20,
            detectRetina: true,
            attribution: 'Open Street Map'
        }).addTo(this.map);
        this.marker.addTo(this.map);
    }

    onMapReadyChart(map: L.Map) {
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

    getOpenAll() {
      this.bitacoraService.getOpenAll().then(
        success => {
          this.reportes = success;
          this.data = this.reportes.data;
          var body = [];
          var excel = [];
          var resolve = "";
          for(var i=0; i<this.data.length; i++){
              if(this.data[i].resolved == 0){
                resolve = "Cerrado";
              }else if(this.data[i].resolved == 1){
                resolve = "Abierto";
              }else{
                resolve = "Reabierto";
              }
              this.data[i].id = Number(this.data[i].id);
              excel.push({'#' : this.data[i].id, 'Título': this.data[i].title, 'Observación':this.data[i].observation, 'Fecha':this.data[i].create_date, 'Status':resolve})
              body.push([this.data[i].id, this.data[i].title, this.data[i].observation, this.data[i].create_date, resolve])
          }
          this.contpdf = body;
          this.info = excel;
          if(this.reportes.total == 0){
            this.hay = false;
          }else{
            this.hay = true;
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
      this.bitacoraService.getId(id).then(
        success => {
          this.report = success;
          this.report.latitude = this.lat2 = Number(this.report.latitude);
          this.report.longitude = this.lng2 = Number(this.report.longitude);
          this.lista = false;
          this.detalle = true;
          this.zoom = 12;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );

      this.bitacoraService.getComentarios(id).then(
        success => {
          this.comentarios = success;
          this.coment = this.comentarios.data;
          if(this.coment.length == 0){
            this.haycomentarios = false;
          }else{
            this.haycomentarios = true;
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

    regresar() {
      this.lista = true;
      this.detalle = false;
      this.viewmap = false;
    }

    changeResolve(id, resolved) {
      if(resolved == 0){
        this.bitacoraService.setReopen(id).then(
          succcess =>{
            this.getOpenAll();
          }, error=>{
            if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
          }
        );
      }else{
        this.bitacoraService.setClose(id).then(
        success => {
          this.getOpenAll();
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

      var guardia = this.selectedGuardias;
      var incidencia = this.selectedIncidencias;

      //Incidencias
      if(this.filtroSelect == 0){
         if(this.desde == ""){
           if(incidencia.length == 0){
             this.getOpenAll();
           }else{
              var result = [];
              for(var i=0;i<incidencia.length;i++){
                this.bitacoraService.getByIncidenciaOpen(incidencia[i].item_id).then(
                success => {
                this.reportes = success;
                result = result.concat(this.reportes.data);
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
         }else{
           if(this.rangeday){
             if(incidencia.length == 0){
                this.bitacoraService.getOpenDate(year1, month1, day1, year1, month1, day1).then(
                success => {
                this.reportes = success;
                this.data = this.reportes.data;
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
             }else{
                var result = [];
                for(var i=0;i<incidencia.length;i++){
                  this.bitacoraService.getByIncidenciaOpenDate(incidencia[i].item_id, year1, month1, day1, year1, month1, day1).then(
                  success => {
                  this.reportes = success;
                  result = result.concat(this.reportes.data);
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
           }else{
             if(incidencia.length == 0){
                this.bitacoraService.getOpenDate(year1, month1, day1, year2, month2, day2).then(
                success => {
                this.reportes = success;
                this.data = this.reportes.data;
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
             }else{
                var result = [];
                for(var i=0;i<incidencia.length;i++){
                  this.bitacoraService.getByIncidenciaOpenDate(incidencia[i].item_id, year1, month1, day1, year2, month2, day2).then(
                  success => {
                  this.reportes = success;
                  result = result.concat(this.reportes.data);
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
      }
      //Guardias
      if(this.filtroSelect == 1){
        if(this.desde == ""){
           if(guardia.length == 0){
             this.getOpenAll();
           }else{
              var result = [];
              for(var i=0;i<guardia.length;i++){
                this.bitacoraService.getByGuardiaOpen(guardia[i].item_id).then(
                success => {
                this.reportes = success;
                result = result.concat(this.reportes.data);
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
         }else{
           if(this.rangeday){
             if(guardia.length == 0){
                this.bitacoraService.getOpenDate(year1, month1, day1, year1, month1, day1).then(
                success => {
                this.reportes = success;
                this.data = this.reportes.data;
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
             }else{
                var result = [];
                for(var i=0;i<guardia.length;i++){
                  this.bitacoraService.getByGuardiaOpenDate(guardia[i].item_id, year1, month1, day1, year1, month1, day1).then(
                  success => {
                  this.reportes = success;
                  result = result.concat(this.reportes.data);
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
           }else{
             if(guardia.length == 0){
                this.bitacoraService.getOpenDate(year1, month1, day1, year2, month2, day2).then(
                success => {
                this.reportes = success;
                this.data = this.reportes.data;
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
             }else{
                var result = [];
                for(var i=0;i<guardia.length;i++){
                  this.bitacoraService.getByGuardiaOpenDate(guardia[i].item_id, year1, month1, day1, year2, month2, day2).then(
                  success => {
                  this.reportes = success;
                  result = result.concat(this.reportes.data);
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
      }
    }


    getIncidencias() {
      this.incidenciaService.getAll().then(
        success => {
          this.incidencias = success;
          this.inciden = this.incidencias.data;
          const datag = [];
          this.inciden.forEach(inciden => {
            datag.push({ item_id: inciden.id, item_text: inciden.name });
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

    getGuardias() {
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

    selectFilert(filter) {
      if (filter == 0){
        this.guardiaSelect = 0;
        this.incidenSelect = 0;
        this.desde = '';
        this.hasta = '';
        this.filtro = true;
        this.getOpenAll();
      }else{
        this.incidenSelect = 0;
        this.guardiaSelect = 0;
        this.desde = '';
        this.hasta = '';
        this.filtro = false;
        this.getOpenAll();
      }
    }

    agregarComentario(){
        this.addcomment = true;
    }

    guardarComentario(report_id) {
        const admin: Admin = this.authService.getUser();
        const useradmin = admin.name + ' ' + admin.lastname;
        const idAdmin = admin.id;
        const report = report_id;
        const comentario = this.newcoment;
        const nuevocom: Bitacora = {
            report_id: report,
            text: comentario,
            admin_id: idAdmin,
            user_name: useradmin,
        };
        this.bitacoraService.addCommetario(nuevocom).then(
        success => {
          this.viewDetail(report_id);
          this.addcomment = false;
          this.newcoment = '';
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
    this.getSearch();
  }

  onItemDeSelect1(item:any){
    this.getSearch();
  }

  setupDropdown1() {
      this.dropdownList1 = [];
      this.selectedIncidencias = [];
      this.dropdownSettings1 = {
        singleSelection: false,
        idField: 'item_id',
        textField: 'item_text',
        selectAllText: 'Seleccionar todo',
        unSelectAllText: 'Deseleccionar todo',
        searchPlaceholderText: 'Buscar Incidencia',
        itemsShowLimit: 3,
        allowSearchFilter: true,
        enableCheckAll: false,
      };
    }
    //configuración de los selects
    onItemSelect2 (item:any) {
      this.getSearch();
    }

    onItemDeSelect2 (item:any){
      this.getSearch();
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

    pdfDownload() {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Reportes Abiertos', 15, 27)
        doc.text('Hora de impresión: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['#', 'Título', 'Observación', 'Fecha', 'Status']],
            body: this.contpdf,
            startY: 41,
            columnStyles: {
              0: {columnWidth: 10},
              1: {columnWidth: 'auto'},
              2: {columnWidth: 'auto'},
              3: {columnWidth: 'auto'},
              4: {columnWidth: 20}
            }
        });   
        doc.save('reportesopen.pdf');
    }

    excelDownload() {
        this.excelService.exportAsExcelFile(this.info, 'reportesopen');
    }

    print() {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Reportes Abiertos', 15, 27)
        doc.text('Hora de impresión: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['#', 'Título', 'Observación', 'Fecha', 'Status']],
            body: this.contpdf,
            startY: 41,
            columnStyles: {
              0: {columnWidth: 10},
              1: {columnWidth: 'auto'},
              2: {columnWidth: 'auto'},
              3: {columnWidth: 'auto'},
              4: {columnWidth: 20}
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
        doc.text('Reporte Abierto', 15, 27)
        doc.text('Hora de impresión: '+ fecha, 15, 34);
        //inserting data
        doc.setTextColor(0);
        doc.setFontType("bold");
        doc.text('Incidencia: ', 15, 50);
        doc.setFontType("normal");
        doc.text(this.report.title, 42, 50);

        doc.setFontType("bold");
        doc.text('Observación: ', 15, 57);
        doc.setFontType("normal");
        var splitTitle = doc.splitTextToSize(this.report.observation, 120);
        //doc.text(15, 20, splitTitle);
        doc.text(splitTitle, 50, 57);        

        doc.setFontType("bold");
        doc.text('Latitud: ', 15, 71);
        doc.setFontType("normal");
        doc.text(this.report.latitude.toString(), 36, 71);
        doc.setFontType("bold");
        doc.text('Longitud: ', 100, 71);
        doc.setFontType("normal");
        doc.text(this.report.longitude.toString(), 123, 71);

        //guardia
        doc.line(10, 77, 200, 77);

        doc.setFontType("bold");
        doc.text('Guardia', 15, 84);

        doc.setFontType("bold");
        doc.text('Nombre: ', 15, 91);
        doc.setFontType("normal");
        doc.text(this.report.watch.guard_name, 34, 91);
        doc.setFontType("bold");
        doc.text('Apellido: ', 100, 91);
        doc.setFontType("normal");
        doc.text(this.report.watch.guard_lastname, 123, 91);

        doc.setFontType("bold");
        doc.text('Cédula: ', 15, 98);
        doc.setFontType("normal");
        doc.text(this.report.watch.guard_dni, 34, 98);
        doc.setFontType("bold");
        doc.text('Correo: ', 100, 98);
        doc.setFontType("normal");
        doc.text(this.report.watch.guard_email, 119, 98);

        doc.line(10, 105, 200, 105);
        for(var i=0; i < this.coment.length; i++){
          doc.setFontType("bold");
          doc.text('Comentario: #'+(i+1)+' ', 15, 112+i*(14));
          doc.setFontType("normal");
          doc.text(this.coment[i].text, 50, 112+i*(14));
          doc.setFontType("bold");
          doc.text('Usuario: ', 100, 112+i*(14));
          doc.setFontType("normal");
          doc.text(this.coment[i].user_name, 119, 112+i*(14));
        }

        doc.save('reporteabiertoDetail.pdf');

    }

    printDetalle() {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Reporte Abierto', 15, 27)
        doc.text('Hora de impresión: '+ fecha, 15, 34);
        //inserting data
        doc.setTextColor(0);
        doc.setFontType("bold");
        doc.text('Incidencia: ', 15, 50);
        doc.setFontType("normal");
        doc.text(this.report.title, 42, 50);

        doc.setFontType("bold");
        doc.text('Observación: ', 15, 57);
        doc.setFontType("normal");
        var splitTitle = doc.splitTextToSize(this.report.observation, 120);
        //doc.text(15, 20, splitTitle);
        doc.text(splitTitle, 50, 57);        

        doc.setFontType("bold");
        doc.text('Latitud: ', 15, 71);
        doc.setFontType("normal");
        doc.text(this.report.latitude.toString(), 36, 71);
        doc.setFontType("bold");
        doc.text('Longitud: ', 100, 71);
        doc.setFontType("normal");
        doc.text(this.report.longitude.toString(), 123, 71);

        //guardia
        doc.line(10, 77, 200, 77);

        doc.setFontType("bold");
        doc.text('Guardia', 15, 84);

        doc.setFontType("bold");
        doc.text('Nombre: ', 15, 91);
        doc.setFontType("normal");
        doc.text(this.report.watch.guard_name, 34, 91);
        doc.setFontType("bold");
        doc.text('Apellido: ', 100, 91);
        doc.setFontType("normal");
        doc.text(this.report.watch.guard_lastname, 123, 91);

        doc.setFontType("bold");
        doc.text('Cédula: ', 15, 98);
        doc.setFontType("normal");
        doc.text(this.report.watch.guard_dni, 34, 98);
        doc.setFontType("bold");
        doc.text('Correo: ', 100, 98);
        doc.setFontType("normal");
        doc.text(this.report.watch.guard_email, 119, 98);

        doc.line(10, 105, 200, 105);
        for(var i=0; i < this.coment.length; i++){
          doc.setFontType("bold");
          doc.text('Comentario: #'+(i+1)+' ', 15, 112+i*(14));
          doc.setFontType("normal");
          doc.text(this.coment[i].text, 50, 112+i*(14));
          doc.setFontType("bold");
          doc.text('Usuario: ', 100, 112+i*(14));
          doc.setFontType("normal");
          doc.text(this.coment[i].user_name, 119, 112+i*(14));
        }

        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');

    }

    excelDetalle() {
        var excel = [];
        excel = [{'Incidencia' : this.report.title, 'Observacion' : this.report.observation, 'Latitud': this.report.latitude.toString(), 'Longitud':this.report.longitude.toString()}];
        excel.push({'Incidencia':'Guardia'});
        excel.push({'Incidencia':'Nombre', 'Observacion':'Apellido', 'Latitud':'Cédula', 'Longitud':'Correo'});
        excel.push({'Incidencia':this.report.watch.guard_name, 'Observacion':this.report.watch.guard_lastname, 'Latitud':this.report.watch.guard_dni, 'Longitud':this.report.watch.guard_email});
        excel.push({'Incidencia':'Comentarios'});
        for(var i=0; i < this.coment.length; i++){
          excel.push({'Incidencia':this.coment[i].text, 'Observacion':this.coment[i].user_name});
        }
        this.excelService.exportAsExcelFile(excel, 'reporteabiertodetail');
    }


}
