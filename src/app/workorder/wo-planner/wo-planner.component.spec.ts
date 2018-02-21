import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WoPlannerComponent } from './wo-planner.component';

describe('WoPlannerComponent', () => {
  let component: WoPlannerComponent;
  let fixture: ComponentFixture<WoPlannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WoPlannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WoPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
