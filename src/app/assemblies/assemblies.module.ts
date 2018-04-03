import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssemblyListComponent } from './assembly-list/assembly-list.component';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { AssemblyService } from '../core/services/assembly.service';
import { AssemblySelectorComponent } from './assembly-selector/assembly-selector.component';
import { AssemblyFormComponent } from './assembly-form/assembly-form.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';
 
 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    Ng2OrderModule,
    AngularMultiSelectModule,
    RouterModule.forChild([
      { path: 'assemblies', component: AssemblyListComponent},
      { path: 'assemblies/new', component: AssemblyFormComponent},
      { path: 'assembly/:id', component: AssemblyFormComponent}
  ]),
  LoadingModule.forRoot({
    animationType: ANIMATION_TYPES.threeBounce,
      backdropBackgroundColour: 'rgba(0,0,0,0.1)', 
      backdropBorderRadius: '0px',
      primaryColour: 'red', 
      secondaryColour: 'green', 
      tertiaryColour: 'blue'
  }) 
  ],
  declarations: [AssemblyListComponent, AssemblySelectorComponent, AssemblyFormComponent],
  providers:[AssemblyService],
  exports: [AssemblySelectorComponent]
})
export class AssembliesModule { }
