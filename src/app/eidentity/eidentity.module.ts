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


@NgModule({
  declarations: [IdentityComponent, UsersComponent],
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
  ],
  exports:[
    IdentityComponent,UsersComponent
  ]
})
export class EidentityModule { }
