import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkorderFormComponent } from './workorder-form.component';

describe('WorkorderFormComponent', () => {
  let component: WorkorderFormComponent;
  let fixture: ComponentFixture<WorkorderFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkorderFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkorderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
