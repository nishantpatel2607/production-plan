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
  newTitle: IDesignation; //used to store new designation added
  title: string = ""; //stores title texbox value
  titleListFilter: string = "";//stores title filter texbox value
  titles: IDesignation[];
  titlePager: any = {};
  titlePagedItems: IDesignation[];
  titleFilteredItems: IDesignation[];

  constructor(private activeRoute: ActivatedRoute,
    private route: Router,
    private pagerService: PagerService,
    private designationService: DesignationService,
    private dialogService: DialogService) { }

  ngOnInit() {
    this.getDesignations();
  }

  getDesignations() {
    this.designationService.getDesignations()
      .subscribe(designationData => {
        if (designationData.Success) {
          this.titles = designationData.data;
          this.titleFilteredItems = designationData.data;
          this.setTitlesPage(1);
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
    //console.log(this.title);
    if (this.title.trim() === "") return;
    var titleVal = this.title.trim();
    if (this.selectedDesignation.id === 0) {
      //Check if designation already exist
      if (this.titles
        .find(c => c.title.toUpperCase().trim() == titleVal.toUpperCase().trim())) {
        //ToDo: show message designation already exist 
          this.showMessage(MessageType.Information,'Information','The specified designation already exist.');
        return;
      }
      //new title
      this.newTitle = {
        id: -1,
        title: titleVal

      }
      this.designationService.createDesignation(this.newTitle).subscribe(
        responseData => {
          if (responseData.Success){
            this.newTitle.id = responseData.data[0];
            this.titles.push(this.newTitle);
            console.log(this.newTitle);
          } else {
            this.showMessage(MessageType.Error,'Error','The specified designation already exist.');
            return;
          }
        }
      )
    }
    else {
      //update category
      this.selectedDesignation.title = titleVal;

      this.designationService.updateDesignation(this.selectedDesignation);

    }
    this.clearTitlePanel();
    this.setTitlesPage(1);
  }

  deleteTitle(designation: IDesignation) {
    //console.log(designation);
    var index = this.titles.findIndex(c => c.id === designation.id);
    if (index >= 0) {
      this.titles.splice(index, 1);
      this.designationService.deleteDesignation(designation.id);
      this.setTitlesPage(1);
    }
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

    }).subscribe((isConfirmed) => { });
  }
}
