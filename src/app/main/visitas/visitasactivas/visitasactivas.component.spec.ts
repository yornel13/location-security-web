import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitasactivasComponent } from './visitasactivas.component';

describe('VisitasactivasComponent', () => {
  let component: VisitasactivasComponent;
  let fixture: ComponentFixture<VisitasactivasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitasactivasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitasactivasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
