
import { NgModule }  from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
//import { Ng2SmartTableModule } from 'ng2-smart-table';


import { HomeComponent } from './home/home.component';


@NgModule({
  imports: [ CommonModule,
    RouterModule
   
  ],
  exports : [
    CommonModule,
    HomeComponent
    
  ],
  declarations: [ HomeComponent ]
})
export class SharedModule { }
