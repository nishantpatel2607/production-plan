import { OrderService } from '../core/services/order.service';
import { ProjectListComponent } from './project-list/project-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { PagerService } from '../core/services/pager.service';
import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { ProjectsFormComponent } from './projects-form/projects-form.component';
import { MyDatePickerModule } from 'angular4-datepicker/src/my-date-picker/my-date-picker.module';
import { TooltipDirective } from 'ng2-tooltip-directive/components';

@NgModule({ 
    imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        Ng2OrderModule,
       
        MyDatePickerModule,
        RouterModule.forChild([
            { path: 'projects', component: ProjectListComponent},
            { path: 'projects/new', component: ProjectsFormComponent},
            { path: 'project/:id',component: ProjectsFormComponent},
            
        ])
    ],
    declarations:[
        ProjectListComponent,
        ProjectsFormComponent,
        TooltipDirective
        
    ],
    providers:[
        OrderService
    ]
}) 
export class ProjectsModule{}