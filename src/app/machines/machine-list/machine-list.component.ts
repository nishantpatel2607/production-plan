import { MachineCategoryService } from '../../core/services/machineCategory.service';
import { IMachineCategory } from '../../model/machineCategory';


import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';


import { IMachine } from '../../model/machine';
import { PagerService } from '../../core/services/pager.service';
import { MachineService } from '../../core/services/machine.service';

@Component({
  selector: 'machine-list',
  templateUrl: './machine-list.component.html',
  styleUrls: ['./machine-list.component.css']
})
export class MachineListComponent implements OnInit {
  pageTitle: string = "Machines";

  machines: IMachine[];
  errorMessage: string;
  listFilter: string = "";

  pager: any = {};
  pagedItems: IMachine[];
  filteredItems: IMachine[];

  checkedItems: IMachine[];
  machineCategories: IMachineCategory[];


  constructor(private activeRoute: ActivatedRoute,
    private route: Router,
    private machineService: MachineService,
    private machineCategoryService: MachineCategoryService,
    private pagerService: PagerService) { }

  ngOnInit() {
    this.machineCategoryService.getMachineCategories()
    .subscribe(categories => {
      this.machineCategories = categories;
    },
    error => this.errorMessage = <any>error);

    this.machineService.getMachines()
      .subscribe(machinesData => {
        this.machines = machinesData;
        this.filteredItems = machinesData;
        this.checkedItems = [];
        this.setPage(1);
      },
      error => this.errorMessage = <any>error);
    
  }

  getCategoryName(Id:number): string{
    let categoryName:string = "";
    let category:IMachineCategory = this.machineCategories.find(c=>c.id === Id);
    if (category != undefined)
      categoryName = category.categoryName;
    return categoryName;
  }

  newMachine() {
    this.route.navigate(['machines/new']);
  }

  deleteMachine() {
    if (this.checkedItems.length > 0) {
      //alert(this.checkedItems.length);
      for (let machine of this.checkedItems) {
        let index = this.filteredItems.indexOf(machine);
        if (index !== -1)
          this.filteredItems.splice(index, 1);
        index = this.machines.indexOf(machine);
        if (index !== -1)
          this.checkedItems.splice(index, 1);
      }
      this.setPage(1);
    }
  }

  selectedItem(machine, event) {
    if (event.target.checked) {
      this.checkedItems.push(machine);
      //alert(machine.machineSrNo);
    }
  }
  setPage(page: number) {
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
          || this.getCategoryName(machine.categoryId).toUpperCase().indexOf(valueToSearch) >= 0
         ) {
          this.filteredItems.push(machine);
        }
      });
    } else {
      this.filteredItems = this.machines;
    }
    //console.log(this.filteredItems);
    this.setPage(1);

  }

}
