import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IVMAssembly } from '../../model/viewModel/assemblyViewModels/vmAssembly';
import { IVMAssemblyDesignation } from '../../model/viewModel/assemblyViewModels/vmAssemblyDesignation';
import { IVMSubAssembly } from '../../model/viewModel/assemblyViewModels/vmSubAssembly';
import { IDesignation } from '../../model/designation';
import { style } from '@angular/animations';
import { DesignationService } from '../../core/services/designation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AssemblyService } from '../../core/services/assembly.service';


interface ISelectionListItem{
  id:number,
  itemName:string
}

@Component({
  selector: 'app-assembly-form',
  templateUrl: './assembly-form.component.html',
  styleUrls: ['./assembly-form.component.css']
})
export class AssemblyFormComponent implements OnInit {


  form: FormGroup;
  private sub: Subscription;
  assembly: IVMAssembly = {
    "id": 0,
    "assemblyName": "",
    "assemblyDescription": "",
    "durationInMins": 0,
    "assemblyDesignations":[],
    "subAssemblies":[]
  }
  
  designationsList: ISelectionListItem[] = [];
  selectedDesignations: ISelectionListItem[] = [];
  dropdownSettings = {};
  errorMessage: string; 
  desigListFromServer:IDesignation[];
  
  constructor(private fb: FormBuilder,
    private designationService: DesignationService,
    private assemblyService: AssemblyService,
    private router: Router,
    private activateRoute: ActivatedRoute) {
    this.form = fb.group({
      assemblyName: ['', Validators.required],
      assemblyDescription: [],
      durationInMins: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      assemblyDesignations: [[]],
      subAssemblies: [[]]
    });
    
  }

  ngOnInit() {
    this.dropdownSettings = {
      text: "Select Designations",
      enableCheckAll: false,
      classes:"noBorder",
      showCheckbox: true
    };
    this.sub = this.activateRoute.params.subscribe(
      params => {
        let id = +params['id'];
        if (Number.isNaN(id) == false) {
          this.getAssembly(id);
        }
      });
    this.getAllDesignations();
  }

  addSubAssembly(asm) {
    //alert(assembly.assemblyName);
    //console.log(assembly.id);
    let subAssembly: IVMSubAssembly = {
      "assemblyId":this.assembly.id,
      "subAssemblyId":asm.id,
      "subAssemblyName":asm.assemblyName,
      "qty":1
    }
    let subAssemblyFound = this.assembly.subAssemblies.find(a => a.subAssemblyId == asm.id)
    
    if (subAssemblyFound === undefined ){
        this.assembly.subAssemblies.push(subAssembly);
    } else {
        subAssemblyFound.qty = subAssemblyFound.qty + 1;
    }
  }

  removeSubAssembly(asm){
    
    let index = this.assembly.subAssemblies.findIndex(a => a.subAssemblyId == asm.subAssemblyId);
    if (index >=0){
      this.assembly.subAssemblies.splice(index,1);
    }
  }

  getAssembly(id: number): void {
    this.assemblyService.getAssembly(id)
    .subscribe(a => {this.assembly = a; },
      error => this.errorMessage = <any>error,()=>{
        this.assembly.assemblyDesignations.forEach(desig =>{
          let designationItem:ISelectionListItem = {
            id : desig.designationId,
            itemName : desig.title
          }
          this.selectedDesignations.push(designationItem);
        })
      });
  }

  get assemblyName() { return this.form.get("assemblyName"); }
  get assemblyDescription() { return this.form.get("assemblyDescription"); }
  get durationInMins() { return this.form.get("durationInMins"); }
  get assemblydesignations(){return this.form.get('assemblydesignations') }

  saveForm(){
    this.selectedDesignations.forEach(desig => {
      let selDesig: IVMAssemblyDesignation = {
        assemblyId:this.assembly.id,
        designationId: desig.id,
        title: desig.itemName
      }
      this.assembly.assemblyDesignations.push(selDesig);
    });
    if (this.assembly.id > 0){
      this.assemblyService.updateAssembly(this.assembly);
    } else {this.assemblyService.createAssembly(this.assembly);}
    //console.log(this.assembly);
  }

  cancelForm(){
    this.router.navigate(['/assemblies']);
  }

  getAllDesignations(){
    this.designationService.getDesignations().subscribe(
      designationData => {
        this.desigListFromServer = designationData;
      },
      error => this.errorMessage = <any>error,
      ()=>{
        //console.log(this.designationsList);
        this.desigListFromServer.forEach(desig => {
          let designation:ISelectionListItem = {
            id: desig.id,
            itemName: desig.title
          }
          this.designationsList.push(designation);
        });
     }
    )
  }
}
