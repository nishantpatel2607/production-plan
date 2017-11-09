import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeService } from '../core/services/employee.service';

import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';


@NgModule({
    imports: [
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule.forChild([
            { path: 'employees', component: EmployeeListComponent},
            { path: 'employees/new', component: EmployeeFormComponent}
        ])
    ],
    declarations:[
        EmployeeFormComponent,
        EmployeeListComponent
       
    ],
    providers: [
        EmployeeService
    ]
})
export class EmployeesModule{}