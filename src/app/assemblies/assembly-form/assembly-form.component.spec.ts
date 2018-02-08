import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssemblyFormComponent } from './assembly-form.component';

describe('AssemblyFormComponent', () => {
  let component: AssemblyFormComponent;
  let fixture: ComponentFixture<AssemblyFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssemblyFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssemblyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
