import { MachineModelService } from '../../core/services/machineModel.service';
import { MachineCategoryService } from '../../core/services/machineCategory.service';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IMachineCategory } from '../../model/machineCategory';
import { IMachineModel } from '../../model/machineModel';
import { PagerService } from '../../core/services/pager.service';

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
    private machineCategoryService: MachineCategoryService) { }
    //private machineModelService: MachineModelService) { }

  ngOnInit() {
    this.getMachineCategories();
  }

  getMachineCategories() {
    this.machineCategoryService.getMachineCategories()
      .subscribe(categoriesData => {
        this.categories = categoriesData;
        this.categoryFilteredItems = categoriesData;

        this.setCategoriesPage(1);
      },
      error => this.errorMessage = <any>error);
  }

  setCategoriesPage(page: number) {
    if (this.categoryFilteredItems.length > 0 && this.categoryPager.totalPages == 0) { this.categoryPager.totalPages = 1; }
    if (page < 1 || page > this.categoryPager.totalPages) {
      return;
    }
    // get pager object from service
    this.categoryPager = this.pagerService.getPager(this.categoryFilteredItems.length, page, this.pagesize);
    // get current page of items
    this.categoryPagedItems = this.categoryFilteredItems.slice(this.categoryPager.startIndex, this.categoryPager.endIndex + 1);
  }

  // setModelsPage(page: number) {
  //   if (this.modelFilteredItems.length > 0 && this.modelPager.totalPages == 0) { this.modelPager.totalPages = 1; }
  //   if (page < 1 || page > this.modelPager.totalPages) {
  //     return;
  //   }
  //   // get pager object from service
  //   this.modelPager = this.pagerService.getPager(this.modelFilteredItems.length, page, this.pagesize);
  //   // get current page of items
  //   this.modelPagedItems = this.modelFilteredItems.slice(this.modelPager.startIndex, this.modelPager.endIndex + 1);
  // }

  // getModels(category: IMachineCategory) {
  //   this.clearModelPanel();
  //   this.categoryName = category.categoryName;
  //   this.selectedCategory = category;
  //   this.machineModelService.getMachineModelsByCategory(category.id)
  //     .subscribe(modelData => {
  //       this.models = modelData;
  //       this.modelFilteredItems = modelData;
  //       //console.log(this.modelFilteredItems); 
  //       this.setModelsPage(1);
  //     },
  //     error => this.errorMessage = <any>error);
  // }

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
    this.setCategoriesPage(1);
  }

  // filterModelRecords(value) {
  //   this.modelListFilter = value;
  //   var valueToSearch = this.modelListFilter.toUpperCase().trim();
  //   this.modelFilteredItems = [];
  //   if (this.modelListFilter != "") {
  //     this.models.forEach(model => {
  //       if (model.modelName.toUpperCase().indexOf(valueToSearch) >= 0) {
  //         this.modelFilteredItems.push(model);
  //       }
  //     });
  //   } else {
  //     this.modelFilteredItems = this.models; 
  //   }
  //   this.setModelsPage(1);
  // }

  // clearModelPanel() {
  //   this.modelListFilter = "";
  //   this.modelName = "";
  //   this.selectedModel = { id: 0, categoryId: 0, modelName: "" };
  // }

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
        .find(c=>c.categoryName.toUpperCase().trim() == categoryVal.toUpperCase().trim())){
          //ToDo: show message category already exist 
          return;
      }
      //new category
      this.newCategory = {
        id: -1,
        categoryName: categoryVal
      }
      this.machineCategoryService.createMachineCategory(this.newCategory)
      //ToDo:  remove following code and call getMachineCategories
      this.categories.push(this.newCategory);

    }
    else {
      //update category
      this.selectedCategory.categoryName = categoryVal;

      this.machineCategoryService.updateMachineCategory(this.selectedCategory);

    }
    this.clearCategoryPanel();
    this.setCategoriesPage(1);
  }

  deleteCategory(category: IMachineCategory) {

    var index = this.categories.findIndex(c => c.id === category.id);
    if (index >= 0) {
      this.categories.splice(index, 1);
      this.machineCategoryService.deleteMachineCategory(category.id);
      this.setCategoriesPage(1);
    }
  }


  // addOrUpdateModel() {
  //   if (this.modelName.trim() === "") return;
  //   var modelVal = this.modelName.trim();
  //   if (this.selectedModel.id === 0) {
  //     //check if model exists
  //     if (this.models
  //       .find(m=>m.modelName.toUpperCase().trim() == modelVal.toUpperCase().trim())){
  //         //ToDo: Show message Model already exists
  //         return;
  //       }
  //     //new model
  //     this.newModel = {
  //       id: -1,
  //       categoryId: this.selectedCategory.id,
  //       modelName: modelVal
  //     }
  //     this.machineModelService.createMachineModel(this.newModel);
  //     //ToDo: remove following code and call getModels
  //     this.models.push(this.newModel);
  //   }
  //   else {
  //     //update model
  //     this.selectedModel.modelName = modelVal;
  //     this.machineModelService.updateMachineModel(this.selectedModel);
  //   }
  //   this.clearModelPanel();
  //   this.setModelsPage(1);
  // }

  // deleteModel(model: IMachineModel) {
  //   var index = this.models.findIndex(m => m.id === model.id);
  //   if (index >= 0) {
  //     this.models.splice(index, 1);
  //     this.machineModelService.deleteMachineModel(model.id);
  //     this.setModelsPage(1);
  //   }
  // }

  // setSelectedModel(model: IMachineModel) {
  //   this.selectedModel = model;
  //   this.modelName = model.modelName;
  // }
}
