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
import { MessageType, MessageBoxComponent } from '../../shared/message-box/message-box.component';
import { DialogService } from 'ng2-bootstrap-modal';
import { AppError } from '../../errorhandlers/app-error';
import { NotFoundError } from '../../errorhandlers/not-found-error';
import { BadRequestError } from '../../errorhandlers/bad-request-error';


interface ISelectionListItem {
  id: number,
  itemName: string
}

@Component({
  selector: 'app-assembly-form',
  templateUrl: './assembly-form.component.html',
  styleUrls: ['./assembly-form.component.css']
})
export class AssemblyFormComponent implements OnInit {


  form: FormGroup;
  private sub: Subscription;
  loading: boolean = false;
  assembly: IVMAssembly = {
    "id": 0,
    "assemblyName": "",
    "assemblyDescription": "",
    "duration": 0,
    "assemblyDesignations": [],
    "subAssemblies": []
  }

  designationsList: ISelectionListItem[] = [];
  selectedDesignations: ISelectionListItem[] = [];
  dropdownSettings = {};
  errorMessage: string;
  desigListFromServer: IDesignation[];

  constructor(private fb: FormBuilder,
    private designationService: DesignationService,
    private assemblyService: AssemblyService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private dialogService: DialogService) {
    this.form = fb.group({
      assemblyName: ['', Validators.required],
      assemblyDescription: [],
      durationInMins: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      assemblyDesignations: [[]],
      subAssemblies: [[]]
    });

  }

  ngOnInit() {
    let id = 0;
    this.dropdownSettings = {
      text: "Select Designations",
      enableCheckAll: false,
      classes: "noBorder",
      showCheckbox: true
    };
    this.sub = this.activateRoute.params.subscribe(
      params => {
        id = +params['id'];
        if (Number.isNaN(id) == false) {
          this.getAssembly(id);
        }
      });
      if (Number.isNaN(id)){
      this.getAllDesignations();
      }
    
  }

  addSubAssembly(asm) {
    //alert(assembly.assemblyName);
    //console.log(assembly.id);
    let subAssembly: IVMSubAssembly = {
      "assemblyId": this.assembly.id,
      "subAssemblyId": asm.id,
      "subAssemblyName": asm.assemblyName,
      "qty": 1
    }
    let subAssemblyFound = this.assembly.subAssemblies.find(a => a.subAssemblyId == asm.id)

    if (subAssemblyFound === undefined) {
      this.assembly.subAssemblies.push(subAssembly);
    } else {
      subAssemblyFound.qty = subAssemblyFound.qty + 1;
    }
  }

  removeSubAssembly(asm) {

    let index = this.assembly.subAssemblies.findIndex(a => a.subAssemblyId == asm.subAssemblyId);
    if (index >= 0) {
      this.assembly.subAssemblies.splice(index, 1);
    }
  }

  getAssembly(id: number): void {
    this.loading = true;
    this.assemblyService.getAssembly(id)
      .subscribe(responseData => {
        if (responseData.Success) {
          this.assembly = (<IVMAssembly>responseData.data[0]);
          //console.log(this.assembly);
          this.getAllDesignations();
          this.loading = false;
        }
        else {
          this.loading = false;
          this.showMessage(MessageType.Error, "Error", responseData.Message);
        }
      }),
      (error: AppError) => {
        this.loading = false;
        if (error instanceof NotFoundError) {
          this.showMessage(MessageType.Error, "Error", "Requested data not found.");
        }
        else if (error instanceof BadRequestError) {
          this.showMessage(MessageType.Error, "Error", "Unable to process the request.");
        }
        else throw error;
      }
  }

  get assemblyName() { return this.form.get("assemblyName"); }
  get assemblyDescription() { return this.form.get("assemblyDescription"); }
  get durationInMins() { return this.form.get("durationInMins"); }
  get assemblyDesignations() { return this.form.get('assemblyDesignations') }

  saveForm() {
    this.assembly.assemblyDesignations = [];
    this.selectedDesignations.forEach(desig => {
      let selDesig: IVMAssemblyDesignation = {
        assemblyId: this.assembly.id,
        designationId: desig.id,
        title: desig.itemName
      }
      this.assembly.assemblyDesignations.push(selDesig);
    });
    if (this.assembly.id > 0) {
      this.assemblyService.updateAssembly(this.assembly)
      .subscribe(revData => {
        if (revData.Success){
          this.loading = false;
        } else {
          this.loading = false;
          this.showMessage(MessageType.Error, "Error", revData.Message);
        }
      }),
      (error: AppError) => {
        this.loading = false;
        if (error instanceof NotFoundError) {
          this.showMessage(MessageType.Error, "Error", "Requested data not found.");
        }
        else if (error instanceof BadRequestError) {
          this.showMessage(MessageType.Error, "Error", "Unable to process the request.");
        }
        else throw error;
      } 
    } else { 
      this.loading = true;
      this.assemblyService.createAssembly(this.assembly)
      .subscribe(revData => {
        if (revData.Success){
          this.assembly.id = revData.data[0];
          this.loading = false;
        } else {
          this.loading = false;
          this.showMessage(MessageType.Error, "Error", revData.Message);
        }
      }),
      (error: AppError) => {
        this.loading = false;
        if (error instanceof NotFoundError) {
          this.showMessage(MessageType.Error, "Error", "Requested data not found.");
        }
        else if (error instanceof BadRequestError) {
          this.showMessage(MessageType.Error, "Error", "Unable to process the request.");
        }
        else throw error;
      } 
    }
    
  }

  cancelForm() {
    this.router.navigate(['/assemblies']);
  }

  getAllDesignations() {
    this.designationService.getDesignations().subscribe(
      designationData => {
        if (designationData.Success) {
          this.desigListFromServer = designationData.data;

        } else {
          this.showMessage(MessageType.Error, "Error", designationData.Message);
        }
      },
      (error: AppError) => {
        //this.loading = false;
        if (error instanceof NotFoundError) {
          this.showMessage(MessageType.Error, "Error", "Requested data not found.");
        }
        else if (error instanceof BadRequestError) {
          this.showMessage(MessageType.Error, "Error", "Unable to process the request.");
        }
        else throw error;
      },
      () => {
        //console.log(this.designationsList);
        this.designationsList = [];
        this.desigListFromServer.forEach(desig => {
          let designation: ISelectionListItem = {
            id: desig.id,
            itemName: desig.title
          }
          this.designationsList.push(designation);
        });
        if (this.assembly.id > 0) {
          this.selectedDesignations = [];
          this.assembly.assemblyDesignations.forEach(desig => {
            let designationItem: ISelectionListItem = {
              id: desig.designationId,
              itemName: desig.title
            }
            this.selectedDesignations.push(designationItem);
          })

        }
      }
    )
  }

  showMessage(messageType: MessageType, title: string, message: string) {

    let disposable = this.dialogService.addDialog(MessageBoxComponent, {
      title: title,
      messageType: messageType,
      message: message

    }).subscribe((isConfirmed) => { });
  }
}
