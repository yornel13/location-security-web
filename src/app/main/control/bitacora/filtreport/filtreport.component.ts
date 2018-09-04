import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { BitacoraService } from '../../../../../model/bitacora/bitacora.service';
import { Bitacora } from '../../../../../model/bitacora/bitacora';
import { GuardService } from '../../../../../model/guard/guard.service';
import { IncidenciasService } from '../../../../../model/incidencias/incidencia.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExcelService } from '../../../../../model/excel/excel.services';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import * as geolib from 'geolib';
import {isNumber} from 'util';
import {AuthenticationService} from '../../../../_services';
import {Admin} from '../../../../../model/admin/admin';

@Component({
  selector: 'app-filtreport',
  templateUrl: './filtreport.component.html',
  styleUrls: ['./filtreport.component.css']
})
export class FiltreportComponent implements OnInit {
  /* general */
  reportes: any = [];
  data: any = [];
  open: any = [];
  reopen: any = [];
  report: any = [];
  comentarios: any = [];
  coment: any = [];
  resolved: number = 0;
  change: any = [];
  incidencias: any = [];
  inciden: any = [];
  incidenSelect: number = 0;
  haycomentarios: boolean = false;
  valueDate: any = [];
  dateSelect: any = '';
  filtro: boolean = true;
  guardiaSelect: number = 0;
  filtroSelect: number = 0;
  guardias: any = [];
  guard: any = [];
  /* vistas */
  lista: boolean;
  detalle: boolean;
  /* comentario */
  newcoment: string = '';
  addcomment: boolean = false;
  /* status */
  status: number = 0;
  numElement: number = 10;
  /* new chart */
  dataSource: any = {};
  valores: number[] = [2,2];
  names: string[] = ["Robo", "Incendio"];
  datos: any = [{"label": "Robo",
                "value": 2},
                {"label": "Incendio",
                "value": 2}];
  /* exportaciones */
  contpdf:any = [];
  info: any = [];
  /* order table */
  key: string = 'id';
  reverse: boolean = true;
  /* filter chart */
  rangeday:boolean = true;
  desde:string = "";
  hasta:string = "";
  chartreportes:any = [];
  chartdata:any = [];

  //map
  map: any;
  mapchart: any;
  lat:number= -2.0000;
  lng:number = -79.0000;
  viewmap:boolean = false;

