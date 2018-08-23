import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../../../model/admin/admin.service';
import { Admin } from '../../../../model/admin/admin';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-cerco',
    templateUrl: './cerco.component.html',
    styleUrls: ['./cerco.component.css']
})

export class CercoComponent {
}
