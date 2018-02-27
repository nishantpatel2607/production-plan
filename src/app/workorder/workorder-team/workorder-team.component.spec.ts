import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkorderTeamComponent } from './workorder-team.component';

describe('WorkorderTeamComponent', () => {
  let component: WorkorderTeamComponent;
  let fixture: ComponentFixture<WorkorderTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkorderTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkorderTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
