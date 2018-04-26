import { HomeComponent } from './shared/home/home.component';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { RouterModule,Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { Component, NgModule, ErrorHandler } from '@angular/core';
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
import { AppErrorHandler } from './errorhandlers/global-error-handler';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';
import { LoadingService } from './core/services/loading.service';
import {MessageService} from 'primeng/components/common/messageservice';
import {GrowlModule} from 'primeng/growl';

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
    MomentModule,
    BootstrapModalModule,
    GrowlModule,
    LoadingModule.forRoot({
      animationType: ANIMATION_TYPES.threeBounce,
        backdropBackgroundColour: 'rgba(0,0,0,0.1)', 
        backdropBorderRadius: '0px',
        primaryColour: 'red', 
        secondaryColour: 'green', 
        tertiaryColour: 'blue'
    }) 
    
  ],
  providers: [ 
     { provide: ErrorHandler, useClass: AppErrorHandler},
     MessageService
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
