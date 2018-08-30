import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GuardService } from '../../../../model/guard/guard.service';
import { Guard } from '../../../../model/guard/guard';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExcelService } from '../../../../model/excel/excel.services';

@Component({
  selector: 'app-guardia',
  templateUrl: './guardia.component.html',
  styleUrls: ['./guardia.component.css']
})
export class GuardiaComponent {
  //general
  guardias:any = undefined;
  data:any = undefined;
  guardia:any = [];
  //vistas admin
  lista:boolean;
  detalle:boolean;
  crear:boolean;
  editar:boolean;
  //editar
  nombre:string;
  apellido:string;
  correo:string;
  identificacion:string;
  photo:string;
  contrasena:string = "password";
  idEdit:number;
  errorEdit:boolean = false;
  errorEditData:boolean = false;
  errorEditMsg:string;
  //createBoundView
  namea:string;
  lastnamea:string;
  emaila:string;
  dnia:string;
  photoa:string;
  passworda:string;
  errorSave:boolean = false;
  errorSaveData:boolean = false;
  errorNewMsg:string;
  //eliminar
  errorDelete:boolean = false;
  errorDeleteData:boolean = false;
  filter:string;
  //imagen firebase
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  numElement:number = 10;
  //exportaciones
  contpdf:any = [];
  info: any = [];
  key: string = 'id'; //set default
  reverse: boolean = true;


  constructor(public router:Router, private guardService:GuardService,  private storage: AngularFireStorage, private excelService:ExcelService) { 
  	this.getAll();
  	this.regresar();
  }

  sort(key){
    this.key = key;
    this.reverse = !this.reverse;
  }

