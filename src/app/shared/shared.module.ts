import { HomeComponent } from './home/home.component';
import { NgModule }  from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
//import { Ng2SmartTableModule } from 'ng2-smart-table';



@NgModule({
  imports: [ CommonModule,
    RouterModule
  ],
  exports : [
    CommonModule,
    HomeComponent
  ],
  declarations: [ HomeComponent ],
})
export class SharedModule { }
