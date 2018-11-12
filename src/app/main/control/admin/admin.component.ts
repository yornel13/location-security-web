import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../../../model/admin/admin.service';
import { Admin } from '../../../../model/admin/admin';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExcelService } from '../../../../model/excel/excel.services';
import { OrderPipe } from 'ngx-order-pipe';
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})

export class AdminComponent {
    //general
    administradores:any = undefined;
    data:any = undefined;
    admin:any = [];
    error: string;
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
    passworda:string;
    photoa:string;
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
    p: number = 1;
    numElement:number = 10;
    //exportaciones
    contpdf:any = [];
    info: any = [];

    key: string = 'id'; //set default
    reverse: boolean = true;
    

    constructor(
        public router: Router,
        private adminService: AdminService,
        private storage: AngularFireStorage,
        private excelService: ExcelService,
        private toastr: ToastrService) {
        this.getAll();
        this.lista = true;
        this.detalle = false;
        this.crear = false;
        this.editar = false;
    }

    sort(key){
      this.key = key;
      this.reverse = !this.reverse;
    }


    getAll() {
        this.adminService.getAll().then(
            success => {
                this.administradores = success;
                this.data = this.administradores.data;
                console.log(this.data);
                var body = [];
                var excel = [];
                for(var i=0; i<this.data.length; i++){
                    this.data[i].id = Number(this.data[i].id);
                    this.data[i].dni = Number(this.data[i].dni);
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

    viewDetail(id) {
        this.adminService.getId(id).then(
            success => {
                this.admin = success;
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

    regresar() {
        this.lista = true;
        this.detalle = false;
        this.crear = false;
        this.editar = false;
        this.errorEditData = false;
    }

    editarAdmmin(id) {
        this.adminService.getId(id).then(
            success => {
                this.admin = success;
                console.log(this.admin);
                this.nombre = this.admin.name;
                this.apellido = this.admin.lastname;
                this.correo = this.admin.email;
                if(this.admin.photo == null){
                    this.photo = './assets/img/user_empty.jpg';
                }else{
                    this.photo = this.admin.photo;
                }              
                this.identificacion = this.admin.dni;
                this.idEdit = this.admin.id;
                this.lista = false;
                this.detalle = false;
                this.crear = false;
                this.editar = true;
            }, error => {
                if (error.status === 422) {
                    if (error.error.errors) {
                        for (const key in error.error.errors) {
                            let title = key;
                            if (title === 'name') { title = 'Nombre'; }
                            if (title === 'lastname') { title = 'Apellido'; }
                            if (title === 'dni') { title = 'Cedula'; }
                            if (title === 'email') { title = 'Correo'; }
                            this.toastr.info(error.error.errors[key][0], title,
                                { positionClass: 'toast-bottom-center'});
                        }
                    } else {
                        this.toastr.info(error.error.message, 'Error',
                            { positionClass: 'toast-bottom-center'});
                    }
                    this.errorSaveData = true;
                } else {
                    this.toastr.info(error.message, 'Error',
                        { positionClass: 'toast-bottom-center'});
                    this.errorSave = true;
                }
            }
        );
    }

    getValueEdit(){
        if(this.photo == './assets/img/user_empty.jpg'){
            this.photo = null;
        }
        if(this.contrasena == "password"){
            const editadmin : Admin = {
                id: this.idEdit,
                dni: this.identificacion,
                name: this.nombre,
                lastname: this.apellido,
                email: this.correo,
                photo: this.photo
            }
            return editadmin;
        }else{
            const editadmin : Admin = {
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

        this.adminService.set(valores).then(
            success => {
                this.getAll();
                this.regresar();
                this.photo = '';
                this.errorEditData = false;
                this.errorEdit = false;
            }, error => {
                if (error.status === 422) {
                    if (error.error.errors) {
                        for (const key in error.error.errors) {
                            let title = key;
                            if (title === 'name') { title = 'Nombre'; }
                            if (title === 'lastname') { title = 'Apellido'; }
                            if (title === 'dni') { title = 'Cedula'; }
                            if (title === 'email') { title = 'Correo'; }
                            this.toastr.info(error.error.errors[key][0], title,
                                { positionClass: 'toast-bottom-center'});
                        }
                    } else {
                        this.toastr.info(error.error.message, 'Error',
                            { positionClass: 'toast-bottom-center'});
                    }
                    this.errorSaveData = true;
                } else {
                    this.toastr.info(error.message, 'Error',
                        { positionClass: 'toast-bottom-center'});
                    this.errorSave = true;
                }
            }
        );
    }

    crearAdmin() {
        this.lista = false;
        this.detalle = false;
        this.crear = true;
        this.editar = false;
        this.photoa = './assets/img/user_empty.jpg';
    }

    saveNewAdmin() {
        if(this.photoa == './assets/img/user_empty.jpg'){
            this.photoa = null;
        }
        const createadmin : Admin = {
            dni: this.dnia,
            name: this.namea,
            lastname: this.lastnamea,
            email: this.emaila,
            password: this.passworda,
            photo: this.photoa
        };
        this.adminService.add(createadmin).then(
            success => {
                this.getAll();
                this.regresar();
                this.dnia = '';
                this.namea = '';
                this.lastnamea = '';
                this.emaila = '';
                this.photoa = '',
                this.errorSave = false;
                this.errorSaveData = false;
            }, error => {
                if (error.status === 422) {
                    if (error.error.errors) {
                        for (const key in error.error.errors) {
                            let title = key;
                            if (title === 'name') { title = 'Nombre'; }
                            if (title === 'lastname') { title = 'Apellido'; }
                            if (title === 'dni') { title = 'Cedula'; }
                            if (title === 'email') { title = 'Correo'; }
                            this.toastr.info(error.error.errors[key][0], title,
                                { positionClass: 'toast-bottom-center'});
                        }
                    } else {
                        this.toastr.info(error.error.message, 'Error',
                            { positionClass: 'toast-bottom-center'});
                    }
                    this.errorSaveData = true;
                } else {
                    this.toastr.info(error.message, 'Error',
                        { positionClass: 'toast-bottom-center'});
                    this.errorSave = true;
                }
            }
        );
    }

    deleteAdmin(id) {
        this.adminService.delete(id).then(
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

    activarAdmin(id) {
        this.adminService.activeAdmin(id).then(
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

    desactivarAdmin(id) {
        this.adminService.desactiveAdmin(id).then(
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
        var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Usuarios Administradores del sistema', 15, 27)
        doc.text('Hora de impresión: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['#', 'Cédula', 'Nombre', 'Apellido', 'Correo']],
            body: this.contpdf,
            startY: 41,
            columnStyles: {
              0: {cellWidth: 10},
              1: {cellWidth: 'auto'},
              2: {cellWidth: 'auto'},
              3: {cellWidth: 'auto'},
              4: {cellWidth: 'auto'}
            }
        });   
        doc.save('adminstradores.pdf');
    }

    excelDownload() {
        this.excelService.exportAsExcelFile(this.info, 'admin');
    }

    print() {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Usuarios Administradores del sistema', 15, 27)
        doc.text('Hora de impresión: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['#', 'Cédula', 'Nombre', 'Apellido', 'Correo']],
            body: this.contpdf,
            startY: 41,
            columnStyles: {
              0: {cellWidth: 10},
              1: {cellWidth: 'auto'},
              2: {cellWidth: 'auto'},
              3: {cellWidth: 'auto'},
              4: {cellWidth: 'auto'}
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
        var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Usuario Administrador del sistema', 15, 27)
        doc.text('Hora de impresión: '+ fecha, 15, 34);
        //inserting data
        doc.setTextColor(0);
        doc.setFontType("bold");
        doc.text('Nombre: ', 15, 100);
        doc.setFontType("normal");
        doc.text(this.admin.name, 34, 100);
        doc.setFontType("bold");
        doc.text('Apellido: ', 100, 100);
        doc.setFontType("normal");
        doc.text(this.admin.lastname, 123, 100);

        doc.setFontType("bold");
        doc.text('Cédula: ', 15, 107);
        doc.setFontType("normal");
        doc.text(this.admin.dni, 34, 107);
        doc.setFontType("bold");
        doc.text('Correo: ', 100, 107);
        doc.setFontType("normal");
        doc.text(this.admin.email, 123, 107);

        doc.setFontType("bold");
        doc.text('Fecha de creación: ', 15, 114);
        doc.setFontType("normal");
        doc.text(this.admin.create_date, 56, 114);
        doc.setFontType("bold");
        doc.text('Última actualización: ', 100, 114);
        doc.setFontType("normal");
        doc.text(this.admin.update_date, 146, 114);

        if (this.admin.photo) {
            this.toDataURL(this.admin.photo).then(dataUrl => {
                var imgData = dataUrl;
                doc.addImage(imgData, 'JPEG', 15, 45, 40, 40);
                doc.save('adminDetail.pdf');
            });
        } else {
            doc.save('adminDetail.pdf');
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

    printDetalle() {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Usuario Administrador del sistema', 15, 27)
        doc.text('Hora de impresión: '+ fecha, 15, 34);
        //inserting data
        doc.setTextColor(0);
        doc.setFontType("bold");
        doc.text('Nombre: ', 15, 100);
        doc.setFontType("normal");
        doc.text(this.admin.name, 34, 100);
        doc.setFontType("bold");
        doc.text('Apellido: ', 100, 100);
        doc.setFontType("normal");
        doc.text(this.admin.lastname, 123, 100);

        doc.setFontType("bold");
        doc.text('Cédula: ', 15, 107);
        doc.setFontType("normal");
        doc.text(this.admin.dni, 34, 107);
        doc.setFontType("bold");
        doc.text('Correo: ', 100, 107);
        doc.setFontType("normal");
        doc.text(this.admin.email, 123, 107);

        doc.setFontType("bold");
        doc.text('Fecha de creación: ', 15, 114);
        doc.setFontType("normal");
        doc.text(this.admin.create_date, 56, 114);
        doc.setFontType("bold");
        doc.text('Última actualización: ', 100, 114);
        doc.setFontType("normal");
        doc.text(this.admin.update_date, 146, 114);

        if (this.admin.photo) {
            this.toDataURL(this.admin.photo).then(dataUrl => {
                var imgData = dataUrl;
                doc.addImage(imgData, 'JPEG', 15, 45, 40, 40);
                doc.autoPrint();
                window.open(doc.output('bloburl'), '_blank');
            });
        } else {
            doc.autoPrint();
            window.open(doc.output('bloburl'), '_blank');
        }
    }

    excelDetalle() {
        var excel = [];
        excel = [{'#' : this.admin.id, 'Cedula': this.admin.dni, 'Nombre':this.admin.name, 'Apellido':this.admin.lastname, 'Correo':this.admin.email, 'Fecha de creación':this.admin.create_date, 'Última actualización':this.admin.update_date}];
        this.excelService.exportAsExcelFile(excel, 'admindetail');
    }

}
