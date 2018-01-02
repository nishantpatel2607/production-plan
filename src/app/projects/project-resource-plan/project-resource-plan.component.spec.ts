import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectResourcePlanComponent } from './project-resource-plan.component';

describe('ProjectResourcePlanComponent', () => {
  let component: ProjectResourcePlanComponent;
  let fixture: ComponentFixture<ProjectResourcePlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectResourcePlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectResourcePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
