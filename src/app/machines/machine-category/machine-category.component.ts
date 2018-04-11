
import { MachineCategoryService } from '../../core/services/machineCategory.service';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IMachineCategory } from '../../model/machineCategory';

import { PagerService } from '../../core/services/pager.service';
import { DialogService } from 'ng2-bootstrap-modal';
import { MessageType, MessageBoxComponent } from '../../shared/message-box/message-box.component';
import { AppError } from '../../errorhandlers/app-error';
import { NotFoundError } from '../../errorhandlers/not-found-error';
import { BadRequestError } from '../../errorhandlers/bad-request-error';

@Component({
  selector: 'machine-category',
  templateUrl: './machine-category.component.html',
  styleUrls: ['./machine-category.component.css']
})
export class MachineCategoryComponent implements OnInit {

  errorMessage: string;
  private pagesize: number = 5;

  selectedCategory: IMachineCategory = {
    id: 0,
    categoryName: ""
  }
  newCategory: IMachineCategory; //used to store new category added
  categoryName: string = ""; //stores Category texbox value
  categoryListFilter: string = "";//stores Category filter texbox value
  categories: IMachineCategory[];
  categoryPager: any = {};
  categoryPagedItems: IMachineCategory[];
  categoryFilteredItems: IMachineCategory[];
  loading: boolean = false;
  // selectedModel: IMachineModel = {
  //   id: 0,
  //   categoryId: 0,
  //   modelName: ""
  // }
  // newModel: IMachineModel;
  // modelName: string = ""; //stores Model texbox value
  // modelListFilter: string = "";//stores Model filter texbox value
  // models: IMachineModel[];
  // modelPager: any = {};
  // modelPagedItems: IMachineModel[];
  // modelFilteredItems: IMachineModel[];

  constructor(private activeRoute: ActivatedRoute,
    private route: Router,
    private pagerService: PagerService,
    private machineCategoryService: MachineCategoryService,
    private dialogService: DialogService) { }
  //private machineModelService: MachineModelService) { }

  ngOnInit() {
    this.getMachineCategories();
  }

  getMachineCategories() {
    this.loading = true;
    this.machineCategoryService.getMachineCategories()
      .subscribe(categoriesData => {
        if (categoriesData.Success) {
          this.categories = categoriesData.data;
          this.categoryFilteredItems = categoriesData.data;
          this.setPage(1);
          this.loading = false;
        } else {
          this.loading = false;
          this.showMessage(MessageType.Error, "Error", categoriesData.Message);
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

  setSelectedCategory(category: IMachineCategory) {
    this.categoryName = category.categoryName;
    this.selectedCategory = category;
  }

  setPage(page: number) {
    if (this.categoryFilteredItems.length > 0 && this.categoryPager.totalPages == 0) { this.categoryPager.totalPages = 1; }
    if (page < 1 || page > this.categoryPager.totalPages) {
      return;
    }
    // get pager object from service
    this.categoryPager = this.pagerService.getPager(this.categoryFilteredItems.length, page, this.pagesize);
    // get current page of items
    this.categoryPagedItems = this.categoryFilteredItems.slice(this.categoryPager.startIndex, this.categoryPager.endIndex + 1);
  }



  filterCategoryRecords(value) {
    this.categoryListFilter = value;
    var valueToSearch = this.categoryListFilter.toUpperCase().trim();
    this.categoryFilteredItems = [];
    if (this.categoryListFilter != "") {
      this.categories.forEach(category => {
        if (category.categoryName.toUpperCase().indexOf(valueToSearch) >= 0) {
          this.categoryFilteredItems.push(category);
        }
      });
    } else {
      this.categoryFilteredItems = this.categories;
    }
    this.setPage(1);
  }



  clearCategoryPanel() {
    this.categoryName = "";
    this.selectedCategory = { id: 0, categoryName: "" };
    //this.clearModelPanel();
    this.newCategory = {
      id: -1,
      categoryName: ""
    }
    //this.getModels(this.newCategory);
  }

  addOrUpdateCategory() {
    if (this.categoryName.trim() === "") return;
    var categoryVal = this.categoryName.trim();
    if (this.selectedCategory.id === 0) {
      //Check if category already exist
      if (this.categories
        .find(c => c.categoryName.toUpperCase().trim() == categoryVal.toUpperCase().trim())) {
        //ToDo: show message category already exist 
        return;
      }
      //new category
      this.newCategory = {
        id: -1,
        categoryName: categoryVal
      }
      this.loading = true;
      this.machineCategoryService.createMachineCategory(this.newCategory)
        .subscribe(
          responseData => {
            if (responseData.Success) {

              /* this.newCategory.id = responseData.data[0];
              this.categories.push(this.newCategory);
              this.categoryFilteredItems = this.categories;
              this.clearCategoryPanel();
              this.setPage(1); */
              this.getMachineCategories();
              this.loading = false;
            } else {
              this.loading = false;
              this.showMessage(MessageType.Error, 'Error', 'The specified category already exist.');
              return;
            }
          }
        )
      //ToDo:  remove following code and call getMachineCategories
      //this.categories.push(this.newCategory);
    }
    else {
      //update category
      let updateCategory: IMachineCategory;
      updateCategory = {
        id: this.selectedCategory.id,
        categoryName: categoryVal
      }

      this.loading = true;
      this.machineCategoryService.updateMachineCategory(updateCategory)
        .subscribe(
          responseData => {

            if (responseData.Success) {
              //console.log(responseData);  
              //this.selectedCategory.categoryName = categoryVal;
              this.clearCategoryPanel();
              this.getMachineCategories();
              //this.setPage(1);
              this.loading = false;
            } else {
              this.loading = false;
              this.showMessage(MessageType.Error, 'Error', responseData.Message);
              return;
            }
          });
    }
    this.clearCategoryPanel();
    this.setPage(1);
  }

  deleteCategory(category: IMachineCategory) {
    var index = this.categories.findIndex(c => c.id === category.id);
    if (index >= 0) {
    let disposable = this.dialogService.addDialog(MessageBoxComponent, {
      title: "Delete?",
      messageType: MessageType.Question,
      message: "Do you want to delete selected category?"

    }).subscribe((isConfirmed) => {
      if (isConfirmed) {
          this.machineCategoryService.deleteMachineCategory(category.id)
            .subscribe(
              responseData => {
                if (responseData.Success) {
                  /* this.categories.splice(index, 1);
                  this.categoryFilteredItems = this.categories;
                  this.setPage(1); */
                  this.getMachineCategories();
                  this.loading = false;
                } else {
                  this.loading = false;
                  this.showMessage(MessageType.Error, 'Error', responseData.Message);
                  return;
                }
              })
          this.clearCategoryPanel();
          this.setPage(1);
        
      }
    })
  }
}

  showMessage(messageType: MessageType, title: string, message: string) {

    let disposable = this.dialogService.addDialog(MessageBoxComponent, {
      title: title,
      messageType: messageType,
      message: message

    }).subscribe((isConfirmed) => { });
  }
}
