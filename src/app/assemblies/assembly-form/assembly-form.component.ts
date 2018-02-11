import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IVMAssembly } from '../../model/viewModel/vmAssembly';
import { IDesignation } from '../../model/designation';
import { ISubAssembly } from '../../model/subAssembly';
import { IAssemblyDesignation } from '../../model/assemblyDesignations';
import { style } from '@angular/animations';
import { DesignationService } from '../../core/services/designation.service';

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
    private designationService: DesignationService,) {
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
    this.getAllDesignations();
  }

  addSubAssembly(asm) {
    //alert(assembly.assemblyName);
    //console.log(assembly.id);
    let subAssembly: ISubAssembly = {
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

  get assemblyName() { return this.form.get("assemblyName"); }
  get assemblyDescription() { return this.form.get("assemblyDescription"); }
  get durationInMins() { return this.form.get("durationInMins"); }
  get assemblydesignations(){return this.form.get('assemblydesignations') }

  saveForm(){
    this.selectedDesignations.forEach(desig => {
      let selDesig: IAssemblyDesignation = {
        assemblyId:this.assembly.id,
        designationId: desig.id
      }
      this.assembly.assemblyDesignations.push(selDesig);
    });
    console.log(this.assembly);
  }

  cancelForm(){}

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
