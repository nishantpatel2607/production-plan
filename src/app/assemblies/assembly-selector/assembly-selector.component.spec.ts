import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssemblySelectorComponent } from './assembly-selector.component';

describe('AssemblySelectorComponent', () => {
  let component: AssemblySelectorComponent;
  let fixture: ComponentFixture<AssemblySelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssemblySelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssemblySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
