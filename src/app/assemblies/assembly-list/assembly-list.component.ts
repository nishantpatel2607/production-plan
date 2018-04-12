import { Component, OnInit } from '@angular/core';
import { AssemblyService } from '../../core/services/assembly.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IAssembly } from '../../model/assembly';
import { PagerService } from '../../core/services/pager.service';
import { AppError } from '../../errorhandlers/app-error';
import { NotFoundError } from '../../errorhandlers/not-found-error';
import { BadRequestError } from '../../errorhandlers/bad-request-error';
import { MessageType, MessageBoxComponent } from '../../shared/message-box/message-box.component';
import { DialogService } from 'ng2-bootstrap-modal';


@Component({
  selector: 'assembly-list',
  templateUrl: './assembly-list.component.html',
  styleUrls: ['./assembly-list.component.css']
})
export class AssemblyListComponent implements OnInit {

  assemblies: IAssembly[];
  errorMessage: string;
  listFilter: string = ""; 
  loading: boolean = false;
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
    private pagerService: PagerService,
    private dialogService: DialogService) { }

  ngOnInit() {
    this.loading = true;
    this.assemblyService.getAssemblies()
    .subscribe(assemblyData =>{
      if (assemblyData.Success){
      this.assemblies = assemblyData.data;
      this.filteredItems = this.assemblies;
      this.checkedItems = [];
        this.setPage(1);
        this.loading = false;
      }else {
        this.loading = false;
        this.showMessage(MessageType.Error, "Error", assemblyData.Message);
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

  newAssembly() {
    this.route.navigate(['assemblies/new']);
  }

  deleteAssembly(assembly: IAssembly) {
    let disposable = this.dialogService.addDialog(MessageBoxComponent, {
      title: "Delete?",
      messageType: MessageType.Question,
      message: "Do you want to delete selected assembly?"

    }).subscribe((isConfirmed) => {
      if (isConfirmed) {
        //console.log(isConfirmed);
        var index = this.assemblies.findIndex(c => c.id === assembly.id);
        if (index >= 0) {
          this.loading = true;
          this.assemblyService.deleteAssembly(assembly.id).subscribe(
            responseData => {
              if (responseData.Success) {
                //console.log(index);
                this.assemblies.splice(index, 1);
                this.filteredItems = this.assemblies;
                this.setPage(1);
                this.loading = false;

              } else {
                this.loading = false;
                this.showMessage(MessageType.Error, 'Error', responseData.Message);
                return;
              }
            }
          )
        }
      }
    });
  }

  selectedItem(assembly, event) {
    if (event.target.checked) {
      this.checkedItems.push(assembly);
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

  showMessage(messageType: MessageType, title: string, message: string) {

    let disposable = this.dialogService.addDialog(MessageBoxComponent, {
      title: title,
      messageType: messageType,
      message: message

    }).subscribe((isConfirmed) => { });
  }
}
