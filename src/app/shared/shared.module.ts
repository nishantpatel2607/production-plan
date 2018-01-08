
import { NgModule }  from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SummaryPipe } from './summary.pipe';
//import { Ng2SmartTableModule } from 'ng2-smart-table';


import { HomeComponent } from './home/home.component';


@NgModule({
  imports: [ CommonModule,
    RouterModule
   
  ],
  exports : [
    CommonModule,
    HomeComponent,
    SummaryPipe
 ],
  declarations: [ HomeComponent, SummaryPipe ]
})
export class SharedModule { }
