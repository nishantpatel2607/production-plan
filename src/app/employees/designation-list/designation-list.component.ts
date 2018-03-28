import { DesignationService } from '../../core/services/designation.service';
import { PagerService } from '../../core/services/pager.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { IDesignation } from '../../model/designation';
import { MessageType, MessageBoxComponent } from '../../shared/message-box/message-box.component';
import { DialogService } from 'ng2-bootstrap-modal';
import { AppError } from '../../errorhandlers/app-error';
import { NotFoundError } from '../../errorhandlers/not-found-error';
import { BadRequestError } from '../../errorhandlers/bad-request-error';

@Component({
  selector: 'designation-list',
  templateUrl: './designation-list.component.html',
  styleUrls: ['./designation-list.component.css']
})
export class DesignationListComponent implements OnInit {

  errorMessage: string;
  private pagesize: number = 5;

  selectedDesignation: IDesignation = {
    id: 0,
    title: ""
  }

  title: string = ""; //stores title texbox value
  titleListFilter: string = "";//stores title filter texbox value
  titles: IDesignation[];
  titlePager: any = {};
  titlePagedItems: IDesignation[];
  titleFilteredItems: IDesignation[];
  messageConfirm:boolean = false;
  loading: boolean = false;

  constructor(private activeRoute: ActivatedRoute,
    private route: Router,
    private pagerService: PagerService,
    private designationService: DesignationService,
    private dialogService: DialogService) { }

  ngOnInit() {
    this.getDesignations();
  }

  getDesignations() {
    this.loading = true;
    this.designationService.getDesignations()
      .subscribe(designationData => {
        if (designationData.Success) {
          this.titles = designationData.data;
          this.titleFilteredItems = designationData.data;
          this.setTitlesPage(1);
          this.loading = false;
        } else {
          this.loading = false;
          this.showMessage(MessageType.Error, "Error", designationData.Message);
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
        })
  }

  setTitlesPage(page: number) {
    if (this.titleFilteredItems.length > 0 && this.titlePager.totalPages == 0) { this.titlePager.totalPages = 1; }
    if (page < 1 || page > this.titlePager.totalPages) {
      return;
    }
    // get pager object from service
    this.titlePager = this.pagerService.getPager(this.titleFilteredItems.length, page, this.pagesize);
    // get current page of items
    this.titlePagedItems = this.titleFilteredItems.slice(this.titlePager.startIndex, this.titlePager.endIndex + 1);
  }

  filterTitleRecords(value) {
    this.titleListFilter = value;
    var valueToSearch = this.titleListFilter.toUpperCase().trim();
    this.titleFilteredItems = [];
    if (this.titleListFilter != "") {
      this.titles.forEach(title => {
        if (title.title.toUpperCase().indexOf(valueToSearch) >= 0) {
          this.titleFilteredItems.push(title);
        }
      });
    } else {
      this.titleFilteredItems = this.titles;
    }
    this.setTitlesPage(1);
  }

  clearTitlePanel() {
    this.title = "";
    this.selectedDesignation = { id: 0, title: "" };
  }

  addOrUpdateTitle() {

    if (this.title.trim() === "") return;
    var titleVal = this.title.trim();
    if (this.selectedDesignation.id === 0) {
      //Check if designation already exist
      let titleFound: IDesignation = null;
      titleFound = this.titles.find(c => c.title.toUpperCase().trim() == titleVal.toUpperCase().trim());
      console.log(titleFound);
      if (titleFound !== undefined) {
        this.showMessage(MessageType.Information, 'Information', 'The specified designation already exist.');
        return;
      }
      let newTitle: IDesignation; //used to store new designation added
      //new title
      newTitle = {
        id: -1,
        title: titleVal

      }
      this.loading = true;
      this.designationService.createDesignation(newTitle).subscribe(
        responseData => {
          if (responseData.Success) {

            newTitle.id = responseData.data[0];
            this.titles.push(newTitle);
            this.clearTitlePanel();
            this.setTitlesPage(1);
            //console.log(this.newTitle);
            this.loading = false;
          } else {
            this.loading = false;
            this.showMessage(MessageType.Error, 'Error', 'The specified designation already exist.');
            return;
          }
        }
      )
    } else {
      //update category
      let updateTitle: IDesignation; //used to update designation
      //new title
      updateTitle = {
        id: this.selectedDesignation.id,
        title: titleVal

      }
      this.loading = true;
      this.designationService.updateDesignation(updateTitle).subscribe(
        responseData => {
          
          if (responseData.Success == true) {
            console.log(responseData);  
            this.selectedDesignation.title = titleVal;
            this.clearTitlePanel();
            this.setTitlesPage(1);
            this.loading = false;
          } else {
            this.loading = false;
            this.showMessage(MessageType.Error, 'Error', responseData.Message);
            return;
          }
        });

    }
   
  }

  deleteTitle(designation: IDesignation) {
    //console.log(designation);
    
    let disposable = this.dialogService.addDialog(MessageBoxComponent, {
      title: "Delete?",
      messageType: MessageType.Question,
      message: "Do you want to delete selected designation?"

    }).subscribe((isConfirmed) => {if (isConfirmed){
      //console.log(isConfirmed);
      var index = this.titles.findIndex(c => c.id === designation.id); 
      if (index >= 0) {
        this.loading = true;    
        this.designationService.deleteDesignation(designation.id).subscribe(
          responseData => {
            if (responseData.Success){
              this.titles.splice(index, 1);
              this.loading = false;
            }else {
              this.loading = false;
              this.showMessage(MessageType.Error, 'Error', responseData.Message);
              return;
            }
          }
        )
        this.clearTitlePanel();
        this.setTitlesPage(1);
      }
    }});
    
    
  }

  setSelectedTitle(designation: IDesignation) {
    this.title = designation.title;
    this.selectedDesignation = designation;
  }

  showMessage(messageType: MessageType, title: string, message: string) {

    let disposable = this.dialogService.addDialog(MessageBoxComponent, {
      title: title,
      messageType: messageType,
      message: message

    }).subscribe((isConfirmed) => { this.messageConfirm = isConfirmed;});
  }
}
