import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../../../model/admin/admin.service';
import { Admin } from '../../../../model/admin/admin';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

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
    //crear
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
    adminFilter: any = { "dni": ""};
    //imagen firebase
    uploadPercent: Observable<number>;
    downloadURL: Observable<string>;


    constructor(public router:Router, private adminService:AdminService, private storage: AngularFireStorage) {
        this.getAll();
        this.lista = true;
        this.detalle = false;
        this.crear = false;
        this.editar = false;
    }

    getAll() {
        this.adminService.getAll().then(
            success => {
                this.administradores = success;
                this.data = this.administradores.data;
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
                this.photo = this.admin.photo;
                this.identificacion = this.admin.dni;
                this.idEdit = this.admin.id;
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
                    // on some data incorrect
                    if(error.error.errors.name){
                        this.errorEditMsg = error.error.errors.name[0];
                    }
                    if(error.error.errors.lastname){
                        this.errorEditMsg = error.error.errors.lastname[0];
                    }
                    if(error.error.errors.email){
                        this.errorEditMsg = error.error.errors.email[0];
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

    crearAdmin() {
        this.lista = false;
        this.detalle = false;
        this.crear = true;
        this.editar = false;
        this.photoa = './assets/img/user_empty.jpg';
    }

    saveNewAdmin() {
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

}