  //fechas
  desde2:any = "";
  hasta2:any = "";
  rangeday2:boolean=true;
  date:any;
  month2:any;
  day2:any;

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
            public router: Router,
            private bitacoraService: BitacoraService,
            private guardiaService: GuardService,
            private incidenciaService: IncidenciasService,
            private excelService: ExcelService,
            private route: ActivatedRoute,
            private authService: AuthenticationService) {
        this.getIncidencias();
        this.getToday();
        this.getGuardias();
        this.lista = true;
        this.detalle = false;
        this.dataSource = {
            chart: {
                "yAxisName": "Cantidad de reportes",
                "yAxisMaxValue": 5
            },
            // Chart Data
            "data": this.datos
        };
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
      console.log(coord);
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

  selectRange(id){
      if(id == 1){
        this.rangeday2 = true;
        this.desde2 = "";
        this.hasta2 = "";
        this.getSearch();
      }else{
        this.rangeday2 = false;
        this.desde2 = "";
        this.hasta2 = "";
        this.getSearch();
      }
    }

    selectRange2(id){
      if(id == 1){
        this.rangeday = true;
        this.desde = "";
        this.hasta = "";
        this.getChartDate();
      }else{
        this.rangeday = false;
        this.desde = "";
        this.hasta = "";
        this.getChartDate();
      }
    }

  	getAll() {
    	this.bitacoraService.getAll().then(
    		success => {
    			this.reportes = success;
    			this.data = this.reportes.data;
          console.log(this.data);
          this.incidenciaService.getAll().then(
          success => {
            this.incidencias = success;
            this.inciden = this.incidencias.data;
            //exports files
            var body = [];
            var excel = [];
            var resolve = "";
            for(var i=0; i<this.data.length; i++){
                this.data[i].id = Number(this.data[i].id);
                if(this.data[i].resolved == 0){
                  resolve = "Cerrado";
                }else if(this.data[i].resolved == 1){
                  resolve = "Abierto";
                }else{
                  resolve = "Reabierto";
                }
                excel.push({'#' : this.data[i].id, 'Título': this.data[i].title, 'Observación':this.data[i].observation, 'Fecha':this.data[i].create_date, 'Status':resolve})
                body.push([this.data[i].id, this.data[i].title, this.data[i].observation, this.data[i].create_date, resolve])
            }
            this.contpdf = body;
            this.info = excel;
            //chart
            var hola = [];
            var nombres = [];
            var valores = [];
            nombres = this.nameInciden();
            valores = this.countInciden(this.data);
            this.dataSource.chart.yAxisMaxValue = Math.max(...valores) + 2;
            for(var i=0; i<this.incidencias.total; i++){
              if(nombres[i] != "General"){
                hola.push({"label":nombres[i], "value":valores[i]})
              }
            }
            this.datos = hola;
            this.dataSource.data = this.datos;
              }, error => {
                  if (error.status === 422) {
                      // on some data incorrect
                  } else {
                      // on general error
                  }
              }
          );

          for(var i = 0; i < this.data.length; i++){
            if(this.data[i].resolved == 0){
              this.change[i] = 0;
            }else{
              this.change[i] = 1;
            }
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

    getToday(){
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

      this.date = year+"-"+this.month2+"-"+this.day2;
      this.desde2 =this.date;

      this.bitacoraService.getByDate(year, this.month2, this.day2, year, this.month2, this.day2).then(
          success => {
          this.reportes = success;
          this.data = this.reportes.data;
          }, error => {
              if (error.status === 422) {
                  // on some data incorrect
              } else {
                  // on general error
              }
          }
       );

    }

    countInciden(data){
      var value = []
      if(data.length == 0){
        value = [];
        return value;
      }else{
        for(var j=0; j<this.incidencias.total; j++){
          var hola = 0;
            for(var i=0; i<data.length; i++){
              if(data[i].incidence_id == this.inciden[j].id){
                hola++;
              }
            }
          value[j] = hola;
      }
      return value;
    }
  }

    countIncidenDate(data){
        var value = []

        var fecha1 = String(this.desde);
        var valueDate1 = fecha1.split('-');
        var year1 = valueDate1[0];
        var month1 = valueDate1[1];
        var day1 = valueDate1[2];

        var fecha2 = String(this.hasta);
        var valueDate2 = fecha2.split('-');
        var year2 = valueDate2[0];
        var month2 = valueDate2[1];
        var day2 = valueDate2[2];

        var date1 = fecha1.replace('-','');
        var date11 = Number(date1.replace('-',''));
        var date2 = fecha2.replace('-','');
        var date22 = Number(date2.replace('-',''));

        if(data.length == 0){
          value = [];
          return value;
        }else{
          for(var j=0; j<this.incidencias.total; j++){
            var hola = 0;
              for(var i=0; i<data.length; i++){
                var date = String(this.chartdata[i].create_date);
                var valueDate = date.split(' ');
                var fecha = valueDate[0].toString();
                var fecha1 = fecha.replace('-','');
                var fecha11 = Number(fecha1.replace('-',''));
                console.log(fecha11);
                console.log(date11);
                console.log(date22);

                if(fecha11 >= date11 && fecha11 <= date22){
                  if(data[i].incidence_id == this.inciden[j].id){
                    hola++;
                  }
                }
              }
            value[j] = hola;
        }
        return value;
      }
    }

    nameInciden(){
      var name = [];
      for(var i=0; i<this.incidencias.total; i++){
        name[i] = this.inciden[i].name;
      }
      return name;
    }

    getChartDate(){
      var fecha1 = String(this.desde);
      var valueDate1 = fecha1.split('-');
      var year1 = valueDate1[0];
      var month1 = valueDate1[1];
      var day1 = valueDate1[2];

      var fecha2 = String(this.hasta);
      var valueDate2 = fecha2.split('-');
      var year2 = valueDate2[0];
      var month2 = valueDate2[1];
      var day2 = valueDate2[2];

      var date1 = fecha1.replace('-','');
      var date11 = Number(date1.replace('-',''));
      var date2 = fecha2.replace('-','');
      var date22 = Number(date2.replace('-',''));

      if(this.rangeday){
        if(this.desde == ""){
          this.bitacoraService.getAll().then(
          success => {
            this.chartreportes = success;
            this.chartdata = this.chartreportes.data;
            //chart
            var hola = [];
            var nombres = [];
            var valores = [];
            nombres = this.nameInciden();
            valores = this.countInciden(this.chartdata);
            for(var i=0; i<this.incidencias.total; i++){
              if(nombres[i] != "General"){
                hola.push({"label":nombres[i], "value":valores[i]})
              }
            }
            this.datos = hola;
            this.dataSource.data = hola;
              }, error => {
                  if (error.status === 422) {
                      // on some data incorrect
                  } else {
                      // on general error
                  }
              }
          );
        }else{
          this.bitacoraService.getByDate(year1, month1, day1, year1, month1, day1).then(
          success => {
            this.chartreportes = success;
            this.chartdata = this.chartreportes.data;
            //chart
            var hola = [];
            var nombres = [];
            var valores = [];
            nombres = this.nameInciden();
            valores = this.countInciden(this.chartdata);
            for(var i=0; i<this.incidencias.total; i++){
              if(nombres[i] != "General"){
                hola.push({"label":nombres[i], "value":valores[i]})
              }
            }
            this.datos = hola;
            this.dataSource.data = hola;
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
        if(this.desde == ""){
          this.hasta = "";
          this.bitacoraService.getAll().then(
          success => {
            this.chartreportes = success;
            this.chartdata = this.chartreportes.data;
            //chart
            var hola = [];
            var nombres = [];
            var valores = [];
            nombres = this.nameInciden();
            valores = this.countInciden(this.chartdata);
            for(var i=0; i<this.incidencias.total; i++){
              if(nombres[i] != "General"){
                hola.push({"label":nombres[i], "value":valores[i]})
              }
            }
            this.datos = hola;
            this.dataSource.data = hola;
              }, error => {
                  if (error.status === 422) {
                      // on some data incorrect
                  } else {
                      // on general error
                  }
              }
          );
        }else{
          if(this.hasta != ""){
            this.bitacoraService.getAll().then(
            success => {
              this.chartreportes = success;
              this.chartdata = this.chartreportes.data;
              //chart
              var hola = [];
              var nombres = [];
              var valores = [];
              nombres = this.nameInciden();
              valores = this.countIncidenDate(this.chartdata);
              for(var i=0; i<this.incidencias.total; i++){
                if(nombres[i] != "General"){
                  hola.push({"label":nombres[i], "value":valores[i]})
                }
              }
              console.log(hola);
              this.datos = hola;
              this.dataSource.data = hola;
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
      this.bitacoraService.getId(id).then(
        success => {
          this.report = success;
          this.report.latitude = this.lat = Number(this.report.latitude);
          this.report.longitude = this.lng = Number(this.report.longitude);
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
            this.getAll();
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
          this.getAll();
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

    getIncidencias() {
    	this.incidenciaService.getAll().then(
        success => {
          this.incidencias = success;
          this.inciden = this.incidencias.data;
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
        this.desde2 = '';
        this.hasta2 = '';
        this.filtro = true;
        this.getAll();
      }else{
        this.incidenSelect = 0;
        this.guardiaSelect = 0;
        this.desde2 = '';
        this.hasta2 = '';
        this.filtro = false;
        this.getAll();
      }
    }

    getSearch() {
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

      //incidencia
      if(this.filtroSelect == 0){
        if(this.desde2 == ""){
          if(this.status == 0){
            if(this.incidenSelect == 0){
              this.getAll();
            }else{
              this.bitacoraService.getByIncidenAll(this.incidenSelect).then(
                  success => {
                  this.reportes = success;
                  this.data = this.reportes.data;
                  }, error => {
                      if (error.status === 422) {
                          // on some data incorrect
                      } else {
                          // on general error
                      }
                  }
              );
            }
          }else if(this.status == 1){
            if(this.incidenSelect == 0){
              this.bitacoraService.getOpenAll().then(
                  success => {
                  this.reportes = success;
                  this.data = this.reportes.data;
                  }, error => {
                      if (error.status === 422) {
                          // on some data incorrect
                      } else {
                          // on general error
                      }
                  }
              );
            }else{
              this.bitacoraService.getByIncidenciaOpen(this.incidenSelect).then(
                  success => {
                  this.reportes = success;
                  this.data = this.reportes.data;
                  }, error => {
                      if (error.status === 422) {
                          // on some data incorrect
                      } else {
                          // on general error
                      }
                  }
              );
            }
          }else if(this.status == 2){
            if(this.incidenSelect == 0){
              this.bitacoraService.getCloseAll().then(
                  success => {
                  this.reportes = success;
                  this.data = this.reportes.data;
                  }, error => {
                      if (error.status === 422) {
                          // on some data incorrect
                      } else {
                          // on general error
                      }
                  }
              );
            }else{
              this.bitacoraService.getByIncidenciaClose(this.incidenSelect).then(
                  success => {
                  this.reportes = success;
                  this.data = this.reportes.data;
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
          if(this.rangeday2){
            if(this.status == 0){
               if(this.incidenSelect == 0){
                 this.bitacoraService.getByDate(year1, month1, day1, year1, month1, day1).then(
                    success => {
                    this.reportes = success;
                    this.data = this.reportes.data;
                    }, error => {
                        if (error.status === 422) {
                            // on some data incorrect
                        } else {
                            // on general error
                        }
                    }
                 );
               }else{
                 this.bitacoraService.getByIncidenciaDate(this.incidenSelect, year1, month1, day1, year1, month1, day1).then(
                      success => {
                      this.reportes = success;
                      this.data = this.reportes.data;
                      }, error => {
                          if (error.status === 422) {
                              // on some data incorrect
                          } else {
                              // on general error
                          }
                      }
                  );
               }
            }else if(this.status == 1){
              if(this.incidenSelect == 0){
                this.bitacoraService.getOpenDate(year1, month1, day1, year1, month1, day1).then(
                    success => {
                    this.reportes = success;
                    this.data = this.reportes.data;
                    }, error => {
                        if (error.status === 422) {
                            // on some data incorrect
                        } else {
                            // on general error
                        }
                    }
                );
              }else{
                this.bitacoraService.getByIncidenciaOpenDate(this.incidenSelect, year1, month1, day1, year1, month1, day1).then(
                    success => {
                    this.reportes = success;
                    this.data = this.reportes.data;
                    }, error => {
                        if (error.status === 422) {
                            // on some data incorrect
                        } else {
                            // on general error
                        }
                    }
                );
              }
            }else if(this.status == 2){
              if(this.incidenSelect == 0){
                this.bitacoraService.getCloseDate(year1, month1, day1, year1, month1, day1).then(
                    success => {
                    this.reportes = success;
                    this.data = this.reportes.data;
                    }, error => {
                        if (error.status === 422) {
                            // on some data incorrect
                        } else {
                            // on general error
                        }
                    }
                );
              }else{
                this.bitacoraService.getByIncidenciaCloseDate(this.incidenSelect, year1, month1, day1, year1, month1, day1).then(
                    success => {
                    this.reportes = success;
                    this.data = this.reportes.data;
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
            if(this.status == 0){
               if(this.incidenSelect == 0){
                 this.bitacoraService.getByDate(year1, month1, day1, year2, month2, day2).then(
                    success => {
                    this.reportes = success;
                    this.data = this.reportes.data;
                    }, error => {
                        if (error.status === 422) {
                            // on some data incorrect
                        } else {
                            // on general error
                        }
                    }
                 );
               }else{
                 this.bitacoraService.getByIncidenciaDate(this.incidenSelect, year1, month1, day1, year2, month2, day2).then(
                      success => {
                      this.reportes = success;
                      this.data = this.reportes.data;
                      }, error => {
                          if (error.status === 422) {
                              // on some data incorrect
                          } else {
                              // on general error
                          }
                      }
                  );
               }
            }else if(this.status == 1){
              if(this.incidenSelect == 0){
                this.bitacoraService.getOpenDate(year1, month1, day1, year2, month2, day2).then(
                    success => {
                    this.reportes = success;
                    this.data = this.reportes.data;
                    }, error => {
                        if (error.status === 422) {
                            // on some data incorrect
                        } else {
                            // on general error
                        }
                    }
                );
              }else{
                this.bitacoraService.getByIncidenciaOpenDate(this.incidenSelect, year1, month1, day1, year2, month2, day2).then(
                    success => {
                    this.reportes = success;
                    this.data = this.reportes.data;
                    }, error => {
                        if (error.status === 422) {
                            // on some data incorrect
                        } else {
                            // on general error
                        }
                    }
                );
              }
            }else if(this.status == 2){
              if(this.incidenSelect == 0){
                this.bitacoraService.getCloseDate(year1, month1, day1, year2, month2, day2).then(
                    success => {
                    this.reportes = success;
                    this.data = this.reportes.data;
                    }, error => {
                        if (error.status === 422) {
                            // on some data incorrect
                        } else {
                            // on general error
                        }
                    }
                );
              }else{
                this.bitacoraService.getByIncidenciaCloseDate(this.incidenSelect, year1, month1, day1, year2, month2, day2).then(
                    success => {
                    this.reportes = success;
                    this.data = this.reportes.data;
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

      //guardias
      if(this.filtroSelect == 1){
        if(this.desde2 == ""){
          if(this.status == 0){
            if(this.guardiaSelect == 0){
              this.getAll();
            }else{
              this.bitacoraService.getByGuardiaAll(this.guardiaSelect).then(
                  success => {
                  this.reportes = success;
                  this.data = this.reportes.data;
                  }, error => {
                      if (error.status === 422) {
                          // on some data incorrect
                      } else {
                          // on general error
                      }
                  }
              );
            }
          }else if(this.status == 1){
            if(this.guardiaSelect == 0){
              this.bitacoraService.getOpenAll().then(
                  success => {
                  this.reportes = success;
                  this.data = this.reportes.data;
                  }, error => {
                      if (error.status === 422) {
                          // on some data incorrect
                      } else {
                          // on general error
                      }
                  }
              );
            }else{
              this.bitacoraService.getByGuardiaOpen(this.guardiaSelect).then(
                  success => {
                  this.reportes = success;
                  this.data = this.reportes.data;
                  }, error => {
                      if (error.status === 422) {
                          // on some data incorrect
                      } else {
                          // on general error
                      }
                  }
              );
            }
          }else if(this.status == 2){
            if(this.guardiaSelect == 0){
              this.bitacoraService.getCloseAll().then(
                  success => {
                  this.reportes = success;
                  this.data = this.reportes.data;
                  }, error => {
                      if (error.status === 422) {
                          // on some data incorrect
                      } else {
                          // on general error
                      }
                  }
              );
            }else{
              this.bitacoraService.getByGuardiaClose(this.guardiaSelect).then(
                  success => {
                  this.reportes = success;
                  this.data = this.reportes.data;
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
          if(this.rangeday2){
            if(this.status == 0){
               if(this.guardiaSelect == 0){
                 this.bitacoraService.getByDate(year1, month1, day1, year1, month1, day1).then(
                    success => {
                    this.reportes = success;
                    this.data = this.reportes.data;
                    }, error => {
                        if (error.status === 422) {
                            // on some data incorrect
                        } else {
                            // on general error
                        }
                    }
                 );
               }else{
                 this.bitacoraService.getByGuardiaDate(this.guardiaSelect, year1, month1, day1, year1, month1, day1).then(
                      success => {
                      this.reportes = success;
                      this.data = this.reportes.data;
                      }, error => {
                          if (error.status === 422) {
                              // on some data incorrect
                          } else {
                              // on general error
                          }
                      }
                  );
               }
            }else if(this.status == 1){
              if(this.guardiaSelect == 0){
                this.bitacoraService.getOpenDate(year1, month1, day1, year1, month1, day1).then(
                    success => {
                    this.reportes = success;
                    this.data = this.reportes.data;
                    }, error => {
                        if (error.status === 422) {
                            // on some data incorrect
                        } else {
                            // on general error
                        }
                    }
                );
              }else{
                this.bitacoraService.getByGuardiaOpenDate(this.guardiaSelect, year1, month1, day1, year1, month1, day1).then(
                    success => {
                    this.reportes = success;
                    this.data = this.reportes.data;
                    }, error => {
                        if (error.status === 422) {
                            // on some data incorrect
                        } else {
                            // on general error
                        }
                    }
                );
              }
            }else if(this.status == 2){
              if(this.guardiaSelect == 0){
                this.bitacoraService.getCloseDate(year1, month1, day1, year1, month1, day1).then(
                    success => {
                    this.reportes = success;
                    this.data = this.reportes.data;
                    }, error => {
                        if (error.status === 422) {
                            // on some data incorrect
                        } else {
                            // on general error
                        }
                    }
                );
              }else{
                this.bitacoraService.getByGuardiaCloseDate(this.guardiaSelect, year1, month1, day1, year1, month1, day1).then(
                    success => {
                    this.reportes = success;
                    this.data = this.reportes.data;
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
            if(this.status == 0){
               if(this.guardiaSelect == 0){
                 this.bitacoraService.getByDate(year1, month1, day1, year2, month2, day2).then(
                    success => {
                    this.reportes = success;
                    this.data = this.reportes.data;
                    }, error => {
                        if (error.status === 422) {
                            // on some data incorrect
                        } else {
                            // on general error
                        }
                    }
                 );
               }else{
                 this.bitacoraService.getByGuardiaDate(this.guardiaSelect, year1, month1, day1, year2, month2, day2).then(
                      success => {
                      this.reportes = success;
                      this.data = this.reportes.data;
                      }, error => {
                          if (error.status === 422) {
                              // on some data incorrect
                          } else {
                              // on general error
                          }
                      }
                  );
               }
            }else if(this.status == 1){
              if(this.guardiaSelect == 0){
                this.bitacoraService.getOpenDate(year1, month1, day1, year2, month2, day2).then(
                    success => {
                    this.reportes = success;
                    this.data = this.reportes.data;
                    }, error => {
                        if (error.status === 422) {
                            // on some data incorrect
                        } else {
                            // on general error
                        }
                    }
                );
              }else{
                this.bitacoraService.getByGuardiaOpenDate(this.guardiaSelect, year1, month1, day1, year2, month2, day2).then(
                    success => {
                    this.reportes = success;
                    this.data = this.reportes.data;
                    }, error => {
                        if (error.status === 422) {
                            // on some data incorrect
                        } else {
                            // on general error
                        }
                    }
                );
              }
            }else if(this.status == 2){
              if(this.guardiaSelect == 0){
                this.bitacoraService.getCloseDate(year1, month1, day1, year2, month2, day2).then(
                    success => {
                    this.reportes = success;
                    this.data = this.reportes.data;
                    }, error => {
                        if (error.status === 422) {
                            // on some data incorrect
                        } else {
                            // on general error
                        }
                    }
                );
              }else{
                this.bitacoraService.getByGuardiaCloseDate(this.guardiaSelect, year1, month1, day1, year2, month2, day2).then(
                    success => {
                    this.reportes = success;
                    this.data = this.reportes.data;
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

    agregarComentario() {
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

    pdfDownload() {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Todos los Reportes', 15, 27)
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
        doc.save('reportes.pdf');
    }

    excelDownload() {
        this.excelService.exportAsExcelFile(this.info, 'reportes');
    }

    print() {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Todos los Reportes', 15, 27)
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

    public doughnutChartType:string = 'doughnut';
    public doughnutColors:any[] = [{ backgroundColor: ['#dc3545', '#ffc107'] }]

    ngOnInit() {
        this.route.url.subscribe(value => {
            const reportId = value[value.length - 1].path;
            if (Number(reportId)) {
                this.viewDetail(reportId);
            }
        });
    }
}
