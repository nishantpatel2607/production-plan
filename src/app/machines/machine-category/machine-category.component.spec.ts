import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineCategoryComponent } from './machine-category.component';

describe('MachineCategoryComponent', () => {
  let component: MachineCategoryComponent;
  let fixture: ComponentFixture<MachineCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
