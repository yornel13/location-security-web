import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltreportComponent } from './filtreport.component';

describe('FiltreportComponent', () => {
  let component: FiltreportComponent;
  let fixture: ComponentFixture<FiltreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
