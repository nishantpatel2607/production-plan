

import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { MachineFilterPipe } from './machine-list/machine-filter.pipe';
import { PagerService } from '../core/services/pager.service';
import { MachineService } from '../core/services/machine.service';
import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MachineListComponent } from './machine-list/machine-list.component';
import { MachineFormComponent } from './machine-form/machine-form.component';
import { MachineCategoryComponent } from './machine-category/machine-category.component';
import { MachineCategoryService } from '../core/services/machineCategory.service';

import { Ng2OrderModule } from 'ng2-order-pipe';
import { AssembliesModule } from '../assemblies/assemblies.module';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { GrowlModule } from 'primeng/growl';
//import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';
@NgModule({  
    imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        Ng2OrderModule,
        AssembliesModule,
        AngularMultiSelectModule,
        GrowlModule,
        RouterModule.forChild([
            { path: 'machines', component: MachineListComponent},
            { path: 'machines/new', component: MachineFormComponent},
            { path: 'machine/:id',component: MachineFormComponent},
            { path: 'machinecat',component: MachineCategoryComponent}
        ])
       /*  LoadingModule.forRoot({
            animationType: ANIMATION_TYPES.threeBounce,
              backdropBackgroundColour: 'rgba(0,0,0,0.1)', 
              backdropBorderRadius: '0px',
              primaryColour: 'red', 
              secondaryColour: 'green', 
              tertiaryColour: 'blue'
          })   */
    ],
    declarations:[
        MachineFormComponent,
        MachineListComponent,
        MachineFilterPipe,
        MachineCategoryComponent
        
    ],
    providers:[
        MachineService,
        PagerService,
        MachineCategoryService
      
    ]
}) 
export class MachinesModule{}