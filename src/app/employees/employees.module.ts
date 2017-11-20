import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeService } from '../core/services/employee.service';

import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { DesignationListComponent } from './designation-list/designation-list.component';
import { DesignationService } from '../core/services/designation.service';


@NgModule({
    imports: [
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule.forChild([
            {path: 'designations',component:DesignationListComponent},
            { path: 'employees', component: EmployeeListComponent},
            { path: 'employees/new', component: EmployeeFormComponent}
        ])
    ],
    declarations:[
        EmployeeFormComponent,
        EmployeeListComponent,
        DesignationListComponent
       
    ],
    providers: [
        EmployeeService,
        DesignationService
    ]
})
export class EmployeesModule{}