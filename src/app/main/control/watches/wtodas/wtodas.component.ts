import {Component, ComponentFactoryResolver, Injector, OnInit} from '@angular/core';
import { WatchesService } from '../../../../../model/watch/watch.service';
import { GuardService } from '../../../../../model/guard/guard.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExcelService } from '../../../../../model/excel/excel.services';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import * as geolib from 'geolib';
import {GlobalOsm} from "../../../../global.osm";
import {UtilsVehicles} from "../../../../../model/vehicle/vehicle.utils";
import {PopupVisitComponent} from "../../visitas/visitas/popup.visit.component";
import {PopupWatchtComponent} from "./popup.watcht.component";

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

  //fechas
  desde:any = "";
  hasta:any = "";
  rangeday:boolean=true;
  date:any;
  month2:any;
  day2:any;

  zoom;
  center = L.latLng(([ this.lat, this.lng ]));
  marker = L.marker([this.lat, this.lng], {draggable: false});
  markerClusterData: any[] = [];
  markerClusterOptions: L.MarkerClusterGroupOptions;
  layersControlOptions;
  baseLayers;
  options;

  constructor(
      private resolver: ComponentFactoryResolver,
      private globalOSM: GlobalOsm,
      private injector: Injector,
      private utilVehicle: UtilsVehicles,
      private watchesService: WatchesService,
      private guardiasService: GuardService,
      private excelService: ExcelService) {
    this.getToday();
    this.getGuard();
    this.lista = true;
    this.detalle = false;
  }

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

  onMapReadyChart(map: L.Map) {
    this.mapchart = map;
    this.globalOSM.setupLayer(this.mapchart);
    this.center = this.globalOSM.center;
    this.zoom = this.globalOSM.zoom;
    const southWest = new L.LatLng(-2.100599, -79.560921);
    const northEast = new L.LatLng(-2.030906, -79.568947);
    const bounds = new L.LatLngBounds(southWest, northEast);
    const data: any[] = [];
    if (this.data.length) {
      const coors = [];
      this.data.forEach((watch: any) => {
        const lat = Number(watch.latitude);
        const lng = Number(watch.longitude);
        const maker = L.marker([lat, lng], {icon: L.icon({iconUrl: './assets/maps/watch.png'})});
        const factory = this.resolver.resolveComponentFactory(PopupWatchtComponent);
        const component = factory.create(this.injector);
        const popupContent = component.location.nativeElement;
        component.instance.watch = watch;
        component.changeDetectorRef.detectChanges();
        maker.bindPopup(popupContent).openPopup();
        data.push(maker);
        coors.push({latitude: lat, longitude: lng});
        bounds.extend(maker.getLatLng());
      });
      this.mapchart.fitBounds(bounds);
      const geoCenter = geolib.getCenter(coors);
      this.center = L.latLng([geoCenter.latitude, geoCenter.longitude]);
    }
    this.markerClusterData = data;
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
            console.log(this.data);
            console.log(this.watches.total);
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
      this.desde =this.date;

      this.watchesService.getByDate(year, this.month2, this.day2, year, this.month2, this.day2).then(
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
      if(this.guardiaSelect == 0){
        this.getAll();
      }else{
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
      }
    }else{
      if(this.rangeday){
        if(this.guardiaSelect == 0){
          this.watchesService.getByDate(year1, month1, day1, year1, month1, day1).then(
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
          this.watchesService.getByGuardDate(this.guardiaSelect, year1, month1, day1, year1, month1, day1).then(
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
        if(this.guardiaSelect == 0){
          this.watchesService.getByDate(year1, month1, day1, year2, month2, day2).then(
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
          this.watchesService.getByGuardDate(this.guardiaSelect, year1, month1, day1, year2, month2, day2).then(
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
        var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Todas las Guardias', 15, 27)
        doc.text('Hora de impresión: '+ fecha, 15, 34)
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
        var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Todas las Guardias', 15, 27)
        doc.text('Hora de impresión: '+ fecha, 15, 34)
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

    pdfDetalle() {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Guardia', 15, 27)
        doc.text('Hora de impresión: '+ fecha, 15, 34);
        //inserting data
        doc.setTextColor(0);
        doc.setFontType("bold");
        doc.text('Hora de inicio: ', 15, 50);
        doc.setFontType("normal");
        doc.text(this.guardia.create_date, 50, 50);
        doc.setFontType("bold");
        doc.text('Hora de finalización: ', 100, 50);
        doc.setFontType("normal");
        var time = "";
        if(this.guardia.status == 0){
          time = this.guardia.update_date;
        }else{
          time = "--";
        }
        doc.text(time, 147, 50);

        doc.setFontType("bold");
        doc.text('Latitud: ', 15, 57);
        doc.setFontType("normal");
        doc.text(this.guardia.latitude.toString(), 36, 57);
        doc.setFontType("bold");
        doc.text('Longitud: ', 100, 57);
        doc.setFontType("normal");
        doc.text(this.guardia.longitude.toString(), 123, 57);

        //guardia
        doc.line(10, 63, 200, 63);

        doc.setFontType("bold");
        doc.text('Guardia', 15, 70);

        doc.setFontType("bold");
        doc.text('Nombre: ', 15, 77);
        doc.setFontType("normal");
        doc.text(this.guardia.guard_name, 34, 77);
        doc.setFontType("bold");
        doc.text('Apellido: ', 100, 77);
        doc.setFontType("normal");
        doc.text(this.guardia.guard_lastname, 123, 77);

        doc.setFontType("bold");
        doc.text('Cédula: ', 15, 84);
        doc.setFontType("normal");
        doc.text(this.guardia.guard_dni, 34, 84);
        doc.setFontType("bold");
        doc.text('Correo: ', 100, 84);
        doc.setFontType("normal");
        doc.text(this.guardia.guard_email, 119, 84);

        doc.save('guardiaDetail.pdf');

    }

    printDetalle() {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Guardia', 15, 27)
        doc.text('Hora de impresión: '+ fecha, 15, 34);
        //inserting data
        doc.setTextColor(0);
        doc.setFontType("bold");
        doc.text('Hora de inicio: ', 15, 50);
        doc.setFontType("normal");
        doc.text(this.guardia.create_date, 50, 50);
        doc.setFontType("bold");
        doc.text('Hora de finalización: ', 100, 50);
        doc.setFontType("normal");
        var time = "";
        if(this.guardia.status == 0){
          time = this.guardia.update_date;
        }else{
          time = "--";
        }
        doc.text(time, 147, 50);

        doc.setFontType("bold");
        doc.text('Latitud: ', 15, 57);
        doc.setFontType("normal");
        doc.text(this.guardia.latitude.toString(), 36, 57);
        doc.setFontType("bold");
        doc.text('Longitud: ', 100, 57);
        doc.setFontType("normal");
        doc.text(this.guardia.longitude.toString(), 123, 57);

        //guardia
        doc.line(10, 63, 200, 63);

        doc.setFontType("bold");
        doc.text('Guardia', 15, 70);

        doc.setFontType("bold");
        doc.text('Nombre: ', 15, 77);
        doc.setFontType("normal");
        doc.text(this.guardia.guard_name, 34, 77);
        doc.setFontType("bold");
        doc.text('Apellido: ', 100, 77);
        doc.setFontType("normal");
        doc.text(this.guardia.guard_lastname, 123, 77);

        doc.setFontType("bold");
        doc.text('Cédula: ', 15, 84);
        doc.setFontType("normal");
        doc.text(this.guardia.guard_dni, 34, 84);
        doc.setFontType("bold");
        doc.text('Correo: ', 100, 84);
        doc.setFontType("normal");
        doc.text(this.guardia.guard_email, 119, 84);

        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');

    }

    excelDetalle() {
        var excel = [];
        var time = "";
        if(this.guardia.status == 0){
          time = this.guardia.update_date;
        }else{
          time = "--";
        }
        excel = [{'Hora de inicio' : this.guardia.create_date, 'Hora de finalización' : time, 'Latitud': this.guardia.latitude.toString(), 'Longitud':this.guardia.longitude.toString()}];
        excel.push({'Hora de inicio':'Guardia'});
        excel.push({'Hora de inicio':'Nombre', 'Hora de finalización':'Apellido', 'Latitud':'Cédula', 'Longitud':'Correo'});
        excel.push({'Hora de inicio':this.guardia.guard_name, 'Hora de finalización':this.guardia.guard_lastname, 'Latitud':this.guardia.guard_dni, 'Longitud':this.guardia.guard_email});
        this.excelService.exportAsExcelFile(excel, 'guardiadetail');
    }

}
