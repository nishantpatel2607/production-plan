import { HomeComponent } from './shared/home/home.component';
import { SharedModule } from './shared/shared.module';


import { HttpModule } from '@angular/http';
import { RouterModule,Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { Component, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MachinesModule } from './machines/machines.module';
import { EmployeesModule } from './employees/employees.module';

import { AppComponent } from './app.component';

import { LoginFormComponent } from './login-form/login-form.component';
import { JobsModule } from './jobs/jobs.module';


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
    JobsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(app_routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
