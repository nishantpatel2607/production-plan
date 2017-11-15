import { MachineModelService } from '../../core/services/machineModel.service';
import { MachineCategoryService } from '../../core/services/machineCategory.service';



import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IMachineCategory } from '../../model/machineCategory';
import { IMachineModel } from '../../model/machineModel';
import { PagerService } from '../../core/services/pager.service';

@Component({
  selector: 'app-machine-category',
  templateUrl: './machine-category.component.html',
  styleUrls: ['./machine-category.component.css']
})
export class MachineCategoryComponent implements OnInit {

  errorMessage: string;

  categoryListFilter: string = "";
  categories:IMachineCategory[];
  categoryPager: any = {};
  categoryPagedItems: IMachineCategory[];
  categoryFilteredItems: IMachineCategory[];

  modelListFilter: string = "";
  models:IMachineModel[];
  modelPager: any = {};
  modelPagedItems: IMachineModel[];
  modelFilteredItems: IMachineModel[];

  constructor(private activeRoute: ActivatedRoute,
    private route: Router,
    private pagerService: PagerService,
    private machineCategoryService: MachineCategoryService,
  private machineModelService: MachineModelService) { }

  ngOnInit() { 
    this.machineCategoryService.getMachineCategories()
    .subscribe(categoriesData => {
      this.categories = categoriesData;
      this.categoryFilteredItems = categoriesData;
      
      this.setCategoriesPage(1);
    },
    error => this.errorMessage = <any>error);
  }

  setCategoriesPage(page: number) {
    if (page < 1 || page > this.categoryPager.totalPages) {
      return;
    }

    // get pager object from service
    this.categoryPager = this.pagerService.getPager(this.categoryFilteredItems.length, page);

    // get current page of items
    this.categoryPagedItems = this.categoryFilteredItems.slice(this.categoryPager.startIndex, this.categoryPager.endIndex + 1);
  }

  setModelsPage(page: number) {
    if (page < 1 || page > this.modelPager.totalPages) {
      return;
    }

    // get pager object from service
    this.modelPager = this.pagerService.getPager(this.modelFilteredItems.length, page);

    // get current page of items
    this.modelPagedItems = this.modelFilteredItems.slice(this.modelPager.startIndex, this.modelPager.endIndex + 1);
  }

}
