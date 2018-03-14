import { HomeComponent } from './shared/home/home.component';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { RouterModule,Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { Component, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MachinesModule } from './machines/machines.module';
import { EmployeesModule } from './employees/employees.module';

import { AppComponent } from './app.component';

import { LoginFormComponent } from './login-form/login-form.component';
import { AssembliesModule } from './assemblies/assemblies.module';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { WorkOrderModule } from './workorder/workorder.module';
import {MomentModule} from 'angular2-moment/moment.module';
import { HttpModule } from '@angular/http';
const app_routes: Routes = [
  {path: '',  component: LoginFormComponent},
  {path: 'home',   component: HomeComponent}

];

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent
   
  ],
  imports: [
    SharedModule,
    MachinesModule,
    EmployeesModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    RouterModule.forRoot(app_routes),
    BrowserAnimationsModule,
    AssembliesModule,
    AngularMultiSelectModule,
    WorkOrderModule,
    MomentModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
