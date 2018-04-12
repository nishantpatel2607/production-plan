import { MachineCategoryService } from '../../core/services/machineCategory.service';
import { IMachineCategory } from '../../model/machineCategory';


import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';


import { IMachine } from '../../model/machine';
import { PagerService } from '../../core/services/pager.service';
import { MachineService } from '../../core/services/machine.service';
import { DialogService } from 'ng2-bootstrap-modal';
import { MessageType, MessageBoxComponent } from '../../shared/message-box/message-box.component';
import { AppError } from '../../errorhandlers/app-error';
import { NotFoundError } from '../../errorhandlers/not-found-error';
import { BadRequestError } from '../../errorhandlers/bad-request-error';
import { IVMMachine } from '../../model/viewModel/machineViewModels/vmMachine';

@Component({
  selector: 'machine-list',
  templateUrl: './machine-list.component.html',
  styleUrls: ['./machine-list.component.css']
})
export class MachineListComponent implements OnInit {
  pageTitle: string = "Machines";

  machines: IVMMachine[];
  errorMessage: string;
  listFilter: string = "";
  loading: boolean = false;
  pager: any = {};
  pagedItems: IVMMachine[];
  filteredItems: IVMMachine[];

  checkedItems: IVMMachine[];
  machineCategories: IMachineCategory[];

  //sorting
  key: string = 'machineName'; //set default
  reverse: boolean = false;
  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }
  constructor(private activeRoute: ActivatedRoute,
    private route: Router,
    private machineService: MachineService,
    private machineCategoryService: MachineCategoryService,
    private pagerService: PagerService,
    private dialogService: DialogService) { }

  ngOnInit() {

    this.getMachines();


  }

  getMachines() {
    this.loading = true;
    this.machineService.getMachines()
      .subscribe(machinesData => {
        if (machinesData.Success) {
          this.machines = machinesData.data;
          this.filteredItems = machinesData.data;
          this.checkedItems = [];
          this.setPage(1);
          this.loading = false;
        } else {
          this.loading = false;
          this.showMessage(MessageType.Error, "Error", machinesData.Message);
        }
      },
        (error: AppError) => {
          this.loading = false;
          if (error instanceof NotFoundError) {
            this.showMessage(MessageType.Error, "Error", "Requested data not found.");
          }
          else if (error instanceof BadRequestError) {
            this.showMessage(MessageType.Error, "Error", "Unable to process the request.");
          }
          else throw error;
        });
  }

  

  newMachine() {
    this.route.navigate(['machines/new']);
  }

  deleteMachine(machine: IVMMachine) {
    let disposable = this.dialogService.addDialog(MessageBoxComponent, {
      title: "Delete?",
      messageType: MessageType.Question,
      message: "Do you want to delete selected designation?"

    }).subscribe((isConfirmed) => {
      if (isConfirmed) {
        var index = this.machines.findIndex(c => c.id === machine.id);
        if (index >= 0) {
          this.loading = true;
          this.machineService.deleteMachine(machine.id)
            .subscribe(
              responseData => {
                if (responseData.Success) {
                  this.getMachines();
                  this.loading = false;
                } else {
                  this.loading = false;
                  this.showMessage(MessageType.Error, 'Error', responseData.Message);
                  return;
                }
              }
            )
          this.setPage(1);
        }
      }
    });
  }

  selectedItem(machine, event) {
    if (event.target.checked) {
      this.checkedItems.push(machine);
      //alert(machine.machineSrNo);
    }
  }
  setPage(page: number) {
    if (this.filteredItems.length > 0 && this.pager.totalPages == 0) { this.pager.totalPages = 1; }
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }

    // get pager object from service
    this.pager = this.pagerService.getPager(this.filteredItems.length, page);

    // get current page of items
    this.pagedItems = this.filteredItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    this.checkedItems = [];
  }

  filterRecords(value) {
    this.listFilter = value;
    var valueToSearch = this.listFilter.toUpperCase().trim();
    this.filteredItems = [];
    if (this.listFilter != "") {
      this.machines.forEach(machine => {
        if (machine.machineName.toUpperCase().indexOf(valueToSearch) >= 0
          || machine.modelNo.toUpperCase().indexOf(valueToSearch) >= 0
          || machine.categoryName.toUpperCase().indexOf(valueToSearch) >= 0
        ) {
          this.filteredItems.push(machine);
        }
      });
    } else {
      this.filteredItems = this.machines;
      //console.log(this.filteredItems);
    }
    console.log(this.filteredItems);
    this.setPage(1);

  }

  showMessage(messageType: MessageType, title: string, message: string) {

    let disposable = this.dialogService.addDialog(MessageBoxComponent, {
      title: title,
      messageType: messageType,
      message: message

    }).subscribe((isConfirmed) => { });
  }

}
