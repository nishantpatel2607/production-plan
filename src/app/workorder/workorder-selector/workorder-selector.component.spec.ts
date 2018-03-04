import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkorderSelectorComponent } from './workorder-selector.component';

describe('WorkorderSelectorComponent', () => {
  let component: WorkorderSelectorComponent;
  let fixture: ComponentFixture<WorkorderSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkorderSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkorderSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
