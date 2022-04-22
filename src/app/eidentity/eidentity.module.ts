import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EidentityRoutingModule } from './eidentity-routing.module';
import { IdentityComponent } from './identity.component';
import { ClarityModule, ClrIconModule } from '@clr/angular';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { UsersComponent } from './pages/users/users.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import { CompanyComponent } from './pages/company/company.component';
import { DepartementComponent } from './pages/departement/departement.component';
@NgModule({
  declarations: [IdentityComponent, UsersComponent, CompanyComponent, DepartementComponent],
  imports: [
    CommonModule,
    EidentityRoutingModule,
    ClarityModule,
    ClrIconModule,
    FormsModule,
    BrowserModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  exports:[
    IdentityComponent,UsersComponent
  ]
})
export class EidentityModule { }
