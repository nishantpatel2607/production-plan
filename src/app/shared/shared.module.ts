
import { NgModule }  from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SummaryPipe } from './summary.pipe';
import {TableModule} from 'primeng/table';
import {CalendarModule} from 'primeng/calendar';
//import { Ng2SmartTableModule } from 'ng2-smart-table';
import {CheckboxModule} from 'primeng/checkbox';
import {DropdownModule} from 'primeng/dropdown';
import { HomeComponent } from './home/home.component';
import {KeyFilterModule} from 'primeng/keyfilter';
import {InputTextModule} from 'primeng/inputtext';
import {ScheduleModule} from 'primeng/schedule';
import {DialogModule} from 'primeng/dialog';

@NgModule({
  imports: [ CommonModule,
    RouterModule,
    TableModule,
    CalendarModule,
    DropdownModule,
    CheckboxModule,
    KeyFilterModule,
    InputTextModule,
    ScheduleModule,
    DialogModule
 
   
  ],
  exports : [
    CommonModule, 
    HomeComponent,  
    TableModule,
    CalendarModule, 
    CheckboxModule,
    DropdownModule, 
    SummaryPipe,  
    KeyFilterModule,
    InputTextModule,
    ScheduleModule,
    DialogModule
 ],
  declarations: [ HomeComponent, SummaryPipe ]
})
export class SharedModule { }
