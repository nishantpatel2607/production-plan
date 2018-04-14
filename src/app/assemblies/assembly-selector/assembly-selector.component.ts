import { Component, OnInit, EventEmitter,Output, Input } from '@angular/core';
import { AssemblyService } from '../../core/services/assembly.service';
import { PagerService } from '../../core/services/pager.service';
import { IAssembly } from '../../model/assembly';
import { MessageType, MessageBoxComponent } from '../../shared/message-box/message-box.component';
import { DialogService } from 'ng2-bootstrap-modal';
import { AppError } from '../../errorhandlers/app-error';
import { NotFoundError } from '../../errorhandlers/not-found-error';
import { BadRequestError } from '../../errorhandlers/bad-request-error';
import { Global } from '../../core/services/global';

@Component({
  selector: 'assembly-selector',
  templateUrl: './assembly-selector.component.html',
  styleUrls: ['./assembly-selector.component.css']
})
export class AssemblySelectorComponent implements OnInit {
  assemblies: IAssembly[];
  errorMessage: string;
  listFilter: string = "";
  //loading: boolean = false;
  pager: any = {};
  pagedItems: IAssembly[];
  filteredItems: IAssembly[];
  @Input('DisableAssembly') disabledAssembly: string;

  //sorting
  key: string = 'assemblyName'; //set default
  reverse: boolean = false;
  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }

  @Output('ItemSelected') ItemSelected = new EventEmitter();

  constructor(private assemblyService: AssemblyService,
    private pagerService: PagerService,
    private dialogService: DialogService) { }

  ngOnInit() {
    this.loadAssemblies();
  }

  loadAssemblies(){
    this.assemblyService.getAssemblies()
    .subscribe(assemblyData => {
      if (assemblyData.Success){
        this.assemblies = assemblyData.data;
        this.filteredItems = this.assemblies;
        
          this.setPage(1);
          Global.setLoadingFlag(false);
        }else {
          Global.setLoadingFlag(false);
          this.showMessage(MessageType.Error, "Error", assemblyData.Message);
        }
    },
    (error: AppError) => {
      Global.setLoadingFlag(false);
      if (error instanceof NotFoundError) {
        this.showMessage(MessageType.Error, "Error", "Requested data not found.");
      }
      else if (error instanceof BadRequestError) {
        this.showMessage(MessageType.Error, "Error", "Unable to process the request.");
      }
      else throw error;
    });
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }

    // get pager object from service
    this.pager = this.pagerService.getPager(this.filteredItems.length, page);

    // get current page of items
    this.pagedItems = this.filteredItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
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

  selectAssembly(assembly : IAssembly){
    if (assembly.assemblyName !== this.disabledAssembly)
      this.ItemSelected.emit(assembly);
  }

  showMessage(messageType: MessageType, title: string, message: string) {

    let disposable = this.dialogService.addDialog(MessageBoxComponent, {
      title: title,
      messageType: messageType,
      message: message

    }).subscribe((isConfirmed) => { });
  }

  
}
