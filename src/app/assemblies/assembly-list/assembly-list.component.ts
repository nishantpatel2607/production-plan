import { Component, OnInit } from '@angular/core';
import { AssemblyService } from '../../core/services/assembly.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IAssembly } from '../../model/assembly';
import { PagerService } from '../../core/services/pager.service';


@Component({
  selector: 'assembly-list',
  templateUrl: './assembly-list.component.html',
  styleUrls: ['./assembly-list.component.css']
})
export class AssemblyListComponent implements OnInit {

  assemblies: IAssembly[];
  errorMessage: string;
  listFilter: string = ""; 

  pager: any = {};
  pagedItems: IAssembly[];
  filteredItems: IAssembly[];
  checkedItems: IAssembly[];

  //sorting
  key: string = 'assemblyName'; //set default
  reverse: boolean = false;
  sort(key){
    this.key = key;
    this.reverse = !this.reverse; 
  }

  constructor(private assemblyService: AssemblyService,
    private activeRoute: ActivatedRoute,
    private route: Router,
    private pagerService: PagerService) { }

  ngOnInit() {
    this.assemblyService.getAssemblies()
    .subscribe(assemblyData =>{
      this.assemblies = assemblyData;
      this.filteredItems = this.assemblies;
      this.checkedItems = [];
        this.setPage(1);
    },
    error => this.errorMessage = <any>error);
  }

  newAssembly() {
    this.route.navigate(['assemblies/new']);
  }

  deleteAssembly() {
    if (this.checkedItems.length > 0) {
      for (let assembly of this.checkedItems) {
        let index = this.filteredItems.indexOf(assembly);
        if (index !== -1)
          this.filteredItems.splice(index, 1);
        index = this.assemblies.indexOf(assembly);
        if (index !== -1)
          this.checkedItems.splice(index, 1);
      }
      this.setPage(1);
    }
  }

  selectedItem(assembly, event) {
    if (event.target.checked) {
      this.checkedItems.push(assembly);
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
      this.assemblies.forEach(assembly => {
        if (assembly.assemblyName.toUpperCase().indexOf(valueToSearch) >= 0
          
         ) {
          this.filteredItems.push(assembly);
        }
      });
    } else {
      this.filteredItems = this.assemblies;
    }
    //console.log(this.filteredItems);
    this.setPage(1);
  }
}