  getAll() {
    	this.guardService.getAll().then(
    		success => {
    			this.guardias = success;
    			this.data = this.guardias.data;
          var body = [];
          var excel = [];
          for(var i=0; i<this.data.length; i++){
              this.data[i].id = Number(this.data[i].id);
              this.data[i].dni = Number(this.data[i].dni);
              this.data[i].active = Number(this.data[i].active);
              excel.push({'#' : this.data[i].id, 'Cedula': this.data[i].dni, 'Nombre':this.data[i].name, 'Apellido':this.data[i].lastname, 'Correo':this.data[i].email})
              body.push([this.data[i].id, this.data[i].dni, this.data[i].name, this.data[i].lastname, this.data[i].email])
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
      this.crear = false;
      this.editar = false;
    }

    viewDetail(id) {
      this.guardService.getId(id).then(
        success => {
          this.guardia = success;
          this.lista = false;
          this.detalle = true;
          this.crear = false;
          this.editar = false;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
    }

    upload(event) {
        const file = event.target.files[0];
        const randomId = Math.random().toString(36).substring(2);
        var url = '/icsse/' + randomId;
        const ref = this.storage.ref(url);
        //const task = ref.put(file);
        const task = this.storage.upload(url, file);
        this.uploadPercent = task.percentageChanges();
        task.snapshotChanges().pipe(
        finalize(() => {this.downloadURL = ref.getDownloadURL();
                        this.downloadURL.subscribe(url => (this.photo = url));} 
        )).subscribe();
   }

   uploadNew(event) {
        const file = event.target.files[0];
        const randomId = Math.random().toString(36).substring(2);
        var url = '/icsse/' + randomId;
        const ref = this.storage.ref(url);
        const task = this.storage.upload(url, file);
        this.uploadPercent = task.percentageChanges();
        task.snapshotChanges().pipe(
        finalize(() => {this.downloadURL = ref.getDownloadURL();
                        this.downloadURL.subscribe(url => (this.photoa = url));} 
        )).subscribe();
   }

    editarGuardia(id) {
      this.guardService.getId(id).then(
        success => {
          this.guardia = success;
          this.nombre = this.guardia.name;
          this.apellido = this.guardia.lastname;
          this.correo = this.guardia.email;
          this.identificacion = this.guardia.dni;
          this.idEdit = this.guardia.id;
          this.photo = this.guardia.photo;
          this.lista = false;
          this.detalle = false;
          this.crear = false;
          this.editar = true;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
    }

    getValueEdit(){
      if(this.contrasena == "password"){
          console.log("Entra aquí");
          const editadmin : Guard = {
          id: this.idEdit,
          dni: this.identificacion,
          name: this.nombre,
          lastname: this.apellido,
          email: this.correo,
          photo: this.photo
        }
        return editadmin;
      }else{
          const editadmin : Guard = {
          id: this.idEdit,
          dni: this.identificacion,
          name: this.nombre,
          lastname: this.apellido,
          email: this.correo,
          password: this.contrasena,
          photo: this.photo
        }
        return editadmin;
      }
    }

    saveEdit() {
      var valores = this.getValueEdit();
      console.log(valores);
      this.guardService.set(valores).then(
        success => {
          this.getAll();
          this.regresar();
          this.photo = '',
          this.errorEditData = false;
          this.errorEdit = false;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                    if(error.error.errors.name){
                      this.errorEditMsg = "Su nombre "+error.error.errors.name[0];
                    }
                    if(error.error.errors.lastname){
                      this.errorEditMsg = "Su apellido "+error.error.errors.lastname[0];
                    }
                    if(error.error.errors.email){
                      this.errorEditMsg = "Su contraseña"+error.error.errors.email[0];
                    }
                    if(error.error.errors.dni){
                      this.errorEditMsg = error.error.errors.dni[0];
                    }
                    this.errorEditData = true;
                } else {
                    // on general error
                    this.errorEdit = true;
                }
            }
        );
    }

    crearGuardia() {
      this.lista = false;
      this.detalle = false;
      this.crear = true;
      this.editar = false;
      this.photoa = './assets/img/user_empty.jpg';
    }

    saveNewGuardia() {
      const createguard : Guard = {
        dni: this.dnia,
        name: this.namea,
        lastname: this.lastnamea,
        email: this.emaila,
        password: this.passworda,
        photo: this.photoa
      };
      this.guardService.add(createguard).then(
        success => {
          this.getAll();
          this.regresar();
          this.photoa = '',
          this.errorEditData = false;
          this.errorEdit = false;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                    if(error.error.errors.name){
                      this.errorNewMsg = error.error.errors.name[0];
                    }
                    if(error.error.errors.lastname){
                      this.errorNewMsg = error.error.errors.lastname[0];
                    }
                    if(error.error.errors.email){
                      this.errorNewMsg = error.error.errors.email[0];
                    }
                    if(error.error.errors.dni){
                      this.errorNewMsg = error.error.errors.dni[0];
                    }
                    this.errorSaveData = true;
                } else {
                    // on general error
                    this.errorSave = true;
                }
            }
        );
    }

    deleteGuardia(id) {
      this.guardService.delete(id).then(
        success => {
          this.getAll();
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

    activarGuardia(id) {
        this.guardService.activeGuard(id).then(
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

    desactivarGuardia(id) {
        this.guardService.desactiveGuard(id).then(
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

    pdfDownload() {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Usuarios Guardias del sistema', 15, 27)
        doc.text('Fecha: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['#', 'Cédula', 'Nombre', 'Apellido', 'Correo']],
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
        doc.text('Usuarios Guardias del sistema', 15, 27)
        doc.text('Fecha: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['#', 'Cédula', 'Nombre', 'Apellido', 'Correo']],
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
    
    pdfDetalle() {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Usuario Guardia del sistema', 15, 27)
        doc.text('Fecha: '+ fecha, 15, 34);
        //inserting data
        doc.setTextColor(0);
        doc.setFontType("bold");
        doc.text('Nombre: ', 15, 100);
        doc.setFontType("normal");
        doc.text(this.guardia.name, 34, 100);
        doc.setFontType("bold");
        doc.text('Apellido: ', 100, 100);
        doc.setFontType("normal");
        doc.text(this.guardia.lastname, 123, 100);

        doc.setFontType("bold");
        doc.text('Cédula: ', 15, 107);
        doc.setFontType("normal");
        doc.text(this.guardia.dni, 34, 107);
        doc.setFontType("bold");
        doc.text('Correo: ', 100, 107);
        doc.setFontType("normal");
        doc.text(this.guardia.email, 123, 107);

        doc.setFontType("bold");
        doc.text('Fecha de creación: ', 15, 114);
        doc.setFontType("normal");
        doc.text(this.guardia.create_date, 56, 114);
        doc.setFontType("bold");
        doc.text('Última actualización: ', 100, 114);
        doc.setFontType("normal");
        doc.text(this.guardia.update_date, 146, 114);

        this.toDataURL(this.guardia.photo).then(dataUrl => {
            var imgData = dataUrl;
            doc.addImage(imgData, 'JPEG', 15, 45, 40, 40);
            doc.save('guardiaDetail.pdf');
          });  
    }

    toDataURL = url => fetch(url)
      .then(response => response.blob())
      .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      }));


    printDetalle() {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Usuario Guardia del sistema', 15, 27)
        doc.text('Fecha: '+ fecha, 15, 34);
        //inserting data
        doc.setTextColor(0);
        doc.setFontType("bold");
        doc.text('Nombre: ', 15, 100);
        doc.setFontType("normal");
        doc.text(this.guardia.name, 34, 100);
        doc.setFontType("bold");
        doc.text('Apellido: ', 100, 100);
        doc.setFontType("normal");
        doc.text(this.guardia.lastname, 123, 100);

        doc.setFontType("bold");
        doc.text('Cédula: ', 15, 107);
        doc.setFontType("normal");
        doc.text(this.guardia.dni, 34, 107);
        doc.setFontType("bold");
        doc.text('Correo: ', 100, 107);
        doc.setFontType("normal");
        doc.text(this.guardia.email, 123, 107);

        doc.setFontType("bold");
        doc.text('Fecha de creación: ', 15, 114);
        doc.setFontType("normal");
        doc.text(this.guardia.create_date, 56, 114);
        doc.setFontType("bold");
        doc.text('Última actualización: ', 100, 114);
        doc.setFontType("normal");
        doc.text(this.guardia.update_date, 146, 114);

        this.toDataURL(this.guardia.photo).then(dataUrl => {
            var imgData = dataUrl;
            doc.addImage(imgData, 'JPEG', 15, 45, 40, 40);
            doc.autoPrint();
            window.open(doc.output('bloburl'), '_blank');
          });
    }

    excelDetalle() {
        var excel = [];
        excel = [{'#' : this.guardia.id, 'Cedula': this.guardia.dni, 'Nombre':this.guardia.name, 'Apellido':this.guardia.lastname, 'Correo':this.guardia.email, 'Fecha de creación':this.guardia.create_date, 'Última actualización':this.guardia.update_date}];
        this.excelService.exportAsExcelFile(excel, 'admindetail');
    }


}
