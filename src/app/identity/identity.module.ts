import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IdentityRoutingModule } from './identity-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersComponent } from './pages/users/users.component';


import {MatSnackBarModule} from '@angular/material/snack-bar';
import { DialogComponent } from './pages/dialog/dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';

import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateUserComponent } from './pages/create-user/create-user.component';

@NgModule({
  declarations: [DashboardComponent, UsersComponent, DialogComponent, CreateUserComponent],
  imports: [
    CommonModule,
    IdentityRoutingModule,
    MatSnackBarModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    
  ],
  exports:[
    DashboardComponent,DialogComponent,UsersComponent, CreateUserComponent
  ]
})
export class IdentityModule { }
