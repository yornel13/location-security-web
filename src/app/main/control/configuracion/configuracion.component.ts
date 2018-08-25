import { Component, OnInit } from '@angular/core';
import { ConfiguracionService } from '../../../../model/configuracion/configuracion.service';
import { Configuracion } from '../../../../model/configuracion/configuracion';
import { BannerService } from '../../../../model/banner/banner.service';
import { Banner } from '../../../../model/banner/banner';
import { Router } from '@angular/router';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent  {
  //config
  configuraciones:any = [];
  data:any = {};
  configid:any = [];
  //banner
  banners:any = [];
  banner:any = {};
  bannerid:any = [];
  numbanner:number = 0;
  limitbanner:boolean = false;
  newimagen:boolean = false;
  //genneral
  lista:boolean;
  detalle:boolean;
  editar:boolean;
  editarb:boolean;
  //editar
  nombre:string;
  valor:string;
  idEdit:number;
  errorEdit:boolean = false;
  errorEditData:boolean = false;
  errorEditMsg:string;
  //createBoundView
  namea:string;
  valora:string = '';
  errorSave:boolean = false;
  errorSaveData:boolean = false;
  errorNewMsg:string;
  //eliminar
  errorDelete:boolean = false;
  errorDeleteData:boolean = false;
  //imagen firebase
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  imagen:string;

  constructor(public router:Router, private configuracionService:ConfiguracionService, private bannerService:BannerService, private storage: AngularFireStorage) { 
  	this.getTablet();
    this.getBanner();
  	this.regresar();
  }

  sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }

  getAll() {
    	this.configuracionService.getAll().then(
    		success => {
    			this.configuraciones = success;
    			this.data = this.configuraciones.data;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
    }


    getTablet() {
      this.configuracionService.getTablet().then(
        success => {
          this.configuraciones = success;
          this.data = this.configuraciones;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
    }

    getBanner() {
      this.bannerService.getAll().then(
        success => {
          this.banners = success;
          this.banner = this.banners.data;
          this.numbanner = this.banners.total;
          if (this.numbanner == 5) {
            this.limitbanner = false;
          }else{
            this.limitbanner = true;
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

    eliminarImagen(id) {
      this.bannerService.delete(id).then(
            success => {
                this.getBanner();
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                    this.errorDeleteData = true;
                } else {
                    // on general error
                    this.errorDelete = true;
                }
            }
        );
    }

    uploadBanner(event) {
        const file = event.target.files[0];
        const randomId = Math.random().toString(36).substring(2);
        var url = '/icsse/' + randomId;
        const ref = this.storage.ref(url);
        //const task = ref.put(file);
        const task = this.storage.upload(url, file);
        this.uploadPercent = task.percentageChanges();
        task.snapshotChanges().pipe(
        finalize(() => {this.downloadURL = ref.getDownloadURL();
                        this.downloadURL.subscribe(url => (this.imagen = url));} 
        )).subscribe();
   }

   saveBanner() {
     const createbanner : Banner = {
            photo: this.imagen
        };

        this.bannerService.add(createbanner).then(
          success => {
            this.newimagen = false;
            this.getBanner();
            this.imagen = '/assets/img/addbanner.png';
              }, error => {
                  if (error.status === 422) {
                      // on some data incorrect
                  } else {
                      // on general error
                  }
              }
        );
   }

    agregarImagen() {
      this.newimagen = true;
      this.imagen = '/assets/img/addbanner.png';
    }

    editarBanner() {
      this.lista = false;
      this.editar = false;
      this.editarb = true;
      this.getBanner();
    }

  	regresar() {
	  this.lista = true;
	  this.detalle = false;
	  this.editar = false;
    this.editarb = false;
	  this.errorEditData = false;
    this.errorEdit = false;
    this.newimagen = false;
	}

	editarConfiguracion(id) {
      this.configuracionService.getId(id).then(
        success => {
          this.configid = success;
          this.nombre = this.configid.name;
          this.valor = this.configid.value;
          this.idEdit = this.configid.id;
          this.detalle = false;
          this.editar = true;
          this.lista = false;
          this.editarb = false;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
    }

    saveEdit() {
      const editincidencia : Configuracion = {
        id: this.idEdit,
        value: this.valor,
        name: this.nombre
      };
      this.configuracionService.set(editincidencia).then(
        success => {
          this.getTablet();
          this.regresar();
          this.errorEditData = false;
          this.errorEdit = false;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                    console.log(error.error);
                    if(error.error.errors.name){
                      this.errorEditMsg = error.error.errors.name[0];
                    }
                    if(error.error.errors.value){
                      this.errorEditMsg = error.error.errors.value[0];
                    }
                    this.errorEditData = true;
                } else {
                    // on general error
                    this.errorEdit = true;
                }
            }
        );
    }

    saveNewConfiguracion() {
      const createadmin : Configuracion = {
        name: this.namea,
        value: this.valora.toString()
      };
      if(this.valora == ''){
        this.errorSave = true;
      }else{
        this.configuracionService.add(createadmin).then(
        success => {
          this.getTablet();
          this.regresar();
          this.namea = '';
          this.valora = '';
          this.errorSave = false;
          this.errorSaveData = false;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                    this.errorSave = true;
                }
            }
        );
      }
    }

    deleteConfiguracion(id) {
      this.configuracionService.delete(id).then(
        success => {
          this.regresar();
          this.errorDeleteData = false;
          this.errorDelete = false;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                    this.errorDeleteData = true;
                } else {
                    // on general error
                    this.errorDelete = true;
                }
            }
        );
    }

}
